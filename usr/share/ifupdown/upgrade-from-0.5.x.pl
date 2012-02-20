#!/usr/bin/perl -w

use strict;

my %doneifaces = ();
my @orig = ();   # original interfaces file
my $line;

while($line = <STDIN>) {
	if ($line =~ m/^\s*#/) {
		push @orig, $line;
		next;
	}

	my $tmp;
	while ($line =~ m/\\\n$/ and $tmp = <>) {
		$line .= $tmp;
	}
	push @orig, $line;
}

my $out = "";
my $block = "";
my $auto = "";
for my $x (@orig) {
	my $y = $x;
	$y =~ s/^\s*//s;
	$y =~ s/\\\n//sg;
	$y =~ s/\s*$//s;

	if ($y =~ m/^scheme\b/) {
		print STDERR "Schemes cannot be automatically converted\n";
		exit(1);
	}
	if ($y =~ m/^auto\b/) {
		print STDERR "File seems to already be converted\n";
		exit(1);
	}

	if ($y =~ m/^iface\b/s) {
		$out .= $auto . $block;
		$block = $x;
		if ($y =~ m/^iface\s+(\S+)/s && ! $doneifaces{$1}++ ) {
			$auto = "# automatically added when upgrading\n";
			$auto .= "auto $1\n";
		} else {
			$auto = "";
		}
		next;
	}

	if ($y =~ m/^noauto/) {
		$auto = "";
		my $spaces = $x;
		$spaces =~ s/\S.*$//s;
		$block .= $spaces . "# noauto (removed on upgrade)\n";
		next;
	}

	$block .= $x;
}

$out .= $auto . $block;

print $out;
