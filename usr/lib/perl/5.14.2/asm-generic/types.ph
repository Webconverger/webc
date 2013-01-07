require '_h2ph_pre.ph';

no warnings qw(redefine misc);

unless(defined(&_ASM_GENERIC_TYPES_H)) {
    eval 'sub _ASM_GENERIC_TYPES_H () {1;}' unless defined(&_ASM_GENERIC_TYPES_H);
    require 'asm-generic/int-ll64.ph';
    unless(defined(&__ASSEMBLY__)) {
    }
}
1;
