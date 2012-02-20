package Debian::Defoma::Subst;;

use strict;
use POSIX;
use Exporter;
use Debian::Defoma::Common;
use Debian::Defoma::SubstCache;
use Debian::Defoma::Id;
import Debian::Defoma::Common qw(&register_subst_object &get_subst_object
				 $DEFAULT_PACKAGE $DEFAULT_CATEGORY);

use vars qw(@EXPORT @ISA $DEFAULT_PACKAGE $DEFAULT_CATEGORY);

@ISA = qw(Exporter);
@EXPORT = qw(&defoma_subst_open &defoma_subst_close
	     &defoma_subst_register &defoma_subst_unregister
	     &defoma_subst_add_rule &defoma_subst_remove_rule
	     &defoma_subst_remove_rule_by_num &defoma_subst_newrule);

sub emes {
    if ($DEFAULT_PACKAGE && $DEFAULT_CATEGORY) {
	printw("Subst: $DEFAULT_PACKAGE/$DEFAULT_CATEGORY: ", @_);
    } else {
	printw("Subst: ", @_);
    }
}

sub emesd {
    if ($DEFAULT_PACKAGE && $DEFAULT_CATEGORY) {
	printd("Subst: $DEFAULT_PACKAGE/$DEFAULT_CATEGORY: ", @_);
    } else {
	printd("Subst: ", @_);
    }
}

sub generate_hash {
    my @list = @_;
    my $key = '';
    my $hashptr = {};
    my $flagptr = {};
    my $flag;

    for (my $i = 0; $i < @list; $i++) {
	if ($list[$i] =~ /^--(.*)/) {
	    $key = $list[$i];

	    if ($key =~ /(.+),(.)/) {
		$key = $1;
		$flag = $2;
	    } else {
		$flag = 1;
	    }

	    $flagptr->{$key} = $flag;
	} elsif ($key ne '') {
	    add_hash_list($hashptr, $key, $list[$i]);
	}
    }

    $hashptr->{flag} = $flagptr;

    return $hashptr;
}

sub get_base_priority {
    my $hints = shift;
    my $rule = shift;
    my $priority = 0;
    my ($p, $pc);
    my $matchflag;
    my $i;
    my $j;
    my $k;
    my $key;
    my $max = 0;

    my @rule_keys = keys(%{$rule});
    my @hints_values;
    my @rule_values;

    for ($i = 0; $i < @rule_keys; $i++) {
	$key = $rule_keys[$i];
	next if ($key eq 'flag');

	if (exists($hints->{$key})) {
	    @hints_values = split(' ', $hints->{$key});
	} else {
	    @hints_values = ();
	}
	
	@rule_values = split(/ /, $rule->{$key});

	$matchflag = 0;

	$pc = $p = $rule->{flag}->{$key};
	$p = 1 if ($pc =~ /[^123]/);
	
	for ($j = 0; $j < @rule_values; $j++) {
	    $max += $p;
	    
	    for ($k = 0; $k < @hints_values; $k++) {
		if ($rule_values[$j] eq $hints_values[$k]) {
		    $priority += $p;
		    $matchflag++;
		}
	    }
	}

	if ($matchflag == 0 && $pc eq '*') {
	    return -1;
	}
    }

    return -1 if ($max == 0);

    $priority = int($priority * 100 / $max);
    
    return $priority;
}

