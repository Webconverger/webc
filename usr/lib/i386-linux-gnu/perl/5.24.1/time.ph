require '_h2ph_pre.ph';

no warnings qw(redefine misc);

unless(defined(&_TIME_H)) {
    if((! defined (&__need_time_t)  && !defined (&__need_clock_t)  && ! defined (&__need_timespec))) {
	eval 'sub _TIME_H () {1;}' unless defined(&_TIME_H);
	require 'features.ph';
    }
    if(defined(&_TIME_H)) {
	eval 'sub __need_size_t () {1;}' unless defined(&__need_size_t);
	eval 'sub __need_NULL () {1;}' unless defined(&__need_NULL);
	require 'stddef.ph';
	require 'bits/time.ph';
	if(!defined (&__STRICT_ANSI__)  && !defined (&__USE_XOPEN2K)) {
	    unless(defined(&CLK_TCK)) {
		eval 'sub CLK_TCK () { &CLOCKS_PER_SEC;}' unless defined(&CLK_TCK);
	    }
	}
    }
    if(!defined (&__clock_t_defined)  && (defined (&_TIME_H) || defined (&__need_clock_t))) {
	eval 'sub __clock_t_defined () {1;}' unless defined(&__clock_t_defined);
	require 'bits/types.ph';
	if(defined (&__USE_XOPEN) || defined (&__USE_POSIX)) {
	}
    }
    undef(&__need_clock_t) if defined(&__need_clock_t);
    if(!defined (&__time_t_defined)  && (defined (&_TIME_H) || defined (&__need_time_t))) {
	eval 'sub __time_t_defined () {1;}' unless defined(&__time_t_defined);
	require 'bits/types.ph';
	if(defined(&__USE_POSIX)) {
	}
    }
    undef(&__need_time_t) if defined(&__need_time_t);
    if(!defined (&__clockid_t_defined)  && ((defined (&_TIME_H)  && defined (&__USE_POSIX199309)) || defined (&__need_clockid_t))) {
	eval 'sub __clockid_t_defined () {1;}' unless defined(&__clockid_t_defined);
	require 'bits/types.ph';
    }
    undef(&__clockid_time_t) if defined(&__clockid_time_t);
    if(!defined (&__timer_t_defined)  && ((defined (&_TIME_H)  && defined (&__USE_POSIX199309)) || defined (&__need_timer_t))) {
	eval 'sub __timer_t_defined () {1;}' unless defined(&__timer_t_defined);
	require 'bits/types.ph';
    }
    undef(&__need_timer_t) if defined(&__need_timer_t);
    if((!defined (&__timespec_defined)  && ((defined (&_TIME_H)  && (defined (&__USE_POSIX199309) || defined (&__USE_ISOC11))) || defined (&__need_timespec)))) {
	eval 'sub __timespec_defined () {1;}' unless defined(&__timespec_defined);
	require 'bits/types.ph';
    }
    undef(&__need_timespec) if defined(&__need_timespec);
    if(defined(&_TIME_H)) {
	if(defined(&__USE_MISC)) {
	} else {
	}
	if(defined (&__USE_XOPEN) || defined (&__USE_POSIX)) {
	}
	if(defined(&__USE_POSIX199309)) {
	}
	if(defined(&__USE_XOPEN2K)) {
	    unless(defined(&__pid_t_defined)) {
		eval 'sub __pid_t_defined () {1;}' unless defined(&__pid_t_defined);
	    }
	}
	if(defined(&__USE_ISOC11)) {
	    eval 'sub TIME_UTC () {1;}' unless defined(&TIME_UTC);
	}
	if(defined(&__USE_XOPEN)) {
	}
	if(defined(&__USE_XOPEN2K8)) {
	    require 'xlocale.ph';
	}
	if(defined(&__USE_GNU)) {
	}
	if(defined(&__USE_POSIX)) {
	}
	if(defined(&__USE_POSIX)) {
	}
	if(defined(&__USE_POSIX)) {
	}
	if(defined (&__USE_MISC) || defined (&__USE_XOPEN)) {
	}
	if(defined(&__USE_MISC)) {
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
	if(defined(&__USE_ISOC11)) {
	}
	if(defined(&__USE_XOPEN_EXTENDED)) {
	}
	if(defined(&__USE_GNU)) {
	}
    }
}
1;
