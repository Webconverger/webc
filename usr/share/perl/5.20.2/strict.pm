package strict;

$strict::VERSION = "1.08";

# Verify that we're called correctly so that strictures will work.
unless ( __FILE__ =~ /(^|[\/\\])\Q${\__PACKAGE__}\E\.pmc?$/ ) {
    # Can't use Carp, since Carp uses us!
    my (undef, $f, $l) = caller;
    die("Incorrect use of pragma '${\__PACKAGE__}' at $f line $l.\n");
}

my %bitmask = (
refs => 0x00000002,
subs => 0x00000200,
vars => 0x00000400
);
my %explicit_bitmask = (
refs => 0x00000020,
subs => 0x00000040,
vars => 0x00000080
);

sub bits {
    my $bits = 0;
    my @wrong;
    foreach my $s (@_) {
	if (exists $bitmask{$s}) {
	    $^H |= $explicit_bitmask{$s};
	}
	else { push @wrong, $s };
        $bits |= $bitmask{$s} || 0;
    }
    if (@wrong) {
        require Carp;
        Carp::croak("Unknown 'strict' tag(s) '@wrong'");
    }
    $bits;
}

my @default_bits = qw(refs subs vars);

sub import {
    shift;
    $^H |= bits(@_ ? @_ : @default_bits);
}

sub unimport {
    shift;
    $^H &= ~ bits(@_ ? @_ : @default_bits);
}

1;
__END__

