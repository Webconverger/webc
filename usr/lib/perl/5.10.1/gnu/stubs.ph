require '_h2ph_pre.ph';

no warnings qw(redefine misc);

require 'bits/wordsize.ph';
if((defined(&__WORDSIZE) ? &__WORDSIZE : undef) == 32) {
    require 'gnu/stubs-32.ph';
}
 elsif((defined(&__WORDSIZE) ? &__WORDSIZE : undef) == 64) {
    require 'gnu/stubs-64.ph';
} else {
    die("unexpected value for __WORDSIZE macro");
}
1;
