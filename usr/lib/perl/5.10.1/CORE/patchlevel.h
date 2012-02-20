/*    patchlevel.h
 *
 *    Copyright (C) 1993, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002,
 *    2003, 2004, 2005, 2006, 2007, 2008, 2009, by Larry Wall and others
 *
 *    You may distribute under the terms of either the GNU General Public
 *    License or the Artistic License, as specified in the README file.
 *
 */

#ifndef __PATCHLEVEL_H_INCLUDED__

/* do not adjust the whitespace! Configure expects the numbers to be
 * exactly on the third column */

#define PERL_REVISION	5		/* age */
#define PERL_VERSION	10		/* epoch */
#define PERL_SUBVERSION	1		/* generation */

/* The following numbers describe the earliest compatible version of
   Perl ("compatibility" here being defined as sufficient binary/API
   compatibility to run XS code built with the older version).
   Normally this should not change across maintenance releases.

   Note that this only refers to an out-of-the-box build.  Many non-default
   options such as usemultiplicity tend to break binary compatibility
   more often.

   This is used by Configure et al to figure out 
   PERL_INC_VERSION_LIST, which lists version libraries
   to include in @INC.  See INSTALL for how this works.
*/
#define PERL_API_REVISION	5	/* Adjust manually as needed.  */
#define PERL_API_VERSION	10	/* Adjust manually as needed.  */
#define PERL_API_SUBVERSION	0	/* Adjust manually as needed.  */
/*
   XXX Note:  The selection of non-default Configure options, such
   as -Duselonglong may invalidate these settings.  Currently, Configure
   does not adequately test for this.   A.D.  Jan 13, 2000
*/

#define __PATCHLEVEL_H_INCLUDED__
#endif

/*
	local_patches -- list of locally applied less-than-subversion patches.
	If you're distributing such a patch, please give it a name and a
	one-line description, placed just before the last NULL in the array
	below.  If your patch fixes a bug in the perlbug database, please
	mention the bugid.  If your patch *IS* dependent on a prior patch,
	please place your applied patch line after its dependencies. This
	will help tracking of patch dependencies.

	Please either use 'diff --unified=0' if your diff supports
	that or edit the hunk of the diff output which adds your patch
	to this list, to remove context lines which would give patch
	problems. For instance, if the original context diff is

	   *** patchlevel.h.orig	<date here>
	   --- patchlevel.h	<date here>
	   *** 38,43 ***
	   --- 38,44 ---
	     	,"FOO1235 - some patch"
	     	,"BAR3141 - another patch"
	     	,"BAZ2718 - and another patch"
	   + 	,"MINE001 - my new patch"
	     	,NULL
	     };
	
	please change it to 
	   *** patchlevel.h.orig	<date here>
	   --- patchlevel.h	<date here>
	   *** 41,43 ***
	   --- 41,44 ---
	   + 	,"MINE001 - my new patch"
	     	,NULL
	     };
	
	(Note changes to line numbers as well as removal of context lines.)
	This will prevent patch from choking if someone has previously
	applied different patches than you.

        History has shown that nobody distributes patches that also
        modify patchlevel.h. Do it yourself. The following perl
        program can be used to add a comment to patchlevel.h:

#!perl
die "Usage: perl -x patchlevel.h comment ..." unless @ARGV;
open PLIN, "patchlevel.h" or die "Couldn't open patchlevel.h : $!";
open PLOUT, ">patchlevel.new" or die "Couldn't write on patchlevel.new : $!";
my $seen=0;
while (<PLIN>) {
    if (/\t,NULL/ and $seen) {
       while (my $c = shift @ARGV){
            print PLOUT qq{\t,"$c"\n};
       }
    }
    $seen++ if /local_patches\[\]/;
    print PLOUT;
}
close PLOUT or die "Couldn't close filehandle writing to patchlevel.new : $!";
close PLIN or die "Couldn't close filehandle reading from patchlevel.h : $!";
close DATA; # needed to allow unlink to work win32.
unlink "patchlevel.bak" or warn "Couldn't unlink patchlevel.bak : $!"
  if -e "patchlevel.bak";
rename "patchlevel.h", "patchlevel.bak" or
  die "Couldn't rename patchlevel.h to patchlevel.bak : $!";
rename "patchlevel.new", "patchlevel.h" or
  die "Couldn't rename patchlevel.new to patchlevel.h : $!";
__END__

Please keep empty lines below so that context diffs of this file do
not ever collect the lines belonging to local_patches() into the same
hunk.

 */

