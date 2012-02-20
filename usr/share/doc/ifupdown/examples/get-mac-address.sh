#!/bin/sh

set -e

export LANG=C

iface="$1"
mac=$(/sbin/ifconfig "$iface" | sed -n -e '/^.*HWaddr \([:[:xdigit:]]*\).*/{s//\1/;y/ABCDEF/abcdef/;p;q;}')
which=""

while read testmac scheme; do
	if [ "$which" ]; then continue; fi
	if [ "$mac" == "$(echo "$testmac" | sed -e 'y/ABCDEF/abcdef/')" ]; then which="$scheme"; fi
done

if [ "$which" ]; then echo $which; exit 0; fi
exit 1
