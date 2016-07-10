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
use FileHandle;

BEGIN {
    use Exporter ();
    our @ISA = qw(Exporter);
    our @EXPORT_OK = qw(version_cmp image_stem image_list read_kernelimg_conf);
}

sub version_split {
    # Split into numbers and non-numeric strings, but break the non-
    # numeric strings at hyphens
    my $version = shift;
    return $version =~ /(?:\d+|-?[^-\d]*)/g;
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

sub image_stem {
    return $image_stem;
}

sub image_list {
    my @results;
    my $prefix = "/boot/$image_stem-";

    for (glob("$prefix*")) {
	push @results, [substr($_, length($prefix)), $_];
    }
    return @results;
}

sub read_kernelimg_conf {
    my $conf_loc = shift || '/etc/kernel-img.conf';
    my @bool_param = qw(do_symlinks link_in_boot no_symlinks);
    my @path_param = qw(image_dest);
    # These are still set in the jessie installer even though they
    # have no effect.  Ignore them quietly.
    my @quiet_param = qw(do_bootloader do_initrd);
    # These are used only by kernel-package, and are not relevant to
    # anything that linux-base does.  Ignore them quietly.
    push @quiet_param, qw(clobber_modules force_build_link
                          relink_build_link relink_src_link
                          silent_modules warn_reboot);

    # Initialise configuration to defaults
    my $conf = {
	do_symlinks =>		1,
	image_dest =>		'/',
	link_in_boot =>		0,
	no_symlinks =>		0,
    };

    if (my $fh = new FileHandle($conf_loc, 'r')) {
	while (<$fh>) {
	    # Delete line endings, comments and blank lines
	    chomp;
	    s/\#.*$//g;
	    next if /^\s*$/;

	    # Historically this was done by matching against one
	    # (path) or two (bool) regexps per parameter, with no
	    # attempt to ensure that each line matched one.  We now
	    # warn about syntax errors, but for backward compatibility
	    # we never treat them as fatal.

	    # Parse into name = value
	    if (!/^\s*(\w+)\s*=\s*(.*)/) {
		print STDERR "$conf_loc:$.: W: ignoring line with syntax error\n";
		next;
	    }
	    my ($name, $value) = (lc($1), $2);

	    # Parse value according to expected type
	    if (grep({$_ eq $name} @bool_param)) {
		if ($value =~ /^(?:no|false|0)\s*$/i) {
		    $conf->{$name} = 0;
		} elsif ($value =~ /^(?:yes|true|1)\s*$/i) {
		    $conf->{$name} = 1;
		} else {
		    print STDERR "$conf_loc:$.: W: ignoring invalid value for $name\n";
		}
	    } elsif (grep({$_ eq $name} @path_param)) {
		# Only one space-separated word is supported
		$value =~ /^(\S*)(.*)/;
		($conf->{$name}, my $excess) = ($1, $2);
		if ($excess =~ /\S/) {
		    print STDERR "$conf_loc:$.: W: ignoring excess values for $name\n";
		}
	    } elsif (grep({$_ eq $name} @quiet_param)) {
		;
	    } else {
		print STDERR "$conf_loc:$.: W: ignoring unknown parameter $name\n";
	    }
	}
	$fh->close();
    }

    # This is still set (to 0) by default in jessie so we should only
    # warn if the default is changed
    if ($conf->{no_symlinks}) {
	print STDERR "$conf_loc: W: ignoring no_symlinks; only symlinks are supported\n";
    }
    delete $conf->{no_symlinks};

    if ($conf->{link_in_boot}) {
	$conf->{image_dest} = '/boot';
    }
    delete $conf->{link_in_boot};

    return $conf;
}

1;
