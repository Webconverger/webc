require '_h2ph_pre.ph';

no warnings qw(redefine misc);

unless(defined(&_ASM_GENERIC_INT_LL64_H)) {
    eval 'sub _ASM_GENERIC_INT_LL64_H () {1;}' unless defined(&_ASM_GENERIC_INT_LL64_H);
    require 'asm/bitsperlong.ph';
    unless(defined(&__ASSEMBLY__)) {
	if(defined(&__GNUC__)) {
	} else {
	}
    }
}
1;
