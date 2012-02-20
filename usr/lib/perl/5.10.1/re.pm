package re;

# pragma for controlling the regex engine
use strict;
use warnings;

our $VERSION     = "0.09";
our @ISA         = qw(Exporter);
my @XS_FUNCTIONS = qw(regmust);
my %XS_FUNCTIONS = map { $_ => 1 } @XS_FUNCTIONS;
our @EXPORT_OK   = (@XS_FUNCTIONS,
                    qw(is_regexp regexp_pattern
                       regname regnames regnames_count));
our %EXPORT_OK = map { $_ => 1 } @EXPORT_OK;

# *** WARNING *** WARNING *** WARNING *** WARNING *** WARNING ***
#
# If you modify these values see comment below!

my %bitmask = (
    taint   => 0x00100000, # HINT_RE_TAINT
    eval    => 0x00200000, # HINT_RE_EVAL
);

# - File::Basename contains a literal for 'taint' as a fallback.  If
# taint is changed here, File::Basename must be updated as well.
#
# - ExtUtils::ParseXS uses a hardcoded 
# BEGIN { $^H |= 0x00200000 } 
# in it to allow re.xs to be built. So if 'eval' is changed here then
# ExtUtils::ParseXS must be changed as well.
#
# *** WARNING *** WARNING *** WARNING *** WARNING *** WARNING ***

sub setcolor {
 eval {				# Ignore errors
  require Term::Cap;

  my $terminal = Tgetent Term::Cap ({OSPEED => 9600}); # Avoid warning.
  my $props = $ENV{PERL_RE_TC} || 'md,me,so,se,us,ue';
  my @props = split /,/, $props;
  my $colors = join "\t", map {$terminal->Tputs($_,1)} @props;

  $colors =~ s/\0//g;
  $ENV{PERL_RE_COLORS} = $colors;
 };
 if ($@) {
    $ENV{PERL_RE_COLORS} ||= qq'\t\t> <\t> <\t\t';
 }

}

my %flags = (
    COMPILE         => 0x0000FF,
    PARSE           => 0x000001,
    OPTIMISE        => 0x000002,
    TRIEC           => 0x000004,
    DUMP            => 0x000008,
    FLAGS           => 0x000010,

    EXECUTE         => 0x00FF00,
    INTUIT          => 0x000100,
    MATCH           => 0x000200,
    TRIEE           => 0x000400,

    EXTRA           => 0xFF0000,
    TRIEM           => 0x010000,
    OFFSETS         => 0x020000,
    OFFSETSDBG      => 0x040000,
    STATE           => 0x080000,
    OPTIMISEM       => 0x100000,
    STACK           => 0x280000,
    BUFFERS         => 0x400000,
);
$flags{ALL} = -1 & ~($flags{OFFSETS}|$flags{OFFSETSDBG}|$flags{BUFFERS});
$flags{All} = $flags{all} = $flags{DUMP} | $flags{EXECUTE};
$flags{Extra} = $flags{EXECUTE} | $flags{COMPILE};
$flags{More} = $flags{MORE} = $flags{All} | $flags{TRIEC} | $flags{TRIEM} | $flags{STATE};
$flags{State} = $flags{DUMP} | $flags{EXECUTE} | $flags{STATE};
$flags{TRIE} = $flags{DUMP} | $flags{EXECUTE} | $flags{TRIEC};

my $installed;
my $installed_error;

sub _do_install {
    if ( ! defined($installed) ) {
        require XSLoader;
        $installed = eval { XSLoader::load('re', $VERSION) } || 0;
        $installed_error = $@;
    }
}

sub _load_unload {
    my ($on)= @_;
    if ($on) {
        _do_install();        
        if ( ! $installed ) {
            die "'re' not installed!? ($installed_error)";
	} else {
	    # We call install() every time, as if we didn't, we wouldn't
	    # "see" any changes to the color environment var since
	    # the last time it was called.

	    # install() returns an integer, which if casted properly
	    # in C resolves to a structure containing the regex
	    # hooks. Setting it to a random integer will guarantee
	    # segfaults.
	    $^H{regcomp} = install();
        }
    } else {
        delete $^H{regcomp};
    }
}

sub bits {
    my $on = shift;
    my $bits = 0;
    unless (@_) {
	require Carp;
	Carp::carp("Useless use of \"re\" pragma"); 
    }
    foreach my $idx (0..$#_){
        my $s=$_[$idx];
        if ($s eq 'Debug' or $s eq 'Debugcolor') {
            setcolor() if $s =~/color/i;
            ${^RE_DEBUG_FLAGS} = 0 unless defined ${^RE_DEBUG_FLAGS};
            for my $idx ($idx+1..$#_) {
                if ($flags{$_[$idx]}) {
                    if ($on) {
                        ${^RE_DEBUG_FLAGS} |= $flags{$_[$idx]};
                    } else {
                        ${^RE_DEBUG_FLAGS} &= ~ $flags{$_[$idx]};
                    }
                } else {
                    require Carp;
                    Carp::carp("Unknown \"re\" Debug flag '$_[$idx]', possible flags: ",
                               join(", ",sort keys %flags ) );
                }
            }
            _load_unload($on ? 1 : ${^RE_DEBUG_FLAGS});
            last;
        } elsif ($s eq 'debug' or $s eq 'debugcolor') {
	    setcolor() if $s =~/color/i;
	    _load_unload($on);
	    last;
        } elsif (exists $bitmask{$s}) {
	    $bits |= $bitmask{$s};
        } elsif ($XS_FUNCTIONS{$s}) {
            _do_install();
            if (! $installed) {
                require Carp;
                Carp::croak("\"re\" function '$s' not available");
            }
            require Exporter;
            re->export_to_level(2, 're', $s);
	} elsif ($EXPORT_OK{$s}) {
	    require Exporter;
	    re->export_to_level(2, 're', $s);
	} else {
	    require Carp;
	    Carp::carp("Unknown \"re\" subpragma '$s' (known ones are: ",
                       join(', ', map {qq('$_')} 'debug', 'debugcolor', sort keys %bitmask),
                       ")");
	}
    }
    $bits;
}

sub import {
    shift;
    $^H |= bits(1, @_);
}

sub unimport {
    shift;
    $^H &= ~ bits(0, @_);
}

1;

__END__

