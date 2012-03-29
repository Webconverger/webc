#!/bin/bash
. /etc/webc/webc.conf

cmdline_has debug && set -x

sub_literal() {
  awk -v str="$1" -v rep="$2" '
  BEGIN {
    len = length(str);
  }

  (i = index($0, str)) {
    $0 = substr($0, 1, i-1) rep substr($0, i + len);
  }

  1'
}

fix_chrome()
{
link="/usr/lib/iceweasel/extensions/webconverger"

# Make sure we use a default closeicon, because the default does not have X on the last tab
cmdline | grep -qs "closeicon=" || /etc/webc/iwcloseconfig.sh activefix

for x in $( cmdline ); do
	case $x in

	debug)
		echo "webc ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers
		;;

	chrome=*)
		chrome=${x#chrome=}
		dir="/etc/webc/iceweasel/extensions/${chrome}"
		test -d $dir && {
			test -e $link && rm -f $link
			logs "switching chrome to ${chrome}"
			ln -s $dir $link
		}
		;;

	locale=*)
		locale=${x#locale=}
		for i in /etc/webc/iceweasel/extensions/webc*/defaults/preferences/prefs.js
		do
			echo "user_pref(\"general.useragent.locale\", \"${locale}\");" >> $i
			echo "user_pref(\"intl.accept_languages\", \"${locale}, en\");" >> $i
		done
		;;

	closeicon=*) # For toggling the close icons in iceweasel (bit OTT tbh)
		/etc/webc/iwcloseconfig.sh ${x#closeicon=}
		;;

	homepage=*)
		homepage="$( echo ${x#homepage=} | sed 's,%20, ,g' )"
		prefs="/etc/iceweasel/profile/prefs.js"
		if test -e $prefs
		then
			echo "user_pref(\"browser.startup.homepage\", \"$(echo $homepage | awk '{print $1}')\");" >> $prefs
		fi
		;;

	esac
done

stamp=$( git show $webc_version | grep '^Date')

test -f ${link}/content/about.xhtml.bak || cp ${link}/content/about.xhtml ${link}/content/about.xhtml.bak
cat ${link}/content/about.xhtml.bak |
sub_literal 'OS not running' "${webc_version} ${stamp}" |
sub_literal 'var aboutwebc = "";' "var aboutwebc = \"$(echo ${install_qa_url} | sed 's,&,&amp;,g')\";" > ${link}/content/about.xhtml
}

update_cmdline() {
	SECONDS=0
	while :
	do
		wget -q -O /etc/webc/cmdline.tmp "$config_url" && break
		test $? = 8 && break # 404
		test $SECONDS -gt 30 && break
		sleep 1
	done
	
	# A configuration file always has a homepage
	test -s /etc/webc/cmdline.tmp && grep -qs homepage /etc/webc/cmdline.tmp && mv /etc/webc/cmdline.tmp /etc/webc/cmdline
}

test -e $live_config_pipe && rm -f $live_config_pipe
mknod $live_config_pipe p
chmod 666 $live_config_pipe

fix_chrome
update_cmdline
fix_chrome

while true; do
	cat $live_config_pipe | while read flag; do
		update_cmdline
		fix_chrome
	done
done

