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
	

fix_chrome  

cmdline=""
while test "$cmdline" = ""; do
	wget -q -O /etc/webc/cmdline.tmp $config_url
	cmdline="$( cat /etc/webc/cmdline.tmp )" 
done
mv /etc/webc/cmdline.tmp /etc/webc/cmdline

fix_chrome # user may have changed it

exec sleep 3600
