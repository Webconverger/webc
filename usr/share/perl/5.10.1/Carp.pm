package Carp;

our $VERSION = '1.11';
# this file is an utra-lightweight stub. The first time a function is
# called, Carp::Heavy is loaded, and the real short/longmessmess_jmp
# subs are installed

our $MaxEvalLen = 0;
our $Verbose    = 0;
our $CarpLevel  = 0;
our $MaxArgLen  = 64;   # How much of each argument to print. 0 = all.
our $MaxArgNums = 8;    # How many arguments to print. 0 = all.

require Exporter;
our @ISA = ('Exporter');
our @EXPORT = qw(confess croak carp);
our @EXPORT_OK = qw(cluck verbose longmess shortmess);
our @EXPORT_FAIL = qw(verbose);	# hook to enable verbose mode

# if the caller specifies verbose usage ("perl -MCarp=verbose script.pl")
# then the following method will be called by the Exporter which knows
# to do this thanks to @EXPORT_FAIL, above.  $_[1] will contain the word
# 'verbose'.

sub export_fail { shift; $Verbose = shift if $_[0] eq 'verbose'; @_ }

# fixed hooks for stashes to point to
sub longmess  { goto &longmess_jmp }
sub shortmess { goto &shortmess_jmp }
# these two are replaced when Carp::Heavy is loaded
sub longmess_jmp  {
    local($@, $!);
    eval { require Carp::Heavy };
    return $@ if $@;
    goto &longmess_real;
}
sub shortmess_jmp  {
    local($@, $!);
    eval { require Carp::Heavy };
    return $@ if $@;
    goto &shortmess_real;
}

sub croak   { die  shortmess @_ }
sub confess { die  longmess  @_ }
sub carp    { warn shortmess @_ }
sub cluck   { warn longmess  @_ }

1;
__END__

