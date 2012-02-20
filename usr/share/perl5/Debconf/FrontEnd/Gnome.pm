#!/usr/bin/perl -w
# This file was preprocessed, do not edit!


package Debconf::FrontEnd::Gnome;
use strict;
use utf8;
use Debconf::Gettext;
use Debconf::Config;
use Debconf::Encoding qw(to_Unicode);
use base qw{Debconf::FrontEnd};

eval q{
	use Gtk2;
	use Gnome2;
};
die "Unable to load Gnome -- is libgnome2-perl installed?\n" if $@;


our @ARGV_for_gnome=('--sm-disable');

sub create_druid_page {
	my $this=shift;
	
   	$this->druid_page(Gnome2::DruidPageStandard->new);
	$this->druid_page->set_logo($this->logo);
	$this->druid_page->signal_connect("back", sub {
		$this->goback(1);
		Gtk2->main_quit;
		return 1;
	});
	$this->druid_page->signal_connect("next", sub {
		$this->goback(0);
		Gtk2->main_quit;
		return 1;
	});
	$this->druid_page->signal_connect("cancel", sub { exit 1 });
	$this->druid_page->show;
	$this->druid->append_page($this->druid_page);
	$this->druid->set_page($this->druid_page);
}

sub init {
	my $this=shift;
	
	if (fork) {
		wait(); # for child
		if ($? != 0) {
			die "DISPLAY problem?\n";
		}
	}
	else {
		@ARGV=@ARGV_for_gnome; # temporary change at first
		Gnome2::Program->init('GNOME Debconf', '2.0');
		exit(0); # success
	}
	
	my @gnome_sucks=@ARGV;
	@ARGV=@ARGV_for_gnome;
	Gnome2::Program->init('GNOME Debconf', '2.0');
	@ARGV=@gnome_sucks;
	
	$this->SUPER::init(@_);
	$this->interactive(1);
	$this->capb('backup');
	$this->need_tty(0);
	
	$this->win(Gtk2::Window->new("toplevel"));
	$this->win->set_position("center");
	$this->win->set_default_size(600, 400);
	my $hostname = `hostname`;
	chomp $hostname;
	$this->win->set_title(to_Unicode(sprintf(gettext("Debconf on %s"), $hostname)));
	$this->win->signal_connect("delete_event", sub { exit 1 });
	
	my $distribution='';
	if (system('type lsb_release >/dev/null 2>&1') == 0) {
		$distribution=lc(`lsb_release -is`);
		chomp $distribution;
	} elsif (-e '/etc/debian_version') {
		$distribution='debian';
	}

	my $logo="/usr/share/pixmaps/$distribution-logo.png";
	if (-e $logo) {
		$this->logo(Gtk2::Gdk::Pixbuf->new_from_file($logo));
	}
	
	$this->druid(Gnome2::Druid->new);
	$this->druid->show;
	$this->win->add($this->druid);
	
	$this->create_druid_page ();
}


sub go {
        my $this=shift;
	my @elements=@{$this->elements};
	
	my $interactive='';
	foreach my $element (@elements) {
		next unless $element->hbox;

		$interactive=1;
		$this->druid_page->vbox->pack_start($element->hbox, $element->fill, $element->expand, 0);
	}

	if ($interactive) {
	        $this->druid_page->set_title(to_Unicode($this->title));
		if ($this->capb_backup) {
			$this->druid->set_buttons_sensitive(1, 1, 1, 1);
		}
		else {
			$this->druid->set_buttons_sensitive(0, 1, 1, 1);
		}
		$this->win->show;
		Gtk2->main;
		$this->create_druid_page ();
	}

	foreach my $element (@elements) {
		$element->show;
	}

	return '' if $this->goback;
	return 1;
}

sub progress_start {
	my $this=shift;
	$this->SUPER::progress_start(@_);

	my $element=$this->progress_bar;
	$this->druid_page->vbox->pack_start($element->hbox, $element->fill, $element->expand, 0);
	$this->druid_page->set_title(to_Unicode($this->title));
	$this->druid->set_buttons_sensitive(0, 0, 1, 1);
	$this->win->show;

	while (Gtk2->events_pending) {
		Gtk2->main_iteration;
	}
}

sub progress_set {
	my $this=shift;

	my $ret=$this->SUPER::progress_set(@_);

	while (Gtk2->events_pending) {
		Gtk2->main_iteration;
	}

	return $ret;
}

sub progress_info {
	my $this=shift;
	my $ret=$this->SUPER::progress_info(@_);

	while (Gtk2->events_pending) {
		Gtk2->main_iteration;
	}

	return $ret;
}

sub progress_stop {
	my $this=shift;
	$this->SUPER::progress_stop(@_);

	while (Gtk2->events_pending) {
		Gtk2->main_iteration;
	}

	$this->create_druid_page();
}


1
