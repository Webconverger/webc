#!/bin/bash
. "/etc/webc/webc.conf"
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
	} ) &&
	update_keys # this can be slow, only run on successful download
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

until test -p $updates_pipe # wait for xinitrc to trigger an update
do
    sleep 0.25 # wait for xinitrc to create pipe
done

# ensure $updates_url has latest $webc_id
. "/etc/webc/webc.conf"

if cmdline_has updates
then
	updates
fi

echo ACK > $updates_pipe

# updates should restart via inittab and get blocked 
# until $updates_pipe is re-created
