#!/bin/sh

#set -e

is_live_path ()
{
	DIRECTORY="${1}"

	if [ -d "${DIRECTORY}"/"${LIVE_MEDIA_PATH}" ]
	then
		for FILESYSTEM in squashfs ext2 ext3 ext4 xfs dir jffs2
		do
			if [ "$(echo ${DIRECTORY}/${LIVE_MEDIA_PATH}/*.${FILESYSTEM})" != "${DIRECTORY}/${LIVE_MEDIA_PATH}/*.${FILESYSTEM}" ]
			then
				return 0
			fi
		done
	fi

	return 1
}

matches_uuid ()
{
	if [ "${IGNORE_UUID}" ] || [ ! -e /conf/uuid.conf ]
	then
		return 0
	fi

	path="${1}"
	uuid="$(cat /conf/uuid.conf)"

	for try_uuid_file in "${path}/.disk/live-uuid"*
	do
		[ -e "${try_uuid_file}" ] || continue

		try_uuid="$(cat "${try_uuid_file}")"

		if [ "${uuid}" = "${try_uuid}" ]
		then
			return 0
		fi
	done

	return 1
}

get_backing_device ()
{
	case "${1}" in
		*.squashfs|*.ext2|*.ext3|*.ext4|*.jffs2)
			echo $(setup_loop "${1}" "loop" "/sys/block/loop*" '0' "${LIVE_MEDIA_ENCRYPTION}" "${2}")
			;;

		*.dir)
			echo "directory"
			;;

		*)
			panic "Unrecognized live filesystem: ${1}"
			;;
	esac
}

match_files_in_dir ()
{
	# Does any files match pattern ${1} ?
	local pattern="${1}"

	if [ "$(echo ${pattern})" != "${pattern}" ]
	then
		return 0
	fi

	return 1
}

mount_images_in_directory ()
{
	directory="${1}"
	rootmnt="${2}"
	mac="${3}"

	if match_files_in_dir "${directory}/${LIVE_MEDIA_PATH}/*.squashfs" ||
		match_files_in_dir "${directory}/${LIVE_MEDIA_PATH}/*.ext2" ||
		match_files_in_dir "${directory}/${LIVE_MEDIA_PATH}/*.ext3" ||
		match_files_in_dir "${directory}/${LIVE_MEDIA_PATH}/*.ext4" ||
		match_files_in_dir "${directory}/${LIVE_MEDIA_PATH}/*.jffs2" ||
		match_files_in_dir "${directory}/${LIVE_MEDIA_PATH}/*.dir"
	then
		[ -n "${mac}" ] && adddirectory="${directory}/${LIVE_MEDIA_PATH}/${mac}"
		setup_unionfs "${directory}/${LIVE_MEDIA_PATH}" "${rootmnt}" "${adddirectory}"
	else
		panic "No supported filesystem images found at /${LIVE_MEDIA_PATH}."
	fi
}

is_nice_device ()
{
	sysfs_path="${1#/sys}"

	if [ -e /lib/udev/path_id ]
	then
		# squeeze
		PATH_ID="/lib/udev/path_id"
	else
		# wheezy/sid (udev >= 174)
		PATH_ID="/sbin/udevadm test-builtin path_id"
	fi

	if ${PATH_ID} "${sysfs_path}" | egrep -q "ID_PATH=(usb|pci-[^-]*-(ide|sas|scsi|usb|virtio)|platform-sata_mv|platform-orion-ehci|platform-mmc|platform-mxsdhci)"
	then
		return 0
	elif echo "${sysfs_path}" | grep -q '^/block/vd[a-z]$'
	then
		return 0
	elif echo ${sysfs_path} | grep -q "^/block/dm-"
	then
		return 0
	elif echo ${sysfs_path} | grep -q "^/block/mtdblock"
	then
		return 0
	fi

	return 1
}

