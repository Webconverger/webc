require '_h2ph_pre.ph';

no warnings qw(redefine misc);

unless(defined(&_SIGSET_H_types)) {
    eval 'sub _SIGSET_H_types () {1;}' unless defined(&_SIGSET_H_types);
    eval 'sub _SIGSET_NWORDS () {(1024/ (8* $sizeof{\'unsigned long int\'}));}' unless defined(&_SIGSET_NWORDS);
}
if(!defined (&_SIGSET_H_fns)  && defined (&_SIGNAL_H)) {
    eval 'sub _SIGSET_H_fns () {1;}' unless defined(&_SIGSET_H_fns);
    unless(defined(&_EXTERN_INLINE)) {
	eval 'sub _EXTERN_INLINE () { &__extern_inline;}' unless defined(&_EXTERN_INLINE);
    }
    eval 'sub __sigmask {
        my($sig) = @_;
	    eval q((( 1) << ((($sig) - 1) % (8* $sizeof{\'unsigned long int\'}))));
    }' unless defined(&__sigmask);
    eval 'sub __sigword {
        my($sig) = @_;
	    eval q(((($sig) - 1) / (8* $sizeof{\'unsigned long int\'})));
    }' unless defined(&__sigword);
    if(defined (&__GNUC__)  && (defined(&__GNUC__) ? &__GNUC__ : undef) >= 2) {
	eval 'sub __sigemptyset {
	    my($set) = @_;
    	    eval q(( &__extension__ ({ \'int\'  &__cnt =  &_SIGSET_NWORDS;  &sigset_t * &__set = ($set);  &while (-- &__cnt >= 0)  ($__set->{__val[&__cnt]}) = 0; 0; })));
	}' unless defined(&__sigemptyset);
	eval 'sub __sigfillset {
	    my($set) = @_;
    	    eval q(( &__extension__ ({ \'int\'  &__cnt =  &_SIGSET_NWORDS;  &sigset_t * &__set = ($set);  &while (-- &__cnt >= 0)  ($__set->{__val[&__cnt]}) = ~0; 0; })));
	}' unless defined(&__sigfillset);
	if(defined(&__USE_GNU)) {
	    eval 'sub __sigisemptyset {
	        my($set) = @_;
    		eval q(( &__extension__ ({ \'int\'  &__cnt =  &_SIGSET_NWORDS;  &const  &sigset_t * &__set = ($set); \'int\'  &__ret =  ($__set->{__val[&}--__cnt]);  &while (! &__ret  && -- &__cnt >= 0)  &__ret =  ($__set->{__val[&__cnt]});  &__ret == 0; })));
	    }' unless defined(&__sigisemptyset);
	    eval 'sub __sigandset {
	        my($dest, $left, $right) = @_;
    		eval q(( &__extension__ ({ \'int\'  &__cnt =  &_SIGSET_NWORDS;  &sigset_t * &__dest = ($dest);  &const  &sigset_t * &__left = ($left);  &const  &sigset_t * &__right = ($right);  &while (-- &__cnt >= 0)  ($__dest->{__val[&__cnt]}) = ( ($__left->{__val[&__cnt]})	 &  ($__right->{__val[&__cnt]})); 0; })));
	    }' unless defined(&__sigandset);
	    eval 'sub __sigorset {
	        my($dest, $left, $right) = @_;
    		eval q(( &__extension__ ({ \'int\'  &__cnt =  &_SIGSET_NWORDS;  &sigset_t * &__dest = ($dest);  &const  &sigset_t * &__left = ($left);  &const  &sigset_t * &__right = ($right);  &while (-- &__cnt >= 0)  ($__dest->{__val[&__cnt]}) = ( ($__left->{__val[&__cnt]})	 |  ($__right->{__val[&__cnt]})); 0; })));
	    }' unless defined(&__sigorset);
	}
    }
    if(defined(&__USE_EXTERN_INLINES)) {
	eval 'sub __SIGSETFN {
	    my($NAME, $BODY, $CONST) = @_;
    	    eval q( &_EXTERN_INLINE \'int\' $NAME ($CONST  &__sigset_t * &__set, \'int\'  &__sig) { \'unsigned long int __mask\' =  &__sigmask ( &__sig); \'unsigned long int __word\' =  &__sigword ( &__sig);  &return $BODY; });
	}' unless defined(&__SIGSETFN);
	undef(&__SIGSETFN) if defined(&__SIGSETFN);
    }
}
1;
