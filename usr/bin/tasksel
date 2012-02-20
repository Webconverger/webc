#!/usr/bin/perl
# Debian task selector, mark II.
# Copyright 2004-2006 by Joey Hess <joeyh@debian.org>.
# Licensed under the GPL, version 2 or higher.
use Locale::gettext;
use Getopt::Long;
use warnings;
use strict;
textdomain('tasksel');

my $debconf_helper="/usr/lib/tasksel/tasksel-debconf";
my $testdir="/usr/lib/tasksel/tests";
my $packagesdir="/usr/lib/tasksel/packages";
my $descdir="/usr/share/tasksel";
my $localdescdir="/usr/local/share/tasksel";
my $statusfile="/var/lib/dpkg/status";
my $infodir="/usr/lib/tasksel/info";
my $testmode=0;

sub warning {
	print STDERR "tasksel: @_\n";
}

sub error {
	print STDERR "tasksel: @_\n";
	exit 1;
}

# Run a shell command except in test mode, and returns its exit code.
# Prints the command in test mode. Parameters should be pre-split for
# system.
sub run {
	if ($testmode) {
		print join(" ", @_)."\n";
		return 0;
	}
	else {
		return system(@_) >> 8;
	}
}

# A list of all available task desc files.
sub list_task_descs {
	return glob("$descdir/*.desc"), glob("$localdescdir/*.desc");
}

# Returns a list of hashes; hash values are arrays for multi-line fields.
sub read_task_desc {
	my $desc=shift;
	my @ret;
	open (DESC, "<$desc") || die "read $desc\: $!";
	local $/="\n\n";
	while (<DESC>) {
		my %data;
		my @lines=split("\n");
		while (@lines) {
			my $line=shift(@lines);
			if ($line=~/^([^ ]+):(?: (.*))?/) {
				my ($key, $value)=($1, $2);
				$key=lc($key);
				if (@lines && $lines[0] =~ /^\s+/) {
					# multi-line field
					my @values;
					if (defined $value && length $value) {
						push @values, $value;
					}
					while (@lines && $lines[0] =~ /^\s+(.*)/) {
						push @values, $1;
						shift @lines;
					}
					$data{$key}=[@values];
				}
				else {
					$data{$key}=$value;
				}
			}
			else {
				warning "parse error in stanza $. of $desc";
			}
		}
		if (%data) {
			$data{relevance}=5 unless exists $data{relevance};
			$data{shortdesc}=$data{description}->[0];
			$data{shortdesctrans}=dgettext("debian-tasks", $data{shortdesc});
			push @ret, \%data;
		}
	}
	close DESC;
	return @ret;
}

# Loads info for all tasks, and returns a set of task structures.
sub all_tasks {
	my %seen;
	grep { $seen{$_->{task}}++; $seen{$_->{task}} < 2 }
	map { read_task_desc($_) } list_task_descs();
}

# Returns a list of all available packages.
sub list_avail {
	my @list;
	# Might be better to use the perl apt bindings, but they are not
	# currently in base.
	open (AVAIL, "apt-cache dumpavail|");
	local $_;
	while (<AVAIL>) {
		chomp;
		if (/^Package: (.*)/) {
			push @list, $1;
		}
	}
	close AVAIL;
	return @list;
}

# Returns a list of all installed packages.
sub list_installed {
	my @list;
	local $/="\n\n";
	open (STATUS, $statusfile);
	local $_;
	while (<STATUS>) {
		if (/^Status: .* installed$/m && /Package: (.*)$/m) {
			push @list, $1;
		}
	}
	close STATUS;
	return @list;
}

my %avail_pkgs;
# Given a package name, checks to see if it's available. Memoised.
sub package_avail {
	my $package=shift;
	
	if (! %avail_pkgs) {
		foreach my $pkg (list_avail()) {
			$avail_pkgs{$pkg} = 1;
		}
	}

	return $avail_pkgs{$package} || package_installed($package);
}

my %installed_pkgs;
# Given a package name, checks to see if it's installed. Memoised.
sub package_installed {
	my $package=shift;
	
	if (! %installed_pkgs) {
		foreach my $pkg (list_installed()) {
			$installed_pkgs{$pkg} = 1;
		}
	}

	return $installed_pkgs{$package};
}

# Given a task hash, checks if its key packages are available.
sub task_avail {
	local $_;
	my $task=shift;
	if (! ref $task->{key}) {
		return 1;
	}
	else {
		foreach my $pkg (@{$task->{key}}) {
			if (! package_avail($pkg)) {
				return 0;
			}
		}
		return 1;
	}
}

