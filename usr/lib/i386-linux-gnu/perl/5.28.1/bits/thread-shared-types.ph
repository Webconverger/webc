require '_h2ph_pre.ph';

no warnings qw(redefine misc);

unless(defined(&_THREAD_SHARED_TYPES_H)) {
    eval 'sub _THREAD_SHARED_TYPES_H () {1;}' unless defined(&_THREAD_SHARED_TYPES_H);
    require 'bits/pthreadtypes-arch.ph';
    if(!(defined(&__PTHREAD_MUTEX_USE_UNION) ? &__PTHREAD_MUTEX_USE_UNION : undef)) {
    } else {
    }
    if((defined(&__PTHREAD_MUTEX_LOCK_ELISION) ? &__PTHREAD_MUTEX_LOCK_ELISION : undef)) {
	if(!(defined(&__PTHREAD_MUTEX_USE_UNION) ? &__PTHREAD_MUTEX_USE_UNION : undef)) {
	    eval 'sub __PTHREAD_SPINS_DATA () {\'short __spins\'; \'short __elision\';}' unless defined(&__PTHREAD_SPINS_DATA);
	    eval 'sub __PTHREAD_SPINS () {0, 0;}' unless defined(&__PTHREAD_SPINS);
	} else {
	    eval 'sub __PTHREAD_SPINS_DATA () {1; \'short __eelision\'; }  &__elision_data;}' unless defined(&__PTHREAD_SPINS_DATA);
	    eval 'sub __PTHREAD_SPINS () {{ 0, 0};}' unless defined(&__PTHREAD_SPINS);
	    eval 'sub __spins () { ($__elision_data->{__espins});}' unless defined(&__spins);
	    eval 'sub __elision () { ($__elision_data->{__eelision});}' unless defined(&__elision);
	}
    } else {
	eval 'sub __PTHREAD_SPINS_DATA () {\'int\'  &__spins;}' unless defined(&__PTHREAD_SPINS_DATA);
	eval 'sub __PTHREAD_SPINS () {0;}' unless defined(&__PTHREAD_SPINS);
    }
    if(!(defined(&__PTHREAD_MUTEX_NUSERS_AFTER_KIND) ? &__PTHREAD_MUTEX_NUSERS_AFTER_KIND : undef)) {
    }
    if((defined(&__PTHREAD_MUTEX_NUSERS_AFTER_KIND) ? &__PTHREAD_MUTEX_NUSERS_AFTER_KIND : undef)) {
    }
    if(!(defined(&__PTHREAD_MUTEX_USE_UNION) ? &__PTHREAD_MUTEX_USE_UNION : undef)) {
	eval 'sub __PTHREAD_MUTEX_HAVE_PREV () {1;}' unless defined(&__PTHREAD_MUTEX_HAVE_PREV);
    } else {
	eval 'sub __PTHREAD_MUTEX_HAVE_PREV () {0;}' unless defined(&__PTHREAD_MUTEX_HAVE_PREV);
    }
}
1;
