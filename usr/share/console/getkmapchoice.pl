#!/usr/bin/perl

use Debconf::Client::ConfModule ':all';
use Debconf::Log;

sub my_warn { 
   # Don't dump warnings into STDERR, as it will choke the return
   # of results from debconf to install-keymap. Instead put the 
   # warnings into debconf's debugging channel.
   Debconf::Log::debug developer => "getkmapchoice warning: ".join(" ",@_);
}

sub my_die {
    # Don't die horribly, as install-keymap will then crash.
    # Instead, dump the warning into debconf's logs,
    # and return NONE, which hopefully will Do The Right Thing.
    my_warn @_;
    print STDERR "NONE";
    exit 0;
}

#####COMMON#####
# -*- perl -*-

use vars qw( $obsolete_keymaps );

# Subarches
# FIXME: not done
# Issues:
# * ppc issues not fully asserted yet
# * /proc/hardware, which only exists on m68k and ppc, seems to be
#   an OPTION while configuring the kernel !
#   Any fallback when it's not there ?
# * USB set of keymap should contain what ? mac ? pc ? subset of those ?

# SUBARCH	KEYMAP SET	DETECTION
# m68k/atari	atari		"Model: Atari"
# m68k/amiga	amiga		"Model: Amiga"
# m68k/mac	mac		"Model: Macintosh"
# m68k/mvme	pc		"Model: Motorola"
# m68k/bvme	pc		"Model: BVME[46]000"
# m68k/{sun,apollo,next,q40,hp300} Not supported by Debian

# ppc/apus	amiga		"machine: Amiga"
# ppc/chrp	pc,mac		"machine: CHRP"
# ppc/pmac	mac		"machine: PowerMac|[Pp]ower[Bb]ook*|Power|iMac*|PowerMac1*"
# ppc/prep	pc		"machine: PReP"
# ppc/{bbox,mbx,ppc64,82xx,8xx} Not yet supported by Debian

# arm/*		pc		(refered to as 'arm' only)

sub guess_arch {
  my ($defs) = @_;

  my $arch = `dpkg --print-architecture`;
  chomp $arch;

  # Overrides for testing:
  #     $arch = 'powerpc';
  #     $arch = 'm68k';

  if (($arch eq 'powerpc') || ($arch eq 'm68k')) {
    my $subarch;
    if ($arch eq 'powerpc') {
      my $line = `sed -n 's/^machine.*: //p' /proc/cpuinfo`;
      chomp $line;
      abort ($defs, "No \"machine\" field in /proc/cpuinfo") if $line eq '';
      $subarch = lc $line;
    } elsif ($arch eq 'm68k') {
      my $line = `sed -n 's/^Model.*://p' /proc/hardware`;
      chomp $line;
      abort ($defs, "No \"Model\" field in /proc/hardware") if $line eq '';
      $subarch = lc $line;
    }
    chomp($subarch);
    $subarch =~ s/^\s*//;
    $subarch = 'amiga'	if $subarch =~ m/amiga/;
    $subarch = 'chrp'	if $subarch =~ m/chrp/;
    $subarch = 'prep'	if $subarch =~ m/prep/;
    $subarch = 'mac'	if $subarch =~ m/macintosh|powermac|powerbook|power|imac|powermac1/;
    $subarch = 'atari'	if $subarch =~ m/atari/;
    $subarch = 'mvme'	if $subarch =~ m/motorola/;
    $subarch = 'bvme'	if $subarch =~ m/bvme/;

    $arch = "$arch/$subarch";
  }

  # Overrides for testing:
  #     $arch = 'sparc';
  #     $arch = 'powerpc/mac';
  #     $arch = 'powerpc/chrp';
  #     $arch = 'm68k/amiga';
  #     $arch = 'alpha';

  return $arch;
}

sub abort {
  my ($defs, $msg) = @_;
  print STDERR "Debconf module aborted ($msg) - using old config mechanism.\n";
#  fset_default($defs);
  exit 0;
}

sub correctname($) {
  my ($string) = @_;

  $string = lc $string;
  $string =~ s/[^a-z0-9+\-\.\/]/_/g;

  return $string;
}

# BELOW THIS LINE IS STUFF FOR ALL KEYMAP PROVIDERS

