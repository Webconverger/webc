use POSIX;

my $dialog = '/usr/bin/whiptail';
$dialog = '/usr/bin/dialog' unless (-x $dialog);

# code from dialog.pl(return_output)
sub safe_redirect {
    pipe(PARENT_READER, CHILD_WRITER);
    my $pid = fork();
    if ($pid == 0) {
	close(PARENT_READER);
	dup2(fileno(CHILD_WRITER),3);
	open(STDOUT, ">&STDERR");
	exec(@_);
	die("exec failure: $_[0]");
    }

    my $ret = '';
    if ($pid > 0) {
	close(CHILD_WRITER);
	$ret .= <PARENT_READER>;
	close(PARENT_READER);
	waitpid($pid, 0);
	$result = $?; #GLOBAL Variable: result
    }

    return $ret;
}

sub linecount {
    my $text = shift;
    my $lines = 0;
    my $cnt = 0;
    my @words = split(/ /, $text);
    my($i, $len, $space);

    foreach $i (@words) {
	if ($i eq '\n') {
	    $cnt = 0;
	    next;
	}
	
	$len = length($i);
	while (1) {
	    $lines++ if ($cnt == 0);
	    $space = ($cnt > 0);
	    
	    if ($cnt + $space + $len > $DWIDTH) {
		if ($cnt == 0) {
		    $len -= $DWIDTH;
		} else {
		    $cnt = 0;
		}
	    } else {
		$cnt += $len;
		last;
	    }
	}
    }

    return $lines;
}

# code from pppconfig.
#
#   Copyright (C) 1999 John G. Hasler (john@dhh.gt.org)
#
#   This program is free software; you can redistribute it and/or modify
#   it under the terms of the GNU General Public License as published by
#   the Free Software Foundation; either version 2 of the License, or
#   (at your option) any later version.

sub dialogbox(@) {
  my $type=shift(@_);
  my $optionstr = (@_ > 0) ? shift(@_) : '';
  my @vars=@_;
  my $text=shift( @vars );
  my $height = shift( @vars );
  my $title = $DIALOGTITLE;

  my @options = split(' ', $optionstr) if ($optionstr ne '');

#  $result = callsystem_output('2>&1', '/usr/bin/dialog', '--clear', '--title',
#			      $title, @options, $type, $text, $height, 80,
#			      @vars);
#  my $item=$output;
#  chomp $item; # For gdialog, which returns strings with newlines.

  my $item = safe_redirect($dialog, '--output-fd', '3', '--clear', '--title',
			   $title, @options, $type, $text, $height, 80, @vars);
  
  $result = ($result >> 8);
  exitfunc(255) if ($result == 255);
  exitfunc(255, "Internal error") unless($result == 0 || $result == 1);
  return $item;
}

sub msgbox(@) {
    my $text = shift;
    my $lines = linecount($text);
    $lines += 7;

    dialogbox("\-\-msgbox", '', $text, $lines);

    return $result;
}

sub infobox(@) {
    my $text = shift;
    my $lines = linecount($text);
    $lines += 7;

    dialogbox("\-\-infobox", '', $text, $lines);

    return $result;
}

sub yesnobox(@) {
    my $text = shift;
    my $lines = linecount($text);
    $lines += 7;
    
    dialogbox( "\-\-yesno", '', $text, $lines);

    return $result;
}

sub inputbox(@) {
    my $text = shift;
    my $default = shift;
    my $pattern = shift;
    my $allowempty = shift;
    my $lines = linecount($text);
    my @args;
    my $ret;
    $lines += 7;

    while(1) {
	@args = ();
	push(@args, $text);
	push(@args, $lines);
	push(@args, $default) if ($default ne '');
	
	$ret = dialogbox( "\-\-inputbox", '', @args);

	return '' if ($result != 0);
	return '' if ($ret eq '' && $allowempty != 0);
	return $ret if ($ret =~ /^$pattern+$/);

	if ($ret eq '') {
	    $text = "Empty is not allowed.";
	} else {
	    $default = $ret;
	    $ret =~ s/$pattern//g;
	    $default =~ s/[^$ret]/_/g;
	    $text = "Illegal characters: \"$ret\".";
	    if ($ret =~ / /) {
		$text .= "\n you can use underscore in place of space.";
	    }
	}
	$lines = 8;
    }
}

