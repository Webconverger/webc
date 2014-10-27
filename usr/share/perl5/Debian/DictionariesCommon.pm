#!/usr/bin/perl

package Debian::DictionariesCommon;

use strict;
use base qw(Exporter);
use Text::Iconv;

# List all exported symbols here.
our @EXPORT_OK = qw(parseinfo updatedb loaddb
		    dico_checkroot
		    dico_debugprint
		    dico_get_spellchecker_params
		    getlibdir
                    dico_getsysdefault dico_setsysdefault
		    getuserdefault setuserdefault
		    build_emacsen_support
		    build_jed_support
		    build_squirrelmail_support
		    dico_activate_trigger
		    dico_clean_orphaned_removefiles
		    dico_preprocess_default_symlinks
                    dico_set_default_symlink
		    );
# Import :all to get everything.
our %EXPORT_TAGS = (all => [@EXPORT_OK]);

my $infodir             = "/var/lib/dictionaries-common";
my $cachedir            = "/var/cache/dictionaries-common";
my $emacsensupport      = "emacsen-ispell-dicts.el";
my $jedsupport          = "jed-ispell-dicts.sl";
my $squirrelmailsupport = "sqspell.php";
my $debug               = 1 if ( defined $ENV{'DICT_COMMON_DEBUG'} );

# Directories and files to store default values
my $sys_etc_dir         = "/etc/dictionaries-common";
my $sys_default_dir     = "$cachedir";
my $ispelldefault       = "ispell-default";
my $userdefault         = ( defined $ENV{HOME} ) ? "$ENV{HOME}/.$ispelldefault" : undef;
my %sys_default_file    = ("ispell"   => "$sys_default_dir/ispell-default",
			   "wordlist" => "$sys_default_dir/wordlist-default");

# ------------------------------------------------------------------
sub dico_checkroot {
# ------------------------------------------------------------------
# Check if we are root
# ------------------------------------------------------------------
  return if ($> == 0 or ($^O eq 'interix' and $> == 197108));
  die "$0: You must run this as root.\n";
}

# -------------------------------------------------------------
sub dico_debugprint {
# -------------------------------------------------------------
# Show info if in debug mode
# -------------------------------------------------------------
  print STDERR "@_\n" if $debug;
}

# ------------------------------------------------------------------
sub getlibdir {
# ------------------------------------------------------------------
# Get location for dict-common info snippets
# ------------------------------------------------------------------
  my $class = shift;
  return "$infodir/$class";
}

# ------------------------------------------------------------------
sub mydie {
# ------------------------------------------------------------------
# A wrapper to die with some local flavor.
# ------------------------------------------------------------------
  my $routine = shift;
  my $errmsg = shift;
  die __PACKAGE__, "($routine):E: $errmsg";
}

# ------------------------------------------------------------------
sub parseinfo {
# ------------------------------------------------------------------
# Parse given dict-common info file
# ------------------------------------------------------------------
  my $file = shift;
  local $/ = "";    # IRS is global, we need 'local' here, not 'my'
  open (DICT, "< $file");
  my %dictionaries =
    map {
      s/^([^:]+):/lc ($1) . ":"/meg;  # Lower case field names
      my %hash = /^([^:]+):\s*((?<!\n)[^\n]+)\s*$/mg;
      map { delete $hash{$_} if ($hash{$_} =~ /^\s+$/) } keys %hash;
      mydie ('parseinfo',
	     qq{Record in file $file does not have a "Language" entry})
	if not exists $hash{language};
      mydie ('parseinfo',
	     qq{Record in file $file does not have a "Hash-Name" entry})
	if not exists $hash{"hash-name"};
      my $lang = delete $hash{language};
      ($lang, \%hash);
    } <DICT>;
  return \%dictionaries;
}

