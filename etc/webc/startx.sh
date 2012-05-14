#!/bin/bash

source /etc/webc/webc.conf

cmdline_has nvidia && nvidia-xconfig --randr-rotation -s
cmdline_has debug || cat /etc/webc/xorg.conf >> /etc/X11/xorg.conf
exec su webc -c startx >/home/webc/.xerrors 2>&1
