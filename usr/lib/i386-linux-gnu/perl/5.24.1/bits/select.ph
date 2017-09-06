require '_h2ph_pre.ph';

no warnings qw(redefine misc);

unless(defined(&_SYS_SELECT_H)) {
    die("Never use <bits/select.h> directly; include <sys/select.h> instead.");
}
require 'bits/wordsize.ph';
if(defined (&__GNUC__)  && (defined(&__GNUC__) ? &__GNUC__ : undef) >= 2) {
    if((defined(&__WORDSIZE) ? &__WORDSIZE : undef) == 64) {
	eval 'sub __FD_ZERO_STOS () {"stosq";}' unless defined(&__FD_ZERO_STOS);
    } else {
	eval 'sub __FD_ZERO_STOS () {"stosl";}' unless defined(&__FD_ZERO_STOS);
    }
    eval 'sub __FD_ZERO {
        my($fdsp) = @_;
	    eval q(\\"(assembly code)\\");
    }' unless defined(&__FD_ZERO);
} else {
    eval 'sub __FD_ZERO {
        my($set) = @_;
	    eval q( &do { \'unsigned int __i\';  &fd_set * &__arr = ($set);  &for ( &__i = 0;  &__i < $sizeof{ &fd_set} / $sizeof{ &__fd_mask}; ++ &__i)  &__FDS_BITS ( &__arr)[ &__i] = 0; }  &while (0));
    }' unless defined(&__FD_ZERO);
}
unless(defined(&__FD_SET)) {
    sub __FD_SET {
	my($d, $set) = @_;
	eval q((( &void) ( &__FDS_BITS ($set)[ &__FD_ELT ($d)] |=  &__FD_MASK ($d))));
    }
}
unless(defined(&__FD_CLR)) {
    sub __FD_CLR {
	my($d, $set) = @_;
	eval q((( &void) ( &__FDS_BITS ($set)[ &__FD_ELT ($d)] &= ~ &__FD_MASK ($d))));
    }
}
unless(defined(&__FD_ISSET)) {
    sub __FD_ISSET {
	my($d, $set) = @_;
	eval q((( &__FDS_BITS ($set)[ &__FD_ELT ($d)] &  &__FD_MASK ($d)) != 0));
    }
}
1;
