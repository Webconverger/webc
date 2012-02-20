TARGETS = live-config mountkernfs.sh udev keymap.sh keyboard-setup console-setup mountall.sh mountoverflowtmp mountnfs.sh mountnfs-bootclean.sh hwclock.sh urandom networking ifupdown ifupdown-clean alsa-utils checkroot.sh hostname.sh procps module-init-tools mtab.sh mountdevsubfs.sh bootmisc.sh udev-mtab hwclockfirst.sh kbd checkfs.sh x11-common mountall-bootclean.sh bootlogd stop-bootlogd-single live-boot
INTERACTIVE = udev keymap.sh keyboard-setup console-setup checkroot.sh kbd checkfs.sh
udev: mountkernfs.sh
keymap.sh: bootlogd mountdevsubfs.sh
keyboard-setup: mountkernfs.sh keymap.sh udev bootlogd
console-setup: mountall.sh mountoverflowtmp mountnfs.sh mountnfs-bootclean.sh kbd
mountall.sh: checkfs.sh
mountoverflowtmp: mountall-bootclean.sh
mountnfs.sh: mountall.sh mountoverflowtmp networking ifupdown
mountnfs-bootclean.sh: mountall.sh mountoverflowtmp mountnfs.sh
hwclock.sh: checkroot.sh bootlogd
urandom: mountall.sh mountoverflowtmp
networking: mountkernfs.sh mountall.sh mountoverflowtmp ifupdown
ifupdown: ifupdown-clean
ifupdown-clean: mountdevsubfs.sh hostname.sh
alsa-utils: mountall.sh mountoverflowtmp mountnfs.sh mountnfs-bootclean.sh udev
checkroot.sh: hwclockfirst.sh mountdevsubfs.sh hostname.sh keymap.sh bootlogd keyboard-setup
hostname.sh: bootlogd
procps: mountkernfs.sh mountall.sh mountoverflowtmp udev module-init-tools bootlogd
module-init-tools: checkroot.sh
mtab.sh: checkroot.sh
mountdevsubfs.sh: mountkernfs.sh udev
bootmisc.sh: mountall.sh mountoverflowtmp mountnfs.sh mountnfs-bootclean.sh udev
udev-mtab: udev mountall.sh mountoverflowtmp
hwclockfirst.sh: mountdevsubfs.sh bootlogd
kbd: mountall.sh mountoverflowtmp mountnfs.sh mountnfs-bootclean.sh
checkfs.sh: checkroot.sh mtab.sh
x11-common: mountall.sh mountoverflowtmp
mountall-bootclean.sh: mountall.sh
bootlogd: mountdevsubfs.sh
stop-bootlogd-single: mountall.sh mountoverflowtmp udev keymap.sh keyboard-setup console-setup mountnfs.sh mountnfs-bootclean.sh hwclock.sh urandom networking mountkernfs.sh ifupdown ifupdown-clean alsa-utils checkroot.sh hostname.sh procps module-init-tools mtab.sh mountdevsubfs.sh bootmisc.sh live-config udev-mtab hwclockfirst.sh kbd checkfs.sh x11-common mountall-bootclean.sh bootlogd live-boot
live-boot: bootmisc.sh mountall.sh mountoverflowtmp
