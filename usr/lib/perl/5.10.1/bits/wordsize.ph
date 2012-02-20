require '_h2ph_pre.ph';

no warnings qw(redefine misc);

if(defined (defined(&__x86_64__) ? &__x86_64__ : undef)) {
    eval 'sub __WORDSIZE () {64;}' unless defined(&__WORDSIZE);
    eval 'sub __WORDSIZE_COMPAT32 () {1;}' unless defined(&__WORDSIZE_COMPAT32);
} else {
    eval 'sub __WORDSIZE () {32;}' unless defined(&__WORDSIZE);
}
1;
