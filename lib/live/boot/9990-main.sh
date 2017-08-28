#!/bin/sh

# set -e

Live ()
{
	if [ -x /scripts/local-top/cryptroot ]
	then
		/scripts/local-top/cryptroot
	fi

	exec 6>&1
	exec 7>&2
	exec > boot.log
	exec 2>&1
	tail -f boot.log >&7 &
	tailpid="${!}"

	LIVE_BOOT_CMDLINE="${LIVE_BOOT_CMDLINE:-$(cat /proc/cmdline)}"
	Cmdline_old

	Debug

	Read_only

	Select_eth_device

	if [ -e /conf/param.conf ]
	then
		. /conf/param.conf
	fi

	# Needed here too because some things (*cough* udev *cough*)
	# changes the timeout

	if [ ! -z "${NETBOOT}" ] || [ ! -z "${FETCH}" ] || [ ! -z "${HTTPFS}" ] || [ ! -z "${FTPFS}" ]
	then
		if do_netmount
		then
			livefs_root="${mountpoint}"
		else
			panic "Unable to find a live file system on the network"
		fi
	else
		if [ -n "${ISCSI_PORTAL}" ]
		then
			do_iscsi && livefs_root="${mountpoint}"
		elif [ -n "${PLAIN_ROOT}" ] && [ -n "${ROOT}" ]
		then
			# Do a local boot from hd
			livefs_root=${ROOT}
		else
			if [ -x /usr/bin/memdiskfind ]
			then
				MEMDISK=$(/usr/bin/memdiskfind)

				if [ $? -eq 0 ]
				then
					# We found a memdisk, set up phram
					modprobe phram phram=memdisk,${MEMDISK}
					modprobe phram phram=memdisk,${MEMDISK}

					# Load mtdblock, the memdisk will be /dev/mtdblock0
					modprobe mtdblock
				fi
			fi

			# Scan local devices for the image
			i=0
			while [ "$i" -lt 60 ]
			do
				livefs_root=$(find_livefs ${i})

				if [ -n "${livefs_root}" ]
				then
					break
				fi

				sleep 1
				i="$(($i + 1))"
			done
		fi
	fi

	if [ -z "${livefs_root}" ]
	then
		panic "Unable to find a medium containing a live file system"
	fi

	Verify_checksums "${livefs_root}"

	if [ "${TORAM}" ]
	then
		live_dest="ram"
	elif [ "${TODISK}" ]
	then
		live_dest="${TODISK}"
	fi

	if [ "${live_dest}" ]
	then
		log_begin_msg "Copying live media to ${live_dest}"
		copy_live_to "${livefs_root}" "${live_dest}"
		log_end_msg
	fi

	# if we do not unmount the ISO we can't run "fsck /dev/ice" later on
	# because the mountpoint is left behind in /proc/mounts, so let's get
	# rid of it when running from RAM
	if [ -n "$FROMISO" ] && [ "${TORAM}" ]
	then
		losetup -d /dev/loop0

		if is_mountpoint /live/fromiso
		then
			umount /live/fromiso
			rmdir --ignore-fail-on-non-empty /live/fromiso \
				>/dev/null 2>&1 || true
		fi
	fi

	if [ -n "${MODULETORAMFILE}" ] || [ -n "${PLAIN_ROOT}" ]
	then
		setup_unionfs "${livefs_root}" "${rootmnt}"
	else
		mac="$(get_mac)"
		mac="$(echo ${mac} | sed 's/-//g')"
		mount_images_in_directory "${livefs_root}" "${rootmnt}" "${mac}"
	fi

	# At this point /root should contain the final root filesystem.
	# Move all mountpoints below /live into /root/lib/live/mount.
	# This has to be done after mounting the root filesystem to /
	# otherwise these mount points won't be accessible from the running system.
	for _MOUNT in $(cat /proc/mounts | cut -f 2 -d " " | grep -e "^/live/")
	do
		local newmount
		newmount="${rootmnt}/lib/live/mount/${_MOUNT#/live/}"
		mkdir -p "${newmount}"
		mount -o move "${_MOUNT}" "${newmount}" > /dev/null 2>&1 || \
		mount -o bind "${_MOUNT}" "${newmount}" > /dev/null || \
		log_warning_msg "W: failed to move or bindmount ${_MOUNT} to ${newmount}"
	done

	if [ -n "${ROOT_PID}" ]
	then
		echo "${ROOT_PID}" > "${rootmnt}"/lib/live/root.pid
	fi

	log_end_msg

	# aufs2 in kernel versions around 2.6.33 has a regression:
	# directories can't be accessed when read for the first the time,
	# causing a failure for example when accessing /var/lib/fai
	# when booting FAI, this simple workaround solves it
	ls /root/* >/dev/null 2>&1

	# if we do not unmount the ISO we can't run "fsck /dev/ice" later on
	# because the mountpoint is left behind in /proc/mounts, so let's get
	# rid of it when running from RAM
	if [ -n "$FINDISO" ] && [ "${TORAM}" ]
	then
		losetup -d /dev/loop0

		if is_mountpoint /root/lib/live/mount/findiso
		then
			umount /root/lib/live/mount/findiso
			rmdir --ignore-fail-on-non-empty /root/lib/live/mount/findiso \
				>/dev/null 2>&1 || true
		fi
	fi

	if [ -L /root/etc/resolv.conf ] ; then
		# assume we have resolvconf
		DNSFILE="${rootmnt}/etc/resolvconf/resolv.conf.d/base"
	else
		DNSFILE="${rootmnt}/etc/resolv.conf"
	fi
	if [ -f /etc/resolv.conf ] && [ ! -s ${DNSFILE} ]
	then
		log_begin_msg "Copying /etc/resolv.conf to ${DNSFILE}"
		cp -v /etc/resolv.conf ${DNSFILE}
		log_end_msg
	fi

	if ! [ -d "/lib/live/boot" ]
	then
		panic "A wrong rootfs was mounted."
	fi

	Fstab
	Netbase

	Swap

	exec 1>&6 6>&-
	exec 2>&7 7>&-
	kill ${tailpid}
	[ -w "${rootmnt}/var/log/" ] && mkdir -p "${rootmnt}/var/log/live" && cp boot.log "${rootmnt}/var/log/live" 2>/dev/null
}
