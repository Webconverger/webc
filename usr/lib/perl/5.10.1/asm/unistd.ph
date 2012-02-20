require '_h2ph_pre.ph';

no warnings qw(redefine misc);

if(defined(&__i386__)) {
    require 'asm/unistd_32.ph';
} else {
    require 'asm/unistd_64.ph';
}
1;
