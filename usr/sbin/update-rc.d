#! /usr/bin/perl
#
# update-rc.d	Update the links in /etc/rc[0-9S].d/
#

use strict;
use warnings;

my $initd = "/etc/init.d";
my $etcd  = "/etc/rc";
my $notreally = 0;

# Print usage message and die.

sub usage {
	print STDERR "update-rc.d: error: @_\n" if ($#_ >= 0);
	print STDERR <<EOF;
usage: update-rc.d [-n] [-f] <basename> remove
       update-rc.d [-n] <basename> defaults [NN | SS KK]
       update-rc.d [-n] <basename> start|stop NN runlvl [runlvl] [...] .
       update-rc.d [-n] <basename> disable|enable [S|2|3|4|5]
		-n: not really
		-f: force

The disable|enable API is not stable and might change in the future.
EOF
	exit (1);
}

# Dependency based boot sequencing is the default, but upgraded
# systems might keep the legacy ordering until the sysadm choose to
# migrate to the new ordering method.
if ( ! -f "/etc/init.d/.legacy-bootordering" ) {
    info("using dependency based boot sequencing");
    exit insserv_updatercd(@ARGV);
}

# Check out options.
my $force;

my @orig_argv = @ARGV;

while($#ARGV >= 0 && ($_ = $ARGV[0]) =~ /^-/) {
	shift @ARGV;
	if (/^-n$/) { $notreally++; next }
	if (/^-f$/) { $force++; next }
	if (/^-h|--help$/) { &usage; }
	&usage("unknown option");
}

sub save_last_action {
    # No-op (archive removed)
}

sub remove_last_action {
    # No-op (archive removed)
}

# Action.

&usage() if ($#ARGV < 1);
my $bn = shift @ARGV;

unless ($bn =~ m/[a-zA-Z0-9+.-]+/) {
    print STDERR "update-rc.d: illegal character in name '$bn'\n";
    exit (1);
}

if ($ARGV[0] ne 'remove') {
    if (! -f "$initd/$bn") {
	print STDERR "update-rc.d: $initd/$bn: file does not exist\n";
	exit (1);
    }
    &parse_lsb_header("$initd/$bn");
    &cmp_args_with_defaults($bn, $ARGV[0], @ARGV);
} elsif (-f "$initd/$bn") {
    if (!$force) {
	printf STDERR "update-rc.d: $initd/$bn exists during rc.d purge (use -f to force)\n";
	exit (1);
    }
}

my @startlinks;
my @stoplinks;

$_ = $ARGV[0];
if    (/^remove$/)       { &checklinks ("remove"); remove_last_action($bn); }
elsif (/^defaults$/)     { &defaults (@ARGV); &makelinks; save_last_action($bn, @orig_argv); }
elsif (/^(start|stop)$/) { &startstop (@ARGV); &makelinks; save_last_action($bn, @orig_argv); }
elsif (/^(dis|en)able$/) { &toggle (@ARGV); &makelinks; save_last_action($bn, @orig_argv); }
else                     { &usage; }

exit (0);

sub info {
    print STDOUT "update-rc.d: @_\n";
}

sub warning {
    print STDERR "update-rc.d: warning: @_\n";
}

sub error {
    print STDERR "update-rc.d: error: @_\n";
    exit (1);
}

sub error_code {
    my $rc = shift;
    print STDERR "update-rc.d: error: @_\n";
    exit ($rc);
}

# Check if there are links in /etc/rc[0-9S].d/ 
# Remove if the first argument is "remove" and the links 
# point to $bn.

sub is_link () {
    my ($op, $fn, $bn) = @_;
    if (! -l $fn) {
	warning "$fn is not a symbolic link\n";
	return 0;
    } else {
	my $linkdst = readlink ($fn);
	if (! defined $linkdst) {
	    die ("update-rc.d: error reading symbolic link: $!\n");
	}
	if (($linkdst ne "../init.d/$bn") && ($linkdst ne "$initd/$bn")) {
	    warning "$fn is not a link to ../init.d/$bn or $initd/$bn\n";
	    return 0;
	}
    }
    return 1;
}

sub checklinks {
    my ($i, $found, $fn, $islnk);

    print " Removing any system startup links for $initd/$bn ...\n"
	if (defined $_[0] && $_[0] eq 'remove');

    $found = 0;

    foreach $i (0..9, 'S') {
	unless (chdir ("$etcd$i.d")) {
	    next if ($i =~ m/^[789S]$/);
	    die("update-rc.d: chdir $etcd$i.d: $!\n");
	}
	opendir(DIR, ".");
	my $saveBN=$bn;
	$saveBN =~ s/\+/\\+/g;
	foreach $_ (readdir(DIR)) {
	    next unless (/^[SK]\d\d$saveBN$/);
	    $fn = "$etcd$i.d/$_";
	    $found = 1;
	    $islnk = &is_link ($_[0], $fn, $bn);
	    next unless (defined $_[0] and $_[0] eq 'remove');
	    if (! $islnk) {
		print "   $fn is not a link to ../init.d/$bn; not removing\n"; 
		next;
	    }
	    print "   $etcd$i.d/$_\n";
	    next if ($notreally);
	    unlink ("$etcd$i.d/$_") ||
		die("update-rc.d: unlink: $!\n");
	}
	closedir(DIR);
    }
    $found;
}

sub parse_lsb_header {
    my $initdscript = shift;
    my %lsbinfo;
    my $lsbheaders = "Provides|Required-Start|Required-Stop|Default-Start|Default-Stop";
    open(INIT, "<$initdscript") || die "error: unable to read $initdscript";
    while (<INIT>) {
        chomp;
        $lsbinfo{'found'} = 1 if (m/^\#\#\# BEGIN INIT INFO\s*$/);
        last if (m/\#\#\# END INIT INFO\s*$/);
        if (m/^\# ($lsbheaders):\s*(\S?.*)$/i) {
    	$lsbinfo{lc($1)} = $2;
        }
    }
    close(INIT);

    # Check that all the required headers are present
    if (!$lsbinfo{found}) {
	printf STDERR "update-rc.d: warning: $initdscript missing LSB information\n";
	printf STDERR "update-rc.d: see <http://wiki.debian.org/LSBInitScripts>\n";
    } else {
        for my $key (split(/\|/, lc($lsbheaders))) {
            if (!exists $lsbinfo{$key}) {
                warning "$initdscript missing LSB keyword '$key'\n";
            }
        }
    }
}


# Process the arguments after the "enable" or "disable" keyword.

sub toggle {
    my @argv = @_;
    my ($action, %lvls, @start, @stop, @xstartlinks);

    if (!&checklinks) {
	print " System start/stop links for $initd/$bn do not exist.\n";
	exit (0);
    }

    $action = $argv[0];
    if ($#argv > 1) {
	while ($#argv > 0 && shift @argv) {
	    if ($argv[0] =~ /^[S2-5]$/) {
		$lvls{$argv[0]}++;
	    } else {
		&usage ("expected 'S' '2' '3' '4' or '5'");
	    }
	}
    } else {
	$lvls{$_}++ for ('S', '2', '3', '4', '5');
    }

    push(@start, glob($etcd . '[2-5S].d/[KS][0-9][0-9]' . $bn));

    foreach (@start) {
	my $islink = &is_link (undef, $_, $bn);
	next if !$islink;

	next unless my ($lvl, $sk, $seq) = m/^$etcd([2-5S])\.d\/([SK])([0-9]{2})$bn$/;
	$startlinks[$lvl] = $sk . $seq;

	if ($action eq 'disable' and $sk eq 'S' and $lvls{$lvl}) {
	    $xstartlinks[$lvl] = 'K' . sprintf "%02d", (100 - $seq);
	} elsif ($action eq 'enable' and $sk eq 'K' and $lvls{$lvl}) {
	    $xstartlinks[$lvl] = 'S' . sprintf "%02d", -($seq - 100);
	} else {
	    $xstartlinks[$lvl] = $sk . $seq;
	}
    }

    push(@stop, glob($etcd . '[016].d/[KS][0-9][0-9]' . $bn));

    foreach (@stop) {
	my $islink = &is_link (undef, $_, $bn);
	next if !$islink;

	next unless my ($lvl, $sk, $seq) = m/^$etcd([016])\.d\/([SK])([0-9]{2})$bn$/;
	$stoplinks[$lvl] = $sk . $seq;
    }

    if ($action eq 'disable') {
	print " Disabling system startup links for $initd/$bn ...\n";
    } elsif ($action eq 'enable') {
	print " Enabling system startup links for $initd/$bn ...\n";
    }

    &checklinks ("remove");
    @startlinks = @xstartlinks;

    1;
}

# Process the arguments after the "defaults" keyword.

sub defaults {
    my @argv = @_;
    my ($start, $stop) = (20, 20);

    &usage ("defaults takes only one or two codenumbers") if ($#argv > 2);
    $start = $stop = $argv[1] if ($#argv >= 1);
    $stop  =         $argv[2] if ($#argv >= 2);
    &usage ("codenumber must be a number between 0 and 99")
	if ($start !~ /^\d\d?$/ || $stop  !~ /^\d\d?$/);

    $start = sprintf("%02d", $start);
    $stop  = sprintf("%02d", $stop);

    $stoplinks[$_]  = "K$stop"  for (0, 1, 6);
    $startlinks[$_] = "S$start" for (2, 3, 4, 5);

    1;
}

# Process the arguments after the start or stop keyword.

sub startstop {
    my @argv = @_;
    my($letter, $NN, $level);

    while ($#argv >= 0) {
	if    ($argv[0] eq 'start') { $letter = 'S'; }
	elsif ($argv[0] eq 'stop')  { $letter = 'K'; }
	else {
	    &usage("expected start|stop");
	}

	if ($argv[1] !~ /^\d\d?$/) {
	    &usage("expected NN after $argv[0]");
	}
	$NN = sprintf("%02d", $argv[1]);

	if ($argv[-1] ne '.') {
	    &usage("start|stop arguments not terminated by \".\"");
	}

	shift @argv; shift @argv;
	$level = shift @argv;
	do {
	    if ($level !~ m/^[0-9S]$/) {
		&usage(
		       "expected runlevel [0-9S] (did you forget \".\" ?)");
	    }
	    if (! -d "$etcd$level.d") {
		print STDERR
		    "update-rc.d: $etcd$level.d: no such directory\n";
		exit(1);
	    }
	    $level = 99 if ($level eq 'S');
	    $startlinks[$level] = "$letter$NN" if ($letter eq 'S');
	    $stoplinks[$level]  = "$letter$NN" if ($letter eq 'K');
	} while (($level = shift @argv) ne '.');
    }
    1;
}

# Create the links.

sub makelinks {
    my($t, $i);
    my @links;

    if (&checklinks) {
	print " System start/stop links for $initd/$bn already exist.\n";
	return 0;
    }
    print " Adding system startup for $initd/$bn ...\n";

    # nice unreadable perl mess :)

    for($t = 0; $t < 2; $t++) {
	@links = $t ? @startlinks : @stoplinks;
	for($i = 0; $i <= $#links; $i++) {
	    my $lvl = $i;
	    $lvl = 'S' if ($i == 99);
	    next if (!defined $links[$i] or $links[$i] eq '');
	    print "   $etcd$lvl.d/$links[$i]$bn -> ../init.d/$bn\n";
	    next if ($notreally);
	    symlink("../init.d/$bn", "$etcd$lvl.d/$links[$i]$bn")
		|| die("update-rc.d: symlink: $!\n");
	}
    }

    1;
}

## Dependency based
sub insserv_updatercd {
    my @args = @_;
    my @opts;
    my $scriptname;
    my $action;
    my $notreally = 0;

    my @orig_argv = @args;

    while($#args >= 0 && ($_ = $args[0]) =~ /^-/) {
        shift @args;
        if (/^-n$/) { push(@opts, $_); $notreally++; next }
        if (/^-f$/) { push(@opts, $_); next }
        if (/^-h|--help$/) { &usage; }
        usage("unknown option");
    }

    usage("not enough arguments") if ($#args < 1);

    $scriptname = shift @args;
    $action = shift @args;
    if ("remove" eq $action) {
        if ( -f "/etc/init.d/$scriptname" ) {
            my $rc = system("/sbin/insserv", @opts, "-r", $scriptname) >> 8;
            if (0 == $rc && !$notreally) {
                remove_last_action($scriptname);
            }
            error_code($rc, "insserv rejected the script header") if $rc;
            exit $rc;
        } else {
            # insserv removes all dangling symlinks, no need to tell it
            # what to look for.
            my $rc = system("insserv", @opts) >> 8;
            if (0 == $rc && !$notreally) {
                remove_last_action($scriptname);
            }
            error_code($rc, "insserv rejected the script header") if $rc;
            exit $rc;
        }
    } elsif ("defaults" eq $action || "start" eq $action ||
             "stop" eq $action) {
        # All start/stop/defaults arguments are discarded so emit a
        # message if arguments have been given and are in conflict
        # with Default-Start/Default-Stop values of LSB comment.
        cmp_args_with_defaults($scriptname, $action, @args);

        if ( -f "/etc/init.d/$scriptname" ) {
            my $rc = system("insserv", @opts, $scriptname) >> 8;
            if (0 == $rc && !$notreally) {
                save_last_action($scriptname, @orig_argv);
            }
            error_code($rc, "insserv rejected the script header") if $rc;
            exit $rc;
        } else {
            error("initscript does not exist: /etc/init.d/$scriptname");
        }
    } elsif ("disable" eq $action || "enable" eq $action) {
        insserv_toggle($notreally, $action, $scriptname, @args);
        # Call insserv to resequence modified links
        my $rc = system("insserv", @opts, $scriptname) >> 8;
        if (0 == $rc && !$notreally) {
            save_last_action($scriptname, @orig_argv);
        }
        error_code($rc, "insserv rejected the script header") if $rc;
        exit $rc;
    } else {
        usage();
    }
}

sub parse_def_start_stop {
    my $script = shift;
    my (%lsb, @def_start_lvls, @def_stop_lvls);

    open my $fh, '<', $script or error("unable to read $script");
    while (<$fh>) {
        chomp;
        if (m/^### BEGIN INIT INFO$/) {
            $lsb{'begin'}++;
        }
        elsif (m/^### END INIT INFO$/) {
            $lsb{'end'}++;
            last;
        }
        elsif ($lsb{'begin'} and not $lsb{'end'}) {
            if (m/^# Default-Start:\s*(\S?.*)$/) {
                @def_start_lvls = split(' ', $1);
            }
            if (m/^# Default-Stop:\s*(\S?.*)$/) {
                @def_stop_lvls = split(' ', $1);
            }
        }
    }
    close($fh);

    return (\@def_start_lvls, \@def_stop_lvls);
}

sub lsb_header_for_script {
    my $name = shift;

    foreach my $file ("/etc/insserv/overrides/$name", "/etc/init.d/$name",
                      "/usr/share/insserv/overrides/$name") {
        return $file if -s $file;
    }

    error("cannot find a LSB script for $name");
}

sub cmp_args_with_defaults {
    my ($name, $act) = (shift, shift);
    my ($lsb_start_ref, $lsb_stop_ref, $arg_str, $lsb_str);
    my (@arg_start_lvls, @arg_stop_lvls, @lsb_start_lvls, @lsb_stop_lvls);
    my $default_msg = ($act eq 'defaults') ? 'default' : '';

    ($lsb_start_ref, $lsb_stop_ref) = parse_def_start_stop("/etc/init.d/$name");
    @lsb_start_lvls = @$lsb_start_ref;
    @lsb_stop_lvls  = @$lsb_stop_ref;
    return if (!@lsb_start_lvls and !@lsb_stop_lvls);

    if ($act eq 'defaults') {
        @arg_start_lvls = (2, 3, 4, 5);
        @arg_stop_lvls  = (0, 1, 6);
    } elsif ($act eq 'start' or $act eq 'stop') {
        my $start = $act eq 'start' ? 1 : 0;
        my $stop = $act eq 'stop' ? 1 : 0;

        # The legacy part of this program passes arguments starting with
        # "start|stop NN x y z ." but the insserv part gives argument list
        # starting with sequence number (ie. strips off leading "start|stop")
        # Start processing arguments immediately after the first seq number.
        my $argi = $_[0] eq $act ? 2 : 1;

        while (defined $_[$argi]) {
            my $arg = $_[$argi];

            # Runlevels 0 and 6 are always stop runlevels
            if ($arg eq 0 or $arg eq 6) {
		$start = 0; $stop = 1; 
            } elsif ($arg eq 'start') {
                $start = 1; $stop = 0; $argi++; next;
            } elsif ($arg eq 'stop') {
                $start = 0; $stop = 1; $argi++; next;
            } elsif ($arg eq '.') {
                next;
            }
            push(@arg_start_lvls, $arg) if $start;
            push(@arg_stop_lvls, $arg) if $stop;
        } continue {
            $argi++;
        }
    }

    if ($#arg_start_lvls != $#lsb_start_lvls or
        join("\0", sort @arg_start_lvls) ne join("\0", sort @lsb_start_lvls)) {
        $arg_str = @arg_start_lvls ? "@arg_start_lvls" : "none";
        $lsb_str = @lsb_start_lvls ? "@lsb_start_lvls" : "none";
        warning "$default_msg start runlevel arguments ($arg_str) do not match",
                "$name Default-Start values ($lsb_str)";
    }
    if ($#arg_stop_lvls != $#lsb_stop_lvls or
        join("\0", sort @arg_stop_lvls) ne join("\0", sort @lsb_stop_lvls)) {
        $arg_str = @arg_stop_lvls ? "@arg_stop_lvls" : "none";
        $lsb_str = @lsb_stop_lvls ? "@lsb_stop_lvls" : "none";
        warning "$default_msg stop runlevel arguments ($arg_str) do not match",
                "$name Default-Stop values ($lsb_str)";
    }
}

sub insserv_toggle {
    my ($dryrun, $act, $name) = (shift, shift, shift);
    my (@toggle_lvls, $start_lvls, $stop_lvls, @symlinks);
    my $lsb_header = lsb_header_for_script($name);

    # Extra arguments to disable|enable action are runlevels. If none
    # given parse LSB info for Default-Start value.
    if ($#_ >= 0) {
        @toggle_lvls = @_;
    } else {
        ($start_lvls, $stop_lvls) = parse_def_start_stop($lsb_header);
        @toggle_lvls = @$start_lvls;
        if ($#toggle_lvls < 0) {
            error("$name Default-Start contains no runlevels, aborting.");
        }
    }

    # Find symlinks in rc.d directories. Refuse to modify links in runlevels
    # not used for normal system start sequence.
    for my $lvl (@toggle_lvls) {
        if ($lvl !~ /^[S2345]$/) {
            warning("$act action will have no effect on runlevel $lvl");
            next;
        }
        push(@symlinks, $_) for glob("/etc/rc$lvl.d/[SK][0-9][0-9]$name");
    }

    if (!@symlinks) {
        error("no runlevel symlinks to modify, aborting!");
    }

    # Toggle S/K bit of script symlink.
    for my $cur_lnk (@symlinks) {
        my $sk;
        my @new_lnk = split(//, $cur_lnk);

        if ("disable" eq $act) {
            $sk = rindex($cur_lnk, '/S') + 1;
            next if $sk < 1;
            $new_lnk[$sk] = 'K';
        } else {
            $sk = rindex($cur_lnk, '/K') + 1;
            next if $sk < 1;
            $new_lnk[$sk] = 'S';
        }

        if ($dryrun) {
            printf("rename(%s, %s)\n", $cur_lnk, join('', @new_lnk));
            next;
        }

        rename($cur_lnk, join('', @new_lnk)) or error($!);
    }
}
