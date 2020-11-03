require '_h2ph_pre.ph';

no warnings qw(redefine misc);

unless(defined(&_BITS_SIGNUM_H)) {
    eval 'sub _BITS_SIGNUM_H () {1;}' unless defined(&_BITS_SIGNUM_H);
    unless(defined(&_SIGNAL_H)) {
	die("Never include <bits/signum.h> directly; use <signal.h> instead.");
    }
    require 'bits/signum-generic.ph';
    eval 'sub SIGSTKFLT () {16;}' unless defined(&SIGSTKFLT);
    eval 'sub SIGPWR () {30;}' unless defined(&SIGPWR);
    undef(&SIGBUS) if defined(&SIGBUS);
    eval 'sub SIGBUS () {7;}' unless defined(&SIGBUS);
    undef(&SIGUSR1) if defined(&SIGUSR1);
    eval 'sub SIGUSR1 () {10;}' unless defined(&SIGUSR1);
    undef(&SIGUSR2) if defined(&SIGUSR2);
    eval 'sub SIGUSR2 () {12;}' unless defined(&SIGUSR2);
    undef(&SIGCHLD) if defined(&SIGCHLD);
    eval 'sub SIGCHLD () {17;}' unless defined(&SIGCHLD);
    undef(&SIGCONT) if defined(&SIGCONT);
    eval 'sub SIGCONT () {18;}' unless defined(&SIGCONT);
    undef(&SIGSTOP) if defined(&SIGSTOP);
    eval 'sub SIGSTOP () {19;}' unless defined(&SIGSTOP);
    undef(&SIGTSTP) if defined(&SIGTSTP);
    eval 'sub SIGTSTP () {20;}' unless defined(&SIGTSTP);
    undef(&SIGURG) if defined(&SIGURG);
    eval 'sub SIGURG () {23;}' unless defined(&SIGURG);
    undef(&SIGPOLL) if defined(&SIGPOLL);
    eval 'sub SIGPOLL () {29;}' unless defined(&SIGPOLL);
    undef(&SIGSYS) if defined(&SIGSYS);
    eval 'sub SIGSYS () {31;}' unless defined(&SIGSYS);
    undef(&__SIGRTMAX) if defined(&__SIGRTMAX);
    eval 'sub __SIGRTMAX () {64;}' unless defined(&__SIGRTMAX);
}
1;
