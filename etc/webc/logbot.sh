#!/bin/bash
. /etc/webc/functions.sh
. /etc/webc/webc.conf

! cmdline_has debug && { "$@" >/dev/null 2>/dev/null; exit 0; }

"$@" 2>&1 | while read line
do
	if test "$1" = "bash" # For the "bash -x webc.sh" case
	then
		logger -t $3 -p syslog.debug -- "$line"
	else
		logger -t $1 -p syslog.debug -- "$line"
	fi
done
