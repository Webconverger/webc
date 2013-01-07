require '_h2ph_pre.ph';

no warnings qw(redefine misc);

unless(defined(&_SIGNAL_H)) {
    if(!defined (&__need_sig_atomic_t)  && !defined (&__need_sigset_t)) {
	eval 'sub _SIGNAL_H () {1;}' unless defined(&_SIGNAL_H);
    }
    require 'features.ph';
    require 'bits/sigset.ph';
    if(defined (&__need_sig_atomic_t) || defined (&_SIGNAL_H)) {
	unless(defined(&__sig_atomic_t_defined)) {
	    eval 'sub __sig_atomic_t_defined () {1;}' unless defined(&__sig_atomic_t_defined);
	}
	undef(&__need_sig_atomic_t) if defined(&__need_sig_atomic_t);
    }
    if(defined (&__need_sigset_t) || (defined (&_SIGNAL_H)  && defined (&__USE_POSIX))) {
	unless(defined(&__sigset_t_defined)) {
	    eval 'sub __sigset_t_defined () {1;}' unless defined(&__sigset_t_defined);
	}
	undef(&__need_sigset_t) if defined(&__need_sigset_t);
    }
    if(defined(&_SIGNAL_H)) {
	require 'bits/types.ph';
	require 'bits/signum.ph';
	if(defined (&__USE_XOPEN) || defined (&__USE_XOPEN2K)) {
	    unless(defined(&__pid_t_defined)) {
		eval 'sub __pid_t_defined () {1;}' unless defined(&__pid_t_defined);
	    }
	    if(defined(&__USE_XOPEN)) {
	    }
	    unless(defined(&__uid_t_defined)) {
		eval 'sub __uid_t_defined () {1;}' unless defined(&__uid_t_defined);
	    }
	}
	if(defined(&__USE_POSIX199309)) {
	    eval 'sub __need_timespec () {1;}' unless defined(&__need_timespec);
	    require 'time.ph';
	    require 'bits/siginfo.ph';
	}
	if(defined(&__USE_GNU)) {
	}
	if(defined(&__USE_BSD)) {
	} else {
	    if(defined(&__REDIRECT_NTH)) {
	    } else {
		eval 'sub signal () { &__sysv_signal;}' unless defined(&signal);
	    }
	}
	if(defined(&__USE_XOPEN)) {
	}
	if(defined(&__USE_POSIX)) {
	}
	if(defined (&__USE_BSD) || defined (&__USE_XOPEN_EXTENDED)) {
	}
	if(defined(&__USE_SVID)) {
	}
	if(defined (&__USE_MISC) || defined (&__USE_XOPEN2K)) {
	}
	if(defined(&__USE_XOPEN2K)) {
	}
	if(defined(&__FAVOR_BSD)) {
	} else {
	    if(defined(&__USE_XOPEN)) {
		if(defined(&__GNUC__)) {
		} else {
		    eval 'sub sigpause {
		        my($sig) = @_;
    			eval q( &__sigpause (($sig), 1));
		    }' unless defined(&sigpause);
		}
	    }
	}
	if(defined(&__USE_BSD)) {
	    eval 'sub sigmask {
	        my($sig) = @_;
    		eval q( &__sigmask($sig));
	    }' unless defined(&sigmask);
	}
	if(defined(&__USE_MISC)) {
	    eval 'sub NSIG () { &_NSIG;}' unless defined(&NSIG);
	}
	if(defined(&__USE_GNU)) {
	}
	if(defined(&__USE_BSD)) {
	}
	if(defined(&__USE_POSIX)) {
	    if(defined(&__USE_GNU)) {
	    }
	    require 'bits/sigaction.ph';
	    if(defined(&__USE_POSIX199309)) {
	    }
	}
	if(defined(&__USE_BSD)) {
	    eval 'sub sv_onstack () { &sv_flags;}' unless defined(&sv_onstack);
	    eval 'sub SV_ONSTACK () {(1<< 0);}' unless defined(&SV_ONSTACK);
	    eval 'sub SV_INTERRUPT () {(1<< 1);}' unless defined(&SV_INTERRUPT);
	    eval 'sub SV_RESETHAND () {(1<< 2);}' unless defined(&SV_RESETHAND);
	    require 'bits/sigcontext.ph';
	}
	if(defined (&__USE_BSD) || defined (&__USE_XOPEN_EXTENDED) || defined (&__USE_XOPEN2K8)) {
	    eval 'sub __need_size_t () {1;}' unless defined(&__need_size_t);
	    require 'stddef.ph';
	    require 'bits/sigstack.ph';
	    if(defined (&__USE_XOPEN) || defined (&__USE_XOPEN2K8)) {
		require 'sys/ucontext.ph';
	    }
	}
	if(defined(&__USE_XOPEN_EXTENDED)) {
	}
	if(defined (&__USE_POSIX199506) || defined (&__USE_UNIX98)) {
	    require 'bits/pthreadtypes.ph';
	    require 'bits/sigthread.ph';
	}
    }
}
1;
