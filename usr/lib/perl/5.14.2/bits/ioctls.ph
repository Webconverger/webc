require '_h2ph_pre.ph';

no warnings qw(redefine misc);

unless(defined(&_SYS_IOCTL_H)) {
    die("Never use <bits/ioctls.h> directly; include <sys/ioctl.h> instead.");
}
require 'asm/ioctls.ph';
unless(defined(&SIOCADDRT)) {
    sub SIOCADDRT () {	0x890b;}
}
unless(defined(&SIOCDELRT)) {
    sub SIOCDELRT () {	0x890c;}
}
unless(defined(&SIOCRTMSG)) {
    sub SIOCRTMSG () {	0x890d;}
}
unless(defined(&SIOCGIFNAME)) {
    sub SIOCGIFNAME () {	0x8910;}
}
unless(defined(&SIOCSIFLINK)) {
    sub SIOCSIFLINK () {	0x8911;}
}
unless(defined(&SIOCGIFCONF)) {
    sub SIOCGIFCONF () {	0x8912;}
}
unless(defined(&SIOCGIFFLAGS)) {
    sub SIOCGIFFLAGS () {	0x8913;}
}
unless(defined(&SIOCSIFFLAGS)) {
    sub SIOCSIFFLAGS () {	0x8914;}
}
unless(defined(&SIOCGIFADDR)) {
    sub SIOCGIFADDR () {	0x8915;}
}
unless(defined(&SIOCSIFADDR)) {
    sub SIOCSIFADDR () {	0x8916;}
}
unless(defined(&SIOCGIFDSTADDR)) {
    sub SIOCGIFDSTADDR () {	0x8917;}
}
unless(defined(&SIOCSIFDSTADDR)) {
    sub SIOCSIFDSTADDR () {	0x8918;}
}
unless(defined(&SIOCGIFBRDADDR)) {
    sub SIOCGIFBRDADDR () {	0x8919;}
}
unless(defined(&SIOCSIFBRDADDR)) {
    sub SIOCSIFBRDADDR () {	0x891a;}
}
unless(defined(&SIOCGIFNETMASK)) {
    sub SIOCGIFNETMASK () {	0x891b;}
}
unless(defined(&SIOCSIFNETMASK)) {
    sub SIOCSIFNETMASK () {	0x891c;}
}
unless(defined(&SIOCGIFMETRIC)) {
    sub SIOCGIFMETRIC () {	0x891d;}
}
unless(defined(&SIOCSIFMETRIC)) {
    sub SIOCSIFMETRIC () {	0x891e;}
}
unless(defined(&SIOCGIFMEM)) {
    sub SIOCGIFMEM () {	0x891f;}
}
unless(defined(&SIOCSIFMEM)) {
    sub SIOCSIFMEM () {	0x8920;}
}
unless(defined(&SIOCGIFMTU)) {
    sub SIOCGIFMTU () {	0x8921;}
}
unless(defined(&SIOCSIFMTU)) {
    sub SIOCSIFMTU () {	0x8922;}
}
unless(defined(&SIOCSIFNAME)) {
    sub SIOCSIFNAME () {	0x8923;}
}
unless(defined(&SIOCSIFHWADDR)) {
    sub SIOCSIFHWADDR () {	0x8924;}
}
unless(defined(&SIOCGIFENCAP)) {
    sub SIOCGIFENCAP () {	0x8925;}
}
unless(defined(&SIOCSIFENCAP)) {
    sub SIOCSIFENCAP () {	0x8926;}
}
unless(defined(&SIOCGIFHWADDR)) {
    sub SIOCGIFHWADDR () {	0x8927;}
}
unless(defined(&SIOCGIFSLAVE)) {
    sub SIOCGIFSLAVE () {	0x8929;}
}
unless(defined(&SIOCSIFSLAVE)) {
    sub SIOCSIFSLAVE () {	0x8930;}
}
unless(defined(&SIOCADDMULTI)) {
    sub SIOCADDMULTI () {	0x8931;}
}
unless(defined(&SIOCDELMULTI)) {
    sub SIOCDELMULTI () {	0x8932;}
}
unless(defined(&SIOCGIFINDEX)) {
    sub SIOCGIFINDEX () {	0x8933;}
}
unless(defined(&SIOGIFINDEX)) {
    sub SIOGIFINDEX () {	 &SIOCGIFINDEX;}
}
unless(defined(&SIOCSIFPFLAGS)) {
    sub SIOCSIFPFLAGS () {	0x8934;}
}
unless(defined(&SIOCGIFPFLAGS)) {
    sub SIOCGIFPFLAGS () {	0x8935;}
}
unless(defined(&SIOCDIFADDR)) {
    sub SIOCDIFADDR () {	0x8936;}
}
unless(defined(&SIOCSIFHWBROADCAST)) {
    sub SIOCSIFHWBROADCAST () {	0x8937;}
}
unless(defined(&SIOCGIFCOUNT)) {
    sub SIOCGIFCOUNT () {	0x8938;}
}
unless(defined(&SIOCGIFBR)) {
    sub SIOCGIFBR () {	0x8940;}
}
unless(defined(&SIOCSIFBR)) {
    sub SIOCSIFBR () {	0x8941;}
}
unless(defined(&SIOCGIFTXQLEN)) {
    sub SIOCGIFTXQLEN () {	0x8942;}
}
unless(defined(&SIOCSIFTXQLEN)) {
    sub SIOCSIFTXQLEN () {	0x8943;}
}
unless(defined(&SIOCDARP)) {
    sub SIOCDARP () {	0x8953;}
}
unless(defined(&SIOCGARP)) {
    sub SIOCGARP () {	0x8954;}
}
unless(defined(&SIOCSARP)) {
    sub SIOCSARP () {	0x8955;}
}
unless(defined(&SIOCDRARP)) {
    sub SIOCDRARP () {	0x8960;}
}
unless(defined(&SIOCGRARP)) {
    sub SIOCGRARP () {	0x8961;}
}
unless(defined(&SIOCSRARP)) {
    sub SIOCSRARP () {	0x8962;}
}
unless(defined(&SIOCGIFMAP)) {
    sub SIOCGIFMAP () {	0x8970;}
}
unless(defined(&SIOCSIFMAP)) {
    sub SIOCSIFMAP () {	0x8971;}
}
unless(defined(&SIOCADDDLCI)) {
    sub SIOCADDDLCI () {	0x8980;}
}
unless(defined(&SIOCDELDLCI)) {
    sub SIOCDELDLCI () {	0x8981;}
}
unless(defined(&SIOCDEVPRIVATE)) {
    sub SIOCDEVPRIVATE () {	0x89f0;}
}
unless(defined(&SIOCPROTOPRIVATE)) {
    sub SIOCPROTOPRIVATE () {	0x89e0;}
}
1;