sub ar_rule {
    my $com = shift;
    my $sobj = shift;
    my $idx = shift;
    my $ruleid = shift;
    my $prule = shift;

    my $rulename = $sobj->{rulename};
    my $iobj = $sobj->{idobject};
    my $threshold = $sobj->{threshold};
    
    my ($i, $id, $font, $pri, $phints, $ctg, $p, $ret, $j);
    my (@l, @list);
    my @hints;

    $iobj->{delay}++;

    @list = keys(%{$sobj->{cache}});

    foreach $i (@list) {
	@l = split(/ /, $i);
	$font = $l[0];
	$id = $l[1];

	$j = $sobj->{cache}->{$i};

	$phints = $j->{hash};
	$ctg = $j->{category};
	$pri = $j->{priority};

	unless ($phints) {
#	    @l = $iobj->grep('real', f0 => $id, f1 => $font);
#	    next unless(@l);
	    if (exists($iobj->{hash01}->{$id.' '.$font})) {
		$l[0] = $iobj->{hash01}->{$id.' '.$font};
		next unless ($iobj->{2}->[$l[0]] =~ /^Sr/);
	    } else {
		next;
	    }
	    
	    
	    @hints = split(' ', $iobj->{7}->[$l[0]]);
	    
	    $phints = generate_hash(@hints);
	    $j->{hash} = $phints;
	    $j->{category} = $ctg = $iobj->{4}->[$l[0]];
	    $j->{priority} = $pri = $iobj->{3}->[$l[0]] / 10;
	}

	$p = get_base_priority($phints, $prule);
	
	next if ($p < 40);
	next if ($com && $p < $threshold && $sobj->{rule_regnum}->[$idx]);

	$p += $pri;

	if ($com) {
	    $ret = defoma_id_register($iobj, type => 'subst', font => $font,
				      id => $ruleid, priority => $p,
				      category => $ctg, origin => $id);
	    $sobj->{rule_regnum}->[$idx]++ unless ($ret);
	} else {
	    $ret = defoma_id_unregister($iobj, type => 'subst', font => $font,
					id => $ruleid);
	    $sobj->{rule_regnum}->[$idx]-- unless ($ret);
	}
	
    }

    $iobj->{delay}--;
    defoma_id_update($iobj, $ruleid);
}

