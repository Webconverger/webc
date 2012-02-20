my @GENERALFAMILY_LIST;
my @WEIGHT_LIST;
my @SHAPE_LIST;

$DIALOGTITLE = '';
$DWIDTH = 70;
$SUFFIXPATH = '';

$result = 0;

my %PARSEHINTS;
my %F2G = ();
my $NOQUESTION = 0;

sub parse_all_hints_conf {
    my $key = shift;
    my $listptr = shift;

    $PARSEHINTS{$key} = $listptr;
}

sub parse_all_hints_init {
    @GENERALFAMILY_LIST = ('Roman', 'SansSerif', 'Typewriter', 'Symbol',
			 'Gothic', 'Mincho');
    @WEIGHT_LIST = ('Medium', 'Bold', 'Semibold', 'Light', 'Semilight');
    @SHAPE_LIST = ('Serif', 'NoSerif', 'Upright', 'Oblique', 'Italic',
		   'Condensed', 'Expanded');
    %PARSEHINTS = ();

    parse_all_hints_conf('GeneralFamily', \@GENERALFAMILY_LIST);
    parse_all_hints_conf('Weight', \@WEIGHT_LIST);
    parse_all_hints_conf('Shape', \@SHAPE_LIST);
}

sub parse_all_hints {
    my @hints = ();

    foreach my $c (keys(%Debian::Defoma::Font::Fobjs)) {
	foreach my $f (defoma_font_get_fonts($c)) {
	    my @h = defoma_font_get_hints($c, $f);
	    next unless (@h);
	    while ($h[0] !~ /^--/) {
		shift(@h);
	    }
	    push(@hints, @h);
	}
    }

    my $h = parse_hints_start(@hints);

    foreach my $k (keys(%PARSEHINTS)) {
	my $listptr = $PARSEHINTS{$k};
	my %kso = ();

	foreach my $i (@{$listptr}) {
	    $kso{$i} = undef;
	}

	foreach my $i (split(' ', $h->{$k})) {
	    push(@{$listptr}, $i) unless (exists($kso{$i}));
	    $kso{$i} = undef;
	}
    }
}

sub fileselector {
    my $text = shift;
    my $origdir = `/bin/pwd`;
    chomp($origdir);
    my $file;
    my $retfile = '';

    my $dtitle = $DIALOGTITLE;
    $DIALOGTITLE = 'File Selector';

    while (1) {
	my $dir=`/bin/pwd`;
	chomp($dir);

	my @dirs = ();
	my @files = ();
	my @list;

	opendir(DIR, '.');
	@list = readdir(DIR);
	closedir(DIR);

	foreach $file (@list) {
	    next if ($file eq '.');
	    
	    if (-d $file) {
		push(@dirs, "$file/");
	    } else {
		push(@files, $file);
	    }
	}

	@files = sort { $a cmp $b } (@files);
	@dirs = sort { $a cmp $b } (@dirs);
	
	my $ddir = $dir;
	my $len = length($ddir);
	if ($len > 60) {
	    $len -= 60;
	    $ddir =~ s/^.{$len}//;
	}

	my $desc = "$text\\n\\nDir: $ddir";
	$file = menu_single($desc, 10, '', @dirs, @files);
	$file =~ s@/$@@;

	last if ($result != 0);

	if (-d $file) {
	    chdir $file;
	} else {
	    $retfile = "$dir/$file";
	    last;
	}
    }

    $DIALOGTITLE = $dtitle;
    chdir $origdir;

    return $retfile;
}

sub msgbox_q {
    unless ($NOQUESTION) {
	msgbox(@_);
    }
}

sub input_checklist_q {
    if ($NOQUESTION) {
	return $_[1];
    } else {
	return input_checklist(@_);
    }
}

sub input_menu_q {
    if ($NOQUESTION) {
	return $_[1] if ($_[1] ne '');
	return $_[6] if (@_ >= 7);
	return '';
    } else {
	return input_menu(@_);
    }
}

sub input_fontname {
    my $default = shift;
    my $text = <<EOF
Input the FontName of the font.
* FontName should be and must be a font-specific identifier. For example,
* a font of FooBar family, Bold weight and Italic shape should have
* FooBar-BoldItalic as the FontName.
EOF
    ;

    return input_menu_q($text, $default, '[^ \t]', 0);
}