# Given a task hash, checks to see if it is already installed.
# (All of its key packages must be installed.)
sub task_installed {
	local $_;
	my $task=shift;
	if (! ref $task->{key}) {
		return 0; # can't tell with no key packages
	}
	else {
		foreach my $pkg (@{$task->{key}}) {
			if (! package_installed($pkg)) {
				return 0;
			}
		}
		return 1;
	}
}

# Given task hash, returns a list of all available packages in the task.
# If the aptitude_tasks parameter is true, then it does not expand tasks
# that aptitude knows about, and just returns aptitude task syntax for
# those.
sub task_packages {
	my $task=shift;
	my $aptitude_tasks=shift;
	
	my %list;

	# key packages are always included
	if (ref $task->{key}) {
		map { $list{$_}=1 } @{$task->{key}};
	}
		
	if ($task->{packages} eq 'task-fields') {
		# task-fields method is built-in for speed and to support
		# aptitude task definitions
		if ($aptitude_tasks) {
			return '~t^'.$task->{task}.'$';
		}
		else {
			local $/="\n\n";
			open (AVAIL, "apt-cache dumpavail|");
			while (<AVAIL>) {
				if (/^Task: (.*)/m) {
					my @tasks=split(", ", $1);
					if (grep { $_ eq $task->{task} } @tasks) { 
						$list{$1}=1 if /^Package: (.*)/m;
					}
				}
			}
			close AVAIL;
		}
	}
	elsif ($task->{packages} eq 'standard') {
		# standard method is built in since it cannot easily be
		# implemented externally.
		return "~pstandard", "~prequired", "~pimportant";
	}
	elsif ($task->{packages} eq 'manual') {
		# manual package selection is a special case
		return;
	}
	else {
		# external method
		my ($method, @params);
		if (ref $task->{packages}) {
			@params=@{$task->{packages}};
			$method=shift @params;
		}
		else {
			$method=$task->{packages};
		}
		
		map { $list{$_}=1 }
			grep { package_avail($_) }
			split(' ', `$packagesdir/$method $task->{task} @params`);
	}

	return keys %list;
}

# Given a task hash, runs any test program specified in its data, and sets
# the _display and _install fields to 1 or 0 depending on its result.
sub task_test {
	my $task=shift;
	my $new_install=shift;
	$task->{_display} = shift; # default
	$task->{_install} = shift; # default
	$ENV{NEW_INSTALL}=$new_install if defined $new_install;
	foreach my $test (grep /^test-.*/, keys %$task) {
		$test=~s/^test-//;
		if (-x "$testdir/$test") {
			my $ret=system("$testdir/$test", $task->{task}, split " ", $task->{"test-$test"}) >> 8;
			if ($ret == 0) {
				$task->{_display} = 0;
				$task->{_install} = 1;
			}
			elsif ($ret == 1) {
				$task->{_display} = 0;
				$task->{_install} = 0;
			}
			elsif ($ret == 2) {
				$task->{_display} = 1;
				$task->{_install} = 1;
			}
			elsif ($ret == 3) {
				$task->{_display} = 1;
				$task->{_install} = 0;
			}
		}
	}
	
	delete $ENV{NEW_INSTALL};
	return $task;
}

# Hides a task and marks it not to be installed if it enhances other
# tasks.
sub hide_enhancing_tasks {
	my $task=shift;
	if (exists $task->{enhances} && length $task->{enhances}) {
		$task->{_display} = 0;
		$task->{_install} = 0;
	}
	return $task;
}

# Converts a list of tasks into a debconf list of their short descriptions.
sub task_to_debconf {
	my $field = shift;
	join ", ", map {
		my $desc=$_->{$field};
		if ($desc=~/, /) {
			warning("task ".$_->{task}." contains a comma in its short description: \"$desc\"");
		}
		$desc;
	} @_;
}

# Given a first parameter that is a debconf list of short descriptions of
# tasks, or a dependency style list of task names, and then a list of task
# hashes, returns a list of hashes for all the tasks in the list.
sub list_to_tasks {
	my $list=shift;
	my %desc_to_task = map { $_->{shortdesc} => $_, $_->{task} => $_ } @_;
	return grep { defined } map { $desc_to_task{$_} } split ", ", $list;
}

# Orders a list of tasks for display.
sub order_for_display {
	sort {
		$b->{relevance} <=> $a->{relevance}
		              || 0 ||
		  $a->{section} cmp $b->{section}
		              || 0 ||
	        $a->{shortdesc} cmp $b->{shortdesc}
	} @_;
}

