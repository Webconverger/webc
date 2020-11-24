#!/bin/sh

#set -e

setup_unionfs ()
{
	image_directory="${1}"
	rootmnt="${2}"
	addimage_directory="${3}"

	modprobe -q -b ${UNIONTYPE}

	if ! cut -f2 /proc/filesystems | grep -q "^${UNIONTYPE}\$"
	then
		panic "${UNIONTYPE} not available."
	fi

	croot="/run/live/rootfs"

	# Let's just mount the read-only file systems first
	rootfslist=""

	if [ -z "${PLAIN_ROOT}" ]
	then
		# Read image names from ${MODULE}.module if it exists
		if [ -e "${image_directory}/filesystem.${MODULE}.module" ]
		then
			for IMAGE in $(cat ${image_directory}/filesystem.${MODULE}.module)
			do
				image_string="${image_string} ${image_directory}/${IMAGE}"
			done
		elif [ -e "${image_directory}/${MODULE}.module" ]
		then
			for IMAGE in $(cat ${image_directory}/${MODULE}.module)
			do
				image_string="${image_string} ${image_directory}/${IMAGE}"
			done
		else
			# ${MODULE}.module does not exist, create a list of images
			for FILESYSTEM in squashfs ext2 ext3 ext4 xfs jffs2 dir git
			do
				for IMAGE in "${image_directory}"/*."${FILESYSTEM}"
				do
					if [ -e "${IMAGE}" ]
					then
						image_string="${image_string} ${IMAGE}"
					fi
				done
			done

			if [ -n "${addimage_directory}" ] && [ -d "${addimage_directory}" ]
			then
				for FILESYSTEM in squashfs ext2 ext3 ext4 xfs jffs2 dir git
				do
					for IMAGE in "${addimage_directory}"/*."${FILESYSTEM}"
					do
						if [ -e "${IMAGE}" ]
						then
							image_string="${image_string} ${IMAGE}"
						fi
					done
				done
			fi

			# Now sort the list
			image_string="$(echo ${image_string} | sed -e 's/ /\n/g' | sort )"
		fi

		[ -n "${MODULETORAMFILE}" ] && image_string="${image_directory}/$(basename ${MODULETORAMFILE})"

		mkdir -p "${croot}"

		for image in ${image_string}
		do
			imagename=$(basename "${image}")

			export image devname
			maybe_break live-realpremount
			log_begin_msg "Running /scripts/live-realpremount"
			run_scripts /scripts/live-realpremount
			log_end_msg


			if [ "${image##*.}" = "git" ]
			then
				_log_msg git
				if [ "${UNIONTYPE}" != "unionmount" ]
				then
					mpoint="${croot}/${imagename}"
					_log_msg mpoint: $mpoint
				else
					mpoint="${rootmnt}"
				fi
				rootfslist="${mpoint} ${rootfslist}"

				mkdir -p "${mpoint}"
				log_begin_msg "Mounting \"${image}\" on \"${mpoint}\" via git-fs"
				# Replace /etc/mtab with a symlink to
				# /proc/mounts. This prevents fuse from
				# calling /bin/mount to update the mtab,
				# using options that busybox mount does
				# not understand...
				ln -sf /proc/mounts /etc/mtab

				# Make sure fuse keeps persistent inode
				# numbers to not confuse git. This is
				# needed in debug mode, when the files
				# exposed by git-fs are the working
				# copy for the git repository
				# bindmounted into /.git. In this case,
				# git gets confused and becomes slow
				# when inode numbers change. Since we
				# can't change this option after
				# mounting when we decide we need /.git,
				# we just set it always and accept the
				# extra (small) memory overhead.
				#
				# https://github.com/Webconverger/webc/issues/115
				gitfs_opt="$gitfs_opt,noforget"

				if [ -n "$GIT_REVISION" ]; then
					gitfs_opt="$gitfs_opt,rev=$GIT_REVISION"
				fi

				modprobe fuse
				#ulimit -c unlimited # enable core dumps
				# Note that when -d is specified, git-fs runs in the foreground,
				# so we can't use openvt --wait. Instead, just sleep a bit waiting
				# for the filesystem to be mounted
				#openvt -c 2 -- sh -c "git-fs -d -o allow_other${gitfs_opt} \"${image}\" \"${mpoint}\" 2>&1 | tee /git-fs.log"
				#sleep 2 # wait for git-fs to be mounted, since openvt returns immediately

				# Use this command to capture errors when the
				# kernel panics and you cannot scroll to see it.
				# You'll need a serial port (which is easy
				# virtualbox, just let it dump to a raw file).
				#git-fs -o allow_other${gitfs_opt} "${image}" "${mpoint}" &>/dev/ttyS0

				# Don't add -d here, then git-fs will run in
				# the foreground and block. Adding & to run in
				# the background does not seem to be suffcient.
				# Instead, use openvt like above.
				#
				# Also note that if "debug" is on the kernel commandline,
				# /usr/share/initramfs-tools/init will redirect output to a file,
				# hiding any errors
				#
				# We redirect stderr to fd 7, to bypass boot.log redirection
				# set by 9990-main.sh (which seems to sometimes eat messages).
				git-fs -o allow_other${gitfs_opt} "${image}" "${mpoint}" 2>&7

				log_end_msg
				#maybe_break gitfs
				#openvt -c 3 -- /bin/sh

			elif [ -d "${image}" ]
			then
				# it is a plain directory: do nothing
				rootfslist="${image} ${rootfslist}"
			elif [ -f "${image}" ]
			then
				if losetup --help 2>&1 | grep -q -- "-r\b"
				then
					backdev=$(get_backing_device "${image}" "-r")
				else
					backdev=$(get_backing_device "${image}")
				fi
				fstype=$(get_fstype "${backdev}")

				case "${fstype}" in
					unknown)
						panic "Unknown file system type on ${backdev} (${image})"
						;;

					"")
						fstype="${imagename##*.}"
						log_warning_msg "Unknown file system type on ${backdev} (${image}), assuming ${fstype}."
						;;
				esac

				mpoint=$(trim_path "${croot}/${imagename}")
				rootfslist="${mpoint} ${rootfslist}"

				mkdir -p "${mpoint}"
				log_begin_msg "Mounting \"${image}\" on \"${mpoint}\" via \"${backdev}\""
				mount -t "${fstype}" -o ro,noatime "${backdev}" "${mpoint}" || panic "Can not mount ${backdev} (${image}) on ${mpoint}"
				log_end_msg
			else
				log_warning_msg "Could not find image '${image}'. Most likely it is listed in a .module file, perhaps by mistake."
			fi
		done
	else
		# we have a plain root system
		mkdir -p "${croot}/filesystem"
		log_begin_msg "Mounting \"${image_directory}\" on \"${croot}/filesystem\""
		mount -t $(get_fstype "${image_directory}") -o ro,noatime "${image_directory}" "${croot}/filesystem" || \
			panic "Can not mount ${image_directory} on ${croot}/filesystem" && \
			rootfslist="${croot}/filesystem ${rootfslist}"
		# probably broken:
		mount -o bind ${croot}/filesystem $mountpoint
		log_end_msg
	fi

	# tmpfs file systems
	touch /etc/fstab
	mkdir -p /run/live/overlay

	# Looking for persistence devices or files
	if [ -n "${PERSISTENCE}" ] && [ -z "${NOPERSISTENCE}" ]
	then

		if [ -z "${QUICKUSBMODULES}" ]
		then
			# Load USB modules
			num_block=$(ls -l /sys/block | wc -l)
			for module in sd_mod uhci-hcd ehci-hcd ohci-hcd usb-storage
			do
				modprobe -q -b ${module}
			done

			udevadm trigger
			udevadm settle

			# For some reason, udevsettle does not block in this scenario,
			# so we sleep for a little while.
			#
			# See https://bugs.launchpad.net/ubuntu/+source/casper/+bug/84591
			for timeout in 5 4 3 2 1
			do
				sleep 1

				if [ $(ls -l /sys/block | wc -l) -gt ${num_block} ]
				then
					break
				fi
			done
		fi

		local whitelistdev
		whitelistdev=""
		if [ -n "${PERSISTENCE_MEDIA}" ]
		then
			case "${PERSISTENCE_MEDIA}" in
				removable)
					whitelistdev="$(removable_dev)"
					;;

				removable-usb)
					whitelistdev="$(removable_usb_dev)"
					;;
			esac
			if [ -z "${whitelistdev}" ]
			then
				whitelistdev="ignore_all_devices"
			fi
		fi

		if is_in_comma_sep_list overlay ${PERSISTENCE_METHOD}
		then
			overlays="${custom_overlay_label}"
		fi

		local overlay_devices
		overlay_devices=""
		if [ "${whitelistdev}" != "ignore_all_devices" ]
		then
			for media in $(find_persistence_media "${overlays}" "${whitelistdev}")
			do
				media="$(echo ${media} | tr ":" " ")"

				case ${media} in
					${custom_overlay_label}=*)
						device="${media#*=}"
						overlay_devices="${overlay_devices} ${device}"
						;;
				 esac
			done
		fi
	elif [ -n "${NFS_COW}" ] && [ -z "${NOPERSISTENCE}" ]
	then
		# check if there are any nfs options
		if echo ${NFS_COW} | grep -q ','
		then
			nfs_cow_opts="-o nolock,$(echo ${NFS_COW}|cut -d, -f2-)"
			nfs_cow=$(echo ${NFS_COW}|cut -d, -f1)
		else
			nfs_cow_opts="-o nolock"
			nfs_cow=${NFS_COW}
		fi

		if [ -n "${PERSISTENCE_READONLY}" ]
		then
			nfs_cow_opts="${nfs_cow_opts},nocto,ro"
		fi

		mac="$(get_mac)"
		if [ -n "${mac}" ]
		then
			cowdevice=$(echo ${nfs_cow} | sed "s/client_mac_address/${mac}/")
			cow_fstype="nfs"
		else
			panic "unable to determine mac address"
		fi
	fi

	if [ -z "${cowdevice}" ]
	then
		cowdevice="tmpfs"
		cow_fstype="tmpfs"
		cow_mountopt="rw,noatime,mode=755,size=${OVERLAY_SIZE:-50%}"
	fi

	if [ -n "${PERSISTENCE_READONLY}" ] && [ "${cowdevice}" != "tmpfs" ]
	then
		mount -t tmpfs -o rw,noatime,mode=755,size=${OVERLAY_SIZE:-50%} tmpfs "/run/live/overlay"
		root_backing="/run/live/persistence/$(basename ${cowdevice})-root"
		mkdir -p ${root_backing}
	else
		root_backing="/run/live/overlay"
	fi

	if [ "${cow_fstype}" = "nfs" ]
	then
		log_begin_msg \
			"Trying nfsmount ${nfs_cow_opts} ${cowdevice} ${root_backing}"
		nfsmount ${nfs_cow_opts} ${cowdevice} ${root_backing} || \
			panic "Can not mount ${cowdevice} (n: ${cow_fstype}) on ${root_backing}"
	else
		mount -t ${cow_fstype} -o ${cow_mountopt} ${cowdevice} ${root_backing} || \
			panic "Can not mount ${cowdevice} (o: ${cow_fstype}) on ${root_backing}"
	fi

	rootfscount=$(echo ${rootfslist} |wc -w)

	rootfs=${rootfslist%% }

	if [ -n "${EXPOSED_ROOT}" ]
	then
		if [ ${rootfscount} -ne 1 ]
		then
			panic "only one RO file system supported with exposedroot: ${rootfslist}"
		fi

		mount -o bind ${rootfs} ${rootmnt} || \
			panic "bind mount of ${rootfs} failed"

		if [ -z "${SKIP_UNION_MOUNTS}" ]
		then
			cow_dirs='/var/tmp /var/lock /var/run /var/log /var/spool /home /var/lib/live'
		else
			cow_dirs=''
		fi
	else
		cow_dirs="/"
	fi

	for dir in ${cow_dirs}; do
		unionmountpoint=$(trim_path "${rootmnt}${dir}")
		mkdir -p ${unionmountpoint}
		cow_dir=$(trim_path "/run/live/overlay${dir}")
		rootfs_dir="${rootfs}${dir}"
		mkdir -p ${cow_dir}
		if [ -n "${PERSISTENCE_READONLY}" ] && [ "${cowdevice}" != "tmpfs" ]
		then
			do_union ${unionmountpoint} ${cow_dir} ${root_backing} ${rootfs_dir}
		else
			do_union ${unionmountpoint} ${cow_dir} ${rootfs_dir}
		fi || panic "mount ${UNIONTYPE} on ${unionmountpoint} failed with option ${unionmountopts}"
	done

	# Remove persistence depending on boot parameter
	Remove_persistence

	# Correct the permissions of /:
	chmod 0755 "${rootmnt}"

	# Correct the permission of /tmp:
	if [ -d "${rootmnt}/tmp" ]
	then
		chmod 1777 "${rootmnt}"/tmp
	fi

	# Adding custom persistence
	if [ -n "${PERSISTENCE}" ] && [ -z "${NOPERSISTENCE}" ]
	then
		local custom_mounts
		custom_mounts="/tmp/custom_mounts.list"
		rm -f ${custom_mounts}

		# Gather information about custom mounts from devies detected as overlays
		get_custom_mounts ${custom_mounts} ${overlay_devices}

		[ -n "${LIVE_BOOT_DEBUG}" ] && cp ${custom_mounts} "/run/live/persistence"

		# Now we do the actual mounting (and symlinking)
		local used_overlays
		used_overlays=""
		used_overlays=$(activate_custom_mounts ${custom_mounts})
		rm -f ${custom_mounts}

		# Close unused overlays (e.g. due to missing $persistence_list)
		for overlay in ${overlay_devices}
		do
			if echo ${used_overlays} | grep -qve "^\(.* \)\?${overlay}\( .*\)\?$"
			then
				close_persistence_media ${overlay}
			fi
		done
	fi
}
