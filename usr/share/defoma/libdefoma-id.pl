sub com_id_list_cache {
    usage_and_exit if (@ARGV == 0);

    my $app = shift(@ARGV);

    my @caches = get_files("id-cache.*", $ROOTDIR . "/$app.d");

    foreach my $i (@caches) {
	if ($i eq 'id-cache') {
	    $i = '#DEFAULT#';
	} else {
	    $i =~ s/id-cache\.//;
	}
    }

    printm("Id Cache: " . join(' ', @caches));

    exit 0;
}

sub com_id_common {
    my $com = shift;
    usage_and_exit if (@ARGV < 3);

    my $appcache = shift(@ARGV);
    my $id = shift(@ARGV);
    my $font = shift(@ARGV);

    my $app;
    my $cache;

    if ($appcache =~ /^([^\/]+)\/(.*)/) {
	$app = $1;
	$cache = $2;

	$cache = '' if ($cache eq '#DEFAULT#');
    } else {
	$app = $appcache;
	$cache = '';
    }

    my $obj = defoma_id_open_cache($cache, $app);

    unless ($obj) {
	$cache = '#DEFAULT#' if ($cache eq '');
	printw("id-cache $app/$cache not found.");
	exit ERROR;
    }

    mylock(1);
    init_all();

    if ($com eq 'unset') {
	defoma_id_unset($obj, $id, $font);
    } else {
	defoma_id_set($obj, $id, $font, $com);
    }

    term_all();
    defoma_id_close_cache($obj);
    mylock(0);

    exit 0;
}

sub com_id_alias {
    my $com = shift;
    usage_and_exit if ($com eq 'add-alias' && @ARGV < 4);
    usage_and_exit if ($com eq 'remove-alias' && @ARGV < 3);

    my $appcache = shift(@ARGV);
    my $id = shift(@ARGV);
    my $font = shift(@ARGV);
    my $alias = shift(@ARGV);

    my $app;
    my $cache;

    if ($appcache =~ /^([^\/]+)\/(.*)/) {
	$app = $1;
	$cache = $2;

	$cache = '' if ($cache eq '#DEFAULT#');
    } else {
	$app = $appcache;
	$cache = '';
    }

    my $obj = defoma_id_open_cache($cache, $app);

    unless ($obj) {
	$cache = '#DEFAULT#' if ($cache eq '');
	printw("id-cache $app/$cache not found.");
	exit ERROR;
    }

    unless (exists($obj->{hash01}->{$id . ' ' . $font})) {
	printw("id/font $id/$font not found.");
	exit ERROR;
    }

    my $i = $obj->{hash01}->{$id . ' ' . $font};

    if ($com eq 'add-alias') {
	my $pri = $obj->{3}->[$i];
	my $ctg = $obj->{4}->[$i];
    
	mylock(1);
	init_all();
	
    	defoma_id_register($obj, type => 'useralias', id => $alias,
			   font => $font, priority => $pri,
			   category => $ctg, origin => $id);
    } else {
	if ($obj->{2}->[$i] !~ /^Ua/) {
	    printw("id $id is not user-defined alias.");
	    exit ERROR;
	}

	mylock(1);
	init_all();
	
	defoma_id_unregister($obj, type => 'useralias', id => $id,
			     font => $font);
    }

    term_all();
    defoma_id_close_cache($obj);
    mylock(0);

    exit 0;
}

sub main {
    my $command = shift;
    
    if ($command eq 'list-cache') {
	com_id_list_cache();
    } elsif ($command eq 'install' || $command eq 'exclude') {
	com_id_common($command);
    } elsif ($command eq 'unset') {
	com_id_common('unset');
    } elsif ($command eq 'add-alias' || $command eq 'remove-alias') {
	com_id_alias($command);
    }
}

1;