check_dev ()
{
	sysdev="${1}"
	devname="${2}"
	skip_uuid_check="${3}"

	# support for fromiso=.../isofrom=....
	if [ -n "$FROMISO" ]
	then
		ISO_DEVICE=$(dirname $FROMISO)
		if ! [ -b $ISO_DEVICE ]
		then
			# to support unusual device names like /dev/cciss/c0d0p1
			# as well we have to identify the block device name, let's
			# do that for up to 15 levels
			i=15
			while [ -n "$ISO_DEVICE" ] && [ "$i" -gt 0 ]
			do
				ISO_DEVICE=$(dirname ${ISO_DEVICE})
				[ -b "$ISO_DEVICE" ] && break
				i=$(($i -1))
		        done
		fi

		if [ "$ISO_DEVICE" = "/" ]
		then
			echo "Warning: device for bootoption fromiso= ($FROMISO) not found.">>/boot.log
		else
			fs_type=$(get_fstype "${ISO_DEVICE}")
			if is_supported_fs ${fs_type}
			then
				mkdir /live/fromiso
				mount -t $fs_type "$ISO_DEVICE" /live/fromiso
				ISO_NAME="$(echo $FROMISO | sed "s|$ISO_DEVICE||")"
				loopdevname=$(setup_loop "/live/fromiso/${ISO_NAME}" "loop" "/sys/block/loop*" "" '')
				devname="${loopdevname}"
			else
				echo "Warning: unable to mount $ISO_DEVICE." >>/boot.log
			fi
		fi
	fi

	if [ -z "${devname}" ]
	then
		devname=$(sys2dev "${sysdev}")
	fi

	if [ -d "${devname}" ]
	then
		mount -o bind "${devname}" $mountpoint || continue

		if is_live_path $mountpoint
		then
			echo $mountpoint
			return 0
		else
			umount $mountpoint
		fi
	fi

	IFS=","
	for device in ${devname}
	do
		case "$device" in
			*mapper*)
				# Adding lvm support
				if [ -x /scripts/local-top/lvm2 ]
				then
					ROOT="$device" resume="" /scripts/local-top/lvm2
				fi
				;;

			/dev/md*)
				# Adding raid support
				if [ -x /scripts/local-top/mdadm ]
				then
					cp /conf/conf.d/md /conf/conf.d/md.orig
					echo "MD_DEVS=$device " >> /conf/conf.d/md
					/scripts/local-top/mdadm
					mv /conf/conf.d/md.orig /conf/conf.d/md
				fi
				;;
		esac
	done
	unset IFS

	[ -n "$device" ] && devname="$device"

	[ -e "$devname" ] || continue

	if [ -n "${LIVE_MEDIA_OFFSET}" ]
	then
		loopdevname=$(setup_loop "${devname}" "loop" "/sys/block/loop*" "${LIVE_MEDIA_OFFSET}" '')
		devname="${loopdevname}"
	fi

	fstype=$(get_fstype "${devname}")

	if is_supported_fs ${fstype}
	then
		devuid=$(blkid -o value -s UUID "$devname")
		[ -n "$devuid" ] && grep -qs "\<$devuid\>" $tried && continue
		mount -t ${fstype} -o ro,noatime "${devname}" ${mountpoint} || continue
		[ -n "$devuid" ] && echo "$devuid" >> $tried

		if [ -n "${FINDISO}" ]
		then
			if [ -f ${mountpoint}/${FINDISO} ]
			then
				umount ${mountpoint}
				mkdir -p /live/findiso
				mount -t ${fstype} -o ro,noatime "${devname}" /live/findiso
				loopdevname=$(setup_loop "/live/findiso/${FINDISO}" "loop" "/sys/block/loop*" 0 "")
				devname="${loopdevname}"
				mount -t iso9660 -o ro,noatime "${devname}" ${mountpoint}
			else
				umount ${mountpoint}
			fi
		fi

		if is_live_path ${mountpoint} && \
			([ "${skip_uuid_check}" ] || matches_uuid ${mountpoint})
		then
			echo ${mountpoint}
			return 0
		else
			umount ${mountpoint} 2>/dev/null
		fi
	fi

	if [ -n "${LIVE_MEDIA_OFFSET}" ]
	then
		losetup -d "${loopdevname}"
	fi

	return 1
}

find_livefs ()
{
	timeout="${1}"

	# don't start autodetection before timeout has expired
	if [ -n "${LIVE_MEDIA_TIMEOUT}" ]
	then
		if [ "${timeout}" -lt "${LIVE_MEDIA_TIMEOUT}" ]
		then
			return 1
		fi
	fi

	# first look at the one specified in the command line
	case "${LIVE_MEDIA}" in
		removable-usb)
			for sysblock in $(removable_usb_dev "sys")
			do
				for dev in $(subdevices "${sysblock}")
				do
					if check_dev "${dev}"
					then
						return 0
					fi
				done
			done
			return 1
			;;

		removable)
			for sysblock in $(removable_dev "sys")
			do
				for dev in $(subdevices "${sysblock}")
				do
					if check_dev "${dev}"
					then
						return 0
					fi
				done
			done
			return 1
			;;

		*)
			if [ ! -z "${LIVE_MEDIA}" ]
			then
				if check_dev "null" "${LIVE_MEDIA}" "skip_uuid_check"
				then
					return 0
				fi
			fi
			;;
	esac

	# or do the scan of block devices
	# prefer removable devices over non-removable devices, so scan them first
	devices_to_scan="$(removable_dev 'sys') $(non_removable_dev 'sys')"

	for sysblock in $devices_to_scan
	do
		devname=$(sys2dev "${sysblock}")
		[ -e "$devname" ] || continue
		fstype=$(get_fstype "${devname}")

		if /lib/udev/cdrom_id ${devname} > /dev/null
		then
			if check_dev "null" "${devname}"
			then
				return 0
			fi
		elif is_nice_device "${sysblock}"
		then
			for dev in $(subdevices "${sysblock}")
			do
				if check_dev "${dev}"
				then
					return 0
				fi
			done
		elif [ "${fstype}" = "squashfs" -o \
			"${fstype}" = "btrfs" -o \
			"${fstype}" = "ext2" -o \
			"${fstype}" = "ext3" -o \
			"${fstype}" = "ext4" -o \
			"${fstype}" = "jffs2" ]
		then
			# This is an ugly hack situation, the block device has
			# an image directly on it.  It's hopefully
			# live-boot, so take it and run with it.
			ln -s "${devname}" "${devname}.${fstype}"
			echo "${devname}.${fstype}"
			return 0
		fi
	done

	return 1
}

really_export ()
{
	STRING="${1}"
	VALUE="$(eval echo -n \${$STRING})"

	if [ -f /live.vars ] && grep -sq "export ${STRING}" /live.vars
	then
		sed -i -e 's/\('${STRING}'=\).*$/\1'${VALUE}'/' /live.vars
	else
		echo "export ${STRING}=\"${VALUE}\"" >> /live.vars
	fi

	eval export "${STRING}"="${VALUE}"
}

is_in_list_separator_helper ()
{
	local sep=${1}
	shift
	local element=${1}
	shift
	local list=${*}
	echo ${list} | grep -qe "^\(.*${sep}\)\?${element}\(${sep}.*\)\?$"
}

