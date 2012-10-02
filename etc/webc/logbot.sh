#!/bin/bash
. /etc/webc/functions.sh
. /etc/webc/webc.conf

if ! cmdline_has debug; then
	exec "$@" >/dev/null 2>/dev/null
else
	exec "$@" 2>&1 | while read -r line
	do
		if test "$1" = "bash" # For the "bash -x webc.sh" case
		then
			logger -t $3 -p syslog.debug -- "$line"
		else
			logger -t $1 -p syslog.debug -- "$line"
		fi
	done
fi

# This is never reached!
