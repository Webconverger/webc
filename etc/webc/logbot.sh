#!/bin/bash
. /etc/webc/webc.conf

! cmdline_has debug && { "$@"; exit 0; }

"$@" 2>&1 | while read line; do
	logger -t $1 -p syslog.debug -- "$line"
done
