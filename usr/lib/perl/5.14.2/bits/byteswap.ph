require '_h2ph_pre.ph';

no warnings qw(redefine misc);

if(!defined (&_BYTESWAP_H)  && !defined (&_NETINET_IN_H)  && !defined (&_ENDIAN_H)) {
    die("Never use <bits/byteswap.h> directly; include <byteswap.h> instead.");
}
unless(defined(&_BITS_BYTESWAP_H)) {
    eval 'sub _BITS_BYTESWAP_H () {1;}' unless defined(&_BITS_BYTESWAP_H);
    eval 'sub __bswap_constant_16 {
        my($x) = @_;
	    eval q(( (((($x) >> 8) & 0xff) | ((($x) & 0xff) << 8))));
    }' unless defined(&__bswap_constant_16);
    if(defined(&__GNUC__)) {
	if((defined(&__GNUC__) ? &__GNUC__ : undef) >= 2) {
	    eval 'sub __bswap_16 {
	        my($x) = @_;
    		eval q(\\"(assembly code)\\");
	    }' unless defined(&__bswap_16);
	} else {
	    eval 'sub __bswap_16 {
	        my($x) = @_;
    		eval q(( &__extension__ ({  &register \'unsigned short int __x\' =  ($x);  &__bswap_constant_16 ( &__x); })));
	    }' unless defined(&__bswap_16);
	}
    } else {
	eval 'sub __bswap_16 {
	    my($__bsx) = @_;
    	    eval q({  &__bswap_constant_16 ($__bsx); });
	}' unless defined(&__bswap_16);
    }
    eval 'sub __bswap_constant_32 {
        my($x) = @_;
	    eval q((((($x) & 0xff000000) >> 24) | ((($x) & 0xff0000) >> 8) | ((($x) & 0xff00) << 8) | ((($x) & 0xff) << 24)));
    }' unless defined(&__bswap_constant_32);
    if(defined(&__GNUC__)) {
	if((defined(&__GNUC__) ? &__GNUC__ : undef) >= 2) {
	    if(!defined (&__i486__)  && !defined (&__pentium__)  && !defined (&__pentiumpro__)  && !defined (&__pentium4__)  && !defined (&__k8__)  && !defined (&__athlon__)  && !defined (&__k6__)  && !defined (&__nocona__)  && !defined (&__core2__)  && !defined (&__geode__)  && !defined (&__amdfam10__)) {
		eval 'sub __bswap_32 {
		    my($x) = @_;
    		    eval q(\\"(assembly code)\\");
		}' unless defined(&__bswap_32);
	    } else {
		eval 'sub __bswap_32 {
		    my($x) = @_;
    		    eval q(\\"(assembly code)\\");
		}' unless defined(&__bswap_32);
	    }
	} else {
	    eval 'sub __bswap_32 {
	        my($x) = @_;
    		eval q(( &__extension__ ({  &register \'unsigned int __x\' = ($x);  &__bswap_constant_32 ( &__x); })));
	    }' unless defined(&__bswap_32);
	}
    } else {
	eval 'sub __bswap_32 {
	    my($__bsx) = @_;
    	    eval q({  &__bswap_constant_32 ($__bsx); });
	}' unless defined(&__bswap_32);
    }
    if(defined (&__GNUC__)  && (defined(&__GNUC__) ? &__GNUC__ : undef) >= 2) {
	eval 'sub __bswap_constant_64 {
	    my($x) = @_;
    	    eval q((((($x) & 0xff00000000000000) >> 56) | ((($x) & 0xff000000000000) >> 40) | ((($x) & 0xff0000000000) >> 24) | ((($x) & 0xff00000000) >> 8) | ((($x) & 0xff000000) << 8) | ((($x) & 0xff0000) << 24) | ((($x) & 0xff00) << 40) | ((($x) & 0xff) << 56)));
	}' unless defined(&__bswap_constant_64);
	eval 'sub __bswap_64 {
	    my($x) = @_;
    	    eval q(( &__extension__ ({ \'union union\' {  &__extension__ \'unsigned long long int __ll\'; \'unsigned long int __l\'[2]; }  &__w,  &__r;  &if ( &__builtin_constant_p ($x))  ($__r->{__ll}) =  &__bswap_constant_64 ($x);  &else {  ($__w->{__ll}) = ($x);  ($__r->{__l[0]}) =  &__bswap_32 ( ($__w->{__l[1]}));  ($__r->{__l[1]}) =  &__bswap_32 ( ($__w->{__l[0]})); }  ($__r->{__ll}); })));
	}' unless defined(&__bswap_64);
    }
}
1;
