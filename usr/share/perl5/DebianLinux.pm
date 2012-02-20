# Copyright 2011 Ben Hutchings
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA

package DebianLinux;

use strict;
use warnings;
use POSIX qw(uname);

BEGIN {
    use Exporter ();
    our @ISA = qw(Exporter);
    our @EXPORT_OK = qw(version_cmp image_list);
}

sub version_split {
    # Split into numbers, hyphens with optional non-numeric suffixes
    # (for pre-releases), and strings of any other characters
    my $version = shift;
    return $version =~ /(?:\d+|-\D*|[^-\d]+)/g;
}

sub version_cmp {
    my ($left_ver, $right_ver) = @_;
    my @left_comp = version_split($left_ver);
    my @right_comp = version_split($right_ver);

    for (my $i = 0; ; $i++) {
	my $left = $left_comp[$i];
	my $right = $right_comp[$i];
	# Do the components indicate pre-releases?
	my $left_pre = defined($left) && $left =~ /^-(?:rc|trunk)$/;
	my $right_pre = defined($right) && $right =~ /^-(?:rc|trunk)$/;
	# Are the components numeric?
	my $left_num = defined($left) && $left =~ /^\d+/;
	my $right_num = defined($right) && $right =~ /^\d+/;

	# Pre-releases sort before anything, even end-of-string
	if ($left_pre or $right_pre) {
	    return -1 if !$right_pre;
	    return 1 if !$left_pre;
	}
	# End-of-string sorts before anything else.
	# End-of-string on both sides means equality.
	if (!defined($left) or !defined($right)) {
	    return -1 if defined($right);
	    return defined($left) || 0;
	}
	# Use numeric comparison if both sides numeric.
	# Otherwise use ASCII comparison.
	if ($left_num && $right_num) {
	    return -1 if $left < $right;
	    return 1 if $left > $right;
	} else {
	    # Note that '.' > '-' thus 2.6.x.y > 2.6.x-z for any y, z.
	    return -1 if $left lt $right;
	    return 1 if $left gt $right;
	}
    }
}

# Find kernel image name stem for this architecture
my $image_stem;
if ((uname())[4] =~ /^(?:mips|parisc|powerpc|ppc)/) {
    $image_stem = 'vmlinux';
} else {
    $image_stem = 'vmlinuz';
}

sub image_list {
    my @results;
    my $prefix = "/boot/$image_stem-";

    for (glob("$prefix*")) {
	push @results, [substr($_, length($prefix)), $_];
    }
    return @results;
}

1;
