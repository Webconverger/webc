#!/bin/sh

echo "Fixing sudo"
chmod 0440 /etc/sudoers
chmod 0440 /etc/sudoers.d/README


echo "Fixing setuids"
suids="
/bin/ping
/bin/su
/usr/bin/sudo
/usr/lib/xorg/Xorg.wrap
"

for s in $suids; do
	chmod 4755 $s
done
