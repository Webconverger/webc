#!/bin/sh
### BEGIN INIT INFO
# Provides:             keymap
# Required-Start:       mountdevsubfs
# Required-Stop:        
# Default-Start:        S
# Default-Stop:
# X-Interactive:	true
# Short-Description: 	Set keymap
# Description:		Set the Console keymap
### END INIT INFO

# If setupcon is present, then we've been superseded by console-setup.
if type setupcon >/dev/null 2>&1; then
	exit 0
fi

. /lib/lsb/init-functions

#
# Load the keymaps *as soon as possible*
#

# Don't fail on error
CONSOLE_TYPE=`fgconsole 2>/dev/null` || CONSOLE_TYPE="unknown"

# Don't fail on serial consoles

QUIT=0
# fail silently if loadkeys not present (yet).
command -v loadkeys >/dev/null 2>&1 || QUIT=1

CONFDIR=/etc/console
CONFFILEROOT=boottime
EXT=kmap
CONFFILE=${CONFDIR}/${CONFFILEROOT}.${EXT}.gz

reset_kernel()
{
	# On Mac PPC machines, we may need to set kernel vars first
        # We need to mount /proc to do that; not optimal, as its going to 
        # be mounted in S10checkroot, but we need it set up before sulogin
        # may be run in checkroot, which will need the keyboard to log in...
	[ -x /sbin/sysctl ] || return
	[ -r /etc/sysctl.conf ] || return
	grep -v '^\#' /etc/sysctl.conf | grep -q keycodes 
	if [ "$?" = "0" ] ; then
	    grep keycodes /etc/sysctl.conf | grep -v "^#" | while read d ; do
	        /sbin/sysctl -w $d 2> /dev/null || true
            done
        fi
}

unicode_start_stop()
{
	# Switch unicode mode by checking the locale.
	# This will be needed before loading the keymap.
	[ -x /usr/bin/unicode_start ] || [ -x /bin/unicode_start ] ||  return
	[ -x /usr/bin/unicode_stop ] || [ -x /bin/unicode_stop ] || return

	ENV_FILE=""
	[ -r /etc/environment ] && ENV_FILE="/etc/environment"
	[ -r /etc/default/locale ] && ENV_FILE="/etc/default/locale" 
	[ "$ENV_FILE" ] && CHARMAP=$(set -a && . "$ENV_FILE" && locale charmap)
	if [ "$CHARMAP" = "UTF-8" ]; then
		unicode_start 2> /dev/null || true
	else
		unicode_stop 2> /dev/null || true
	fi
}

if [ ! $QUIT = '1' ] ; then

  case "$1" in
      start | restart | force-reload | reload)
  
      	# Set kernel variables if required
 	reset_kernel

        # First mount /proc if necessary...and if it is there (#392798)
        unmount_proc="no"
	if [ -d /proc ]; then
        	if [ ! -x /proc/$$ ]; then
        		unmount_proc="yes"	
         		mount -n /proc
        	fi
  

        	if [ -f /proc/sys/dev/mac_hid/keyboard_sends_linux_keycodes ] ; then
        		linux_keycodes=`cat /proc/sys/dev/mac_hid/keyboard_sends_linux_keycodes`
		else
        		linux_keycodes=1;
        	fi
	else
       		linux_keycodes=1;
	fi

	# load new map
	if [ $linux_keycodes -gt 0 ] ; then 
	  if [ -r ${CONFFILE} ] ; then

	    # Switch console mode to UTF-8 or ASCII as necessary
	    unicode_start_stop

	    if [ $CONSOLE_TYPE = "serial" ] ; then 
		    loadkeys -q ${CONFFILE} 2>&1 > /dev/null
	    else
	    	    loadkeys -q ${CONFFILE}
	    fi
	    if [ $? -gt 0 ]
		then
	    	# if we've a serial console, we may not have a keyboard, so don't
		# complain if we fail. 
		   if [ ! $CONSOLE_TYPE = "serial" ]; then 
			log_warning_msg "Problem when loading ${CONFDIR}/${CONFFILEROOT}.${EXT}.gz, use install-keymap"
			sleep 10
		   fi 
		fi
	    fi
	fi

	# unmount /proc if we mounted it
        [ "$unmount_proc" = "no" ] || umount -n /proc

	;;

    stop)
	;;

    status)
	exit 0
	;;

    *)
	log_warning_msg "Usage: $0 {start|stop|restart|reload|force-reload|status}"
	;;
  esac

fi
