require '_h2ph_pre.ph';

no warnings qw(redefine misc);

unless(defined(&_BITS_PTHREADTYPES_H)) {
    eval 'sub _BITS_PTHREADTYPES_H () {1;}' unless defined(&_BITS_PTHREADTYPES_H);
    require 'bits/wordsize.ph';
    if((defined(&__WORDSIZE) ? &__WORDSIZE : undef) == 64) {
	eval 'sub __SIZEOF_PTHREAD_ATTR_T () {56;}' unless defined(&__SIZEOF_PTHREAD_ATTR_T);
	eval 'sub __SIZEOF_PTHREAD_MUTEX_T () {40;}' unless defined(&__SIZEOF_PTHREAD_MUTEX_T);
	eval 'sub __SIZEOF_PTHREAD_MUTEXATTR_T () {4;}' unless defined(&__SIZEOF_PTHREAD_MUTEXATTR_T);
	eval 'sub __SIZEOF_PTHREAD_COND_T () {48;}' unless defined(&__SIZEOF_PTHREAD_COND_T);
	eval 'sub __SIZEOF_PTHREAD_CONDATTR_T () {4;}' unless defined(&__SIZEOF_PTHREAD_CONDATTR_T);
	eval 'sub __SIZEOF_PTHREAD_RWLOCK_T () {56;}' unless defined(&__SIZEOF_PTHREAD_RWLOCK_T);
	eval 'sub __SIZEOF_PTHREAD_RWLOCKATTR_T () {8;}' unless defined(&__SIZEOF_PTHREAD_RWLOCKATTR_T);
	eval 'sub __SIZEOF_PTHREAD_BARRIER_T () {32;}' unless defined(&__SIZEOF_PTHREAD_BARRIER_T);
	eval 'sub __SIZEOF_PTHREAD_BARRIERATTR_T () {4;}' unless defined(&__SIZEOF_PTHREAD_BARRIERATTR_T);
    } else {
	eval 'sub __SIZEOF_PTHREAD_ATTR_T () {36;}' unless defined(&__SIZEOF_PTHREAD_ATTR_T);
	eval 'sub __SIZEOF_PTHREAD_MUTEX_T () {24;}' unless defined(&__SIZEOF_PTHREAD_MUTEX_T);
	eval 'sub __SIZEOF_PTHREAD_MUTEXATTR_T () {4;}' unless defined(&__SIZEOF_PTHREAD_MUTEXATTR_T);
	eval 'sub __SIZEOF_PTHREAD_COND_T () {48;}' unless defined(&__SIZEOF_PTHREAD_COND_T);
	eval 'sub __SIZEOF_PTHREAD_CONDATTR_T () {4;}' unless defined(&__SIZEOF_PTHREAD_CONDATTR_T);
	eval 'sub __SIZEOF_PTHREAD_RWLOCK_T () {32;}' unless defined(&__SIZEOF_PTHREAD_RWLOCK_T);
	eval 'sub __SIZEOF_PTHREAD_RWLOCKATTR_T () {8;}' unless defined(&__SIZEOF_PTHREAD_RWLOCKATTR_T);
	eval 'sub __SIZEOF_PTHREAD_BARRIER_T () {20;}' unless defined(&__SIZEOF_PTHREAD_BARRIER_T);
	eval 'sub __SIZEOF_PTHREAD_BARRIERATTR_T () {4;}' unless defined(&__SIZEOF_PTHREAD_BARRIERATTR_T);
    }
    if((defined(&__WORDSIZE) ? &__WORDSIZE : undef) == 64) {
    } else {
    }
    if((defined(&__WORDSIZE) ? &__WORDSIZE : undef) == 64) {
    }
    if((defined(&__WORDSIZE) ? &__WORDSIZE : undef) == 64) {
	eval 'sub __PTHREAD_MUTEX_HAVE_PREV () {1;}' unless defined(&__PTHREAD_MUTEX_HAVE_PREV);
    } else {
    }
    if(defined (defined(&__USE_UNIX98) ? &__USE_UNIX98 : undef) || defined (defined(&__USE_XOPEN2K) ? &__USE_XOPEN2K : undef)) {
	if((defined(&__WORDSIZE) ? &__WORDSIZE : undef) == 64) {
	} else {
	}
    }
    if(defined(&__USE_XOPEN2K)) {
    }
    if((defined(&__WORDSIZE) ? &__WORDSIZE : undef) == 32) {
	eval 'sub __cleanup_fct_attribute () { &__attribute__ (( &__regparm__ (1)));}' unless defined(&__cleanup_fct_attribute);
    }
}
1;
