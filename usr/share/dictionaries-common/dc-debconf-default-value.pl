# ----------------------------------------------------------------------------
# dc-debconf-default-value.pl:
#  Dealing with default value selection. Functions and definitions.
# ----------------------------------------------------------------------------

# Trying to find a reasonable guess for default ispell dictionary and wordlist
# from the debian-installer settings, envvars or pre-policy symlinks and the
# list of ispell dictionaries and wordlists to be installed

my $dcscript     = "/usr/share/dictionaries-common/dc-debconf-select.pl";
my $debug        = "yes" if exists $ENV{'DICT_COMMON_DEBUG'};

# Suffixes for different variants. They must be declared here.
my @suffixes     = ("",
		    "-insane",
		    "-huge",
		    "-large",
		    "-medium",
		    "-small",
		    "-gut");
my %equivs       = ("bg"      => "bulgarian",
		    "ca"      => "catalan",
		    "cs"      => "czech",
		    "da"      => "danish",
		    "de"      => "ngerman",
		    "de:1"    => "ogerman",
		    "de_CH"   => "swiss",
		    "en_US"   => "american",
		    "en_US:1" => "miscfiles",
		    "en_CA"   => "canadian",
		    "en_CA:1" => "american",
		    "en_GB"   => "british",
		    "en_AU"   => "british",
		    "eo"      => "esperanto",
		    "es"      => "spanish",
		    "fi"      => "finnish",
		    "fo"      => "faroese",
		    "fr"      => "french",
		    "ga"      => "irish",
		    "gd"      => "gaelic",
		    "gl"      => "galician-minimos",
		    "gv"      => "manx",
		    "hu"      => "hungarian",
		    "it"      => "italian",
		    "lt"      => "lithuanian",
		    "nb"      => "norwegian->bokma",    # Match bokmal and bokmaal
		    "nl"      => "dutch",
		    "nn"      => "norwegian->nynorsk",
		    "pl"      => "polish",
		    "pt"      => "portuguese",
		    "pt_BR"   => "brazilian",
		    "ru"      => "russian",
		    "sv"      => "swedish",
		    "tl"      => "tagalog",
		    "uk"      => "ukrainian");
my %alternatives   = ("ispell"   => "ispell-dictionary.hash",
		      "wordlist" => "dictionary");

# -------------------------------------------------------------
sub dc_debugprint(){
# -------------------------------------------------------------
# Show info if in debug mode
# -------------------------------------------------------------
  print STDERR "@_" if $debug;
}

# -------------------------------------------------------------
sub dc_set (){
# -------------------------------------------------------------
# Set debconf value unless already set
# -------------------------------------------------------------
  my $guessed   = shift;
  my $question  = $guessed->{'question'};
  my $value     = $guessed->{'guess'};
  my $priority  = $guessed->{'priority'};

  my ($errorcode, $oldvalue) = get($question);

  $oldvalue = "unset" unless $oldvalue;

  if ( $errorcode or $oldvalue eq "unset" ){
    &dc_debugprint(" dict-common::dc_set: $question: errorcode: $errorcode; priority: $priority\n" .
		   "   Old:[$oldvalue] --> New:[$value]\n");
    set("$question","$value");
  } elsif ( $oldvalue eq $value ) {
    print STDERR " dict-common::dc_set: $question is already set to
      [$oldvalue]. Preserving it.\n";
  } else {
    print STDERR " dict-common::dc_set: Warning: $question is already set to
      [$oldvalue].
      Not setting to [$value]\n";
  }

  if ( $debug ){                 # --- Check if question value is actually set
    ($errorcode, $oldvalue) = get($question);
    if ( $errorcode ){
      print STDERR " dict-common::dc_set: $question reading failed with $errorcode\n";
    } elsif ( $oldvalue) {
      print STDERR " dict-common::dc_set: $question is set to [$oldvalue]\n";
    } else {
      print STDERR " dict-common::dc_set: $question value is void, bad thing\n";
    }
  }
}

