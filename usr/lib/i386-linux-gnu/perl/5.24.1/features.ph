require '_h2ph_pre.ph';

no warnings qw(redefine misc);

unless(defined(&_FEATURES_H)) {
    eval 'sub _FEATURES_H () {1;}' unless defined(&_FEATURES_H);
    undef(&__USE_ISOC11) if defined(&__USE_ISOC11);
    undef(&__USE_ISOC99) if defined(&__USE_ISOC99);
    undef(&__USE_ISOC95) if defined(&__USE_ISOC95);
    undef(&__USE_ISOCXX11) if defined(&__USE_ISOCXX11);
    undef(&__USE_POSIX) if defined(&__USE_POSIX);
    undef(&__USE_POSIX2) if defined(&__USE_POSIX2);
    undef(&__USE_POSIX199309) if defined(&__USE_POSIX199309);
    undef(&__USE_POSIX199506) if defined(&__USE_POSIX199506);
    undef(&__USE_XOPEN) if defined(&__USE_XOPEN);
    undef(&__USE_XOPEN_EXTENDED) if defined(&__USE_XOPEN_EXTENDED);
    undef(&__USE_UNIX98) if defined(&__USE_UNIX98);
    undef(&__USE_XOPEN2K) if defined(&__USE_XOPEN2K);
    undef(&__USE_XOPEN2KXSI) if defined(&__USE_XOPEN2KXSI);
    undef(&__USE_XOPEN2K8) if defined(&__USE_XOPEN2K8);
    undef(&__USE_XOPEN2K8XSI) if defined(&__USE_XOPEN2K8XSI);
    undef(&__USE_LARGEFILE) if defined(&__USE_LARGEFILE);
    undef(&__USE_LARGEFILE64) if defined(&__USE_LARGEFILE64);
    undef(&__USE_FILE_OFFSET64) if defined(&__USE_FILE_OFFSET64);
    undef(&__USE_MISC) if defined(&__USE_MISC);
    undef(&__USE_ATFILE) if defined(&__USE_ATFILE);
    undef(&__USE_GNU) if defined(&__USE_GNU);
    undef(&__USE_REENTRANT) if defined(&__USE_REENTRANT);
    undef(&__USE_FORTIFY_LEVEL) if defined(&__USE_FORTIFY_LEVEL);
    undef(&__KERNEL_STRICT_NAMES) if defined(&__KERNEL_STRICT_NAMES);
    unless(defined(&_LOOSE_KERNEL_NAMES)) {
	eval 'sub __KERNEL_STRICT_NAMES () {1;}' unless defined(&__KERNEL_STRICT_NAMES);
    }
    if(defined (&__GNUC__)  && defined (&__GNUC_MINOR__)) {
	eval 'sub __GNUC_PREREQ {
	    my($maj, $min) = @_;
    	    eval q((( &__GNUC__ << 16) +  &__GNUC_MINOR__ >= (($maj) << 16) + ($min)));
	}' unless defined(&__GNUC_PREREQ);
    } else {
	eval 'sub __GNUC_PREREQ {
	    my($maj, $min) = @_;
    	    eval q(0);
	}' unless defined(&__GNUC_PREREQ);
    }
    if((defined (&_BSD_SOURCE) || defined (&_SVID_SOURCE))  && !defined (&_DEFAULT_SOURCE)) {
	warn("\"_BSD_SOURCE\ and\ _SVID_SOURCE\ are\ deprecated\,\ use\ _DEFAULT_SOURCE\"");
	undef(&_DEFAULT_SOURCE) if defined(&_DEFAULT_SOURCE);
	eval 'sub _DEFAULT_SOURCE () {1;}' unless defined(&_DEFAULT_SOURCE);
    }
    if(defined(&_GNU_SOURCE)) {
	undef(&_ISOC95_SOURCE) if defined(&_ISOC95_SOURCE);
	eval 'sub _ISOC95_SOURCE () {1;}' unless defined(&_ISOC95_SOURCE);
	undef(&_ISOC99_SOURCE) if defined(&_ISOC99_SOURCE);
	eval 'sub _ISOC99_SOURCE () {1;}' unless defined(&_ISOC99_SOURCE);
	undef(&_ISOC11_SOURCE) if defined(&_ISOC11_SOURCE);
	eval 'sub _ISOC11_SOURCE () {1;}' unless defined(&_ISOC11_SOURCE);
	undef(&_POSIX_SOURCE) if defined(&_POSIX_SOURCE);
	eval 'sub _POSIX_SOURCE () {1;}' unless defined(&_POSIX_SOURCE);
	undef(&_POSIX_C_SOURCE) if defined(&_POSIX_C_SOURCE);
	eval 'sub _POSIX_C_SOURCE () {200809;}' unless defined(&_POSIX_C_SOURCE);
	undef(&_XOPEN_SOURCE) if defined(&_XOPEN_SOURCE);
	eval 'sub _XOPEN_SOURCE () {700;}' unless defined(&_XOPEN_SOURCE);
	undef(&_XOPEN_SOURCE_EXTENDED) if defined(&_XOPEN_SOURCE_EXTENDED);
	eval 'sub _XOPEN_SOURCE_EXTENDED () {1;}' unless defined(&_XOPEN_SOURCE_EXTENDED);
	undef(&_LARGEFILE64_SOURCE) if defined(&_LARGEFILE64_SOURCE);
	eval 'sub _LARGEFILE64_SOURCE () {1;}' unless defined(&_LARGEFILE64_SOURCE);
	undef(&_DEFAULT_SOURCE) if defined(&_DEFAULT_SOURCE);
	eval 'sub _DEFAULT_SOURCE () {1;}' unless defined(&_DEFAULT_SOURCE);
	undef(&_ATFILE_SOURCE) if defined(&_ATFILE_SOURCE);
	eval 'sub _ATFILE_SOURCE () {1;}' unless defined(&_ATFILE_SOURCE);
    }
    if((defined (&_DEFAULT_SOURCE) || (!defined (&__STRICT_ANSI__)  && !defined (&_ISOC99_SOURCE)  && !defined (&_POSIX_SOURCE)  && !defined (&_POSIX_C_SOURCE)  && !defined (&_XOPEN_SOURCE)))) {
	undef(&_DEFAULT_SOURCE) if defined(&_DEFAULT_SOURCE);
	eval 'sub _DEFAULT_SOURCE () {1;}' unless defined(&_DEFAULT_SOURCE);
    }
    if((defined (&_ISOC11_SOURCE) || (defined (&__STDC_VERSION__)  && (defined(&__STDC_VERSION__) ? &__STDC_VERSION__ : undef) >= 201112))) {
	eval 'sub __USE_ISOC11 () {1;}' unless defined(&__USE_ISOC11);
    }
    if((defined (&_ISOC99_SOURCE) || defined (&_ISOC11_SOURCE) || (defined (&__STDC_VERSION__)  && (defined(&__STDC_VERSION__) ? &__STDC_VERSION__ : undef) >= 199901))) {
	eval 'sub __USE_ISOC99 () {1;}' unless defined(&__USE_ISOC99);
    }
    if((defined (&_ISOC99_SOURCE) || defined (&_ISOC11_SOURCE) || (defined (&__STDC_VERSION__)  && (defined(&__STDC_VERSION__) ? &__STDC_VERSION__ : undef) >= 199409))) {
	eval 'sub __USE_ISOC95 () {1;}' unless defined(&__USE_ISOC95);
    }
    if(((defined (&__cplusplus)  && (defined(&__cplusplus) ? &__cplusplus : undef) >= 201103) || defined (&__GXX_EXPERIMENTAL_CXX0X__))) {
	eval 'sub __USE_ISOCXX11 () {1;}' unless defined(&__USE_ISOCXX11);
    }
    if(defined(&_DEFAULT_SOURCE)) {
	if(!defined (&_POSIX_SOURCE)  && !defined (&_POSIX_C_SOURCE)) {
	    eval 'sub __USE_POSIX_IMPLICITLY () {1;}' unless defined(&__USE_POSIX_IMPLICITLY);
	}
	undef(&_POSIX_SOURCE) if defined(&_POSIX_SOURCE);
	eval 'sub _POSIX_SOURCE () {1;}' unless defined(&_POSIX_SOURCE);
	undef(&_POSIX_C_SOURCE) if defined(&_POSIX_C_SOURCE);
	eval 'sub _POSIX_C_SOURCE () {200809;}' unless defined(&_POSIX_C_SOURCE);
    }
    if(((!defined (&__STRICT_ANSI__) || (defined (&_XOPEN_SOURCE)  && ((defined(&_XOPEN_SOURCE) ? &_XOPEN_SOURCE : undef) - 0) >= 500))  && !defined (&_POSIX_SOURCE)  && !defined (&_POSIX_C_SOURCE))) {
	eval 'sub _POSIX_SOURCE () {1;}' unless defined(&_POSIX_SOURCE);
	if(defined (&_XOPEN_SOURCE)  && ((defined(&_XOPEN_SOURCE) ? &_XOPEN_SOURCE : undef) - 0) < 500) {
	    eval 'sub _POSIX_C_SOURCE () {2;}' unless defined(&_POSIX_C_SOURCE);
	}
 elsif(defined (&_XOPEN_SOURCE)  && ((defined(&_XOPEN_SOURCE) ? &_XOPEN_SOURCE : undef) - 0) < 600) {
	    eval 'sub _POSIX_C_SOURCE () {199506;}' unless defined(&_POSIX_C_SOURCE);
	}
 elsif(defined (&_XOPEN_SOURCE)  && ((defined(&_XOPEN_SOURCE) ? &_XOPEN_SOURCE : undef) - 0) < 700) {
	    eval 'sub _POSIX_C_SOURCE () {200112;}' unless defined(&_POSIX_C_SOURCE);
	} else {
	    eval 'sub _POSIX_C_SOURCE () {200809;}' unless defined(&_POSIX_C_SOURCE);
	}
	eval 'sub __USE_POSIX_IMPLICITLY () {1;}' unless defined(&__USE_POSIX_IMPLICITLY);
    }
    if((defined (&_POSIX_SOURCE) || (defined (&_POSIX_C_SOURCE)  && (defined(&_POSIX_C_SOURCE) ? &_POSIX_C_SOURCE : undef) >= 1) || defined (&_XOPEN_SOURCE))) {
	eval 'sub __USE_POSIX () {1;}' unless defined(&__USE_POSIX);
    }
    if(defined (&_POSIX_C_SOURCE)  && (defined(&_POSIX_C_SOURCE) ? &_POSIX_C_SOURCE : undef) >= 2|| defined (&_XOPEN_SOURCE)) {
	eval 'sub __USE_POSIX2 () {1;}' unless defined(&__USE_POSIX2);
    }
    if(defined (&_POSIX_C_SOURCE)  && ((defined(&_POSIX_C_SOURCE) ? &_POSIX_C_SOURCE : undef) - 0) >= 199309) {
	eval 'sub __USE_POSIX199309 () {1;}' unless defined(&__USE_POSIX199309);
    }
    if(defined (&_POSIX_C_SOURCE)  && ((defined(&_POSIX_C_SOURCE) ? &_POSIX_C_SOURCE : undef) - 0) >= 199506) {
	eval 'sub __USE_POSIX199506 () {1;}' unless defined(&__USE_POSIX199506);
    }
    if(defined (&_POSIX_C_SOURCE)  && ((defined(&_POSIX_C_SOURCE) ? &_POSIX_C_SOURCE : undef) - 0) >= 200112) {
	eval 'sub __USE_XOPEN2K () {1;}' unless defined(&__USE_XOPEN2K);
	undef(&__USE_ISOC95) if defined(&__USE_ISOC95);
	eval 'sub __USE_ISOC95 () {1;}' unless defined(&__USE_ISOC95);
	undef(&__USE_ISOC99) if defined(&__USE_ISOC99);
	eval 'sub __USE_ISOC99 () {1;}' unless defined(&__USE_ISOC99);
    }
    if(defined (&_POSIX_C_SOURCE)  && ((defined(&_POSIX_C_SOURCE) ? &_POSIX_C_SOURCE : undef) - 0) >= 200809) {
	eval 'sub __USE_XOPEN2K8 () {1;}' unless defined(&__USE_XOPEN2K8);
	undef(&_ATFILE_SOURCE) if defined(&_ATFILE_SOURCE);
	eval 'sub _ATFILE_SOURCE () {1;}' unless defined(&_ATFILE_SOURCE);
    }
    if(defined(&_XOPEN_SOURCE)) {
	eval 'sub __USE_XOPEN () {1;}' unless defined(&__USE_XOPEN);
	if(((defined(&_XOPEN_SOURCE) ? &_XOPEN_SOURCE : undef) - 0) >= 500) {
	    eval 'sub __USE_XOPEN_EXTENDED () {1;}' unless defined(&__USE_XOPEN_EXTENDED);
	    eval 'sub __USE_UNIX98 () {1;}' unless defined(&__USE_UNIX98);
	    undef(&_LARGEFILE_SOURCE) if defined(&_LARGEFILE_SOURCE);
	    eval 'sub _LARGEFILE_SOURCE () {1;}' unless defined(&_LARGEFILE_SOURCE);
	    if(((defined(&_XOPEN_SOURCE) ? &_XOPEN_SOURCE : undef) - 0) >= 600) {
		if(((defined(&_XOPEN_SOURCE) ? &_XOPEN_SOURCE : undef) - 0) >= 700) {
		    eval 'sub __USE_XOPEN2K8 () {1;}' unless defined(&__USE_XOPEN2K8);
		    eval 'sub __USE_XOPEN2K8XSI () {1;}' unless defined(&__USE_XOPEN2K8XSI);
		}
		eval 'sub __USE_XOPEN2K () {1;}' unless defined(&__USE_XOPEN2K);
		eval 'sub __USE_XOPEN2KXSI () {1;}' unless defined(&__USE_XOPEN2KXSI);
		undef(&__USE_ISOC95) if defined(&__USE_ISOC95);
		eval 'sub __USE_ISOC95 () {1;}' unless defined(&__USE_ISOC95);
		undef(&__USE_ISOC99) if defined(&__USE_ISOC99);
		eval 'sub __USE_ISOC99 () {1;}' unless defined(&__USE_ISOC99);
	    }
	} else {
	    if(defined(&_XOPEN_SOURCE_EXTENDED)) {
		eval 'sub __USE_XOPEN_EXTENDED () {1;}' unless defined(&__USE_XOPEN_EXTENDED);
	    }
	}
    }
    if(defined(&_LARGEFILE_SOURCE)) {
	eval 'sub __USE_LARGEFILE () {1;}' unless defined(&__USE_LARGEFILE);
    }
    if(defined(&_LARGEFILE64_SOURCE)) {
	eval 'sub __USE_LARGEFILE64 () {1;}' unless defined(&__USE_LARGEFILE64);
    }
    if(defined (&_FILE_OFFSET_BITS)  && (defined(&_FILE_OFFSET_BITS) ? &_FILE_OFFSET_BITS : undef) == 64) {
	eval 'sub __USE_FILE_OFFSET64 () {1;}' unless defined(&__USE_FILE_OFFSET64);
    }
    if(defined (&_DEFAULT_SOURCE)) {
	eval 'sub __USE_MISC () {1;}' unless defined(&__USE_MISC);
    }
    if(defined(&_ATFILE_SOURCE)) {
	eval 'sub __USE_ATFILE () {1;}' unless defined(&__USE_ATFILE);
    }
    if(defined(&_GNU_SOURCE)) {
	eval 'sub __USE_GNU () {1;}' unless defined(&__USE_GNU);
    }
    if(defined (&_REENTRANT) || defined (&_THREAD_SAFE)) {
	eval 'sub __USE_REENTRANT () {1;}' unless defined(&__USE_REENTRANT);
    }
    if(defined (&_FORTIFY_SOURCE)  && (defined(&_FORTIFY_SOURCE) ? &_FORTIFY_SOURCE : undef) > 0 &&  &__GNUC_PREREQ (4, 1)  && defined (&__OPTIMIZE__)  && (defined(&__OPTIMIZE__) ? &__OPTIMIZE__ : undef) > 0) {
	if((defined(&_FORTIFY_SOURCE) ? &_FORTIFY_SOURCE : undef) > 1) {
	    eval 'sub __USE_FORTIFY_LEVEL () {2;}' unless defined(&__USE_FORTIFY_LEVEL);
	} else {
	    eval 'sub __USE_FORTIFY_LEVEL () {1;}' unless defined(&__USE_FORTIFY_LEVEL);
	}
    } else {
	eval 'sub __USE_FORTIFY_LEVEL () {0;}' unless defined(&__USE_FORTIFY_LEVEL);
    }
    require 'stdc-predef.ph';
    undef(&__GNU_LIBRARY__) if defined(&__GNU_LIBRARY__);
    eval 'sub __GNU_LIBRARY__ () {6;}' unless defined(&__GNU_LIBRARY__);
    eval 'sub __GLIBC__ () {2;}' unless defined(&__GLIBC__);
    eval 'sub __GLIBC_MINOR__ () {24;}' unless defined(&__GLIBC_MINOR__);
    eval 'sub __GLIBC_PREREQ {
        my($maj, $min) = @_;
	    eval q((( &__GLIBC__ << 16) +  &__GLIBC_MINOR__ >= (($maj) << 16) + ($min)));
    }' unless defined(&__GLIBC_PREREQ);
    unless(defined(&__ASSEMBLER__)) {
	unless(defined(&_SYS_CDEFS_H)) {
	    require 'sys/cdefs.ph';
	}
	if(defined (&__USE_FILE_OFFSET64)  && !defined (&__REDIRECT)) {
	    eval 'sub __USE_LARGEFILE () {1;}' unless defined(&__USE_LARGEFILE);
	    eval 'sub __USE_LARGEFILE64 () {1;}' unless defined(&__USE_LARGEFILE64);
	}
    }
    if( &__GNUC_PREREQ (2, 7)  && defined (&__OPTIMIZE__)  && !defined (&__OPTIMIZE_SIZE__)  && !defined (&__NO_INLINE__)  && defined (&__extern_inline)) {
	eval 'sub __USE_EXTERN_INLINES () {1;}' unless defined(&__USE_EXTERN_INLINES);
    }
    require 'gnu/stubs.ph';
}
1;