is_in_space_sep_list ()
{
	local element=${1}
	shift
	is_in_list_separator_helper "[[:space:]]" "${element}" "${*}"
}

is_in_comma_sep_list ()
{
	local element=${1}
	shift
	is_in_list_separator_helper "," "${element}" "${*}"
}

sys2dev ()
{
	sysdev=${1#/sys}
	echo "/dev/$($udevinfo -q name -p ${sysdev} 2>/dev/null|| echo ${sysdev##*/})"
}

subdevices ()
{
	sysblock=${1}
	r=""

	for dev in "${sysblock}"/* "${sysblock}"
	do
		if [ -e "${dev}/dev" ]
		then
			r="${r} ${dev}"
		fi
	done

	echo ${r}
}

storage_devices()
{
	black_listed_devices="${1}"
	white_listed_devices="${2}"

	for sysblock in $(echo /sys/block/* | tr ' ' '\n' | grep -vE "loop|ram|fd")
	do
		fulldevname=$(sys2dev "${sysblock}")

		if is_in_space_sep_list ${fulldevname} ${black_listed_devices} || \
			[ -n "${white_listed_devices}" ] && \
			! is_in_space_sep_list ${fulldevname} ${white_listed_devices}
		then
			# skip this device entirely
			continue
		fi

		for dev in $(subdevices "${sysblock}")
		do
			devname=$(sys2dev "${dev}")

			if is_in_space_sep_list ${devname} ${black_listed_devices}
			then
				# skip this subdevice
				continue
			else
				echo "${devname}"
			fi
		done
	done
}

is_supported_fs ()
{
	fstype="${1}"

	# Validate input first
	if [ -z "${fstype}" ]
	then
		return 1
	fi

	# Try to look if it is already supported by the kernel
	if grep -q ${fstype} /proc/filesystems
	then
		return 0
	else
		# Then try to add support for it the gentle way using the initramfs capabilities
		modprobe ${fstype}
		if grep -q ${fstype} /proc/filesystems
		then
			return 0
		# Then try the hard way if /root is already reachable
		else
			kmodule="/root/lib/modules/`uname -r`/${fstype}/${fstype}.ko"
			if [ -e "${kmodule}" ]
			then
				insmod "${kmodule}"
				if grep -q ${fstype} /proc/filesystems
				then
					return 0
				fi
			fi
		fi
	fi

	return 1
}

get_fstype ()
{
	/sbin/blkid -s TYPE -o value $1 2>/dev/null
}

where_is_mounted ()
{
	device=${1}
	# return first found
	grep -m1 "^${device} " /proc/mounts | cut -f2 -d ' '
}

trim_path ()
{
	# remove all unnecessary /:s in the path, including last one (except
	# if path is just "/")
	echo ${1} | sed 's|//\+|/|g' | sed 's|^\(.*[^/]\)/$|\1|'
}

what_is_mounted_on ()
{
	local dir="$(trim_path ${1})"
	grep -m1 "^[^ ]\+ ${dir} " /proc/mounts | cut -d' ' -f1
}

chown_ref ()
{
	local reference="${1}"
	shift
	local targets=${@}
	local owner=$(stat -c %u:%g "${reference}")
	chown -h ${owner} ${targets}
}

chmod_ref ()
{
	local reference="${1}"
	shift
	local targets=${@}
	local rights=$(stat -c %a "${reference}")
	chmod ${rights} ${targets}
}

lastline ()
{
	while read lines
	do
		line=${lines}
	done

	echo "${line}"
}

base_path ()
{
	testpath="${1}"
	mounts="$(awk '{print $2}' /proc/mounts)"
	testpath="$(busybox realpath ${testpath})"

	while true
	do
		if echo "${mounts}" | grep -qs "^${testpath}"
		then
			set -- $(echo "${mounts}" | grep "^${testpath}" | lastline)
			echo ${1}
			break
		else
			testpath=$(dirname $testpath)
		fi
	done
}

fs_size ()
{
	# Returns used/free fs kbytes + 5% more
	# You could pass a block device as ${1} or the mount point as ${2}

	dev="${1}"
	mountp="${2}"
	used="${3}"

	if [ -z "${mountp}" ]
	then
		mountp="$(where_is_mounted ${dev})"

		if [ -z "${mountp}" ]
		then
			mountp="/mnt/tmp_fs_size"

			mkdir -p "${mountp}"
			mount -t $(get_fstype "${dev}") -o ro "${dev}" "${mountp}" || log_warning_msg "cannot mount -t $(get_fstype ${dev}) -o ro ${dev} ${mountp}"

			doumount=1
		fi
	fi

	if [ "${used}" = "used" ]
	then
		size=$(du -ks ${mountp} | cut -f1)
		size=$(expr ${size} + ${size} / 20 ) # FIXME: 5% more to be sure
	else
		# free space
		size="$(df -k | grep -s ${mountp} | awk '{print $4}')"
	fi

	if [ -n "${doumount}" ]
	then
		umount "${mountp}" || log_warning_msg "cannot umount ${mountp}"
		rmdir "${mountp}"
	fi

	echo "${size}"
}

load_keymap ()
{
	# Load custom keymap
	if [ -x /bin/loadkeys -a -r /etc/boottime.kmap.gz ]
	then
		loadkeys /etc/boottime.kmap.gz
	fi
}

setup_loop ()
{
	local fspath=${1}
	local module=${2}
	local pattern=${3}
	local offset=${4}
	local encryption=${5}
	local readonly=${6}

	# the output of setup_loop is evaluated in other functions,
	# modprobe leaks kernel options like "libata.dma=0"
	# as "options libata dma=0" on stdout, causing serious
	# problems therefor, so instead always avoid output to stdout
	modprobe -q -b "${module}" 1>/dev/null

	udevadm settle

	for loopdev in ${pattern}
	do
		if [ "$(cat ${loopdev}/size)" -eq 0 ]
		then
			dev=$(sys2dev "${loopdev}")
			options=''

			if [ -n "${readonly}" ]
			then
				if losetup --help 2>&1 | grep -q -- "-r\b"
				then
					options="${options} -r"
				fi
			fi

			if [ -n "${offset}" ] && [ 0 -lt "${offset}" ]
			then
				options="${options} -o ${offset}"
			fi

			if [ -z "${encryption}" ]
			then
				losetup ${options} "${dev}" "${fspath}"
			else
				# Loop AES encryption
				while true
				do
					load_keymap

					echo -n "Enter passphrase for root filesystem: " >&6
					read -s passphrase
					echo "${passphrase}" > /tmp/passphrase
					unset passphrase
					exec 9</tmp/passphrase
					/sbin/losetup ${options} -e "${encryption}" -p 9 "${dev}" "${fspath}"
					error=${?}
					exec 9<&-
					rm -f /tmp/passphrase

					if [ 0 -eq ${error} ]
					then
						unset error
						break
					fi

					echo
					echo -n "There was an error decrypting the root filesystem ... Retry? [Y/n] " >&6
					read answer

					if [ "$(echo "${answer}" | cut -b1 | tr A-Z a-z)" = "n" ]
					then
						unset answer
						break
					fi
				done
			fi

			echo "${dev}"
			return 0
		fi
	done

	panic "No loop devices available"
}

try_mount ()
{
	dev="${1}"
	mountp="${2}"
	opts="${3}"
	fstype="${4}"

	old_mountp="$(where_is_mounted ${dev})"

	if [ -n "${old_mountp}" ]
	then
		if [ "${opts}" != "ro" ]
		then
			mount -o remount,"${opts}" "${dev}" "${old_mountp}" || panic "Remounting ${dev} ${opts} on ${old_mountp} failed"
		fi

		mount -o bind "${old_mountp}" "${mountp}" || panic "Cannot bind-mount ${old_mountp} on ${mountp}"
	else
		if [ -z "${fstype}" ]
		then
			fstype=$(get_fstype "${dev}")
		fi
		mount -t "${fstype}" -o "${opts}" "${dev}" "${mountp}" || \
		( echo "SKIPPING: Cannot mount ${dev} on ${mountp}, fstype=${fstype}, options=${opts}" > boot.log && return 0 )
	fi
}

mount_persistence_media ()
{
	local device=${1}
	local probe=${2}

	local backing="/live/persistence/$(basename ${device})"

	mkdir -p "${backing}"
	local old_backing="$(where_is_mounted ${device})"
	if [ -z "${old_backing}" ]
	then
		local fstype="$(get_fstype ${device})"
		local mount_opts="rw,noatime"
		if [ -n "${PERSISTENCE_READONLY}" ]
		then
			mount_opts="ro,noatime"
		fi
		if mount -t "${fstype}" -o "${mount_opts}" "${device}" "${backing}" >/dev/null
		then
			echo ${backing}
			return 0
		else
			[ -z "${probe}" ] && log_warning_msg "Failed to mount persistence media ${device}"
			rmdir "${backing}"
			return 1
		fi
	elif [ "${backing}" != "${old_backing}" ]
	then
		if mount --move ${old_backing} ${backing} >/dev/null
		then
			echo ${backing}
			return 0
		else
			[ -z "${probe}" ] && log_warning_msg "Failed to move persistence media ${device}"
			rmdir "${backing}"
			return 1
		fi
	fi
	return 0
}

close_persistence_media ()
{
	local device=${1}
	local backing="$(where_is_mounted ${device})"

	if [ -d "${backing}" ]
	then
		umount "${backing}" >/dev/null 2>&1
		rmdir "${backing}" >/dev/null 2>&1
	fi

	if is_active_luks_mapping ${device}
	then
		/sbin/cryptsetup luksClose ${device}
	fi
}

open_luks_device ()
{
	dev="${1}"
	name="$(basename ${dev})"
	opts="--key-file=-"
	if [ -n "${PERSISTENCE_READONLY}" ]
	then
		opts="${opts} --readonly"
	fi

	if /sbin/cryptsetup status "${name}" >/dev/null 2>&1
	then
		re="^[[:space:]]*device:[[:space:]]*\([^[:space:]]*\)$"
		opened_dev=$(cryptsetup status ${name} 2>/dev/null | grep "${re}" | sed "s|${re}|\1|")
		if [ "${opened_dev}" = "${dev}" ]
		then
			luks_device="/dev/mapper/${name}"
			echo ${luks_device}
			return 0
		else
			log_warning_msg "Cannot open luks device ${dev} since ${opened_dev} already is opened with its name"
			return 1
		fi
	fi

	load_keymap

	while true
	do
		/lib/cryptsetup/askpass "Enter passphrase for ${dev}: " | \
			/sbin/cryptsetup -T 1 luksOpen ${dev} ${name} ${opts}

		if [ 0 -eq ${?} ]
		then
			luks_device="/dev/mapper/${name}"
			echo ${luks_device}
			return 0
		fi

		echo >&6
		echo -n "There was an error decrypting ${dev} ... Retry? [Y/n] " >&6
		read answer

		if [ "$(echo "${answer}" | cut -b1 | tr A-Z a-z)" = "n" ]
		then
			return 2
		fi
	done
}

get_gpt_name ()
{
    local dev="${1}"
    /sbin/blkid -s PART_ENTRY_NAME -p -o value ${dev} 2>/dev/null
}

is_gpt_device ()
{
    local dev="${1}"
    [ "$(/sbin/blkid -s PART_ENTRY_SCHEME -p -o value ${dev} 2>/dev/null)" = "gpt" ]
}

probe_for_gpt_name ()
{
	local overlays="${1}"
	local dev="${2}"

	local gpt_dev="${dev}"
	if is_active_luks_mapping ${dev}
	then
		# if $dev is an opened luks device, we need to check
		# GPT stuff on the backing device
		gpt_dev=$(get_luks_backing_device "${dev}")
	fi

	if ! is_gpt_device ${gpt_dev}
	then
		return
	fi

	local gpt_name=$(get_gpt_name ${gpt_dev})
	for label in ${overlays}
	do
		if [ "${gpt_name}" = "${label}" ]
		then
			echo "${label}=${dev}"
		fi
	done
}

probe_for_fs_label ()
{
	local overlays="${1}"
	local dev="${2}"

	for label in ${overlays}
	do
		if [ "$(/sbin/blkid -s LABEL -o value $dev 2>/dev/null)" = "${label}" ]
		then
			echo "${label}=${dev}"
		fi
	done
}

probe_for_file_name ()
{
	local overlays="${1}"
	local dev="${2}"

	local ret=""
	local backing="$(mount_persistence_media ${dev} probe)"
	if [ -z "${backing}" ]
	then
	    return
	fi

	for label in ${overlays}
	do
		path=${backing}/${PERSISTENCE_PATH}${label}
		if [ -f "${path}" ]
		then
			local loopdev=$(setup_loop "${path}" "loop" "/sys/block/loop*")
			ret="${ret} ${label}=${loopdev}"
		fi
	done

	if [ -n "${ret}" ]
	then
		echo ${ret}
	else
		umount ${backing} > /dev/null 2>&1 || true
	fi
}

find_persistence_media ()
{
	# Scans devices for overlays, and returns a whitespace
	# separated list of how to use them. Only overlays with a partition
	# label or file name in ${overlays} are returned.
	#
	# When scanning a LUKS device, the user will be asked to enter the
	# passphrase; on failure to enter it, or if no persistence partitions
	# or files were found, the LUKS device is closed.
	#
	# For all other cases (overlay partition and overlay file) the
	# return value is "${label}=${device}", where ${device} a device that
	# can mount the content. In the case of an overlay file, the device
	# containing the file will remain mounted as a side-effect.
	#
	# No devices in ${black_listed_devices} will be scanned, and if
	# ${white_list_devices} is non-empty, only devices in it will be
	# scanned.

	local overlays="${1}"
	local white_listed_devices="${2}"
	local ret=""

	local black_listed_devices="$(what_is_mounted_on /live/image)"

	for dev in $(storage_devices "${black_listed_devices}" "${white_listed_devices}")
	do
		local result=""

		local luks_device=""
		# Check if it's a luks device; we'll have to open the device
		# in order to probe any filesystem it contains, like we do
		# below. activate_custom_mounts() also depends on that any luks
		# device already has been opened.
		if is_in_comma_sep_list luks ${PERSISTENCE_ENCRYPTION} && is_luks_partition ${dev}
		then
			if luks_device=$(open_luks_device "${dev}")
			then
				dev="${luks_device}"
			else
				# skip $dev since we failed/chose not to open it
				continue
			fi
		elif ! is_in_comma_sep_list none ${PERSISTENCE_ENCRYPTION}
		then
			# skip $dev since we don't allow unencrypted storage
			continue
		fi

		# Probe for matching GPT partition names or filesystem labels
		if is_in_comma_sep_list filesystem ${PERSISTENCE_STORAGE}
		then
			result=$(probe_for_gpt_name "${overlays}" ${dev})
			if [ -n "${result}" ]
			then
				ret="${ret} ${result}"
				continue
			fi

			result=$(probe_for_fs_label "${overlays}" ${dev})
			if [ -n "${result}" ]
			then
				ret="${ret} ${result}"
				continue
			fi
		fi

		# Probe for files with matching name on mounted partition
		if is_in_comma_sep_list file ${PERSISTENCE_STORAGE}
		then
			result=$(probe_for_file_name "${overlays}" ${dev})
			if [ -n "${result}" ]
			then
				ret="${ret} ${result}"
				continue
			fi
		fi

		# Close luks device if it isn't used
		if [ -z "${result}" ] && [ -n "${luks_device}" ] && is_active_luks_mapping "${luks_device}"
		then
			/sbin/cryptsetup luksClose "${luks_device}"
		fi
	done

	if [ -n "${ret}" ]
	then
		echo ${ret}
	fi
}

get_mac ()
{
	mac=""

	for adaptor in /sys/class/net/*
	do
		status="$(cat ${adaptor}/iflink)"

		if [ "${status}" -eq 2 ]
		then
			mac="$(cat ${adaptor}/address)"
			mac="$(echo ${mac} | sed 's/:/-/g' | tr '[a-z]' '[A-Z]')"
		fi
	done

	echo ${mac}
}

is_luks_partition ()
{
	device="${1}"
	/sbin/cryptsetup isLuks "${device}" 1>/dev/null 2>&1
}

is_active_luks_mapping ()
{
	device="${1}"
	/sbin/cryptsetup status "${device}" 1>/dev/null 2>&1
}

get_luks_backing_device ()
{
	device=${1}
	cryptsetup status ${device} 2> /dev/null | \
		awk '{if ($1 == "device:") print $2}'
}

removable_dev ()
{
	output_format="${1}"
	want_usb="${2}"
	ret=

	for sysblock in $(echo /sys/block/* | tr ' ' '\n' | grep -vE "/(loop|ram|dm-|fd)")
	do
		dev_ok=
		if [ "$(cat ${sysblock}/removable)" = "1" ]
		then
			if [ -z "${want_usb}" ]
			then
				dev_ok="true"
			else
				if readlink ${sysblock} | grep -q usb
				then
					dev_ok="true"
				fi
			fi
		fi

		if [ "${dev_ok}" = "true" ]
		then
			case "${output_format}" in
				sys)
					ret="${ret} ${sysblock}"
					;;
				*)
					devname=$(sys2dev "${sysblock}")
					ret="${ret} ${devname}"
					;;
			esac
		fi
	done

	echo "${ret}"
}

removable_usb_dev ()
{
	output_format="${1}"

	removable_dev "${output_format}" "want_usb"
}

non_removable_dev ()
{
	output_format="${1}"
	ret=

	for sysblock in $(echo /sys/block/* | tr ' ' '\n' | grep -vE "/(loop|ram|dm-|fd)")
	do
		if [ "$(cat ${sysblock}/removable)" = "0" ]
		then
			case "${output_format}" in
				sys)
					ret="${ret} ${sysblock}"
					;;
				*)
					devname=$(sys2dev "${sysblock}")
					ret="${ret} ${devname}"
					;;
			esac
		fi
	done

	echo "${ret}"
}

link_files ()
{
	# create source's directory structure in dest, and recursively
	# create symlinks in dest to to all files in source. if mask
	# is non-empty, remove mask from all source paths when
	# creating links (will be necessary if we change root, which
	# live-boot normally does (into $rootmnt)).

	# remove multiple /:s and ensure ending on /
	local src_dir="$(trim_path ${1})/"
	local dest_dir="$(trim_path ${2})/"
	local src_mask="${3}"

	# This check can only trigger on the inital, non-recursive call since
	# we create the destination before recursive calls
	if [ ! -d "${dest_dir}" ]
	then
		log_warning_msg "Must link_files into a directory"
		return
	fi

	find "${src_dir}" -mindepth 1 -maxdepth 1 | \
	while read src
	do
		local dest="${dest_dir}$(basename "${src}")"
		if [ -d "${src}" ]
		then
			if [ -z "$(ls -A "${src}")" ]
			then
				continue
			fi
			if [ ! -d "${dest}" ]
			then
				mkdir -p "${dest}"
				chown_ref "${src}" "${dest}"
				chmod_ref "${src}" "${dest}"
			fi
			link_files "${src}" "${dest}" "${src_mask}"
		else
			local final_src=${src}
			if [ -n "${src_mask}" ]
			then
				final_src="$(echo ${final_src} | sed "s|^${src_mask}||")"
			fi
			rm -rf "${dest}" 2> /dev/null
			ln -s "${final_src}" "${dest}"
			chown_ref "${src}" "${dest}"
		fi
	done
}

do_union ()
{
	local unionmountpoint="${1}"	# directory where the union is mounted
	local unionrw="${2}"		# branch where the union changes are stored
	local unionro1="${3}"		# first underlying read-only branch (optional)
	local unionro2="${4}"		# second underlying read-only branch (optional)

	case "${UNIONTYPE}" in
		aufs)
			rw_opt="rw"
			ro_opt="rr+wh"
			noxino_opt="noxino"
			;;

		unionfs-fuse)
			rw_opt="RW"
			ro_opt="RO"
			;;

		*)
			rw_opt="rw"
			ro_opt="ro"
			;;
	esac

	case "${UNIONTYPE}" in
		unionfs-fuse)
			unionmountopts="-o cow -o noinitgroups -o default_permissions -o allow_other -o use_ino -o suid"
			unionmountopts="${unionmountopts} ${unionrw}=${rw_opt}"
			if [ -n "${unionro1}" ]
			then
				unionmountopts="${unionmountopts}:${unionro1}=${ro_opt}"
			fi
			if [ -n "${unionro2}" ]
			then
				unionmountopts="${unionmountopts}:${unionro2}=${ro_opt}"
			fi
			( sysctl -w fs.file-max=391524 ; ulimit -HSn 16384
			unionfs-fuse ${unionmountopts} "${unionmountpoint}" ) && \
			( mkdir -p /run/sendsigs.omit.d
			pidof unionfs-fuse >> /run/sendsigs.omit.d/unionfs-fuse || true )
			;;

		overlayfs)
			# XXX: can unionro2 be used? (overlayfs only handles two dirs, but perhaps they can be chained?)
			# XXX: and can unionro1 be optional? i.e. can overlayfs skip lowerdir?
			unionmountopts="-o noatime,lowerdir=${unionro1},upperdir=${unionrw}"
			mount -t ${UNIONTYPE} ${unionmountopts} ${UNIONTYPE} "${unionmountpoint}"
			;;

		*)
			unionmountopts="-o noatime,${noxino_opt},dirs=${unionrw}=${rw_opt}"
			if [ -n "${unionro1}" ]
			then
				unionmountopts="${unionmountopts}:${unionro1}=${ro_opt}"
			fi
			if [ -n "${unionro2}" ]
			then
				unionmountopts="${unionmountopts}:${unionro2}=${ro_opt}"
			fi
			mount -t ${UNIONTYPE} ${unionmountopts} ${UNIONTYPE} "${unionmountpoint}"
			;;
	esac
}

get_custom_mounts ()
{
	# Side-effect: leaves $devices with live-persistence.conf mounted in /live/persistence
	# Side-effect: prints info to file $custom_mounts

	local custom_mounts=${1}
	shift
	local devices=${@}

	local bindings="/tmp/bindings.list"
	local links="/tmp/links.list"
	rm -rf ${bindings} ${links} 2> /dev/null

	for device in ${devices}
	do
		if [ ! -b "${device}" ]
		then
			continue
		fi

		local device_name="$(basename ${device})"
		local backing=$(mount_persistence_media ${device})
		if [ -z "${backing}" ]
		then
			continue
		fi

		local include_list="${backing}/${persistence_list}"
		if [ ! -r "${include_list}" ]
		then
			continue
		fi

		if [ -n "${DEBUG}" ] && [ -e "${include_list}" ]
		then
			cp ${include_list} /live/persistence/${persistence_list}.${device_name}
		fi

		while read dir options # < ${include_list}
		do
			if echo ${dir} | grep -qe "^[[:space:]]*\(#.*\)\?$"
			then
				# skipping empty or commented lines
				continue
			fi

			if trim_path ${dir} | grep -q -e "^[^/]" -e "^/live\(/.*\)\?$" -e "^/\(.*/\)\?\.\.\?\(/.*\)\?$"
			then
				log_warning_msg "Skipping unsafe custom mount ${dir}: must be an absolute path containing neither the \".\" nor \"..\" special dirs, and cannot be \"/live\" or any sub-directory therein."
				continue
			fi

			local opt_source=""
			local opt_link=""
			for opt in $(echo ${options} | tr ',' ' ');
			do
				case "${opt}" in
					source=*)
						opt_source=${opt#source=}
						;;
					link)
						opt_link="true"
						;;
					union|bind)
						;;
					*)
						log_warning_msg "Skipping custom mount with unkown option: ${opt}"
						continue 2
						;;
				esac
			done

			local source="${dir}"
			if [ -n "${opt_source}" ]
			then
				if echo ${opt_source} | grep -q -e "^/" -e "^\(.*/\)\?\.\.\?\(/.*\)\?$" && [ "${source}" != "." ]
				then
					log_warning_msg "Skipping unsafe custom mount with option source=${opt_source}: must be either \".\" (the media root) or a relative path w.r.t. the media root that contains neither comas, nor the special \".\" and \"..\" path components"
					continue
				else
					source="${opt_source}"
				fi
			fi

			local full_source="$(trim_path ${backing}/${source})"
			local full_dest="$(trim_path ${rootmnt}/${dir})"
			if [ -n "${opt_link}" ]
			then
				echo "${device} ${full_source} ${full_dest} ${options}" >> ${links}
			else
				echo "${device} ${full_source} ${full_dest} ${options}" >> ${bindings}
			fi
		done < ${include_list}
	done

	# We sort the list according to destination so we're sure that
	# we won't hide a previous mount. We also ignore duplicate
	# destinations in a more or less arbitrary way.
	[ -e "${bindings}" ] && sort -k3 -sbu ${bindings} >> ${custom_mounts} && rm ${bindings}

	# After all mounts are considered we add symlinks so they
	# won't be hidden by some mount.
	[ -e "${links}" ] && cat ${links} >> ${custom_mounts} && rm ${links}

	# We need to make sure that no two custom mounts have the same sources
	# or are nested; if that is the case, too much weird stuff can happen.
	local prev_source="impossible source" # first iteration must not match
	local prev_dest=""
	# This sort will ensure that a source /a comes right before a source
	# /a/b so we only need to look at the previous source
	sort -k2 -b ${custom_mounts} |
	while read device source dest options
	do
		if echo ${source} | grep -qe "^${prev_source}\(/.*\)\?$"
		then
			panic "Two persistence mounts have the same or nested sources: ${source} on ${dest}, and ${prev_source} on ${prev_dest}"
		fi
		prev_source=${source}
		prev_dest=${dest}
	done
}

