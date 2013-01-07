TARGETS = live-config mountkernfs.sh udev mountdevsubfs.sh keymap.sh keyboard-setup console-setup live bootmisc.sh mountall.sh mountall-bootclean.sh mountnfs.sh mountnfs-bootclean.sh hwclock.sh urandom alsa-utils checkroot.sh live-boot hostname.sh bootlogd procps udev-mtab kbd stop-bootlogd-single tmp-noexec checkfs.sh checkroot-bootclean.sh kmod mtab.sh x11-common
INTERACTIVE = udev keymap.sh keyboard-setup console-setup live checkroot.sh kbd checkfs.sh
mountkernfs.sh: live-config
udev: mountkernfs.sh
mountdevsubfs.sh: mountkernfs.sh udev
keymap.sh: bootlogd mountdevsubfs.sh
keyboard-setup: bootlogd mountkernfs.sh keymap.sh udev
console-setup: mountall.sh mountall-bootclean.sh mountnfs.sh mountnfs-bootclean.sh kbd
live: bootmisc.sh mountall.sh mountall-bootclean.sh
bootmisc.sh: mountall.sh mountall-bootclean.sh mountnfs.sh mountnfs-bootclean.sh udev checkroot-bootclean.sh
mountall.sh: checkfs.sh checkroot-bootclean.sh
mountall-bootclean.sh: mountall.sh
mountnfs.sh: mountall.sh mountall-bootclean.sh
mountnfs-bootclean.sh: mountall.sh mountall-bootclean.sh mountnfs.sh
hwclock.sh: mountdevsubfs.sh bootlogd
urandom: mountall.sh mountall-bootclean.sh hwclock.sh
alsa-utils: mountall.sh mountall-bootclean.sh mountnfs.sh mountnfs-bootclean.sh
checkroot.sh: hwclock.sh keyboard-setup mountdevsubfs.sh hostname.sh keymap.sh bootlogd
live-boot: bootmisc.sh mountall.sh mountall-bootclean.sh
hostname.sh: bootlogd
bootlogd: mountdevsubfs.sh
procps: bootlogd mountkernfs.sh mountall.sh mountall-bootclean.sh udev
udev-mtab: udev mountall.sh mountall-bootclean.sh
kbd: mountall.sh mountall-bootclean.sh mountnfs.sh mountnfs-bootclean.sh
stop-bootlogd-single: mountall.sh mountall-bootclean.sh udev keymap.sh keyboard-setup console-setup live bootmisc.sh mountnfs.sh mountnfs-bootclean.sh hwclock.sh urandom mountkernfs.sh alsa-utils mountdevsubfs.sh checkroot.sh live-boot hostname.sh bootlogd procps udev-mtab live-config kbd tmp-noexec checkfs.sh checkroot-bootclean.sh kmod mtab.sh x11-common
tmp-noexec: mountall.sh mountall-bootclean.sh mountnfs.sh mountnfs-bootclean.sh
checkfs.sh: checkroot.sh mtab.sh
checkroot-bootclean.sh: checkroot.sh
kmod: checkroot.sh
mtab.sh: checkroot.sh
x11-common: mountall.sh mountall-bootclean.sh mountnfs.sh mountnfs-bootclean.sh
