#!/bin/sh

# set -e

# Reading configuration file from filesystem and live-media
for _FILE in /etc/live/boot.conf /etc/live/boot/*
do
	if [ -e "${_FILE}" ]
	then
		. "${_FILE}"
	fi
done

for _SCRIPT in /lib/live/boot/????-*
do
	if [ -e "${_SCRIPT}" ]
	then
		. ${_SCRIPT}
	fi
done
