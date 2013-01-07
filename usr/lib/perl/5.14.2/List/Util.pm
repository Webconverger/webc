# List::Util.pm
#
# Copyright (c) 1997-2009 Graham Barr <gbarr@pobox.com>. All rights reserved.
# This program is free software; you can redistribute it and/or
# modify it under the same terms as Perl itself.
#
# This module is normally only loaded if the XS module is not available

package List::Util;

use strict;
use vars qw(@ISA @EXPORT_OK $VERSION $XS_VERSION $TESTING_PERL_ONLY);
require Exporter;

@ISA        = qw(Exporter);
@EXPORT_OK  = qw(first min max minstr maxstr reduce sum shuffle);
$VERSION    = "1.23";
$XS_VERSION = $VERSION;
$VERSION    = eval $VERSION;

eval {
  # PERL_DL_NONLAZY must be false, or any errors in loading will just
  # cause the perl code to be tested
  local $ENV{PERL_DL_NONLAZY} = 0 if $ENV{PERL_DL_NONLAZY};
  eval {
    require XSLoader;
    XSLoader::load('List::Util', $XS_VERSION);
    1;
  } or do {
    require DynaLoader;
    local @ISA = qw(DynaLoader);
    bootstrap List::Util $XS_VERSION;
  };
} unless $TESTING_PERL_ONLY;

if (!defined &sum) {
  require List::Util::PP;
  List::Util::PP->import;
}

1;

__END__

