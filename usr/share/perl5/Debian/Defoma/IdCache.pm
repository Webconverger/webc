package Debian::Defoma::IdCache;
use strict;
use POSIX;
use FileHandle;

my %TYPE = ( 'Sr' => 'real', 'SrI' => 'real',
	     'Sa' => 'alias', 'SaI' => 'alias',
	     'Ua' => 'alias', 'UaI' => 'alias',
	     'SS' => 'subst', 'SSI' => 'subst',
	     'Mu' => 'mark', 'Mx' => 'mark', 'MX' => 'mark' );

sub new {
    my $class = shift;

    my $o = {
	0 => [],
	1 => [],
	2 => [],
	3 => [],
	4 => [],
	5 => [],
	6 => [],
	7 => [],
	real => {},
	alias => {},
	mark => {},
	subst => {},
	installed => {},
	deleted => [],
	g0 => {},
	g1 => {},
	hash01 => {},
	hash01_mark => {},
	hash0_installed => {},
	hash5 => {},
	hash6 => {},
	file => shift,
	cnt => 0,
	pkg => shift,
	suffix => shift,
	unregistering => {},
	delay => 0,
	callback => 1
    };

    $o->{e_id} = $o->{0};
    $o->{e_font} = $o->{1};
    $o->{e_type} = $o->{2};
    $o->{e_priority} = $o->{3};
    $o->{e_category} = $o->{4};
    $o->{e_depid} = $o->{5};
    $o->{e_depfont} = $o->{6};
    $o->{e_hints} = $o->{7};

    $o->{g0}->{real} = {};
    $o->{g0}->{alias} = {};
    $o->{g0}->{subst} = {};
    $o->{g0}->{mark} = {};

    $o->{g1}->{real} = {};
    $o->{g1}->{alias} = {};
    $o->{g1}->{subst} = {};
    $o->{g1}->{mark} = {};
    $o->{g1}->{installed} = {};

    bless $o;
    return $o;
}

sub hash_add_install {
    my ($o, $i, $k0, $k1) = @_;

    $o->{installed}->{$i} = undef;
    $o->{hash0_installed}->{$k0} = $i;

    unless (exists($o->{g1}->{installed}->{$k1})) {
	$o->{g1}->{installed}->{$k1} = {};
    }
    $o->{g1}->{installed}->{$k1}->{$i} = undef;
}

sub hash_add {
    my ($o, $i, $k0, $k1, $k2, $k5, $k6) = @_;

    my $type = $TYPE{$k2};

    unless (exists($o->{g0}->{real}->{$k0})) {
	$o->{g0}->{real}->{$k0} = {};
	$o->{g0}->{alias}->{$k0} = {};
	$o->{g0}->{subst}->{$k0} = {};
	$o->{g0}->{mark}->{$k0} = {};
    }
    unless (exists($o->{g1}->{real}->{$k1})) {
	$o->{g1}->{real}->{$k1} = {};
	$o->{g1}->{alias}->{$k1} = {};
	$o->{g1}->{subst}->{$k1} = {};
	$o->{g1}->{mark}->{$k1} = {};
    }
    unless ($k5 eq '.') {
	unless (exists($o->{hash5}->{$k5})) {
	    $o->{hash5}->{$k5} = {};
	}
	$o->{hash5}->{$k5}->{$i} = undef;
    }
    unless ($k6 eq '.') {
	unless (exists($o->{hash6}->{$k6})) {
	    $o->{hash6}->{$k6} = {};
	}
	$o->{hash6}->{$k6}->{$i} = undef;
    }
    
    $o->{g0}->{$type}->{$k0}->{$i} = undef;
    $o->{g1}->{$type}->{$k1}->{$i} = undef;
    
    if ($k2 =~ /..I$/) {
	$o->hash_add_install($i, $k0, $k1, $k2);
    }
	    
    if ($type ne 'mark') {
	$o->{$type}->{$i} = undef;
	
	$o->{hash01}->{$k0.' '.$k1} = $i;
    } else {
	$o->{mark}->{$i} = undef;
	
	$o->{hash01_mark}->{$k0.' '.$k1} = $i;
    }
}

sub hash_remove_install {
    my ($o, $i, $k0, $k1) = @_;

    delete($o->{installed}->{$i});
    delete($o->{hash0_installed}->{$k0});

    delete($o->{g1}->{installed}->{$k1}->{$i});
}

sub hash_remove {
    my ($o, $i) = @_;
    my $k0 = $o->{0}->[$i];
    my $k1 = $o->{1}->[$i];
    my $k2 = $o->{2}->[$i];
    my $k5 = $o->{5}->[$i];
    my $k6 = $o->{6}->[$i];

    my $type = $TYPE{$k2};

    delete($o->{g0}->{$type}->{$k0}->{$i});
    delete($o->{g1}->{$type}->{$k1}->{$i});
    delete($o->{hash5}->{$k5}->{$i}) unless ($k5 eq '.');
    delete($o->{hash6}->{$k6}->{$i}) unless ($k6 eq '.');
    
    if ($k2 =~ /..I$/) {
	$o->hash_remove_install($i, $k0, $k1);
    }
	    
    if ($type ne 'mark') {
	delete($o->{$type}->{$i});
	delete($o->{hash01}->{$k0.' '.$k1});
    } else {
	delete($o->{mark}->{$i});
	delete($o->{hash01_mark}->{$k0.' '.$k1});
    }
}

