#!/bin/sh
. /etc/webc/webc.conf

cmdline=""
while test "$cmdline" = ""; do
	wget -q -O /etc/webc/cmdline.tmp $config_url
	cmdline="$( cat /etc/webc/cmdline.tmp )" 
done
mv /etc/webc/cmdline.tmp /etc/webc/cmdline
	
exec sleep 3600
