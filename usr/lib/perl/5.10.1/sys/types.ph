require '_h2ph_pre.ph';

no warnings qw(redefine misc);

unless(defined(&_SYS_TYPES_H)) {
    eval 'sub _SYS_TYPES_H () {1;}' unless defined(&_SYS_TYPES_H);
    require 'features.ph';
    require 'bits/types.ph';
    if(defined(&__USE_BSD)) {
	unless(defined(&__u_char_defined)) {
	    eval 'sub __u_char_defined () {1;}' unless defined(&__u_char_defined);
	}
    }
    unless(defined(&__ino_t_defined)) {
	unless(defined(&__USE_FILE_OFFSET64)) {
	} else {
	}
	eval 'sub __ino_t_defined () {1;}' unless defined(&__ino_t_defined);
    }
    if(defined (defined(&__USE_LARGEFILE64) ? &__USE_LARGEFILE64 : undef)  && !defined (defined(&__ino64_t_defined) ? &__ino64_t_defined : undef)) {
	eval 'sub __ino64_t_defined () {1;}' unless defined(&__ino64_t_defined);
    }
    unless(defined(&__dev_t_defined)) {
	eval 'sub __dev_t_defined () {1;}' unless defined(&__dev_t_defined);
    }
    unless(defined(&__gid_t_defined)) {
	eval 'sub __gid_t_defined () {1;}' unless defined(&__gid_t_defined);
    }
    unless(defined(&__mode_t_defined)) {
	eval 'sub __mode_t_defined () {1;}' unless defined(&__mode_t_defined);
    }
    unless(defined(&__nlink_t_defined)) {
	eval 'sub __nlink_t_defined () {1;}' unless defined(&__nlink_t_defined);
    }
    unless(defined(&__uid_t_defined)) {
	eval 'sub __uid_t_defined () {1;}' unless defined(&__uid_t_defined);
    }
    unless(defined(&__off_t_defined)) {
	unless(defined(&__USE_FILE_OFFSET64)) {
	} else {
	}
	eval 'sub __off_t_defined () {1;}' unless defined(&__off_t_defined);
    }
    if(defined (defined(&__USE_LARGEFILE64) ? &__USE_LARGEFILE64 : undef)  && !defined (defined(&__off64_t_defined) ? &__off64_t_defined : undef)) {
	eval 'sub __off64_t_defined () {1;}' unless defined(&__off64_t_defined);
    }
    unless(defined(&__pid_t_defined)) {
	eval 'sub __pid_t_defined () {1;}' unless defined(&__pid_t_defined);
    }
    if((defined (defined(&__USE_SVID) ? &__USE_SVID : undef) || defined (defined(&__USE_XOPEN) ? &__USE_XOPEN : undef))  && !defined (defined(&__id_t_defined) ? &__id_t_defined : undef)) {
	eval 'sub __id_t_defined () {1;}' unless defined(&__id_t_defined);
    }
    unless(defined(&__ssize_t_defined)) {
	eval 'sub __ssize_t_defined () {1;}' unless defined(&__ssize_t_defined);
    }
    if(defined(&__USE_BSD)) {
	unless(defined(&__daddr_t_defined)) {
	    eval 'sub __daddr_t_defined () {1;}' unless defined(&__daddr_t_defined);
	}
    }
    if((defined (defined(&__USE_SVID) ? &__USE_SVID : undef) || defined (defined(&__USE_XOPEN) ? &__USE_XOPEN : undef))  && !defined (defined(&__key_t_defined) ? &__key_t_defined : undef)) {
	eval 'sub __key_t_defined () {1;}' unless defined(&__key_t_defined);
    }
    if(defined(&__USE_XOPEN)) {
	eval 'sub __need_clock_t () {1;}' unless defined(&__need_clock_t);
    }
    eval 'sub __need_time_t () {1;}' unless defined(&__need_time_t);
    eval 'sub __need_timer_t () {1;}' unless defined(&__need_timer_t);
    eval 'sub __need_clockid_t () {1;}' unless defined(&__need_clockid_t);
    require 'time.ph';
    if(defined(&__USE_XOPEN)) {
	unless(defined(&__useconds_t_defined)) {
	    eval 'sub __useconds_t_defined () {1;}' unless defined(&__useconds_t_defined);
	}
	unless(defined(&__suseconds_t_defined)) {
	    eval 'sub __suseconds_t_defined () {1;}' unless defined(&__suseconds_t_defined);
	}
    }
    eval 'sub __need_size_t () {1;}' unless defined(&__need_size_t);
    require 'stddef.ph';
    if(defined(&__USE_MISC)) {
    }
    if(! &__GNUC_PREREQ (2, 7)) {
	unless(defined(&__int8_t_defined)) {
	    eval 'sub __int8_t_defined () {1;}' unless defined(&__int8_t_defined);
	    if((defined(&__WORDSIZE) ? &__WORDSIZE : undef) == 64) {
	    }
 elsif((defined(&__GLIBC_HAVE_LONG_LONG) ? &__GLIBC_HAVE_LONG_LONG : undef)) {
	    }
	}
	if((defined(&__WORDSIZE) ? &__WORDSIZE : undef) == 64) {
	}
 elsif((defined(&__GLIBC_HAVE_LONG_LONG) ? &__GLIBC_HAVE_LONG_LONG : undef)) {
	}
    } else {
	eval 'sub __intN_t {
	    my($N, $MODE) = @_;
    	    eval q( &typedef \'int\' \'int\'$N &_t  &__attribute__ (( &__mode__ ($MODE))));
	}' unless defined(&__intN_t);
	eval 'sub __u_intN_t {
	    my($N, $MODE) = @_;
    	    eval q( &typedef \'unsigned int u_int\'$N &_t  &__attribute__ (( &__mode__ ($MODE))));
	}' unless defined(&__u_intN_t);
	unless(defined(&__int8_t_defined)) {
	    eval 'sub __int8_t_defined () {1;}' unless defined(&__int8_t_defined);
	}
    }
    eval 'sub __BIT_TYPES_DEFINED__ () {1;}' unless defined(&__BIT_TYPES_DEFINED__);
    if(defined(&__USE_BSD)) {
	require 'endian.ph';
	require 'sys/select.ph';
	require 'sys/sysmacros.ph';
    }
    if(defined (defined(&__USE_UNIX98) ? &__USE_UNIX98 : undef)  && !defined (defined(&__blksize_t_defined) ? &__blksize_t_defined : undef)) {
	eval 'sub __blksize_t_defined () {1;}' unless defined(&__blksize_t_defined);
    }
    unless(defined(&__USE_FILE_OFFSET64)) {
	unless(defined(&__blkcnt_t_defined)) {
	    eval 'sub __blkcnt_t_defined () {1;}' unless defined(&__blkcnt_t_defined);
	}
	unless(defined(&__fsblkcnt_t_defined)) {
	    eval 'sub __fsblkcnt_t_defined () {1;}' unless defined(&__fsblkcnt_t_defined);
	}
	unless(defined(&__fsfilcnt_t_defined)) {
	    eval 'sub __fsfilcnt_t_defined () {1;}' unless defined(&__fsfilcnt_t_defined);
	}
    } else {
	unless(defined(&__blkcnt_t_defined)) {
	    eval 'sub __blkcnt_t_defined () {1;}' unless defined(&__blkcnt_t_defined);
	}
	unless(defined(&__fsblkcnt_t_defined)) {
	    eval 'sub __fsblkcnt_t_defined () {1;}' unless defined(&__fsblkcnt_t_defined);
	}
	unless(defined(&__fsfilcnt_t_defined)) {
	    eval 'sub __fsfilcnt_t_defined () {1;}' unless defined(&__fsfilcnt_t_defined);
	}
    }
    if(defined(&__USE_LARGEFILE64)) {
    }
    if(defined (defined(&__USE_POSIX199506) ? &__USE_POSIX199506 : undef) || defined (defined(&__USE_UNIX98) ? &__USE_UNIX98 : undef)) {
	require 'bits/pthreadtypes.ph';
    }
}
1;