sub ar_font {
    my $com = shift;
    my $sobj = shift;
    my $font = shift;
    my $id = shift;
    my $pri = shift(@_);
    my $ctg = shift;
    my $phints = shift;

    my $rulename = $sobj->{rulename};
    my $iobj = $sobj->{idobject};
    my $threshold = $sobj->{threshold};

    my @rule;
    
    my ($i, $max, $j, $ruleid, $prule, $p, $ret);
    $max = $sobj->{rule_cnt};

    for ($i = 0; $i < $max; $i++) {
	$j = $sobj->{rule}->[$i];
	next if ($j eq '' || $j =~ /^\#/);
	
	@rule = split(/[ \t]+/, $j);
	$ruleid = shift(@rule);
	$prule = $sobj->{rule_hash}->[$i];
	unless ($prule) {
	    $prule = generate_hash(@rule);
	    $sobj->{rule_hash}->[$i] = $prule;
	}

	$p = get_base_priority($phints, $prule);

	next if ($p < 40);
	next if ($com && $p < $threshold && $sobj->{rule_regnum}->[$i]);

	$p += $pri;

	if ($com) {
	    $ret = defoma_id_register($iobj, type => 'subst', font => $font,
				      id => $ruleid, priority => $p,
				      category => $ctg, origin => $id);
	    $sobj->{rule_regnum}->[$i]++ unless ($ret);
	} else {
	    $ret = defoma_id_unregister($iobj, type => 'subst', font => $font,
					id => $ruleid);
	    $sobj->{rule_regnum}->[$i]-- unless ($ret);
	}

#	&Debian::Defoma::Configure::call_1(0, $sobj->{pkg}, $com, $ctg, $font,
#					   $ruleid, $p, $id, $rulename);
    }
}

sub defoma_subst_open {
    my %args = @_;

    return -1 unless (exists($args{rulename}));
    
    my $rulename = $args{rulename};

    my $threshold = exists($args{threshold}) ? $args{threshold} : 30;
    
    my $idobject = exists($args{idobject}) ? $args{idobject} : '';
    my $pkg = '';
    my $suffix = '';
    if ($idobject) {
	$pkg = $idobject->{pkg};
	$suffix = $idobject->{suffix};
    }

    my $prv = $args{private};
    my $private = '';

    if ($prv) {
	return -1 unless ($idobject);
	$private = $pkg.'/';
    }
    
    my $o = get_subst_object($private . $rulename);
    return $o if ($o);

    my $rulefile;
    my $cachefile;
    
    if ($prv) {
	my $dir = ROOTDIR . '/' . $pkg . '.d/';
	
	$rulefile = $dir . $rulename . '.private-subst-rule';
	$cachefile = $dir . $rulename . '.private-subst-cache';
    } else {
	$rulefile = SUBSTRULEDIR . '/' . $rulename . '.subst-rule';
	$cachefile = ROOTDIR . '/' . $rulename . '.subst-cache';
    }

    $o = new Debian::Defoma::SubstCache($rulename, $cachefile, $rulefile, 
					$pkg, $suffix, $idobject);
    $o->{threshold} = $threshold;
    $o->read();
    
    if (! $idobject && $o->{pkg}) {
	$idobject = $o->{idobject} = defoma_id_open_cache($o->{idsuffix},
							   $o->{pkg});
    }

    if ($idobject) {
	my $max = $o->{rule_cnt};
	my ($i, $j);
	for ($i = 0; $i < $max; $i++) {
	    $j = $o->{rule}->[$i];
	    next if ($j eq '' || $j =~ /^\#/);
	    $j =~ /^([^ \t]+) /;
	    my $ruleid = $1;

	    $o->{rule_regnum}->[$i] = $idobject->grep('subst', f0 => $ruleid);
	}
    }

    register_subst_object($o, $private . $rulename);

    return $o;
}

sub defoma_subst_close {
    my $o = shift;
    if ($o) {
	$o->write();
    }
}

sub defoma_subst_register {
    return -1 if (@_ < 3);
    my $sobj = shift;
    my $font = shift;
    my $id = shift;
    my $iobj = $sobj->{idobject};
    my @l;

    unless ($iobj) {
	emes("IdObject is not set in SubstObject.");
	return -1;
    }

    if (exists($sobj->{cache}->{$font.' '.$id})) {
	emesd("$font, $id: already registered in subst-cache.");
	return -1;
    }

#    @l = $iobj->grep('real', f0 => $id, f1 => $font);
#    unless (@l) {
    unless (exists($iobj->{hash01}->{$id.' '.$font})) {
	emesd("$font, $id: not registered in id-cache.");
	return -1;
    }
    $l[0] = $iobj->{hash01}->{$id.' '.$font};
    unless ($iobj->{2}->[$l[0]] =~ /^Sr/) {
	emesd("$font, $id: not registered in id-cache.");
	return -1;
    }

    my @hints = split(' ', $iobj->{7}->[$l[0]]);
    my $hash = generate_hash(@hints);
    my $pri = $iobj->{3}->[$l[0]] / 10;
    my $ctg = $iobj->{4}->[$l[0]];
    
    $sobj->add_cache($font, $id, $hash, $pri, $ctg);

    ar_font(1, $sobj, $font, $id, $pri, $ctg, $hash);

    return 0;
}

sub defoma_subst_unregister {
    return -1 if (@_ < 2);
    my $sobj = shift;
    my $font = shift;
    my $id = shift;
    my $iobj = $sobj->{idobject};
    my ($hash, $pri, $ctg);
    my (@hints, @l);

    unless ($iobj) {
	emes("$sobj->{rulename}: IdObject is not set in SubstObject.");
	return -1;
    }

    my @ids = ();
    
    if ($id) {
	if (exists($sobj->{cache}->{$font.' '.$id})) {
	    push(@ids, $id);
	} else {
	    emesd("$font, $id: not registered in subst-cache.");
	    return -1;
	}
    } else {
	@l = keys(%{$sobj->{cache}});
	foreach $id (@l) {
	    $id =~ /^([^ ]+) ([^ ]+)$/;
	    push(@ids, $2) if ($1 eq $font);
	}
    }

    foreach $id (@ids) {
	my $p = $sobj->{cache}->{$font.' '.$id};

	$hash = $p->{hash};
	$ctg = $p->{category};
	$pri = $p->{priority};
	unless ($hash) {
#	    @l = $iobj->grep('real', f0 => $id, f1 => $font);
	    if (exists($iobj->{hash01}->{$id.' '.$font})) {
		$l[0] = $iobj->{hash01}->{$id.' '.$font};
		next unless ($iobj->{2}->[$l[0]] =~ /^Sr/);
	    } else {
		next;
	    }
	    @hints = split(' ', $iobj->{7}->[$l[0]]);

	    $hash = generate_hash(@hints);
	    $pri = $iobj->{3}->[$l[0]];
	}

	ar_font(0, $sobj, $font, $id, $pri, $ctg, $hash);

	delete($sobj->{cache}->{$font.' '.$id});
    }
    
    return 0;
}
    
sub defoma_subst_add_rule {
    my $sobj = shift;
    my $rule = join(' ', @_);
    my $idx;

    if ($sobj->grep_rule($rule)) {
	emesd("$sobj->{rulename}: Specified rule already exists.");
	return -1;
    }

    my $ruleid = shift;
    my $hash = generate_hash(@_);

    $idx = $sobj->add_rule($rule, $hash);

    unless ($sobj->{idobject}) {
	emesd("$sobj->{rulename}: IdObject is not set in SubstObject.");
	return -1;
    }

    ar_rule(1, $sobj, $idx, $ruleid, $hash);

    return 0;
}

sub defoma_subst_remove_rule_by_num {
    my $sobj = shift;
    my $i = shift;

    my @rule = split(' ', $sobj->{rule}->[$i]);
    my $ruleid = shift(@rule);
    my $hash = $sobj->{rule_hash}->[$i];
    unless ($hash) {
	$hash = generate_hash(@rule);
    }
    
    $sobj->delete_rule($i);
    
    unless ($sobj->{idobject}) {
	emesd("$sobj->{rulename}: IdObject is not set in SubstObject.");
	next;
    }
    
    ar_rule(0, $sobj, $i, $ruleid, $hash);
}

    

sub defoma_subst_remove_rule {
    my $sobj = shift;
    my ($rule, $ruleid);
    my @l;

    return -1 if (@_ == 0);
    
    if (@_ == 1) {
	$ruleid = shift;
	@l = $sobj->grep_rule('', $ruleid);
    } else {
	$ruleid = shift;
	$rule = join(' ', $ruleid, @_);
	@l = $sobj->grep_rule($rule);
    }

    my @r;
    foreach my $i (@l) {
	my $hash = $sobj->{rule_hash}->[$i];
	unless ($hash) {
	    @r = split(' ', $sobj->{rule}->[$i]);
	    shift(@r);
	    $hash = generate_hash(@r);
	}

	$sobj->delete_rule($i);

	unless ($sobj->{idobject}) {
	    emesd("$sobj->{rulename}: IdObject is not set in SubstObject.");
	    next;
	}

	ar_rule(0, $sobj, $i, $ruleid, $hash);
    }

    return 0;
}

sub defoma_subst_newrule {
    my $file = shift;
    my $rulename = shift;

    if (open(F, '>' . $file)) {
	my $text = <<EOF
# Debian Font Manager: Substitute Rule for $rulename
# 
# DO NOT EDIT THIS FILE DIRECTLY! IF YOU WANT TO EDIT, TYPE
# defoma-subst edit-rule $rulename
# INSTEAD.
# 
# This file describes identifiers that other fonts must substitute for and
# their information.
# Each line contains one identifier of a font and some hints about the font.
# Syntax of hints is:
#  --<HintTypeA>[,Score] <hint1> .. --<HintTypeB>[,Score] <hintA>..
# HintType specifies the type of hint, like Family, Weight and Charset.
# Score specifies the degree of importance of the HintType and is either of 
# 1, 2, 3 or *. The larger number, the more important. '*' means the 
# specified HintType is required to match.
# 
# Each item in a line is separated by space.
# Lines starting with '#' are ignored.
#
EOF
    ;
	print F $text;

	foreach my $i (@_) {
	    print F $i, "\n";
	}
	
	close F;
    }
}


1;

