require '_h2ph_pre.ph';

no warnings qw(redefine misc);

if(defined (&__need_timeval) || defined (&__USE_GNU)) {
    unless(defined(&_STRUCT_TIMEVAL)) {
	eval 'sub _STRUCT_TIMEVAL () {1;}' unless defined(&_STRUCT_TIMEVAL);
	require 'bits/types.ph';
    }
}
unless(defined(&__need_timeval)) {
    unless(defined(&_BITS_TIME_H)) {
	eval 'sub _BITS_TIME_H () {1;}' unless defined(&_BITS_TIME_H);
	eval 'sub CLOCKS_PER_SEC () {(( &clock_t) 1000000);}' unless defined(&CLOCKS_PER_SEC);
	if((!defined (&__STRICT_ANSI__) || defined (&__USE_POSIX))  && !defined (&__USE_XOPEN2K)) {
	    require 'bits/types.ph';
	    eval 'sub CLK_TCK () {(( &__clock_t)  &__sysconf (2));}' unless defined(&CLK_TCK);
	}
	if(defined(&__USE_POSIX199309)) {
	    eval 'sub CLOCK_REALTIME () {0;}' unless defined(&CLOCK_REALTIME);
	    eval 'sub CLOCK_MONOTONIC () {1;}' unless defined(&CLOCK_MONOTONIC);
	    eval 'sub CLOCK_PROCESS_CPUTIME_ID () {2;}' unless defined(&CLOCK_PROCESS_CPUTIME_ID);
	    eval 'sub CLOCK_THREAD_CPUTIME_ID () {3;}' unless defined(&CLOCK_THREAD_CPUTIME_ID);
	    eval 'sub CLOCK_MONOTONIC_RAW () {4;}' unless defined(&CLOCK_MONOTONIC_RAW);
	    eval 'sub CLOCK_REALTIME_COARSE () {5;}' unless defined(&CLOCK_REALTIME_COARSE);
	    eval 'sub CLOCK_MONOTONIC_COARSE () {6;}' unless defined(&CLOCK_MONOTONIC_COARSE);
	    eval 'sub CLOCK_BOOTTIME () {7;}' unless defined(&CLOCK_BOOTTIME);
	    eval 'sub CLOCK_REALTIME_ALARM () {8;}' unless defined(&CLOCK_REALTIME_ALARM);
	    eval 'sub CLOCK_BOOTTIME_ALARM () {9;}' unless defined(&CLOCK_BOOTTIME_ALARM);
	    eval 'sub CLOCK_TAI () {11;}' unless defined(&CLOCK_TAI);
	    eval 'sub TIMER_ABSTIME () {1;}' unless defined(&TIMER_ABSTIME);
	}
	if(defined(&__USE_GNU)) {
	    require 'bits/timex.ph';
	}
    }
}
undef(&__need_timeval) if defined(&__need_timeval);
1;
