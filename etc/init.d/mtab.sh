#! /bin/sh
### BEGIN INIT INFO
# Provides:          mtab
# Required-Start:    checkroot
# Required-Stop:
# Default-Start:     S
# Default-Stop:
# Short-Description: Update mtab file.
# Description:       Update the mount program's mtab file after
#                    all local filesystems have been mounted.
### END INIT INFO

#
# The main purpose of this script is to update the mtab file to reflect
# the fact that virtual filesystems were mounted early on, before mtab
# was writable.
#

PATH=/sbin:/bin
. /lib/init/vars.sh
. /lib/init/tmpfs.sh

TTYGRP=5
TTYMODE=620
[ -f /etc/default/devpts ] && . /etc/default/devpts

KERNEL="$(uname -s)"

. /lib/lsb/init-functions
. /lib/init/mount-functions.sh

do_start () {
	# Note that mtab should have been previously initialised by
	# checkroot.sh.

	# Add entries for mounts created in early boot
	# S01mountkernfs.sh
	/etc/init.d/mountkernfs.sh mtab
	/etc/init.d/mountkernfs.sh reload
	# S03udev
	domount mtab tmpfs "" /dev "udev" "-omode=0755"
	# S03mountdevsubfs.sh
	/etc/init.d/mountdevsubfs.sh mtab
	/etc/init.d/mountdevsubfs.sh reload

	# Add everything else in /proc/mounts into /etc/mtab, with
	# special exceptions.
	while read FDEV FDIR FTYPE FOPTS REST
	do
		case "$FDIR" in
			/lib/modules/*/volatile)
				FDEV="lrm"
				;;
			/dev/.static/dev)
				# Not really useful to show in 'df',
				# and it isn't accessible for non-root
				# users.
				continue
				;;
		esac
		domount mtab "$FTYPE" "" "$FDIR" "$FDEV" "-o$FOPTS"
	done < /proc/mounts
}

case "$1" in
  start|"")
	do_start
	;;
  restart|reload|force-reload)
	echo "Error: argument '$1' not supported" >&2
	exit 3
	;;
  stop)
	# No-op
	;;
  *)
	echo "Usage: mountall-mtab.sh [start|stop]" >&2
	exit 3
	;;
esac

:
