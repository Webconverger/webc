#!/bin/sh

## live-config(7) - System Configuration Scripts
## Copyright (C) 2006-2011 Daniel Baumann <daniel@debian.org>
##
## This program is free software: you can redistribute it and/or modify
## it under the terms of the GNU General Public License as published by
## the Free Software Foundation, either version 3 of the License, or
## (at your option) any later version.
##
## This program is distributed in the hope that it will be useful,
## but WITHOUT ANY WARRANTY; without even the implied warranty of
## MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
## GNU General Public License for more details.
##
## You should have received a copy of the GNU General Public License
## along with this program. If not, see <http://www.gnu.org/licenses/>.
##
## On Debian systems, the complete text of the GNU General Public License
## can be found in /usr/share/common-licenses/GPL-3 file.


set -e

# Defaults
LIVE_HOSTNAME="progress"
LIVE_USERNAME="user"
LIVE_USER_FULLNAME="Progress Linux user"

Cmdline ()
{
	for _PARAMETER in $(cat /proc/cmdline)
	do
		case "${_PARAMETER}" in
			live-config|config)
				# Run all scripts
				_SCRIPTS="$(ls /lib/live/config/*)"
				;;

			live-config=*|config=*)
				# Only run requested scripts
				LIVE_CONFIGS="${_PARAMETER#*config=}"
				;;

			live-noconfig|noconfig)
				# Don't run any script
				_SCRIPTS=""
				;;

			live-noconfig=*|noconfig=*)
				# Don't run requested scripts
				_SCRIPTS="$(ls /lib/live/config/*)"
				LIVE_NOCONFIGS="${_PARAMETER#*noconfig=}"
				;;

			# 001-hostname
			live-config.hostname=*|hostname=*)
				LIVE_HOSTNAME="${_PARAMETER#*hostname=}"
				;;

			# 002-user-setup
			live-config.username=*|username=*)
				LIVE_USERNAME="${_PARAMETER#*username=}"
				;;

			live-config.user-fullname=*|user-fullname=*)
				LIVE_USER_FULLNAME="${_PARAMETER#*user-fullname=}"
				;;

			# 004-locales
			live-config.locales=*|locales=*)
				LIVE_LOCALES="${_PARAMETER#*locales=}"
				;;

			# 005-tzdata
			live-config.timezone=*|timezone=*)
				LIVE_TIMEZONE="${_PARAMETER#*timezone=}"
				;;

			live-config.utc=*|utc=*)
				LIVE_UTC="${_PARAMETER#*utc=}"
				;;

			# 012-console-setup, 013-keyboard-configuration
			live-config.keyboard-model=*|keyboard-model=*)
				LIVE_KEYBOARD_MODEL="${_PARAMETER#*keyboard-model=}"
				;;

			live-config.keyboard-layouts=*|keyboard-layouts=*)
				LIVE_KEYBOARD_LAYOUTS="${_PARAMETER#*keyboard-layouts=}"
				;;

			live-config.keyboard-variant=*|keyboard-variant=*)
				LIVE_KEYBOARD_VARIANT="${_PARAMETER#*keyboard-variant=}"
				;;

			live-config.keyboard-options=*|keyboard-options=*)
				LIVE_KEYBOARD_OPTIONS="${_PARAMETER#*keyboard-options=}"
				;;

			# 014-sysv-rc
			live-config.sysv-rc=*|sysv-rc=*)
				LIVE_SYSV_RC="${_PARAMETER#*sysv-rc=}"
				;;

			# 116-xserver-xorg
			live-config.xorg-xsession-manager=*|x-session-manager=*)
				LIVE_X_SESSION_MANAGER="${_PARAMETER#*x-session-manager=}"
				;;

			live-config.xorg-driver=*|xorg-driver=*)
				LIVE_XORG_DRIVER="${_PARAMETER#*xorg-driver=}"
				;;

			live-config.xorg-resolution=*|xorg-resolution=*)
				LIVE_XORG_RESOLUTION="${_PARAMETER#*xorg-resolution=}"
				;;

			# 999-hooks
			live-config.hooks=*|hooks=*)
				LIVE_HOOKS="${_PARAMETER#*hooks=}"
				;;

			# Shortcuts
			live-config.noroot|noroot)
				# Disable root access, no matter what mechanism
				_SCRIPTS="${_SCRIPTS:-$(ls /lib/live/config/*)}"
				LIVE_NOCONFIGS="${LIVE_NOCONFIGS},sudo,policykit"
				;;

			live-config.noautologin|noautologin)
				# Disables both console and graphical autologin.
				_SCRIPTS="${_SCRIPTS:-$(ls /lib/live/config/*)}"
				LIVE_NOCONFIGS="${LIVE_NOCONFIGS},sysvinit,gdm,gdm3,kdm,lxdm,nodm,slim,xinit"
				;;

			live-config.nottyautologin|nottyautologin)
				# Disables console autologin.
				_SCRIPTS="${_SCRIPTS:-$(ls /lib/live/config/*)}"
				LIVE_NOCONFIGS="${LIVE_NOCONFIGS},sysvinit"
				;;

			live-config.nox11autologin|nox11autologin)
				# Disables graphical autologin, no matter what
				# mechanism
				_SCRIPTS="${_SCRIPTS:-$(ls /lib/live/config/*)}"
				LIVE_NOCONFIGS="${LIVE_NOCONFIGS},gdm,gdm3,kdm,lxdm,nodm,slim,xinit"
				;;

			# Special options
			live-config.debug|debug)
				LIVE_DEBUG="true"
				;;
		esac
	done

	# Include requested scripts
	if [ -n "${LIVE_CONFIGS}" ]
	then
		for _CONFIG in $(echo ${LIVE_CONFIGS} | sed -e 's|,| |g')
		do
			_SCRIPTS="${_SCRIPTS} $(ls /lib/live/config/???-${_CONFIG})"
		done
	fi

	# Exclude requested scripts
	if [ -n "${LIVE_NOCONFIGS}" ]
	then
		for _NOCONFIG in $(echo ${LIVE_NOCONFIGS} | sed -e 's|,| |g')
		do
			_SCRIPTS="$(echo ${_SCRIPTS} | sed -e "s|$(ls /lib/live/config/???-${_NOCONFIG})||")"
		done
	fi
}