# Given a set of tasks and a name, returns the one with that name.
sub name_to_task {
	my $name=shift;
	return (grep { $_->{task} eq $name } @_)[0];
}

sub task_script {
	my $task=shift;
	my $script=shift;

	my $path="$infodir/$task.$script";
	if (-e $path && -x _) {
		my $ret=run($path);
		if ($ret != 0) {
			warning("$path exited with nonzero code $ret");
			return 0;
		}
	}
	return 1;
}

sub usage {
	print STDERR gettext(q{Usage:
tasksel install <task>
tasksel remove <task>
tasksel [options]
	-t, --test          test mode; don't really do anything
	    --new-install   automatically install some tasks
	    --list-tasks    list tasks that would be displayed and exit
	    --task-packages list available packages in a task
	    --task-desc     returns the description of a task
});
}

# Process command line options and return them in a hash.
sub getopts {
	my %ret;
	Getopt::Long::Configure ("bundling");
	if (! GetOptions(\%ret, "test|t", "new-install", "list-tasks",
		   "task-packages=s@", "task-desc=s",
		   "debconf-apt-progress=s")) {
		usage();
		exit(1);
	}
	# Special case apt-like syntax.
	if (@ARGV && $ARGV[0] eq "install") {
		shift @ARGV;
		$ret{install} = shift @ARGV;
	}
	if (@ARGV && $ARGV[0] eq "remove") {
		shift @ARGV;
		$ret{remove} = shift @ARGV;
	}
	if (@ARGV) {
		usage();
		exit 1;
	}
	$testmode=1 if $ret{test}; # set global
	return %ret;
}

