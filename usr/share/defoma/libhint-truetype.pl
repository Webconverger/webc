my @ENCODING;
my @ID_LANG;
my %ID_Region;

BEGIN {
    eval ("use Font::FreeType");
    exitfunc(255, "libfont-freetype-perl is needed.") if ($@ ne '');

    @ENCODING = qw(Symbol Unicode ShiftJIS GB2312 BIG5 WanSung Johab);

    @ID_LANG =
	qw(- Arabic Bulgarian Catalan Chinese Czech Danish German
	   Greek English Spanish Finnish French Hebrew Magyar Icelandic
	   Italian Japanese Korean Dutch Norwegian Polish Portuguese -
	   Romania Russian SerboCroatian Slovak Albanian Swedish Thai Turkish
	   ? Indonesian Ukrainian Byelorussian Slovenian Estonian Latvian Lithuanian
	   - Persian Vietnamese Armenian Azerbaijan Basque - Macedonian
	   - - - - - - Afrikaans ?
	   ? Hindi - - - - Malay Kazak
	   - Swahili - Uzbek TarTar Bengali Punjabi -
	   - Tamil - - - - - Sanskrit);
    
    %ID_Region =
	( 'Chinese' => 'Taiwan China HongKong Singapore Macau',
	  'SerboCroatian' => 'Croatian Serb.Roman Serb.Cyrillic',
	  'Azerbaijan' => 'Roman Cyrillic',
	  'Uzbek' => 'Roman Cyrillic',
	  );
}

sub get_standard_charset {
    my $charset = shift;
    my $i;

    open(F, "$DEFOMA_TEST_DIR/etc/defoma/loc-cset.data") || return '';

    while (<F>) {
	my $line = $_;
	chomp($line);
	my @list = split(' ', $line);

	next if (@list < 2);

	$list[0] =~ s/\*/\.\*/g;
	$list[0] =~ s/\?/\./g;

	if ($charset =~ /^($list[0])$/) {
	    close F;
	    return $list[1];
	}
    }

    close F;
    return '';
}

sub freetype_init {
    my $fontpath = shift;
    my $facenum;

    my $Face=Font::FreeType->new->face($fontpath);
    $facenum=$Face->number_of_faces;

    $facenum = 1 if ($facenum == 0);

    return $facenum;
}

