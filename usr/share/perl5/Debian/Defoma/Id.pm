package Debian::Defoma::Id;

use strict;
use POSIX;
use Exporter;

use vars qw(@EXPORT @EXPORT_OK @ISA $DEFAULT_PACKAGE $DEFAULT_CATEGORY
	    $Purge $IDOBJECT);

use Debian::Defoma::Common;
use Debian::Defoma::IdCache;
import Debian::Defoma::Common qw(&register_id_object &get_id_object
				 &arg_check
				 $DEFAULT_PACKAGE $DEFAULT_CATEGORY);


@ISA = qw(Exporter);

@EXPORT = qw(&defoma_id_register &defoma_id_unregister
	     &defoma_id_open_cache &defoma_id_close_cache
	     &defoma_id_get_font &defoma_id_grep_cache
	     &defoma_id_set &defoma_id_unset
	     &defoma_id_update &defoma_id_get_hints);
@EXPORT_OK = qw($IDOBJECT);

my %TYPE = ('r' => 'real', 'a' => 'alias', 'S' => 'subst');
my %RTYPE = ('real' => 'Sr', 'alias' => 'Sa', 'subst' => 'SS',
	     'useralias' => 'Ua');

$Purge = 0;
undef $IDOBJECT;

sub emes {
    my $o = shift;
    my $pkg = $o->{pkg} || $DEFAULT_PACKAGE || 'Unknown';
    
    printw("Id: $pkg: ", @_);
}

sub emesd {
    my $o = shift;
    my $pkg = $o->{pkg} || $DEFAULT_PACKAGE || 'Unknown';
    
    printd("Id: $pkg: ", @_);
}

my $Obj;

sub sorter {
    my $a1 = $Obj->{2}->[$a];
    $a1 =~ s/^(..)(.*)/$1/;
    my $a2 = $2;
    my $a3 = $Obj->{3}->[$a];
  
    my $b1 = $Obj->{2}->[$b];
    $b1 =~ s/^(..)(.*)/$1/;
    my $b2 = $2;
    my $b3 = $Obj->{3}->[$b];

    ($b1 ne $a1) && return ($b1 cmp $a1);
    ($b3 != $a3) && return ($b3 <=> $a3);

    return -1 if ($a2);
    return 1 if ($b2);
    
    return 0;
}

sub check_if_installed {
    my $obj = shift;
    my $id = shift;
    my $font = shift;
    my @ret = ();

    if ($id ne '.' && $font ne '.') {
	if (exists($obj->{hash01}->{$id.' '.$font})) {
	    my $i = $obj->{hash01}->{$id.' '.$font};
	    return ($obj->{2}->[$i] =~ /I$/);
	} else {
	    return 0;
	}
#	return $obj->grep('installed', f0 => $id, f1 => $font);
    } elsif ($id ne '.' && $font eq '.') {
#	return $obj->grep('installed', f0 => $id);
	return exists($obj->{hash0_installed}->{$id});
    } elsif ($id eq '.' && $font ne '.') {
	return $obj->grep('installed', f1 => $font);
    }

    return @ret;
}

