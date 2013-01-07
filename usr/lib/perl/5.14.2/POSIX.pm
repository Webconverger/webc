package POSIX;
use strict;
use warnings;

our(@ISA, %EXPORT_TAGS, @EXPORT_OK, @EXPORT, $AUTOLOAD, %SIGRT) = ();

our $VERSION = "1.24";

use AutoLoader;

require XSLoader;

use Fcntl qw(FD_CLOEXEC F_DUPFD F_GETFD F_GETFL F_GETLK F_RDLCK F_SETFD
	     F_SETFL F_SETLK F_SETLKW F_UNLCK F_WRLCK O_ACCMODE O_APPEND
	     O_CREAT O_EXCL O_NOCTTY O_NONBLOCK O_RDONLY O_RDWR O_TRUNC
	     O_WRONLY SEEK_CUR SEEK_END SEEK_SET
	     S_ISBLK S_ISCHR S_ISDIR S_ISFIFO S_ISREG
	     S_IRGRP S_IROTH S_IRUSR S_IRWXG S_IRWXO S_IRWXU S_ISGID S_ISUID
	     S_IWGRP S_IWOTH S_IWUSR S_IXGRP S_IXOTH S_IXUSR);

# Grandfather old foo_h form to new :foo_h form
my $loaded;

sub import {
    load_imports() unless $loaded++;
    my $this = shift;
    my @list = map { m/^\w+_h$/ ? ":$_" : $_ } @_;
    local $Exporter::ExportLevel = 1;
    Exporter::import($this,@list);
}

sub croak { require Carp;  goto &Carp::croak }
# declare usage to assist AutoLoad
sub usage;

XSLoader::load();

sub AUTOLOAD {
    no warnings 'uninitialized';
    if ($AUTOLOAD =~ /::(_?[a-z])/) {
	# require AutoLoader;
	$AutoLoader::AUTOLOAD = $AUTOLOAD;
	goto &AutoLoader::AUTOLOAD
    }
    my $constname = $AUTOLOAD;
    $constname =~ s/.*:://;
    constant($constname);
}

package POSIX::SigAction;

use AutoLoader 'AUTOLOAD';

package POSIX::SigRt;

use AutoLoader 'AUTOLOAD';

use Tie::Hash;

use vars qw($SIGACTION_FLAGS $_SIGRTMIN $_SIGRTMAX $_sigrtn @ISA);
@POSIX::SigRt::ISA = qw(Tie::StdHash);

$SIGACTION_FLAGS = 0;

tie %POSIX::SIGRT, 'POSIX::SigRt';

sub DESTROY {};

package POSIX;

1;
