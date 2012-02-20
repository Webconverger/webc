require '_h2ph_pre.ph';

no warnings qw(redefine misc);

unless(defined(&_TIME_H)) {
    if((! defined (defined(&__need_time_t) ? &__need_time_t : undef)  && !defined (defined(&__need_clock_t) ? &__need_clock_t : undef)  && ! defined (defined(&__need_timespec) ? &__need_timespec : undef))) {
	eval 'sub _TIME_H () {1;}' unless defined(&_TIME_H);
	require 'features.ph';
    }
    if(defined(&_TIME_H)) {
	eval 'sub __need_size_t () {1;}' unless defined(&__need_size_t);
	eval 'sub __need_NULL () {1;}' unless defined(&__need_NULL);
	require 'stddef.ph';
	require 'bits/time.ph';
	if(!defined (defined(&__STRICT_ANSI__) ? &__STRICT_ANSI__ : undef)  && !defined (defined(&__USE_XOPEN2K) ? &__USE_XOPEN2K : undef)) {
	    unless(defined(&CLK_TCK)) {
		eval 'sub CLK_TCK () { &CLOCKS_PER_SEC;}' unless defined(&CLK_TCK);
	    }
	}
    }
    if(!defined (defined(&__clock_t_defined) ? &__clock_t_defined : undef)  && (defined (defined(&_TIME_H) ? &_TIME_H : undef) || defined (defined(&__need_clock_t) ? &__need_clock_t : undef))) {
	eval 'sub __clock_t_defined () {1;}' unless defined(&__clock_t_defined);
	require 'bits/types.ph';
	if(defined (defined(&__USE_XOPEN) ? &__USE_XOPEN : undef) || defined (defined(&__USE_POSIX) ? &__USE_POSIX : undef) || defined (defined(&__USE_MISC) ? &__USE_MISC : undef)) {
	}
    }
    undef(&__need_clock_t) if defined(&__need_clock_t);
    if(!defined (defined(&__time_t_defined) ? &__time_t_defined : undef)  && (defined (defined(&_TIME_H) ? &_TIME_H : undef) || defined (defined(&__need_time_t) ? &__need_time_t : undef))) {
	eval 'sub __time_t_defined () {1;}' unless defined(&__time_t_defined);
	require 'bits/types.ph';
	if(defined (defined(&__USE_POSIX) ? &__USE_POSIX : undef) || defined (defined(&__USE_MISC) ? &__USE_MISC : undef) || defined (defined(&__USE_SVID) ? &__USE_SVID : undef)) {
	}
    }
    undef(&__need_time_t) if defined(&__need_time_t);
    if(!defined (defined(&__clockid_t_defined) ? &__clockid_t_defined : undef)  && ((defined (defined(&_TIME_H) ? &_TIME_H : undef)  && defined (defined(&__USE_POSIX199309) ? &__USE_POSIX199309 : undef)) || defined (defined(&__need_clockid_t) ? &__need_clockid_t : undef))) {
	eval 'sub __clockid_t_defined () {1;}' unless defined(&__clockid_t_defined);
	require 'bits/types.ph';
    }
    undef(&__clockid_time_t) if defined(&__clockid_time_t);
    if(!defined (defined(&__timer_t_defined) ? &__timer_t_defined : undef)  && ((defined (defined(&_TIME_H) ? &_TIME_H : undef)  && defined (defined(&__USE_POSIX199309) ? &__USE_POSIX199309 : undef)) || defined (defined(&__need_timer_t) ? &__need_timer_t : undef))) {
	eval 'sub __timer_t_defined () {1;}' unless defined(&__timer_t_defined);
	require 'bits/types.ph';
    }
    undef(&__need_timer_t) if defined(&__need_timer_t);
    if(!defined (defined(&__timespec_defined) ? &__timespec_defined : undef)  && ((defined (defined(&_TIME_H) ? &_TIME_H : undef)  && (defined (defined(&__USE_POSIX199309) ? &__USE_POSIX199309 : undef) || defined (defined(&__USE_MISC) ? &__USE_MISC : undef))) || defined (defined(&__need_timespec) ? &__need_timespec : undef))) {
	eval 'sub __timespec_defined () {1;}' unless defined(&__timespec_defined);
	require 'bits/types.ph';
    }
    undef(&__need_timespec) if defined(&__need_timespec);
    if(defined(&_TIME_H)) {
	if(defined(&__USE_BSD)) {
	} else {
	}
	if(defined (defined(&__USE_XOPEN) ? &__USE_XOPEN : undef) || defined (defined(&__USE_POSIX) ? &__USE_POSIX : undef) || defined (defined(&__USE_MISC) ? &__USE_MISC : undef)) {
	}
	if(defined(&__USE_POSIX199309)) {
	}
	if(defined(&__USE_XOPEN2K)) {
	    unless(defined(&__pid_t_defined)) {
		eval 'sub __pid_t_defined () {1;}' unless defined(&__pid_t_defined);
	    }
	}
	if(defined(&__USE_XOPEN)) {
	}
	if(defined(&__USE_XOPEN2K8)) {
	    require 'xlocale.ph';
	}
	if(defined(&__USE_GNU)) {
	}
	if(defined (defined(&__USE_POSIX) ? &__USE_POSIX : undef) || defined (defined(&__USE_MISC) ? &__USE_MISC : undef)) {
	}
	if(defined (defined(&__USE_POSIX) ? &__USE_POSIX : undef) || defined (defined(&__USE_MISC) ? &__USE_MISC : undef)) {
	}
	if(defined(&__USE_POSIX)) {
	}
	if(defined (defined(&__USE_SVID) ? &__USE_SVID : undef) || defined (defined(&__USE_XOPEN) ? &__USE_XOPEN : undef)) {
	}
	if(defined(&__USE_SVID)) {
	}
	eval 'sub __isleap {
	    my($year) = @_;
    	    eval q((($year) % 4== 0 && (($year) % 100!= 0|| ($year) % 400== 0)));
	}' unless defined(&__isleap);
	if(defined(&__USE_MISC)) {
	}
	if(defined(&__USE_POSIX199309)) {
	    if(defined(&__USE_XOPEN2K)) {
	    }
	}
	if(defined(&__USE_XOPEN_EXTENDED)) {
	}
	if(defined(&__USE_GNU)) {
	}
    }
}
1;