sub get_top_prior {
    my $obj = shift;
    my $id = shift;
    my @index;
    my %exclude = ();
    my $i;
    my $j;
    my @list;

    # Check marked fonts providing the id first.
    @index = $obj->grep('mark', f0 => $id);
    @index = sort (@index);

    foreach $i (@index) {
	# If a certain font is marked as 'install'...
	if ($obj->{2}->[$i] eq 'Mu') {
	    # Check if the font is actually registered,
#	    @list = $obj->grep('font', f1 => $obj->{1}->[$i],
#			       f0 => $obj->{0}->[$i]);
#	    if (@list) {
#		$j = $list[0];
	    if (exists($obj->{hash01}->{$obj->{0}->[$i].' '.$obj->{1}->[$i]})){
		# In case the font is registered:
		$j = $obj->{hash01}->{$obj->{0}->[$i].' '.$obj->{1}->[$i]};

		if ($obj->{5}->[$j] ne '.' || $obj->{6}->[$j] ne '.') {
		    # If the font depends on another font, and that font
		    # is not actually installed, ignore the 'install' flag.
		    next unless (check_if_installed($obj, $obj->{5}->[$j],
						    $obj->{6}->[$j]));
		}
		
		return $j;
	    }
	} elsif ($obj->{2}->[$i] eq 'Mx' or $obj->{2}->[$i] eq 'MX') {
	    # If a certain font is marked as 'exclude'...
	    $exclude{$obj->{1}->[$i]} = 1;
	}
    }

    # Check all fonts providing the id.
    @index = $obj->grep('font', f0 => $id);
    $Obj = $obj;
    @index = sort sorter (@index);

    foreach $i (@index) {
	next if (exists($exclude{$obj->{1}->[$i]}));
	next if (exists($obj->{unregistering}->{$i}));

	my $did = $obj->{5}->[$i];
	my $dfont = $obj->{6}->[$i];

	if ($did ne '.' || $dfont ne '.') {
	    # If the font depends on another font, and that font is not
	    # actually installed, ignore it.
	    next unless (check_if_installed($obj, $did, $dfont));
	}

	return $i;
    }

    return -1;
}

sub call_do_remove {
    my $obj = shift;
    my $i = shift;

    my $id = $obj->{0}->[$i];
    
    $obj->{2}->[$i] =~ /^.(.)I$/;
    my $typestr = $TYPE{$1};

    my $depid = ($obj->{5}->[$i] eq '.') ? '' : $obj->{5}->[$i];
    my $depfont = ($obj->{6}->[$i] eq '.') ? '' : $obj->{6}->[$i];

    my @hints = defoma_id_get_hints($obj, $i);

    $IDOBJECT = $obj;
    
    &Debian::Defoma::Configure::call_1(0, $obj->{pkg},
				       "do-remove-$typestr", $obj->{4}->[$i],
				       $obj->{1}->[$i], $id, $depfont, $depid,
				       @hints) if ($obj->{callback});

    $obj->uninstall($i);

    do_update_depend(0, $obj, $id, $obj->{1}->[$i]);
}

sub call_do_install {
    my $obj = shift;
    my $i = shift;

    my $id = $obj->{0}->[$i];

    $obj->{2}->[$i] =~ /^.(.)$/;
    my $typestr = $TYPE{$1};
    
    my $depid = ($obj->{5}->[$i] eq '.') ? '' : $obj->{5}->[$i];
    my $depfont = ($obj->{6}->[$i] eq '.') ? '' : $obj->{6}->[$i];

    my @hints = defoma_id_get_hints($obj, $i);

    my $font = $obj->{1}->[$i];
    my $ctg = $obj->{4}->[$i];

    $obj->install($i);

    $IDOBJECT = $obj;
    
    my $ret = 0;
    $ret = &Debian::Defoma::Configure::call_1(0, $obj->{pkg},
					      "do-install-$typestr", $ctg,
					      $font, $id, $depfont, $depid,
					      @hints) if ($obj->{callback});
    
    if ($ret) {
	$obj->uninstall($i);
	
	do_set($obj, $id, $font, 'error');
	
	my $text = <<EOF
Following package\'s configuration script returned error($ret) during doing do-install-$typestr.
  Package\: $obj->{pkg}
  Category\: $ctg
  Installing Font\: $font
  Installing ID\: $id
Defoma has set this font as \'exclude\' to keep it from being installed.
You can still have it installed by unsetting the \'exclude\' mark after the cause of the error gets removed.
EOF
    ;
	printw($text) if ($ret == 1);

	do_update($obj, $id);
    } else {
	do_update_depend(1, $obj, $id, $font);
    }
}
    
