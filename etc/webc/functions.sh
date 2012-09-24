# installed config trumps boot cmdline
cmdline()
{
	test -e /proc/cmdline && cat /proc/cmdline
	test -e /etc/webc/cmdline && cat /etc/webc/cmdline
}

logs ()
{
	logger -t $0 -p daemon.info "$@"
}

cmdline_has()
{
	for i in `cmdline`
	do
		test "$1" = "${i%%=*}" && return 0
	done
	return 1
}

cmdline_get()
{
	for i in `cmdline`
	do
		test ${i/=*} = $1 && { echo "${i#$1=}"; return 0; }
	done
	return 1
}

mac_address()
{
	for i in /sys/class/net/*/address
	do
		tr -d ":" < $i
		return
	done
}

# # http://stackoverflow.com/questions/11827252
wait_for()
{
	np=$(mktemp -u)
	mkfifo $np
	inotifywait -m -e create "$(dirname $1)" > $np 2>&1 & ipid=$!
	while read output
	do
		if test -p "$1"
		then
			kill $ipid
			break
		fi
	done < $np
	rm -f $np
}

has_network()
{
	netstat -rn | grep -qs '^0.0.0.0'
}

# vim: set sw=8 sts=8 noexpandtab:
