require '_h2ph_pre.ph';

no warnings qw(redefine misc);

unless(defined(&_SIGNAL_H)) {
    die("Never include this file directly.  Use <signal.h> instead");
}
eval("sub SS_ONSTACK () { 1; }") unless defined(&SS_ONSTACK);
eval("sub SS_DISABLE () { 2; }") unless defined(&SS_DISABLE);
unless(defined(&MINSIGSTKSZ)) {
    sub MINSIGSTKSZ () {	2048;}
}
unless(defined(&SIGSTKSZ)) {
    sub SIGSTKSZ () {	8192;}
}
1;
