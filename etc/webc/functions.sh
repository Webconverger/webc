# installed config trumps boot cmdline
cmdline()
{
	test -e /proc/cmdline && cat /proc/cmdline
	test -e /etc/webc/cmdline && cat /etc/webc/cmdline
}

logs ()
{
	logger -t $0 -p daemon.info "$@"
}

cmdline_has()
{
	for i in `cmdline`
	do
		test "$1" = "${i%%=*}" && return 0
	done
	return 1
}

cmdline_get()
{
	local result=1
	local value
	for i in `cmdline`
	do
		test ${i/=*} = $1 && { value="${i#$1=}"; result=0; }
	done
	echo "${value}"
	return $result
}

cmdline_get_all()
{
	local result=1
	local value
	for i in `cmdline`
	do
		test ${i/=*} = $1 && { echo -n " ${i#$1=}"; result=0; }
	done
	return $result
}

mac_address()
{
	for i in /sys/class/net/*/address
	do
		tr -d ":" < $i
		return
	done
}


usb_serials() {

USBID_override=$(cmdline_get USBID_override)
if test "$USBID_override"
then
	echo "$USBID_override"
	return
fi

for i in /sys/bus/usb/devices/*/serial
do
	for j in $(dirname $i)/*/host*/target*/*/block/sd*
	do
		test -e "$j" && cat $i
	done
done
}

# http://stackoverflow.com/questions/11827252
wait_for()
{
	np=$(mktemp -u)
	mkfifo $np
	inotifywait -m -e create "$(dirname $1)" > $np 2>&1 & ipid=$!
	while read output
	do
		if test -p "$1"
		then
			kill $ipid
			break
		fi
	done < $np
	rm -f $np
}

has_network()
{
	netstat -rn | grep -qs '^0.0.0.0'
}

################################################################################
# Functions related to installing and updating
################################################################################

# Extract a kernel and initrd from git.
# dir           - The directory to store the kernel and initrd in
# flavour       - The flavour of kernel to extract
# postfix       - A postfix to use as the name of the kernel and initrd (e.g.,
#                 vmlinux${postfix} and initrd${postfix}.img
# git_repo      - The .git repository to look in
# git_revision  - The revision to look at
extract_kernel() {
	local dir="$1"
	local flavour="$2"
	local postfix="$3"
	local git_repo="$4"
	local git_revision="$5"

	# Find out the filenames for the kernel and
	# initrd for this flavour inside the new
	# rootfs
	local kernel=$(git --git-dir "${git_repo}" show "${git_revision}:boot" | grep ^vmlinuz-.*-${flavour}$ | head -n 1)
	local initrd=$(git --git-dir "${git_repo}" show "${git_revision}:boot" | grep ^initrd.img-.*-${flavour}$ | head -n 1)

	if [ -z "$kernel" -o -z "$initrd" ]; then
		logs "No kernel or initrd found in revision ${git_revision} for flavour ${flavour}!"
	fi

	# Fetch the actual files
	git --git-dir "${git_repo}" show "${git_revision}:boot/${kernel}" > ${dir}/vmlinuz${postfix}
	git --git-dir "${git_repo}" show "${git_revision}:boot/${initrd}" > ${dir}/initrd${postfix}.img
}

# Generate the boot params needed to boot the given revision. Boot parameters
# from the cmdline config are also included.
# git_repo      - The .git repository to look in
# git_revision  - The revision to look at
get_bootparams()
{
	local git_repo="$1"
	local git_revision="$2"

	# Get bootparams from inside the new rootfs. This
	# allows having bootparams that are specific to a
	# given rootfs / revision.
	local rootfs_bootparams=$(git --git-dir "${git_repo}" show "${git_revision}:etc/webc/boot-cmdline" | grep -v "^#" | head -n 1)

	# The bootparams to pass
	echo "${rootfs_bootparams} $(cmdline_get_all boot_append) git-revision=${git_revision}"
}

# Extract a kernel and generate a bootloader configuration for a live boot of
# the given revision. This regenerates live.cfg (based on live.cfg.in), but
# leaves the main bootloader config alone.
# dir           - The directory where the disk is mounted (e.g. which contains
#                 the live and boot directories)
# git_repo      - The .git repository to look in
# git_revision  - The revision to look at
generate_live_config()
{
	local dir="$1"
	local git_repo="$2"
	local git_revision="$3"

	# The bootparams to pass
	local bootparams=$(get_bootparams "$git_repo" "$git_revision")

	# TODO: Unhardcode this list
	local flavours="486 686-pae"

	if ! [ -r "${dir}/boot/live.cfg.in" ]; then
		logs "live.cfg.in not found, skipping bootloader update!"
		return 1
	fi

	# The code below is based on lb_binary_syslinux from
	# live-build and is intended to recreate the same live.cfg
	rm -f "${dir}/boot/live.cfg"
	local _NUMBER="0"
	for _FLAVOUR in ${flavours}; do
		_NUMBER="$((${_NUMBER} + 1))"

		extract_kernel "${dir}/live" "${_FLAVOUR}" "${_NUMBER}" "${git_repo}" "${git_revision}" || continue

		sed -e "s|@FLAVOUR@|${_FLAVOUR}|g" \
		    -e "s|@LINUX@|/live/vmlinuz${_NUMBER}|g" \
		    -e "s|@INITRD@|/live/initrd${_NUMBER}.img|g" \
		    -e "s|@APPEND_LIVE@|${bootparams}|g" \
		"${dir}/boot/live.cfg.in" >> "${dir}/boot/live.cfg"
	done
}

# Extract a kernel and generate a bootloader configuration for a installed
# boot of the given revision. This regenerates live.cfg (based on
# live.cfg.in), but leaves the main bootloader config alone.
# dir           - The directory where the disk is mounted (e.g. which contains
#                 the live and boot directories)
# git_repo      - The .git repository to look in
# git_revision  - The revision to look at
generate_installed_config()
{
	local dir="$1"
	local git_repo="$2"
	local git_revision="$3"

	# Install the same kernel flavour as we're currently running
	local flavour=$(cmdline_get kernel-flavour)

	# If no flavour was given, fall back to any available flavour
	# (rather than blowing up...)
	if [ -z "${flavour}" ]; then
		logs "No kernel flavour found, skipping bootloader update!"
		return 1
	fi

	# The bootparams to pass (we keep the kernel flavour used in the
	# cmdline, so it can be used again on upgrades).
	local bootparams="$(get_bootparams "$git_repo" "$git_revision") kernel-flavour=${flavour}"

	# Extract the kernel and initrd from git
	extract_kernel "${dir}/live" "${flavour}" "" "${git_repo}" "${git_revision}" || return 1

	cmdline_has noescape && noescape="noescape 1"

	# Generate global extlinux config file
	cat<<EOF > ${dir}/boot/extlinux/extlinux.conf
default linux
prompt 0
${noescape}
label linux
linux    /live/vmlinuz
append   initrd=/live/initrd.img ${bootparams}
EOF

}

# vim: set sw=8 sts=8 noexpandtab:
