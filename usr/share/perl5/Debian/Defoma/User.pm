package Debian::Defoma::User;

use strict;
use POSIX;
use Exporter;

use vars qw(@EXPORT @EXPORT_OK @ISA);

use Debian::Defoma::Font;
use Debian::Defoma::Common;
import Debian::Defoma::Common qw(&readfile &writefile);

@ISA = qw(Exporter);

@EXPORT = qw(&defoma_user_update_dotfile);
@EXPORT_OK = qw(&defoma_user_init &defoma_user_update_font);

my %SystemFontUpdateTime;
my $SystemUpdateTime;
my $SystemRoot = DEFOMA_TEST_DIR . "/var/lib/defoma";

sub defoma_user_init {
    &Debian::Defoma::Configure::read_status_cache($SystemRoot);

    &Debian::Defoma::Configure::get_status(\%SystemFontUpdateTime,
					   \$SystemUpdateTime);
    
    &Debian::Defoma::Configure::clear_app_info();
}

sub defoma_user_update_font {
    my %UserFontUpdateTime;
    my $UserUpdateTime;

    &Debian::Defoma::Configure::get_status(\%UserFontUpdateTime,
					   \$UserUpdateTime);

    my @cs = ();
    foreach my $c (keys(%SystemFontUpdateTime)) {
	unless (defined($UserFontUpdateTime{$c}) &&
		$UserFontUpdateTime{$c} >= $SystemFontUpdateTime{$c}) {
	    push(@cs, $c);
	}
    }

    if (@cs) {
	printm("Following font categories are updated in system: @cs");
	printm("Updating ", USERLOGIN, "'s font caches...");

	foreach my $c (@cs) {
	    printm(" Updating category $c..");

	    my $sfobj = new Debian::Defoma::FontCache($c, $SystemRoot);
	    $sfobj->read();
	    my $ufobj = defoma_font_get_object($c);
	    $ufobj->{updated} = 1;
	    
	    foreach my $f (keys(%{$ufobj->{cache_list}})) {
		if (! exists($sfobj->{cache_list}->{$f}) &&
		    ! exists($ufobj->{ucache_list}->{$f})) {
		    defoma_font_unregister($c, $f);
		}
	    }

	    foreach my $f (keys(%{$sfobj->{cache_list}})) {
		if (! exists($ufobj->{ucache_list}->{$f})) {
		    my @hints = split(' ', $sfobj->{cache_list}->{$f});
		    $Debian::Defoma::Font::Userspace = 0;
		    defoma_font_reregister($c, $f, @hints);
		}
	    }
	}
    } else {
	printm("All font categories are configured up-to-date for ",
	       USERLOGIN, ".");
    }
}
    
sub defoma_user_update_dotfile {
    my $filename = shift;
    my $begin = shift;
    my $end = shift;

    my @r = readfile(HOMEDIR . "/$filename");
    my @w = ();

    my $flag = 0;
    foreach my $l (@r) {
	if (defined($begin) && $begin ne '' && $begin eq $l) {
	    $flag = 1;
	} elsif (defined($end) && $end ne '' && $end eq $l) {
	    $flag = 0;
	} elsif ($flag == 0) {
	    push(@w, $l);
	}
    }

    push(@w, $begin, @_, $end);

    writefile(HOMEDIR . "/$filename", @w);
}

1;
