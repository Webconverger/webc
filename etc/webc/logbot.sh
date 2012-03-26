#!/bin/sh
. /etc/webc/webc.conf

! cmdline_has debug && { "$@"; exit 0; }

bash -x "$@" 2>&1 | while read line; do
	logs "$line"
done
