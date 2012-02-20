require '_h2ph_pre.ph';

no warnings qw(redefine misc);

unless(defined(&_SYS_SELECT_H)) {
    eval 'sub _SYS_SELECT_H () {1;}' unless defined(&_SYS_SELECT_H);
    require 'features.ph';
    require 'bits/types.ph';
    require 'bits/select.ph';
    require 'bits/sigset.ph';
    unless(defined(&__sigset_t_defined)) {
	eval 'sub __sigset_t_defined () {1;}' unless defined(&__sigset_t_defined);
    }
    eval 'sub __need_time_t () {1;}' unless defined(&__need_time_t);
    eval 'sub __need_timespec () {1;}' unless defined(&__need_timespec);
    require 'time.ph';
    eval 'sub __need_timeval () {1;}' unless defined(&__need_timeval);
    require 'bits/time.ph';
    unless(defined(&__suseconds_t_defined)) {
	eval 'sub __suseconds_t_defined () {1;}' unless defined(&__suseconds_t_defined);
    }
    undef(&__NFDBITS) if defined(&__NFDBITS);
    undef(&__FDELT) if defined(&__FDELT);
    undef(&__FDMASK) if defined(&__FDMASK);
    eval 'sub __NFDBITS () {(8* $sizeof{ &__fd_mask});}' unless defined(&__NFDBITS);
    eval 'sub __FDELT {
        my($d) = @_;
	    eval q((($d) /  &__NFDBITS));
    }' unless defined(&__FDELT);
    eval 'sub __FDMASK {
        my($d) = @_;
	    eval q((( &__fd_mask) 1<< (($d) %  &__NFDBITS)));
    }' unless defined(&__FDMASK);
    if(defined(&__USE_XOPEN)) {
	eval 'sub __FDS_BITS {
	    my($set) = @_;
    	    eval q((($set)-> &fds_bits));
	}' unless defined(&__FDS_BITS);
    } else {
	eval 'sub __FDS_BITS {
	    my($set) = @_;
    	    eval q((($set)-> &__fds_bits));
	}' unless defined(&__FDS_BITS);
    }
    eval 'sub FD_SETSIZE () { &__FD_SETSIZE;}' unless defined(&FD_SETSIZE);
    if(defined(&__USE_MISC)) {
	eval 'sub NFDBITS () { &__NFDBITS;}' unless defined(&NFDBITS);
    }
    eval 'sub FD_SET {
        my($fd, $fdsetp) = @_;
	    eval q( &__FD_SET ($fd, $fdsetp));
    }' unless defined(&FD_SET);
    eval 'sub FD_CLR {
        my($fd, $fdsetp) = @_;
	    eval q( &__FD_CLR ($fd, $fdsetp));
    }' unless defined(&FD_CLR);
    eval 'sub FD_ISSET {
        my($fd, $fdsetp) = @_;
	    eval q( &__FD_ISSET ($fd, $fdsetp));
    }' unless defined(&FD_ISSET);
    eval 'sub FD_ZERO {
        my($fdsetp) = @_;
	    eval q( &__FD_ZERO ($fdsetp));
    }' unless defined(&FD_ZERO);
    if(defined(&__USE_XOPEN2K)) {
    }
}
1;
