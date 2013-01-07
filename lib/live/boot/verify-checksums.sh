#!/bin/sh

#set -e

Verify_checksums ()
{
	_MOUNTPOINT="${1}"

	_DIGESTS="sha512 sha384 sha256 sha224 sha1 md5"
	_TTY="/dev/tty8"

	log_begin_msg "Verifying checksums"

	cd "${_MOUNTPOINT}"

	for _DIGEST in ${_DIGESTS}
	do
		_CHECKSUMS="$(echo ${_DIGEST} | tr [a-z] [A-Z])SUMS"

		if [ -e "${_CHECKSUMS}" ]
		then
			echo "Found ${_CHECKSUMS}..." > "${_TTY}"

			if [ -e "/bin/${_DIGEST}sum" ]
			then
				echo "Checking ${_CHECKSUMS}..." > "${_TTY}"

				# Verify checksums
				/bin/${_DIGEST}sum -c "${_CHECKSUMS}" < "${_TTY}" > "${_TTY}"
				_RETURN="${?}"

				# Stop after first verification
				break
			else
				echo "Not found /bin/${_DIGEST}sum..." > "${_TTY}"
			fi
		fi
	done

	log_end_msg

	case "${_RETURN}" in
		0)
			log_success_msg "Verification successfull, rebooting in 10 seconds."
			sleep 10

			# Unmount live-media
			cd /
			umount -f ${_MOUNTPOINT} > /dev/null 2>&1
			sync

			# Attempt to remount all mounted filesystems read-only
			echo u > /proc/sysrq-trigger

			# Immediately reboot the system without syncing or unmounting filesystems
			echo b > /proc/sysrq-trigger
			;;

		*)
			panic "Verification failed, $(basename ${_TTY}) for more information."
			;;
	esac
}
