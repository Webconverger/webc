#! /bin/sh
#
# update-rc.d
#
# Dummy update-rc.d, installed when file-rc replaces
# sysv-rc or the other way around. The postrm of the
# package being replaced symlinks /usr/sbin/update-rc.d
# to this dummy file.
#
# All this script does is "scream and die".
#

name=`basename $0`

cat <<EOF >&2

$name: not present yet.

You are replacing sysv-rc with file-rc or another -rc package, or
the other way around. The replacement package must first be
unpacked before you can configure other packages.

Exiting with error status 1.

EOF

exit 1
