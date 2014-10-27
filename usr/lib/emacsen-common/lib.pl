#!/usr/bin/perl -w

use strict;
use Cwd;

# depends on: dpkg, tsort, perl

my $lib_dir = "/usr/lib/emacsen-common";
my $var_dir = "/var/lib/emacsen-common";

$::installed_package_state_dir = "${var_dir}/state/package/installed";
$::installed_flavor_state_dir = "${var_dir}/state/flavor/installed";

sub ex
{
  my(@cmd) = @_;
  if(system(@cmd) != 0)
  {
    die join(" ", @cmd) . " failed";
  }
}

sub glob_in_dir
{
  my ($dir, $pattern) = @_;
  my $oldir = getcwd;
  chdir($dir) or die "chdir $dir: $!";
  my @files = glob("*[!~]");
  chdir($oldir);
  return \@files;
}

sub validate_add_on_pkg
{
  my ($pkg, $script, $old_invocation_style) = @_;
  if($old_invocation_style)
  {
    if(-e "$lib_dir/packages/compat/$pkg")
    {
      print STDERR "ERROR: $pkg is broken - called $script as an old-style add-on, but has compat file.\n";
      #exit(1);
    }
  }
  else # New invocation style.
  {
    unless(-e "$lib_dir/packages/compat/$pkg")
    {
      print STDERR "ERROR: $pkg is broken - called $script as a new-style add-on, but has no compat file.\n";
      #exit(1);
    }
  }
}

sub get_installed_add_on_packages
{
  # Return all of the old format packages, plus all of the new-format
  # packages that are ready (i.e. have a state/installed file).  In
  # this case ready means ready for compilation.
  my $all_pkgs = glob_in_dir("$lib_dir/packages/install", '*[!~]');
  my $new_format_pkgs = glob_in_dir("$lib_dir/packages/compat", '*[!~]');
  my %ready_pkgs = map { $_ => 1 } @$all_pkgs;
  for my $p (@$new_format_pkgs)
  {
    delete $ready_pkgs{$p} unless (-e "$::installed_package_state_dir/$p");
  }
  my @result = keys %ready_pkgs;
  return \@result;
}

sub get_installed_flavors
{
  my $flavors = glob_in_dir($::installed_flavor_state_dir, '*[!~]');
  return @$flavors;
}

sub get_package_status
{
  my($pkg) = @_;
  my $status = `dpkg --status $pkg`;
  die 'emacsen-common: dpkg invocation failed' if($? != 0);
  $status =~ s/\n\s+//gmo; # handle any continuation lines...
  return $status;
}

sub filter_depends
{
  my($depends_string, $installed_add_ons) = @_;

  # Filter out all the "noise" (version number dependencies, etc)
  # and handle or deps too, i.e. "Depends: foo, bar | baz" 
  my @relevant_depends = split(/[,|]/, $depends_string);
  @relevant_depends = map { /\s*(\S+)/o; $1; } @relevant_depends;

  # Filter out all non-add-on packages.
  @relevant_depends = grep {
    my $candidate = $_;
    grep { $_ eq $candidate } @$installed_add_ons;
  } @relevant_depends;
  
  return @relevant_depends;
}

sub generate_relevant_tsort_dependencies_internals
{
  my($pkglist, $installed_add_ons, $progress_hash) = @_;

  # print "GRD: " . join(" ", @$pkglist) . "\n";
  
  my $pkg = shift @$pkglist;

  if(!$pkg || $$progress_hash{$pkg}) {
    return ();
  } else {
    my $status = get_package_status($pkg);
    $status =~ /^Depends:\s+(.*)/mo;
    my $depends = $1; $depends = "" if ! $depends;
    my @relevant_depends = filter_depends($depends, $installed_add_ons);
    my $newpkglist = [@$pkglist, @relevant_depends];

    $$progress_hash{$pkg} = 1;

    # pkg is in twice so we don't have to worry about package with no
    # relevant dependencies.  tsort can't handle that.
    my @tsort_strings = "$pkg $pkg\n"; 
    map { push @tsort_strings, "$_ $pkg\n"; } @relevant_depends;
    
    return (@tsort_strings,
            generate_relevant_tsort_dependencies_internals($newpkglist,
                                                           $installed_add_ons,
                                                           $progress_hash));
  }
}

sub generate_relevant_tsort_dependencies
{
  my($pkglist, $installed_add_ons, $progress_hash) = @_;
  # Make a copy because we're going to mangle it.
  my @listcopy = @$pkglist;
  shift @_;
  return(generate_relevant_tsort_dependencies_internals(\@listcopy, @_));
}


sub reorder_add_on_packages
{
  my($pkglist, $installed_add_ons) = @_;
  my @depends = generate_relevant_tsort_dependencies($pkglist,
                                                     $installed_add_ons,
                                                     {});
  my $pid = open(TSORT, "-|");
  die "Couldn't fork for tsort: $!" unless defined($pid);

  # What a strange idiom...
  if($pid == 0) {
    my $sub_pid = open(IN, "|-");
    die "Couldn't sub-fork for tsort: $!" unless defined($sub_pid);
    if($sub_pid == 0) {
      exec 'tsort' or die "Couldn't run tsort: $!";
    }
    print IN @depends;
    exit 0;
  }
  my @ordered_pkgs = <TSORT>;
  chomp @ordered_pkgs;
  return @ordered_pkgs
}

sub generate_add_on_install_list
{
  my($packages_to_sort) = @_;
  my @sorted_pkgs = reorder_add_on_packages($packages_to_sort,
                                            get_installed_add_on_packages());
  return(@sorted_pkgs);
}

# Test code
# my @input_packages = <STDIN>;
# my @result = generate_add_on_install_list(@input_packages);
# print "  " . join("\n  ", @result);

# To make require happy...
1;
