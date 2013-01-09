TARGETS = live-config mountkernfs.sh udev mountdevsubfs.sh keymap.sh keyboard-setup console-setup hwclock.sh checkroot.sh mountall.sh mountall-bootclean.sh urandom live bootmisc.sh alsa-utils mountnfs.sh mountnfs-bootclean.sh live-boot hostname.sh bootlogd procps udev-mtab kbd stop-bootlogd-single tmp-noexec checkfs.sh checkroot-bootclean.sh kmod mtab.sh x11-common
INTERACTIVE = udev keymap.sh keyboard-setup console-setup checkroot.sh live kbd checkfs.sh
mountkernfs.sh: live-config
udev: mountkernfs.sh
mountdevsubfs.sh: mountkernfs.sh udev
keymap.sh: bootlogd mountdevsubfs.sh
keyboard-setup: bootlogd mountkernfs.sh keymap.sh udev
console-setup: mountall.sh mountall-bootclean.sh mountnfs.sh mountnfs-bootclean.sh kbd
hwclock.sh: mountdevsubfs.sh bootlogd
checkroot.sh: hwclock.sh keyboard-setup mountdevsubfs.sh hostname.sh keymap.sh bootlogd
mountall.sh: checkfs.sh checkroot-bootclean.sh
mountall-bootclean.sh: mountall.sh
urandom: mountall.sh mountall-bootclean.sh hwclock.sh
live: bootmisc.sh mountall.sh mountall-bootclean.sh
bootmisc.sh: mountall.sh mountall-bootclean.sh mountnfs.sh mountnfs-bootclean.sh udev checkroot-bootclean.sh
alsa-utils: mountall.sh mountall-bootclean.sh mountnfs.sh mountnfs-bootclean.sh
mountnfs.sh: mountall.sh mountall-bootclean.sh
mountnfs-bootclean.sh: mountall.sh mountall-bootclean.sh mountnfs.sh
live-boot: bootmisc.sh mountall.sh mountall-bootclean.sh
hostname.sh: bootlogd
bootlogd: mountdevsubfs.sh
procps: bootlogd mountkernfs.sh mountall.sh mountall-bootclean.sh udev
udev-mtab: udev mountall.sh mountall-bootclean.sh
kbd: mountall.sh mountall-bootclean.sh mountnfs.sh mountnfs-bootclean.sh
stop-bootlogd-single: mountall.sh mountall-bootclean.sh udev keymap.sh keyboard-setup console-setup hwclock.sh mountdevsubfs.sh checkroot.sh mountkernfs.sh urandom live bootmisc.sh alsa-utils mountnfs.sh mountnfs-bootclean.sh live-boot hostname.sh bootlogd procps udev-mtab live-config kbd tmp-noexec checkfs.sh checkroot-bootclean.sh kmod mtab.sh x11-common
tmp-noexec: mountall.sh mountall-bootclean.sh mountnfs.sh mountnfs-bootclean.sh
checkfs.sh: checkroot.sh mtab.sh
checkroot-bootclean.sh: checkroot.sh
kmod: checkroot.sh
mtab.sh: checkroot.sh
x11-common: mountall.sh mountall-bootclean.sh mountnfs.sh mountnfs-bootclean.sh
