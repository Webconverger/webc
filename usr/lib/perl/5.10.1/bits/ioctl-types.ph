require '_h2ph_pre.ph';

no warnings qw(redefine misc);

unless(defined(&_SYS_IOCTL_H)) {
    die("Never use <bits/ioctl-types.h> directly; include <sys/ioctl.h> instead.");
}
require 'asm/ioctls.ph';
unless(defined(&NCC)) {
    sub NCC () {	8;}
}
unless(defined(&TIOCM_LE)) {
    sub TIOCM_LE () {	0x1;}
}
unless(defined(&TIOCM_DTR)) {
    sub TIOCM_DTR () {	0x2;}
}
unless(defined(&TIOCM_RTS)) {
    sub TIOCM_RTS () {	0x4;}
}
unless(defined(&TIOCM_ST)) {
    sub TIOCM_ST () {	0x8;}
}
unless(defined(&TIOCM_SR)) {
    sub TIOCM_SR () {	0x10;}
}
unless(defined(&TIOCM_CTS)) {
    sub TIOCM_CTS () {	0x20;}
}
unless(defined(&TIOCM_CAR)) {
    sub TIOCM_CAR () {	0x40;}
}
unless(defined(&TIOCM_RNG)) {
    sub TIOCM_RNG () {	0x80;}
}
unless(defined(&TIOCM_DSR)) {
    sub TIOCM_DSR () {	0x100;}
}
unless(defined(&TIOCM_CD)) {
    sub TIOCM_CD () {	 &TIOCM_CAR;}
}
unless(defined(&TIOCM_RI)) {
    sub TIOCM_RI () {	 &TIOCM_RNG;}
}
unless(defined(&N_TTY)) {
    sub N_TTY () {	0;}
}
unless(defined(&N_SLIP)) {
    sub N_SLIP () {	1;}
}
unless(defined(&N_MOUSE)) {
    sub N_MOUSE () {	2;}
}
unless(defined(&N_PPP)) {
    sub N_PPP () {	3;}
}
unless(defined(&N_STRIP)) {
    sub N_STRIP () {	4;}
}
unless(defined(&N_AX25)) {
    sub N_AX25 () {	5;}
}
unless(defined(&N_X25)) {
    sub N_X25 () {	6;}
}
unless(defined(&N_6PACK)) {
    sub N_6PACK () {	7;}
}
unless(defined(&N_MASC)) {
    sub N_MASC () {	8;}
}
unless(defined(&N_R3964)) {
    sub N_R3964 () {	9;}
}
unless(defined(&N_PROFIBUS_FDL)) {
    sub N_PROFIBUS_FDL () {	10;}
}
unless(defined(&N_IRDA)) {
    sub N_IRDA () {	11;}
}
unless(defined(&N_SMSBLOCK)) {
    sub N_SMSBLOCK () {	12;}
}
unless(defined(&N_HDLC)) {
    sub N_HDLC () {	13;}
}
unless(defined(&N_SYNC_PPP)) {
    sub N_SYNC_PPP () {	14;}
}
unless(defined(&N_HCI)) {
    sub N_HCI () {	15;}
}
1;
