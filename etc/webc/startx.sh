#!/bin/sh

# start X, managed by inittab

/etc/webc/live-config.sh

exec su webc -c startx  2>/dev/null
