require '_h2ph_pre.ph';

no warnings qw(redefine misc);

if(defined (&__x86_64__)  && !defined (&__ILP32__)) {
    eval 'sub __WORDSIZE () {64;}' unless defined(&__WORDSIZE);
} else {
    eval 'sub __WORDSIZE () {32;}' unless defined(&__WORDSIZE);
}
if(defined(&__x86_64__)) {
    eval 'sub __WORDSIZE_TIME64_COMPAT32 () {1;}' unless defined(&__WORDSIZE_TIME64_COMPAT32);
    eval 'sub __SYSCALL_WORDSIZE () {64;}' unless defined(&__SYSCALL_WORDSIZE);
}
1;
