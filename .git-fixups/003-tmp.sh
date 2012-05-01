#!/bin/bash

for d in /tmp /var/tmp; do
	test -d $d || mkdir $d
	chmod 1777 $d
done
