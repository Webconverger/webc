package overload;

our $VERSION = '1.13';

sub nil {}

sub OVERLOAD {
  $package = shift;
  my %arg = @_;
  my ($sub, $fb);
  $ {$package . "::OVERLOAD"}{dummy}++; # Register with magic by touching.
  $fb = ${$package . "::()"}; # preserve old fallback value RT#68196
  *{$package . "::()"} = \&nil; # Make it findable via fetchmethod.
  for (keys %arg) {
    if ($_ eq 'fallback') {
      $fb = $arg{$_};
    } else {
      $sub = $arg{$_};
      if (not ref $sub and $sub !~ /::/) {
	$ {$package . "::(" . $_} = $sub;
	$sub = \&nil;
      }
      #print STDERR "Setting `$ {'package'}::\cO$_' to \\&`$sub'.\n";
      *{$package . "::(" . $_} = \&{ $sub };
    }
  }
  ${$package . "::()"} = $fb; # Make it findable too (fallback only).
}

sub import {
  $package = (caller())[0];
  # *{$package . "::OVERLOAD"} = \&OVERLOAD;
  shift;
  $package->overload::OVERLOAD(@_);
}

sub unimport {
  $package = (caller())[0];
  ${$package . "::OVERLOAD"}{dummy}++; # Upgrade the table
  shift;
  for (@_) {
    if ($_ eq 'fallback') {
      undef $ {$package . "::()"};
    } else {
      delete $ {$package . "::"}{"(" . $_};
    }
  }
}

sub Overloaded {
  my $package = shift;
  $package = ref $package if ref $package;
  $package->can('()');
}

sub ov_method {
  my $globref = shift;
  return undef unless $globref;
  my $sub = \&{*$globref};
  require Scalar::Util;
  return $sub
    if Scalar::Util::refaddr($sub) != Scalar::Util::refaddr(\&nil);
  return shift->can($ {*$globref});
}

sub OverloadedStringify {
  my $package = shift;
  $package = ref $package if ref $package;
  #$package->can('(""')
  ov_method mycan($package, '(""'), $package
    or ov_method mycan($package, '(0+'), $package
    or ov_method mycan($package, '(bool'), $package
    or ov_method mycan($package, '(nomethod'), $package;
}

sub Method {
  my $package = shift;
  if(ref $package) {
    local $@;
    local $!;
    require Scalar::Util;
    $package = Scalar::Util::blessed($package);
    return undef if !defined $package;
  }
  #my $meth = $package->can('(' . shift);
  ov_method mycan($package, '(' . shift), $package;
  #return $meth if $meth ne \&nil;
  #return $ {*{$meth}};
}

sub AddrRef {
  my $package = ref $_[0];
  return "$_[0]" unless $package;

  local $@;
  local $!;
  require Scalar::Util;
  my $class = Scalar::Util::blessed($_[0]);
  my $class_prefix = defined($class) ? "$class=" : "";
  my $type = Scalar::Util::reftype($_[0]);
  my $addr = Scalar::Util::refaddr($_[0]);
  return sprintf("%s%s(0x%x)", $class_prefix, $type, $addr);
}

*StrVal = *AddrRef;

sub mycan {				# Real can would leave stubs.
  my ($package, $meth) = @_;

  local $@;
  local $!;
  require mro;

  my $mro = mro::get_linear_isa($package);
  foreach my $p (@$mro) {
    my $fqmeth = $p . q{::} . $meth;
    return \*{$fqmeth} if defined &{$fqmeth};
  }

  return undef;
}

%constants = (
	      'integer'	  =>  0x1000, # HINT_NEW_INTEGER
	      'float'	  =>  0x2000, # HINT_NEW_FLOAT
	      'binary'	  =>  0x4000, # HINT_NEW_BINARY
	      'q'	  =>  0x8000, # HINT_NEW_STRING
	      'qr'	  => 0x10000, # HINT_NEW_RE
	     );

%ops = ( with_assign	  => "+ - * / % ** << >> x .",
	 assign		  => "+= -= *= /= %= **= <<= >>= x= .=",
	 num_comparison	  => "< <= >  >= == !=",
	 '3way_comparison'=> "<=> cmp",
	 str_comparison	  => "lt le gt ge eq ne",
	 binary		  => '& &= | |= ^ ^=',
	 unary		  => "neg ! ~",
	 mutators	  => '++ --',
	 func		  => "atan2 cos sin exp abs log sqrt int",
	 conversion	  => 'bool "" 0+ qr',
	 iterators	  => '<>',
         filetest         => "-X",
	 dereferencing	  => '${} @{} %{} &{} *{}',
	 matching	  => '~~',
	 special	  => 'nomethod fallback =');

use warnings::register;
sub constant {
  # Arguments: what, sub
  while (@_) {
    if (@_ == 1) {
        warnings::warnif ("Odd number of arguments for overload::constant");
        last;
    }
    elsif (!exists $constants {$_ [0]}) {
        warnings::warnif ("`$_[0]' is not an overloadable type");
    }
    elsif (!ref $_ [1] || "$_[1]" !~ /(^|=)CODE\(0x[0-9a-f]+\)$/) {
        # Can't use C<ref $_[1] eq "CODE"> above as code references can be
        # blessed, and C<ref> would return the package the ref is blessed into.
        if (warnings::enabled) {
            $_ [1] = "undef" unless defined $_ [1];
            warnings::warn ("`$_[1]' is not a code reference");
        }
    }
    else {
        $^H{$_[0]} = $_[1];
        $^H |= $constants{$_[0]};
    }
    shift, shift;
  }
}

sub remove_constant {
  # Arguments: what, sub
  while (@_) {
    delete $^H{$_[0]};
    $^H &= ~ $constants{$_[0]};
    shift, shift;
  }
}

1;

__END__

