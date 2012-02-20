require '_h2ph_pre.ph';

no warnings qw(redefine misc);

unless(defined(&_SYS_UIO_H)) {
    eval 'sub _SYS_UIO_H () {1;}' unless defined(&_SYS_UIO_H);
    require 'features.ph';
    require 'sys/types.ph';
    require 'bits/uio.ph';
    if(defined(&__USE_BSD)) {
	unless(defined(&__USE_FILE_OFFSET64)) {
	} else {
	    if(defined(&__REDIRECT)) {
	    } else {
		eval 'sub preadv () { &preadv64;}' unless defined(&preadv);
		eval 'sub pwritev () { &pwritev64;}' unless defined(&pwritev);
	    }
	}
	if(defined(&__USE_LARGEFILE64)) {
	}
    }
}
1;
