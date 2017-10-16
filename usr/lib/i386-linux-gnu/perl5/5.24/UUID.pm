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

%EXPORT_TAGS = (
    'all' => [qw(
        &clear &compare &copy &generate &generate_random &generate_time
        &is_null &parse &unparse &unparse_lower &unparse_upper &uuid
    )],
);

@EXPORT_OK = ( @{$EXPORT_TAGS{'all'}} );

$VERSION = '0.27';

bootstrap UUID $VERSION;

# Preloaded methods go here.

1;
__END__

=head1 NAME

UUID - DCE compatible Universally Unique Identifier library for Perl

=head1 SYNOPSIS

    use UUID 'uuid';

    $string = uuid();   # generate stringified UUID

    UUID::generate($uuid);               # new binary UUID; prefer random
    UUID::generate_random($uuid);        # new binary UUID; use random
    UUID::generate_time($uuid);          # new binary UUID; use time

    UUID::unparse($uuid, $string);       # stringify $uuid; system casing
    UUID::unparse_lower($uuid, $string); # force lowercase stringify
    UUID::unparse_upper($uuid, $string); # force uppercase stringify

    $rc = UUID::parse($string, $uuid);   # map string to UUID; -1 on error

    UUID::copy($dst, $src);              # copy binary UUID from $src to $dst
    UUID::compare($uuid1, $uuid2);       # compare binary UUIDs

    UUID::clear( $uuid );                # set binary UUID to NULL
    UUID::is_null( $uuid );              # compare binary UUID to NULL
    

=head1 DESCRIPTION

The UUID library is used to generate unique identifiers for objects that
may be accessible beyond the local system. For instance, they could be
used to generate unique HTTP cookies across multiple web servers without
communication between the servers, and without fear of a name clash.

The generated UUIDs can be reasonably expected to be unique within a
system, and unique across all systems, and are compatible with those
created by the Open Software Foundation (OSF) Distributed Computing
Environment (DCE) utility uuidgen.

=head1 FUNCTIONS

Most of the UUID functions expose the underlying I<libuuid> C interface
rather directly. That is, many return their values in their parameters
and nothing else.

Not very Perlish, is it? It's been like that for a long time though, so
not very likely to change any time soon.

All take or return UUIDs in either binary or string format. The string
format resembles the following:

    1b4e28ba-2fa1-11d2-883f-0016d3cca427

Or, in terms of printf(3) format:

    "%08x-%04x-%04x-%04x-%012x"

The binary format is simply a packed 16 byte binary value.

=head2 B<generate(> I<$uuid> B<)>

Generates a new binary UUID based on high quality randomness from
I</dev/urandom>, if available.

Alternately, the current time, the local ethernet MAC address (if
available), and random data generated using a pseudo-random generator
are used.

The previous content of I<$uuid>, if any, is lost.

=head2 B<generate_random(> I<$uuid> B<)>

Generates a new binary UUID but forces the use of the all-random
algorithm, even if a high-quality random number generator (i.e.,
I</dev/urandom>) is not available, in which case a pseudo-random
generator is used.

Note that the use of a pseudo-random generator may compromise the
uniqueness of UUIDs generated in this fashion.

=head2 B<generate_time(> I<$uuid> B<)>

Generates a new binary UUID but forces the use of the alternative
algorithm which uses the current time and the local ethernet MAC address
(if available).

This algorithm used to be the default one used to generate UUIDs, but
because of the use of the ethernet MAC address, it can leak information
about when and where the UUID was generated.

This can cause privacy problems in some applications, so the B<generate()>
function only uses this algorithm if a high-quality source of randomness
is not available.

=head2 B<unparse(> I<$uuid>B<,> I<$string> B<)>

Converts the binary UUID in I<$uuid> to string format and returns in
I<$string>. The previous content of I<$string>, if any, is lost.

The case of the hex digits returned may be upper or lower case, and is
dependent on the system-dependent local default.

=head2 B<unparse_lower(> I<$uuid>B<,> I<$string> B<)>

Same as B<unparse()> but I<$string> is forced to lower case.

=head2 B<unparse_upper(> I<$uuid>B<,> I<$string> B<)>

Same as B<unparse()> but I<$string> is forced to upper case.

=head2 B<$rc = parse(> I<$string>B<,> I<$uuid> B<)>

Converts the string format UUID in I<$string> to binary and returns in
I<$uuid>. The previous content of I<$uuid>, if any, is lost.

Returns 0 on success and -1 on failure. Additionally on failure, the
content of I<$uuid> is unchanged.

=head2 B<clear(> I<$uuid> B<)>

Sets I<$uuid> equal to the value of the NULL UUID.

=head2 B<is_null(> I<$uuid> B<)>

Compares the value of I<$uuid> to the NULL UUID.

Returns 1 if NULL, and 0 otherwise.

=head2 B<copy(> I<$dst>B<,> I<$src> B<)>

Copies the binary I<$src> UUID to I<$dst>.

If I<$src> isn't a UUID, I<$dst> is set to the NULL UUID.

=head2 B<compare(> I<$uuid1>B<,> I<$uuid2> B<)>

Compares two binary UUIDs.

Returns an integer less than, equal to, or greater than zero if
I<$uuid1> is less than, equal to, or greater than I<$uuid2>.

However, if either operand is not a UUID, falls back to a simple string
comparison returning similar values.

=head2 B<>I<$string> B<= uuid()>

Creates a new string format UUID and returns it in a more Perlish way.

Functionally the equivalent of calling B<generate()> and then B<unparse()>, but
throwing away the intermediate binary UUID.

=head1 UUID LIBRARY

Note that on some systems external packages will need to be installed
first. Notably, uuid-dev or uuid-devel on Debian and RedHat Linux,
respectively, and their derivatives.

=head1 EXPORTS

None by default. All functions may be imported in the usual manner,
either individually or all at once using the "I<:all>" tag.

=head1 TODO

Need more tests and sanity checks.

=head1 COPYRIGHT AND LICENSE

This software is Copyright (c) 2014-2016 by Rick Myers.

This is free software, licensed under:

  The Artistic License 2.0 (GPL Compatible)

Details of this license can be found within the 'License' text file.

=head1 AUTHOR

Current maintainer:

  Rick Myers <jrm@cpan.org>.

Authors and/or previous maintainers:

  Lukas Zapletal <lzap@cpan.org>

  Joseph N. Hall <joseph.nathan.hall@gmail.com>

  Colin Faber <cfaber@clusterfs.com>

  Peter J. Braam <braam@mountainviewdata.com>

=head1 CONTRIBUTORS

David E. Wheeler

William Faulk

gregor herrmann

Slaven Rezic

=head1 SEE ALSO

B<uuid(3)>, B<uuid_clear(3)>, B<uuid_compare(3)>, B<uuid_copy(3)>,
B<uuid_generate(3)>, B<uuid_is_null(3)>, B<uuid_parse(3)>,
B<uuid_unparse(3)>, B<perl(1)>.

=cut

