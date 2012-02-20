require '_h2ph_pre.ph';

no warnings qw(redefine misc);

unless(defined(&_BITS_SIGCONTEXT_H)) {
    eval 'sub _BITS_SIGCONTEXT_H () {1;}' unless defined(&_BITS_SIGCONTEXT_H);
    if(!defined (defined(&_SIGNAL_H) ? &_SIGNAL_H : undef)  && !defined (defined(&_SYS_UCONTEXT_H) ? &_SYS_UCONTEXT_H : undef)) {
	die("Never use <bits/sigcontext.h> directly; include <signal.h> instead.");
    }
    require 'bits/wordsize.ph';
    if((defined(&__WORDSIZE) ? &__WORDSIZE : undef) == 32) {
	unless(defined(&sigcontext_struct)) {
	    eval 'sub sigcontext_struct () { &sigcontext;}' unless defined(&sigcontext_struct);
	}
    } else {
    }
}
1;
