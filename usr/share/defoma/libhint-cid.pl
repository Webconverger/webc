sub sethint_cid {
    my $font = shift;
    my $flag = 0;
    my $line;
    my $fontname = '';
    my $cidregistry = '';
    my $cidordering = '';
    my $cidsupplement = '';
    my $family;
    my $generalfamily;
    my $weight;
    my $width;
    my $shape;
    my $slant;
    my $serif;
    my $swidth;
    my $text;

    my $fontfilename = $font;
    $fontfilename =~ s/^(.*)\/(.*)$/$2/;
    my $fontdir = $1;
    
    open(F, $font) || exitfunc(1, "$font: Unable to open.");
    
    while (<F>) {
	$line = $_;
	chomp($line);
	
	if ($line =~ /\/CIDFontName[ \t]/) {
	    $fontname = $line;
	    $fontname =~ s/.*\/CIDFontName[ \t]+\/([^ \t]+).*/$1/;
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

	if ($fontname ne '' && $cidordering ne '' && $cidregistry ne '' &&
	    $cidsupplement ne '') {
	    last;
	}
    }

    close F;

    if ($fontname eq '' || $cidordering eq '' || $cidregistry eq '') {
	exitfunc(1, "Some information aren't found in $fontfilename.\nAborting..");
    }

    $family = $fontname;
    $family =~ s/([^-]+).*/$1/;

    $weight = 'Medium';
    $weight = 'Semibold' if ($fontname =~ /Semibold/);
    $weight = 'Semibold' if ($fontname =~ /Demi/);
    $weight = 'Bold' if ($fontname =~ /Bold/);
    $weight = 'Light' if ($fontname =~ /Light/);

    $width = 'Variable';

    $slant = 'Upright';
    $slant = 'Italic' if ($fontname =~ /Italic/);
    $slant = 'Oblique' if ($fontname =~ /Oblique/);

    $swidth = '';
    $swidth = 'Expanded' if ($fontname =~ /Expanded/);
    $swidth = 'Condensed' if ($fontname =~ /Condensed/);
    $swidth = 'Condensed' if ($fontname =~ /Narrow/);

    $serif = '';
    $serif = 'Serif';

    $family = input_family($fontname, $family);
    return if ($result != 0);

    $generalfamily = input_generalfamily($fontname, $family);
    return if ($result != 0);
    $serif = 'NoSerif' if ($generalfamily eq 'SansSerif');
    $width = 'Fixed' if ($generalfamily eq 'Typewriter');

    $weight = input_weight($fontname, $weight);
    return if ($result != 0);

    $width = input_width($fontname, $width);
    return if ($result != 0);

    $shape = input_shape($fontname, "$slant $serif $swidth");
    return if ($result != 0);

    my $alias = input_alias($fontname, '');
    return if ($result != 0);

    my $priority = input_priority($fontname, 20);
    return if ($result != 0);

    my $afm = $font;
    $afm =~ s/\.cid$//;
    $afm .= ".afm";
    unless (-f $afm) {
	$afm = input_afm($fontname, $afm);
    } else {
	$afm = "$SUFFIXPATH" . $afm;
    }
    
    my $hints = "--FontName $fontname";
    $hints .= " --CIDRegistry $cidregistry";
    $hints .= " --CIDOrdering $cidordering";
    $hints .= " --CIDSupplement $cidsupplement" if ($cidsupplement =~ /\S/);

    $hints .= " --Family $family";
    $hints .= " --GeneralFamily $generalfamily" if ($generalfamily =~ /\S/);
    $hints .= " --Weight $weight" if ($weight =~ /\S/);
    $hints .= " --Width $width" if ($width =~ /\S/);
    $hints .= " --Shape $shape" if ($shape =~ /\S/);
    $hints .= " --Alias $alias" if ($alias =~ /\S/);
    $hints .= " --Priority $priority";
    $hints .= " --AFM $afm" if ($afm =~ /\S/);
    
    $hints =~ s/\s+/ /g;

    return $hints;
}

1;    

    
