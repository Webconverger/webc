require '_h2ph_pre.ph';

no warnings qw(redefine misc);

unless(defined(&_LINUX_POSIX_TYPES_H)) {
    eval 'sub _LINUX_POSIX_TYPES_H () {1;}' unless defined(&_LINUX_POSIX_TYPES_H);
    require 'linux/stddef.ph';
    undef(&__NFDBITS) if defined(&__NFDBITS);
    eval 'sub __NFDBITS () {(8* $sizeof{\'unsigned long\'});}' unless defined(&__NFDBITS);
    undef(&__FD_SETSIZE) if defined(&__FD_SETSIZE);
    eval 'sub __FD_SETSIZE () {1024;}' unless defined(&__FD_SETSIZE);
    undef(&__FDSET_LONGS) if defined(&__FDSET_LONGS);
    eval 'sub __FDSET_LONGS () {( &__FD_SETSIZE/ &__NFDBITS);}' unless defined(&__FDSET_LONGS);
    undef(&__FDELT) if defined(&__FDELT);
    eval 'sub __FDELT {
        my($d) = @_;
	    eval q((($d) /  &__NFDBITS));
    }' unless defined(&__FDELT);
    undef(&__FDMASK) if defined(&__FDMASK);
    eval 'sub __FDMASK {
        my($d) = @_;
	    eval q((1 << (($d) %  &__NFDBITS)));
    }' unless defined(&__FDMASK);
    require 'asm/posix_types.ph';
}
1;
