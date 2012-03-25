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
cp /home/webc/bg.orig /home/webc/bg.png # default Webconverger branding

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

# hide the cursor by default, showcursor to override
cmdline | grep -qs showcursor || exec /usr/bin/unclutter &

# Stop (ab)users breaking the loop to restart the exited browser
trap "echo Unbreakable!" SIGINT SIGTERM

# Stuff in here gets run at every browser restart:
while true
do
	for x in $(cmdline); do
		case $x in
			homepage=*)
				homepage="$( /bin/busybox httpd -d ${x#homepage=} )"
				;;

		bgurl=*)
			bgurl="$( /bin/busybox httpd -d ${x#bgurl=} )"
				# only download if newer
				wget -N --timeout=5 "${bgurl}" -O /home/webc/bg.png.custom
				file /home/webc/bg.png.custom | grep -qs "image data" && {
					cp /home/webc/bg.png.custom /home/webc/bg.png # leave .custom around for wget
				}
			;;

			install)
				homepage="$install_qa_url"
				;;
		esac
	done

	# set the background http://webconverger.org/artwork/
	xloadimage -quiet -onroot -center /home/webc/bg.png

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

done
