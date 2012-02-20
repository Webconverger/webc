#!/bin/sh
if test -f ~/pb.sh
then
	logger xsession invoked

	# Log pb if in "debug mode"
	grep -qs noroot /proc/cmdline && ~/pb.sh ||
	bash -x ~/pb.sh 2> ~/pb.log
fi
