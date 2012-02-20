package Debian::Defoma::FontCache;
use strict;
use POSIX;
use FileHandle;

my $Rootdir = '';

sub initialize {
    $Rootdir = shift;
}

sub new {
    my $class = shift;
    my $c;

    my $o = {
	category => shift,
	updated => 0,
	cache_list => {},
	fcache_list => {},
	ucache_list => {},
	rootdir => shift
    };

    $o->{rootdir} = $Rootdir unless (defined($o->{rootdir}));

    bless $o;
    return $o;
}

sub read {
    my $o = shift;
    my $c = $o->{category};
    my $rootdir = $o->{rootdir};

    my $file = "$rootdir/$c.font-cache";
    my $fh = new FileHandle($file, "r");
    if (defined($fh)) {
	while (<$fh>) {
	    chomp($_);
	    $_ =~ /^([^ ]+)[ ]+(.*)$/;
	    $o->{cache_list}->{$1} = $2;
	}
	$fh->close();
    }
    
    $file = "$rootdir/$c.failed-font-cache";
    $fh = new FileHandle($file, "r");
    if (defined($fh)) {
	while (<$fh>) {
	    chomp($_);
	    $_ =~ /^([^ ]+) ([^ ]+) ([^ ]+)$/;
	    unless (exists($o->{fcache_list}->{$1})) {
		$o->{fcache_list}->{$1} = {};
	    }
	    $o->{fcache_list}->{$1}->{$2} = $3;
	}
	$fh->close();
    }

    $file = "$rootdir/$c.user-font-cache";
    $fh = new FileHandle($file, "r");
    if (defined($fh)) {
	while (<$fh>) {
	    chomp($_);
	    $o->{ucache_list}->{$_} = undef;
	}
	$fh->close();
    }

    return 0;
}

sub write {
    my $o = shift;
    my $c = $o->{category};
    my $rootdir = $o->{rootdir};
    my ($a, $max, $f);
    my @fonts;

    my $file = "$rootdir/$c.font-cache";
    my $fh = new FileHandle($file, "w");
    if (defined($fh)) {
	@fonts = keys(%{$o->{cache_list}});
	foreach $f (@fonts) {
	    $fh->print($f, ' ', $o->{cache_list}->{$f}, "\n");
	}
	$fh->close();
    }
    unlink($file) unless(-s $file);

    $file = "$rootdir/$c.failed-font-cache";
    $fh = new FileHandle($file, "w");
    if (defined($fh)) {
	@fonts = keys(%{$o->{fcache_list}});
	foreach $f (@fonts) {
	    my @apps = keys(%{$o->{fcache_list}->{$f}});
	    foreach $a (@apps) {
		$fh->print($f, ' ', $a, ' ', $o->{fcache_list}->{$f}->{$a},
			   "\n");
	    }
	}
	$fh->close();
    }
    unlink($file) unless(-s $file);

    $file = "$rootdir/$c.user-font-cache";
    $fh = new FileHandle($file, "w");
    if (defined($fh)) {
	@fonts = keys(%{$o->{ucache_list}});
	foreach $f (@fonts) {
	    $fh->print($f, "\n");
	}
	$fh->close();
    }
    unlink($file) unless(-s $file);

    return 0;
}

sub add_font {
    my $o = shift;
    my $font = shift;
    my @hints = @_;

    $o->{cache_list}->{$font} = join(' ', @hints);
    $o->{updated} = 1;

    return 0;
}

sub add_failed {
    my $o = shift;
    my $f = shift;
    my $a = shift;
    my $e = shift;

    $o->{fcache_list}->{$f} = {} unless (exists($o->{fcache_list}->{$f}));
    $o->{fcache_list}->{$f}->{$a} = $e;
    
    return 0;
}

sub add_user {
    my $o = shift;
    my $f = shift;

    $o->{ucache_list}->{$f} = undef;
}

sub remove_font {
    my $o = shift;
    my $f = shift;

    delete($o->{cache_list}->{$f});
    $o->{updated} = 1;

    return 0;
}

sub remove_failed {
    my $o = shift;
    my $f = shift;
    my $a = shift;

    if (exists($o->{fcache_list}->{$f}->{$a})) {
	delete($o->{fcache_list}->{$f}->{$a});
	return 1;
    }
    return 0;
}

sub remove_user {
    my $o = shift;
    my $f = shift;

    if (exists($o->{ucache_list}->{$f})) {
	delete($o->{ucache_list}->{$f});
    }
}

1;