sub do_update {
    my $obj = shift;
    my $id = shift;
    my $i1 = -1;
    my $i2 = -1;
    my $font1 = '';
    my $font2 = '';
    my @list;

#    @list = $obj->grep('installed', f0 => $id);
#    if (@list > 0) {
#	$i1 = $list[0];
    
    if (exists($obj->{hash0_installed}->{$id})) {
	$i1 = $obj->{hash0_installed}->{$id};
	
	$font1 = $obj->{1}->[$i1];
    }

    $i2 = get_top_prior($obj, $id);
    if ($i2 >= 0) {
	$font2 = $obj->{1}->[$i2];
    }

    return if ($font1 eq $font2);

    if ($i1 >= 0) {
	call_do_remove($obj, $i1);
    }

    return if ($obj->{delay});

    if ($i2 >= 0) {
	call_do_install($obj, $i2);
    }
}

sub do_update_depend {
    my $com = shift;
    my $obj = shift;
    my $id = shift;
    my $font = shift;

    my @l;
    my %list;
    
    if (exists($obj->{hash5}->{$id})) {
	@l = keys(%{$obj->{hash5}->{$id}});
	grep($list{$_} = undef, @l);
    }
    if (exists($obj->{hash6}->{$font})) {
	@l = keys(%{$obj->{hash6}->{$font}});
	grep($list{$_} = undef, @l);
    }

    foreach my $i (keys(%list)) {
	next if ($obj->{5}->[$i] ne '.' && $obj->{5}->[$i] ne $id);
	next if ($obj->{6}->[$i] ne '.' && $obj->{6}->[$i] ne $font);
	next if ($com == 0 && $obj->{2}->[$i] !~ /I$/);
	next if ($com == 1 && $obj->{2}->[$i] =~ /I$/);

	do_update($obj, $obj->{0}->[$i]);
    }
}

sub do_unset {
    my $obj = shift;
    my $id = shift;
    my $font = shift;

#    my @list = $obj->grep('mark', f0 => $id, f1 => $font, r2 => '^M[ux]');
#    if (@list > 0) {
#	$obj->delete(@list);
    if (exists($obj->{hash01_mark}->{$id.' '.$font})) {
	$obj->delete($obj->{hash01_mark}->{$id.' '.$font});
    }
}

sub do_set {
    my $obj = shift;
    my $id = shift;
    my $font = shift;
    my $type = shift;
    my $typestr;

    if ($type eq 'install') {
	$typestr = 'Mu';
    } elsif ($type eq 'exclude') {
	$typestr = 'MX';
    } elsif ($type eq 'error') {
	$typestr = 'Mx';
    }
    
    if ($type eq 'install') {
	my @list = $obj->grep('mark', f0 => $id, f2 => 'Mu');
	if (@list > 0) {
	    $obj->delete($list[0]);
	}
    }

    if (exists($obj->{hash01_mark}->{$id . ' '. $font})) {
	$obj->delete($obj->{hash01_mark}->{$id . ' '. $font});
    }

    return $obj->add($id, $font, $typestr, '-', '-', '-', '-', '-');
}

sub defoma_id_open_cache {
    my $suffix = (@_ > 0) ? shift(@_) : '';
    my $pkg = (@_ > 0) ? shift(@_) : $DEFAULT_PACKAGE;
    my $o;

    $suffix =~ s/[^a-zA-Z0-9_-]/_/g;

    $o = get_id_object($pkg, $suffix);
    return $o if ($o);

    my $file = ROOTDIR . '/' . $pkg . '.d/id-cache';
    $file .= '.' . $suffix if ($suffix);

    $o = new Debian::Defoma::IdCache($file, $pkg, $suffix);
    $o->read();

    register_id_object($o, $pkg, $suffix);

    return $o;
}

sub defoma_id_close_cache {
    my $o = shift;
    if ($o) {
	$o->write();
    }
}

