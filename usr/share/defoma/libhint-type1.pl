sub sethint_type1 {
    my $font = shift;
    my $flag = 0;
    my $line;
    my @lines;
    my $fontname = '';
    my $fullname = '';
    my @fullnamelist = ();
    my $family = '';
    my $generalfamily;
    my $weight = '';
    my $width = '';
    my $shape;
    my $slant;
    my $serif = '';
    my $swidth;
    my $text;
    my $encoding = '';
    my $charset;

    my $fontfilename = $font;
    $fontfilename =~ s/^(.*)\/(.*)$/$2/;
    my $fontdir = $1;

    open(F, $font) || exitfunc(1, "$font: Unable to open.");

    LINE: while (<F>) {
	foreach $line (split('\r', $_)) {
	    if ($line =~ /\/FullName[ \t]*\(([^)]+)/) {
		$fullname = $1;
		@fullnamelist = split(' ', $fullname);
	    } elsif ($line =~ /\/FamilyName[ \t]*\(([^)]+)/) {
		$family = $1;
	    } elsif ($line =~ /\/Weight[ \t]*\(([^)]+)/) {
		$weight = $1;
	    } elsif ($line =~ /\/isFixedPitch[ \t]+true[ \t]/) {
		$width = 'Fixed';
	    } elsif ($line =~ /\/isFixedPitch[ \t]+false[ \t]/) {
		$width = 'Variable';
	    } elsif ($line =~ /\/FontName[ \t]*\/([^ \t]+)[ \t]/) {
		$fontname = $1;
	    } elsif ($line =~ /\/Encoding[ \t]+([^ \t]+)[ \t]/) {
		$encoding = $1;
	    }
	    last LINE if ($line =~ /currentdict[ \t]+end/);
	}
    }

    if ($fontname eq '') {
	exitfunc(1, "Some information aren't found in $fontfilename.\nAborting..");
    }

    $fontname =~ s/ /_/g;
    $family =~ s/ /_/g;
    $weight =~ s/ /_/g;

    $slant = 'Upright';
    $swidth = '';
    for (my $i = 0; $i < @fullnamelist; $i++) {
	$slant = 'Italic' if ($fullnamelist[$i] eq 'Italic');
	$slant = 'Oblique' if ($fullnamelist[$i] eq 'Oblique');
	$swidth = 'Condensed' if ($fullnamelist[$i] eq 'Condensed');
	$swidth = 'Expanded' if ($fullnamelist[$i] eq 'Expanded');
    }

    $encoding =~ s/Encoding$//;
    $charset = 'font-specific';
    $charset = 'ISO8859-1' if ($encoding =~ /^(Standard|ISOLatin1)$/);

    msgbox_q("Charset of $fontname is $charset.");

    $family = input_family($fontname, $family);
    return if ($result != 0);

    $generalfamily = input_generalfamily($fontname, $family);
    return if ($result != 0);
    $serif = 'Serif' if ($generalfamily eq 'Roman');
    $serif = 'NoSerif' if ($generalfamily eq 'SansSerif');
    $width = 'Fixed' if ($generalfamily eq 'Typewriter');

    $weight = input_weight($fontname, $weight);
    return if ($result != 0);

    $width = input_width($fontname, $width);
    return if ($result != 0);

    $shape = "$swidth $slant $serif";
    $shape = input_shape($fontname, "$slant $serif $swidth");
    return if ($result != 0);

    my $alias = input_alias($fontname, '');
    return if ($result != 0);

    my $priority = input_priority($fontname, 20);
    return if ($result != 0);

    my $xlfd = input_xlfd($fontname);
    return if ($result != 0);

    my $afm = $font;
    $afm =~ s/\.pf[ab]$//;
    $afm .= ".afm";
    unless (-f $afm) {
	$afm = input_afm($fontname, $afm);
    } else {
	$afm = "$SUFFIXPATH" . $afm;
    }

    my $hints = "--FontName $fontname";
    $hints .= " --Charset $charset";
    $hints .= " --Family $family";
    $hints .= " --GeneralFamily $generalfamily" if ($generalfamily =~ /\S/);
    $hints .= " --Weight $weight" if ($weight =~ /\S/);
    $hints .= " --Width $width" if ($width =~ /\S/);
    $hints .= " --Shape $shape" if ($shape =~ /\S/);
    $hints .= " --Alias $alias" if ($alias =~ /\S/);
    $hints .= " --Priority $priority";
    $hints .= " --X-FontName $xlfd" if ($xlfd =~ /\S/);
    $hints .= " --AFM $afm" if ($afm =~ /\S/);
    
    $hints =~ s/\s+/ /g;

    return $hints;
}

1;
