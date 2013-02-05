require '_h2ph_pre.ph';

no warnings qw(redefine misc);

unless(defined(&_ENDIAN_H)) {
    die("Never use <bits/endian.h> directly; include <endian.h> instead.");
}
unless(defined(&__BYTE_ORDER)) {
    sub __BYTE_ORDER () {	 &__LITTLE_ENDIAN;}
}
1;
