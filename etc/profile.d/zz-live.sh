if [ -z "${DISPLAY}" ] && [ $(tty) = /dev/tty1 ]
then
	while true
	do
		startx >/dev/null 2>&1
	done
fi
