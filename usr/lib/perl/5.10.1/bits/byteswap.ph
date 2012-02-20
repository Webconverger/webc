require '_h2ph_pre.ph';

no warnings qw(redefine misc);

if(!defined (defined(&_BYTESWAP_H) ? &_BYTESWAP_H : undef)  && !defined (defined(&_NETINET_IN_H) ? &_NETINET_IN_H : undef)  && !defined (defined(&_ENDIAN_H) ? &_ENDIAN_H : undef)) {
    die("Never use <bits/byteswap.h> directly; include <byteswap.h> instead.");
}
unless(defined(&_BITS_BYTESWAP_H)) {
    eval 'sub _BITS_BYTESWAP_H () {1;}' unless defined(&_BITS_BYTESWAP_H);
    require 'bits/wordsize.ph';
    eval 'sub __bswap_constant_16 {
        my($x) = @_;
	    eval q((((($x) >> 8) & 0xff) | ((($x) & 0xff) << 8)));
    }' unless defined(&__bswap_constant_16);
    if(defined (defined(&__GNUC__) ? &__GNUC__ : undef)  && (defined(&__GNUC__) ? &__GNUC__ : undef) >= 2) {
	eval 'sub __bswap_16 {
	    my($x) = @_;
    	    eval q(\\"(assembly code)\\");
	}' unless defined(&__bswap_16);
    } else {
	eval 'sub __bswap_16 {
	    my($x) = @_;
    	    eval q(( &__extension__ ({  &register \'unsigned short int __x\' = ($x);  &__bswap_constant_16 ( &__x); })));
	}' unless defined(&__bswap_16);
    }
    eval 'sub __bswap_constant_32 {
        my($x) = @_;
	    eval q((((($x) & 0xff000000) >> 24) | ((($x) & 0xff0000) >> 8) | ((($x) & 0xff00) << 8) | ((($x) & 0xff) << 24)));
    }' unless defined(&__bswap_constant_32);
    if(defined (defined(&__GNUC__) ? &__GNUC__ : undef)  && (defined(&__GNUC__) ? &__GNUC__ : undef) >= 2) {
	if((defined(&__WORDSIZE) ? &__WORDSIZE : undef) == 64|| (defined (defined(&__i486__) ? &__i486__ : undef) || defined (defined(&__pentium__) ? &__pentium__ : undef) || defined (defined(&__pentiumpro__) ? &__pentiumpro__ : undef) || defined (defined(&__pentium4__) ? &__pentium4__ : undef) || defined (defined(&__k8__) ? &__k8__ : undef) || defined (defined(&__athlon__) ? &__athlon__ : undef) || defined (defined(&__k6__) ? &__k6__ : undef) || defined (defined(&__nocona__) ? &__nocona__ : undef) || defined (defined(&__core2__) ? &__core2__ : undef) || defined (defined(&__geode__) ? &__geode__ : undef) || defined (defined(&__amdfam10__) ? &__amdfam10__ : undef))) {
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
    if(defined (defined(&__GNUC__) ? &__GNUC__ : undef)  && (defined(&__GNUC__) ? &__GNUC__ : undef) >= 2) {
	eval 'sub __bswap_constant_64 {
	    my($x) = @_;
    	    eval q((((($x) & 1.83746864796716e+19) >> 56) | ((($x) & 7.17761190612173e+16) >> 40) | ((($x) & 280375465082880) >> 24) | ((($x) & 1095216660480) >> 8) | ((($x) & 0xff000000) << 8) | ((($x) & 0xff0000) << 24) | ((($x) & 0xff00) << 40) | ((($x) & 0xff) << 56)));
	}' unless defined(&__bswap_constant_64);
	if((defined(&__WORDSIZE) ? &__WORDSIZE : undef) == 64) {
	    eval 'sub __bswap_64 {
	        my($x) = @_;
    		eval q(\\"(assembly code)\\");
	    }' unless defined(&__bswap_64);
	} else {
	    eval 'sub __bswap_64 {
	        my($x) = @_;
    		eval q(( &__extension__ ({ \'union union\' {  &__extension__ \'unsigned long long int __ll\'; \'unsigned int __l\'[2]; }  &__w,  &__r;  &if ( &__builtin_constant_p ($x))  ($__r->{__ll}) =  &__bswap_constant_64 ($x);  &else {  ($__w->{__ll}) = ($x);  ($__r->{__l[0]}) =  &__bswap_32 ( ($__w->{__l[1]}));  ($__r->{__l[1]}) =  &__bswap_32 ( ($__w->{__l[0]})); }  ($__r->{__ll}); })));
	    }' unless defined(&__bswap_64);
	}
    }
}
1;
