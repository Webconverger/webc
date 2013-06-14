#
# Functions used by several mount* scripts in initscripts package
#
# Sourcer must source /lib/lsb/init-functions.sh

# List available fstab files, including any files in /etc/fstab.d.
# This looks ugly, but we can't use find and it's safer than globbing.
fstab_files()
{
    echo /etc/fstab
    if [ -d /etc/fstab.d ]; then
        ls -1 /etc/fstab.d | grep '\.fstab$' | sed -e 's;^;/etc/fstab.d/;'
    fi
}

# $1: directory
is_empty_dir() {
	for FILE in $1/* $1/.*
	do
		case "$FILE" in
		  "$1/.*") return 0 ;;
		  "$1/*"|"$1/."|"$1/..") continue ;;
		  *) return 1 ;;
		esac
	done
	return 0
}


selinux_enabled () {
	which selinuxenabled >/dev/null 2>&1 && selinuxenabled
}

# Read /etc/fstab, looking for:
# 1) The root filesystem, resolving LABEL=*|UUID=* entries to the
#	device node,
# 2) Swap that is on a md device or a file that may be on a md
#	device,
_read_fstab () {
	echo "fstabroot=/dev/root"
	echo "rootdev=none"
	echo "roottype=none"
	echo "rootopts=defaults"
	echo "rootmode=rw"
	echo "rootcheck=no"
	echo "swap_on_lv=no"
	echo "swap_on_file=no"

	fstab_files | while read file; do
		if [ -f "$file" ]; then
			while read DEV MTPT FSTYPE OPTS DUMP PASS JUNK; do
				case "$DEV" in
				  ""|\#*)
					continue;
					;;
				  /dev/mapper/*)
					[ "$FSTYPE" = "swap" ] && echo swap_on_lv=yes
					;;
				  /dev/*)
					;;
				  LABEL=*|UUID=*)
					if [ "$MTPT" = "/" ] && [ -x /sbin/findfs ]
					then
						DEV="$(findfs "$DEV")"
					fi
					;;
				  /*)
					[ "$FSTYPE" = "swap" ] && echo swap_on_file=yes
					;;
				  *)
					;;
				esac
				[ "$MTPT" != "/" ] && continue
				echo rootdev=\"$DEV\"
				echo fstabroot=\"$DEV\"
				echo rootopts=\"$OPTS\"
				echo roottype=\"$FSTYPE\"
				( [ "$PASS" != 0 ] && [ "$PASS" != "" ]   ) && echo rootcheck=yes
				( [ "$FSTYPE" = "nfs" ] || [ "$FSTYPE" = "nfs4" ] ) && echo rootcheck=no
				case "$OPTS" in
				  ro|ro,*|*,ro|*,ro,*)
					echo rootmode=ro
					;;
				esac
			done < "$file"
		fi
	done
}

# Read /etc/fstab, looking for:
# 1) The root filesystem, resolving LABEL=*|UUID=* entries to the
#	device node,
# 2) Swap that is on a md device or a file that may be on a md
#	device,

read_fstab () {
	eval "$(_read_fstab)"
}

# Find a specific fstab entry
# $1=mountpoint
# $2=fstype (optional)
_read_fstab_entry () {
	# Not found by default.
	echo "MNT_FSNAME="
	echo "MNT_DIR="
	echo "MNT_TYPE="
	echo "MNT_OPTS="
	echo "MNT_FREQ="
	echo "MNT_PASS="

	fstab_files | while read file; do
		if [ -f "$file" ]; then
			while read MNT_FSNAME MNT_DIR MNT_TYPE MNT_OPTS MNT_FREQ MNT_PASS MNT_JUNK; do
				case "$MNT_FSNAME" in
				  ""|\#*)
					continue;
					;;
				esac
				if [ "$MNT_DIR" = "$1" ]; then
					if [ -n "$2" ]; then
						[ "$MNT_TYPE" = "$2" ] || continue;
					fi
	                                echo "MNT_FSNAME=$MNT_FSNAME"
	                                echo "MNT_DIR=$MNT_DIR"
	                                echo "MNT_TYPE=$MNT_TYPE"
	                                echo "MNT_OPTS=$MNT_OPTS"
	                                echo "MNT_FREQ=$MNT_FREQ"
	                                echo "MNT_PASS=$MNT_PASS"
					break 2
				fi
				MNT_DIR=""
			done < "$file"
		fi
	done
}

# Find a specific fstab entry
# $1=mountpoint
# $2=fstype (optional)
# returns 0 on success, 1 on failure (not found or no fstab)
read_fstab_entry () {
	eval "$(_read_fstab_entry "$1" "$2")"

	# Not found by default.
	found=1
	if [ "$1" = "$MNT_DIR" ]; then
		found=0
	fi

	return $found
}

# Mount kernel and device file systems.
# $1: mount mode (mount, remount, mtab)
# $2: file system type
# $3: alternative file system type (or empty string if none)
# $4: mount point
# $5: mount device name
# $6... : extra mount program options
domount () {
	MOUNTMODE="$1"
	PRIFSTYPE="$2"
	ALTFSTYPE="$3"
	MTPT="$4"
	DEVNAME="$5"
	CALLER_OPTS="$6"

	KERNEL="$(uname -s)"
	# Figure out filesystem type from primary and alternative type
	FSTYPE=
	# Filesystem-specific mount options
	FS_OPTS=
	# Mount options from fstab
	FSTAB_OPTS=

	if [ "$PRIFSTYPE" = proc ]; then
		case "$KERNEL" in
			Linux|GNU) FSTYPE=proc ;;
			*FreeBSD)  FSTYPE=linprocfs ;;
			*)         FSTYPE=procfs ;;
		esac
	elif [ "$PRIFSTYPE" = bind ]; then
		case "$KERNEL" in
			Linux)     FSTYPE="$DEVNAME"; FS_OPTS="-obind" ;;
			*FreeBSD)  FSTYPE=nullfs ;;
			GNU)       FSTYPE=firmlink ;;
			*)         FSTYPE=none ;;
		esac
	elif [ "$PRIFSTYPE" = tmpfs ]; then
		# always accept tmpfs, to mount /run before /proc
		case "$KERNEL" in
			GNU)	FSTYPE=none ;; # for now
			*)	FSTYPE=$PRIFSTYPE ;;
		esac
	elif grep -E -qs "$PRIFSTYPE\$" /proc/filesystems; then
		FSTYPE=$PRIFSTYPE
	elif grep -E -qs "$ALTFSTYPE\$" /proc/filesystems; then
		FSTYPE=$ALTFSTYPE
	fi

	# Filesystem not supported by kernel
	if [ ! "$FSTYPE" ]; then
		if [ "$ALTFSTYPE" ]; then
			log_warning_msg "Filesystem types '$PRIFSTYPE' and '$ALTFSTYPE' are not supported. Skipping mount."
		else
			log_warning_msg "Filesystem type '$PRIFSTYPE' is not supported. Skipping mount."
		fi
		return
	fi

	# We give file system type as device name if not specified as
	# an argument
	if [ -z "$DEVNAME" ] ; then
	    DEVNAME=$FSTYPE
	fi

	# Get the mount options from /etc/fstab
	if read_fstab_entry "$MTPT" "$FSTYPE"; then
		case "$MNT_OPTS" in
			noauto|*,noauto|noauto,*|*,noauto,*)
				return
				;;
			?*)
				FSTAB_OPTS="-o$MNT_OPTS"
				;;
		esac
	fi

	if [ ! -d "$MTPT" ]
	then
		log_warning_msg "Mount point '$MTPT' does not exist. Skipping mount."
		return
	fi

	if [ "$MOUNTMODE" = "mount_noupdate" ]; then
		MOUNTFLAGS="-n"
		MOUNTMODE=mount
	fi
	if [ "$MOUNTMODE" = "remount_noupdate" ]; then
		MOUNTFLAGS="-n"
		MOUNTMODE=remount
	fi

	case "$MOUNTMODE" in
		mount)
			if mountpoint -q "$MTPT"; then
			    # Already mounted, probably moved from the
			    # initramfs, so remount with the
			    # user-specified mount options later on.
			    :
			else
				if [ "$VERBOSE" != "no" ]; then
					is_empty_dir "$MTPT" >/dev/null 2>&1 || log_warning_msg "Files under mount point '$MTPT' will be hidden."
				fi
				mount $MOUNTFLAGS -t $FSTYPE $CALLER_OPTS $FSTAB_OPTS $FS_OPTS $DEVNAME $MTPT
				if [ "$FSTYPE" = "tmpfs" -a -x /sbin/restorecon ]; then
					/sbin/restorecon $MTPT
				fi
			fi
			;;
		remount)
			if mountpoint -q "$MTPT"; then
				# Remount with user-specified mount options
				mount $MOUNTFLAGS -oremount $CALLER_OPTS $FSTAB_OPTS $MTPT
			fi
			;;
	        mtab)
			# Update mtab with correct mount options if
			# the filesystem is mounted
			MOUNTFLAGS="-f"

			if mountpoint -q "$MTPT"; then
				# Already recorded?
				if ! grep -E -sq "^([^ ]+) +$MTPT +" /etc/mtab < /dev/null
				then
					mount $MOUNTFLAGS -t $FSTYPE $CALLER_OPTS $FSTAB_OPTS $FS_OPTS $DEVNAME $MTPT < /dev/null
				fi
			fi
			;;
	        fstab)
			# Generate fstab with default mount options.
			# Note does not work for bind mounts, and does
			# not work if the fstab already has an entry
			# for the filesystem.

			if ! read_fstab_entry "$MTPT" "$FSTYPE"; then
				CALLER_OPTS="$(echo "$CALLER_OPTS" | sed -e 's/^-o//')"
				echo "Creating /etc/fstab entry for $MTPT to replace default in /etc/default/tmpfs (deprecated)" >&2
	                        echo "# This mount for $MTPT replaces the default configured in /etc/default/tmpfs"
	                        echo "$DEVNAME	$MTPT	$FSTYPE	$CALLER_OPTS	0	0"
			fi
			;;
	esac
}

#
# Preserve /var/run and /var/lock mountpoints
#
pre_mountall ()
{
	# RAMRUN and RAMLOCK on /var/run and /var/lock are obsoleted by
	# /run.  Note that while RAMRUN is no longer used (/run is always
	# a tmpfs), RAMLOCK is still functional, but will cause a second
	# tmpfs to be mounted on /run/lock.

	# /lib/init/rw is obsolete and replaced by /run.  It's no
	# longer used as a mountpoint, so attempt to remove it if
	# possible (this will fail if root is read only).
	rmdir /lib/init/rw >/dev/null 2>&1 || true
}

# If the device/inode are the same, a bind mount already exists or the
# transition is complete, so set up is not required.  Otherwise bind
# mount $SRC on $DEST.
bind_mount ()
{
	SRC=$1
	DEST=$2

	FSTYPE=""
	OPTS=""

	ssrc="$(/usr/bin/stat -L --format="%d %i" "$SRC" 2>/dev/null || :)"
	sdest="$(/usr/bin/stat -L --format="%d %i" "$DEST" 2>/dev/null || :)"

	case "$(uname -s)" in
		Linux)     FSTYPE=$SRC; OPTS="-orw -obind" ;;
		*FreeBSD)  FSTYPE=nullfs; OPTS="-orw" ;;
		GNU)       FSTYPE=firmlink ;;
		*)         FSTYPE=none ;;
	esac

	# Bind mount $SRC on $DEST
	if [ -n "$ssrc" ] && [ "$ssrc" != "$sdest" ]; then
		[ -d "$DEST" ] || mkdir "$DEST"
		[ -x /sbin/restorecon ] && /sbin/restorecon "$DEST"
		if mount -t $FSTYPE "$SRC" "$DEST" $OPTS ; then
			echo "Please reboot to complete migration to tmpfs-based /run" > "${DEST}/.run-transition"
			return 0
		fi
		return 1
	fi

	return 0
}

#
# Migrate a directory to /run and create compatibility symlink or bind
# mount.
#
run_migrate ()
{
	OLD=$1
	RUN=$2

	KERNEL="$(uname -s)"
	OPTS=""
	case "$KERNEL" in
		Linux)     FSTYPE=none OPTS="-orw -obind";;
		*FreeBSD)  FSTYPE=nullfs OPTS="-orw" ;;
		GNU)       FSTYPE=firmlink ;;
		*)         FSTYPE=none ;;
	esac

	# Create absolute symlink if not already present.  This is to
	# upgrade from older versions which created relative links,
	# which are not permitted in policy between top-level
	# directories.
	if [ -L "$OLD" ] && [ "$(readlink "$OLD")" != "$RUN" ]; then
		rm -f "$OLD"
		ln -fs "$RUN" "$OLD"
		[ -x /sbin/restorecon ] && /sbin/restorecon "$OLD"
	fi

	# If both directories are the same, we don't need to do
	# anything further.
	sold="$(/usr/bin/stat -L --format="%d %i" "$OLD" 2>/dev/null || :)"
	srun="$(/usr/bin/stat -L --format="%d %i" "$RUN" 2>/dev/null || :)"
	if [ -n "$sold" ] && [ "$sold" = "$srun" ]; then
		return 0
	fi

	# Try to remove if a directory.  Note this is safe because the
	# system is not yet fully up, and nothing is allowed to use
	# them yet.  If the user explicitly mounted a filesystem here,
	# it will be cleaned out, but this would happen later on when
	# bootclean runs in any case.
	if [ ! -L "$OLD" ] && [ -d "$OLD" ] ; then
		rm -fr "$OLD" 2>/dev/null || true
	fi

	# If removal failed (directory still exists), set up bind mount.
	if [ ! -L "$OLD" ] && [ -d "$OLD" ] ; then
		if [ "$OLD" != "/tmp" ]; then
			log_warning_msg "Filesystem mounted on $OLD; setting up compatibility bind mount."
			log_warning_msg "Please remove this mount from /etc/fstab; it is no longer needed, and it is preventing completion of the transition to $RUN."
		fi
		mount -t $FSTYPE "$RUN" "$OLD" $OPTS
	else
		# Create symlink if not already present.
		if [ -L "$OLD" ] && [ "$(readlink "$OLD")" != "$RUN" ]; then
			:
		else
			rm -f "$OLD"
			ln -fs "$RUN" "$OLD"
			[ -x /sbin/restorecon ] && /sbin/restorecon "$OLD"
		fi
	fi

	return 0
}

#
# Migrate /etc/mtab to a compatibility symlink
#
mtab_migrate ()
{
	# Don't symlink if /proc/mounts does not exist.
	if [ ! -r "/proc/mounts" ]; then
		return 1
	fi

	# Create symlink if not already present.
	if [ -L "/etc/mtab" ] && [ "$(readlink "/etc/mtab")" = "/proc/mounts" ]; then
		:
	else
		log_warning_msg "Creating compatibility symlink from /etc/mtab to /proc/mounts."

		rm -f "/etc/mtab" || return 1
		ln -fs "/proc/mounts" "/etc/mtab" || return 1
		[ -x /sbin/restorecon ] && /sbin/restorecon "/etc/mtab"
	fi

	return 0
}

#
# For compatibility, create /var/run and /var/lock symlinks to /run
# and /run/lock, respectively.
#
post_mountall ()
{
	# /var/run and /var/lock are now /run and /run/lock,
	# respectively.  Cope with filesystems being deliberately
	# mounted on /var/run and /var/lock.  We will create bind
	# mounts from /run and /run/lock to /var/run and /var/lock if
	# we can't remove the /var/run and /var/lock directories, or
	# else simply create symlinks.  For example, in the case that
	# the user has explicitly mounted filesystems on /var/run or
	# /var/lock, we bind mount over the top of them.  Where no
	# filesystems are mounted, we replace the directory with a
	# symlink where possible.

	# Cater for systems which have a symlink from /run to /var/run
	# for whatever reason.  Remove the symlink and replace with a
	# directory.  The migration logic will then take care of the
	# rest.  Note that it will take a second boot to fully
	# migrate; it should only ever be needed on broken systems.
	RAMSHM_ON_DEV_SHM="no"
	if read_fstab_entry "/dev/shm"; then
	    RAMSHM_ON_DEV_SHM="yes"
	fi
	if read_fstab_entry "/run/shm"; then
	    RAMSHM_ON_DEV_SHM="no"
	fi

	if [ -L /run ]; then
		if [ "$(readlink /run)" = "/var/run" ]; then
			rm -f /run
			mkdir /run
		fi
		if bind_mount /var/run /run; then
		    bind_mount /var/lock /run/lock
		    if [ yes = "$RAMSHM_ON_DEV_SHM" ]; then
			run_migrate /run/shm /dev/shm
		    else
			run_migrate /dev/shm /run/shm
		    fi
		fi
	else
	    run_migrate /var/run /run
	    run_migrate /var/lock /run/lock
	    if [ yes = "$RAMSHM_ON_DEV_SHM" ]; then
		run_migrate /run/shm /dev/shm
	    else
		run_migrate /dev/shm /run/shm
	    fi
	fi
}

# Mount /run
mount_run ()
{
	MNTMODE="$1"

	# Needed to determine if root is being mounted read-only.
	read_fstab

	#
	# Get some writable area available before the root is checked
	# and remounted.  Note that /run may be handed over from the
	# initramfs.
	#

	# If /run/shm is separately mounted, /run can be safely mounted noexec.
	RUNEXEC=
	if [ yes = "$RAMSHM" ] || read_fstab_entry /run/shm tmpfs; then
	    RUNEXEC=',noexec'
	fi
	# TODO: Add -onodev once checkroot no longer creates a device node.
	domount "$MNTMODE" tmpfs shmfs /run tmpfs "-onosuid$RUNEXEC$RUN_OPT"
	[ -x /sbin/restorecon ] && /sbin/restorecon -r /run

	# Make pidfile omit directory for sendsigs
	[ -d /run/sendsigs.omit.d ] || mkdir --mode=755 /run/sendsigs.omit.d/

	# Make sure we don't get cleaned
	touch /run/.tmpfs
}

# Mount /run/lock
mount_lock ()
{
	MNTMODE="$1"

	# Make lock directory as the replacement for /var/lock
	[ -d /run/lock ] || mkdir --mode=755 /run/lock
	[ -x /sbin/restorecon ] && /sbin/restorecon /run/lock

	# Now check if there's an entry in /etc/fstab.  If there is,
	# it overrides the existing RAMLOCK setting.
	if read_fstab_entry /run/lock; then
	    if [ "$MNT_TYPE" = "tmpfs" ] ; then
		RAMLOCK="yes"
	    else
		RAMLOCK="no"
	    fi
	fi

	KERNEL="$(uname -s)"
	NODEV="nodev,"
	case "$KERNEL" in
		*FreeBSD)  NODEV="" ;;
	esac

	# Mount /run/lock as tmpfs if enabled.  This prevents user DoS
	# of /run by filling /run/lock at the expense of using an
	# additional tmpfs.
	if [ yes = "$RAMLOCK" ]; then
		domount "$MNTMODE" tmpfs shmfs /run/lock tmpfs "-o${NODEV}noexec,nosuid$LOCK_OPT"
		# Make sure we don't get cleaned
		touch /run/lock/.tmpfs
	else
		chmod "$LOCK_MODE" /run/lock
	fi
}

# Mount /run/shm
mount_shm ()
{
	MNTMODE="$1"

	RAMSHM_ON_DEV_SHM="no"
	SHMDIR="/run/shm"
	if read_fstab_entry "/dev/shm"; then
		if [ "$MNTMODE" = "mount_noupdate" ]; then
			log_warning_msg "Warning: fstab entry for /dev/shm; should probably be for /run/shm unless working around a bug in the Oracle database"
		fi
		SHMDIR="/dev/shm"
		RAMSHM_ON_DEV_SHM="yes"
	fi
	if read_fstab_entry "/run/shm"; then
		if [ "$MNTMODE" = "mount_noupdate" ] && [ "$RAMSHM_ON_DEV_SHM" = "yes" ]; then
			log_warning_msg "Warning: fstab entries for both /dev/shm and /run/shm found; only /run/shm will be used"
		fi

		SHMDIR="/run/shm"
		RAMSHM_ON_DEV_SHM="no"
	fi

	if [ ! -d "$SHMDIR" ]
	then
		mkdir --mode=755 "$SHMDIR"
		[ -x /sbin/restorecon ] && /sbin/restorecon "$SHMDIR"
	fi

	# Now check if there's an entry in /etc/fstab.  If there is,
	# it overrides the existing RAMSHM setting.
	if read_fstab_entry "$SHMDIR"; then
		if [ "$MNT_TYPE" = "tmpfs" ] ; then
			RAMSHM="yes"
		else
			RAMSHM="no"
		fi
	fi

	KERNEL="$(uname -s)"
	NODEV="nodev,"
	case "$KERNEL" in
		*FreeBSD)  NODEV="" ;;
	esac

	if [ yes = "$RAMSHM" ]; then
		domount "$MNTMODE" tmpfs shmfs "$SHMDIR" tmpfs "-onosuid,${NODEV}noexec$SHM_OPT"
		# Make sure we don't get cleaned
		touch "$SHMDIR"/.tmpfs
	else
		chmod "$SHM_MODE" "$SHMDIR"
	fi

	# Migrate early, so /dev/shm is available from the start
	if [ "$MNTMODE" = mount_noupdate ] || [ "$MNTMODE" = mount ]; then
		if [ yes = "$RAMSHM_ON_DEV_SHM" ]; then
			run_migrate /run/shm /dev/shm
		else
			run_migrate /dev/shm /run/shm
		fi
	fi
}

#
# Mount /tmp
#
mount_tmp ()
{
	MNTMODE="$1"

	# If /tmp is a symlink, make sure the linked-to directory exists.
	if [ -L /tmp ] && [ ! -d /tmp ]; then
		TMPPATH="$(readlink /tmp)"
		mkdir -p --mode=755 "$TMPPATH"
		[ -x /sbin/restorecon ] && /sbin/restorecon "$TMPPATH"
	fi

	# Disable RAMTMP if there's 64MiB RAM or less.  May be
	# re-enabled by overflow or read only root, below.
	RAM_SIZE="$(ram_size)"
	if [ -n "$RAM_SIZE" ] && [ "$((RAM_SIZE <= 65536))" = "1" ]; then
		RAMTMP=no
	fi

	# If root is read only, default to mounting a tmpfs on /tmp,
	# unless one is due to be mounted from fstab.
	if [ "$RAMTMP" != "yes" ] && [ rw != "$rootmode" ]; then
		# If there's an entry in fstab for /tmp (any
		# filesystem type, not just tmpfs), then we don't need
		# a tmpfs on /tmp by default.
		if read_fstab_entry /tmp ; then
			:
		else
			log_warning_msg "Root filesystem is read-only; mounting tmpfs on /tmp"
			RAMTMP="yes"
		fi
	fi

	if [ "$RAMTMP" != "yes" ] && need_overflow_tmp; then
		# If there's an entry in fstab for /tmp (any
		# filesystem type, not just tmpfs), then we don't need
		# a tmpfs on /tmp by default.
		if read_fstab_entry /tmp ; then
			:
		else
			log_warning_msg "Root filesystem has insufficient free space; mounting tmpfs on /tmp"
			RAMTMP="yes"
		fi
	fi

	# Now check if there's an entry in /etc/fstab.  If there is,
	# it overrides all the above settings.
	if read_fstab_entry /tmp; then
	    if [ "$MNT_TYPE" = "tmpfs" ] ; then
		RAMTMP="yes"
	    else
		RAMTMP="no"
	    fi
	fi

	KERNEL="$(uname -s)"
	NODEV="nodev,"
	case "$KERNEL" in
		*FreeBSD)  NODEV="" ;;
	esac

	# Mount /tmp as tmpfs if enabled.
	if [ yes = "$RAMTMP" ]; then
		domount "$MNTMODE" tmpfs shmfs /tmp tmpfs "-o${NODEV}nosuid$TMP_OPT"
		# Make sure we don't get cleaned
		touch /tmp/.tmpfs
	else
		# When root is still read only, this will fail.
		if [ mount_noupdate != "$MNTMODE" ] && [ rw = "$rootmode" ]; then
			chmod "$TMP_MODE" /tmp
		fi
	fi
}
