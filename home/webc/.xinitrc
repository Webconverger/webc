#!/bin/bash
# Keep the browser running and clean between sessions in /home/webc
# hendry@webconverger.com
WEBCHOME=/home/webc
source "/etc/webc/webc.conf"

logs xsession invoked
exec &> /home/webc/.xerrors.debug
cmdline_has debug && {
	set -x
}
update_background() { xloadimage -quiet -onroot -center "$1"; }

cp /home/webc/bg.orig /home/webc/bg.png
xsetroot -solid "#ffffff"

if ! has_network
then
	update_background /etc/webc/no-net.png
	while ! has_network && ! cmdline_has debug; do
		sleep 1
	done
fi

update_background /etc/webc/configuring.png
while ! test -e /etc/webc/id; do
	sleep 0.25
	test $SECONDS -gt 30 && break
done
source "/etc/webc/webc.conf"
homepage="$install_qa_url" # default homepage

live_config_update # expecting it to block here

update_background /home/webc/bg.png

wm="/usr/bin/dwm.web" # defaults
xset s on
xset s blank
xset s 600
xset +dpms

for x in $(cmdline); do
	case $x in

		kioskresetstation=*) # For killing the browser after a number of minutes of idleness
			exec /usr/bin/kioskresetstation ${x#kioskresetstation=} &
			;;

		debug)
			wm="/usr/bin/dwm.default" # dwm.default is the dwm default, not webc
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
		blank=*)
			secondstillblank=$((${x#blank=} * 60))
			logs "screen will blank after $secondstillblank seconds"
			xset s $secondstillblank
			;;
	esac
done


# disable bell
xset b 0 0

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
				homepage="$( echo ${x#homepage=} | sed 's,%20, ,g' )"
				;;

		bgurl=*)
			bgurl="$( /bin/busybox httpd -d ${x#bgurl=} )"
				# only download if newer
				wget -N --timeout=5 "${bgurl}" -O /home/webc/bg.png.custom
				file /home/webc/bg.png.custom | grep -qs "image data" && {
					cp /home/webc/bg.png.custom /home/webc/bg.png # leave .custom around for wget
					update_background /home/webc/bg.png
				}
			;;

		install)
			homepage="$install_qa_url"
			;;
		esac
	done

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
