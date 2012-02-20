package UUID;

require 5.005;
use strict;
#use warnings;

require Exporter;
require DynaLoader;

use vars qw(@ISA %EXPORT_TAGS @EXPORT_OK $VERSION);
@ISA = qw(Exporter DynaLoader);

# This allows declaration       use UUID ':all';
# If you do not need this, moving things directly into @EXPORT or @EXPORT_OK
# will save memory.

%EXPORT_TAGS = ( 'all' => [qw(&generate &parse &unparse)] );

@EXPORT_OK = ( @{$EXPORT_TAGS{'all'}} );

$VERSION = '0.02';

bootstrap UUID $VERSION;

# Preloaded methods go here.

1;
__END__

=head1 NAME

UUID - Perl extension for using UUID interfaces as defined in e2fsprogs.

=head1 SYNOPSIS

  use UUID;
  UUID::generate($uuid); # generates a 128 bit uuid
  UUID::unparse($uuid, $string); # change $uuid to 36 byte string
  $rc = UUID::parse($string, $uuid); # map string to UUID, return -1 on error

=head1 DESCRIPTION

With these 3 routines UUID''s can easily be generated and parsed/un-parsed.

=head2 EXPORT

UUID::{generate, parse, unparse}

=head1 AUTHOR

Peter J. Braam <braam@mountainviewdata.com>

=head1 SEE ALSO

perl(1).

=cut
