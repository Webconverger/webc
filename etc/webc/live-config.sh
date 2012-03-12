#!/bin/sh
. /etc/webc/webc.conf

while ! wget -q -O /etc/webc/cmdline $config_url; do sleep 5; done
sleep 3600