sub sethint_truetype {
    my $font = shift;
    my $fontfile = $font;
    $fontfile =~ s/.*\///;
    my $text;

    my $facenum = freetype_init($font);

    if ($facenum > 1) {
	$text = <<EOF
$fontfile is a TrueType Collection, which has multiple faces in a single 
font.  Answer "Yes" if you want to specify hints for every face, otherwise
answer "No" and specify hints only for the first face.  In most cases, each
face has similar look, so only the first face is needed for regular use,
which means "No" is the recommended answer.
$fontfile has $facenum faces.
EOF
    ;
	$facenum = 1 if (yesnobox($text));
    }

    my $hints = ($facenum > 1) ? "--FaceNum $facenum" : '';

    for (my $j = 0; $j < $facenum; $j++) {
	my $fname = ($facenum > 1) ? "$fontfile,face\#$j" : "$fontfile";
	my $cnt;

	my $Face=Font::FreeType->new->face($font, index => $j);
	$cnt = 1; #One name

	my %langs = ();
	my @family_list = $Face->family_name;
	my @subfamily_list = $Face->style_name;
	my @psfontname_list = $Face->postscript_name;
	my @encoding_list = ();
	my @foundry_list = ();

	$text = <<EOF
Choose the Family of $fname.
* Family of the font is similar to a family name of a person. A font
* often has some decorated derivative fonts, but all of the derivative
* fonts and its original font share a common name. Family is exactly
* the shared common name. For example, Times-Roman has three decorated
* versions, Times-Italic, Times-Bold and Times-BoldItalic, and Family
* of them is Times.
EOF
    ;
	my $family;
	my $subfamily = '';
	my $psfontname;

	foreach my $i (@psfontname_list) {
	    $psfontname = $i;
	    $psfontname =~ s/-.*//;

	    push(@family_list, $psfontname) unless (grep($_ eq $psfontname,
							 @family_list));
	}
	
	$family = input_menu_q("Input the Family of $fname manually.", '',
			       '[^ \t]', 0, '<None>', $text, @family_list,
			       '<None>');
	return if ($result != 0);

	if (@subfamily_list > 1) {
	    
	    $text = <<EOF
Choose the Subfamily of $fname.
* Subfamily is just a TrueType-specific information and only used for
* generating standard hints such as Weight and Shape.
EOF
    ;
	    $subfamily = input_menu_q('', '', '', 0, '', $text,
				      @subfamily_list);
	    return if ($result != 0);
	} elsif (@subfamily_list == 1) {
	    $subfamily = $subfamily_list[0];
	    msgbox_q("Subfamily of $fname is $subfamily.");
	} else {
	    $subfamily = '';
	}

	$psfontname = "$family-$subfamily";
	$psfontname =~ s/[^a-zA-Z0-9-]//g;
	push(@psfontname_list, $psfontname) unless(grep($_ eq $psfontname,
							@psfontname_list));

	$text = "the PostScript FontName of $fname";
	$psfontname = input_menu_q("Input $text manually.", $psfontname,
				   '[a-zA-Z0-9-]', 0, '<None>',
				   "Choose $text.", @psfontname_list,
				   '<None>');
	return if ($result != 0);

	my $foundry = '';
	if (@foundry_list > 1) {
	    $foundry = input_menu_q("Input the Foundry of $fname manually.",
				    '', '[^ \t]', 1, '<None>',
				    "Choose the Foundry of $fname.",
				    @foundry_list, '<None>');
	    return if ($result != 0);
	} elsif (@foundry_list == 1) {
	    $foundry = $foundry_list[0];
	    msgbox_q("Foundry of $fname is $foundry.");
	} else {
	    $text = "No Foundry information is found in $fname.\n";
	    $text .= "Please input the Foundry manually.";
	    $foundry = input_menu_q($text, '', '[^ \t]', 1);
	}

	my $encoding;
	if (@encoding_list > 1) {
	    $text = <<EOF
Unfortunately, multiple encodings are registered in the information
record of $fname. It means only one of them is actually used to 
encode the font. Please choose the correct one if you know which is 
correct, otherwise choose Unicode. (In most cases Unicode is the correct 
encoding.)
EOF
    ;
	    $encoding = input_menu_q('', 'Unicode', '', 0, '', $text,
				     @encoding_list);
	    return if ($result != 0);
	} elsif (@encoding_list == 0) {
	    $text = "No encoding information is registered.";
	    $text .= " Assuming that the encoding is Unicode.";
	    msgbox_q($text);
	    $encoding = 'Unicode';
	} else {
	    $encoding = $encoding_list[0];
	}

	my %location = ();
	my $loc = '';

	foreach my $i (keys(%langs)) {
	    my $lang_id = $i & 0xff;
	    my $region_id = ($i & 0xff00) >> 11;
	    
	    if ($lang_id > @ID_LANG || $ID_LANG[$lang_id] =~ /^[\?-]$/) {
		$loc = sprintf("Unknown(0x%02x)", $lang_id);
	    } else {
		$loc = $ID_LANG[$lang_id];
		if (exists($ID_Region{"$loc"})) {
		    my @region = split(' ', $ID_Region{"$loc"});
		
		    $loc .= '-';
		    $loc .= $region[$region_id];
		}
	    }

	    $location{$loc} = 1;
	}

	$text = <<EOF
Mark the Locations of $fname.
* Location represents which language and which region characters of a font
* belongs to. This information is recorded in a TrueType font file in
* number as Language ID, and converted to string as <Language>-<Region> or 
* just <Language> format by this program.
EOF
    ;
	my @list = keys(%location);
	if (@list > 1) {
	    $loc = input_checklist_q('Modify the Locations if necessary.',
				     join(' ', @list), '.', 1, $text, @list);
	    return if ($result != 0);
	} elsif (@list == 1) {
	    $loc = $list[0];
	    msgbox_q("Location of $fname is:\n $loc");
	} else {
	    msgbox_q('No Language ID(used for Location hint) is found.');
	    $loc = '';
	}

	my %charset = ();
	my $cset;
	@list = split(' ', $loc);
	foreach $i (@list) {
	    $cset = get_standard_charset($i);
	    
	    if ($cset eq '') {
		$text = <<EOF
No Standard Charset for $i is found in
/etc/defoma/loc-cset.data. Input it manually, or just press return.
EOF
    ;
		$cset = input_menu_q($text, '', '.', 1, '');
		return if ($result != 0);
	    }

	    $charset{$cset} = undef;
	}

	$cset = join(' ', sort { $a cmp $b } keys(%charset));
	$cset =~ s/,/ /g;

	msgbox_q("Standard Charset of $fname is:\n$cset");

	my $generalfamily = input_generalfamily($fname, $family);
	return if ($result != 0);
	
	my $weight = 'Medium';
	my $slant = 'Upright';
	
	$weight = 'Bold' if ($subfamily =~ /Bold/);
	$weight = 'Light' if ($subfamily =~ /Light/);
	$slant = 'Oblique Italic' if ($subfamily =~ /Italic/);
	$slant = 'Oblique' if ($subfamily =~ /Oblique/);
	
	$subfamily =~ s/^(Bold|Light|Italic|Oblique)$//g;
	$subfamily =~ s/\s+/ /g;
	$subfamily =~ s/^\s+//;
	$subfamily =~ s/\s+$//;

	$weight = input_weight($fname, $weight);
	return if ($result != 0);

	my $width = ($Face->is_fixed_width) ? 'Fixed' : 'Variable';

	my $shape = $slant;
	$shape .= " $subfamily" if ($subfamily ne '');
	$shape = input_shape($fname, $shape);
	return if ($result != 0);

	my $alias = input_alias($fname, '');
	return if ($result != 0);

	my $priority = input_priority($fname, 20);
	return if ($result != 0);

	my $m = ($j > 0) ? $j : '';

	$hints .= " --Family$m $family --FontName$m $psfontname";
	$hints .= " --Encoding$m $encoding";
	
	$hints .= " --Location$m $loc" if ($loc =~ /\S/);
	$hints .= " --Charset$m $cset" if ($cset =~ /\S/);
	$hints .= " --GeneralFamily$m $generalfamily"
	    if ($generalfamily =~ /\S/);
	$hints .= " --Weight$m $weight" if ($weight =~ /\S/);
	$hints .= " --Width$m $width" if ($width =~ /\S/);
	$hints .= " --Shape$m $shape" if ($shape =~ /\S/);
	$hints .= " --Alias$m $alias" if ($alias =~ /\S/);
	$hints .= " --Foundry$m $foundry" if ($foundry =~ /\S/);
	$hints .= " --Priority$m $priority";
    }
    

    return $hints;
}

1;
