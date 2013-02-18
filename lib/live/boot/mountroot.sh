#!/bin/sh

# set -e

mountroot ()
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

	. /live.vars

	_CMDLINE="$(cat /proc/cmdline)"
	Cmdline

	case "${LIVE_DEBUG}" in
		true)
			set -x
			;;
	esac

	case "${LIVE_READ_ONLY}" in
		true)
			Read_only
			;;
	esac

	Select_eth_device

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

	case "${LIVE_VERIFY_CHECKSUMS}" in
		true)
			Verify_checksums "${livefs_root}"
			;;
	esac

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


	if [ -n "${ROOT_PID}" ]
	then
		echo "${ROOT_PID}" > "${rootmnt}"/live/root.pid
	fi

	log_end_msg

	# unionfs-fuse needs /dev to be bind-mounted for the duration of
	# live-bottom; udev's init script will take care of things after that
	case "${UNIONTYPE}" in
		unionfs-fuse)
			mount -n -o bind /dev "${rootmnt}/dev"
			;;
	esac

	# Move to the new root filesystem so that programs there can get at it.
	if [ ! -d /root/live/image ]
	then
		mkdir -p /root/live/image
		mount --move /live/image /root/live/image
	fi


	# If the git-fs code made a bindmount of the git repo, make it available in the real rootfs.
	if [ -d /.git ]
	then
		mkdir "${rootmnt}/.git"
		# Try to make /.git read-write, by simply remounting it, or by
		# using a second aufs. Note that mount will return success even
		# if the filesystem is still ro, so we test for writeability
		# using touch.
		if ! (mount -o remount,rw /.git && touch /.git ) && [ "${UNIONTYPE}" = aufs ]
		then
			# Overlay a second aufs over /.git. Even though
			# changes will be lost on reboots, you can still make
			# a change and push it out before the reboot. We can't
			# include this in the main aufs mount, since aufs
			# doesn't handle (bind)mounts in subdirectories.
			mkdir /cow-git
			mount -o rw,noatime,mode=755 -t tmpfs tmpfs /cow-git
			mount -t aufs -o noatime,dirs=/cow-git=rw:/.git=rr aufs "${rootmnt}/.git"
		else
			mount --move /.git "${rootmnt}/.git"
		fi

		# Make sure that HEAD corresponds to the commit
		# mounted by git-fs
		if [ -n "$GIT_REVISION" ]
		then
			# We don't do a normal (--mixed) reset, since
			# that also scans the entire working copy to
			# update the cached info in the index (which is
			# slow on git-fs / aufs). Instead, we reset HEAD
			# and the index separately.
			chroot "${rootmnt}" git --git-dir "/.git" reset --soft "${GIT_REVISION}"
		fi
		# Reset the index
		chroot "${rootmnt}" git --git-dir "/.git" read-tree HEAD

	fi


	# aufs2 in kernel versions around 2.6.33 has a regression:
	# directories can't be accessed when read for the first the time,
	# causing a failure for example when accessing /var/lib/fai
	# when booting FAI, this simple workaround solves it
	ls /root/* >/dev/null 2>&1

	# Move findiso directory to the new root filesystem so that programs there can get at it.
	if [ -d /live/findiso ] && [ ! -d /root/live/findiso ]
	then
		mkdir -p /root/live/findiso
		mount -n --move /live/findiso /root/live/findiso
	fi

	# if we do not unmount the ISO we can't run "fsck /dev/ice" later on
	# because the mountpoint is left behind in /proc/mounts, so let's get
	# rid of it when running from RAM
	if [ -n "$FINDISO" ] && [ "${TORAM}" ]
	then
		losetup -d /dev/loop0

		if is_mountpoint /root/live/findiso
		then
			umount /root/live/findiso
			rmdir --ignore-fail-on-non-empty /root/live/findiso \
				>/dev/null 2>&1 || true
		fi
	fi

	if [ -f /etc/resolv.conf ] && [ ! -s ${rootmnt}/etc/resolv.conf ]
	then
		log_begin_msg "Copying /etc/resolv.conf to ${rootmnt}/etc/resolv.conf"
		cp -v /etc/resolv.conf ${rootmnt}/etc/resolv.conf
		log_end_msg
	fi

	if ! [ -d "/lib/live/boot" ]
	then
		panic "A wrong rootfs was mounted."
	fi

	Fstab
	Netbase

	case "${LIVE_SWAPON}" in
		true)
			Swapon
			;;
	esac

	case "${UNIONFS}" in
		unionfs-fuse)
			umount "${rootmnt}/dev"
			;;
	esac

	exec 1>&6 6>&-
	exec 2>&7 7>&-
	kill ${tailpid}
	[ -w "${rootmnt}/var/log/" ] && mkdir -p "${rootmnt}/var/log/live" && cp boot.log "${rootmnt}/var/log/live" 2>/dev/null
}
