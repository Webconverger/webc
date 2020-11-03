require '_h2ph_pre.ph';

no warnings qw(redefine misc);

unless(defined(&_BITS_SIGNUM_GENERIC_H)) {
    eval 'sub _BITS_SIGNUM_GENERIC_H () {1;}' unless defined(&_BITS_SIGNUM_GENERIC_H);
    unless(defined(&_SIGNAL_H)) {
	die("Never include <bits/signum-generic.h> directly; use <signal.h> instead.");
    }
    eval 'sub SIG_ERR () {(( &__sighandler_t) -1);}' unless defined(&SIG_ERR);
    eval 'sub SIG_DFL () {(( &__sighandler_t) 0);}' unless defined(&SIG_DFL);
    eval 'sub SIG_IGN () {(( &__sighandler_t) 1);}' unless defined(&SIG_IGN);
    if(defined(&__USE_XOPEN)) {
	eval 'sub SIG_HOLD () {(( &__sighandler_t) 2);}' unless defined(&SIG_HOLD);
    }
    eval 'sub SIGINT () {2;}' unless defined(&SIGINT);
    eval 'sub SIGILL () {4;}' unless defined(&SIGILL);
    eval 'sub SIGABRT () {6;}' unless defined(&SIGABRT);
    eval 'sub SIGFPE () {8;}' unless defined(&SIGFPE);
    eval 'sub SIGSEGV () {11;}' unless defined(&SIGSEGV);
    eval 'sub SIGTERM () {15;}' unless defined(&SIGTERM);
    eval 'sub SIGHUP () {1;}' unless defined(&SIGHUP);
    eval 'sub SIGQUIT () {3;}' unless defined(&SIGQUIT);
    eval 'sub SIGTRAP () {5;}' unless defined(&SIGTRAP);
    eval 'sub SIGKILL () {9;}' unless defined(&SIGKILL);
    eval 'sub SIGBUS () {10;}' unless defined(&SIGBUS);
    eval 'sub SIGSYS () {12;}' unless defined(&SIGSYS);
    eval 'sub SIGPIPE () {13;}' unless defined(&SIGPIPE);
    eval 'sub SIGALRM () {14;}' unless defined(&SIGALRM);
    eval 'sub SIGURG () {16;}' unless defined(&SIGURG);
    eval 'sub SIGSTOP () {17;}' unless defined(&SIGSTOP);
    eval 'sub SIGTSTP () {18;}' unless defined(&SIGTSTP);
    eval 'sub SIGCONT () {19;}' unless defined(&SIGCONT);
    eval 'sub SIGCHLD () {20;}' unless defined(&SIGCHLD);
    eval 'sub SIGTTIN () {21;}' unless defined(&SIGTTIN);
    eval 'sub SIGTTOU () {22;}' unless defined(&SIGTTOU);
    eval 'sub SIGPOLL () {23;}' unless defined(&SIGPOLL);
    eval 'sub SIGXCPU () {24;}' unless defined(&SIGXCPU);
    eval 'sub SIGXFSZ () {25;}' unless defined(&SIGXFSZ);
    eval 'sub SIGVTALRM () {26;}' unless defined(&SIGVTALRM);
    eval 'sub SIGPROF () {27;}' unless defined(&SIGPROF);
    eval 'sub SIGUSR1 () {30;}' unless defined(&SIGUSR1);
    eval 'sub SIGUSR2 () {31;}' unless defined(&SIGUSR2);
    eval 'sub SIGWINCH () {28;}' unless defined(&SIGWINCH);
    eval 'sub SIGIO () { &SIGPOLL;}' unless defined(&SIGIO);
    eval 'sub SIGIOT () { &SIGABRT;}' unless defined(&SIGIOT);
    eval 'sub SIGCLD () { &SIGCHLD;}' unless defined(&SIGCLD);
    eval 'sub __SIGRTMIN () {32;}' unless defined(&__SIGRTMIN);
    eval 'sub __SIGRTMAX () { &__SIGRTMIN;}' unless defined(&__SIGRTMAX);
    eval 'sub _NSIG () {( &__SIGRTMAX + 1);}' unless defined(&_NSIG);
}
1;
