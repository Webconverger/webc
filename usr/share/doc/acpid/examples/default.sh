#!/bin/sh
# Default acpi script that takes an entry for all actions

set $*

# Take care about the way events are reported
ev_type=`echo "$1" | cut -d/ -f1`
if [ "$ev_type" = "$1" ]; then
	event="$2";
else
	event=`echo "$1" | cut -d/ -f2`
fi


case "$ev_type" in
    button)
        case "$event" in
            power)
                logger "acpid: received a shutdown request"
                /sbin/init 0
		break
                ;;
             *)
                logger "acpid: action $2 is not defined"
                ;;
        esac
    ;;

    *)
        logger "ACPI group $1 / action $2 is not defined"
        ;;
esac
