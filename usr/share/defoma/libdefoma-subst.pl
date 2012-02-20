sub com_subst_edit_rule {
    usage_and_exit if (@ARGV == 0);
    my $rulename = shift(@ARGV);

    mylock(1);
    init_all();

    my $sb = defoma_subst_open(rulename => $rulename);

    unless ($sb) {
	printw("Cannot open $rulename");
	term_all();
	mylock(0);
	exit ERROR;
    }

    my $rulefile = $sb->{rulefile};

    unless (-f $rulefile) {
	printw("No rulefile is found for $rulename");
	term_all();
	mylock(0);
	exit ERROR;
    }
    
    my $newfile = `/bin/tempfile`;

    chomp($newfile);
    
    copy($rulefile, $newfile);
    system('/usr/bin/sensible-editor', $newfile);

    my @new = ();
    if (open(F, $newfile)) {
	while (<F>) {
	    chomp($_);
	    push(@new, $_) if ($_ ne '' && $_ !~ /^\#/);
	}

	my ($i, $j);
	my $max = $sb->{rule_cnt};

	for ($i = 0; $i < $max; $i++) {
	    $j = $sb->{rule}->[$i];
	    next if ($j eq '' || $j =~ /^\#/);

	    unless (grep($_ eq $j, @new)) {
		defoma_subst_remove_rule_by_num($sb, $i);
	    }
	}

	foreach $i (@new) {
	    unless (grep($_ eq $i, @{$sb->{rule}})) {
		defoma_subst_add_rule($sb, split(' ', $i));
	    }
	}
    }

    defoma_subst_close($sb);

    term_all();
    copy($newfile, $rulefile);
    unlink($newfile, $newfile.'~');
    mylock(0);

    exit 0;
}

sub com_subst_add_rule {
    usage_and_exit if (@ARGV <= 1);
    my $rulename = shift(@ARGV);

    mylock(1);
    init_all();

    my $sb = defoma_subst_open(rulename => $rulename);

    unless ($sb) {
	printw("Cannot open $rulename");
	term_all();
	mylock(0);
	exit ERROR;
    }

    my $rulefile = $sb->{rulefile};

    unless (-f $rulefile) {
	printw("No rulefile is found for $rulename");
	term_all();
	mylock(0);
	exit ERROR;
    }

    foreach my $i (@ARGV) {
	my @rule = split(/[ \t]+/, $i);
	my $rulestr = join(' ', @rule);
	unless (grep($_ eq $rulestr, @{$sb->{rule}})) {
	    defoma_subst_add_rule($sb, @rule);
	}
    }

    defoma_subst_close($sb);

    term_all();
    mylock(0);

    exit 0;
}

sub com_subst_remove_rule {
    usage_and_exit if (@ARGV <= 1);
    my $rulename = shift(@ARGV);

    mylock(1);
    init_all();

    my $sb = defoma_subst_open(rulename => $rulename);

    unless ($sb) {
	printw("Cannot open $rulename");
	term_all();
	mylock(0);
	exit ERROR;
    }

    my $rulefile = $sb->{rulefile};

    unless (-f $rulefile) {
	printw("No rulefile is found for $rulename");
	term_all();
	mylock(0);
	exit ERROR;
    }

    foreach my $i (@ARGV) {
	my @rule = split(/[ \t]+/, $i);
	defoma_subst_remove_rule($sb, @rule);
    }

    defoma_subst_close($sb);

    term_all();
    mylock(0);

    exit 0;
}

sub com_subst_new_rule {
    usage_and_exit if (@ARGV == 0);
    
    my $rulename = shift(@ARGV);
    my $rulefile = SUBSTRULEDIR . '/' . $rulename . '.subst-rule';

    defoma_subst_newrule($rulefile, $rulename, @ARGV);

    exit 0;
}

sub com_subst_check_rule {
    usage_and_exit if (@ARGV == 0);

    my $rulename = shift(@ARGV);
    my $rulefile = SUBSTRULEDIR . '/' . $rulename . '.subst-rule';

    if (-f $rulefile) {
	exit 0;
    } else {
	exit 1;
    }
}

sub main {
    my $command = shift;
    
    if ($command eq 'new-rule') {
	com_subst_new_rule();
    } elsif ($command eq 'edit-rule') {
	com_subst_edit_rule();
    } elsif ($command eq 'add-rule') {
	com_subst_add_rule();
    } elsif ($command eq 'remove-rule') {
	com_subst_remove_rule();
    } elsif ($command eq 'check-rule') {
	com_subst_check_rule();
    }
}

1;
