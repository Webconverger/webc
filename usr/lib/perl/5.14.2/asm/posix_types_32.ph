require '_h2ph_pre.ph';

no warnings qw(redefine misc);

unless(defined(&_ASM_X86_POSIX_TYPES_32_H)) {
    eval 'sub _ASM_X86_POSIX_TYPES_32_H () {1;}' unless defined(&_ASM_X86_POSIX_TYPES_32_H);
    if(defined(&__GNUC__)) {
    }
}
1;
