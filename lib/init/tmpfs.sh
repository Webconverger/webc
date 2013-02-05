#
# Set tmpfs vars
#


# Get size of physical RAM in kiB
ram_size ()
{
    [ -r /proc/meminfo ] && \
	grep MemTotal /proc/meminfo | \
	sed -e 's;.*[[:space:]]\([0-9][0-9]*\)[[:space:]]kB.*;\1;' || :
}

# Get size of swap space in kiB
swap_size ()
{
    [ -r /proc/meminfo ] && \
	grep SwapTotal /proc/meminfo | \
	sed -e 's;.*[[:space:]]\([0-9][0-9]*\)[[:space:]]kB.*;\1;' || :
}

#
# Get total VM size in kiB.  Prints nothing if no RAM and/or swap was
# detectable.
#
vm_size ()
{
    RAM=$(ram_size)
    SWAP=$(swap_size)

    RAM="${RAM:=0}"
    SWAP="${SWAP:=0}"

    echo $((RAM + SWAP))
    return 0;
}

#
# Get size of tmpfs.  If the size is absolute or a percentage, return
# that unchanged.  If suffixed with "%VM", return the absolute size as
# a percentage of RAM and swap combined.  If no swap was available,
# return as a percentage (tmpfs will use a percentage of RAM only).
#
tmpfs_size_vm ()
{
# Handle the no-swap case here, i.e. core memory only.  Also handle no
# memory either (no proc) by just returning the original value.
    RET="$1"
    VMTOTAL="$(vm_size)"
    VMPCT="${RET%\%VM}"
    if [ "$VMPCT" != "$RET" ]; then
	if [ -n "$VMTOTAL" ]; then
	    RET=$(((VMTOTAL / 100) * VMPCT))
	    RET="${RET}k"
	else
	    RET="${VMPCT}%"
	fi
    fi
    echo "$RET"
}

# Free space on /tmp in kiB.
tmp_free_space ()
{
    LC_ALL=C df -kP /tmp | grep -v Filesystem | sed -e 's;^[^[:space:]][^[:space:]]*[[:space:]][[:space:]]*[0-9][0-9]*[[:space:]][[:space:]]*[0-9][0-9]*[[:space:]][[:space:]]*\([0-9][0-9]*\)[[:space:]][[:space:]]*.*$;\1;'
}

# Check if an emergency tmpfs is needed
need_overflow_tmp ()
{
    [ "$VERBOSE" != no ] && log_action_begin_msg "Checking minimum space in /tmp"

    ROOT_FREE_SPACE=$(tmp_free_space)
    [ "$VERBOSE" != no ] && log_action_end_msg 0
    if [ -n "$ROOT_FREE_SPACE" ] && [ -n "$TMP_OVERFLOW_LIMIT" ] \
	&& [ $((ROOT_FREE_SPACE < TMP_OVERFLOW_LIMIT)) = "1" ]; then
	return 0
    fi
    return 1
}

# Set defaults for /etc/default/tmpfs, in case any options are
# commented out which are needed for booting.  So that an empty or
# outdated file missing newer options works correctly, set the default
# values here.

RAMLOCK=yes
# These might be overridden by /etc/default/rcS
if [ -z "$RAMSHM" ]; then RAMSHM=yes; fi
if [ -z "$RAMTMP" ]; then RAMTMP=no; fi

TMPFS_SIZE=20%VM
TMPFS_MODE=755

RUN_SIZE=10%
RUN_MODE=755

LOCK_SIZE=5242880 # 5MiB
LOCK_MODE=1777

SHM_SIZE=
SHM_MODE=1777

TMP_SIZE=
TMP_MODE=1777
TMP_OVERFLOW_LIMIT=1024

# Source conffile
if [ -f /etc/default/tmpfs ]; then
    . /etc/default/tmpfs
fi

TMPFS_SIZE="$(tmpfs_size_vm "$TMPFS_SIZE")"
RUN_SIZE="$(tmpfs_size_vm "$RUN_SIZE")"
LOCK_SIZE="$(tmpfs_size_vm "$LOCK_SIZE")"
SHM_SIZE="$(tmpfs_size_vm "$SHM_SIZE")"
TMP_SIZE="$(tmpfs_size_vm "$TMP_SIZE")"

RUN_OPT=
[ "${RUN_SIZE:=$TMPFS_SIZE}" ] && RUN_OPT=",size=$RUN_SIZE"
[ "${RUN_MODE:=$TMPFS_MODE}" ] && RUN_OPT="$RUN_OPT,mode=$RUN_MODE"

LOCK_OPT=
[ "${LOCK_SIZE:=$TMPFS_SIZE}" ] && LOCK_OPT=",size=$LOCK_SIZE"
[ "${LOCK_MODE:=$TMPFS_MODE}" ] && LOCK_OPT="$LOCK_OPT,mode=$LOCK_MODE"

SHM_OPT=
[ "${SHM_SIZE:=$TMPFS_SIZE}" ] && SHM_OPT=",size=$SHM_SIZE"
[ "${SHM_MODE:=$TMPFS_MODE}" ] && SHM_OPT="$SHM_OPT,mode=$SHM_MODE"

TMP_OPT=
[ "${TMP_SIZE:=$TMPFS_SIZE}" ] && TMP_OPT=",size=$TMP_SIZE"
[ "${TMP_MODE:=$TMPFS_MODE}" ] && TMP_OPT="$TMP_OPT,mode=$TMP_MODE"
