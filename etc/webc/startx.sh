#!/bin/sh

# start X, managed by inittab

exec su webc -c startx  2>/dev/null
