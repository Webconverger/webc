#!/bin/bash
. "/etc/webc/webc.conf"

install_log="/root/install.log"

exec &> "$install_log"

set -e

# If the shell exists, we assume the install failed. If the install succeeds,
# the EXIT trap is removed just before exiting the script, so this handler
# does not trigger.
failed_install() {
	if [ "$1" -ne 0 ]; then
		echo -e "\n\n\n\tINSTALL FAILED\n\n\n" >/dev/console
		echo -e "Here's some log output that may help (see $install_log for more):\n" >/dev/console
		tail /root/install.log >/dev/console

		exec sleep 86400
	fi
}

trap failed_install EXIT

clear_screen() {
	for i in `seq 200`; do
		echo > /dev/console
	done
}

_logs() {
	echo "$@" > /dev/console
}
_err() {
	_logs "ERR:" "$@"
}

find_disk() {
	_logs "finding disk"
	local disk
	for disk in /dev/hda /dev/sda; do
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
	_logs "installing extlinux configuration"
	test -e ${dir}/boot && _err " ${dir}/boot already exists?"

	cp -r /boot "${dir}"

	_logs "installing mbr to ${disk}"
	dd if=/usr/lib/extlinux/mbr.bin of="${disk}" bs=440 count=1 2> /dev/null
	_logs "installing extlinux to ${dir}/boot/extlinux"
	extlinux --install "${dir}/boot/extlinux"

	test -e ${dir}/boot/extlinux/ldlinux.sys || _err " no ${dir}/boot/extlinux/ldlinux.sys?"
	rm -f ${dir}/boot/extlinux/boot.txt

cat<<EOF >> ${dir}/boot/extlinux/linux.cfg

label fail
	linux /boot/vmlinuz-old 
	append initrd=/boot/initrd.img-old quiet
EOF

sed -i \
	-e 's/^\(prompt\).*/\1 0/' \
	-e 's/^\(timeout\).*/\1 50/' \
	-e 's/^\(display\).*//' \
	${dir}/boot/extlinux/extlinux.conf 

sed -i \
	-e 's|\(append.*\)|\1 boot=live |' \
	${dir}/boot/extlinux/linux.cfg

	( cd ${dir}/.. && ln -s . boot )

}
install_root() {
	local dir="$1"
	_logs "installing root to ${dir}, this will take several minutes"
	mkdir -p "${dir}/live"
	cp -r /live/image/live/filesystem.git ${dir}/live/
}

if cmdline_has install
then
	clear_screen
	cmdline_has debug && echo "debug has been enabled" >/dev/console
	disk=$( find_disk )
	partition_disk $disk
	verify_partition $disk
	partition="${disk}1"
	mke2fs -j $partition
	test -d /mnt/root || mkdir /mnt/root
	mount $partition /mnt/root
	dd if=/dev/zero of=/mnt/root/swap bs=1M count=256
	mkswap /mnt/root/swap
	swapon /mnt/root/swap
	install_root /mnt/root
	install_extlinux /mnt/root $partition $disk
	verify_extlinux_mbr $disk

	_logs "umount'ing partitions"
	swapoff /mnt/root/swap
	umount /mnt/root
	_logs "install complete"
	if cmdline_has debug; then
		exec sleep 86400
	fi
	_logs "rebooting..."
	/sbin/reboot 
else
	exec sleep 86400
fi

# Install did not fail, unregister the trap
trap - EXIT
