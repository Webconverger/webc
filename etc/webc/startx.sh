#!/bin/bash

. /etc/webc/functions.sh
. /etc/webc/webc.conf

nvdetect() {

NV_DEVICES=$(lspci -mn | awk '{ gsub("\"",""); if ($2 == "0300" && ($3 == "10de" || $3 == "12d2")) { print $1 } }')

if test -z "$NV_DEVICES"
then
	logs "No NVIDIA GPU detected."
	return 1
fi

NVGA=$(lspci -mn -s ${NV_DEVICES%% *} | awk '{ gsub("\"",""); print $3 $4 }')

if grep -il $NVGA /usr/share/nvidia/*.ids | grep -q legacy
then
	logs "Legacy NVIDIA GPU detected"
	return 1
fi

return 0

}

if ! cmdline_has nonvidia
then
	if nvdetect
	then
		nvidia-xconfig --randr-rotation >/home/webc/.xerrors 2>&1
		update-alternatives --quiet --set glx /usr/lib/nvidia
	fi
fi

cmdline_has debug || cat /etc/webc/xorg.conf >> /etc/X11/xorg.conf
exec su webc -c startx >>/home/webc/.xerrors 2>&1