# -------------------------------------------------------------
sub dc_extractlangname (){
# -------------------------------------------------------------
# Look if a dict matching $langkey in %equivs is to be installed
# and return the preferred language name if so.
# -------------------------------------------------------------
  my $langkey             = shift;
  my $classinfo           = shift;
  my $classprefix         = $classinfo->{'prefix'};
  my $debconf_vals        = $classinfo->{'languages'};
  my $debconf_defaultvals = $classinfo->{'default_langs'};
  my @thevalues           = ();
  my $thestring;
  my $thepackage;
  my $thevariant;
  my $pkgfullname;

  if ( defined $equivs{$langkey} ){
    ($thepackage,$thevariant) = split ("->",$equivs{$langkey});
    foreach my $suffix ( @suffixes ){
      if ( $thepackage eq "miscfiles" ){
	$pkgfullname = "$thepackage$suffix";
      } else {
	$pkgfullname = "$classprefix$thepackage$suffix";
      }
      &dc_debugprint(" dc_extractlangname: Trying package $pkgfullname\n");
      if ( defined $debconf_vals->{"$pkgfullname"} ){
	if ( defined $debconf_defaultvals->{"$pkgfullname"} ){
	  $thestring = $debconf_defaultvals->{"$pkgfullname"};
	} else {
	  $thestring = $debconf_vals->{"$pkgfullname"};
	}
	@thevalues = sort split (/\s*,\s*/,$thestring);
	if ( $thevariant ){
	  @thevalues = grep {/$thevariant/i} @thevalues;
	}
	@thevalues = sort {
	  # Sort tex variants last
	  $a =~ m/tex/i <=> $b =~ m/tex/i
	    || $a cmp $b } @thevalues;
	if ( scalar @thevalues >= 1 ){
	  return "$thevalues[0]";
	} else {
	  return;
	}
      }
    }
  }
}

# -------------------------------------------------------------
sub dc_guesslang (){
# -------------------------------------------------------------
# Try different combinations of $language and $country and possible
# fallbacks in case dc_extractlangname() does not find a good guess
# -------------------------------------------------------------
  my $classinfo   = shift;
  my $language    = shift;
  my $country     = shift;
  my $class       = $classinfo->{'class'};
  my $classprefix = $classinfo->{'prefix'};
  my $msgprefix   = "dc_guesslang";
  my $priority    = "medium";
  my $guessed;

  &dc_debugprint(" $msgprefix: Looking for langkey matches [$class,$classprefix,$language,$country].\n");
  if ( $guessed = &dc_extractlangname("$language" . "_" . uc($country),$classinfo)
       || &dc_extractlangname("$language" . "_" . uc("$country") . ":1",$classinfo)
       || &dc_extractlangname("$language",$classinfo)
       || &dc_extractlangname("$language:1",$classinfo)
    ){
    $priority = "low";
  } else {
    my @sorted_keys = sort {
      # Sort keys matching ^$language_ first
      $b =~ m/^$language(\_|:|$)/ cmp $a =~ m/^$language(\_|:|$)/
	# Then american english
	|| $b =~ m/^en\_US/ cmp $a =~ m/^en\_US/
	# Then any english variant
	|| $b =~ m/^en\_/ cmp $a =~ m/^en\_/
	# Then anything else alphabetically
	|| $a cmp $b
    } keys %equivs;
    &dc_debugprint(" dc_guesslang: Trying an alternative for $class from keys:\n  "
		   . join(', ',@sorted_keys) . "\n");
    foreach ( @sorted_keys ){
      last if ( $guessed = &dc_extractlangname($_, $classinfo) );
    }
  }
  return { 'guess'    => $guessed,
	   'priority' => $priority,
	   'class'    => $class
  } if $guessed;
}