sub read {
    my $o = shift;

    my $file = $o->{file};
    my $i = 0;
    my $j;
    my $type;

    my $fh = new FileHandle($o->{file}, "r");
    if (defined($fh)) {
	while(<$fh>) {
	    chomp($_);
	    my @list = split(' ', $_);
	    my ($k0, $k1, $k2, $k5, $k6);

	    # code to keep backword compatibility.
	    if ($list[2] eq 'Ir' || $list[2] eq 'Ia' || $list[2] eq 'IS') {
		if (exists($o->{hash01}->{$list[0].' '.$list[1]})) {
		    $j = $o->{hash01}->{$list[0].' '.$list[1]};

		    $o->{2}->[$j] .= 'I';

		    $o->hash_add_install($j, $list[0], $list[1]);
		}

		next;
	    }

	    # fallback for the code above.
	    if ($list[2] =~ /^M.I$/) {
		next;
	    }

	    # fallback for broken id-cache.
	    next if (@list < 7);
	    
	    $o->{0}->[$i] = $k0 = shift(@list);
	    $o->{1}->[$i] = $k1 = shift(@list);
	    $o->{2}->[$i] = $k2 = shift(@list);
	    $o->{3}->[$i] = shift(@list);
	    $o->{4}->[$i] = shift(@list);
	    $o->{5}->[$i] = $k5 = shift(@list);
	    $o->{6}->[$i] = $k6 = shift(@list);
	    $o->{7}->[$i] = (@list > 0) ? join(' ', @list) : '';

	    $o->hash_add($i, $k0, $k1, $k2, $k5, $k6);

	    $i++;
	}
	$fh->close();
    }
    $o->{cnt} = $i;

    return 0;
}

sub write {
    my $o = shift;

    my $file = $o->{file};
    my $max = $o->{cnt};
    my ($i, $j);

    my $fh = new FileHandle($o->{file}, "w");
    if (defined($fh)) {
	for ($i = 0; $i < $max; $i++) {
	    $j = $o->{0}->[$i];
	    if ($j ne '') {
		$fh->print($j, ' ', $o->{1}->[$i], ' ', $o->{2}->[$i], ' ',
			   $o->{3}->[$i], ' ', $o->{4}->[$i], ' ',
			   $o->{5}->[$i], ' ', $o->{6}->[$i], ' ',
			   $o->{7}->[$i], "\n");
	    }
	}
	$fh->close();
    }
    unlink($file) unless(-s $file);

    return 0;
}

sub grep {
    my $o = shift;
    my $t = shift;
    my %op = @_;
    my @pat = ();
    my @idx = ();
    my ($i, $j, $k, $ii, $max, $or, $match, $pmax);
    my @nul = ();
    my @lines = ();
    my @ret = ();
    my $gflag = 0;

    $or = 0;
    $pmax = 0;
    foreach $i (keys(%op)) {
	if ($i eq 'or') {
	    $or = 1;
	} elsif ($i =~ /(.)(.)/) {
	    $ii = $2;
	    $ii += 8 if ($1 eq 'r');
	    $j = $op{$i};

	    if ($ii <= 1) {
		my $gn = 'g'.$ii;
		$gflag = 1;
		
		if ($t eq 'font') {
		    if (exists($o->{$gn}->{real}->{$j})) {

			@lines = (keys(%{$o->{$gn}->{real}->{$j}}),
				  keys(%{$o->{$gn}->{alias}->{$j}}),
				  keys(%{$o->{$gn}->{subst}->{$j}}));
		    } else {
			return @nul;
		    }
		} else {
		    if (exists($o->{$gn}->{$t}->{$j})) {
			@lines = keys(%{$o->{$gn}->{$t}->{$j}});
		    } else {
			return @nul;
		    }
		}
	    } else {
		$idx[$pmax] = $ii;
		$pat[$pmax] = $j;
		
		$pmax++;
	    }
	}
    }

    if ($gflag == 0) {
	if ($t eq 'font') {
	    @lines = (keys(%{$o->{real}}), keys(%{$o->{alias}}),
		      keys(%{$o->{subst}}));
	} else {
	    @lines = keys(%{$o->{$t}});
	}
    }

    if ($pmax == 0) {
	return @lines;
    }
    
    foreach $i (@lines) {
	next unless ($o->{0}->[$i]);
	
	$match = 1;
	for ($j = 0; $j < $pmax; $j++) {
	    $match = 0;
	    $ii = $idx[$j];
	    if ($ii >= 8) {
		$ii -= 8;
		$match = 1 if ($o->{$ii}->[$i] =~ /$pat[$j]/);
	    } else {
		$match = 1 if ($o->{$ii}->[$i] eq $pat[$j]);
	    }
	    
	    if ($or) {
		last if ($match);
	    } else {
		last if ($match == 0);
	    }
	}
	
	push(@ret, $i) if ($match);
    }
    
    return @ret;
}

sub add {
    my $o = shift;
    my $j = 0;
    my $i;

    if (@{$o->{deleted}} > 0) {
	$i = pop(@{$o->{deleted}});
    } else {
	$i = $o->{cnt};
	$o->{cnt}++;
    }

    $o->hash_add($i, $_[0], $_[1], $_[2], $_[5], $_[6]);
    
    my $font = shift;
    for ($j = 1; $j < 8; $j++) {
	$o->{$j}->[$i] = shift;
    }
    $o->{0}->[$i] = $font;

    return $i;
}

sub delete {
    my $o = shift;

    foreach my $i (@_) {
	$o->hash_remove($i);
	
	$o->{0}->[$i] = '';
	push(@{$o->{deleted}}, $i);
    }

    return 0;
}

sub install {
    my $o = shift;
    my $i = shift;

    $o->{2}->[$i] .= 'I';

    $o->hash_add_install($i, $o->{0}->[$i], $o->{1}->[$i]);
}

sub uninstall {
    my $o = shift;
    my $i = shift;

    $o->{2}->[$i] =~ s/I$//;

    $o->hash_remove_install($i, $o->{0}->[$i], $o->{1}->[$i]);
}

1;
