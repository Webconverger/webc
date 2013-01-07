#!/bin/sh

#set -e

Read_only ()
{
	# Marking some block devices as read-only to ensure that nothing
	# gets written as linux still writes to 'only' read-only mounted filesystems.
	_DEVICES="/dev/sd* /dev/vd*"

	for _DEVICE in ${_DEVICES}
	do
		if [ ! -b "${_DEVICE}" ]
		then
			continue
		fi

		echo -n "Setting ${_DEVICE} read-only..." > /dev/console

		blockdev --setro ${_DEVICE}
		_RETURN="${?}"

		case "${_RETURN}" in
			0)
				echo " done, use 'blockdev --setrw ${_DEVICE}' to set read-write." > /dev/console
				;;

			*)
				echo " failed." > /dev/console
				;;
		esac
	done
}