sub input_family {
    my $font = shift;
    my $default = shift;
    my $text = <<EOF
Input the Family of $font.
* Family of the font is similar to a family name of a person. A font
* often has some decorated derivative fonts, but all of the derivative
* fonts and its original font share a common name. Family is exactly
* the shared common name. For example, Times-Roman has three decorated
* versions, Times-Italic, Times-Bold and Times-BoldItalic, and Family
* of them is Times.
EOF
    ;

    return input_menu_q($text, $default, '[^ \t]', 0);
}

sub input_generalfamily {
    my $font = shift;
    my $family = shift;
    my $text = <<EOF
Choose the GeneralFamily of $font.
* GeneralFamily represents the rough group which the font belongs to.
* This hint is useful for substitution of fonts, because fonts which
* belong to the same GeneralFamily are supposed to have more similar
* font faces than those which do not.
Following is a list of standard General Families (Roman, SansSerif,
Typewriter, Symbol, Gothic, and Mincho) and already registered General
Families. Please choose GeneralFamily from the list, or None if you
want to input a new GeneralFamily manually.
EOF
    ;

    my $default = exists($F2G{$family}) ? $F2G{$family} : '';

    my $ret = input_menu_q('Input the GeneralFamily of the font manually.',
			 $default, '[^ \t]', 0, '<None>', $text,
			 @GENERALFAMILY_LIST, '<None>');
    if ($result == 0) {
	$F2G{$family} = $ret;
    }

    return $ret;
}

sub input_weight {
    my $font = shift;
    my $default = shift;
    my $menutext = <<EOF
Choose the Weight of $font.
* Weight represends the heaviness of the appearance, or the thickness
* of lines of glyphs, of the font.
Following is a list of standard Weights (Medium, Bold, Semibold, Light,
and Semilight) and already registered Weights. Please choose Weight from
the list, or None if you want to input a new Weight manually.
EOF
    ;

    return input_menu_q('Input the Weight of the font manually.', $default,
		      '[^ \t]', 0, '<None>', $menutext, @WEIGHT_LIST,
		      '<None>');
}

sub input_width {
    my $font = shift;
    my $default = shift;
    my $menutext = <<EOF
Choose the Width of $font.
* Width specifies whether the width of glyphs of the font varies, or is
* fixed. Typewriter fonts are maybe famous fixed width fonts. Most Latin
* fonts are variable width ones. Kanji fonts are also regarded as fixed
* width.
EOF
    ;

    return input_menu_q('', $default, '', 0, '', $menutext, 'Variable', 'Fixed');
}

sub input_shape {
    my $font = shift;
    my $default = shift;
    my @dlist = split(' ', $default);
    my $slant = '';
    my $serif = '';
    my $width = '';
    my $ret;

    for (my $i = 0; $i < @dlist; $i++) {
	$slant = $dlist[$i] if ($dlist[$i] =~ /^(Upright|Italic|Oblique)$/);
	$width = $dlist[$i] if ($dlist[$i] =~ /^(Condensed|Expanded)$/);
	$serif = $dlist[$i] if ($dlist[$i] =~ /^(Serif|NoSerif)$/);
    }

    $width = 'Normal' if ($width eq '');
    $slant = 'Upright' if ($slant eq '');

    my $text = <<EOF
Choose the Shapes of $font.
* Shape represents additional information about the appearance of glyphs
* of the font. This Hint category consists of several types of font faces,
* including Serif, Slant, and the extent of Width. The last one, Width
* hint here is absolutely different from Fixed/Variable Width hint, which
* is supposed to be already chosen.
Following is a list of candidates of hints about Shape of the font. Mark
the hints applicable to the font, by Space key.
EOF
    ;
    $text =~ s/\n/\\n/gm;

    my @hlist;
    unless ($NOQUESTION) {
	$ret = checklist_single_onargs($text, 9, "$width $slant $serif",
				       @SHAPE_LIST);
	
	@hlist = split(/\n/, $ret);
    } else {
	@hlist = split(' ', "$width $slant $serif");
    }
	
    $slant = '';
    $width = '';
    $serif = '';
    
    for ($i = 0; $i < @hlist; $i++) {
	if ($hlist[$i] =~ /^(Upright|Oblique|Italic)$/) {
	    if ($slant eq '') {
		$slant = $hlist[$i];
	    } elsif ($slant =~ /^(Oblique|Italic)$/ &&
		     $hlist[$i] =~ /^(Oblique|Italic)$/) {
		$slant = 'Italic';
	    } else {
		$text = "$slant and $hlist[$i] confclicts. ";
		$text .= "Which is correct?";
		$slant = menu_single($text, 2, '', $slant, $hlist[$i]);
	    }
	    $hlist[$i] = '';
	}
	if ($hlist[$i] =~ /^(Expanded|Condensed)$/) {
	    if ($width eq '') {
		$width = $hlist[$i];
	    } else {
		$text = "$width and $hlist[$i] confclicts.";
		$text .= "Which is correct?";
		$width = menu_single($text, 2, '', $width, $hlist[$i]);
	    }
	    $hlist[$i] = '';
	}
	if ($hlist[$i] =~ /^(Serif|NoSerif)$/) {
	    if ($serif eq '') {
		$serif = $hlist[$i];
	    } else {
		$text = "$serif and $hlist[$i] conflict.";
		$text .= "Which is correct?";
		$serif = menu_single($text, 2, '', $serif, $hlist[$i]);
	    }
	    $hlist[$i] = '';
	}
    }

    $default = join(' ', @hlist, $serif, $slant, $width);
    $default =~ s/\s+/ /g;
    
    return input_menu_q('Add the Shapes of the font.', $default, '.', 1);
}

