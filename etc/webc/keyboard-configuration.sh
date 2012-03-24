#!/bin/sh
# wget "http://live.debian.net/gitweb?p=live-config.git;a=blob_plain;f=scripts/config/015-keyboard-configuration"

## live-config(7) - System Configuration Scripts
## Copyright (C) 2006-2012 Daniel Baumann <daniel@debian.org>
##
## live-config comes with ABSOLUTELY NO WARRANTY; for details see COPYING.
## This is free software, and you are welcome to redistribute it
## under certain conditions; see COPYING for details.


Keyboard_configuration ()
{
	# Checking if package is installed or already configured
	if [ ! -e /var/lib/dpkg/info/keyboard-configuration.list ] || \
	   [ -e /var/lib/live/config/keyboard-configuration ]
	then
		return
	fi

	echo -n " keyboard-configuration"

	# Reading kernel command line
	for _PARAMETER in ${_CMDLINE}
	do
		case "${_PARAMETER}" in
			live-config.keyboard-layouts=*|keyboard-layouts=*)
				LIVE_KEYBOARD_LAYOUTS="${_PARAMETER#*keyboard-layouts=}"
				;;

			live-config.keyboard-model=*|keyboard-model=*)
				LIVE_KEYBOARD_MODEL="${_PARAMETER#*keyboard-model=}"
				;;

			live-config.keyboard-options=*|keyboard-options=*)
				LIVE_KEYBOARD_OPTIONS="${_PARAMETER#*keyboard-options=}"
				;;

			live-config.keyboard-variant=*|keyboard-variant=*)
				LIVE_KEYBOARD_VARIANT="${_PARAMETER#*keyboard-variant=}"
				;;
		esac
	done

	Configure_keyboard_configuration
}

Configure_keyboard_configuration ()
{
	if [ -n "${LIVE_KEYBOARD_MODEL}" ]
	then
		echo "keyboard-configuration keyboard-configuration/modelcode select ${LIVE_KEYBOARD_MODEL}" >> /tmp/debconf.live

		sed -i -e "s|^XKBMODEL=.*$|XKBMODEL=\"${LIVE_KEYBOARD_MODEL}\"|" /etc/default/keyboard
	fi

	if [ -n "${LIVE_KEYBOARD_LAYOUTS}" ]
	then
		echo "keyboard-configuration keyboard-configuration/layoutcode select ${LIVE_KEYBOARD_LAYOUTS}" >> /tmp/debconf.live

		sed -i -e "s|^XKBLAYOUT=.*$|XKBLAYOUT=\"${LIVE_KEYBOARD_LAYOUTS}\"|" /etc/default/keyboard
	fi

	if [ -n "${LIVE_KEYBOARD_VARIANT}" ]
	then
		echo "keyboard-configuration keyboard-configuration/variantcode select ${LIVE_KEYBOARD_VARIANT}" >> /tmp/debconf.live

		sed -i -e "s|^XKBVARIANT=.*$|XKBVARIANT=\"${LIVE_KEYBOARD_VARIANT}\"|" /etc/default/keyboard
	fi

	if [ -n "${LIVE_KEYBOARD_OPTIONS}" ]
	then
		echo "keyboard-configuration keyboard-configuration/variantcode string ${LIVE_KEYBOARD_OPTIONS}" >> /tmp/debconf.live

		sed -i -e "s|^XKBOPTIONS=.*$|XKBOPTIONS=\"${LIVE_KEYBOARD_OPTIONS}\"|" /etc/default/keyboard
	fi

	if [ -e /tmp/debconf.live ]
	then
		debconf-set-selections < /tmp/debconf.live
		rm -f /tmp/debconf.live

		# Creating state file
		touch /var/lib/live/config/keyboard-configuration
	fi
}

Keyboard_configuration
