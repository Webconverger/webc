#!/bin/sh

#set -e

Fstab ()
{
	# FIXME: stop hardcoding overloading of initramfs-tools functions
	. /scripts/functions
	. /lib/live/boot/9990-initramfs-tools.sh

	if [ -n "${NOFSTAB}" ]
	then
		return
	fi

	if [ -e /root/etc/fstab.d ]
	then
		# wheezy
		_FSTAB="/root/etc/fstab.d/live"
	else
		# squeeze
		_FSTAB="/root/etc/fstab"
	fi

	log_begin_msg "Configuring fstab"

	if ! grep -qs  "^${UNIONTYPE}" "${_FSTAB}"
	then
		echo "${UNIONTYPE} / ${UNIONTYPE} rw 0 0" >> "${_FSTAB}"
	fi

	if ! grep -qs "^tmpfs /tmp" "${_FSTAB}"
	then
		echo "tmpfs /tmp tmpfs nosuid,nodev 0 0" >> "${_FSTAB}"
	fi

	log_end_msg
}