# ------------------------------------------------------------------
sub dico_dumpdb {
# ------------------------------------------------------------------
# Save %dictionaries in Data::Dumper like format. This function
# should be enough for the limited needs of dictionaries-common
# ------------------------------------------------------------------
  my $class        = shift;
  my $dictionaries = shift;
  my @fullarray    = ();
  my @dictarray    = ();
  my $output       = "$cachedir/$class.db";
  my $dictentries  = '';
  my $thevalue     = '';

  foreach my $thedict ( sort keys %{$dictionaries}){
    $dictentries = $dictionaries->{$thedict};
    @dictarray   = ();
    foreach my $thekey ( sort keys %{$dictentries}){
      $thevalue = $dictentries->{$thekey};
      # Make sure \ and ' are escaped in keyvals
      $thevalue =~ s/(\\|\')/\\$1/g;
      push (@dictarray,"     \'$thekey\' => \'$thevalue\'");
    }
    # Make sure \ and ' are escaped in dict names
    $thedict =~ s/(\\|\')/\\$1/g;
    push (@fullarray,
	  "  \'$thedict\' => \{\n" . join(",\n",@dictarray) . "\n  \}");
  }

  mkdir $cachedir unless (-d $cachedir);

  open (DB,"> $output");
  print DB generate_comment("### ") . "\n";
  print DB "package Debian::DictionariesCommon::dbfile;\n\n";
  print DB "%dictionaries = (\n";
  print DB join (",\n",@fullarray);
  print DB "\n);\n\n1;\n";
  close DB;
}

# ------------------------------------------------------------------
sub dico_get_spellchecker_params {
# ------------------------------------------------------------------
# dico_get_spellchecker_params($class,\%language)
#  Get right params for $class (currently unused) and $language
# ------------------------------------------------------------------
  my $class       = shift;
  my $language    = shift;
  my $d_option    = "";
  my $w_option    = "";
  my $T_option    = "";
  my $ispell_args = "";

  $d_option = "-d $language->{'hash-name'}"
      if exists $language->{'hash-name'};
  $w_option = "-w $language->{'additionalchars'}"
      if exists $language->{'additionalchars'};

  if ( exists $language->{'extended-character-mode'} ){
    $T_option =  $language->{'extended-character-mode'};
    $T_option =~ s/^~//; # Strip leading ~ from Extended-Character-Mode.
    $T_option =  '-T ' . $T_option;
  }

  if ( exists $language->{'ispell-args'} ){
    $ispell_args = $language->{'ispell-args'};
    foreach ( split('\s+',$ispell_args) ) {
      # No d_option if already in $ispell_args
      $d_option = "" if /^\-d/;
    }
  }
  return "$d_option $w_option $T_option $ispell_args";
}

# ------------------------------------------------------------------
sub updatedb {
# ------------------------------------------------------------------
# Parse info files for the given class and update class database
# ------------------------------------------------------------------
  my $class        = shift;
  my %dictionaries = ();

  foreach my $file (<$infodir/$class/*>) {
    next if $file =~ m/.*~$/;                 # Ignore ~ backup files
    my %dicts = %{ parseinfo ("$file") };

    # Add package name to all entries
    my $file_basename = $file;
    $file_basename =~ s/^$infodir\/$class\///;
    $dicts{$_}{'package'} = $file_basename foreach ( keys %dicts );

    %dictionaries = (%dictionaries, %dicts);
  }
  &dico_dumpdb($class,\%dictionaries);
}

# ------------------------------------------------------------------
sub loaddb {
# ------------------------------------------------------------------
# Load class database
# ------------------------------------------------------------------
  my $class  = shift;
  my $dbfile = "$cachedir/$class.db";

  if (-e $dbfile) {
    do $dbfile;
  }
  return \%Debian::DictionariesCommon::dbfile::dictionaries;
}

# ------------------------------------------------------------------
sub getdefault {
# ------------------------------------------------------------------
# Read default value from specified file. Comments and empty lines are ignored.
# ------------------------------------------------------------------
  my $file = shift;
  my $lang = "";

  if (-f $file) {
    open( my $FILE,"< $file")
      or die "Dictionaries-common::getdefault: Could not open $file for read. Aborting ...\n";
    while (<$FILE>){
      next if m/^\s*\#/;
      next if m/^\s*$/;
      $lang = $_;
      last;
    }
    close $FILE;
    return $lang;
  }
  return;
}

# ------------------------------------------------------------------
sub getuserdefault {
# ------------------------------------------------------------------
# Get user default from user's default file
# ------------------------------------------------------------------
  die "Dictionaries-common::getuserdefault: Could not set \$userdefault. Aborting ...\n"
    unless $userdefault;
  getdefault ($userdefault);
}

# ------------------------------------------------------------------
sub dico_getsysdefault {
# ------------------------------------------------------------------
# Get system default value for given class
# ------------------------------------------------------------------
  my $class = shift;
  getdefault ($sys_default_file{$class});
}

# ------------------------------------------------------------------
sub dico_setsysdefault {
# ------------------------------------------------------------------
# Set system default value for given class
# ------------------------------------------------------------------
  my $class = shift;
  my $value = shift;

  my $default_file       = "$sys_default_file{$class}";
  my $old_ispell_default = "$sys_etc_dir/$ispelldefault";

  if ( "$value" ){
    open (DEFAULT, "> $default_file");
    print DEFAULT $value;
    close DEFAULT;

    # Set symlink from old to new location for squirrelmail benefit.
    if ( $class eq "ispell" ){
      unlink "$old_ispell_default";
      symlink "$default_file", "$old_ispell_default";
    }
  } else {
    unlink "$default_file" if ( -e "$default_file" );

    # squirrelmail expects an empty file if no ispell dicts are installed.
    if ( $class eq "ispell" ){
      # Remove $old_ispell_default. Could be a symlink and target be written.
      unlink "$old_ispell_default"; #
      open (DEFAULT, "> $old_ispell_default");
      print DEFAULT "";
      close DEFAULT;
    }
  }
}

# ------------------------------------------------------------------
sub setuserdefault {
# ------------------------------------------------------------------
# Write user's default value to user's default file
# ------------------------------------------------------------------
  my $default      = getuserdefault ();
  my $dictionaries = loaddb ("ispell");
  my %languages    = ();
  my %elanguages   = ();

  foreach my $language ( sort keys %$dictionaries ){
    my $entry     = $dictionaries->{$language};
    my $elanguage = $language;
    if ( defined $entry->{'elanguage'} ){
      $elanguage = $entry->{'elanguage'};
    }
    $languages{$elanguage} = $language;
    $elanguages{$language} = $elanguage;
  }

  unless  ( %languages ) {
    warn "Sorry, no ispell dictionary is installed in your system.\n";
    return;
  }

  my @choices = sort keys %languages;

  my $initial = -1;
  if ( defined $default ) {
    my $default = $elanguages{$default};
    for ( my $i = 0; $i < scalar @choices; $i++ ) {
      if ( $default eq $choices[$i] ) {
	$initial = $i;
	last;
      }
    }
  }

  open (TTY, "/dev/tty");
  while (1) {
    $| = 1;
    print
      "\nSelect your personal ispell dictionary for use with ispell-wrapper\n\n";
    for ( my $i = 0; $i < scalar @choices; $i++ ) {
      print "  " . ($i == $initial ? "*" : " ")
	     . " [" . ($i+1) . "] $choices[$i]\n";
    }
    print qq(\nSelect number or "q" for quit)
      . ($initial != -1 ? " (* is the current default): " : ": ");
    my $sel = <TTY>;
    chomp $sel;
    last if $sel eq "q";
    if ($sel < 1 or $sel > scalar @choices) {
      print qq{\nInvalid choice "$sel".\n\n};
      next;
    }
    else {
      $sel--;
      open (DEFAULT, "> $userdefault");
      print DEFAULT $languages{$choices[$sel]};
      close DEFAULT;
      last;
    }
  }
  close TTY;
}

# ------------------------------------------------------------------
sub generate_comment {
# ------------------------------------------------------------------
# Generate a standard comment string with given prefix
# ------------------------------------------------------------------
  my $commstr = shift;
  my $comment = "This file is part of the dictionaries-common package.
It has been automatically generated.
DO NOT EDIT!";
  $comment =~ s{^}{$commstr}mg;
  return "$comment\n";
}

# ------------------------------------------------------------------
sub build_emacsen_support {
# ------------------------------------------------------------------
# Put info from dicts info files into emacsen-ispell-dicts.el
# ------------------------------------------------------------------
  my $elisp          = '';
  my @classes        = ("aspell","hunspell","ispell");
  my %entries        = ();
  my %class_locales  = ();

  foreach my $class ( @classes ){
    my $dictionaries = loaddb ($class);

    foreach my $k (keys %$dictionaries) {
      my $lang = $dictionaries->{$k};

      next if (exists $lang->{'emacs-display'}
	       && $lang->{'emacs-display'} eq "no");

      my $hashname = $lang->{"hash-name"};
      my $casechars = exists $lang->{casechars} ?
	  $lang->{casechars} : "[a-zA-Z]";
      my $notcasechars = exists $lang->{"not-casechars"} ?
	  $lang->{"not-casechars"} : "[^a-zA-Z]";
      my $otherchars = exists $lang->{otherchars} ?
	  $lang->{otherchars} : "[']";
      my $manyothercharsp = exists $lang->{"many-otherchars"} ?
	  ($lang->{"many-otherchars"} eq "yes" ? "t" : "nil") : "nil";
      my $ispellargs = exists $lang->{"ispell-args"} ?
	  $lang->{"ispell-args"} : "-d $hashname";
      my $extendedcharactermode = exists $lang->{"extended-character-mode"} ?
	  ('"' . $lang->{"extended-character-mode"} . '"') : "nil";
      my $codingsystem  = exists $lang->{"coding-system"} ?
	  $lang->{"coding-system"} : "nil";
      my $emacsen_name  = defined $lang->{"emacsen-name"} ?
	  $lang->{"emacsen-name"} : $hashname;
      my $emacsen_names = defined $lang->{"emacsen-names"} ?
	  $lang->{"emacsen-names"} : $emacsen_name;

      # Explicitly add " -d $hashname" to $ispellargs if not already there.
      # Note that this must check for "-dxx", "-d xx", "-C -d xx", "-C -dxx" like matches
      if ( $ispellargs !~ m/( |^)-d/ ){
	dico_debugprint(" - $class-emacsen: Adding \" -d $hashname\" to \"$ispellargs\"");
	$ispellargs .= " -d $hashname";
      }

      foreach my $emacsenname ( split(',\s*',$emacsen_names) ){
	$entries{$class}{$emacsenname} = $entries{'all'}{$emacsenname} =
	  ['"' . $emacsenname  . '"',
	   '"' . $casechars    . '"',
	   '"' . $notcasechars . '"',
	   '"' . $otherchars   . '"',
	   $manyothercharsp,
	   '("' . join ('" "', split (/\s+/,$ispellargs)) . '")',
	   $extendedcharactermode,
	   $codingsystem];

	if ( $class eq "aspell" && exists $lang->{"aspell-locales"} ){
	  foreach ( split(/\s*,\s*/,$lang->{"aspell-locales"}) ){
	    $class_locales{"aspell"}{$_} = $emacsenname;
	  }
	} elsif ( $class eq "hunspell" && exists $lang->{"hunspell-locales"} ){
	  foreach ( split(/\s*,\s*/,$lang->{"hunspell-locales"}) ){
	    $class_locales{"hunspell"}{$_} = $emacsenname;
	  }
	}
      }
    }
  }

  # Write alists of ispell, hunspell and aspell only installed dicts and their properties

  foreach my $class ( @classes ) {
    my @class_dicts = reverse sort keys %{ $entries{$class} };
    if ( scalar @class_dicts ){
      $elisp .= "\n;; Adding $class dicts\n\n";
      foreach ( @class_dicts ){
	my $mystring = join ("\n     ",@{ $entries{$class}{$_} });
	$elisp .= "(add-to-list \'debian-$class-only-dictionary-alist\n  \'($mystring))\n";
      }
      $elisp .= "\n";
    }
  }

  # Write a list of locales associated to each emacsen name

  foreach my $class ("aspell", "hunspell"){
    my $tmp_locales = $class_locales{$class};
    if ( defined $tmp_locales && scalar %$tmp_locales ){
      $elisp .= "\n\n;; An alist that will try to map $class locales to emacsen names";
      $elisp .= "\n\n(setq debian-$class-equivs-alist \'(\n";
      foreach ( sort keys %$tmp_locales ){
	$elisp .= "     (\"$_\" \"$tmp_locales->{$_}\")\n";
      }
      $elisp .= "))\n";

      # Obtain here debian-aspell-dictionary, after debian-aspell-equivs-alist
      # is loaded

      $elisp .="
;; Get default value for debian-$class-dictionary. Will be used if
;; spellchecker is $class and ispell-local-dictionary is not set.
;; We need to get it here, after debian-$class-equivs-alist is loaded

(setq debian-$class-dictionary (debian-ispell-get-$class-default))\n\n";
   } else {
      $elisp .= "\n\n;; No emacsen-$class-equivs entries were found\n";
   }}

  open (ELISP, "> $cachedir/$emacsensupport")
      or die "Cannot open emacsen cache file";
  print ELISP generate_comment (";;; ");
  print ELISP $elisp;
  close ELISP;
}

