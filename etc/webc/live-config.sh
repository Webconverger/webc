#!/bin/bash
. /etc/webc/webc.conf

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

install_qa_url=${install_qa_url/&/\\&amp;}
stamp=$( git show $webc_version |grep '^Date')
sed -i \
	-e "s#OS not running#Version ${webc_version} ${stamp}#"  \
	-e "s#http://config.webconverger.com#${install_qa_url}#"  \
	${link}/content/about.xhtml
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

