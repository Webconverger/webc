require '_h2ph_pre.ph';

no warnings qw(redefine misc);

if(!defined (&_SYS_WAIT_H)  && !defined (&_STDLIB_H)) {
    die("Never include <bits/waitflags.h> directly; use <sys/wait.h> instead.");
}
unless(defined(&WNOHANG)) {
    sub WNOHANG () {	1;}
}
unless(defined(&WUNTRACED)) {
    sub WUNTRACED () {	2;}
}
unless(defined(&WSTOPPED)) {
    sub WSTOPPED () {	2;}
}
unless(defined(&WEXITED)) {
    sub WEXITED () {	4;}
}
unless(defined(&WCONTINUED)) {
    sub WCONTINUED () {	8;}
}
unless(defined(&WNOWAIT)) {
    sub WNOWAIT () {	0x1000000;}
}
unless(defined(&__WNOTHREAD)) {
    sub __WNOTHREAD () {	0x20000000;}
}
unless(defined(&__WALL)) {
    sub __WALL () {	0x40000000;}
}
unless(defined(&__WCLONE)) {
    sub __WCLONE () {	0x80000000;}
}
1;
