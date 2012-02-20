package Exporter;

require 5.006;

# Be lean.
#use strict;
#no strict 'refs';

our $Debug = 0;
our $ExportLevel = 0;
our $Verbose ||= 0;
our $VERSION = '5.63';
our (%Cache);

# Carp 1.05+ does this now for us, but we may be running with an old Carp
$Carp::Internal{Exporter}++;

sub as_heavy {
  require Exporter::Heavy;
  # Unfortunately, this does not work if the caller is aliased as *name = \&foo
  # Thus the need to create a lot of identical subroutines
  my $c = (caller(1))[3];
  $c =~ s/.*:://;
  \&{"Exporter::Heavy::heavy_$c"};
}

sub export {
  goto &{as_heavy()};
}

sub import {
  my $pkg = shift;
  my $callpkg = caller($ExportLevel);

  if ($pkg eq "Exporter" and @_ and $_[0] eq "import") {
    *{$callpkg."::import"} = \&import;
    return;
  }

  # We *need* to treat @{"$pkg\::EXPORT_FAIL"} since Carp uses it :-(
  my($exports, $fail) = (\@{"$pkg\::EXPORT"}, \@{"$pkg\::EXPORT_FAIL"});
  return export $pkg, $callpkg, @_
    if $Verbose or $Debug or @$fail > 1;
  my $export_cache = ($Cache{$pkg} ||= {});
  my $args = @_ or @_ = @$exports;

  local $_;
  if ($args and not %$export_cache) {
    s/^&//, $export_cache->{$_} = 1
      foreach (@$exports, @{"$pkg\::EXPORT_OK"});
  }
  my $heavy;
  # Try very hard not to use {} and hence have to  enter scope on the foreach
  # We bomb out of the loop with last as soon as heavy is set.
  if ($args or $fail) {
    ($heavy = (/\W/ or $args and not exists $export_cache->{$_}
               or @$fail and $_ eq $fail->[0])) and last
                 foreach (@_);
  } else {
    ($heavy = /\W/) and last
      foreach (@_);
  }
  return export $pkg, $callpkg, ($args ? @_ : ()) if $heavy;
  local $SIG{__WARN__} = 
	sub {require Carp; &Carp::carp};
  # shortcut for the common case of no type character
  *{"$callpkg\::$_"} = \&{"$pkg\::$_"} foreach @_;
}

# Default methods

sub export_fail {
    my $self = shift;
    @_;
}

# Unfortunately, caller(1)[3] "does not work" if the caller is aliased as
# *name = \&foo.  Thus the need to create a lot of identical subroutines
# Otherwise we could have aliased them to export().

sub export_to_level {
  goto &{as_heavy()};
}

sub export_tags {
  goto &{as_heavy()};
}

sub export_ok_tags {
  goto &{as_heavy()};
}

sub require_version {
  goto &{as_heavy()};
}

1;
__END__

