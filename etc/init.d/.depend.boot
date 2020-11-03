TARGETS = mountkernfs.sh hostname.sh udev keyboard-setup.sh mountdevsubfs.sh hwclock.sh mountnfs.sh mountnfs-bootclean.sh mountall.sh mountall-bootclean.sh alsa-utils urandom checkroot.sh brightness checkroot-bootclean.sh bootmisc.sh x11-common procps checkfs.sh kmod plymouth-log
INTERACTIVE = udev keyboard-setup.sh checkroot.sh checkfs.sh
udev: mountkernfs.sh
keyboard-setup.sh: mountkernfs.sh
mountdevsubfs.sh: udev
hwclock.sh: mountdevsubfs.sh
mountnfs.sh: mountall.sh mountall-bootclean.sh
mountnfs-bootclean.sh: mountall.sh mountall-bootclean.sh mountnfs.sh
mountall.sh: checkfs.sh checkroot-bootclean.sh
mountall-bootclean.sh: mountall.sh
alsa-utils: mountall.sh mountall-bootclean.sh mountnfs.sh mountnfs-bootclean.sh
urandom: hwclock.sh mountall.sh mountall-bootclean.sh
checkroot.sh: hwclock.sh keyboard-setup.sh hostname.sh
brightness: mountall.sh mountall-bootclean.sh
checkroot-bootclean.sh: checkroot.sh
bootmisc.sh: udev checkroot-bootclean.sh mountnfs.sh mountnfs-bootclean.sh mountall.sh mountall-bootclean.sh
x11-common: mountnfs.sh mountnfs-bootclean.sh
procps: udev mountall.sh mountall-bootclean.sh
checkfs.sh: checkroot.sh
kmod: checkroot.sh
plymouth-log: mountall.sh mountall-bootclean.sh mountnfs.sh mountnfs-bootclean.sh
