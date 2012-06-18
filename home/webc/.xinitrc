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

cp /home/webc/bg-orig.png /home/webc/bg.png
xsetroot -solid "#ffffff"

if ! has_network
then
	update_background /etc/webc/no-net.png
	while ! has_network && ! cmdline_has debug; do
		sleep 1
	done
fi

update_background /etc/webc/configuring.png

# if there is a network, then I don't see why /etc/webc/id should not be there
while ! test -e /etc/webc/id; do
	sleep 0.25
	test $SECONDS -gt 30 && break
done

# get the $webc_id
source "/etc/webc/webc.conf"
homepage="$install_qa_url" # default homepage

mkfifo $live_config_pipe
read answer < $live_config_pipe # blocking till live-config is finished
rm -f $live_config_pipe

mkfifo $updates_pipe
read answer < $updates_pipe # blocking till updates is finished
rm -f $updates_pipe

update_background /home/webc/bg.png

wm="/usr/bin/dwm.web" # defaults
xset s on
xset s blank
xset s 600
xset +dpms

for x in $(cmdline)
do
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

		# https://groups.google.com/forum/#!msg/webc-users/GlHh_SX17BM/GojceXVSazgJ
		xrandr-all=*)
			xoptions=$( /bin/busybox httpd -d ${x#xrandr-all=} )

			xrandr | awk '/connected/ { print $1 }' | while read output
			do
				xrandr --output $output $xoptions
			done

			update_background /home/webc/bg.png # bg needs to be re-rendered on rotation for example
			;;

		xrandr=*)

			xoptions=$( /bin/busybox httpd -d ${x#xrandr=} )

			if xrandr $xoptions
			then
				logs "xrandr OK $xoptions"
			else
				logs "xrandr ERR $xoptions"
			fi

			update_background /home/webc/bg.png # bg needs to be re-rendered on rotation for example
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
		for d in /home/webc/{.mozilla,.adobe,.macromedia,Downloads} /tmp/webc; do
			test -d $d && rm -rf $d
			test -e $d && rm -f $d
		done
		mkdir /tmp/webc
		for d in .mozilla .adobe .macromedia Downloads; do
			mkdir /tmp/webc/$d
			ln -s /tmp/webc/$d /home/webc/$d
		done
		iceweasel $(echo $homepage | sed "s,MACID,$mac,g")
	fi

done
