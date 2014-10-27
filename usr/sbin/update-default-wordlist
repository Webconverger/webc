#!/usr/bin/perl -w

use strict;
use Debian::DictionariesCommon q(:all);
use Debconf::Client::ConfModule q(:all);

dico_checkroot ();

my $triggered;
my $skip_symlinks_setting;
my $class   = "wordlist";
my $program = "update-default-$class";
my $debug   = 1 if defined $ENV{'DICT_COMMON_DEBUG'};

# Parse options
foreach my $option ( @ARGV ){
  if ( $option eq "--skip-symlinks" ){
    # Do not try to set symlinks at $linkdir.
    $skip_symlinks_setting++;
  } elsif ( $option eq "--rebuild" ){
    # info is always rebuilt, so this option is not needed.
    # It is preserved as a no-op for old maintainer scripts.
  } elsif ( $option eq "--triggered" ){
    # Do not try to enable update-default-$class} trigger but run the script.
    $triggered++;
  } else {
    die "update-default-$class: Bad option \"$option\". Aborting..."
  }
}

version ('2.0');

updatedb ($class);
my $dictionaries = loaddb ($class);

# Preprocess default symlinks
dico_preprocess_default_symlinks ($class,$dictionaries);

# Enable trigger if needed. Exit cleanly on success.
unless ( $triggered ){
  exit if dico_activate_trigger("update-default-$class");
}

my $manual;
my $question  = "dictionaries-common/default-$class";
my $iquestion = "dictionaries-common/invalid_debconf_value";
my $debconf_dbase_corruption_question = "dictionaries-common/debconf_database_corruption";
my $newflag   = "/var/cache/dictionaries-common/flag-$class-new";

# This flag is intended for remove-default-$class. If we are here we do not
# need it any longer, so we reset for future apt runs by cleaning it.
if ( -f $newflag ){
  print STDERR "$program: Removing $newflag\n" if $debug;
  unlink $newflag
    or print STDERR " $program: Warning: could not remove $newflag\n";
}

my ($ret, $value)  = get ($question);
if ( $ret == 0 && $value ){
  # Question has a value
  if ( $value =~ m/^Manual.*/i ){
    # Question is set to manual mode
    print STDERR "$program: Manual mode for \"$class\"\n" if $debug;
    $manual++;
  } elsif ( not %$dictionaries ) {
    # Question has a value, but no manual mode and no class elements available. Unset value.
    print STDERR "$program: No Manual mode and no $class elements. $question unset.\n" if $debug;
    $value = "";
    set($question,$value);
    $manual++;
  } else {
    # Normal case, question has a value and is set to one of the installed class elements.
    print STDERR "$program: Default is set to \"$value\" for \"$class\"\n" if $debug;
  }
} elsif ( not %$dictionaries ) {
  # Question is empty. No default nor class elements available. Proceed as for manual.
  print STDERR "$program: No \"$class\" elements left.\n" if $debug;
  $manual++;
} else { # Question is empty, but $class elements are installed.

  # This seems to be debconf database corruption. Warn loudly about it.
  my %class_pkgs = ();
  foreach my $lang ( keys %{$dictionaries} ){
    if ( defined $dictionaries->{$lang}->{'package'} ){
      $class_pkgs{$dictionaries->{$lang}->{'package'}}++;
    }
  }
  my $class_packages = join (', ',sort keys %class_pkgs);

  subst($debconf_dbase_corruption_question,"class_packages",$class_packages);
  subst($debconf_dbase_corruption_question,"question",$question);
  fset ($debconf_dbase_corruption_question,"seen","false");
  input("high",$debconf_dbase_corruption_question);
  title ("dictionaries-common: wordlists");
  go ();

  # Try harder to get a value after default file
  my $dico_sysdefault = dico_getsysdefault($class);
  if ( defined $dico_sysdefault ){ # Not undef. Can be an empty or non-empty string.
    if ( $dico_sysdefault ){ # True: Non-empty string and not 0
      if ( defined $dictionaries->{$dico_sysdefault} ){
	$value = $dico_sysdefault;
	set($question,$value);
	print STDERR "$program: Missing value for \"$question\" question. Using \"$value\"\n";
      }
    } else { # False: The empty string or 0
      $value = "Manual symlinks setting (Forced after default file)";
      set($question,$value);
      $manual++;
    }
  }
}

