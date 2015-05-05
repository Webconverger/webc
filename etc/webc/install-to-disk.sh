#!/bin/bash
. "/etc/webc/functions.sh"
. "/etc/webc/webc.conf"

# Set up:
#   - fd 1 (stdout) to write to install.log
#   - fd 2 (stderr) to write to install.log
#   - fd 3 to write to install.log as well (useful inside command
#     substitutions  where stdout is not available)
#   - fd 4 to write to the console
# Don't write to fd 3 and 4 directly, use _logs or _err instead.
install_log="/root/install.log"

exec >>"$install_log" 2>&1 3>&1 4>/dev/console

set -e

# If the shell exists, we assume the install failed. If the install succeeds,
# the EXIT trap is removed just before exiting the script, so this handler
# does not trigger.
failed_install() {
	echo -e "\n\n\n\tINSTALL FAILED\n\n\n" >&4
	echo -e "Here's some log output that may help (see $install_log for more):\n" >&4
	tail /root/install.log >&4

	# Clean up mounts
	[ -n "$SWAPON" ] && swapoff /mnt/root/swap
	[ -n "$MOUNTED" ] && umount -f -l -r /mnt/root

	_logs "press enter to try start over..."
	read DUMMY
	# init should restart us.
}

clear_screen() {
	for i in `seq 200`; do
		echo >&4
	done
}

_logs() {
	# Write to install.log
	echo ">> $@" >&3
	# Write to console
	echo ">> $@" >&4
}
_err() {
	_logs "ERR:" "$@"
	return 1
}

describe_disk() {
	local name=$(basename $1)
	model=$(cat "/sys/block/${name}/device/model")
	# Convert from 512-byte sectors to GiB
	size_gib=$(cat "/sys/block/${name}/size" | awk '{printf "%0.2f", $1*512/1024/1024/1024}')
	size_gb=$(cat "/sys/block/${name}/size" | awk '{printf "%0.2f", $1*512/1000/1000/1000}')

	echo "${model} (${size_gib}GiB / ${size_gb}GB)"
}

find_disk() {
	_logs "finding disk"
	while true; do
		local disk
		local choices=() # Use an array so we can have spaces in the titles
		for dev in /dev/[sh]d?; do
			# TODO: Filter out the device we're currently booting from
			if test -e $dev; then
				choices+=($dev "$(describe_disk "${dev}")")
			fi
		done

		chosen=$(dialog --cancel-label "Reload" --menu "Select disk to install onto:" 17 60 10 "${choices[@]}" 2>&1 1>&4)
		model=$(describe_disk "${chosen}")
		msg="You are about to install to the following disk:\n\n${chosen} - ${model}\n\nThis will permanently and completely erase any data that is currently on this disk!\n\nDo you really want to continue?" 1>&4

		if [ -n "${chosen}" ] && dialog --defaultno --title "Are you sure?" --yesno "${msg}" 0 0 1>&4; then
			break
		fi
	done
	echo "${chosen}"
}
partition_disk() {
	local disk="$1"
	_logs "partitioning ${disk}"
	/sbin/sfdisk $disk <<EOF
,,L,*
EOF
}
verify_partition() {
	local disk="$1"
	_logs "verifying partitions on ${disk}"
	test -e ${disk}1
	# /sbin/sfdisk -V -q $disk  # never times out when 0 partitions exist
}	
md5() { md5sum | awk '{ print $1 }'; }
verify_extlinux_mbr() {
	local disk="$1"
	_logs "verifying mbr on ${disk}"
	a=$( md5 < /usr/lib/EXTLINUX/mbr.bin )
	b=$( dd if=$disk bs=440c count=1 2>/dev/null | md5 )
	test "$a" = "$b" && return 0
	return 1
}
install_extlinux() {
	local dir="$1"
	local part="$2"
	local disk="$3"

	_logs "installing mbr to ${disk}"
	dd if=/usr/lib/EXTLINUX/mbr.bin of="${disk}" bs=440 count=1

	_logs "installing extlinux to ${dir}/boot/extlinux"
	mkdir -p "${dir}/boot/extlinux"
	extlinux --install "${dir}/boot/extlinux"
	test -e "${dir}/boot/extlinux/ldlinux.sys" || _err "no ${dir}/boot/extlinux/ldlinux.sys?"
	rm -f "${dir}/boot/extlinux/boot.txt"

	_logs "generating extlinux configuration"

	# Extract kernel and initrd and generate extlinux config
	generate_installed_config "${dir}" "${git_repo}" "${current_git_revision}"
}

setup_root() {
	local mount=$1
	local partition=$2
	_logs "building filesystem on $partition"
	mke2fs -j $partition

	_logs "mounting $partition on $mount"
	test -d $mount || mkdir $mount
	mount $partition $mount
	MOUNTED=1

	_logs "enabling swap on ${mount}/swap"
	dd if=/dev/zero of=${mount}/swap bs=1M count=256
	mkswap ${mount}/swap
	swapon ${mount}/swap
	SWAPON=1

	_logs "copying files to ${mount}"
	mkdir -p "${mount}/live"
	cp -r ${git_repo} ${mount}/live/
}

# Trap any shell exits with the failed handler
trap failed_install EXIT

clear_screen
disk=$( find_disk )
root_partition=${disk}1
root_mount=/mnt/root
partition_disk $disk
verify_partition $disk
setup_root $root_mount $root_partition
install_extlinux $root_mount $root_partition $disk
verify_extlinux_mbr $disk

_logs "unmounting partitions"
swapoff /mnt/root/swap
umount /mnt/root
unset SWAPON MOUNTED

_logs "install complete"
e2label $root_partition install
_logs $(blkid)
_logs "press enter to reboot..."
read DUMMY
# Install did not fail, unregister the trap (do this before the
# reboot, since the reboot might kill us before we get to
# exit ourselves)
trap - EXIT

/sbin/reboot
