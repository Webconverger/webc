### minimal pod, so you can find it with perldoc -l, etc
=pod

=head1 NAME

CPANPLUS::Config::System - system configuration for CPANPLUS

=head1 DESCRIPTION

This is a CPANPLUS configuration file that sets appropriate default
settings on Debian systems.

The only preconfigured settings are C<makemakerflags> (set to
C<INSTALLDIRS=site>) and C<buildflags> (set to C<--installdirs site>).

These settings will not have any effect if
C</etc/perl/CPANPLUS/Config/System.pm> is present.

=cut


package CPANPLUS::Config::System;

sub setup {
    my $conf = shift;
    $conf->set_conf( makemakerflags => 'INSTALLDIRS=site' );    
    $conf->set_conf( buildflags => '--installdirs site' );    
}

1;
