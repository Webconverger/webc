#!/bin/sh

## live-config(7) - System Configuration Scripts
## Copyright (C) 2006-2012 Daniel Baumann <daniel@debian.org>
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
## The complete text of the GNU General Public License
## can be found in /usr/share/common-licenses/GPL-3 file.


set -e

# Defaults
LIVE_HOSTNAME="progress"
LIVE_USERNAME="user"
LIVE_USER_FULLNAME="Live user"
LIVE_USER_DEFAULT_GROUPS="audio cdrom dip floppy video plugdev netdev powerdev scanner bluetooth debian-tor"

DEBIAN_FRONTEND="noninteractive"
DEBIAN_PRIORITY="critical"
DEBCONF_NOWARNINGS="yes"

PROC_OPTIONS="onodev,noexec,nosuid,hidepid=2"

Cmdline ()
{
	for _PARAMETER in ${_CMDLINE}
	do
		case "${_PARAMETER}" in
			live-config=*|config=*)
				# Only run requested scripts
				LIVE_CONFIGS="${_PARAMETER#*config=}"
				;;

			live-config|config)
				# Run all scripts
				_SCRIPTS="$(ls /lib/live/config/*)"
				;;

			live-noconfig=*|noconfig=*)
				# Don't run requested scripts
				_SCRIPTS="$(ls /lib/live/config/*)"
				LIVE_NOCONFIGS="${_PARAMETER#*noconfig=}"
				;;

			live-noconfig|noconfig)
				# Don't run any script
				_SCRIPTS=""
				;;

			# Shortcuts
			live-config.noroot|noroot)
				# Disable root access, no matter what mechanism
				_SCRIPTS="${_SCRIPTS:-$(ls /lib/live/config/*)}"
				LIVE_NOCONFIGS="${LIVE_NOCONFIGS},sudo,policykit"

				_NOROOT="true"
				;;

			live-config.noautologin|noautologin)
				# Disables both console and graphical autologin.
				_SCRIPTS="${_SCRIPTS:-$(ls /lib/live/config/*)}"
				LIVE_NOCONFIGS="${LIVE_NOCONFIGS},sysvinit,gdm,gdm3,kdm,lightdm,lxdm,nodm,slim,upstart,xinit"

				_NOAUTOLOGIN="true"
				;;

			live-config.nottyautologin|nottyautologin)
				# Disables console autologin.
				_SCRIPTS="${_SCRIPTS:-$(ls /lib/live/config/*)}"
				LIVE_NOCONFIGS="${LIVE_NOCONFIGS},sysvinit,upstart"

				_NOTTYAUTOLOGIN="true"
				;;

			live-config.nox11autologin|nox11autologin)
				# Disables graphical autologin, no matter what
				# mechanism
				_SCRIPTS="${_SCRIPTS:-$(ls /lib/live/config/*)}"
				LIVE_NOCONFIGS="${LIVE_NOCONFIGS},gdm,gdm3,kdm,lightdm,lxdm,nodm,slim,xinit"

				_NOX11AUTOLOGIN="true"
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
			_SCRIPTS="${_SCRIPTS} $(ls /lib/live/config/????-${_CONFIG} 2> /dev/null || true)"
		done
	fi

	# Exclude requested scripts
	if [ -n "${LIVE_NOCONFIGS}" ]
	then
		for _NOCONFIG in $(echo ${LIVE_NOCONFIGS} | sed -e 's|,| |g')
		do
			_SCRIPTS="$(echo ${_SCRIPTS} | sed -e "s|$(ls /lib/live/config/????-${_NOCONFIG} 2> /dev/null || echo none)||")"
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

Setup_network ()
{
	if [ -z "${_NETWORK}" ] && [ -e /etc/init.d/live-config ]
	then
		/etc/init.d/mountkernfs.sh start > /dev/null 2>&1
		/etc/init.d/mountdevsubfs.sh start > /dev/null 2>&1
		/etc/init.d/ifupdown-clean start > /dev/null 2>&1
		/etc/init.d/ifupdown start > /dev/null 2>&1
		/etc/init.d/networking start > /dev/null 2>&1

		# Now force adapter up if specified with ethdevice= on cmdline
		if [ -n "${ETHDEVICE}" ]
		then
			ifup --force "${ETHDEVICE}"
		fi

		_NETWORK="true"
		export _NETWORK
	fi
}

Main ()
{
	if [ ! -e /proc/version ]
	then
		mount -n -t proc -o${PROC_OPTIONS} -odefaults proc /proc
	fi

	_CMDLINE="$(cat /proc/cmdline)"

	if ! echo ${_CMDLINE} | grep -qs "boot=live"
	then
		exit 0
	fi

	echo -n "live-config:"
	trap 'Trap' EXIT HUP INT QUIT TERM

	# Reading configuration files from filesystem and live-media
	for _FILE in /etc/live/config.conf /etc/live/config/* \
		     /lib/live/mount/medium/live/config.conf /lib/live/mount/medium/live/config/*
	do
		if [ -e "${_FILE}" ]
		then
			. "${_FILE}"
		fi
	done

	# Processing command line
	Cmdline

	case "${LIVE_DEBUG}" in
		true)
			set -x
			;;
	esac

	mkdir -p /var/log/live

	# Configuring system
	_SCRIPTS="$(echo ${_SCRIPTS} | sed -e 's| |\n|g' | sort -u)"

	for _SCRIPT in ${_SCRIPTS}
	do
		[ "${LIVE_DEBUG}" = "true" ] && echo "[$(date +'%F %T')] live-config: ${_SCRIPT}" >> /var/log/live/config.log

		. ${_SCRIPT} 2>&1 | tee -a /var/log/live/config.log
	done

	echo "."
}

Main ${@}
