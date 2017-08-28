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

	# run-init can't deal with images in a subdir, but we're going to
	# move all of these away before it runs anyway.  No, we're not,
	# put them in / since move-mounting them into / breaks mono and
	# some other apps.

	croot="/"

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
			for FILESYSTEM in squashfs ext2 ext3 ext4 xfs jffs2 dir
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
				for FILESYSTEM in squashfs ext2 ext3 ext4 xfs jffs2 dir
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

			if [ -d "${image}" ]
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

				mpoint="${croot}/${imagename}"
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
	mkdir -p /live/overlay
	mount -t tmpfs tmpfs /live/overlay

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
		cow_mountopt="rw,noatime,mode=755"
	fi

	if [ -n "${PERSISTENCE_READONLY}" ] && [ "${cowdevice}" != "tmpfs" ]
	then
		mount -t tmpfs -o rw,noatime,mode=755 tmpfs "/live/overlay"
		root_backing="/live/persistence/$(basename ${cowdevice})-root"
		mkdir -p ${root_backing}
	else
		root_backing="/live/overlay"
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
		unionmountpoint="${rootmnt}${dir}"
		mkdir -p ${unionmountpoint}
		cow_dir="/live/overlay${dir}"
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

	live_rootfs_list=""
	for d in ${rootfslist}
	do
		live_rootfs="/live/rootfs/${d##*/}"
		live_rootfs_list="${live_rootfs_list} ${live_rootfs}"
		mkdir -p "${live_rootfs}"
		case "${d}" in
			*.dir)
				# do nothing # mount -o bind "${d}" "${live_rootfs}"
				;;
			*)
				mount -o move "${d}" "${live_rootfs}"
				;;
		esac
	done

	# Adding custom persistence
	if [ -n "${PERSISTENCE}" ] && [ -z "${NOPERSISTENCE}" ]
	then
		local custom_mounts
		custom_mounts="/tmp/custom_mounts.list"
		rm -f ${custom_mounts}

		# Gather information about custom mounts from devies detected as overlays
		get_custom_mounts ${custom_mounts} ${overlay_devices}

		[ -n "${LIVE_BOOT_DEBUG}" ] && cp ${custom_mounts} "/lib/live/mount/persistence"

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

	# ensure that a potentially stray tmpfs gets removed
	# otherways, initramfs-tools is unable to remove /live
	# and fails to boot
	umount /live/overlay > /dev/null 2>&1 || true
}