sub main {
	my %options=getopts();
	my @tasks_remove;
	my @tasks_install;

	# Options that output stuff and don't need a full processed list of
	# tasks.
	if (exists $options{"task-packages"}) {
		my @tasks=all_tasks();
		foreach my $taskname (@{$options{"task-packages"}}) {
			my $task=name_to_task($taskname, @tasks);
			if ($task) {
				print "$_\n" foreach task_packages($task);
			}
		}
		exit(0);
	}
	elsif ($options{"task-desc"}) {
		my $task=name_to_task($options{"task-desc"}, all_tasks());
		if ($task) {
			my $extdesc=join(" ", @{$task->{description}}[1..$#{$task->{description}}]);
			print dgettext("debian-tasks", $extdesc)."\n";
			exit(0);
		}
		else {
			exit(1);
		}
	}

	# This is relatively expensive, get the full list of available tasks and
	# mark them.
	my @tasks=map { hide_enhancing_tasks($_) } map { task_test($_, $options{"new-install"}, 1, 0) }
	          grep { task_avail($_) } all_tasks();
	
	if ($options{"list-tasks"}) {
		map { $_->{_installed} = task_installed($_) } @tasks;
		print "".($_->{_installed} ? "i" : "u")." ".$_->{task}."\t".$_->{shortdesc}."\n"
			foreach order_for_display(grep { $_->{_display} } @tasks);
		exit(0);
	}
	
	if (! $options{"new-install"}) {
		# Don't install hidden tasks if this is not a new install.
		map { $_->{_install} = 0 } grep { $_->{_display} == 0 } @tasks;
	}
	if ($options{"install"}) {
		my $task=name_to_task($options{"install"}, @tasks);
		$task->{_install} = 1 if $task;
	}
	if ($options{"remove"}) {
		my $task=name_to_task($options{"remove"}, @tasks);
		push @tasks_remove, $task;
	}
	
	# The interactive bit.
	my $interactive=0;
	my @list = order_for_display(grep { $_->{_display} == 1 } @tasks);
	if (@list && ! $options{install} && ! $options{remove}) {
		$interactive=1;
		if (! $options{"new-install"}) {
			# Find tasks that are already installed.
			map { $_->{_installed} = task_installed($_) } @list;
			# Don't install new tasks unless manually selected.
			map { $_->{_install} = 0 } @list;
		}
		else {
			# Assume that no tasks are installed, to ensure
			# that complete tasks get installed on new
			# installs.
			map { $_->{_installed} = 0 } @list;
		}
		my $question="tasksel/tasks";
		if ($options{"new-install"}) {
			$question="tasksel/first";
		}
		my @default = grep { $_->{_display} == 1 && ($_->{_install} == 1 || $_->{_installed} == 1) } @tasks;
		my $tmpfile=`tempfile`;
		chomp $tmpfile;
		my $ret=system($debconf_helper, $tmpfile,
			task_to_debconf("shortdesc", @list),
			task_to_debconf("shortdesctrans", @list),
			task_to_debconf("shortdesc", @default),
			$question) >> 8;
		if ($ret == 30) {
			exit 10; # back up
		}
		elsif ($ret != 0) {
			error "debconf failed to run";
		}
		open(IN, "<$tmpfile");
		$ret=<IN>;
		if (! defined $ret) {
			die "tasksel canceled\n";
		}
		chomp $ret;
		close IN;
		unlink $tmpfile;
		
		# Set _install flags based on user selection.
		map { $_->{_install} = 0 } @list;
		foreach my $task (list_to_tasks($ret, @tasks)) {
			if (! $task->{_installed}) {
				$task->{_install} = 1;
			}
			$task->{_selected} = 1;
		}
		foreach my $task (@list) {
			if (! $task->{_selected} && $task->{_installed}) {
				push @tasks_remove, $task;
			}
		}
	}

	# If an enhancing task is already marked for
	# install, probably by preseeding, mark the tasks
	# it enhances for install.
	foreach my $task (grep { $_->{_install} && exists $_->{enhances} &&
	                         length $_->{enhances} } @tasks) {
		map { $_->{_install}=1 } list_to_tasks($task->{enhances}, @tasks);
	}

	# Select enhancing tasks for install.
	# XXX FIXME ugly hack -- loop until enhances settle to handle
	# chained enhances. This is ugly and could loop forever if
	# there's a cycle.
	my $enhances_needswork=1;
	my %tested;
	while ($enhances_needswork) {
		$enhances_needswork=0;
		foreach my $task (grep { ! $_->{_install} && exists $_->{enhances} &&
		                         length $_->{enhances} } @tasks) {
			my %tasknames = map { $_->{task} => $_ } @tasks;
			my @deps=map { $tasknames{$_} } split ", ", $task->{enhances};

			if (grep { ! defined $_ } @deps) {
				# task enhances an unavailable or
				# uninstallable task
				next;
			}

			if (@deps) {
				my $orig_state=$task->{_install};

				# Mark enhancing tasks for install if their
				# dependencies are met and their test fields
				# mark them for install.
				if (! exists $tested{$task->{task}}) {
					$ENV{TESTING_ENHANCER}=1;
					task_test($task, $options{"new-install"}, 0, 1);
					delete $ENV{TESTING_ENHANCER};
					$tested{$task->{task}}=$task->{_install};
				}
				else {
					$task->{_install}=$tested{$task->{task}};
				}

				foreach my $dep (@deps) {
					if (! $dep->{_install}) {
						$task->{_install} = 0;
					}
				}

				if ($task->{_install} != $orig_state) {
					$enhances_needswork=1;
				}
			}
		}
	}

	# Add tasks to install and see if any selected task requires manual
	# selection.
	my $manual_selection=0;
	foreach my $task (grep { $_->{_install} } @tasks) {
		push @tasks_install, $task;
		if ($task->{packages} eq 'manual') {
			$manual_selection=1;
		}
	}
	
	my @aptitude;
	if ($manual_selection) {
		# Manaul selection and task installs, as best
		# aptitude can do it currently. Disables use of
		# debconf-apt-progress.
		@aptitude="aptitude";
	}
	elsif (-x "/usr/bin/debconf-apt-progress") {
		@aptitude="debconf-apt-progress";
		push @aptitude, split(' ', $options{'debconf-apt-progress'})
			if exists $options{'debconf-apt-progress'};
		push @aptitude, qw{-- aptitude -q};
	}
	else {
		@aptitude="aptitude";
	}
	
	# And finally, act on selected tasks.
	if (@tasks_install || @tasks_remove || $manual_selection) {
		my @args;
		foreach my $task (@tasks_remove) {
			push @args, map { "$_-" } task_packages($task, 0);
			task_script($task->{task}, "prerm");
		}
		foreach my $task (@tasks_install) {
			push @args, task_packages($task, 1);
			task_script($task->{task}, "preinst");
		}
		# If the user selected no other tasks and manual package
		# selection, run aptitude w/o the --visual-preview parameter.
		if (! @args && $manual_selection) {
			my $ret=run("aptitude");
			if ($ret != 0) {
				error gettext("aptitude failed")." ($ret)";
			}
		}
		else {
			if ($manual_selection) {
				unshift @args, "--visual-preview";
			}
			my $ret=run(@aptitude, "-y", "install", @args);
			if ($ret != 0) {
				error gettext("aptitude failed")." ($ret)";
			}
		}
		foreach my $task (@tasks_remove) {
			task_script($task->{task}, "postrm");
		}
		foreach my $task (@tasks_install) {
			task_script($task->{task}, "postinst");
		}
	}
}

main();
