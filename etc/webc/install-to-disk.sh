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

find_disk() {
	_logs "finding disk"
	local disk
	for disk in /dev/[sh]d?; do
		test -e $disk && { echo $disk ; return 0; }
	done
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
	a=$( md5 < /usr/lib/extlinux/mbr.bin )
	b=$( dd if=$disk bs=440c count=1 2>/dev/null | md5 )
	test "$a" = "$b" && return 0
	return 1
}
install_extlinux() {
	local dir="$1"
	local part="$2"
	local disk="$3"

	_logs "installing mbr to ${disk}"
	dd if=/usr/lib/extlinux/mbr.bin of="${disk}" bs=440 count=1 2> /dev/null

	_logs "installing extlinux to ${dir}/boot/extlinux"
	mkdir -p "${dir}/boot/extlinux"
	extlinux --install "${dir}/boot/extlinux"
	test -e "${dir}/boot/extlinux/ldlinux.sys" || _err "no ${dir}/boot/extlinux/ldlinux.sys?"
	rm -f "${dir}/boot/extlinux/boot.txt"

	_logs "generating extlinux configuration"

	git_repo=/live/image/live/filesystem.git

	if cmdline_has git-revision
	then
		git_revision=$(cmdline_get git-revision)
	else
		git_revision=$(git --git-dir "${git_repo}" rev-parse HEAD)
	fi

	# Extract kernel and initrd and generate extlinux config
	generate_installed_config "${dir}" "${git_repo}" "${git_revision}"
}

install_root() {
	local dir="$1"
	_logs "copying files to ${dir}"
	mkdir -p "${dir}/live"
	cp -r /live/image/live/filesystem.git ${dir}/live/
}

if cmdline_has install
then
	# Trap any shell exits with the failed handler
	trap failed_install EXIT

	clear_screen
	cmdline_has debug && _logs "debug has been enabled"
	disk=$( find_disk )
	partition_disk $disk
	verify_partition $disk
	partition="${disk}1"
	_logs "building filesystem on $partition"
	mke2fs -j $partition
	_logs "mounting $partition on /mnt/root"
	test -d /mnt/root || mkdir /mnt/root
	MOUNTED=1
	mount $partition /mnt/root
	dd if=/dev/zero of=/mnt/root/swap bs=1M count=256
	_logs "enabling swap on /mnt/root/swap"
	mkswap /mnt/root/swap
	swapon /mnt/root/swap
	SWAPON=1
	install_root /mnt/root
	install_extlinux /mnt/root $partition $disk
	verify_extlinux_mbr $disk

	_logs "unmounting partitions"
	swapoff /mnt/root/swap
	umount /mnt/root
	unset SWAPON MOUNTED

	_logs "install complete"
	e2label $partition install
	_logs $(blkid)
	_logs "press enter to reboot..."
	read DUMMY
	# Install did not fail, unregister the trap (do this before the
	# reboot, since the reboot might kill us before we get to
	# exit ourselves)
	trap - EXIT

	/sbin/reboot
else
	exec sleep 86400
fi
