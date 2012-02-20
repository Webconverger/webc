# Generated from XSLoader.pm.PL (resolved %Config::Config value)

package XSLoader;

$VERSION = "0.10";

#use strict;

# enable debug/trace messages from DynaLoader perl code
# $dl_debug = $ENV{PERL_DL_DEBUG} || 0 unless defined $dl_debug;

  my $dl_dlext = 'so';

package DynaLoader;

# No prizes for guessing why we don't say 'bootstrap DynaLoader;' here.
# NOTE: All dl_*.xs (including dl_none.xs) define a dl_error() XSUB
boot_DynaLoader('DynaLoader') if defined(&boot_DynaLoader) &&
                                !defined(&dl_error);
package XSLoader;

sub load {
    package DynaLoader;

    die q{XSLoader::load('Your::Module', $Your::Module::VERSION)} unless @_;

    my($module) = $_[0];

    # work with static linking too
    my $boots = "$module\::bootstrap";
    goto &$boots if defined &$boots;

    goto retry unless $module and defined &dl_load_file;

    my @modparts = split(/::/,$module);
    my $modfname = $modparts[-1];

    my $modpname = join('/',@modparts);
    my $modlibname = (caller())[1];
    my $c = @modparts;
    $modlibname =~ s,[\\/][^\\/]+$,, while $c--;	# Q&D basename
    my $file = "$modlibname/auto/$modpname/$modfname.$dl_dlext";

#   print STDERR "XSLoader::load for $module ($file)\n" if $dl_debug;

    my $bs = $file;
    $bs =~ s/(\.\w+)?(;\d*)?$/\.bs/; # look for .bs 'beside' the library

    if (-s $bs) { # only read file if it's not empty
#       print STDERR "BS: $bs ($^O, $dlsrc)\n" if $dl_debug;
        eval { do $bs; };
        warn "$bs: $@\n" if $@;
    }

    goto retry if not -f $file or -s $bs;

    my $bootname = "boot_$module";
    $bootname =~ s/\W/_/g;
    @DynaLoader::dl_require_symbols = ($bootname);

    my $boot_symbol_ref;

    # Many dynamic extension loading problems will appear to come from
    # this section of code: XYZ failed at line 123 of DynaLoader.pm.
    # Often these errors are actually occurring in the initialisation
    # C code of the extension XS file. Perl reports the error as being
    # in this perl code simply because this was the last perl code
    # it executed.

    my $libref = dl_load_file($file, 0) or do { 
        require Carp;
        Carp::croak("Can't load '$file' for module $module: " . dl_error());
    };
    push(@DynaLoader::dl_librefs,$libref);  # record loaded object

    my @unresolved = dl_undef_symbols();
    if (@unresolved) {
        require Carp;
        Carp::carp("Undefined symbols present after loading $file: @unresolved\n");
    }

    $boot_symbol_ref = dl_find_symbol($libref, $bootname) or do {
        require Carp;
        Carp::croak("Can't find '$bootname' symbol in $file\n");
    };

    push(@DynaLoader::dl_modules, $module); # record loaded module

  boot:
    my $xs = dl_install_xsub($boots, $boot_symbol_ref, $file);

    # See comment block above
    push(@DynaLoader::dl_shared_objects, $file); # record files loaded
    return &$xs(@_);

  retry:
    my $bootstrap_inherit = DynaLoader->can('bootstrap_inherit') || 
                            XSLoader->can('bootstrap_inherit');
    goto &$bootstrap_inherit;
}

# Versions of DynaLoader prior to 5.6.0 don't have this function.
sub bootstrap_inherit {
    package DynaLoader;

    my $module = $_[0];
    local *DynaLoader::isa = *{"$module\::ISA"};
    local @DynaLoader::isa = (@DynaLoader::isa, 'DynaLoader');
    # Cannot goto due to delocalization.  Will report errors on a wrong line?
    require DynaLoader;
    DynaLoader::bootstrap(@_);
}

1;

__END__

