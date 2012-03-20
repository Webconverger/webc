#!/bin/bash
. /etc/webc/webc.conf

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

for x in $( cmdline ); do
	case $x in
	webcchrome=*) 
		chrome=${x#webcchrome=}
		dir="/etc/webc/iceweasel/extensions/${chrome}"
		test -d $dir && { 
			test -e $link && rm -f $link 
			logs "switching chrome to ${chrome}"
			ln -s $dir $link
		}
		;;
	homepage=*)
		x=$(/bin/busybox httpd -d ${x#homepage=})
		prefs="/etc/iceweasel/profile/prefs.js"
		if test -e $prefs; then
			echo "user_pref(\"browser.startup.homepage\", \"$x\");" >> $prefs
		fi
		;;
	esac
done

install_qa_url=${install_qa_url/&/\&amp;}
stamp=$( git show $webc_version |grep '^Date')

cp ${link}/content/about.xhtml ${link}/content/about.xhtml.bak
cat ${link}/content/about.xhtml.bak |
sub_literal 'OS not running' "${webc_version} ${stamp}" |
sub_literal 'http://config.webconverger.com' "${install_qa_url}" > ${link}/content/about.xhtml
}
	


while ! netstat -rn |grep -qs '^0.0.0.0'; do
	sleep 1
	echo -n '.'
done

wget -q -O /etc/webc/cmdline.tmp $config_url
cmdline="$( cat /etc/webc/cmdline.tmp )" 
if test "$cmdline" != ""; then
	mv /etc/webc/cmdline.tmp /etc/webc/cmdline
fi

fix_chrome # user may have changed it