#if !defined(PERL_PATCHLEVEL_H_IMPLICIT) && !defined(LOCAL_PATCH_COUNT)
#  if defined(PERL_IS_MINIPERL)
#    define PERL_PATCHNUM "UNKNOWN-miniperl"
#    define PERL_GIT_UNCOMMITTED_CHANGES ,"UNKNOWN"
#    define PERL_GIT_UNPUSHED_COMMITS /*leave-this-comment*/
#  elif defined(PERL_MICRO)
#    define PERL_PATCHNUM "UNKNOWN-microperl"
#    define PERL_GIT_UNCOMMITTED_CHANGES ,"UNKNOWN"
#    define PERL_GIT_UNPUSHED_COMMITS /*leave-this-comment*/
#  else
#include "git_version.h"
#  endif
static const char * const local_patches[] = {
	NULL
	PERL_GIT_UNPUSHED_COMMITS    	/* do not remove this line */
        PERL_GIT_UNCOMMITTED_CHANGES	/* do not remove this line */
	,"DEBPKG:debian/arm_thread_stress_timeout - http://bugs.debian.org/501970 Raise the timeout of ext/threads/shared/t/stress.t to accommodate slower build hosts"
	,"DEBPKG:debian/cpan_config_path - Set location of CPAN::Config to /etc/perl as /usr may not be writable."
	,"DEBPKG:debian/cpan_definstalldirs - Provide a sensible INSTALLDIRS default for modules installed from CPAN."
	,"DEBPKG:debian/db_file_ver - http://bugs.debian.org/340047 Remove overly restrictive DB_File version check."
	,"DEBPKG:debian/doc_info - Replace generic man(1) instructions with Debian-specific information."
	,"DEBPKG:debian/enc2xs_inc - http://bugs.debian.org/290336 Tweak enc2xs to follow symlinks and ignore missing @INC directories."
	,"DEBPKG:debian/errno_ver - http://bugs.debian.org/343351 Remove Errno version check due to upgrade problems with long-running processes."
	,"DEBPKG:debian/extutils_hacks - Various debian-specific ExtUtils changes"
	,"DEBPKG:debian/fakeroot - Postpone LD_LIBRARY_PATH evaluation to the binary targets."
	,"DEBPKG:debian/instmodsh_doc - Debian policy doesn't install .packlist files for core or vendor."
	,"DEBPKG:debian/ld_run_path - Remove standard libs from LD_RUN_PATH as per Debian policy."
	,"DEBPKG:debian/libnet_config_path - Set location of libnet.cfg to /etc/perl/Net as /usr may not be writable."
	,"DEBPKG:debian/m68k_thread_stress - http://bugs.debian.org/495826 Disable some threads tests on m68k for now due to missing TLS."
	,"DEBPKG:debian/mod_paths - Tweak @INC ordering for Debian"
	,"DEBPKG:debian/module_build_man_extensions - http://bugs.debian.org/479460 Adjust Module::Build manual page extensions for the Debian Perl policy"
	,"DEBPKG:debian/perl_synopsis - http://bugs.debian.org/278323 Rearrange perl.pod"
	,"DEBPKG:debian/prune_libs - http://bugs.debian.org/128355 Prune the list of libraries wanted to what we actually need."
	,"DEBPKG:debian/use_gdbm - Explicitly link against -lgdbm_compat in ODBM_File/NDBM_File. "
	,"DEBPKG:fixes/assorted_docs - http://bugs.debian.org/443733 [384f06a] Math::BigInt::CalcEmu documentation grammar fix"
	,"DEBPKG:fixes/net_smtp_docs - http://bugs.debian.org/100195 [rt.cpan.org #36038] Document the Net::SMTP 'Port' option"
	,"DEBPKG:fixes/processPL - http://bugs.debian.org/357264 [rt.cpan.org #17224] Always use PERLRUNINST when building perl modules."
	,"DEBPKG:debian/perlivp - http://bugs.debian.org/510895 Make perlivp skip include directories in /usr/local"
	,"DEBPKG:fixes/pod2man-index-backslash - http://bugs.debian.org/521256 Escape backslashes in .IX entries"
	,"DEBPKG:debian/disable-zlib-bundling - Disable zlib bundling in Compress::Raw::Zlib"
	,"DEBPKG:fixes/kfreebsd_cppsymbols - http://bugs.debian.org/533098 [3b910a0] Add gcc predefined macros to $Config{cppsymbols} on GNU/kFreeBSD."
	,"DEBPKG:debian/cpanplus_definstalldirs - http://bugs.debian.org/533707 Configure CPANPLUS to use the site directories by default."
	,"DEBPKG:debian/cpanplus_config_path - Save local versions of CPANPLUS::Config::System into /etc/perl."
	,"DEBPKG:fixes/kfreebsd-filecopy-pipes - http://bugs.debian.org/537555 [16f708c] Fix File::Copy::copy with pipes on GNU/kFreeBSD"
	,"DEBPKG:fixes/anon-tmpfile-dir - http://bugs.debian.org/528544 [perl #66452] Honor TMPDIR when open()ing an anonymous temporary file"
	,"DEBPKG:fixes/abstract-sockets - http://bugs.debian.org/329291 [89904c0] Add support for Abstract namespace sockets."
	,"DEBPKG:fixes/hurd_cppsymbols - http://bugs.debian.org/544307 [eeb92b7] Add gcc predefined macros to $Config{cppsymbols} on GNU/Hurd."
	,"DEBPKG:fixes/autodie-flock - http://bugs.debian.org/543731 Allow for flock returning EAGAIN instead of EWOULDBLOCK on linux/parisc"
	,"DEBPKG:fixes/archive-tar-instance-error - http://bugs.debian.org/539355 [rt.cpan.org #48879] Separate Archive::Tar instance error strings from each other"
	,"DEBPKG:fixes/positive-gpos - http://bugs.debian.org/545234 [perl #69056] [c584a96] Fix \\G crash on first match"
	,"DEBPKG:debian/devel-ppport-ia64-optim - http://bugs.debian.org/548943 Work around an ICE on ia64"
	,"DEBPKG:fixes/trie-logic-match - http://bugs.debian.org/552291 [perl #69973] [0abd0d7] Fix a DoS in Unicode processing [CVE-2009-3626]"
	,"DEBPKG:fixes/hppa-thread-eagain - http://bugs.debian.org/554218 make the threads-shared test suite more robust, fixing failures on hppa"
	,"DEBPKG:fixes/crash-on-undefined-destroy - http://bugs.debian.org/564074 [perl #71952] [1f15e67] Fix a NULL pointer dereference when looking for a DESTROY method"
	,"DEBPKG:fixes/tainted-errno - http://bugs.debian.org/574129 [perl #61976] [be1cf43] fix an errno stringification bug in taint mode"
	,"DEBPKG:fixes/safe-upgrade - http://bugs.debian.org/582978 Upgrade Safe.pm to 2.25, fixing CVE-2010-1974"
	,"DEBPKG:fixes/tell-crash - http://bugs.debian.org/578577 [f4817f3] Fix a tell() crash on bad arguments."
	,"DEBPKG:fixes/format-write-crash - http://bugs.debian.org/579537 [perl #22977] [421f30e] Fix a crash in format/write"
	,"DEBPKG:fixes/arm-alignment - http://bugs.debian.org/289884 [f1c7503] Prevent gcc from optimizing the alignment test away on armel"
	,"DEBPKG:fixes/fcgi-test - Fix a failure in CGI/t/fast.t when FCGI is installed"
	,"DEBPKG:fixes/hurd-ccflags - http://bugs.debian.org/587901 Make hints/gnu.sh append to $ccflags rather than overriding them"
	,"DEBPKG:debian/squelch-locale-warnings - http://bugs.debian.org/508764 Squelch locale warnings in Debian package maintainer scripts"
	,"DEBPKG:fixes/lc-numeric-docs - http://bugs.debian.org/379329 [perl #78452] [903eb63] LC_NUMERIC documentation fixes"
	,"DEBPKG:fixes/lc-numeric-sprintf - http://bugs.debian.org/601549 [perl #78632] [b3fd614] Fix sprintf not to ignore LC_NUMERIC with constants"
	,"DEBPKG:fixes/concat-stack-corruption - http://bugs.debian.org/596105 [perl #78674] [e3393f5] Fix stack pointer corruption in pp_concat() with 'use encoding'"
	,"DEBPKG:fixes/cgi-multiline-header - http://bugs.debian.org/606995 [CVE-2010-2761 CVE-2010-4410 CVE-2010-4411] CGI.pm MIME boundary and multiline header vulnerabilities"
	,"DEBPKG:fixes/casing-taint-cve-2011-1487 - http://bugs.debian.org/622817 [perl #87336] fix unwanted taint laundering in lc(), uc() et al."
	,"DEBPKG:fixes/safe-reval-rdo-cve-2010-1447 - [PATCH] Wrap by default coderefs returned by rdo and reval"
	,"DEBPKG:fixes/encode-heap-overflow - [PATCH] Fix decode_xs n-byte heap-overflow security bug in"
	,"DEBPKG:fixes/digest_eval_hole - Close the eval \"require $module\" security hole in"
	,"DEBPKG:fixes/unregister_signal_handler - [PATCH] main: Unregister signal handler before destroying my_perl"
	,"DEBPKG:patchlevel - http://bugs.debian.org/567489 List packaged patches for 5.10.1-17squeeze3 in patchlevel.h"
	,NULL
};



/* Initial space prevents this variable from being inserted in config.sh  */
#  define	LOCAL_PATCH_COUNT	\
	((int)(sizeof(local_patches)/sizeof(local_patches[0])-2))

/* the old terms of reference, add them only when explicitly included */
#define PATCHLEVEL		PERL_VERSION
#undef  SUBVERSION		/* OS/390 has a SUBVERSION in a system header */
#define SUBVERSION		PERL_SUBVERSION
#endif