$::keymap_defs = {
		  'prefix' => 'console-data/keymap/',
		  'toplevel' => 'family',
		  'sublevels' => [
				  'layout',
				  'variant',
				  'keymap',
				 ],
		  'allitems' => $::keymaps,
		  'obsolete' => $::obsolete_keymaps,
		  'archsets' => {
				 'i386' => [ 'pc' ],
				 #			       'hurd-i386' => [ 'pc' ],
				 'sparc' => [ 'sparc' ],
				 'alpha' => [ 'pc' ],
				 'arm' => [ 'pc' ],
				 'arm/riscpc' => [ 'pc' ],
				 'mips' => [ 'pc' ],
				 'm68k/atari' => [ 'atari' ],
				 'm68k/amiga' => [ 'amiga' ],
				 'm68k/mac' => [ 'mac' ],
				 'm68k/mvme' => [ 'pc' ],
				 'm68k/bvme' => [ 'pc' ],
				 'powerpc/amiga' => [ 'amiga' ], # apus
				 'powerpc/chrp' => [ 'pc', 'mac' ],
				 'powerpc/mac' => [ 'pc' ],
				 'powerpc/prep' => [ 'pc' ],
				 'amd64' => [ 'pc' ],
				},
		 };

sub readfiles($) {
  my ($path) = @_;

  opendir (DIR, $path) or my_die "Can't open directory \`$path': $!";
  my @files = grep { ! /^\./ && -f "$path/$_" } readdir(DIR);
  closedir DIR;

  foreach my $file (@files) {
#    print STDERR "Loading $defsdir/$file\n";
    require "$defsdir/$file";
  }
}

($ret, $policy) = get ('console-data/keymap/policy');
if ($policy eq "Don't touch keymap") {
  # No keymap
  $filename = 'NONE';
} elsif ($policy eq 'Select keymap from full list') {
  ($ret, $filename) = get ('console-data/keymap/full');
  if (! $filename) {
      $filename = 'NONE';
  }
} elsif ($policy eq 'Keep kernel keymap') {
  # No keymap
  $filename = 'KERNEL';
} else {
  # Get infos about selected keymap
  ($ret, $family) = get ('console-data/keymap/family');
  $cfamily = correctname $family;
  my_die "No keyboard family selected: $family" unless $ret == 0;

  # This should only occur when no keymap is available
  if ($family eq '') {
    # Tell other programs (eg. install-keymap) not to do anything
    print STDERR "NONE";
    exit 0;
  }

  ($ret, $layout) = get ("console-data/keymap/$cfamily/layout");
  $clayout = correctname $layout;
  if ($ret != 0) {
    # Oops. mssing entry. recover if possible,
    my_warn "No keyboard layout selected: $layout";
    if ( ! $FILE ) {
      my_die "No keymap selected" ;
    } else { 
      print STDERR $FILE; 
      exit 0;
    }
  }
  ($ret, $kbdvariant) = get ("console-data/keymap/$cfamily/$clayout/variant");
  $ckbdvariant = correctname $kbdvariant;
 if ($ret != 0) {
     # Oops. mssing entry. recover if possible,
     my_warn "No keyboard variant selected: $kbdvariant";
     if ( ! $FILE ) {
        my_die "No keymap selected" ;
     } else {
        print STDERR $FILE;
        exit 0;
     }
 }
  ($ret, $mapvariant) = get ("console-data/keymap/$cfamily/$clayout/$ckbdvariant/keymap");
  if ($ret != 0) {
    # Oops. mssing entry. recover if possible,
    my_warn "No keymap variant selected: $mapvariant";
    if ( ! $FILE ) {
      my_die "No keymap selected" ;
    } else {
      print STDERR $FILE;
      exit 0;
    }
  }


  # Get list of keymap definitions
  $defsdir = "/usr/share/console/lists/keymaps";
  $keymaps = {};
  readfiles ($defsdir);


  # Find the right one
  foreach my $kbdarch (@{$keymap_defs->{archsets}->{guess_arch($keymap_defs)}}) {
    my $maps = $keymaps->{$kbdarch};

    $maps = $maps->{$family};
    unless (defined $maps) {
      my_warn "Family not found ($family)"; 
      $maps = $keymaps->{$kbdarch};
      $maps = $maps->{Unknown};
      if (defined $maps) {
        my_warn "Using $maps instead";
      }
      next;
    }

    # 'Norwegian' had a typo in a previous version thus some people still
    # have this string in their debconf database.
    $layout =~ s/Norvegian/Norwegian/;

    $maps = $maps->{$layout};
    unless (defined $maps) {
      my_warn "Layout not found ($layout)"; next;
    }

    $maps = $maps->{$kbdvariant};
    unless (defined $maps) {
      my_warn "Keyboard variant not found ($kbdvariant)"; next;
    }

    $filename = $maps->{$mapvariant};
    unless (defined $filename) {
      my_warn "Keymap variant not found ($mapvariant)"; next;
    }
  }
}

my_die "No matching map found" unless defined $filename;

# output result
print STDERR "$filename\n";
