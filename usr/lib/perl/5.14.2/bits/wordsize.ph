require '_h2ph_pre.ph';

no warnings qw(redefine misc);

unless(defined(&__WORDSIZE)) {
    sub __WORDSIZE () {	32;}
}
1;