# -------------------------------------------------------------
sub dc_guess_langkey_for_link(){
# -------------------------------------------------------------
# Try guessing langkey after (woody or older) former symlink
# -------------------------------------------------------------
  my $class          = shift;
  my $link           = "/etc/alternatives/$alternatives{$class}";
  my %reverse_equivs = ();
  my $prefix;
  my $guess;
  my $language;

  return unless ( -l $link );

  if ( $guess = readlink($link) ){
    &dc_debugprint("dictionaries-common.config: Found pre-policy link $link->$guess.");

    $guess =~ s/\.hash$//;
    $guess =~ s/^.*\///;
    $guess =~ s/(\-\.)(small|medium|large)$//;
    $guess =~ s/\-english$//;

    $guess = "norwegian->bokma"   if ($guess eq "bokmål");
    $guess = "norwegian->nynorsk" if ($guess eq "nynorsk");
    $guess = "ogerman"            if ($guess eq "german");
    $guess = "miscfiles"          if ($guess eq "web2");
    $guess = "danish"             if ($guess eq "dansk");
    $guess = "french"             if ($guess eq "francais");
    $guess = "swedish"            if ($guess eq "svenska");

    &dc_debugprint("dictionaries-common.config: pre-policy link target fine tuned to $guess.\n");

    # Build reverse equivs
    foreach ( keys %equivs ){
      $reverse_equivs{$equivs{$_}} = $_;
    }

    # Check for a match and return langkey if found
    if ( exists $reverse_equivs{$guess} ){
      return $reverse_equivs{$guess};
    } else {
      &dc_debugprint("dictionaries-common.config: No match found for pre-policy symlink $link.\n");
    }
  }
}

# -------------------------------------------------------------
sub dc_manual_alternative (){
# -------------------------------------------------------------
# Check if woody (or older) alternative exists and is set to manual
# -------------------------------------------------------------
  my $class  = shift;
  my $file   = "/var/lib/dpkg/alternatives/$alternatives{$class}";
  my $status;

  if ( -r $file ){
    open(FILE,"< $file") or return;
    $status = <FILE>;
    close FILE;
    $status = "" unless $status;
    chomp $status;
    return "Manual (previous alternative setting)" if ( $status eq "manual" );
  }
}

# -------------------------------------------------------------
sub dc_parse_classinfo (){
# -------------------------------------------------------------
# Gather info for (to be) installed packages for class
# debconf info:
#   $classinfo->{'languages'}:     pkg -> languages provided by package
#   $classinfo->{'default_langs'}: pkg -> default language for package
# Other info
#   $classinfo->{'class'}:         Class
#   $classinfo->{'classprefix'}:   Class prefix
# -------------------------------------------------------------
  my $class = shift;
  return unless $class;
  my $question = "shared/packages-$class";
  my ($errorcode,$pkgowners) = metaget ($question, "owners");
  return if $errorcode;

  my %debconf_vals = ();
  my %debconf_defaultvals = ();
  my %classprefix = ( 'ispell' => "i", "wordlist" => "w" );

  foreach my $pkg ( split (/\s*,\s*/,$pkgowners) ){
    $debconf_vals{$pkg} = get ("$pkg/languages");
    my ($errorcode,$pkgdefaults) = get ("$pkg/defaults");
    $debconf_defaultvals{$pkg} = $pkgdefaults unless $errorcode;
  }

  return {
    'class'         => $class,
    'prefix'        => $classprefix{$class},
    'languages'     => \%debconf_vals,
    'default_langs' => \%debconf_defaultvals
  } if %debconf_vals;
}

