sub sethint_cmap {
    my $font = shift;
    my $line;
    my $flag = 0;
    my $cmapname = '';
    my $cidregistry = '';
    my $cidordering = '';
    my $cidsupplement = '';
    

    my $fontfilename = $font;
    $fontfilename =~ s/.*\/(.*)/$1/;
    
    open(F, $font) || exitfunc(1, "$font: Unable to open.");
    
    while (<F>) {
	$line = $_;
	chomp($line);
	if ($line =~ /\/CMapName[ \t]/) {
	    $cmapname = $line;
	    $cmapname =~ s/.*\/CMapName[ \t]+\/([^ \t]+).*/$1/;
	} elsif ($line =~ /\/CIDSystemInfo[ \t]/) {
	    $flag = 1;
	} elsif ($flag == 1 && $line =~ /end[ \t]+def/) {
	    $flag = 0;
	} elsif ($flag == 1 && $line =~ /\/Registry[ \t]/) {
	    $cidregistry = $line;
	    $cidregistry =~ s/.*\/Registry[ \t]+\((.*)\).*/$1/;
	} elsif ($flag == 1 && $line =~ /\/Ordering[ \t]/) {
	    $cidordering = $line;
	    $cidordering =~ s/.*\/Ordering[ \t]+\((.*)\).*/$1/;
	} elsif ($flag == 1 && $line =~ /\/Supplement[ \t]/) {
	    $cidsupplement = $line;
	    $cidsupplement =~ s/.*\/Supplement[ \t]+(.).*/$1/;
	}
	if ($cmapname ne '' && $cidordering ne '' && $cidregistry ne '' &&
	    $cidsupplement ne '') {
	    last;
	}
    }

    close F;

    if ($cmapname eq '' || $cidordering eq '' || $cidregistry eq '' ||
	$cidsupplement eq '') {
	exitfunc(1, "Some information aren't found in $fontfilename.\nAborting..");
    }

    my $charset = '';
    my $encoding = '';
    
    if (open(F, "$DEFOMA_TEST_DIR/etc/defoma/ps-cset-enc.data")) {
	while (<F>) {
	    $line = $_;
	    chomp($line);

	    next if ($line =~ /^\#/);

	    my @list = split(' ', $line);
	    next if (@list < 3);

	    $list[0] =~ s/\*/\.\*/g;
	    $list[0] =~ s/\?/\./g;

	    $list[1] =~ s/\*/\.\*/g;
	    $list[1] =~ s/\?/\./g;

	    if ("$cidregistry-$cidordering-$cidsupplement" =~ /^($list[0])$/) {
		if ($cmapname =~ /^($list[1])$/) {
		    if ($list[2] ne 'ignore') {
			$charset = $list[2];
			$charset =~ s/,/ /g;
			$encoding = $list[3] if (@list >= 4);
		    }
		    last;
		}
	    }
	}

	close F;
    }

    my $hints = "--CMapName $cmapname";
    $hints .= " --CIDRegistry $cidregistry";
    $hints .= " --CIDOrdering $cidordering";
    $hints .= " --CIDSupplement $cidsupplement";

    $hints .= " --Charset $charset" if ($charset =~ /\S/);
    $hints .= " --Encoding $encoding" if ($encoding =~ /\S/);

    $hints .= " --Direction Horizontal"
	if ($cmapname =~ /\-H$/ || $cmapname eq 'H');
    $hints .= " --Direction Vertical"
	if ($cmapname =~ /\-V$/ || $cmapname eq 'V');

    return $hints;
}

1;