# ------------------------------------------------------------------
sub build_jed_support {
# ------------------------------------------------------------------
# Put info from dicts info files into jed-ispell-dicts.sl
# ------------------------------------------------------------------

  my @classes = ("aspell","ispell");
  my $slang   = generate_comment ("%%% ");

  ## The S-Lang code generated below will be wrapped in preprocessor
  ## ifexists constructs, insuring that the $jedsupport file will
  ## always evaluate correctly.

  foreach my $class ( @classes ){
    my %class_slang    = ();
    my %class_slang_u8 = ();
    if ( my $dictionaries = loaddb ($class) ){
      foreach my $k (sort keys %$dictionaries) {
	my $lang = $dictionaries->{$k};
	next if (exists $lang->{'jed-display'}
		 && $lang->{'jed-display'} eq "no");

	my $hashname = $lang->{"hash-name"};
	my $additionalchars = exists $lang->{additionalchars} ?
	    $lang->{additionalchars} : "";
	my $otherchars = exists $lang->{otherchars} ?
	    $lang->{otherchars} : "'";
	my $emacsenname = exists $lang->{"emacsen-name"} ?
	    $lang->{"emacsen-name"} : $hashname;
	my $extendedcharmode = exists $lang->{"extended-character-mode"} ?
	    $lang->{"extended-character-mode"} : "";
	my $ispellargs = exists $lang->{"ispell-args"} ?
	    $lang->{"ispell-args"} : "";
	my $codingsystem = exists $lang->{"coding-system"} ?
	    $lang->{"coding-system"} : "l1";

	# Strip enclosing [] from $otherchars
	$otherchars =~ s/^\[//;
	$otherchars =~ s/\]$//;
	# Convert chars in octal \xxx representation to the character
	$otherchars =~ s/\\([0-3][0-7][0-7])/chr(oct($1))/ge;
	$additionalchars =~ s/\\([0-3][0-7][0-7])/chr(oct($1))/ge;

	$class_slang{$emacsenname} =
	    "  $class" . "_add_dictionary (\n"
	    . "    \"$emacsenname\",\n"
	    . "    \"$hashname\",\n"
	    . "    \"$additionalchars\",\n"
	    . "    \"$otherchars\",\n"
	    . ($class eq "ispell" ? "    \"$extendedcharmode\",\n" : "")
	    . "    \"$ispellargs\");";
	if ( $class eq "aspell" ){
	  my $converter = Text::Iconv->new ($codingsystem, "utf8");
	  my $additionalchars_utf = $converter->convert ($additionalchars);
	  my $otherchars_utf = $converter->convert ($otherchars);
	  $class_slang_u8{$emacsenname} =
	      qq{    aspell_add_dictionary (
      "$emacsenname",
      "$hashname",
      "$additionalchars_utf",
      "$otherchars_utf",
      "$ispellargs");};
	} # if $class ..
      } # foreach $k ..
    } # if loaddb ..
    if ( scalar keys %class_slang ){
      $slang .= "\n\#ifexists $class" . "_add_dictionary\n";
      if ( $class eq "aspell" ){
	$slang .= "  if (_slang_utf8_ok) {\n"
	    . join("\n",sort values %class_slang_u8)
	    . "\n  } else {\n"
	    . join("\n",sort values %class_slang)
	    . "\n  }";
      } else {
	$slang .= join("\n",sort values %class_slang);
      }
      $slang .= "\n\#endif\n";
    }
  } # foreach $class
  open (SLANG, "> $cachedir/$jedsupport")
      or die "Cannot open jed cache file";
  print SLANG $slang;
  close SLANG;
}

