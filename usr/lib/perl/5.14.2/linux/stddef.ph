require '_h2ph_pre.ph';

no warnings qw(redefine misc);

unless(defined(&_LINUX_STDDEF_H)) {
    eval 'sub _LINUX_STDDEF_H () {1;}' unless defined(&_LINUX_STDDEF_H);
    undef(&NULL) if defined(&NULL);
    if(defined(&__cplusplus)) {
	eval 'sub NULL () {0;}' unless defined(&NULL);
    } else {
	eval 'sub NULL () {(( &void *)0);}' unless defined(&NULL);
    }
}
1;
