# bootclean
#
# Clean /tmp, /run and /var/lock if not mounted as tmpfs
#
# DO NOT RUN AFTER S:55bootmisc.sh and do not run this script directly
# in runlevel S. Instead write an initscript to call it.
#

. /lib/init/vars.sh
. /lib/lsb/init-functions

# Should be called outside verbose message block
mkflagfile()
{
	# Prevent symlink attack  (See #264234.)
	[ -L "$1" ] && log_warning_msg "bootclean: Deleting symbolic link '$1'."
	rm -f "$1" || { log_failure_msg "bootclean: Failure deleting '$1'." ; return 1 ; }
	# No user processes should be running, so no one should be
	# able to introduce a symlink here.  As an extra precaution,
	# set noclobber.
	set -o noclobber
	:> "$1" || { log_failure_msg "bootclean: Failure creating '$1'." ; return 1 ; }
	return 0
}

checkflagfile()
{
	if [ -f $1/.clean ]
	then
		which stat >/dev/null 2>&1 && cleanuid="$(stat -c %u $1/.clean)"
		# Poor's man stat %u, since stat (and /usr) might not
		# be available in some bootup stages
		[ "$cleanuid" ] || cleanuid="$(find $1/.clean -printf %U)"
		[ "$cleanuid" ] || { log_failure_msg "bootclean: Could not stat '$1/.clean'." ; return 1 ; }
		if [ "$cleanuid" -ne 0 ]
		then
			rm -f $1/.clean || { log_failure_msg "bootclean: Could not delete '$1/.clean'." ; return 1 ; }
		fi
	fi
	return 0
}

	report_err()
	{
		dir="$1"
		if [ "$VERBOSE" = no ]
		then
			log_failure_msg "bootclean: Failure cleaning ${dir}."
		else
			log_action_end_msg 1 "bootclean: Failure cleaning ${dir}"
		fi
	}

clean_tmp() {
	# Does not exist
	[ -d /tmp ] || return 1
	# tmpfs does not require cleaning
	[ -f /tmp/.tmpfs ] && return 0
	# Can clean?
	checkflagfile /tmp || return 0
	# Already cleaned
	[ -f /tmp/.clean ] && return 0
	# Can't clean yet?
	which find >/dev/null 2>&1 || return 1

	cd /tmp || { log_failure_msg "bootclean: Could not cd to /tmp." ; return 1 ; }

	#
	# Only clean out /tmp if it is world-writable. This ensures
	# it really is a/the temp directory we're cleaning.
	#
	[ "$(find . -maxdepth 0 -perm -002)" = "." ] || return 0

	if [ ! "$TMPTIME" ]
	then
		log_warning_msg "Using default TMPTIME 0."
		TMPTIME=0
	fi

	[ "$VERBOSE" = no ] || log_action_begin_msg "Cleaning /tmp"

	#
	# Remove regardless of TMPTIME setting
	#
	rm -f .X*-lock

	#
	# Don't clean remaining files if TMPTIME is negative or 'infinite'
	#
	case "$TMPTIME" in
	  -*|infinite|infinity)
		[ "$VERBOSE" = no ] || log_action_end_msg 0 "skipped"
		return 0
		;;
	esac

	#
	# Wipe /tmp, excluding system files, but including lost+found
	#
	# If TMPTIME is set to 0, we do not use any ctime expression
	# at all, so we can also delete files with timestamps
	# in the future!
	#
	if [ "$TMPTIME" = 0 ]
	then
		TEXPR=""
		DEXPR=""
	else
		TEXPR="-mtime +$TMPTIME -ctime +$TMPTIME -atime +$TMPTIME"
		DEXPR="-mtime +$TMPTIME -ctime +$TMPTIME"
	fi

	EXCEPT='! -name .
		! ( -path ./lost+found -uid 0 )
		! ( -path ./quota.user -uid 0 )
		! ( -path ./aquota.user -uid 0 )
		! ( -path ./quota.group -uid 0 )
		! ( -path ./aquota.group -uid 0 )
		! ( -path ./.journal -uid 0 )
		! ( -path ./.clean -uid 0 )
		! ( -path './...security*' -uid 0 )'

	mkflagfile /tmp/.clean || return 1

	#
	# First remove all old files...
	#
	find . -depth -xdev $TEXPR $EXCEPT ! -type d -delete \
		|| { report_err "/tmp"; return 1 ; }

	#
	# ...and then all empty directories
	#
	find . -depth -xdev $DEXPR $EXCEPT -type d -empty -delete \
		|| { report_err "/tmp"; return 1 ; }

	[ "$VERBOSE" = no ] || log_action_end_msg 0
	log_progress_msg "/tmp"
	return 0
}

clean() {
	dir="$1"
	findopts="$2"

	# Does not exist
	[ -d "$dir" ] || return 1
	# tmpfs does not require cleaning
	[ -f "$dir/.tmpfs" ] && return 0
	# Can clean?
	checkflagfile "$dir" || return 0
	# Already cleaned
	[ -f "${dir}/.clean" ] && return 0
	# Can't clean yet?
	which find >/dev/null 2>&1 || return 1

	cd "$dir" || { log_action_end_msg 1 "bootclean: Could not cd to ${dir}." ; return 1 ; }

	[ "$VERBOSE" = no ] || log_action_begin_msg "Cleaning $dir"

	find . $findopts -delete \
		|| { report_err "$dir"; return 1 ; }
	[ "$VERBOSE" = no ] || log_action_end_msg 0
	mkflagfile "${dir}/.clean" || return 1
	log_progress_msg "$dir"
	return 0
}

clean_all()
{
	which find >/dev/null 2>&1 || return 0
	log_begin_msg "Cleaning up temporary files..."
	ES=0
	clean_tmp || ES=1
	# /lib/init/rw is not expected to exist since it's removed.
	# So failure is expected; it's only here to force cleanup.
	clean /lib/init/rw "! -type d" || true
	clean /run "! -xtype d ! -name utmp ! -name innd.pid" || ES=1
	clean /run/lock "! -type d" || ES=1
	clean /run/shm "! -type d" || ES=1
	log_end_msg $ES
	return $ES
}

