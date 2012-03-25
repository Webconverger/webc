#!/bin/sh
. "/etc/webc/webc.conf"
set -x
exec 2>&1
exec > /tmp/install.log

find_disk() {
	logs "finding disk"
	for disk in /dev/hda /dev/sda; do
		test -e $disk && { echo $disk ; return 0; }
	done
}
partition_disk() {
	local disk="$1"
	logs "partitioning ${disk}"
	cat<<EOF | sed -e "s#DISK#${disk}#" |/sbin/sfdisk $disk 
unit: sectors

DISK1 : start=     2048, size=   3145728, Id=83, bootable
EOF
}
verify_partition() {
	local disk="$1"
	logs "verifying partitions on ${disk}"
	/sbin/sfdisk -V -q $disk && return 0
	# scream / abort?
}	
install_extlinux() {
	local dir="$1"
	logs "installing extlinux to ${dir}"
	extlinux --install "${dir}/extlinux"
}
install_root() {
	local dir="$1"
	logs "installing root to ${dir}"
	unsquashfs -f -n -d $dir /live/image/live/filesystem.squashfs 
}
user_setup() {
	local dir="$1"
	logs "user setup"
	chroot $dir groupadd webc
	chroot $dir useradd -g webc webc
	chroot $dir chown -R webc:webc /home/webc
}

! grep -qs install /proc/cmdline && exec sleep 86400
while ! wget -q -O /etc/webc/cmdline $config_url; do sleep 5; done
disk=$( find_disk )
partition_disk $disk
verify_partition $disk
mke2fs -j ${disk}1
test -d /mnt/root || mkdir /mnt/root
mount ${disk}1 /mnt/root
dd if=/dev/zero of=/mnt/root/swap bs=1M count=256
mkswap /mnt/root/swap
swapon /mnt/root/swap
install_root /mnt/root
install_extlinux /mnt/root/

( cd /mnt/root/boot && ln -s . boot )

cat<<EOF >> /mnt/root/boot/extlinux/extlinux.conf
include stdmenu.cfg
default l0
EOF


sed -i \
	-e 's/^\(prompt\).*/\1 0/' \
	-e 's/^\(timeout\).*/\1 2/' \
	/mnt/root/boot/extlinux/extlinux.conf 

sed -i \
	-e 's#\(append.*\)#\1 root=/dev/sda3 quiet silent #' \
	/mnt/root/boot/extlinux/linux.cfg

sed -i \
	-e 's/^.sudo.*/webc ALL=NOPASSWD: ALL/' \
	/mnt/root/etc/sudoers 

logs "adding fstab"
cat<<EOF > /mnt/root/etc/fstab
proc /proc proc defaults 0 0
/dev/sda1 / ext3 defaults 0 0
/swap none swap sw 0 0
EOF

user_setup /mnt/root
grep -qs '^webc' /mnt/root/etc/passwd || {
	logs "user setup failed"
}

cat<<EOF > /mnt/root/etc/hosts
127.0.0.1	localhost localhost.localdomain
EOF

cat<<EOF >> /etc/network/interfaces
auto eth0
EOF

cp /etc/webc/cmdline /mnt/root/etc/webc/cmdline

logs "umount'ing partitions"
umount ${disk}1
logs "install complete"
/sbin/reboot
