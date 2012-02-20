#!/usr/bin/perl -w
# This file was preprocessed, do not edit!


package Debconf::FrontEnd::Noninteractive;
use strict;
use base qw(Debconf::FrontEnd);



sub init { 
        my $this=shift;

        $this->SUPER::init(@_);

        $this->need_tty(0);
}


1