# -----------------------------------------------------------------
sub dc_guess_language_country_strings (){
# -----------------------------------------------------------------
# Try guessing $language $country pairs
# -----------------------------------------------------------------
  my $class       = shift;

  my $di_language = "debian-installer/language";
  my $di_country  = "debian-installer/country";
  my $msgstring   = "dict-common.config->dc_guess_language_country_strings";

  my $language;
  my $country;
  my $errorcode;

  # First check if we are upgrading from ancient pre-policy setup with
  # symlinks set through alternatives and try guessing a langkey
  if ( $language = &dc_guess_langkey_for_link($class) ){
    &dc_debugprint("$msgstring: Guessed langkey $language from ancient pre-policy symlink.\n");
  } else {
    # If system is already installed use /etc/default/locale contents.
    # Otherwise try looking at debian-installer/language
    if ( -e "/etc/default/locale" ){
      $language = $ENV{'LANG'} if exists $ENV{'LANG'};
    }
    if ( $language ){
      &dc_debugprint("$msgstring: LANG=$language is to be used.\n") if $language;
    } else {
      ($errorcode,$language) = get($di_language);
      $language = '' if $errorcode;
      &dc_debugprint("$msgstring: Debconf gives language \"$language\"\n") if $language;
    }
  }

  # Try hard to get a value if nothing was found
  $language = $language ||
    $ENV{'LANG'} ||
    $ENV{'LC_MESSAGES'} ||
    $ENV{'LC_ALL'} ||
    '';

  # Get proper $language $country pairs if $language is available.
  if ( $language ){
    if ( $language eq "C" or $language eq "POSIX" ){
      &dc_debugprint("$msgstring: Using language \"en\" instead of\"$language\"\n");
      $language = "en";
    } else {
      # Deal with de_DE:de_DE@euro:de:en_GB.UTF-8:en like entries
      $language = ( split(":",$language) )[0];
      $language =~ s/[\.@].*$//;                # Remove variant and charset
      ($language,$country) = split("_",$language);
    }
    if ( not $country ){
      ($errorcode,$country) = get($di_country);
      if ( $errorcode or not $country ){
	$country = "unset";
      }
    }

    # Make sure there is no leading/trailing whitespace.
    $language =~ s/^\s+//;
    $language =~ s/\s+$//;
    $country  =~ s/^\s+//;
    $country  =~ s/\s+$//;

  } else {
    &dc_debugprint("$msgstring: No language candidate found. Defaulting to \"en_UNSET\"\n");
    $language = "en";
    $country  = "UNSET";
  }
  return $language, $country;
}

# -----------------------------------------------------------------
sub dc_set_default_value_for_class (){
# -----------------------------------------------------------------
# Try guessing a reasonable default value for given class after
# $language $country pair and set it if found.
# -----------------------------------------------------------------
  my $class       = shift;
  my $msgprefix   = "dc_set_default_value_for_class";
  my $question    = "dictionaries-common/default-$class";
  my $oldlink     = "/etc/alternatives/$alternatives{$class}";
  my $guessed;

  if ( my $classinfo = &dc_parse_classinfo($class) ){
    # Ancient symlinks may be different for different classes,
    my ( $language, $country ) = &dc_guess_language_country_strings($class);

    # First try something reasonably close to the lang +country pair
    if ( $guessed = &dc_guesslang($classinfo,$language,$country) ){
      &dc_debugprint(" $msgprefix: Guessed value ->($class,$language,$country,$guessed->{'guess'},$guessed->{'priority'})\n");
    } else {
      # Signal an error. This should never happen, thus the critical priority.
      &dc_debugprint(" $msgprefix: No good or bad guess found for ($class,$language,$country)\n");
      return;
    }

    # We may have ancient pre-policy alternative based symlinks with
    # alternative set in manual mode or with more dictionaries installed
    # in the same run. This is an upgrade from an ancient setup, we better ask.
    if ( -l $oldlink ){
      if ( &dc_manual_alternative($class) ){
	&dc_debugprint(" $msgprefix: Ancient $class alternative was in manual mode. Setting critical priority\n");
	$guessed->{'priority'} = "critical";
      } else {
	foreach my $oldpackage ( keys %{$classinfo->{'languages'}} ){
	  next if ( $oldpackage eq "dictionaries-common" );
	  $oldpackage = "wenglish" if ( $oldpackage eq "wamerican" );
	  # critical priority if exists debconf entry without a
	  # previous package installed. This means that besides
	  # upgrading, new dicts are being installed.
	  if ( not -e "/var/lib/dpkg/info/$oldpackage.list" ){
	    $guessed->{'priority'} = "critical";
	    &dc_debugprint( "$msgprefix: New dict [$oldpackage] is to be installed\n");
	    last;
	  }
	}
      }
    }

    # Actually set the value if found
    if ( $guessed ) {
      $guessed->{'question'} = $question;
      &dc_set($guessed);
    }
  } else {
    &dc_debugprint("$msgprefix: No elements found for $class\n");
  }
  return $guessed;
}

1;

# -----------------------------------------------------------------
# Local Variables:
# perl-indent-level: 2
# coding: iso-8859-1
# End:

