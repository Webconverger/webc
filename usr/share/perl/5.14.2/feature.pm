package feature;

our $VERSION = '1.20';

# (feature name) => (internal name, used in %^H)
my %feature = (
    switch          => 'feature_switch',
    say             => "feature_say",
    state           => "feature_state",
    unicode_strings => "feature_unicode",
);

# This gets set (for now) in $^H as well as in %^H,
# for runtime speed of the uc/lc/ucfirst/lcfirst functions.
# See HINT_UNI_8_BIT in perl.h.
our $hint_uni8bit = 0x00000800;

# NB. the latest bundle must be loaded by the -E switch (see toke.c)

my %feature_bundle = (
    "5.10" => [qw(switch say state)],
    "5.11" => [qw(switch say state unicode_strings)],
    "5.12" => [qw(switch say state unicode_strings)],
    "5.13" => [qw(switch say state unicode_strings)],
    "5.14" => [qw(switch say state unicode_strings)],
);

# special case
$feature_bundle{"5.9.5"} = $feature_bundle{"5.10"};

# TODO:
# - think about versioned features (use feature switch => 2)

sub import {
    my $class = shift;
    if (@_ == 0) {
	croak("No features specified");
    }
    while (@_) {
	my $name = shift(@_);
	if (substr($name, 0, 1) eq ":") {
	    my $v = substr($name, 1);
	    if (!exists $feature_bundle{$v}) {
		$v =~ s/^([0-9]+)\.([0-9]+).[0-9]+$/$1.$2/;
		if (!exists $feature_bundle{$v}) {
		    unknown_feature_bundle(substr($name, 1));
		}
	    }
	    unshift @_, @{$feature_bundle{$v}};
	    next;
	}
	if (!exists $feature{$name}) {
	    unknown_feature($name);
	}
	$^H{$feature{$name}} = 1;
        $^H |= $hint_uni8bit if $name eq 'unicode_strings';
    }
}

sub unimport {
    my $class = shift;

    # A bare C<no feature> should disable *all* features
    if (!@_) {
	delete @^H{ values(%feature) };
        $^H &= ~ $hint_uni8bit;
	return;
    }

    while (@_) {
	my $name = shift;
	if (substr($name, 0, 1) eq ":") {
	    my $v = substr($name, 1);
	    if (!exists $feature_bundle{$v}) {
		$v =~ s/^([0-9]+)\.([0-9]+).[0-9]+$/$1.$2/;
		if (!exists $feature_bundle{$v}) {
		    unknown_feature_bundle(substr($name, 1));
		}
	    }
	    unshift @_, @{$feature_bundle{$v}};
	    next;
	}
	if (!exists($feature{$name})) {
	    unknown_feature($name);
	}
	else {
	    delete $^H{$feature{$name}};
            $^H &= ~ $hint_uni8bit if $name eq 'unicode_strings';
	}
    }
}

sub unknown_feature {
    my $feature = shift;
    croak(sprintf('Feature "%s" is not supported by Perl %vd',
	    $feature, $^V));
}

sub unknown_feature_bundle {
    my $feature = shift;
    croak(sprintf('Feature bundle "%s" is not supported by Perl %vd',
	    $feature, $^V));
}

sub croak {
    require Carp;
    Carp::croak(@_);
}

1;
