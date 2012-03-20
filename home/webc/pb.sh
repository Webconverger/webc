#!/bin/bash
# pb = persistent browser
# Keep the browser running and clean between sessions in $WEBCHOME
# hendry@webconverger.com
WEBCHOME=/home/webc

. "/etc/webc/webc.conf"
logger xsession invoked

cmdline noroot || {
	set -x
	exec &> ~/pb.log
}

if ! has_network && cmdline noroot; then
	xloadimage -quiet -onroot -center /etc/webc/no-net.png
	while ! has_network; do
		sleep 1
	done
	exit 1
fi

#homepage="$1"
homepage="$install_qa_url"
shift
wm="/usr/bin/dwm.default"

for x in $(cmdline); do
	case $x in
		kioskresetstation=*) # For killing the browser after a number of minutes of idleness
			exec /usr/bin/kioskresetstation ${x#kioskresetstation=} &
			;;
		noroot)
			wm="/usr/bin/dwm.web"
			;;
		compose)
			setxkbmap -option "compose:rwin" 
			logs "Compose key setup"
			;;
		noblank)
			logs "noblank"
			xset s off 
			xset -dpms
			;;
	esac
done

# disable bell
xset b 0 0

# white background http://webconverger.org/artwork/
xsetroot -solid "#ffffff"

# only when noroot is supplied, we use Webc's WM dwm.web
exec $wm &

# hide the cursor by default, showcursor to override
cmdline | grep -qs showcursor || exec /usr/bin/unclutter &

# Stop (ab)users breaking the loop to restart the exited browser
trap "echo Unbreakable!" SIGINT SIGTERM

while true
do
	for x in $(cmdline); do
		case $x in
			homepage=*)
				homepage="$( /bin/busybox httpd -d ${x#homepage=} )"
				;;
			locales=*)
				export LANG=$( locale -a | grep ^${x#locales=}_...utf8 )
				;;
			install)
				homepage="$install_qa_url"
				;;
		esac
	done

	# if no-x-background is unset, try setup a background from homepage sans query
	cmdline | grep -qs noxbg || {
		cp /etc/webc/bg.png $WEBCHOME/bg.png
		wget --timeout=5 ${homepage}/bg.png -O $WEBCHOME/bg.png.tmp 
		file $WEBCHOME/bg.png.tmp | grep -qs "image data" && {
			mv $WEBCHOME/bg.png.tmp $WEBCHOME/bg.png
		}
		xloadimage -quiet -onroot -center $WEBCHOME/bg.png
	}

	# Set default homepage if homepage cmdline isn't set
	test $homepage = "" &&  homepage="http://portal.webconverger.com/"


	mac=$( mac_address )
	x=$(echo $homepage | sed "s,MACID,$mac,")

	if test -x /usr/bin/iceweasel
	then
		rm -rf $WEBCHOME/.mozilla/
		iceweasel "$x" "$@"
		rm -rf $WEBCHOME/.mozilla/
	fi

	rm -rf $WEBCHOME/.adobe
	rm -rf $WEBCHOME/.macromedia
	rm -rf $WEBCHOME/Downloads

done
