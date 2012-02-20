#!/bin/bash
# pb = persistent browser
# Keep the browser running and clean between sessions in $WEBCHOME
# hendry@webconverger.com
WEBCHOME=/home/webc

if test -e /tmp/pb-loop
then
	logger pb invoked
	exit
fi
touch /tmp/pb-loop

# disable bell
xset b 0 0

# white background http://webconverger.org/artwork/
xsetroot -solid "#ffffff"

# only when noroot is supplied, we use Webc's WM dwm.web
grep -qs noroot /proc/cmdline && /usr/bin/dwm.web || /usr/bin/dwm.default &

# hide the cursor by default, showcursor to override
grep -qs showcursor /proc/cmdline || /usr/bin/unclutter &

# Stop (ab)users breaking the loop to restart the exited browser
trap "echo Unbreakable!" SIGINT SIGTERM

for x in $(cat /proc/cmdline); do
	case $x in
		homepage=*)
		set -f -- $(/bin/busybox httpd -d ${x#homepage=})
		;;
		kioskresetstation=*) # For killing the browser after a number of minutes of idleness
		/usr/bin/kioskresetstation ${x#kioskresetstation=} &
		;;
	esac
done

grep -qs compose /proc/cmdline && setxkbmap -option "compose:rwin" && logger "Compose key setup"

# Set default homepage if homepage cmdline isn't set
test $1 || set -- "http://portal.webconverger.com/"

# if no-x-background is unset, try setup a background from homepage sans query
grep -qs noxbg /proc/cmdline || {
wget --timeout=5 $1/bg.png -O $WEBCHOME/bg.png && file $WEBCHOME/bg.png | grep -q "image data" ||
cp /etc/webc/bg.png $WEBCHOME/bg.png
xloadimage -quiet -onroot -center $WEBCHOME/bg.png
}

# No screen blanking - needed for Digital signage
grep -qs noblank /proc/cmdline && xset s off && xset -dpms && logger noblank


# TODO: Maybe merge MAC finding code?
# https://github.com/Webconverger/Debian-Live-config/blob/master/webconverger/config/includes.chroot/etc/network/if-up.d/ping
for i in $(ls /sys/class/net)
do
	test $(basename $i) = "lo" && continue
	mac=$(cat /sys/class/net/$i/address | tr -d ":")
	test "$mac" && break
done
x=$(echo $1 | sed "s,MACID,$mac,")
shift

while true
do

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
