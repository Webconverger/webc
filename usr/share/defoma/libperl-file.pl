sub get_file_category {
    my $file = shift;

    my $ret = `/usr/bin/file $file`;
    chomp($ret);

    $ret = substr($ret, length($file) + 2);

    if ($ret eq 'ASCII text') {
	if ($file =~ /\.hints$/) {
	    return 'hintfile';
	}
    } elsif ($ret =~ /PostScript/) {
	if ($ret =~ /PostScript Type 1 font/) {
	    return 'type1';
	} else {
	    if (open(F, $file)) {
		my $l = scalar(<F>);
		close F;
		chomp($l);
		if ($l =~ /Resource-CMap/) {
		    return 'cmap';
		} elsif ($l =~ /Resource-Font/) {
		    return 'psfont';
		} elsif ($l =~ /Resource-CIDFont/) {
		    return 'cid';
		}
	    }
	    return 'unknown';
	}
    } elsif ($ret eq 'MS Windows TrueType font') {
	return 'truetype';
    } elsif ($ret eq 'data' && $file =~ /\.ttc/i) {
	if (open(F, $file)) {
	    my $l = substr(scalar(<F>), 0, 4);
	    close F;
	    if ($l eq 'ttcf') {
		return 'truetype';
	    }
	}
	return 'unknown';
    }
    return 'unknown';
}
    
1;
