require '_h2ph_pre.ph';

no warnings qw(redefine misc);

unless(defined(&_BITS_SIGTHREAD_H)) {
    eval 'sub _BITS_SIGTHREAD_H () {1;}' unless defined(&_BITS_SIGTHREAD_H);
    if(!defined (&_SIGNAL_H)  && !defined (&_PTHREAD_H)) {
	die("Never include this file directly.  Use <pthread.h> instead");
    }
    if(defined(&__USE_GNU)) {
    }
}
1;
