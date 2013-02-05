require '_h2ph_pre.ph';

no warnings qw(redefine misc);

if(!defined (&_SIGNAL_H)  && !defined (&_SYS_UCONTEXT_H)) {
    die("Never use <bits/sigcontext.h> directly; include <signal.h> instead.");
}
unless(defined(&sigcontext_struct)) {
    eval 'sub sigcontext_struct () { &sigcontext;}' unless defined(&sigcontext_struct);
    require 'asm/sigcontext.ph';
}
1;