sub defoma_id_register {
    my $obj = shift;
    my %args = @_;

    unless (exists($args{type}) && exists($args{font}) && exists($args{id}) &&
	    exists($args{priority})) {
	emes($obj, "register: Required argument is missing.");
	return -1;
    }

    my $comtype = $args{type};
    my $font = $args{font};
    my $id = $args{id};
    my $priority = $args{priority};

    if ($comtype !~ /^(real|alias|useralias|subst)$/) {
	emes($obj, "Unknown type '$comtype'.");
	return -1;
    }
    
    my $type = $RTYPE{$comtype};

    arg_check($id, $font, $priority) || return -1;

    return -1 if ($priority =~ /[^0-9]/);
    $priority = 999 if ($priority >= 1000);
    $priority = 0 if ($priority < 0);

    my $category = $DEFAULT_CATEGORY;
    my $depfont = '.';
    my $depid = '.';
    my $hints = '';
    my $i;
    my $dependflag = 0;
    my @l;

    $category = $args{category} if (exists($args{category}));

    if (exists($args{depend})) {
	@l = split(/ /, $args{depend});
	if (@l == 2) {
	    $depfont = $l[0];
	    $depid = $l[1];
	}
    }

    if (exists($args{origin})) {
	$depfont = $font;
	$depid = $args{origin};
    }

    if (exists($args{hints})) {
	if ($type eq 'Sr') {
	    $hints = $args{hints};
	} else {
	    emesd($obj, "register: Only type => 'real' accepts 'hints'.");
	}
    }

    if ($type ne 'Sr' && ($depid eq '.' || $depfont eq '.')) {
	emes($obj, "'$comtype' requires 'origin' be specified.");
	return -1;
    }

#    if ($obj->grep('font', f0 => $id, f1 => $font)) {
    if (exists($obj->{hash01}->{$id.' '.$font})) {
	emesd($obj, "$id: already registered by $font.");
	return -1;
    }

    $obj->add($id, $font, $type, $priority, $category, $depid, $depfont,
	      $hints);

    do_update($obj, $id);

    return 0;
}

sub defoma_id_unregister {
    my $obj = shift;
    my %args = @_;

    unless (exists($args{type}) && exists($args{font})) {
	emes($obj, "register: Required argument is missing.");
	return -1;
    }

    my $comtype = $args{type};
    my $font = $args{font};
    my $id = (exists($args{id})) ? $args{id} : '';

    if ($comtype !~ /^(real|alias|subst)$/) {
	emes($obj, "Unknown type '$comtype'.");
	return -1;
    }

    my @index;
    my ($i, $m);

    my $j = -1;
    if ($id eq '') {
	@index = $obj->grep($comtype, f1 => $font);
    } else {
#	@index = $obj->grep($comtype, f0 => $id, f1 => $font);
	if (exists($obj->{hash01}->{$id.' '.$font})) {
	    $j = $obj->{hash01}->{$id.' '.$font};
	    $index[0] = $j if ($obj->{2}->[$j] =~ /^$RTYPE{$comtype}/);
	}
    }

    return -1 unless(@index);

    foreach $i (@index) {
	next if ($obj->{2}->[$i] =~ /^Ua/ && $Purge == 0);
	$id = $obj->{0}->[$i];

	$obj->{unregistering}->{$i} = '';


	do_update($obj, $id);

#	do_unset($obj, $id, $font) if ($Purge);

	$obj->delete($i);
	delete($obj->{unregistering}->{$i});

	if (exists($obj->{hash01_mark}->{$id.' '.$font})) {
	    $j = $obj->{hash01_mark}->{$id.' '.$font};
	    $obj->delete($j) if ($obj->{2}->[$j] eq 'Mx' || $Purge);
	}

#	my @l = $obj->grep('mark', f0 => $id, f1 => $font);
#	if (@l) {
#	    $obj->delete(@l);
#	}
    }
}

sub sort_result {
    $Obj = shift;
    my $sorttype = shift;
    my $sortkey = shift;
    
    if ($sorttype eq 'p') {
	return sort sorter (@_);
    } elsif ($sorttype eq 'n') {
	return sort { $Obj->{$sortkey}->[$a] <=> $Obj->{$sortkey}->[$b] } (@_);
    } elsif ($sorttype eq 'a') {
	return sort { $Obj->{$sortkey}->[$a] cmp $Obj->{$sortkey}->[$b] } (@_);
    }
}

