#!/bin/sh

# start X, managed by inittab
exec su webc -c startx >/home/webc/.xerrors 2>&1
