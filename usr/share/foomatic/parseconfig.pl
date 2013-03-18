#!/usr/bin/perl

my $configpath = "/etc/foomatic";

sub readConfFile
{
    my ($file) = @_;

    my %conf;
    # Read config file if present
    if (open CONF, "< $file")
    {
        while (<CONF>)
        {
            $conf{$1}="$2" if (m/^\s*([^\#\s]\S*)\s*:\s*(.*)\s*$/);
        }
        close CONF;
    }

    return %conf;
}

%conf = readConfFile("$configpath/filter.conf");
print( 'db_set foomatic-filters/filter_debug ',
       $conf{debug} > 0 ? 'true' : 'false', ";\n") if exists $conf{debug};
if (exists $conf{textfilter})
{
    if ($conf{textfilter} =~ m/^(a2ps|enscript|mpage)$/)
    {
        print "db_set foomatic-filters/textfilter $1;\n";
    }
    elsif ($conf{textfilter} =~ m/^\s*$/)
    {
        print "db_set foomatic-filters/textfilter Automagic;\n";
    }
    else
    {
        print "db_set foomatic-filters/textfilter Custom;\n";
        print "db_set foomatic-filters/custom_textfilter $conf{textfilter};\n";
    }
}
print( 'db_set foomatic-filters/ps_accounting ',
       $conf{ps_accounting} ? 'true' : 'false',
       "\n") if exists $conf{ps_accounting};
