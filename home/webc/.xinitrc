#!/bin/bash
# Keep the browser running and clean between sessions in /home/webc
# hendry@webconverger.com
WEBCHOME=/home/webc

. "/etc/webc/webc.conf"
logs xsession invoked

cmdline_has noroot || {
	set -x
	exec &> ~/.xerrors
}

if ! has_network && cmdline_has noroot; then
	xloadimage -quiet -onroot -center /etc/webc/no-net.png
	while ! has_network; do
		sleep 1
	done
	live_config_update
	sleep 3
fi

homepage="$install_qa_url" # default homepage

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

		xkb=*)
			koptions=$( /bin/busybox httpd -d ${x#xkb=} )
			if setxkbmap $koptions; then logs "setxkbmap OK $koptions"; else logs "setxkbmap ERR $koptions"; fi
			;;

		xrandr=*)
			xoptions=$( /bin/busybox httpd -d ${x#xrandr=} )
			if xrandr $xoptions; then logs "xrandr OK $xoptions"; else logs "xrandr ERR $xoptions"; fi
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

# hide the cursor by default, showcursor to override TODO: toggle from cmdline
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
			install)
				homepage="$install_qa_url"
				;;
		esac
	done

	# if no-x-background is unset, try setup a background from homepage sans query
	cmdline | grep -qs noxbg || {
		cp /etc/webc/bg.png /home/webc/bg.png
		set -f -- $homepage
		if echo $1 | grep -q \? # assume if we see a query we want to dirname this to find the PNG
		then
			h=$(dirname $1)
		else
			h=$1
		fi
		wget --timeout=5 ${h}/bg.png -O /home/webc/bg.png.tmp
		file /home/webc/bg.png.tmp | grep -qs "image data" && {
			mv /home/webc/bg.png.tmp /home/webc/bg.png
		}
		xloadimage -quiet -onroot -center /home/webc/bg.png
	}

	mac=$( mac_address )

	if test -x /usr/bin/iceweasel
	then
		rm -rf /home/webc/.mozilla/
		iceweasel $(echo $homepage | sed "s,MACID,$mac,g")
		rm -rf /home/webc/.mozilla/
	fi

	rm -rf /home/webc/.adobe
	rm -rf /home/webc/.macromedia
	rm -rf /home/webc/Downloads

	live_config_update
	sleep 3
done
