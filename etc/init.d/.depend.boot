TARGETS = mountkernfs.sh hostname.sh udev keyboard-setup mountdevsubfs.sh console-setup hwclock.sh checkroot.sh mountall.sh mountall-bootclean.sh mountnfs.sh mountnfs-bootclean.sh urandom alsa-utils bootmisc.sh kbd plymouth-log x11-common checkroot-bootclean.sh udev-finish kmod procps checkfs.sh
INTERACTIVE = udev keyboard-setup console-setup checkroot.sh kbd checkfs.sh
udev: mountkernfs.sh
keyboard-setup: mountkernfs.sh udev
mountdevsubfs.sh: mountkernfs.sh udev
console-setup: mountall.sh mountall-bootclean.sh mountnfs.sh mountnfs-bootclean.sh kbd
hwclock.sh: mountdevsubfs.sh
checkroot.sh: hwclock.sh mountdevsubfs.sh hostname.sh keyboard-setup
mountall.sh: checkfs.sh checkroot-bootclean.sh
mountall-bootclean.sh: mountall.sh
mountnfs.sh: mountall.sh mountall-bootclean.sh
mountnfs-bootclean.sh: mountall.sh mountall-bootclean.sh mountnfs.sh
urandom: mountall.sh mountall-bootclean.sh hwclock.sh
alsa-utils: mountall.sh mountall-bootclean.sh mountnfs.sh mountnfs-bootclean.sh
bootmisc.sh: mountall-bootclean.sh mountall.sh mountnfs.sh mountnfs-bootclean.sh udev checkroot-bootclean.sh
kbd: mountall.sh mountall-bootclean.sh mountnfs.sh mountnfs-bootclean.sh
plymouth-log: mountall.sh mountall-bootclean.sh mountnfs.sh mountnfs-bootclean.sh
x11-common: mountall.sh mountall-bootclean.sh mountnfs.sh mountnfs-bootclean.sh
checkroot-bootclean.sh: checkroot.sh
udev-finish: udev mountall.sh mountall-bootclean.sh
kmod: checkroot.sh
procps: mountkernfs.sh mountall.sh mountall-bootclean.sh udev
checkfs.sh: checkroot.sh
