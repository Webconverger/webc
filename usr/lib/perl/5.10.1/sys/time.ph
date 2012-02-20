require '_h2ph_pre.ph';

no warnings qw(redefine misc);

unless(defined(&_SYS_TIME_H)) {
    eval 'sub _SYS_TIME_H () {1;}' unless defined(&_SYS_TIME_H);
    require 'features.ph';
    require 'bits/types.ph';
    eval 'sub __need_time_t () {1;}' unless defined(&__need_time_t);
    require 'time.ph';
    eval 'sub __need_timeval () {1;}' unless defined(&__need_timeval);
    require 'bits/time.ph';
    require 'sys/select.ph';
    unless(defined(&__suseconds_t_defined)) {
	eval 'sub __suseconds_t_defined () {1;}' unless defined(&__suseconds_t_defined);
    }
    if(defined(&__USE_GNU)) {
	eval 'sub TIMEVAL_TO_TIMESPEC {
	    my($tv, $ts) = @_;
    	    eval q({ ($ts)-> &tv_sec = ($tv)-> &tv_sec; ($ts)-> &tv_nsec = ($tv)-> &tv_usec * 1000; });
	}' unless defined(&TIMEVAL_TO_TIMESPEC);
	eval 'sub TIMESPEC_TO_TIMEVAL {
	    my($tv, $ts) = @_;
    	    eval q({ ($tv)-> &tv_sec = ($ts)-> &tv_sec; ($tv)-> &tv_usec = ($ts)-> &tv_nsec / 1000; });
	}' unless defined(&TIMESPEC_TO_TIMEVAL);
    }
    if(defined(&__USE_BSD)) {
    } else {
    }
    if(defined(&__USE_BSD)) {
    }
    eval("sub ITIMER_REAL () { 0; }") unless defined(&ITIMER_REAL);
    eval("sub ITIMER_VIRTUAL () { 1; }") unless defined(&ITIMER_VIRTUAL);
    eval("sub ITIMER_PROF () { 2; }") unless defined(&ITIMER_PROF);
    if(defined (defined(&__USE_GNU) ? &__USE_GNU : undef)  && !defined (defined(&__cplusplus) ? &__cplusplus : undef)) {
    } else {
    }
    if(defined(&__USE_BSD)) {
    }
    if(defined(&__USE_GNU)) {
    }
    if(defined(&__USE_BSD)) {
	eval 'sub timerisset {
	    my($tvp) = @_;
    	    eval q((($tvp)-> &tv_sec || ($tvp)-> &tv_usec));
	}' unless defined(&timerisset);
	eval 'sub timerclear {
	    my($tvp) = @_;
    	    eval q((($tvp)-> &tv_sec = ($tvp)-> &tv_usec = 0));
	}' unless defined(&timerclear);
	eval 'sub timercmp {
	    my($a, $b, $CMP) = @_;
    	    eval q(((($a)-> &tv_sec == ($b)-> &tv_sec) ? (($a)-> &tv_usec $CMP ($b)-> &tv_usec) : (($a)-> &tv_sec $CMP ($b)-> &tv_sec)));
	}' unless defined(&timercmp);
	eval 'sub timeradd {
	    my($a, $b, $result) = @_;
    	    eval q( &do { ($result)-> &tv_sec = ($a)-> &tv_sec + ($b)-> &tv_sec; ($result)-> &tv_usec = ($a)-> &tv_usec + ($b)-> &tv_usec;  &if (($result)-> &tv_usec >= 1000000) { ++($result)-> &tv_sec; ($result)-> &tv_usec -= 1000000; } }  &while (0));
	}' unless defined(&timeradd);
	eval 'sub timersub {
	    my($a, $b, $result) = @_;
    	    eval q( &do { ($result)-> &tv_sec = ($a)-> &tv_sec - ($b)-> &tv_sec; ($result)-> &tv_usec = ($a)-> &tv_usec - ($b)-> &tv_usec;  &if (($result)-> &tv_usec < 0) { --($result)-> &tv_sec; ($result)-> &tv_usec += 1000000; } }  &while (0));
	}' unless defined(&timersub);
    }
}
1;
