#! /bin/sh
### BEGIN INIT INFO
# Provides:          cups
# Required-Start:    $syslog $remote_fs
# Required-Stop:     $syslog $remote_fs
# Should-Start:      $network avahi
# Should-Stop:       $network
# X-Start-Before:    samba
# X-Stop-After:      samba
# Default-Start:     2 3 4 5
# Default-Stop:      1
# Short-Description: CUPS Printing spooler and server
### END INIT INFO

PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
DAEMON=/usr/sbin/cupsd
NAME=cupsd
PIDFILE=/var/run/cups/$NAME.pid
DESC="Common Unix Printing System"

unset TMPDIR

test -x $DAEMON || exit 0

mkdir -p /var/run/cups/certs

if [ -r /etc/default/cups ]; then
  . /etc/default/cups
fi

. /lib/lsb/init-functions

# Get the timezone set.
if [ -z "$TZ" -a -e /etc/timezone ]; then
    TZ=`cat /etc/timezone`
    export TZ
fi

restart_xprint() {
    if [ -n "$success" ] && [ -x /etc/init.d/xprint ]; then
        invoke-rc.d xprint force-reload || true
    fi
}

coldplug_usb_printers() {
    if type udevadm > /dev/null 2>&1 && [ -x /lib/udev/udev-configure-printer ]; then
	for printer in `udevadm trigger --verbose --dry-run --subsystem-match=usb \
		--attr-match=bInterfaceClass=07 --attr-match=bInterfaceSubClass=01 2>/dev/null || true; \
	                udevadm trigger --verbose --dry-run --subsystem-match=usb \
		--sysname-match='lp[0-9]*' 2>/dev/null || true`; do
	    /lib/udev/udev-configure-printer add "${printer#/sys}"
	done
    fi
}

case "$1" in
  start)
	log_begin_msg "Starting $DESC: $NAME"

	mkdir -p `dirname "$PIDFILE"`
	if [ "$LOAD_LP_MODULE" = "yes" -a -f /usr/lib/cups/backend/parallel \
             -a -f /proc/devices -a -f /proc/modules -a -x /sbin/modprobe ]; then
	  modprobe -q -b lp || true
	  modprobe -q -b ppdev || true
	  modprobe -q -b parport_pc || true
	fi

	start-stop-daemon --start --quiet --oknodo --pidfile "$PIDFILE" --exec $DAEMON && success=1

	coldplug_usb_printers
	log_end_msg $?
	restart_xprint
	;;
  stop)
	log_begin_msg "Stopping $DESC: $NAME"
	start-stop-daemon --stop --quiet --retry 5 --oknodo --pidfile $PIDFILE --name $NAME && success=1
	log_end_msg $?
	restart_xprint
	;;
  reload|force-reload)
       log_begin_msg "Reloading $DESC: $NAME"
       start-stop-daemon --stop --quiet --pidfile $PIDFILE --name $NAME --signal 1 && success=1
       log_end_msg $?
	restart_xprint
       ;;
  restart)
	log_begin_msg "Restarting $DESC: $NAME"
	if start-stop-daemon --stop --quiet --retry 5 --oknodo --pidfile $PIDFILE --name $NAME; then
		start-stop-daemon --start --quiet --pidfile "$PIDFILE" --exec $DAEMON && success=1
	fi
	log_end_msg $?
	restart_xprint
	;;
  status)
	echo -n "Status of $DESC: "
	if [ ! -r "$PIDFILE" ]; then
		echo "$NAME is not running."
		exit 3
	fi
	if read pid < "$PIDFILE" && ps -p "$pid" > /dev/null 2>&1; then
		echo "$NAME is running."
		exit 0
	else
		echo "$NAME is not running but $PIDFILE exists."
		exit 1
	fi
	;;
  *)
	N=/etc/init.d/${0##*/}
	echo "Usage: $N {start|stop|restart|force-reload|status}" >&2
	exit 1
	;;
esac

exit 0
