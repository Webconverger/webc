TARGETS = mountkernfs.sh hostname.sh udev keyboard-setup.sh mountdevsubfs.sh hwclock.sh checkroot.sh mountall.sh mountall-bootclean.sh mountnfs.sh mountnfs-bootclean.sh urandom alsa-utils bootmisc.sh x11-common checkroot-bootclean.sh kmod procps plymouth-log checkfs.sh
INTERACTIVE = udev keyboard-setup.sh checkroot.sh checkfs.sh
udev: mountkernfs.sh
keyboard-setup.sh: mountkernfs.sh
mountdevsubfs.sh: mountkernfs.sh udev
hwclock.sh: mountdevsubfs.sh
checkroot.sh: hwclock.sh mountdevsubfs.sh hostname.sh keyboard-setup.sh
mountall.sh: checkfs.sh checkroot-bootclean.sh
mountall-bootclean.sh: mountall.sh
mountnfs.sh: mountall.sh mountall-bootclean.sh
mountnfs-bootclean.sh: mountall.sh mountall-bootclean.sh mountnfs.sh
urandom: mountall.sh mountall-bootclean.sh hwclock.sh
alsa-utils: mountall.sh mountall-bootclean.sh mountnfs.sh mountnfs-bootclean.sh
bootmisc.sh: mountall-bootclean.sh checkroot-bootclean.sh mountnfs-bootclean.sh mountall.sh mountnfs.sh udev
x11-common: mountall.sh mountall-bootclean.sh mountnfs.sh mountnfs-bootclean.sh
checkroot-bootclean.sh: checkroot.sh
kmod: checkroot.sh
procps: mountkernfs.sh mountall.sh mountall-bootclean.sh udev
plymouth-log: mountall.sh mountall-bootclean.sh mountnfs.sh mountnfs-bootclean.sh
checkfs.sh: checkroot.sh