sub input_alias {
    my $font = shift;
    my $default = shift;
    my $text = <<EOF
Input the Alias(es) of $font, if exists. 
* Alias represents other FontName(s) of a font. Specifying them will
* make the font accessible by the alias(es).
You can specify more than one aliases by separating them by space.
EOF
    ;

    return input_menu_q($text, $default, '[^ \t]', 1);
}

sub input_priority {
    my $font = shift;
    my $default = shift;
    my $text = <<EOF
Input the Priority of $font between 0 and 99.
* Priority is used when more than one fonts provide the same identifier
* in ID cache. The font which has the largest Priority of them will 
* actually get installed.
EOF
    ;

    return input_menu_q($text, $default, '[0-9]', 0);
}

sub input_xlfd {
    my $font = shift;
    my $text = <<EOF
Input the X-FontName of $font.
* X-FontName specifies the XLFD(s) of the font in case if it is used
* in X. Defoma does not touch the configuration of X so X-FontName
* does not affect the actual XLFD(s) of the font, but is worth setting
* for applications which want to know available XLFDs with their
* detailed hints.
You can set more than one XLFDs by separating them by space. If XLFD 
contains spaces, replace them with underscore(_).
EOF
    ;

    return input_menu_q($text, '', '.', 1);
}

sub input_afm {
    my $font = shift;
    my $dir = shift;
    my $text = <<EOF
Select the AFM file of $font.
* AFM file represents font metrics in ascii format. It is used
* for typesetting.
Select Cancel if AFM file is missing.
EOF
    ;

    return '' if $NOQUESTION;

    my $odir = `/bin/pwd`;
    chomp($odir);
    
    chdir($dir) if (defined($dir));

    my $ret = fileselector($text);

    chdir($odir);
    
    return '' if ($result == 1);
    return $ret unless ($result);

    return;
}

sub lhints2hints {
    my $lhints = shift;
    my @list = split(' ', $lhints);
    my $i;
    my $line;
    my @lines;
    
    my $flag = 0;
    foreach $i (@list) {
	if ($i =~ /^--/) {
	    $i =~ s/^--//;

	    push(@lines, $line) if ($flag);
	    $line = "  $i";
	    $flag = 1;
	} elsif ($flag) {
	    $line .=  ($flag > 1) ? ' ' : ' = ';
	    $line .= $i;
	    $flag = 2;
	}
    }
    push(@lines, $line) if ($flag);

    return @lines;
}

sub hint_beginlib {
    $DIALOGTITLE = shift;
    $DWIDTH = shift;
    my $mode = shift;
    $SUFFIXPATH = shift || '';
    $NOQUESTION = shift;
    
    parse_all_hints_init();
    parse_all_hints();

    

    if ($ENV{'DISPLAY'} && -f "$LIBDIR/libgtk.pl" && $mode ne 'c') {
	require("$LIBDIR/libgtk.pl");
	if ($@) {
	    require("$LIBDIR/libconsole.pl");
	}
    } else {
	require("$LIBDIR/libconsole.pl");
    }

    
}

1;
