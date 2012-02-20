require("/usr/share/defoma/libdefoma-user2.pl");

my $Arg0 = $ARG0;

sub com_reconf {
    mylock(0);

    @ds = get_files("\\.d\$", ROOTDIR);

    foreach my $d (@ds) {
	$d =~ s/\.d$//;
	system("/usr/bin/defoma-app", "-u", OPTIONS, "purge", $d);
    }

    system("/bin/rm", "-r", ROOTDIR);

    exec("/usr/bin/defoma-user", "-u", OPTIONS, "update");

    exit 0;
}

sub user_update_font {
    mylock(1);
    init_all();
    
    term_all();
    mylock(0);
}

sub com_update_font {
    user_update_font();
    exit 0;
}

sub com_update {
    user_update_font();
    user_update();

    exit 0;
}

sub user_update_invoke {
    system("/usr/bin/defoma-app", OPTIONS, @_);
}

sub user_update_message {
    printm(@_);
}

sub user_update_question {
    print @_, "[Y/n] ";
    my $a = <STDIN>;
    chomp($a);

    return 1 if ($a eq 'Y' || $a eq 'y' || $a eq '');
    return 0;
}

sub main {
    my $command = shift;

    unless (USERSPACE) {
	exec($Arg0, "-u", ARGS);
    }

    if ($command eq 'reconfigure') {
	com_reconf();
    } elsif ($command eq 'update') {
	com_update();
    } elsif ($command eq 'update-font') {
	com_update_font();
    }
}
    
1;
