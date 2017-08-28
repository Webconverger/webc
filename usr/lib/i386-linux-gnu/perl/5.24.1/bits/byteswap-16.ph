require '_h2ph_pre.ph';

no warnings qw(redefine misc);

unless(defined(&_BITS_BYTESWAP_H)) {
    die("Never use <bits/byteswap-16.h> directly; include <byteswap.h> instead.");
}
if(defined(&__GNUC__)) {
    if((defined(&__GNUC__) ? &__GNUC__ : undef) >= 2) {
	eval 'sub __bswap_16 {
	    my($x) = @_;
    	    eval q(\\"(assembly code)\\");
	}' unless defined(&__bswap_16);
    } else {
	eval 'sub __bswap_16 {
	    my($x) = @_;
    	    eval q(( &__extension__ ({ \'unsigned short int __x\' =  ($x);  &__bswap_constant_16 ( &__x); })));
	}' unless defined(&__bswap_16);
    }
} else {
    eval 'sub __bswap_16 {
        my($__bsx) = @_;
	    eval q({  &__bswap_constant_16 ($__bsx); });
    }' unless defined(&__bswap_16);
}
1;
