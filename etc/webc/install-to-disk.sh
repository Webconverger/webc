#!/bin/bash
. "/etc/webc/webc.conf"
exec &> /root/install.log

clear_screen() {
	for i in `seq 200`; do
		echo > /dev/console
	done
}
add_root() {
	sed -i 's/^root:x:\(.*\)/root::\1/' /etc/passwd
}

_logs() {
	echo "$@" > /dev/console
}
_err() {
	_logs "ERR:" "$@"
}

find_disk() {
	_logs "finding disk"
	for disk in /dev/hda /dev/sda; do
		test -e $disk && { echo $disk ; return 0; }
	done
}
partition_disk() {
	local disk="$1"
	_logs "partitioning ${disk}"
	cat<<EOF | sed -e "s#DISK#${disk}#" |/sbin/sfdisk $disk 
unit: sectors

DISK1 : start=     2048, Id=83, bootable
EOF
}
verify_partition() {
	local disk="$1"
	_logs "verifying partitions on ${disk}"
	/sbin/sfdisk -V -q $disk && return 0
	# scream / abort?
}	
install_extlinux() {
	local dir="$1"
	local disk="$2"
	_logs "installing extlinux to ${dir}"

	extlinux --install ${dir}
	rm -f ${dir}/boot.txt
	test -e ${dir}/ldlinux.sys || _err "extlinux install failed"

cat<<EOF >> ${dir}/linux.cfg

label fail
	linux /boot/vmlinuz-old 
	append initrd=/boot/initrd.img-old quiet
EOF

sed -i \
	-e 's/^\(prompt\).*/\1 0/' \
	-e 's/^\(timeout\).*/\1 50/' \
	-e 's/^\(display\).*//' \
	${dir}/extlinux.conf 

sed -i \
	-e 's|\(append.*\)|\1 boot=local root='$disk' |' \
	${dir}/linux.cfg

	( cd ${dir}/.. && ln -s . boot )

}
install_root() {
	local dir="$1"
	_logs "installing root to ${dir}, this will take several minutes"
	unsquashfs -f -n -d $dir /live/image/live/filesystem.squashfs 
}
user_setup() {
	local dir="$1"
	_logs "user setup"
	chroot $dir groupadd webc
	chroot $dir useradd -g webc webc
	chroot $dir chown -R webc:webc /home/webc
	grep -qs '^webc' ${dir}/etc/passwd || {
		_err "user setup failed"
	}
}

install_files() {
	dir="$1"
	disk="$2"
	sed -i 's/^root::\(.*\)/root:x:\1/' ${dir}/etc/passwd

	sed -i \
		-e 's/^.sudo.*/webc ALL=NOPASSWD: ALL/' \
		${dir}/etc/sudoers 

	cat<<EOF > ${dir}/etc/fstab
proc /proc proc defaults 0 0
${disk} / ext3 defaults 0 0
/swap none swap sw 0 0
EOF


	cat<<EOF > ${dir}/etc/hosts
127.0.0.1	localhost localhost.localdomain
EOF

	cat<<EOF >> ${dir}/etc/network/interfaces
EOF

}

! grep -qs install /proc/cmdline && exec sleep 86400
clear_screen
cmdline_has debug && echo "debug has been enabled" >/dev/console
add_root
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
install_files /mnt/root $partition
user_setup /mnt/root
install_extlinux /mnt/root/boot/extlinux $partition

_logs "umount'ing partitions"
umount /mnt/root
_logs "install complete"
if cmdline_has debug; then
	exec sleep 86400
fi
_logs "rebooting..."
/sbin/reboot
