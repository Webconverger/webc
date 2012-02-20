require '_h2ph_pre.ph';

no warnings qw(redefine misc);

unless(defined(&_SYS_SYSMACROS_H)) {
    eval 'sub _SYS_SYSMACROS_H () {1;}' unless defined(&_SYS_SYSMACROS_H);
    require 'features.ph';
    if(defined(&__GLIBC_HAVE_LONG_LONG)) {
	if(defined (defined(&__GNUC__) ? &__GNUC__ : undef)  && (defined(&__GNUC__) ? &__GNUC__ : undef) >= 2 && defined (defined(&__USE_EXTERN_INLINES) ? &__USE_EXTERN_INLINES : undef)) {
	}
	eval 'sub major {
	    my($dev) = @_;
    	    eval q( &gnu_dev_major ($dev));
	}' unless defined(&major);
	eval 'sub minor {
	    my($dev) = @_;
    	    eval q( &gnu_dev_minor ($dev));
	}' unless defined(&minor);
	eval 'sub makedev {
	    my($maj, $min) = @_;
    	    eval q( &gnu_dev_makedev ($maj, $min));
	}' unless defined(&makedev);
    }
}
1;
