package Debian::Defoma::Common;

use strict;
use POSIX;
use Exporter;
use FileHandle;

use vars qw(@EXPORT @EXPORT_OK @ISA $ROOTDIR $DEFOMA_TEST_DIR
	    $DEFAULT_PACKAGE $DEFAULT_CATEGORY);

my ($Scriptdir, $Substruledir, $Homedir, $Lockfile, $Quiet, $Error, $Verbose,
    $Debug, $Userspace, @Scriptdirs, $Locale, $Login);
my ($Defoma_Test_Dir, $Rootdir);
my $Version = "0.10.0";
my @Args;
my @Options;

BEGIN {
    @ISA = qw(Exporter);
    @EXPORT = qw(&printm &printw &printe &printv &printd &add_hash_list
		 &parse_hints_start
		 &parse_hints_cut &parse_hints_cut_except &parse_hints_build
		 &parse_hints_subhints &parse_hints_subhints_inherit
		 &get_xencoding &get_charset
		 &weight_a2i &weight_ascii2integer
		 &get_xlfd_of_font
		 &app_readfile &app_writefile &app_symlink &app_unlink
		 $DEFOMA_TEST_DIR $ROOTDIR
		 &DEFOMA_TEST_DIR &ROOTDIR &USERSPACE &HOMEDIR &LOCALE
		 &SCRIPTDIR &SUBSTRULEDIR &LOCKFILE &ERROR 
		 &SCRIPTDIRS &VERSION &ARGS &USERLOGIN &OPTIONS
		 );
    @EXPORT_OK = qw(&mylock &register_id_object &register_subst_object
		    &get_id_object &get_subst_object &get_system_categories
		    &get_files &diff_files &arg_check &arg_check_category
		    &readfile &writefile
		    $DEFAULT_PACKAGE $DEFAULT_CATEGORY
		    );

    $Quiet = 0;
    $Error = 0;
    $Verbose = 0;
    $Debug = 0;
    $Userspace = 0;

    my @unknown = ();

    @Args = @ARGV;
    
    while (@ARGV > 0 && $ARGV[0] =~ /^-/ && $ARGV[0] !~ /^--/) {
	my $options = shift(@ARGV);
	$options =~ s/^-//;

	my %h = (q => \$Quiet, t => \$Error, v => \$Verbose, d => \$Debug,
		 u => \$Userspace);
	
	foreach my $option (split(//, $options)) {
	    if (my $s = $h{$option}) {
		$$s = 1;
		push(@Options, '-' . $option);
	    } else {
		push(@unknown, '-' . $option);
	    }
	}
    }

    $Error = 1 - $Error;
    
    unshift(@ARGV, @unknown);

    $Defoma_Test_Dir = $DEFOMA_TEST_DIR = '';
    if ($Debug) {
	if (exists($ENV{'DEFOMA_TEST_DIR'})) {
	    $Defoma_Test_Dir = $DEFOMA_TEST_DIR = $ENV{'DEFOMA_TEST_DIR'};
	}
	
	push(@Scriptdirs, "$DEFOMA_TEST_DIR/usr/local/share/defoma/scripts");
    }

    push(@Scriptdirs, "$DEFOMA_TEST_DIR/usr/share/defoma/scripts");

    if (exists($ENV{'LC_ALL'})) {
	$Locale = $ENV{'LC_ALL'};
    } elsif (exists($ENV{'LANG'})) {
	$Locale = $ENV{'LANG'};
    } else {
	$Locale = '';
    }

    $Homedir = '';
    if ($Userspace) {
	my @l = getpwuid($<);
	$Homedir = "$DEFOMA_TEST_DIR$l[7]";
	$Login = $l[0];
	$Rootdir = $ROOTDIR = "$Homedir/.defoma";
    } else {
	$Rootdir = $ROOTDIR = "$DEFOMA_TEST_DIR/var/lib/defoma";
    }
    
    $Substruledir = "$DEFOMA_TEST_DIR/etc/defoma";
    $Scriptdir = "$ROOTDIR/scripts";
    $Lockfile = "$ROOTDIR/locked";
    
    $DEFAULT_PACKAGE = $DEFAULT_CATEGORY = '';
}

sub OPTIONS {
    return @Options;
}

sub ARGS {
    return @Args;
}

sub DEFOMA_TEST_DIR {
    return $Defoma_Test_Dir;
}

sub ROOTDIR {
    return $Rootdir;
}

sub SCRIPTDIR {
    return $Scriptdir;
}

sub SCRIPTDIRS {
    return @Scriptdirs;
}

sub SUBSTRULEDIR {
    return $Substruledir;
}

sub HOMEDIR {
    return $Homedir;
}

sub LOCKFILE {
    return $Lockfile;
}

sub QUIET {
    return $Quiet;
}

sub ERROR {
    return $Error;
}

sub LOCALE {
    return $Locale;
}

sub USERSPACE {
    return $Userspace;
}

sub VERSION {
    return $Version;
}

sub USERLOGIN {
    return $Login;
}

sub printd {
    return unless ($Debug);
    my @c = caller(0);

    print STDERR $c[3], " at line ", $c[2], " in ", $c[1], ": ", @_, "\n";
}

sub printm {
    return if ($Quiet);

    print STDERR @_, "\n";
}

my $CALLERLEVEL = 0;

sub printw {
    print "W: ", @_, "\n";
}

sub printe {
    print "E: ", @_, "\n";
}


sub printee {
    my @c = caller($CALLERLEVEL);
    $CALLERLEVEL = 0;
    
    print STDERR $c[3], " at line ", $c[2], " in ", $c[1], ": ", @_, "\n";
}

sub printv {
    return unless ($Verbose);

    print @_, "\n";
}

sub get_files {
    my $pattern = shift;
    my $directory = shift;
    my $i;
    my @caches = ();
    my @list;

    opendir(D, $directory) || return ();
    @list = readdir(D);
    closedir(D);

    foreach $i (@list) {
	if ($i =~ /$pattern/) {
	    push(@caches, $i);
	}
    }

    return @caches;
}

sub diff_files {
    my $file1 = shift;
    my $file2 = shift;

    return 1 if ((-s $file1) != (-s $file2));

    my $err = system("/usr/bin/cmp", "-s", $file1, $file2);
    return $err;
}

sub arg_check {
    my @b = @_;
    while (@_ > 0) {
	my $s = shift;
	if ($s =~ /[ \t]/ || $s eq '') {
	    $CALLERLEVEL = 2;
	    printee "(", join(', ', @b), "): Illegal argument.";
	    return 0;
	}
    }

    return 1;
}

sub arg_check_category {
    while (@_ > 0) {
	my $s = shift;
	if ($s !~ /^[A-Za-z0-9-]+$/) {
	    $CALLERLEVEL = 2;
	    printee "'$s': Illegal Category name.";
	    return 0 ;
	}
    }

    return 1;
}

sub add_hash_list {
    my $hashptr = shift;
    my $key = shift;
    my $str = shift;

    if (exists($hashptr->{$key})) {
	$hashptr->{$key} .= ' ';
    } else {
	$hashptr->{$key} = '';
    }

    $hashptr->{$key} .= $str;
}

sub mylock {
    my $flag = 0;
    my $op = shift;
    my $bg = (@_ > 0) ? shift(@_) : '';

    if (USERSPACE) {
	mkdir(ROOTDIR) unless (-d ROOTDIR);
	mkdir(SCRIPTDIR) unless (-d SCRIPTDIR);
	
	if ((-e ROOTDIR && ! -d ROOTDIR) || -l ROOTDIR) {
	    printe("Defoma-root-dir " . ROOTDIR . " is occupied.");
	    exit ERROR;
	}
	if ((-e SCRIPTDIR && ! -d SCRIPTDIR) || -l SCRIPTDIR) {
	    printe("Script-dir " . SCRIPTDIR . " is occupied.");
	    exit ERROR;
	}
    }
    
    if ($op == 0) {
	unlink($Lockfile);
    } elsif ($op == 1) {
	symlink("locknow", $Lockfile) && return 0;

	printe("$Lockfile exists.");
	unless (USERSPACE) {
	    printe("Another defoma process seems running, or you aren't root.");
	    printe("If you are root and defoma process isn't running undoubtedly,");
	    printe("it is possible that defoma might have aborted.");
	    printe("Please run defoma-reconfigure -f to fix its broken status.");
	    exit ERROR;
	} else {
	    printe("Another defoma process seems running, or defoma might ".
		   "have aborted.");
	    printe("Please run defoma-user reconfigure to fix its broken status.");
	    exit ERROR;
	}
    }
}

sub get_system_categories {
    # update defoma-reconfigure too.
    return ('x-postscript', 'postscript', 'xfont', 'pspreview', 'obsoleted');
}

###### IdObject And SubstObject 

my %IdObject = ();

sub register_id_object {
    my $o = shift;
    my $pkg = shift;
    my $suffix = shift;

    $IdObject{"$pkg/$suffix"} = $o;
}

sub get_id_object {
    my $pkg = shift;
    my $suffix = shift;

    if (exists($IdObject{"$pkg/$suffix"})) {
	return $IdObject{"$pkg/$suffix"};
    }

    return '';
}

sub clear_id_object {
    %IdObject = ();
}

my %SubstObject = ();

sub register_subst_object {
    my $o = shift;
    my $rulename = shift;

    $SubstObject{$rulename} = $o;
}

sub get_subst_object {
    my $rulename = shift;

    if (exists($SubstObject{$rulename})) {
	return $SubstObject{$rulename};
    }

    return '';
}

sub clear_subst_object {
    %SubstObject = ();
}

###### Parsehints 

sub parse_hints_start {
    my $ret = {};
    my $key = '';
    my $addflag = 0;

    foreach my $item (@_) {
	if ($item =~ /^--(.*)/) {
	    if ($key && $addflag == 0) {
		$ret->{$key} = '';
	    }
	    $key = $1;
	    $addflag = 0;
	} elsif ($key) {
	    $addflag = 1;
	    add_hash_list($ret, $key, $item);
	}
    }

    if ($key && $addflag == 0) {
	$ret->{$key} = '';
    }

    return $ret;
}

sub parse_hints_subhints {
    my $parsed = shift;
    my $subnum = shift;
    my $ret = {};

    $subnum = '' if ($subnum == 0);

    foreach my $k (keys(%{$parsed})) {
	if ($k =~ /(.*[^0-9-])-?$subnum$/) {
	    $ret->{$1} = $parsed->{$k};
	}
    }

    return $ret;
}

sub parse_hints_subhints_inherit {
    my $parsed = shift;
    my $subnum = shift;

    my $ret = parse_hints_subhints($parsed, $subnum);

    return $ret if ($subnum == 0 || ! exists($parsed->{Inherit}));

    my @l = split(' ', $parsed->{Inherit});

    foreach my $k (@l) {
	unless (exists($ret->{$k})) {
	    $ret->{$k} = $parsed->{$k};
	}
    }

    return $ret;
}

sub parse_hints_cut {
    my $parsed = shift;
    my $key;

    foreach $key (@_) {
	if (exists($parsed->{$key})) {
	    delete($parsed->{$key});
	}
    }
}

sub parse_hints_cut_except {
    my $parsed = shift;
    my $key;
    my @l = keys(%{$parsed});

    foreach $key (@l) {
	unless (grep($_ eq $key, @_)) {
	    delete($parsed->{$key});
	}
    }
}

sub parse_hints_build {
    my $parsed = shift;
    my $key;
    my @keys = keys(%{$parsed});
    my @ret = ();

    foreach $key (@keys) {
	push(@ret, '--' . $key);
	push(@ret, split(' ', $parsed->{$key}));
    }

    return @ret;
}

###### File Handler ######

sub readfile {
    my $file = shift;
    my $fh = new FileHandle($file, "r");
    my @ret = ();

    if (defined($fh)) {
	while (<$fh>) {
	    chomp($_);
	    push(@ret, $_);
	}

	$fh->close();
    }

    return @ret;
}

sub writefile {
    my $file = shift;
    my $fh = new FileHandle($file, "w");

    if (defined($fh)) {
	while (@_) {
	    $fh->print(shift, "\n");
	}
	
	$fh->close();
    }
}

sub app_readfile {
    my $file = shift;
    
    return readfile("$Rootdir/$DEFAULT_PACKAGE.d/$file");
}

sub app_writefile {
    my $file = shift;

    return writefile("$Rootdir/$DEFAULT_PACKAGE.d/$file", @_);
}

sub app_symlink {
    my $src = shift;
    my $dest = shift;

    return symlink($src, "$Rootdir/$DEFAULT_PACKAGE.d/$dest");
}

sub app_unlink {
    my $file = shift;

    return unlink("$Rootdir/$DEFAULT_PACKAGE.d/$file");
}

###### DataFile Handler ######

my @XencData;

sub read_csetenc_xenc_data {
    my $dir = shift;
    $dir .= "/csetenc-xenc.data2";

    unless (@XencData) {
	my @file = readfile($dir);

	while (@file) {
	    my $a = shift(@file);
	    
	    next if ($a =~ /^\#/);

	    my @l = split(/[ \t]+/, $a);
	    next if (@l < 3);

	    $l[0] =~ s/\*/\.\*/g;
	    $l[0] =~ s/\?/\./g;

	    $l[1] =~ s/\*/\.\*/g;
	    $l[1] =~ s/\?/\./g;

	    my $p = [];
	    $p->[0] = $l[0];
	    $p->[1] = $l[1];
	    $p->[2] = $l[2];

	    push(@XencData, $p);
	}
    }
}

sub get_xencoding {
    my $charset = shift;;
    my $encoding = shift || '';

    unless (@XencData) {
	read_csetenc_xenc_data("$DEFOMA_TEST_DIR/etc/defoma");
	read_csetenc_xenc_data("$DEFOMA_TEST_DIR/usr/share/defoma");
    }
    
    foreach my $i (@XencData) {
	if ($charset =~ /^($i->[0])$/ && $encoding =~ /^($i->[1])$/) {
	    if ($i->[2] eq 'ignore' || $i->[2] eq 'none') {
		return '';
	    } else {
		return $i->[2];
	    }
	}
    }

    return '';
}

my @X2C;

sub read_xenc_cset_file {
    my $dir = shift;
    $dir .= "/xenc-cset.data";
    
    my $i;
    my @l;
    my @file = readfile($dir);

    while (@file) {
	my $a = shift(@file);

	next if ($a =~ /^\#/);
	
	@l = split(' ', $a);
	if (@l >= 2) {
	    $l[0] =~ s/\./\\./g;
	    $l[0] =~ s/\*/\.*/g;
	    $l[0] =~ s/\?/\./g;
	    
	    push(@X2C, $l[0], $l[1]);
	}
    }
}

sub get_charset {
    my $xfont = shift;
    my $i;

    unless (@X2C) {
	read_xenc_cset_file("$DEFOMA_TEST_DIR/etc/defoma");
	read_xenc_cset_file("$DEFOMA_TEST_DIR/usr/share/defoma");
    }
    
    $xfont =~ /([^-]+-[^-]+)$/;
    my $xenc = $1;
    
    for ($i = 0; $i < @X2C; $i += 2) {
	return $X2C[$i + 1] if ($xenc =~ /^($X2C[$i])$/);
    }

    return '';
}

###### Weight -> Numeric ######

my %Weight2Numeric = ( Medium => 0,
		       Regular => 0,
		       Normal => 0,
		       Book => 0,
		       UltraBold => 4,
		       Ultrabold => 4,
		       ExtraBold => 3,
		       Extrabold => 3,
		       Bold => 2,
		       Semibold => 1,
		       DemiBold => 1,
		       Demibold => 1,
		       ExtraLight => -3,
		       Extralight => -3,
		       Light => -2,
		       SemiLight => -1,
		       Semilight => -1);

sub weight_a2i {
    my $weight = shift;

    return 0 unless ($weight);

    exists($Weight2Numeric{$weight}) && return $Weight2Numeric{$weight};

    $weight =~ tr/A-Z/a-z/;
    my @l = keys(%Weight2Numeric);
    foreach my $k (@l) {
	my $j = $k;
	$j =~ tr/A-Z/a-z/;

	return $Weight2Numeric{$k} if ($j eq $weight);
    }

    return 0;
}

sub weight_ascii2integer {
    return weight_a2i(@_);
}

###### get XLFD from x-ttcidfont-conf database ######

my ($XId, $XId2);

sub get_xlfd_of_font {
    my $font = shift;
    my %op = @_;
    
    my $level = $op{level} || '';
    my $face = $op{face};
    
    unless ($XId) {
	my $pkg = 'x-ttcidfont-conf';
	$XId = &Debian::Defoma::Id::defoma_id_open_cache('', $pkg);
	$XId2 = &Debian::Defoma::Id::defoma_id_open_cache('sub', $pkg);
	return () unless ($XId && $XId2);
    }

    my @ret;
    my @l = &Debian::Defoma::Id::defoma_id_grep_cache($XId, 'real',
						      font => $font);
    foreach my $i (@l) {
	next if ($XId->{2}->[$i] ne 'SrI');

	my @hints = split(' ', $XId->{7}->[$i]);
	my $ttcap = shift(@hints);

	if (defined($face)) {
	    next if ($ttcap !~ /fn=$face/ && $ttcap !~ /:$face:/);
	}

	if ($level eq 'min') {
	    next if ($ttcap =~ /ds=y/ || $ttcap =~ /ai=/);
	}

	push(@ret, $XId->{0}->[$i]);
    }

    if ($level eq 'max') {
	@l = &Debian::Defoma::Id::defoma_id_grep_cache($XId2, 'real',
						       font => $font);
	foreach my $i (@l) {
	    next if ($XId2->{2}->[$i] ne 'SrI');
	    
	    my @hints = split(' ', $XId2->{7}->[$i]);
	    my $ttcap = shift(@hints);

	    if (defined($face)) {
		next if ($ttcap !~ /fn=$face/ && $ttcap !~ /:$face:/);
	    }

	    push(@ret, $XId2->{0}->[$i]);
	}
    }

    return @ret;
}
	
package Debian::Defoma::Configure;
use strict;
#no strict 'subs';
use POSIX;
use File::Copy;

use vars qw(@ISA $DEFAULT_PACKAGE $DEFAULT_CATEGORY
	    @ACCEPT_CATEGORIES $APPINFO);

use Debian::Defoma::Common;
import Debian::Defoma::Common qw($DEFAULT_CATEGORY $DEFAULT_PACKAGE
				 &get_files &diff_files &readfile &writefile);


my %AppInfo = ();
my %Initialized = ();
my %Categories = ();
my @DefaultPackage = ();
my @DefaultCategory = ();
my %OriginalScripts;
my %RootScripts;
my %FontTouchTime;
my $UpdateTime;

sub read_status_cache {
    my $rootdir = shift;

    %FontTouchTime = ();
    $UpdateTime = 0;
    
    my @file = readfile($rootdir . "/status-cache");

    while (@file) {
	my @l = split(' ', shift(@file));

	my $mode = shift(@l);
	
	if ($mode eq 'font-last-modified') {
	    $FontTouchTime{$l[0]} = $l[1];
	} elsif ($mode eq 'app-ignore') {
	    hash_app_info($l[0], 'ignore_category', $l[1], undef);
	} elsif ($mode eq 'app-subdirs') {
	    push_app_info($l[0], 'subdirs', $l[1]);
	} elsif ($mode eq 'app-links') {
	    push_app_info($l[0], 'links', $l[1].' '.$l[2]);
	} elsif ($mode eq 'defoma-last-run') {
	    $UpdateTime = $l[0];
	}
    }
}

sub write_status_cache {
    my $time = time();
    my @file = ();
    
    foreach my $fobj (values(%Debian::Defoma::Font::Fobjs)) {
	my $c = $fobj->{category};
	my $t = ($fobj->{updated} || ! $FontTouchTime{$c}) ?
	    $time : $FontTouchTime{$c};
	
	push(@file, "font-last-modified $c $t");
    }
    
    foreach my $app (keys(%AppInfo)) {
	if ($AppInfo{$app}->{ignore_category}) {
	    foreach my $i (keys(%{$AppInfo{$app}->{ignore_category}})) {
		push(@file, "app-ignore $app $i");
	    }
	}
	if ($AppInfo{$app}->{subdirs}) {
	    foreach my $d (@{$AppInfo{$app}->{subdirs}}) {
		push(@file, "app-subdirs $app $d") if ($d ne '');
	    }
	}
	if ($AppInfo{$app}->{links}) {
	    foreach my $l (@{$AppInfo{$app}->{links}}) {
		push(@file, "app-links $app $l") if ($l ne '');
	    }
	}
    }
    
    push(@file, "defoma-last-run $time");

    writefile(ROOTDIR . "/status-cache", @file);
}

sub set_app_info {
    my $app = shift;
    my $key = shift;
    my $value = shift;

    unless (exists($AppInfo{$app})) {
	$AppInfo{$app} = {};
    }

    $AppInfo{$app}->{$key} = $value;
}

sub push_app_info {
    my $app = shift;
    my $key = shift;

    unless (exists($AppInfo{$app})) {
	$AppInfo{$app} = {};
    }

    unless (exists($AppInfo{$app}->{$key})) {
	$AppInfo{$app}->{$key} = [];
    }

    push(@{$AppInfo{$app}->{$key}}, @_);
}

sub hash_app_info {
    my $app = shift;
    my $key = shift;
    my $hkey = shift;
    my $hvalue = shift;

    unless (exists($AppInfo{$app})) {
	$AppInfo{$app} = {};
    }

    unless (exists($AppInfo{$app}->{$key})) {
	$AppInfo{$app}->{$key} = {};
    }

    $AppInfo{$app}->{$key}->{$hkey} = $hvalue;
}

sub set_app_categories {
    my $app = shift;
    
    foreach my $i (@_) {
	$Categories{$i} = [] unless (exists($Categories{$i}));
	if ($app eq 'x-ttcidfont-conf' || $app eq 'psfontmgr') {
	    unshift(@{$Categories{$i}}, $app);
	} else {
	    push(@{$Categories{$i}}, $app);
	}
    }

    push_app_info($app, 'category', @_);
}

sub clear_app_info {
    my $app = shift;

    if (defined($app)) {
	delete($AppInfo{$app});
    } else {
	%AppInfo = ();
    }
}

sub get_app_info {
    my $app = shift;
    
    return $AppInfo{$app};
}

sub get_status {
    my $fonttouchtime = shift;
    my $updatetime = shift;

    %{$fonttouchtime} = %FontTouchTime;
    $$updatetime = $UpdateTime;
}

sub diff_scripts {
    foreach my $app (keys(%OriginalScripts), keys(%RootScripts)) {
	next if (exists($AppInfo{$app}->{script_change}));
	
	if (! $RootScripts{$app} && $OriginalScripts{$app}) {
	    set_app_info($app, 'script_change', 'new');
	} elsif ($RootScripts{$app} && ! $OriginalScripts{$app}) {
	    set_app_info($app, 'script_change', 'obsoleted');
	    set_app_info($app, 'ignoreall', 1);
	    printw("$app is already removed. ".
		   "It is recommended to run defoma-app purge $app.");
	} else {
	    if (diff_files($RootScripts{$app}, $OriginalScripts{$app})) {
		set_app_info($app, 'script_change', 'updated');
		set_app_info($app, 'ignoreall', 1);
	    } else {
		set_app_info($app, 'script_change', 'same');
	    }
	}
    }

    return 0;
}

sub init_scripts {
    # Check out /usr/share/defoma/scripts

    my $pat = (USERSPACE) ? "\\.udefoma\$" : "\\.defoma\$";
    my @scripts;
    my $script;

    %OriginalScripts = ();

    foreach my $dir (SCRIPTDIRS) {
	next unless (-d $dir);

	@scripts = get_files($pat, $dir);
    
	foreach $script (@scripts) {
	    my $app = $script;
	    $app =~ s/$pat//;
	    
	    unless (exists($OriginalScripts{$app})) {
		$OriginalScripts{$app} = "$dir/$script";
	    }
	}
    }

    %RootScripts = ();

    @scripts = get_files($pat, SCRIPTDIR);

    foreach $script (@scripts) {
	my $app = $script;
	$app =~ s/$pat//;
	
	$RootScripts{$app} = SCRIPTDIR ."/$script";
    }
}

sub update_script {
    my $app = shift;

    my $suffix = (USERSPACE) ? "udefoma" : "defoma";

    unless (copy($OriginalScripts{$app}, SCRIPTDIR . "/$app.$suffix")) {
	printe("Failed to copy " . $OriginalScripts{$app} . "to " .
	       SCRIPTDIR . ".");
	set_app_info($app, 'error', 1);
	
	return 1;
    }
    
    mkdir(ROOTDIR . "/$app.d");

    unless (-d ROOTDIR . "/$app.d") {
	printe("Failed to create application directory: " . ROOTDIR . ".");
	set_app_info($app, 'error', 1);
	
	return 1;
    }

    return 0;
}

sub remove_script {
    my $app = shift;

    my $suffix = (USERSPACE) ? "udefoma" : "defoma";

    unlink(SCRIPTDIR . "/$app.$suffix");
}

sub purge_script {
    my $app = shift;

    remove_script($app);
    
    rrm("$app.d") if (compare_version_app($app, "0.10") >= 0);
    
    links_purge($app);

    clear_app_info($app);
}

sub load_scripts {
    my $updateapp = shift || '';
    
    foreach my $app (keys(%AppInfo)) {
	if ($AppInfo{$app}->{script_change} eq 'new' && $app eq $updateapp) {
	    # new script
	    next if (update_script($app));
	}

	my $suffix = (USERSPACE) ? "udefoma" : "defoma";
	my $script = SCRIPTDIR . "/$app.$suffix";
	
	next unless (-f $script);

	@ACCEPT_CATEGORIES = ();
	undef $APPINFO;
	$APPINFO = {};
	
	eval('require($script);');
	if ($@) {
	    printe("Unable to load: $script because:\n$@");
	    set_app_info($app, 'error', 1);
	}
	
	if (compare_version_app($app, VERSION) > 0) {
	    printe("$app.$suffix requires defoma ", $AppInfo{$app}->{require},
		   " or later version while the installed version is ",
		   VERSION, ".");
	    set_app_info($app, 'error', 1);
	    
	    next;
	}
	
	if ($AppInfo{$app}->{script_change} eq 'new' && $app eq $updateapp &&
	    compare_version_app($app, "0.10") >= 0) {
	    # new script
	    subdirs_update($app) && next;
	    links_update($app) && next;
	}

	set_app_categories($app, @ACCEPT_CATEGORIES);
#	set_app_info($app, 'info', $APPINFO);
    }
}

sub init {
    read_status_cache(ROOTDIR);

    init_scripts();

    diff_scripts();
}

sub init2 {
    load_scripts(@_);
    write_status_cache();
}

sub term {
    my @list = keys(%Initialized);
    my ($i, $c, $a);
    
    foreach $i (@list) {
	$i =~ /(.*)\/(.*)/;
	$c = $1;
	$a = $2;
	
	push(@DefaultPackage, $DEFAULT_PACKAGE);
	push(@DefaultCategory, $DEFAULT_CATEGORY);
	
	$DEFAULT_PACKAGE = $a;
	$DEFAULT_CATEGORY = $c;

	$a =~ s/[^a-zA-Z0-9]/_/g;
	$c =~ s/[^a-zA-Z0-9]/_/g;
	
	eval("${a}::${c}('term')");
	printw("In ${a}::${c}('term'): ", $@) if ($@);

	$DEFAULT_PACKAGE = pop(@DefaultPackage);
	$DEFAULT_CATEGORY = pop(@DefaultCategory);
    }

    write_status_cache();

    foreach my $app (keys(%AppInfo)) {
	if ($AppInfo{$app}->{error}) {
	    remove_script($app);
	    
	    printe("$app was excluded from configuration due to the error " .
		   "in the header.");
	    printe("Please perform the following things.");
	    printe("  (1) run defoma-app purge $app.");
	    printe("  (2) upgrade $app and/or defoma.");
	    printe("  (3) run defoma-app update $app.");
	}
    }
    
    return 0;
}

sub subdirs_update {
    my $app = shift;
    my $pkgdir = ROOTDIR . "/$app.d";
    
    if ($APPINFO->{subdirs}) {
	if ($AppInfo{$app}->{subdirs}) {
	    foreach my $dir (@{$AppInfo{$app}->{subdirs}}) {
		unless (grep($_ eq $dir, @{$APPINFO->{subdirs}})) {
		    # obsoleted subdirectory
		    rrm("$app.d/$dir");
		    $dir = '';
		}
	    }
	}
	
	foreach my $dir (@{$APPINFO->{subdirs}}) {
	    if ($dir =~ /^\// || $dir =~ /\.\./) {
		printe("Illegal app subdirs: $pkgdir/$dir. ");
		set_app_info($app, 'error', 1);
		return 1;
	    }
	    unless (-d "$pkgdir/$dir") {
		# new subdirectory
		if (mkdirp("$pkgdir/$dir")) {
		    printe("$pkgdir/$dir: mkdir failed. ");
		    set_app_info($app, 'error', 1);
		    return 1;
		}

		push_app_info($app, 'subdirs', $dir);
	    }
	}
    } elsif ($AppInfo{$app}->{subdirs}) {
	foreach my $dir (@{$AppInfo{$app}->{subdirs}}) {
	    # obsoleted subdirectory
	    rrm("$app.d/$dir");
	    $dir = '';
	}
    }
}

sub links_update {
    my $app = shift;
    my $pkgdir = ROOTDIR . "/$app.d";
    
    if ($APPINFO->{links}) {
	if ($AppInfo{$app}->{links}) {
	    foreach my $links (@{$AppInfo{$app}->{links}}) {
		unless (grep($_ eq $links, @{$APPINFO->{links}})) {
		    # obsoleted link
		    my @l = split(' ', $links);
		    unlink(DEFOMA_TEST_DIR . $l[1]);
		    $links = '';
		}
	    }
	}
	
	foreach my $links (@{$APPINFO->{links}}) {
	    next if ($AppInfo{$app}->{links} &&
		     grep($_ eq $links, @{$AppInfo{$app}->{links}}));
	    # new link
	    
	    my @l = split(' ', $links);

	    unless (@l == 2) {
		printe("$app contains illegal links in the header.");
		next;
	    }
	    
	    my $src = $l[0];
	    my $dest = DEFOMA_TEST_DIR . "$l[1]";

	    if ($dest !~ /^\// || index($dest, ROOTDIR) != -1 ||
		$src =~ /^\// || $src =~ /\.\./) {
		printe("Illegal app links: $dest -> $pkgdir/$src. ");
		set_app_info($app, 'error', 1);
		return 1;
	    }
	    
	    unless (symlink("$pkgdir/$src", $dest)) {
		printe("$dest -> $pkgdir/$src: symlink failed. ");
		set_app_info($app, 'error', 1);
		return 1;
	    }
	    
	    push_app_info($app, 'links', $links);
	}
    } elsif ($AppInfo{$app}->{links}) {
	links_purge($app);
    }
}

sub links_purge {
    my $app = shift;
    
    if ($AppInfo{$app}->{links}) {
	foreach my $links (@{$AppInfo{$app}->{links}}) {
	    my @l = split(' ', $links);
	    unlink(DEFOMA_TEST_DIR . $l[1]);
	    $links = '';
	}
    }
}

sub call_1 {
    my $fobj = shift;
    my $app = shift;
    my $com = shift;
    my $category = shift;
    my $font = shift;

    return 0 if ($AppInfo{$app}->{ignoreall});
    return 0 if ($AppInfo{$app}->{ignore_category} &&
		 exists($AppInfo{$app}->{ignore_category}->{$category}));

    push(@DefaultPackage, $DEFAULT_PACKAGE);
    push(@DefaultCategory, $DEFAULT_CATEGORY);

    $DEFAULT_PACKAGE = $app;
    $DEFAULT_CATEGORY = $category;

    my $appi = $app;
    $appi =~ s/[^a-zA-Z0-9]/_/g;
    my $ctgi = $category;
    $ctgi =~ s/[^a-zA-Z0-9]/_/g;

    unless (exists($Initialized{"$category/$app"})) {
	$Initialized{"$category/$app"} = '';
	eval("${appi}::${ctgi}('init')");
	printw("In ${appi}::${ctgi}('init'): ", $@) if ($@);
    }

    my $ret = eval("${appi}::${ctgi}(\$com, \$font, \@_)");
    printw("In ${appi}::${ctgi}('$com', '$font', ...): ", $@) if ($@);

    $DEFAULT_PACKAGE = pop(@DefaultPackage);
    $DEFAULT_CATEGORY = pop(@DefaultCategory);

    if ($fobj && $com eq 'unregister') {
	if ($fobj->remove_failed($font, $app)) {
	    return 0;
	}
    }

    if ($ret && $fobj && $com eq 'register') {
	$fobj->add_failed($font, $app, $ret);
	printv("$font: failed to register for package $app, status($ret).");
    }

    return $ret;
}

sub call_m {
    my $fobj = shift;
    my $com = shift;
    my $category = shift;
    my $font = shift;

    return unless (exists($Categories{$category}));

    foreach my $app (@{$Categories{$category}}) {
	call_1($fobj, $app, $com, $category, $font, @_);
    }

    return 0;
}

sub rrm {
    my $dir = shift;
    my $cwd = getcwd();

    chdir(ROOTDIR);
    return 1 unless (ROOTDIR eq getcwd());
    return 1 if ($dir =~ /^\// || $dir =~ /\.\./);

    system("/bin/rm", "-r", $dir) if (-e $dir);

    chdir($cwd);

    return 0;
}

sub mkdirp {
    my $dir = shift;

    my $dirs = '';
    foreach my $d (split('/', $dir)) {
	$dirs .= "/" . $d;
	next if (-d $dirs);
	
	mkdir($dirs) || return 1;
    }

    return 0;
}

sub compare_version {
    my @v1 = split(/\./, shift);
    my @v2 = split(/\./, shift);

    while (@v1 > 0 || @v2 > 0) {
	my $vv1 = (@v1 > 0) ? shift(@v1) : 0;
	my $vv2 = (@v2 > 0) ? shift(@v2) : 0;

	return -1 if ($vv1 < $vv2);
	return 1 if ($vv1 > $vv2);
    }

    return 0;
}

sub compare_version_app {
    my $app = shift;

    my $v = ($AppInfo{$app} && $AppInfo{$app}->{require}) ?
	$AppInfo{$app}->{require} : 0;

    return compare_version($v, shift);
}

sub get_app_categories {
    my $app = shift;

    return () unless (exists($AppInfo{$app}) &&
		      exists($AppInfo{$app}->{category}));
    return @{$AppInfo{$app}->{category}};
}

sub get_apps {
    return keys(%AppInfo);
}

1;    
