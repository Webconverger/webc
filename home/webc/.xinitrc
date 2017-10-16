. /etc/webc/functions.sh
. /etc/webc/webc.conf

if cmdline_has debug
then
	/etc/webc/logbot.sh bash -x /home/webc/webc.sh
else
	bash /home/webc/webc.sh
fi