unless ( $manual ){
  # Handle invalid debconf values
  if ( not exists $dictionaries->{$value} ){
    # This can happen because either an invalid debconf value or a
    # void value due to debconf database corruption. Try after stored
    # values to stay in the safe side.
    my @available_keys = sort {lc $a cmp lc $b} keys %$dictionaries;
    my $choices    = join (', ', sort {lc $a cmp lc $b} @available_keys);
    print STDERR "$program: Trying to get a default value from \"$choices\"\n";
    my $forced_key = $available_keys[0] ||
      die "$program: Selected wordlist" .
	" \"$value\" \n" .
	"does not correspond to any installed package in the system\n" .
	"and no alternative wordlist could be selected.\n";

    # Warn about what might have happened if not debconf database corruption
    if ( $value ){
      subst($iquestion,"value",$value);
      fset ($iquestion,"seen","false");
      input("high",$iquestion);
    }

    # Prepare a selection box to get a default.
    subst ($question, "choices", $choices);  # Put sane values in debconf choices field
    subst ($question, "echoices", $choices); # Put sane values in debconf echoices field
    set ($question, $forced_key);            # Set debconf value to a sane one
    fset ($question,"seen","false");
    input ("critical", $question);
    title ("dictionaries-common: wordlists");
    go ();
    ($ret, $value) = get ($question);
    die "\n Could not get a valid value for debconf question:\n" .
      "$question\n"
      if ( $ret != 0 ); # This should never be reached

    # Set manual flag if needed to avoid later symlinking
    $manual++ if ( $value =~ m/^Manual.*/i );
  }
}

# Set default value for ispell dictionaries and wordlists
if ( $manual ){
  dico_setsysdefault ($class,"");
} else {
  dico_setsysdefault ($class,$value);
}

#

# Set default symlink(s) and complain if not possible.
# For ispell dictionaries using auto-buildhash this should not be done
# from dictionaries-common postinst, but from ispell dictionaries postinst.
# Otherwise this is called before hashes are autobuild and will fail.
# d-c.postinst will call update-default-ispell with --skip-symlinks option.
unless ( $skip_symlinks_setting or $manual ) {
 dico_set_default_symlink($class,$value);
}

# Local Variables:
#  perl-indent-level: 2
# End:

__END__

=head1 NAME

update-default-wordlist - update default wordlist

=head1 SYNOPSIS

 update-default-wordlist [--skip-symlinks] [--triggered]

=head1 DESCRIPTION

WARNING: Not to be used from the command line unless you know very well what you are doing.

This program is intended to be called from wordlist package postinst,
from B<select-default-wordlist> or
from dictionaries-common postinst.

When called under dpkg control with the B<--trigger> option the
script is run normally, otherwise the dictionaries-common
B<update-default-wordlist> trigger is enabled
for later run.

With the B<--skip-symlinks> option the symlinks setting is skipped.


When run normally (from the command line or with B<--trigger>)
this script rebuilds the info at
F</var/cache/dictionaries-common/wordlist.db>
after files under F</var/lib/dictionaries-common/wordlist>,
reads the system default from the debconf database and
unless disabled, set default symlinks in F</etc/dictionaries-common>
pointing to the appropriate files in
F</usr/share/dict/>.



=head1 OPTIONS

 --skip-symlinks  Do not try to set symlinks at /etc/dictionaries-common dir.
 --triggered      Run all the code instead of trying to enable
                  update-default-wordlist trigger

=head1 SEE ALSO

The dictionaries-common policy document

=head1 AUTHORS

Rafael Laboissiere,
Agustin Martin Domingo

=cut
