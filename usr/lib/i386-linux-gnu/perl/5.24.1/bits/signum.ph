require '_h2ph_pre.ph';

no warnings qw(redefine misc);

if(defined(&_SIGNAL_H)) {
    eval 'sub SIG_ERR () {(( &__sighandler_t) -1);}' unless defined(&SIG_ERR);
    eval 'sub SIG_DFL () {(( &__sighandler_t) 0);}' unless defined(&SIG_DFL);
    eval 'sub SIG_IGN () {(( &__sighandler_t) 1);}' unless defined(&SIG_IGN);
    if(defined(&__USE_UNIX98)) {
	eval 'sub SIG_HOLD () {(( &__sighandler_t) 2);}' unless defined(&SIG_HOLD);
    }
    eval 'sub SIGHUP () {1;}' unless defined(&SIGHUP);
    eval 'sub SIGINT () {2;}' unless defined(&SIGINT);
    eval 'sub SIGQUIT () {3;}' unless defined(&SIGQUIT);
    eval 'sub SIGILL () {4;}' unless defined(&SIGILL);
    eval 'sub SIGTRAP () {5;}' unless defined(&SIGTRAP);
    eval 'sub SIGABRT () {6;}' unless defined(&SIGABRT);
    eval 'sub SIGIOT () {6;}' unless defined(&SIGIOT);
    eval 'sub SIGBUS () {7;}' unless defined(&SIGBUS);
    eval 'sub SIGFPE () {8;}' unless defined(&SIGFPE);
    eval 'sub SIGKILL () {9;}' unless defined(&SIGKILL);
    eval 'sub SIGUSR1 () {10;}' unless defined(&SIGUSR1);
    eval 'sub SIGSEGV () {11;}' unless defined(&SIGSEGV);
    eval 'sub SIGUSR2 () {12;}' unless defined(&SIGUSR2);
    eval 'sub SIGPIPE () {13;}' unless defined(&SIGPIPE);
    eval 'sub SIGALRM () {14;}' unless defined(&SIGALRM);
    eval 'sub SIGTERM () {15;}' unless defined(&SIGTERM);
    eval 'sub SIGSTKFLT () {16;}' unless defined(&SIGSTKFLT);
    eval 'sub SIGCLD () { &SIGCHLD;}' unless defined(&SIGCLD);
    eval 'sub SIGCHLD () {17;}' unless defined(&SIGCHLD);
    eval 'sub SIGCONT () {18;}' unless defined(&SIGCONT);
    eval 'sub SIGSTOP () {19;}' unless defined(&SIGSTOP);
    eval 'sub SIGTSTP () {20;}' unless defined(&SIGTSTP);
    eval 'sub SIGTTIN () {21;}' unless defined(&SIGTTIN);
    eval 'sub SIGTTOU () {22;}' unless defined(&SIGTTOU);
    eval 'sub SIGURG () {23;}' unless defined(&SIGURG);
    eval 'sub SIGXCPU () {24;}' unless defined(&SIGXCPU);
    eval 'sub SIGXFSZ () {25;}' unless defined(&SIGXFSZ);
    eval 'sub SIGVTALRM () {26;}' unless defined(&SIGVTALRM);
    eval 'sub SIGPROF () {27;}' unless defined(&SIGPROF);
    eval 'sub SIGWINCH () {28;}' unless defined(&SIGWINCH);
    eval 'sub SIGPOLL () { &SIGIO;}' unless defined(&SIGPOLL);
    eval 'sub SIGIO () {29;}' unless defined(&SIGIO);
    eval 'sub SIGPWR () {30;}' unless defined(&SIGPWR);
    eval 'sub SIGSYS () {31;}' unless defined(&SIGSYS);
    eval 'sub SIGUNUSED () {31;}' unless defined(&SIGUNUSED);
    eval 'sub _NSIG () {65;}' unless defined(&_NSIG);
    eval 'sub SIGRTMIN () {( &__libc_current_sigrtmin ());}' unless defined(&SIGRTMIN);
    eval 'sub SIGRTMAX () {( &__libc_current_sigrtmax ());}' unless defined(&SIGRTMAX);
    eval 'sub __SIGRTMIN () {32;}' unless defined(&__SIGRTMIN);
    eval 'sub __SIGRTMAX () {( &_NSIG - 1);}' unless defined(&__SIGRTMAX);
}
1;
