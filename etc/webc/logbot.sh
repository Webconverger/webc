#!/bin/sh
. /etc/webc/webc.conf

! cmdline_has debug && { "$@"; exit 0; }

filename="$@"

bash -x "$filename" 2>&1 | while read line; do
	logs "$filename" "$line"
done
