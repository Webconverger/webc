# Keep the browser running and clean between sessions in /home/webc
# hendry@webconverger.com
. "/etc/webc/functions.sh"
. "/etc/webc/webc.conf"

if test -f /etc/X11/Xresources/x11-common
then
	xrdb -merge /etc/X11/Xresources/x11-common
else
	logs x11 config not found
fi

wm="/usr/bin/dwm.web" # default

if test "$(cmdline_get chrome)" = neon
then
	cmdline_has neonshowid && wm="/usr/bin/dwm.neon" # special version to show version/id info on top bar
	neon="-neon"
	update_background() { xloadimage -border black -quiet -onroot -center "$1"; }
	xsetroot -solid black
else
	update_background() { xloadimage -quiet -onroot -center "$1"; }
	xsetroot -solid white
fi

cp /home/webc/bg-orig${neon}.png /home/webc/bg.png

if ! has_network
then
	update_background /etc/webc/no-net${neon}.png
	while ! has_network && ! cmdline_has debug; do
		sleep 1
	done
fi

cmdline_has noconfig || update_background /etc/webc/configuring${neon}.png

# if there is a network, then I don't see why /etc/webc/id should not be there
while ! test -e /etc/webc/id; do
	sleep 0.25
	test $SECONDS -gt 30 && break
done

# get the $webc_id
. "/etc/webc/webc.conf"
homepage="$install_qa_url" # default homepage

mkfifo "$live_config_pipe"
read answer < "$live_config_pipe" # blocking till live-config is finished
rm -f "$live_config_pipe"

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

			# swarp=0,0 // move mouse pointer to top left of screen
			swarp=*)
			koptions=$( /bin/busybox httpd -d ${x#swarp=} )
			swarp $(echo $koptions | sed 's/[^0-9]/ /g')
			;;

			# http://webconverger.org/touch_screen_calibration/
			xinput=*)
			option=$( /bin/busybox httpd -d ${x#xinput=} )
			if eval xinput "$option"
			then
				logs "OK: xinput $option"
			else
				logs "ERROR: xinput $option"
			fi
			;;

			# https://groups.google.com/forum/#!msg/webc-users/GlHh_SX17BM/GojceXVSazgJ
			xrandr-all=*)
			xoptions=$( /bin/busybox httpd -d ${x#xrandr-all=} )

			logs "xrandr-all: $xoptions"

			xrandr | awk '$2 ~ /^connected$/ { print $1 }' | while read output
		do
			xrandr --output $output $xoptions
		done

		;;

	xrandr=*)

		xoptions=$( /bin/busybox httpd -d ${x#xrandr=} )

		if xrandr $xoptions
		then
			logs "xrandr OK $xoptions"
		else
			logs "xrandr ERR $xoptions"
		fi

		;;

	synclient=*)

		xoptions=$( /bin/busybox httpd -d ${x#synclient=} )

		if synclient $xoptions
		then
			logs "synclient OK $xoptions"
		else
			logs "synclient ERR $xoptions"
		fi

		;;


	amixer=*)

		xoptions=$( /bin/busybox httpd -d ${x#amixer=} )

		if amixer $xoptions
		then
			logs "amixer OK $xoptions"
		else
			logs "amixer ERR $xoptions"
		fi

		;;

	noblank)
		logs "noblank"
		xset s off
		xset -dpms
		;;

	numlock)
		logs "numlock set"
		/usr/bin/numlockx
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

while true
do
	update_background /home/webc/bg.png # bg needs to be re-rendered on rotation for example
	$wm
done &

# hide the cursor by default, showcursor to override
cmdline | grep -qs showcursor || exec /usr/bin/unclutter &

# Stop (ab)users breaking the loop to restart the exited browser
trap "echo Unbreakable!" SIGINT SIGTERM

# Stuff in here gets run at every browser restart:
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
usbid=$( usb_serials | head -n1 )

while true
do

	if test -x /opt/firefox/firefox
	then

		xsetroot -name "$webc_version $webc_id"
		export webc_id="$webc_id"

		if ! cmdline_has noclean
		then
			for d in /home/webc/{.mozilla,.cache,.config,Desktop,.gstreamer*,.adobe,.macromedia,Downloads} /tmp/webc
			do
				rm -rf $d
			done
		fi

		logs rhomepage: $rhomepage homepage: $homepage
		homepage="$(echo ${rhomepage:-$homepage} | sed 's,%20, ,g')"
		logs Launching with "${homepage}"
		if cmdline_has instantupdate
		then
			export rhomepage="$(/usr/bin/webc-wsc /opt/firefox/firefox $(echo $homepage | sed "s,MACID,$mac,g" | sed "s,WEBCID,$webc_id,g" | sed "s,WEBCVERSION,$webc_version,g" | sed "s,USBID,$usbid,g" ))"
		else
			/opt/firefox/firefox $(echo $homepage | sed "s,MACID,$mac,g" | sed "s,WEBCID,$webc_id,g" | sed "s,WEBCVERSION,$webc_version,g" | sed "s,USBID,$usbid,g" )
		fi

	fi
done
