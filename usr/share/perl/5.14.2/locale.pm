package locale;

our $VERSION = '1.00';

$locale::hint_bits = 0x4;

sub import {
    $^H |= $locale::hint_bits;
}

sub unimport {
    $^H &= ~$locale::hint_bits;
}

1;