my %Conv = ( id => 'f0', font => 'f1', type => 'f2', priority => 'f3',
	     category => 'f4', depid => 'f5', depfont => 'f6', hints => 'f7');

sub convert_grep_argument {
    my @ret = ();
    
    while (@_ > 0) {
	my $key = shift;
	my $value = shift;

	if (exists($Conv{$key})) {
	    push(@ret, $Conv{$key}, $value);
	} else {
	    push(@ret, $key, $value);
	}
    }

    return @ret;
}

sub defoma_id_grep_cache {
    my $o = shift;
    my $t = shift;
    my %args = convert_grep_argument(@_);
    my @ret = ();
    my $sorttype = '';
    my $sortkey;

    if (exists($args{sortkey})) {
	$sortkey = $args{sortkey};
	if (exists($Conv{$sortkey})) {
	    $Conv{$sortkey} =~ /^(.)(.)/;
	    $sortkey = $2;
	} else {
	    undef $sortkey;
	}
	delete $args{sortkey};
    }

    if (exists($args{sorttype})) {
	$sorttype = $args{sorttype};
	undef $sorttype if ($sorttype !~ /^[nap]$/);
	undef $sorttype if ($sorttype =~ /^[na]$/ && ! defined($sortkey));
	delete $args{sorttype};
    }
    
    if (exists($args{f0}) && exists($args{f1})) {
	if ($t eq 'mark') {
	    if (exists($o->{hash01_mark}->{$args{f0}.' '.$args{f1}})) {
		push(@ret, $o->{hash01_mark}->{$args{f0}.' '.$args{f1}});
	    }
	} else {
	    if (exists($o->{hash01}->{$args{f0}.' '.$args{f1}})) {
		push(@ret, $o->{hash01}->{$args{f0}.' '.$args{f1}});
	    }
	}
	@ret = sort_result($o, $sorttype, $sortkey, @ret) if ($sorttype);
	return @ret;
    }

    if (exists($args{f0}) && $t eq 'installed') {
	if (exists($o->{hash0_installed}->{$args{f0}})) {
	    push(@ret, $o->{hash0_installed}->{$args{f0}});
	}
	@ret = sort_result($o, $sorttype, $sortkey, @ret) if ($sorttype);
	return @ret;
    }

    @ret = $o->grep($t, %args);
    @ret = sort_result($o, $sorttype, $sortkey, @ret) if ($sorttype);
    return @ret;
}

sub defoma_id_get_font {
    return defoma_id_grep_cache(@_);
}

sub defoma_id_update {
    my $o = shift;
    my $id = shift;

    do_update($o, $id);
}

sub defoma_id_get_hints {
    my $obj = shift;
    my $i = shift;

    my $type = $obj->{2}->[$i];
    my $id;
    my $font;
    my $h;

    if ($type =~ /^Sr/) {
	return split(' ', $obj->{7}->[$i]);
    } else {
	$id = $obj->{5}->[$i];
	$font = $obj->{6}->[$i];
	
	if (exists($obj->{hash01}->{$id.' '.$font})) {
	    my $j = $obj->{hash01}->{$id.' '.$font};
	    return split (' ', $obj->{7}->[$j]);
	} else {
	    return undef;
	}
    }
    
#    my @list = $obj->grep('real', f0 => $id, f1 => $font);
#    if (@list > 0) {
#	return $obj->{7}->[$list[0]];
#    } else {
#	return '';
#    }
}

sub defoma_id_set {
    my $obj = shift;
    my $id = shift;
    my $font = shift;
    my $mark = shift;

    do_set($obj, $id, $font, $mark);
    do_update($obj, $id);
}

sub defoma_id_unset {
    my $obj = shift;
    my $id = shift;
    my $font = shift;

    do_unset($obj, $id, $font);
    do_update($obj, $id);
}


    

1;

