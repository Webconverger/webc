package Debian::Defoma::SubstCache;;
use strict;
use POSIX;
use FileHandle;

sub new {
    my $class = shift;

    my $o = {
	rulename => shift,
	cachefile => shift,
	rulefile => shift,
	pkg => shift,
	idsuffix => shift,
	idobject => shift,
	threshold => 30,
	cache => {},
	rule_cnt => 0,
	rule => [],
	rule_hash => [],
	rule_regnum => []
    };

    bless $o;
    return $o;
}

sub read {
    my $o = shift;

    my $i = -1;
    my $fh = new FileHandle($o->{cachefile}, "r");
    if (defined($fh)) {
	while (<$fh>) {
	    chomp($_);
	    my @list = split(/ /, $_);
	    if ($i == -1) {
		$o->{pkg} = shift(@list);
		$o->{idsuffix} = (@list > 0) ? shift(@list) : '';
		$o->{threshold} = shift(@list) if (@list > 0);
	    } else {
		shift(@list) if (@list > 2);

		$o->{cache}->{$list[0].' '.$list[1]} = {};
	    }

	    $i++;
	}
	$fh->close();
    }

    $i = 0;
    $fh = new FileHandle($o->{rulefile}, "r");
    if (defined($fh)) {
	while (<$fh>) {
	    chomp($_);
	    if ($o->{rule}->[$i]) {
		$o->{rule}->[$i] .= $_;
	    } else {
		$o->{rule}->[$i] = $_;
	    }

	    if ($_ =~ /\\$/) {
		$o->{rule}->[$i] =~ s/\\$/ /;
	    } else {
		$i++;
	    }
	}
	$fh->close();

	$i++ if ($o->{rule}->[$i]);
	$o->{rule_cnt} = $i;
    }

    return 0;
}

sub write {
    my $o = shift;
    my ($i, $j, $max);
    my $pkg = $o->{pkg};
    my $suffix = $o->{idsuffix};
    my $threshold = $o->{threshold};
    my @list;

    if ($pkg) {
	my $fh = new FileHandle($o->{cachefile}, "w");
	if (defined($fh)) {
	    $fh->print($pkg, ' ', $suffix, ' ', $threshold, "\n");
	    
	    @list = keys(%{$o->{cache}});
	    
	    foreach $i (@list) {
		$fh->print($i, "\n");
	    }
	    
	    $fh->close();
	}
    }
    unlink($o->{cachefile}) unless (-s $o->{cachefile} && @list > 0);

    my $fh = new FileHandle($o->{rulefile}, "w");
    if (defined($fh)) {
	$max = $o->{rule_cnt};
	for ($i = 0; $i < $max; $i++) {
	    $j = $o->{rule}->[$i];
	    if ($j ne '') {
		$fh->print($j, "\n");
	    }
	}
	$fh->close();
    }
    unlink($o->{rulefile}) unless(-s $o->{rulefile});

    return 0;
}
    
sub grep_rule {
    my $o = shift;
    my $rule = shift;
    my $ruleid = shift;

    my @ret = ();
    my ($i, $j, $max);
    $max = $o->{rule_cnt};
    for ($i = 0; $i < $max; $i++) {
	$j = $o->{rule}->[$i];

	next if ($j =~ /^\#/ || $j eq '');

	if ($rule) {
	    if ($rule eq $j) {
		push(@ret, $i);
	    }
	} else {
	    $j =~ s/ .*$//;
	    if ($ruleid eq $j) {
		push(@ret, $i);
	    }
	}
    }

    return @ret;
}

sub add_cache {
    my $o = shift;
    my $font = shift;
    my $id = shift;
    my $p;

    $o->{cache}->{$font.' '.$id} = $p = {};
    $p->{hash} = shift;
    $p->{priority} = shift;
    $p->{category} = shift;
}

sub add_rule {
    my $o = shift;
    my $rule = shift;
    my $rulehash = shift;
    my $i = $o->{rule_cnt};

    $o->{rule}->[$i] = $rule;
    $o->{rule_hash}->[$i] = $rulehash;

    $o->{rule_cnt}++;
    return $i;
}

sub delete_rule {
    my $o = shift;

    foreach my $i (@_) {
	$o->{rule}->[$i] = '';
	$o->{rule_hash}->[$i] = '';
    }
}

1;
