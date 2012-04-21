#!/bin/bash
source "/etc/webc/webc.conf"
export HOME=/root
gpg_opts="--status-file /dev/null --logger-file /dev/null --attribute-file /dev/null --batch --no-tty -q"

cmdline_has debug && set -x

signed ()
{
	local name="$1"
	local url="${updates_url}/${name}"
	local file="${updates_cache_dir}/${name}"

	test -d $updates_cache_dir || mkdir -p $updates_cache_dir
	( cd $updates_cache_dir && {
		wget -q "$url"
		wget -q "${url}.asc"
	} )
	gpg $gpg_opts --verify "${file}.asc" "$file" && return 0
	logs "gpg verify failed for ${file}"
	rm -f ${file} "${file}.asc"
	return 1
}

updates ()
{
	signed $updates_manifest &&
	cat "${updates_cache_dir}/${updates_manifest}" | while read f ; do
		file="${updates_cache_dir}/${f}"
		test -e "${file}.done" && continue
		! signed $f && continue
		case $f in
			*.sh)
				chmod 700 $file
				$file | while read l; do logs "$l"; done
				;;
		esac
		touch "${file}.done"
		logs "Update completed: $f"
	done
}
update_keys() {
	test -e /var/run/gpg-check && return
	gpg --refresh-keys --keyserver hkp://keys.gnupg.net &>/dev/null && touch /var/run/gpg-check
}

while has_network
do
	if test -s /etc/webc/id && source /etc/webc/webc.conf
	then
	! cmdline_has noupdates && {
		update_keys
		updates
	}
	fi
	sleep $updates_interval
done
