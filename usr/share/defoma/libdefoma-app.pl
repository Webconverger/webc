my $ProcessID = $$;
my $Arg0 = $ARG0;

sub com_app {
    usage_and_exit if (@ARGV == 0);

    my $command = shift;
    my $app = shift(@ARGV);
    my $upapp = ($command eq 'update') ? $app : undef;
    my @category = @ARGV;
    my @ocategory = @category;

    arg_check($app) || exit ERROR;

    mylock(1);
    init_all($upapp);

    my $appinfo = &Debian::Defoma::Configure::get_app_info($app);

    unless($appinfo) {
	term_all();
	mylock(0);
	printw("$app: Application not found.");
	exit ERROR;
    }

    my @cs = &Debian::Defoma::Configure::get_app_categories($app);
    @cs = reverse(@cs);
    @category = @cs unless (@category);

    unless (exists($appinfo->{ignore_category})) {
	$appinfo->{ignore_category} = {};
    }
    my $ics = $appinfo->{ignore_category};

    my $clean = 1;
    my $update = 0;
    my $purge = 0;
    my $onlyupdate = 0;
    my $reexec = 0;
    my $ignore = 0;
    my $cleanstr = "Cleaning up";
    
    if ($command eq 'purge') {
	$Debian::Defoma::Id::Purge = 1;
	@category = @cs;
	$purge = 1;
	$cleanstr = "Purging";
    } elsif ($command eq 'update') {
	my $ppid = $ENV{DEFOMA_PREVIOUS_PROCESS_ID} || 0;
	if ($ppid != $ProcessID) {
	    $update = 1;
	    if ($appinfo->{script_change} eq 'updated') {
		$reexec = 1;
	    }
	} else {
	    $onlyupdate = 1;
	    $clean = 0;
	}
    } elsif ($command eq 'ignore') {
	$ignore = 1;
    }

    if ($update) {
	printm("Updating font configuration of $app...");
    } elsif ($clean) {
	printm("$cleanstr font configuration of $app...");
    }

    my $fobjs = \%Debian::Defoma::Font::Fobjs;
    my $fobj;
    my @hints;
    my @list;
    my ($c, $max, $i, $font);

    foreach $c (@cs) {
	next unless ($clean);
	next unless (grep($_ eq $c, @category));
	if (exists($ics->{$c})) {
	    printm("Skipping category $c; it's ignored.");
	    next;
	}

	printm("$cleanstr category $c..");

	next unless (exists($fobjs->{$c}));

	$fobj = $fobjs->{$c};

	@list = keys(%{$fobj->{cache_list}});
	foreach $font (@list) {
	    @hints = split(' ', $fobj->{cache_list}->{$font});

	    printv(" $cleanstr $font...");

	    &Debian::Defoma::Configure::call_1($fobj, $app, 'unregister', $c,
					       $font, @hints);

	    $fobj->remove_failed($font, $app);
	}
    }

    if ($reexec) {
	term_all();
	
	&Debian::Defoma::Configure::remove_script($app);
	$ENV{DEFOMA_PREVIOUS_PROCESS_ID} = $ProcessID;

	mylock(0);
	
	exec($Arg0, ARGS);
    }

    if (($update || $onlyupdate) && @ocategory) {
	my @rics;
	foreach $c (@ocategory) {
	    if (exists($ics->{$c})) {
		delete($ics->{$c});
		push(@rics, $c);
	    }
	}
	if (@rics) {
	    printm("Releasing 'ignore' on following categories: @rics");
	}
    }

    if ($ignore) {
	foreach $c (@category) {
	    $ics->{$c} = undef;
	}
	printm("Setting 'ignore' on following categories: @category");
    }
    
    @cs = reverse(@cs);
    foreach $c (@cs) {
	next unless ($update || $onlyupdate);
	next unless (grep($_ eq $c, @category));
	if (exists($ics->{$c})) {
	    printm("Skipping category $c; it's ignored.");
	    next;
	}
	
	printm("Updating category $c..");
	
	next unless (exists($fobjs->{$c}));
	
	$fobj = $fobjs->{$c};
	
	@list = keys(%{$fobj->{cache_list}});
	foreach $font (@list) {
	    @hints = split(' ', $fobj->{cache_list}->{$font});
	    
	    printv(" Updating $font...");
	    
	    &Debian::Defoma::Configure::call_1($fobj, $app, 'register',
					       $c, $font, @hints);
	}
    }

    if ($purge) {
	&Debian::Defoma::Configure::purge_script($app);
    }
    
    term_all();
    mylock(0);
    exit 0;
}

sub main {
    my $command = shift;

    if ($command =~ /^(clean|update|purge|ignore)$/) {
	com_app($command);
    }
}

1;
