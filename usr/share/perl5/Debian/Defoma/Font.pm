package Debian::Defoma::Font;

use strict;
use POSIX;
use Exporter;

use vars qw(@EXPORT @ISA %Fobjs $Userspace);

use Debian::Defoma::Common;
import Debian::Defoma::Common qw(&arg_check &arg_check_category &get_files);
use Debian::Defoma::FontCache;

@ISA = qw(Exporter);
@EXPORT = qw(&defoma_font_init &defoma_font_register &defoma_font_unregister
	     &defoma_font_reregister &defoma_font_term
	     &defoma_font_if_register &defoma_font_get_fonts
	     &defoma_font_get_hints &defoma_font_get_failed
	     &defoma_font_get_object);

%Fobjs = ();
$Userspace = 1;

sub defoma_font_init {
    %Fobjs = ();
    &Debian::Defoma::FontCache::initialize(ROOTDIR);

    my @list = get_files("\\.font-cache\$", ROOTDIR);
    my $o;
    my $i;
    
    foreach $i (@list) {
	$i =~ s/\.font-cache$//;

	$o = new Debian::Defoma::FontCache($i);
	$o->read();
	$Fobjs{$i} = $o;
    }

    return 0;
}

sub defoma_font_check_font {
    my $font = shift;
    my @list = values(%Fobjs);
    
    foreach my $fobj (@list) {
	if (exists($fobj->{cache_list}->{$font})) {
	    return $fobj->{category};
	}
    }

    return '';
}

sub defoma_font_get_object {
    my $category = shift;

    unless (exists($Fobjs{$category})) {
	my $fo = $Fobjs{$category} = new Debian::Defoma::FontCache($category);
    }

    return $Fobjs{$category};
}

sub defoma_font_register {
    my $category = shift;
    my $font = shift;
    my @hints = @_;

    arg_check($font, $category) || return 1;
    arg_check_category($category) || return 1;

    my $fobj;
    if (exists($Fobjs{$category})) {
	$fobj = $Fobjs{$category};
    } else {
	$fobj = $Fobjs{$category} = new Debian::Defoma::FontCache($category);
    }

    my $s = defoma_font_check_font($font);
    if ($s ne '') {
	printw("$font: already registered in category $s.");
	return 1;
    }

    $fobj->add_font($font, @hints);
    $fobj->add_user($font) if (USERSPACE && $Userspace);
    $Userspace = 1;

    printv("Registering $font..");

    &Debian::Defoma::Configure::call_m($fobj, 'register', $category, $font,
				       @hints);

    return 0;
}

sub defoma_font_unregister {
    my $category = shift;
    my $font = shift;
    my $fobj;
    
    unless (exists($Fobjs{$category})) {
	printw("$category: Category not found.");
	return 1;
    }

    $fobj = $Fobjs{$category};

    unless (exists($fobj->{cache_list}->{$font})) {
	printw("$font: not registered.");
	return 1;
    }

    my @hints = split(' ', $fobj->{cache_list}->{$font});

    printv("Unregistering $font..");

    &Debian::Defoma::Configure::call_m($fobj, 'unregister', $category, $font,
				       @hints);

    $fobj->remove_font($font);
    $fobj->remove_user($font) if (USERSPACE);

    return 0;
}

sub defoma_font_reregister {
    my $category = shift;
    my $font = shift;
    my @hints0;

    my $c = defoma_font_check_font($font);

    if ($c ne '') {
	if ($c eq $category) {
	    @hints0 = defoma_font_get_hints($c, $font);
	    
	    if (@hints0 == @_) {
		my $i = 0;
		while ($i < @hints0 && $i < @_) {
		    last if ($hints0[$i] ne $_[$i]);
		    $i++;
		}

		return 0 if ($i == @_);
	    }
	}

	defoma_font_unregister($c, $font);
    }

    my $r = defoma_font_register($category, $font, @_);
	
    return $r;
}

sub defoma_font_term {
    my $fobj;
    my @list = values(%Fobjs);

    foreach $fobj (@list) {
	$fobj->write();
    }

    return 0;
}

sub defoma_font_if_register {
    my $category = shift;
    my $font = shift;

    if (exists($Fobjs{$category})) {
	return 1 if (exists($Fobjs{$category}->{cache_list}->{$font}));
    }

    return 0;
}

sub defoma_font_get_fonts {
    my $category = shift;
    my @ret = ();

    if (exists($Fobjs{$category})) {
	my $fobj = $Fobjs{$category};
	@ret = keys(%{$fobj->{cache_list}});
    }

    return @ret;
}

sub defoma_font_get_hints {
    my $category = shift;
    my $font = shift;
    my @ret = ();

    if (exists($Fobjs{$category})) {
	my $fobj = $Fobjs{$category};
	if (exists($fobj->{cache_list}->{$font})) {
	    @ret = split(' ', $fobj->{cache_list}->{$font});
	}
    }

    return @ret;
}

sub defoma_font_get_failed {
    my $category = shift;
    my $font = shift;
    my %ret = ();

    if (exists($Fobjs{$category})) {
	my $fobj = $Fobjs{$category};
	if (exists($fobj->{fcache_list}->{$font})) {
	    %ret = %{$fobj->{fcache_list}->{$font}};
	}
    }

    return %ret;
}

1;    
    
    
	
