require '_h2ph_pre.ph';

no warnings qw(redefine misc);

unless(defined(&_BITS_PTHREADTYPES_H)) {
    eval 'sub _BITS_PTHREADTYPES_H () {1;}' unless defined(&_BITS_PTHREADTYPES_H);
    eval 'sub __SIZEOF_PTHREAD_ATTR_T () {36;}' unless defined(&__SIZEOF_PTHREAD_ATTR_T);
    eval 'sub __SIZEOF_PTHREAD_MUTEX_T () {24;}' unless defined(&__SIZEOF_PTHREAD_MUTEX_T);
    eval 'sub __SIZEOF_PTHREAD_MUTEXATTR_T () {4;}' unless defined(&__SIZEOF_PTHREAD_MUTEXATTR_T);
    eval 'sub __SIZEOF_PTHREAD_COND_T () {48;}' unless defined(&__SIZEOF_PTHREAD_COND_T);
    eval 'sub __SIZEOF_PTHREAD_COND_COMPAT_T () {12;}' unless defined(&__SIZEOF_PTHREAD_COND_COMPAT_T);
    eval 'sub __SIZEOF_PTHREAD_CONDATTR_T () {4;}' unless defined(&__SIZEOF_PTHREAD_CONDATTR_T);
    eval 'sub __SIZEOF_PTHREAD_RWLOCK_T () {32;}' unless defined(&__SIZEOF_PTHREAD_RWLOCK_T);
    eval 'sub __SIZEOF_PTHREAD_RWLOCKATTR_T () {8;}' unless defined(&__SIZEOF_PTHREAD_RWLOCKATTR_T);
    eval 'sub __SIZEOF_PTHREAD_BARRIER_T () {20;}' unless defined(&__SIZEOF_PTHREAD_BARRIER_T);
    eval 'sub __SIZEOF_PTHREAD_BARRIERATTR_T () {4;}' unless defined(&__SIZEOF_PTHREAD_BARRIERATTR_T);
    if(defined (&__USE_UNIX98) || defined (&__USE_XOPEN2K)) {
    }
    if(defined(&__USE_XOPEN2K)) {
    }
    eval 'sub __cleanup_fct_attribute () { &__attribute__ (( &__regparm__ (1)));}' unless defined(&__cleanup_fct_attribute);
}
1;