Trap ()
{
	_RETURN="${?}"

	case "${_RETURN}" in
		0)

			;;

		*)
			echo ":ERROR"
			;;
	esac

	return ${_RETURN}
}

Start_network ()
{
	if [ -z "${_NETWORK}" ] && [ -e /etc/init.d/live-config ]
	then
		/etc/init.d/mountkernfs.sh start > /dev/null 2>&1
		/etc/init.d/mountdevsubfs.sh start > /dev/null 2>&1
		/etc/init.d/ifupdown-clean start > /dev/null 2>&1
		/etc/init.d/ifupdown start > /dev/null 2>&1
		/etc/init.d/networking start > /dev/null 2>&1

		_NETWORK="true"
		export _NETWORK
	fi
}

Main ()
{
	if ! grep -qs "boot=live" /proc/cmdline
	then
		exit 0
	fi

	echo -n "live-config:"
	trap 'Trap' EXIT HUP INT QUIT TERM

	# Reading configuration file from filesystem
	if [ -e /etc/live/config.conf ]
	then
		. /etc/live/config.conf
	fi

	if ls /etc/live/config.d/* > /dev/null 2>&1
	then
		for _FILE in /etc/live/config.d/*
		do
			. ${_FILE}
		done
	fi

	# Reading configuration file from live-media
	if [ -e /live/image/live/config.conf ]
	then
		. /live/image/live/config.conf
	fi

	if ls /live/image/live/config.d/* > /dev/null 2>&1
	then
		for _FILE in /live/image/live/config.d/*
		do
			. ${_FILE}
		done
	fi

	# Reading kernel command line
	Cmdline

	if [ "${LIVE_DEBUG}" = "true" ]
	then
		set -x
	fi

	# Configuring system
	for _SCRIPT in ${_SCRIPTS}
	do
		. ${_SCRIPT}
	done

	echo "."
}

Main