# ------------------------------------------------------------------
sub build_squirrelmail_support {
# ------------------------------------------------------------------
# Build support file for squirrelmail with a list of available
# dictionaries and associated spellchecker calls, in php format.
# ------------------------------------------------------------------
  my @classes      = ("aspell","ispell","hunspell");
  my $php          = "<?php\n";
  my @dictlist     = ();

  $php .= generate_comment ("### ");
  $php .= "\$SQSPELL_APP = array (\n";

  foreach my $class (@classes) {
    my $dictionaries = loaddb ($class);
    foreach ( keys %$dictionaries ){
      next if m/.*[^a-z]tex[^a-z]/i;            # Discard tex variants
      my $lang = $dictionaries->{$_};
      my $squirrelname;
      if ( defined $lang->{"squirrelmail"} ){
	next if ( lc($lang->{"squirrelmail"}) eq "no" );
	$squirrelname = $lang->{"squirrelmail"};
      } else {
	next unless m/^(.*)\((.+)\)$/;
	$squirrelname = $2;
      }
      my $spellchecker_params =
	&dico_get_spellchecker_params($class,$lang);
      push @dictlist, qq {  '$squirrelname ($class)' => '$class -a $spellchecker_params'};
    }
  }

  $php .= join(",\n", sort @dictlist);
  $php .= "\n);\n";

  open (PHP, "> $cachedir/$squirrelmailsupport")
      or die "Cannot open SquirrelMail cache file";
  print PHP $php;
  close PHP;
}

