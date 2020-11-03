require '_h2ph_pre.ph';

no warnings qw(redefine misc);

unless(defined(&_STRUCT_TIMESPEC)) {
    eval 'sub _STRUCT_TIMESPEC () {1;}' unless defined(&_STRUCT_TIMESPEC);
    require 'bits/types.ph';
}
1;
