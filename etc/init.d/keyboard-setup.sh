#!/bin/sh
### BEGIN INIT INFO
# Provides:          keyboard-setup.sh
# Required-Start:    mountkernfs
# Required-Stop:
# X-Start-Before:    checkroot
# Default-Start:     S
# Default-Stop:
# X-Interactive:     true
# Short-Description: Set the console keyboard layout
# Description:       Set the console keyboard as early as possible
#                    so during the file systems checks the administrator
#                    can interact.  At this stage of the boot process
#                    only the ASCII symbols are supported.
### END INIT INFO

if [ -f /bin/setupcon ]; then
    case "$1" in
        stop|status)
        # console-setup isn't a daemon
        ;;
        start|force-reload|restart|reload)
            if [ -f /lib/lsb/init-functions ]; then
                . /lib/lsb/init-functions
            else
                log_action_begin_msg () {
	            echo -n "$@... "
                }

                log_action_end_msg () {
	            if [ "$1" -eq 0 ]; then
	                echo done.
	            else
	                echo failed.
	            fi
                }
            fi
	    log_action_begin_msg "Setting up keyboard layout"
            if /lib/console-setup/keyboard-setup.sh; then
	        log_action_end_msg 0
	    else
	        log_action_end_msg $?
	    fi
	    ;;
        *)
            echo 'Usage: /etc/init.d/keyboard-setup {start|reload|restart|force-reload|stop|status}'
            exit 3
            ;;
    esac
fi
