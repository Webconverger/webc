# Scalar::Util.pm
#
# Copyright (c) 1997-2007 Graham Barr <gbarr@pobox.com>. All rights reserved.
# This program is free software; you can redistribute it and/or
# modify it under the same terms as Perl itself.

package Scalar::Util;

use strict;
use vars qw(@ISA @EXPORT_OK $VERSION @EXPORT_FAIL);
require Exporter;
require List::Util; # List::Util loads the XS

@ISA       = qw(Exporter);
@EXPORT_OK = qw(blessed dualvar reftype weaken isweak tainted readonly openhandle refaddr isvstring looks_like_number set_prototype);
$VERSION    = "1.23";
$VERSION   = eval $VERSION;

unless (defined &dualvar) {
  # Load Pure Perl version if XS not loaded
  require Scalar::Util::PP;
  Scalar::Util::PP->import;
  push @EXPORT_FAIL, qw(weaken isweak dualvar isvstring set_prototype);
}

sub export_fail {
  if (grep { /dualvar/ } @EXPORT_FAIL) { # no XS loaded
    my $pat = join("|", @EXPORT_FAIL);
    if (my ($err) = grep { /^($pat)$/ } @_ ) {
      require Carp;
      Carp::croak("$err is only available with the XS version of Scalar::Util");
    }
  }

  if (grep { /^(weaken|isweak)$/ } @_ ) {
    require Carp;
    Carp::croak("Weak references are not implemented in the version of perl");
  }

  if (grep { /^(isvstring)$/ } @_ ) {
    require Carp;
    Carp::croak("Vstrings are not implemented in the version of perl");
  }

  @_;
}

sub openhandle ($) {
  my $fh = shift;
  my $rt = reftype($fh) || '';

  return defined(fileno($fh)) ? $fh : undef
    if $rt eq 'IO';

  if (reftype(\$fh) eq 'GLOB') { # handle  openhandle(*DATA)
    $fh = \(my $tmp=$fh);
  }
  elsif ($rt ne 'GLOB') {
    return undef;
  }

  (tied(*$fh) or defined(fileno($fh)))
    ? $fh : undef;
}

1;

__END__

