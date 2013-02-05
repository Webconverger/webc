package constant;
use 5.005;
use strict;
use warnings::register;

use vars qw($VERSION %declared);
$VERSION = '1.21';

#=======================================================================

# Some names are evil choices.
my %keywords = map +($_, 1), qw{ BEGIN INIT CHECK END DESTROY AUTOLOAD };
$keywords{UNITCHECK}++ if $] > 5.009;

my %forced_into_main = map +($_, 1),
    qw{ STDIN STDOUT STDERR ARGV ARGVOUT ENV INC SIG };

my %forbidden = (%keywords, %forced_into_main);

my $str_end = $] >= 5.006 ? "\\z" : "\\Z";
my $normal_constant_name = qr/^_?[^\W_0-9]\w*$str_end/;
my $tolerable = qr/^[A-Za-z_]\w*$str_end/;
my $boolean = qr/^[01]?$str_end/;

BEGIN {
    # We'd like to do use constant _CAN_PCS => $] > 5.009002
    # but that's a bit tricky before we load the constant module :-)
    # By doing this, we save 1 run time check for *every* call to import.
    no strict 'refs';
    my $const = $] > 5.009002;
    *_CAN_PCS = sub () {$const};
}

#=======================================================================
# import() - import symbols into user's namespace
#
# What we actually do is define a function in the caller's namespace
# which returns the value. The function we create will normally
# be inlined as a constant, thereby avoiding further sub calling 
# overhead.
#=======================================================================
sub import {
    my $class = shift;
    return unless @_;			# Ignore 'use constant;'
    my $constants;
    my $multiple  = ref $_[0];
    my $pkg = caller;
    my $flush_mro;
    my $symtab;

    if (_CAN_PCS) {
	no strict 'refs';
	$symtab = \%{$pkg . '::'};
    };

    if ( $multiple ) {
	if (ref $_[0] ne 'HASH') {
	    require Carp;
	    Carp::croak("Invalid reference type '".ref(shift)."' not 'HASH'");
	}
	$constants = shift;
    } else {
	unless (defined $_[0]) {
	    require Carp;
	    Carp::croak("Can't use undef as constant name");
	}
	$constants->{+shift} = undef;
    }

    foreach my $name ( keys %$constants ) {
	# Normal constant name
	if ($name =~ $normal_constant_name and !$forbidden{$name}) {
	    # Everything is okay

	# Name forced into main, but we're not in main. Fatal.
	} elsif ($forced_into_main{$name} and $pkg ne 'main') {
	    require Carp;
	    Carp::croak("Constant name '$name' is forced into main::");

	# Starts with double underscore. Fatal.
	} elsif ($name =~ /^__/) {
	    require Carp;
	    Carp::croak("Constant name '$name' begins with '__'");

	# Maybe the name is tolerable
	} elsif ($name =~ $tolerable) {
	    # Then we'll warn only if you've asked for warnings
	    if (warnings::enabled()) {
		if ($keywords{$name}) {
		    warnings::warn("Constant name '$name' is a Perl keyword");
		} elsif ($forced_into_main{$name}) {
		    warnings::warn("Constant name '$name' is " .
			"forced into package main::");
		}
	    }

	# Looks like a boolean
	# use constant FRED == fred;
	} elsif ($name =~ $boolean) {
            require Carp;
	    if (@_) {
		Carp::croak("Constant name '$name' is invalid");
	    } else {
		Carp::croak("Constant name looks like boolean value");
	    }

	} else {
	   # Must have bad characters
            require Carp;
	    Carp::croak("Constant name '$name' has invalid characters");
	}

	{
	    no strict 'refs';
	    my $full_name = "${pkg}::$name";
	    $declared{$full_name}++;
	    if ($multiple || @_ == 1) {
		my $scalar = $multiple ? $constants->{$name} : $_[0];

		# Work around perl bug #xxxxx: Sub names (actually glob
		# names in general) ignore the UTF8 flag. So we have to
		# turn it off to get the "right" symbol table entry.
		utf8::is_utf8 $name and utf8::encode $name;

		# The constant serves to optimise this entire block out on
		# 5.8 and earlier.
		if (_CAN_PCS && $symtab && !exists $symtab->{$name}) {
		    # No typeglob yet, so we can use a reference as space-
		    # efficient proxy for a constant subroutine
		    # The check in Perl_ck_rvconst knows that inlinable
		    # constants from cv_const_sv are read only. So we have to:
		    Internals::SvREADONLY($scalar, 1);
		    $symtab->{$name} = \$scalar;
		    ++$flush_mro;
		} else {
		    *$full_name = sub () { $scalar };
		}
	    } elsif (@_) {
		my @list = @_;
		*$full_name = sub () { @list };
	    } else {
		*$full_name = sub () { };
	    }
	}
    }
    # Flush the cache exactly once if we make any direct symbol table changes.
    mro::method_changed_in($pkg) if _CAN_PCS && $flush_mro;
}

1;

__END__