# ------------------------------------------------------------------
sub dico_activate_trigger {
# ------------------------------------------------------------------
# Try activating provided trigger if run under dpkg control.
# Return true in success, nil otherwise.
# ------------------------------------------------------------------
  my $trigger       = shift;
  my $options       = shift;
  my $await_trigger = defined $options->{'trigger-await'} ? "" : " --no-await ";

  die "DictionariesCommon::dico_activate_trigger: No trigger provided. Aborting ...\n" unless $trigger;

  if ( defined $ENV{'DPKG_RUNNING_VERSION'} &&
       system("type dpkg-trigger >/dev/null 2>&1 && dpkg-trigger $await_trigger $trigger") == 0 ){
    dico_debugprint("DictionariesCommon::dico_activate_trigger: Enabled trigger \"$trigger\" [$await_trigger]");
    return 1;
  }
  return;
}

# ------------------------------------------------------------------
sub dico_clean_orphaned_removefiles {
# ------------------------------------------------------------------
# Clean orphaned remove files and their contents.
#
#  dico_clean_orphaned_removefiles($class,$dictionaries)
# ------------------------------------------------------------------
  my $class        = shift;
  die "DictionariesCommon::dico_preprocess_default_symlinks: No class passed"
    unless $class;
  my $dictionaries = shift;
  die "DictionariesCommon::dico_preprocess_default_symlinks: No dictionaries passed"
    unless $dictionaries;
  my $program      = "update-default-$class";
  my $varlibdir    = "/var/lib/$class";

  return unless ( $class eq "aspell" or $class eq "ispell" );

  foreach my $remove_file (<$varlibdir/*.remove>){
    my $dict        = $remove_file;
    $dict           =~ s/\.remove$//;
    $dict           =~ s/.*\///;
    my $compat_file = "$varlibdir/$dict.compat";

    # Remove orphaned remove files and its contents if no matching .compat file is found
    unless ( -e "$compat_file" ){
      open (my $REMOVE,"$remove_file");
      while (<$REMOVE>){
	chomp;
	next if m/^\s*$/;
	if ( -e "$_"
	     && m:^(/usr/lib|/var/lib): ){
	  unlink "$_";
	  print STDERR "$program: Removing \"$_\".\n";
	}
      }
      close $REMOVE;
      unlink "$remove_file";
      print STDERR "$program: Removing remove file \"$remove_file\".\n";
    }
  }

  # Remove $varlibdir directory if empty and not owned
  if ( -d "$varlibdir" ){
    unless ( scalar <"$varlibdir/*"> ){
      if ( system("dpkg-query -S $varlibdir  > /dev/null 2>&1") == 0 ){
	dico_debugprint("$program: Empty \"$varlibdir\" is owned by some package.");
      } elsif ( scalar %$dictionaries ){
	print STDERR "$program: Empty and unowned \"$varlibdir\", but \"$class\" elements installed.\n";
      } else {
	rmdir "$varlibdir";
	print STDERR "$program: Removing unowned and empty \"$varlibdir\" directory.\n";
      }
    }
  }
}

# ------------------------------------------------------------------
sub dico_preprocess_default_symlinks {
# ------------------------------------------------------------------
# Set default symlinks at $libdir if needed. Remove default symlinks
# at $libdir and $etcdir unless they are not dangling
#
# dico_preprocess_default_symlinks ($class,$dictionaries)
  # ------------------------------------------------------------------
  my $class        = shift;
  die "DictionariesCommon::dico_preprocess_default_symlinks: No class passed"
    unless $class;
  my $dictionaries = shift;
  die "DictionariesCommon::dico_preprocess_default_symlinks: No dictionaries passed"
    unless $dictionaries;
  my $program      = "installdeb-$class";


  my $linkdir = "/etc/dictionaries-common";
  my $libdir  = { 'ispell'   => "/usr/lib/ispell",
		  'wordlist' => "/usr/share/dict"};
  my $links   = {'ispell'    => ["default.hash", "default.aff"],
		 'wordlist'  => ["words"]};

  if ( %{$dictionaries} ){
    foreach my $link ( @{$links->{$class}} ){
      my $link_from = "$libdir->{$class}/$link";
      unless ( -e "$link_from" ){
	if ( -w "$libdir->{$class}" ){
	  print STDERR "Symlinking $link_from to $linkdir/$link\n"
	    if $debug;
	  symlink "$linkdir/$link","$link_from";
	} else {
	  print STDERR "$program:Warning: Non writable \"$libdir->{$class}\" dir. Read-only filesystem?\n";
	}
      }
    }
  } else {
    foreach my $link ( @{$links->{$class}} ){
      my $default_etc_link = "$linkdir/$link";
      my $default_usr_link = "$libdir->{$class}/$link";

      foreach my $default_link ( "$default_etc_link","$default_usr_link"){
	if ( -l "$default_link" ){
	  if ( -e readlink "$default_link" ){ # Non-dangling symlink
	    print STDERR "$program: Leaving non dangling symlink behind: \"$default_link\"\n";
	  } else {
	    if ( -w "$libdir->{$class}" ){
	      dico_debugprint("No $class elements. Remove $default_link.");
	      unlink "$default_link"
	    } else {
	      print STDERR "$program:Warning: Non writable \"$libdir->{$class}\" dir. Read-only filesystem?\n";
	    }
	  }
	} elsif ( -e "$default_link" ){
	  print STDERR "Leaving non symlink \"$default_link\" behind.\n"
	}
      }
    }
  }
}

# ------------------------------------------------------------------
sub dico_set_default_symlink {
# ------------------------------------------------------------------
# Try setting default symlinks for ispell dictionaries and wordlists.
#    dico_set_default_symlink($class,$value)
# ------------------------------------------------------------------
  my $class = shift;
  die "DictionariesCommon::dico_set_default_symlink: No class passed" unless $class;
  my $value = shift;
  die "DictionariesCommon::dico_set_default_symlink: No value passed" unless $value;

  my $dictionaries  = loaddb ($class);
  my $program       = "update-default-$class";
  my $linkdir       = "/etc/dictionaries-common";
  my $class_name    = { 'ispell'   => "ispell dictionary",
                        'wordlist' => "wordlist"};
  my $libdir        = { 'ispell'   => "/usr/lib/ispell",
                        'wordlist' => "/usr/share/dict"};
  my $link_suffixes = { 'ispell'   => [".hash", ".aff"],
                        'wordlist' => [""]};
  my $link_basename = { 'ispell'   => "default",
                        'wordlist' => "words"};

  if ( defined $dictionaries->{$value}{"hash-name"} ){
    dico_debugprint("update-default-$class: \"$value\" -> \"$dictionaries->{$value}{'hash-name'}\"");
    my $hash   = "$libdir->{$class}/" . $dictionaries->{$value}{"hash-name"};
    foreach my $i ( @{$link_suffixes->{$class}}) {
      my $link_to   = "$hash$i";
      if ( -e "$link_to" ) {
        my $link_from = "$linkdir/$link_basename->{$class}$i";
	system "ln -fs $link_to $link_from";
        dico_debugprint("$program: \"$link_from\" symlink set to \"$link_to\"");
      } else {
	die "$program:
  Could not make the default symlink to \"$link_to\".
  This may be a temporary problem due to installation ordering. If that
  file is not present after installation, please file a bugreport
  against $class_name->{$class} package owning that file.
  \n";
      }
    }
  } else {
    die "$program: Selected value \"$value\" for $class_name->{$class}\n" .
      "does not contain a hash name entry in the database.\n";
  }
}


# Ensure we evaluate to true.
1;

__END__

#Local Variables:
#perl-indent-level: 2
#End:

=head1 NAME

Debian::DictionariesCommon.pm - dictionaries-common library

=head1 SYNOPSIS

    use Debian::DictionariesCommon q(:all)
    $dictionaries = parseinfo ('/var/lib/dictionaries-common/ispell/iwolof');
    loaddb ('ispell')
    updatedb ('wordlist')

=head1 DESCRIPTION

Common functions for use from the dictionaries-common system.

=head1 CALLING FUNCTIONS

=over

=item C<dico_checkroot>

Check for rootness and fail if not.

=item C<build_emacsen_support>

Put info from dicts info files into emacsen-ispell-dicts.el

=item C<build_jed_support>

Put info from dicts info files into jed-ispell-dicts.sl

=item C<build_squirrelmail_support>

Build support file for squirrelmail with a list of available
dictionaries and associated spellchecker calls, in php format.

=item C<$libdir = getlibdir($class)>

Return info dir for given class.

=item C<$default = dico_getsysdefault($class)>

Return system default value for given class.

=item C<$libdir = getuserdefault>

Return value for user default ispell dictionary.

=item C<dico_get_spellchecker_params($class,\%language)>

Get right params for $class (currently unused) and $language

=item C<\%dictionaries = loaddb($class)>

Read class .db file and return a reference to a hash
with its contents.

=item C<\%result = parseinfo($file)>

Parse given info file and return a reference to a hash with
the relevant data.

=item C<setsysdefault($value)>

Set value for system default ispell dictionary.

=item C<setuserdefault>

Set value for user default ispell dictionary, after asking
to select it from the available values.

=item C<updatedb($class)>

Parse info files for given class and update class .db
file under dictionaries-common cache dir.

=back

=head1 SEE ALSO

Debian dictionaries-common policy.

=head1 AUTHORS

 Rafael Laboissiere
 Agustin Martin

=cut
