require '_h2ph_pre.ph';

no warnings qw(redefine misc);

if(!defined (defined(&_SYS_UIO_H) ? &_SYS_UIO_H : undef)  && !defined (defined(&_FCNTL_H) ? &_FCNTL_H : undef)) {
    die("Never include <bits/uio.h> directly; use <sys/uio.h> instead.");
}
unless(defined(&_BITS_UIO_H)) {
    eval 'sub _BITS_UIO_H () {1;}' unless defined(&_BITS_UIO_H);
    require 'sys/types.ph';
    eval 'sub UIO_MAXIOV () {1024;}' unless defined(&UIO_MAXIOV);
}
1;