sub menu(@) {
    my $text = shift( @_ );
    my $menu_height = shift( @_ );
    my $options = shift;
    my $lines = linecount($text);
    $lines += 6 + $menu_height;
    
    return dialogbox( '--menu', $options, $text, $lines, $menu_height, @_ );
}

sub menu_single(@) {
    my $text = shift;
    my $menu_height = shift;
    my $options = shift;
    my $lines = linecount($text);
    $lines += 6 + $menu_height;
    
    my @args = @_;
    my @pass = ();
    my $i;

    for ($i = 0; $i < @args; $i++) {
	if ($args[$i] ne '') {
	    $pass[$i * 2] = $args[$i];
	    $pass[$i * 2 + 1] = ' ';
	}
    }

    return dialogbox( '--menu', $options, $text, $lines, $menu_height,
		      @pass );
}

sub checklist_single_onargs(@) {
    my $text = shift( @_ );
    my $menu_height = shift( @_ );
    my $onargs = shift;
    my $lines = linecount($text);
    $lines += 6 + $menu_height;
    
    my @args = @_;
    my @pass = ();
    my $i;
    my $j;
    my @ons = split(' ', $onargs);

    for ($i = $j = 0; $i < @args; $i++) {
	if ($args[$i] ne '') {
	    $pass[$j++] = $args[$i];
	    $pass[$j++] = ' ';
	    $pass[$j++] = (grep($_ eq $args[$i], @ons)) ? 'on' : 'off';
	}
    }
    
    return dialogbox('--checklist', '--separate-output', $text, $lines,
		     $menu_height, @pass );
}

$INPUTCOMMON_MENU = 1;

sub input_menu {
    my $input_text = shift;
    my $default = shift;
    my $input_pattern = shift;
    my $input_allowempty = shift;
    my $input_menu_item = '';
    my $menu_text = '';
    my @menu_list = ();
    if (@_ >= 3) {
	$input_menu_item = shift;
	$menu_text = shift;
	@menu_list = @_;
    }

    while (1) {
	if (@menu_list > 0) {
	    chomp($menu_text);
	    my $lines = 1;
	    while ($menu_text =~ /\n/m) {
		$menu_text =~ s/\n/\\n/m;
		$lines++;
	    }
	    
	    my $menu_items = @menu_list;
	    my $mlines = 15 - $lines;
	    my $items = ($menu_items > $mlines) ? $mlines : $menu_items;
	    my $default_item = '';
	    $default_item = "--default-item $default" if ($default ne '' and $dialog =~ /(^|\/)dialog/);
	    my $ret;

	    if ($INPUTCOMMON_MENU == 1) {
		$ret = menu_single($menu_text, $items, $default_item,
				      @menu_list);
	    } else {
		$ret = menu($menu_text, $items, $default_item, @menu_list);
	    }

	    return '' if ($result != 0);
	    return $ret if ($ret ne $input_menu_item);
	}
	
	chomp($input_text);
	$input_text =~ s/\n/\\n/gm;

	$ret = inputbox($input_text, $default, $input_pattern,
			$input_allowempty);
	return $ret if ($result == 0 || $menu_text eq '');
    }
}

sub input_checklist {
    my $input_text = shift;
    my $default = shift;
    my $input_pattern = shift;
    my $input_allowempty = shift;
    my $clist_text = '';
    my @clist_list = ();
    if (@_ > 0) {
	$clist_text = shift;
	@clist_list = @_;
    }

    while (1) {
	chomp($clist_text);
	my $lines = 1;
	while ($clist_text =~ /\n/m) {
	    $clist_text =~ s/\n/\\n/m;
	    $lines++;
	}
	
	my $clist_items = @clist_list;
	my $clines = 15 - $lines;
	my $items = ($clist_items > $clines) ? $clines : $clist_items;
	my $ret;
	
	$ret = checklist_single_onargs($clist_text, $items, $default,
				       @clist_list);
	return '' if ($result != 0);
	chomp($ret);
	$ret =~ s/\n/ /g;
    	
	$ret = inputbox($input_text, $ret, $input_pattern, $input_allowempty);
	return $ret if ($result == 0);
    }
}


sub input_menu2 {
    $INPUTCOMMON_MENU = 2;
    my $ret = input_menu(@_);
    $INPUTCOMMON_MENU = 1;
    return $ret;
}



1;

