require '_h2ph_pre.ph';

no warnings qw(redefine misc);

unless(defined(&_LINUX_TYPES_H)) {
    eval 'sub _LINUX_TYPES_H () {1;}' unless defined(&_LINUX_TYPES_H);
    require 'asm/types.ph';
    unless(defined(&__ASSEMBLY__)) {
	require 'linux/posix_types.ph';
	if(defined(&__CHECKER__)) {
	    eval 'sub __bitwise__ () { &__attribute__(( &bitwise));}' unless defined(&__bitwise__);
	} else {
	    eval 'sub __bitwise__ () {1;}' unless defined(&__bitwise__);
	}
	if(defined(&__CHECK_ENDIAN__)) {
	    eval 'sub __bitwise () { &__bitwise__;}' unless defined(&__bitwise);
	} else {
	    eval 'sub __bitwise () {1;}' unless defined(&__bitwise);
	}
	eval 'sub __aligned_u64 () { &__u64  &__attribute__(( &aligned(8)));}' unless defined(&__aligned_u64);
	eval 'sub __aligned_be64 () { &__be64  &__attribute__(( &aligned(8)));}' unless defined(&__aligned_be64);
	eval 'sub __aligned_le64 () { &__le64  &__attribute__(( &aligned(8)));}' unless defined(&__aligned_le64);
    }
}
1;
