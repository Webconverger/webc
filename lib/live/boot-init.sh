#!/bin/sh

## live-config(7) - System Configuration Scripts
## Copyright (C) 2006-2012 Daniel Baumann <daniel@debian.org>
##
## This program comes with ABSOLUTELY NO WARRANTY; for details see COPYING.
## This is free software, and you are welcome to redistribute it
## under certain conditions; see COPYING for details.


set -e

# Exit if system is not a live system
if ! grep -qs "boot=live" /proc/cmdline || \
# Exit if system is netboot
   grep -qs "netboot" /proc/cmdline || \
   grep -qs "root=/dev/nfs" /proc/cmdline || \
   grep -qs "root=/dev/cifs" /proc/cmdline || \
# Exit if system is toram
   grep -qs "toram" /proc/cmdline
then
	exit 0
fi



# Try to cache everything we're likely to need after ejecting.  This
# is fragile and simple-minded, but our options are limited.
cache_path()
{
	path="${1}"

	if [ -d "${path}" ]
	then
		find "${path}" -type f | xargs cat > /dev/null 2>&1
	elif [ -f "${path}" ]
	then
		if file -L "${path}" | grep -q 'dynamically linked'
		then
			# ldd output can be of three forms:
			# 1. linux-vdso.so.1 =>  (0x00007fffe3fb4000)
			#    This is a virtual, kernel shared library and we want to skip it
			# 2. libc.so.6 => /lib/libc.so.6 (0x00007f5e9dc0c000)
			#    We want to cache the third word.
			# 3. /lib64/ld-linux-x86-64.so.2 (0x00007f5e9df8b000)
			#    We want to cache the first word.
			ldd "${path}" | while read line
			do
				if echo "$line" | grep -qs ' =>  '
				then
					continue
				elif echo "$line" | grep -qs ' => '
				then
					lib=$(echo "${line}" | awk '{ print $3 }')
				else
					lib=$(echo "${line}" | awk '{ print $1 }')
				fi
				cache_path "${lib}"
			done
		fi

		cat "${path}" >/dev/null 2>&1
	fi
}

get_boot_device()
{
	# search in /proc/mounts for the device that is mounted at /lib/live/mount/medium
	while read DEVICE MOUNT REST
	do
		if [ "${MOUNT}" = "/lib/live/mount/medium" ]
		then
			echo "${DEVICE}"
			exit 0
		fi
	done < /proc/mounts
}

device_is_USB_flash_drive()
{
	# remove leading "/dev/" and all trailing numbers from input
	DEVICE=$(expr substr ${1} 6 3)

	# check that device starts with "sd"
	[ "$(expr substr ${DEVICE} 1 2)" != "sd" ] && return 1

	# check that the device is an USB device
	if readlink /sys/block/${DEVICE} | grep -q usb
	then
		return 0
	fi

	return 1
}

Eject ()
{
	# TODO: i18n
	BOOT_DEVICE="$(get_boot_device)"

	if device_is_USB_flash_drive ${BOOT_DEVICE}
	then
		# do NOT eject USB flash drives!
		# otherwise rebooting with most USB flash drives
		# failes because they actually remember the
		# "ejected" state even after reboot
		MESSAGE="Please remove the USB flash drive"

		if [ "${NOPROMPT}" = "usb" ]
		then
			prompt=
		fi

	else
		# ejecting is a very good idea here
		MESSAGE="Please remove the disc, close the tray (if any)"

		if [ -x /usr/bin/eject ]
		then
			eject -p -m /lib/live/mount/medium >/dev/null 2>&1
		fi

		if [ "${NOPROMPT}" = "cd" ]
		then
			prompt=
		fi
	fi

	[ "$prompt" ] || return 0

	if [ -x /bin/plymouth ] && plymouth --ping
	then
		plymouth message --text="${MESSAGE} and press ENTER to continue:"
		plymouth watch-keystroke > /dev/null
	else
		stty sane < /dev/console

		printf "\n\n${MESSAGE} and press ENTER to continue:" > /dev/console

		read x < /dev/console
	fi
}

echo "live-boot: caching reboot files..."

prompt=1
if [ "${NOPROMPT}" = "Yes" ]
then
	prompt=
fi

for path in $(which halt) $(which reboot) /etc/rc?.d /etc/default $(which stty) /bin/plymouth
do
	cache_path "${path}"
done

mount -o remount,ro /lib/live/mount/overlay > /dev/null 2>&1

# Remounting any persistence devices read-only
for _MOUNT in $(awk '/\/lib\/live\/mount\/persistence/ { print $2 }' /proc/mounts)
do
	mount -o remount,ro ${_MOUNT} > /dev/null 2>&1
done

# Flush filesystem buffers
sync

# Check if we need to eject the drive
if grep -qs "cdrom-detect/eject=false" /proc/cmdline || \
   grep -qs "noeject" /proc/cmdline || \
   grep -qs "find_iso" /proc/cmdline
then
	return
else
	Eject
fi
