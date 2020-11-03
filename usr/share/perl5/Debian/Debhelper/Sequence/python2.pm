#! /usr/bin/perl
# debhelper sequence file for dh_python2

use warnings;
use strict;
use Debian::Debhelper::Dh_Lib;

insert_before("dh_installinit", "dh_python2");
remove_command("dh_pycentral");
remove_command("dh_pysupport");

1
