require '_h2ph_pre.ph';

no warnings qw(redefine misc);

if(!defined (&_SIGNAL_H)  && !defined (&__need_siginfo_t)  && !defined (&__need_sigevent_t)) {
    die("Never include this file directly.  Use <signal.h> instead");
}
require 'bits/wordsize.ph';
if((!defined (&__have_sigval_t)  && (defined (&_SIGNAL_H) || defined (&__need_siginfo_t) || defined (&__need_sigevent_t)))) {
    eval 'sub __have_sigval_t () {1;}' unless defined(&__have_sigval_t);
}
if((!defined (&__have_siginfo_t)  && (defined (&_SIGNAL_H) || defined (&__need_siginfo_t)))) {
    eval 'sub __have_siginfo_t () {1;}' unless defined(&__have_siginfo_t);
    eval 'sub __SI_MAX_SIZE () {128;}' unless defined(&__SI_MAX_SIZE);
    if((defined(&__WORDSIZE) ? &__WORDSIZE : undef) == 64) {
	eval 'sub __SI_PAD_SIZE () {(( &__SI_MAX_SIZE / $sizeof{\'int\'}) - 4);}' unless defined(&__SI_PAD_SIZE);
    } else {
	eval 'sub __SI_PAD_SIZE () {(( &__SI_MAX_SIZE / $sizeof{\'int\'}) - 3);}' unless defined(&__SI_PAD_SIZE);
    }
    eval 'sub si_pid () { ($_sifields->{_kill}->{si_pid});}' unless defined(&si_pid);
    eval 'sub si_uid () { ($_sifields->{_kill}->{si_uid});}' unless defined(&si_uid);
    eval 'sub si_timerid () { ($_sifields->{_timer}->{si_tid});}' unless defined(&si_timerid);
    eval 'sub si_overrun () { ($_sifields->{_timer}->{si_overrun});}' unless defined(&si_overrun);
    eval 'sub si_status () { ($_sifields->{_sigchld}->{si_status});}' unless defined(&si_status);
    eval 'sub si_utime () { ($_sifields->{_sigchld}->{si_utime});}' unless defined(&si_utime);
    eval 'sub si_stime () { ($_sifields->{_sigchld}->{si_stime});}' unless defined(&si_stime);
    eval 'sub si_value () { ($_sifields->{_rt}->{si_sigval});}' unless defined(&si_value);
    eval 'sub si_int () { ($_sifields->{_rt}->{si_sigval}->{sival_int});}' unless defined(&si_int);
    eval 'sub si_ptr () { ($_sifields->{_rt}->{si_sigval}->{sival_ptr});}' unless defined(&si_ptr);
    eval 'sub si_addr () { ($_sifields->{_sigfault}->{si_addr});}' unless defined(&si_addr);
    eval 'sub si_band () { ($_sifields->{_sigpoll}->{si_band});}' unless defined(&si_band);
    eval 'sub si_fd () { ($_sifields->{_sigpoll}->{si_fd});}' unless defined(&si_fd);
    eval("sub SI_ASYNCNL () { -60; }") unless defined(&SI_ASYNCNL);
    eval("sub SI_TKILL () { -6; }") unless defined(&SI_TKILL);
    eval("sub SI_SIGIO () { -5; }") unless defined(&SI_SIGIO);
    eval("sub SI_ASYNCIO () { -4; }") unless defined(&SI_ASYNCIO);
    eval("sub SI_MESGQ () { -3; }") unless defined(&SI_MESGQ);
    eval("sub SI_TIMER () { -2; }") unless defined(&SI_TIMER);
    eval("sub SI_QUEUE () { -1; }") unless defined(&SI_QUEUE);
    eval("sub SI_USER () { 0; }") unless defined(&SI_USER);
    eval("sub SI_KERNEL () { 0x80; }") unless defined(&SI_KERNEL);
    eval("sub ILL_ILLOPC () { 1; }") unless defined(&ILL_ILLOPC);
    eval("sub ILL_ILLOPN () { 2; }") unless defined(&ILL_ILLOPN);
    eval("sub ILL_ILLADR () { 3; }") unless defined(&ILL_ILLADR);
    eval("sub ILL_ILLTRP () { 4; }") unless defined(&ILL_ILLTRP);
    eval("sub ILL_PRVOPC () { 5; }") unless defined(&ILL_PRVOPC);
    eval("sub ILL_PRVREG () { 6; }") unless defined(&ILL_PRVREG);
    eval("sub ILL_COPROC () { 7; }") unless defined(&ILL_COPROC);
    eval("sub ILL_BADSTK () { 8; }") unless defined(&ILL_BADSTK);
    eval("sub FPE_INTDIV () { 1; }") unless defined(&FPE_INTDIV);
    eval("sub FPE_INTOVF () { 2; }") unless defined(&FPE_INTOVF);
    eval("sub FPE_FLTDIV () { 3; }") unless defined(&FPE_FLTDIV);
    eval("sub FPE_FLTOVF () { 4; }") unless defined(&FPE_FLTOVF);
    eval("sub FPE_FLTUND () { 5; }") unless defined(&FPE_FLTUND);
    eval("sub FPE_FLTRES () { 6; }") unless defined(&FPE_FLTRES);
    eval("sub FPE_FLTINV () { 7; }") unless defined(&FPE_FLTINV);
    eval("sub FPE_FLTSUB () { 8; }") unless defined(&FPE_FLTSUB);
    eval("sub SEGV_MAPERR () { 1; }") unless defined(&SEGV_MAPERR);
    eval("sub SEGV_ACCERR () { 2; }") unless defined(&SEGV_ACCERR);
    eval("sub BUS_ADRALN () { 1; }") unless defined(&BUS_ADRALN);
    eval("sub BUS_ADRERR () { 2; }") unless defined(&BUS_ADRERR);
    eval("sub BUS_OBJERR () { 3; }") unless defined(&BUS_OBJERR);
    eval("sub TRAP_BRKPT () { 1; }") unless defined(&TRAP_BRKPT);
    eval("sub TRAP_TRACE () { 2; }") unless defined(&TRAP_TRACE);
    eval("sub CLD_EXITED () { 1; }") unless defined(&CLD_EXITED);
    eval("sub CLD_KILLED () { 2; }") unless defined(&CLD_KILLED);
    eval("sub CLD_DUMPED () { 3; }") unless defined(&CLD_DUMPED);
    eval("sub CLD_TRAPPED () { 4; }") unless defined(&CLD_TRAPPED);
    eval("sub CLD_STOPPED () { 5; }") unless defined(&CLD_STOPPED);
    eval("sub CLD_CONTINUED () { 6; }") unless defined(&CLD_CONTINUED);
    eval("sub POLL_IN () { 1; }") unless defined(&POLL_IN);
    eval("sub POLL_OUT () { 2; }") unless defined(&POLL_OUT);
    eval("sub POLL_MSG () { 3; }") unless defined(&POLL_MSG);
    eval("sub POLL_ERR () { 4; }") unless defined(&POLL_ERR);
    eval("sub POLL_PRI () { 5; }") unless defined(&POLL_PRI);
    eval("sub POLL_HUP () { 6; }") unless defined(&POLL_HUP);
    undef(&__need_siginfo_t) if defined(&__need_siginfo_t);
}
if((defined (&_SIGNAL_H) || defined (&__need_sigevent_t))  && !defined (&__have_sigevent_t)) {
    eval 'sub __have_sigevent_t () {1;}' unless defined(&__have_sigevent_t);
    eval 'sub __SIGEV_MAX_SIZE () {64;}' unless defined(&__SIGEV_MAX_SIZE);
    if((defined(&__WORDSIZE) ? &__WORDSIZE : undef) == 64) {
	eval 'sub __SIGEV_PAD_SIZE () {(( &__SIGEV_MAX_SIZE / $sizeof{\'int\'}) - 4);}' unless defined(&__SIGEV_PAD_SIZE);
    } else {
	eval 'sub __SIGEV_PAD_SIZE () {(( &__SIGEV_MAX_SIZE / $sizeof{\'int\'}) - 3);}' unless defined(&__SIGEV_PAD_SIZE);
    }
    eval 'sub sigev_notify_function () { ($_sigev_un->{_sigev_thread}->{_function});}' unless defined(&sigev_notify_function);
    eval 'sub sigev_notify_attributes () { ($_sigev_un->{_sigev_thread}->{_attribute});}' unless defined(&sigev_notify_attributes);
    eval("sub SIGEV_SIGNAL () { 0; }") unless defined(&SIGEV_SIGNAL);
    eval("sub SIGEV_NONE () { 1; }") unless defined(&SIGEV_NONE);
    eval("sub SIGEV_THREAD () { 2; }") unless defined(&SIGEV_THREAD);
    eval("sub SIGEV_THREAD_ID () { 4; }") unless defined(&SIGEV_THREAD_ID);
}
1;
