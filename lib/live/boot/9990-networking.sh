#!/bin/sh

#set -e

Device_from_bootif ()
{
	# support for Syslinux IPAPPEND parameter
	# it sets the BOOTIF variable on the kernel parameter

	if [ -n "${BOOTIF}" ]
	then
		# pxelinux sets BOOTIF to a value based on the mac address of the
		# network card used to PXE boot, so use this value for DEVICE rather
		# than a hard-coded device name from initramfs.conf. this facilitates
		# network booting when machines may have multiple network cards.
		# pxelinux sets BOOTIF to 01-$mac_address

		# strip off the leading "01-", which isn't part of the mac
		# address
		temp_mac=${BOOTIF#*-}

		# convert to typical mac address format by replacing "-" with ":"
		bootif_mac=""
		IFS='-'
		for x in $temp_mac
		do
			if [ -z "$bootif_mac" ]
			then
				bootif_mac="$x"
			else
				bootif_mac="$bootif_mac:$x"
			fi
		done
		unset IFS

		# look for devices with matching mac address, and set DEVICE to
		# appropriate value if match is found.

		for device in /sys/class/net/*
		do
			if [ -f "$device/address" ]
			then
			current_mac=$(cat "$device/address")

				if [ "$bootif_mac" = "$current_mac" ]
				then
					DEVICE=${device##*/}
					break
				fi
			fi
		done
	fi
}

do_netsetup ()
{
	modprobe -q af_packet # For DHCP

	udevadm trigger
	udevadm settle

	[ -n "$ETHDEV_TIMEOUT" ] || ETHDEV_TIMEOUT=15
	echo "Using timeout of $ETHDEV_TIMEOUT seconds for network configuration."

	if [ -z "${NETBOOT}" ] && [ -z "${FETCH}" ] && [ -z "${HTTPFS}" ] && [ -z "${FTPFS}" ]
	then
		# See if we can select the device from BOOTIF
		Device_from_bootif

		# if ethdevice was not specified on the kernel command line
		# make sure we try to get a working network configuration
		# for *every* present network device (except for loopback of course)
		if [ -z "$ETHDEVICE" ]
		then
			echo "If you want to boot from a specific device use bootoption ethdevice=..."
			for device in /sys/class/net/*
			do
				dev=${device##*/}
				if [ "$dev" != "lo" ]
				then
					ETHDEVICE="$ETHDEVICE $dev"
				fi
			done
		fi

		# split args of ethdevice=eth0,eth1 into "eth0 eth1"
		for device in $(echo $ETHDEVICE | sed 's/,/ /g')
		do
			devlist="$devlist $device"
		done

		# this is tricky (and ugly) because ipconfig sometimes just hangs/runs into
		# an endless loop; if execution fails give it two further tries, that's
		# why we use '$devlist $devlist $devlist' for the other for loop
		for dev in $devlist $devlist $devlist
		do
			echo "Executing ipconfig -t $ETHDEV_TIMEOUT $dev"
			ipconfig -t "$ETHDEV_TIMEOUT" $dev | tee -a /netboot.config &
			jobid=$!
			sleep "$ETHDEV_TIMEOUT" ; sleep 1
			if [ -r /proc/"$jobid"/status ]
			then
				echo "Killing job $jobid for device $dev as ipconfig ran into recursion..."
				kill -9 $jobid
			fi

			# if configuration of device worked we should have an assigned
			# IP address, if so let's use the device as $DEVICE for later usage.
			# simple and primitive approach which seems to work fine
			if ifconfig $dev | grep -q 'inet.*addr:'
			then
				export DEVICE="$dev"
				break
			fi
		done
	else
		for interface in ${DEVICE}; do
			ipconfig -t "$ETHDEV_TIMEOUT" ${interface} | tee /netboot-${interface}.config

			[ -e /run/net-${interface}.conf ] && . /run/net-${interface}.conf

			if [ "$IPV4ADDR" != "0.0.0.0" ]
			then
				break
			fi
		done
	fi

	for interface in ${DEVICE}
	do
		# source relevant ipconfig output
		OLDHOSTNAME=${HOSTNAME}

		[ -e /run/net-${interface}.conf ] && . /run/net-${interface}.conf

		[ -z ${HOSTNAME} ] && HOSTNAME=${OLDHOSTNAME}
		export HOSTNAME

		if [ -n "${interface}" ]
		then
			HWADDR="$(cat /sys/class/net/${interface}/address)"
		fi

		if [ ! -e "/etc/resolv.conf" ]
		then
			echo "Creating /etc/resolv.conf"

			if [ -n "${DNSDOMAIN}" ]
			then
				echo "domain ${DNSDOMAIN}" > /etc/resolv.conf
				echo "search ${DNSDOMAIN}" >> /etc/resolv.conf
			fi

			for i in ${IPV4DNS0} ${IPV4DNS1} ${IPV4DNS1} ${DNSSERVERS}
			do
				if [ -n "$i" ] && [ "$i" != 0.0.0.0 ]
				then
					echo "nameserver $i" >> /etc/resolv.conf
				fi
			done
		fi

		# Check if we have a network device at all
		if ! ls /sys/class/net/"$interface" > /dev/null 2>&1 && \
		   ! ls /sys/class/net/eth0 > /dev/null 2>&1 && \
		   ! ls /sys/class/net/wlan0 > /dev/null 2>&1 && \
		   ! ls /sys/class/net/ath0 > /dev/null 2>&1 && \
		   ! ls /sys/class/net/ra0 > /dev/null 2>&1
		then
			panic "No supported network device found, maybe a non-mainline driver is required."
		fi
	done
}
