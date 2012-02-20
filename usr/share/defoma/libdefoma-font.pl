sub hintfile_convert_hints {
    my @ret = ();

    while (@_ > 0) {
	my $line = shift(@_);
	while ($line =~ /\\$/ && @_ > 0) {
	    $line =~ s/\\$/ /;
	    $line .= shift(@_);
	}

	if ($line =~ /^[ \t]*([^= \t]+)[ \t]*=[ \t]*(.*)[ \t]*$/) {
	    my $hinttype = $1;
	    my @hints = split(/[ \t]+/, $2);

	    push(@ret, "--$hinttype");
	    push(@ret, @hints) if (@hints > 0);
	} elsif ($line =~ /^[ \t]*([^= \t]+)[ \t]*$/) {
	    my $hinttype = $1;
	    push(@ret, "--$hinttype");
	}
    }

    return @ret;
}

sub hintfile_read {
    my $hintfile = shift;

    my @file = readfile($hintfile);
    unless (@file) {
	printm("$hintfile: Unable to open, or empty.");
	return undef;
    }

    my @hints = ();
    my $font = '';
    my @l_font = ();
    my @l_hints = ();
    my @l_category = ();
    my $lnum = 0;
    my $category = '';
    
    while (@file) {
	my $line = shift(@file);
	$lnum++;
	next if ($line =~ /^\#/);
	
	if ($line =~ /^begin[ \t]+([^ \t]+)/) {
	    if ($category eq '') {
		printe("$hintfile: syntax error in line $lnum. ",
		       "'begin' before 'category'.");
		return undef;
	    }
	    
	    if ($font ne '') {
		printe("$hintfile: syntax error in line $lnum. ",
		       "Another 'begin' between 'begin' .. 'end'.");
		return undef;
	    }

	    $font = $1;
	    @hints = ();

	    foreach my $lfont (@l_font) {
		if ($font eq $lfont) {
		    printw("$hintfile: Serious warning in line $lnum. ",
			   "Duplicated font definition.");
		    last;
		}
	    }
	} elsif ($line =~ /^end[ \t]*$/) {
	    if ($font eq '') {
		printe("$hintfile: syntax error in line $lnum. ",
		       "'end' without 'begin'.");
		return undef;
	    } else {
		my @lhints = hintfile_convert_hints(@hints);
		my $lhintstr = (@lhints > 0) ? join(' ', @lhints) : '';

		push(@l_font, $font);
		push(@l_hints, $lhintstr);
		push(@l_category, $category);

		$font = '';
		@hints = ();
	    }
	} elsif ($line =~ /^category[ \t]+([^ \t]+)/) {
	    $category = $1;
	} elsif ($line =~ /^obsolete[ \t]+([^ \t]+)/) {
	    if ($font ne '') {
		printe("$hintfile: syntax error in line $lnum. ",
		       "'obsolete' between 'begin' .. 'end'.");
		return undef;
	    }

	    push(@l_font, $1);
	    push(@l_hints, '');
	    push(@l_category, 'obsoleted');
	} elsif ($font ne '') {
	    push(@hints, $line);
	}
    }

    my $hashptr = {};
    
    my $cnt = @l_font;
    
    for (my $i = 0; $i < $cnt; $i++) {
	$hashptr->{$l_font[$i]} = {};
	$hashptr->{$l_font[$i]}->{category} = $l_category[$i];
	$hashptr->{$l_font[$i]}->{hints} = $l_hints[$i];
    }

    return $hashptr;
}



sub com_register {
    usage_and_exit if (@ARGV < 2);

    mylock(1);
    init_all();
    
    my $ret = defoma_font_register(@ARGV);
    $ret = $ret ? ERROR : 0;
    
    term_all();
    mylock(0);
    exit $ret;
}

sub com_unregister {
    usage_and_exit if (@ARGV < 2);
	
    mylock(1);
    init_all();
    
    my $ret = defoma_font_unregister(@ARGV);
    
    term_all();
    mylock(0);
    exit $ret;
}

sub com_reregister {
    usage_and_exit if (@ARGV < 2);

    mylock(1);
    init_all();
    
    my $ret = defoma_font_reregister(@ARGV);
    
    term_all();
    mylock(0);
    exit $ret;
}

sub com_purge {
    $Debian::Defoma::Id::Purge = 1;
    com_unregister();
}

sub com_all {
    my $funcptr = shift;
    my $hintfile = shift;
    my $onefont = shift; # for <command>-one

    mylock(1);
    init_all();
    
    my $hashptr = hintfile_read($hintfile);

    unless (defined($hashptr)) {
	term_all();
	mylock(0);
	exit ERROR;
    }

    if (defined($onefont) && ! exists($hashptr->{$onefont})) {
	term_all();
	mylock(0);
	printw("$onefont isn't defined in $hintfile.");
	exit ERROR;
    }

    my ($i, $max, $category);
    my @hints;
    my $ret = 0;
    
    foreach my $font (keys(%{$hashptr})) {
	next if (defined($onefont) && $font ne $onefont);
	
	@hints = split(' ', $hashptr->{$font}->{hints});
	$category = $hashptr->{$font}->{category};

	$ret += &{$funcptr}($category, $font, @hints);
    }
    
    $ret = $ret ? ERROR : 0;

    term_all();
    mylock(0);
    exit $ret;
}

sub com_register_all {
    usage_and_exit if (@ARGV == 0);
    com_all(\&defoma_font_register, shift(@ARGV));
}

sub com_unregister_all {
    usage_and_exit if (@ARGV == 0);
    com_all(\&defoma_font_unregister, shift(@ARGV));
}

sub com_reregister_all {
    usage_and_exit if (@ARGV == 0);
    com_all(\&defoma_font_reregister, shift(@ARGV));
}

sub com_purge_all {
    $Debian::Defoma::Id::Purge = 1;
    com_unregister_all();
}

sub com_register_one {
    usage_and_exit if (@ARGV < 2);
    com_all(\&defoma_font_register, @ARGV);
}

sub com_unregister_one {
    usage_and_exit if (@ARGV < 2);
    com_all(\&defoma_font_unregister, @ARGV);
}

sub com_reregister_one {
    usage_and_exit if (@ARGV < 2);
    com_all(\&defoma_font_reregister, @ARGV);
}

sub com_purge_one {
    $Debian::Defoma::Id::Purge = 1;
    com_unregister_one();
}

sub main {
    my $command = shift;
    
    my %fonthash = ( 'register' => \&com_register,
		     'unregister' => \&com_unregister,
		     'reregister' => \&com_reregister,
		     'purge' => \&com_purge,
		     'register-all' => \&com_register_all,
		     'unregister-all' => \&com_unregister_all,
		     'reregister-all' => \&com_reregister_all,
		     'purge-all' => \&com_purge_all,
		     'register-one' => \&com_register_one,
		     'unregister-one' => \&com_unregister_one,
		     'reregister-one' => \&com_reregister_one,
		     'purge-one' => \&com_purge_one );
    
    if (exists($fonthash{$command})) {
	&{$fonthash{$command}}();
    }
}

1;