activate_custom_mounts ()
{
	local custom_mounts="${1}" # the ouput from get_custom_mounts()
	local used_devices=""

	while read device source dest options # < ${custom_mounts}
	do
		local opt_bind="true"
		local opt_link=""
		local opt_union=""
		for opt in $(echo ${options} | tr ',' ' ');
		do
			case "${opt}" in
				bind)
					opt_bind="true"
					unset opt_link opt_union
					;;
				link)
					opt_link="true"
					unset opt_bind opt_union
					;;
				union)
					opt_union="true"
					unset opt_bind opt_link
					;;
			esac
		done

		if [ -n "$(what_is_mounted_on "${dest}")" ]
		then
			if [ "${dest}" = "${rootmnt}" ]
			then
				umount "${dest}"
			else
				log_warning_msg "Skipping custom mount ${dest}: $(what_is_mounted_on "${dest}") is already mounted there"
				continue
			fi
		fi

		if [ ! -d "${dest}" ]
		then
			# create the destination and delete existing files in
			# its path that are in the way
			path="/"
			for dir in $(echo ${dest} | sed -e 's|/\+| |g')
			do
				path=$(trim_path ${path}/${dir})
				if [ -f ${path} ]
				then
					rm -f ${path}
				fi
				if [ ! -e ${path} ]
				then
					mkdir -p ${path}
					if echo ${path} | grep -qe "^${rootmnt}/*home/[^/]\+"
					then
						# if ${dest} is in /home try fixing proper ownership by assuming that the intended user is the first, which is usually the case
						# FIXME: this should really be handled by live-config since we don't know for sure which uid a certain user has until then
						chown 1000:1000 ${path}
					fi
				fi
			done
		fi

		# if ${source} doesn't exist on our persistence media
		# we bootstrap it with $dest from the live filesystem.
		# this both makes sense and is critical if we're
		# dealing with /etc or other system dir.
		if [ ! -d "${source}" ]
		then
			if [ -n "${PERSISTENCE_READONLY}" ]
			then
				continue
			elif [ -n "${opt_union}" ] || [ -n "${opt_link}" ]
			then
				# unions and don't need to be bootstrapped
				# link dirs can't be bootstrapped in a sensible way
				mkdir -p "${source}"
				chown_ref "${dest}" "${source}"
				chmod_ref "${dest}" "${source}"
			elif [ -n "${opt_bind}" ]
			then
				# ensure that $dest is not copied *into* $source
				mkdir -p "$(dirname ${source})"
				cp -a "${dest}" "${source}"
			fi
		fi

		# XXX: If CONFIG_AUFS_ROBR is added to the Debian kernel we can
		# ignore the loop below and set rofs_dest_backing=$dest
		local rofs_dest_backing=""
		if [ -n "${opt_link}"]
		then
			for d in /live/rofs/*
			do
				if [ -n "${rootmnt}" ]
				then
					rofs_dest_backing="${d}/$(echo ${dest} | sed -e "s|${rootmnt}||")"
				else
					rofs_dest_backing="${d}/${dest}"
				fi
				if [ -d "${rofs_dest_backing}" ]
				then
					break
				else
					rofs_dest_backing=""
				fi
			done
		fi

		if [ -n "${opt_link}" ] && [ -z "${PERSISTENCE_READONLY}" ]
		then
			link_files ${source} ${dest} ${rootmnt}
		elif [ -n "${opt_link}" ] && [ -n "${PERSISTENCE_READONLY}" ]
		then
			mkdir -p /live/persistence
			local links_source=$(mktemp -d /live/persistence/links-source-XXXXXX)
			chown_ref ${source} ${links_source}
			chmod_ref ${source} ${links_source}
			# We put the cow dir in the below strange place to
			# make it absolutely certain that the link source
			# has its own directory and isn't nested with some
			# other custom mount (if so that mount's files would
			# be linked, causing breakage.
			local cow_dir="/live/overlay/live/persistence/$(basename ${links_source})"
			mkdir -p ${cow_dir}
			chown_ref "${source}" "${cow_dir}"
			chmod_ref "${source}" "${cow_dir}"
			do_union ${links_source} ${cow_dir} ${source} ${rofs_dest_backing}
			link_files ${links_source} ${dest} ${rootmnt}
		elif [ -n "${opt_union}" ] && [ -z "${PERSISTENCE_READONLY}" ]
		then
			do_union ${dest} ${source} ${rofs_dest_backing}
		elif [ -n "${opt_bind}" ] && [ -z "${PERSISTENCE_READONLY}" ]
		then
			mount --bind "${source}" "${dest}"
		elif [ -n "${opt_bind}" -o -n "${opt_union}" ] && [ -n "${PERSISTENCE_READONLY}" ]
		then
			# bind-mount and union mount are handled the same
			# in read-only mode, but note that rofs_dest_backing
			# is non-empty (and necessary) only for unions
			if [ -n "${rootmnt}" ]
			then
				local cow_dir="$(echo ${dest} | sed -e "s|^${rootmnt}|/live/overlay/|")"
			else
				# This is happens if persistence is activated
				# post boot
				local cow_dir="/live/overlay/${dest}"
			fi
			if [ -e "${cow_dir}" ] && [ -z "${opt_link}" ]
			then
				# If an earlier custom mount has files here
				# it will "block" the current mount's files
				# which is undesirable
				rm -rf "${cow_dir}"
			fi
			mkdir -p ${cow_dir}
			chown_ref "${source}" "${cow_dir}"
			chmod_ref "${source}" "${cow_dir}"
			do_union ${dest} ${cow_dir} ${source} ${rofs_dest_backing}
		fi

		PERSISTENCE_IS_ON="1"
		export PERSISTENCE_IS_ON

		if echo ${used_devices} | grep -qve "^\(.* \)\?${device}\( .*\)\?$"
		then
			used_devices="${used_devices} ${device}"
		fi
	done < ${custom_mounts}

	echo ${used_devices}
}

fix_backwards_compatibility ()
{
	local device=${1}
	local dir=${2}
	local opt=${3}

	if [ -n "${PERSISTENCE_READONLY}" ]
	then
		return
	fi

	local backing="$(mount_persistence_media ${device})"
	if [ -z "${backing}" ]
	then
		return
	fi

	local include_list="${backing}/${persistence_list}"
	if [ ! -r "${include_list}" ]
	then
		echo "# persistence backwards compatibility:
${dir} ${opt},source=." > "${include_list}"
	fi
}

is_mountpoint ()
{
	directory="$1"

	[ $(stat -fc%d:%D "${directory}") != $(stat -fc%d:%D "${directory}/..") ]
}
