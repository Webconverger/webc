#!/bin/sh

# start X, managed by inittab

/etc/webc/live-config.sh 2>&1 >/dev/null

exec su webc -c startx  2>/dev/null
