require '_h2ph_pre.ph';

no warnings qw(redefine misc);

unless(defined(&_SYS_RESOURCE_H)) {
    die("Never use <bits/resource.h> directly; include <sys/resource.h> instead.");
}
require 'bits/types.ph';
eval("sub RLIMIT_CPU () { 0; }") unless defined(&RLIMIT_CPU);
eval("sub RLIMIT_FSIZE () { 1; }") unless defined(&RLIMIT_FSIZE);
eval("sub RLIMIT_DATA () { 2; }") unless defined(&RLIMIT_DATA);
eval("sub RLIMIT_STACK () { 3; }") unless defined(&RLIMIT_STACK);
eval("sub RLIMIT_CORE () { 4; }") unless defined(&RLIMIT_CORE);
eval("sub __RLIMIT_RSS () { 5; }") unless defined(&__RLIMIT_RSS);
eval("sub RLIMIT_RSS () { __RLIMIT_RSS; }") unless defined(&RLIMIT_RSS);
eval("sub RLIMIT_NOFILE () { 7; }") unless defined(&RLIMIT_NOFILE);
eval("sub __RLIMIT_OFILE () { RLIMIT_NOFILE; }") unless defined(&__RLIMIT_OFILE);
eval("sub RLIMIT_OFILE () { __RLIMIT_OFILE; }") unless defined(&RLIMIT_OFILE);
eval("sub RLIMIT_AS () { 9; }") unless defined(&RLIMIT_AS);
eval("sub __RLIMIT_NPROC () { 6; }") unless defined(&__RLIMIT_NPROC);
eval("sub RLIMIT_NPROC () { __RLIMIT_NPROC; }") unless defined(&RLIMIT_NPROC);
eval("sub __RLIMIT_MEMLOCK () { 8; }") unless defined(&__RLIMIT_MEMLOCK);
eval("sub RLIMIT_MEMLOCK () { __RLIMIT_MEMLOCK; }") unless defined(&RLIMIT_MEMLOCK);
eval("sub __RLIMIT_LOCKS () { 10; }") unless defined(&__RLIMIT_LOCKS);
eval("sub RLIMIT_LOCKS () { __RLIMIT_LOCKS; }") unless defined(&RLIMIT_LOCKS);
eval("sub __RLIMIT_SIGPENDING () { 11; }") unless defined(&__RLIMIT_SIGPENDING);
eval("sub RLIMIT_SIGPENDING () { __RLIMIT_SIGPENDING; }") unless defined(&RLIMIT_SIGPENDING);
eval("sub __RLIMIT_MSGQUEUE () { 12; }") unless defined(&__RLIMIT_MSGQUEUE);
eval("sub RLIMIT_MSGQUEUE () { __RLIMIT_MSGQUEUE; }") unless defined(&RLIMIT_MSGQUEUE);
eval("sub __RLIMIT_NICE () { 13; }") unless defined(&__RLIMIT_NICE);
eval("sub RLIMIT_NICE () { __RLIMIT_NICE; }") unless defined(&RLIMIT_NICE);
eval("sub __RLIMIT_RTPRIO () { 14; }") unless defined(&__RLIMIT_RTPRIO);
eval("sub RLIMIT_RTPRIO () { __RLIMIT_RTPRIO; }") unless defined(&RLIMIT_RTPRIO);
eval("sub __RLIMIT_RTTIME () { 15; }") unless defined(&__RLIMIT_RTTIME);
eval("sub RLIMIT_RTTIME () { __RLIMIT_RTTIME; }") unless defined(&RLIMIT_RTTIME);
eval("sub __RLIMIT_NLIMITS () { 16; }") unless defined(&__RLIMIT_NLIMITS);
eval("sub __RLIM_NLIMITS () { __RLIMIT_NLIMITSRLIMIT_NLIMITS=__RLIMIT_NLIMITS; }") unless defined(&__RLIM_NLIMITS);
eval("sub RLIM_NLIMITS () { __RLIM_NLIMITS; }") unless defined(&RLIM_NLIMITS);
unless(defined(&__USE_FILE_OFFSET64)) {
    eval 'sub RLIM_INFINITY () {((~0));}' unless defined(&RLIM_INFINITY);
} else {
    eval 'sub RLIM_INFINITY () {0xffffffffffffffff;}' unless defined(&RLIM_INFINITY);
}
if(defined(&__USE_LARGEFILE64)) {
    eval 'sub RLIM64_INFINITY () {0xffffffffffffffff;}' unless defined(&RLIM64_INFINITY);
}
unless(defined(&RLIM_SAVED_MAX)) {
    sub RLIM_SAVED_MAX () {	 &RLIM_INFINITY;}
}
unless(defined(&RLIM_SAVED_CUR)) {
    sub RLIM_SAVED_CUR () {	 &RLIM_INFINITY;}
}
unless(defined(&__USE_FILE_OFFSET64)) {
} else {
}
if(defined(&__USE_LARGEFILE64)) {
}
if(defined(&__USE_LARGEFILE64)) {
}
eval("sub RUSAGE_SELF () { 0; }") unless defined(&RUSAGE_SELF);
eval("sub RUSAGE_CHILDREN () { -1; }") unless defined(&RUSAGE_CHILDREN);
unless(defined(&__need_timeval)) {
    sub __need_timeval () {	1;}
}
require 'bits/time.ph';
unless(defined(&PRIO_MIN)) {
    sub PRIO_MIN () {	-20;}
}
unless(defined(&PRIO_MAX)) {
    sub PRIO_MAX () {	20;}
}
eval("sub PRIO_PROCESS () { 0; }") unless defined(&PRIO_PROCESS);
eval("sub PRIO_PGRP () { 1; }") unless defined(&PRIO_PGRP);
eval("sub PRIO_USER () { 2; }") unless defined(&PRIO_USER);
if(defined(&__USE_GNU)) {
    unless(defined(&__USE_FILE_OFFSET64)) {
    } else {
	if(defined(&__REDIRECT_NTH)) {
	} else {
	    eval 'sub prlimit () { &prlimit64;}' unless defined(&prlimit);
	}
    }
    if(defined(&__USE_LARGEFILE64)) {
    }
}
1;
