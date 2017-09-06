require '_h2ph_pre.ph';

no warnings qw(redefine misc);

unless(defined(&_XLOCALE_H)) {
    eval 'sub _XLOCALE_H () {1;}' unless defined(&_XLOCALE_H);
}
1;
