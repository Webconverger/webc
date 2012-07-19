#!/bin/bash
source /etc/webc/webc.conf

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

# If printing support is installed, delete lines that prevent print dialog
dpkg -s cups 2>/dev/null >/dev/null && sed -i '/print/d' /etc/iceweasel/pref/iceweasel.js

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

	cron=*)
		cron="$( echo ${x#cron=} | sed 's,%20, ,g' )"		
		cat <<EOC > /etc/cron.d/live-config
SHELL=/bin/bash
PATH=/sbin:/bin:/usr/sbin:/usr/bin
$cron
EOC
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

# Make sure /home has noexec and nodev, for extra security.
# First, just try to remount, in case /home is already a separate filesystem
# (when using persistence, for example).
mount -o remount,noexec,nodev /home || (
	# Turn /home into a tmpfs. We use a trick here: after the mount, this
	# subshell will still have the old /home as its current directory, so
	# we can still read the files in the original /home. By passing -C to
	# the second tar invocation, it does a chdir, which causes it to end
	# up in the new filesystem. This enables us to easily copy the
	# existing files from /home into the new tmpfs.
	cd /home
	mount -o noexec,nodev -t tmpfs tmpfs /home
	tar -c . | tar -x -C /home
)

stamp=$( git show $webc_version | grep '^Date')

test -f ${link}/content/about.xhtml.bak || cp ${link}/content/about.xhtml ${link}/content/about.xhtml.bak
cat ${link}/content/about.xhtml.bak |
sub_literal 'OS not running' "${webc_version} ${stamp}" |
sub_literal 'var aboutwebc = "";' "var aboutwebc = \"$(echo ${install_qa_url} | sed 's,&,&amp;,g')\";" > ${link}/content/about.xhtml
}

update_cmdline() {
	SECONDS=0
	while true
	do
		wget --timeout=5 -t 1 -q -O /etc/webc/cmdline.tmp "$config_url" && break
		test $? = 8 && break # 404
		test $SECONDS -gt 15 && break
		sleep 1
	done
	
	# A configuration file always has a homepage
	grep -qs homepage /etc/webc/cmdline.tmp && mv /etc/webc/cmdline.tmp /etc/webc/cmdline
	touch /etc/webc/cmdline
}

until test -p $live_config_pipe # wait for xinitrc to trigger an update
do
    sleep 0.25 # wait for xinitrc to create pipe
done

source "/etc/webc/webc.conf"
cmdline_has noconfig || update_cmdline
fix_chrome

echo ACK > $live_config_pipe

# live-config should restart via inittab and get blocked 
# until $live_config_pipe is re-created
