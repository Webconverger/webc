package Socket;

our($VERSION, @ISA, @EXPORT, @EXPORT_OK, %EXPORT_TAGS);
$VERSION = "1.82";

use Carp;
use warnings::register;

require Exporter;
use XSLoader ();
@ISA = qw(Exporter);
@EXPORT = qw(
	inet_aton inet_ntoa
	sockaddr_family
	pack_sockaddr_in unpack_sockaddr_in
	pack_sockaddr_un unpack_sockaddr_un
	sockaddr_in sockaddr_un
	INADDR_ANY INADDR_BROADCAST INADDR_LOOPBACK INADDR_NONE
	AF_802
	AF_AAL
	AF_APPLETALK
	AF_CCITT
	AF_CHAOS
	AF_CTF
	AF_DATAKIT
	AF_DECnet
	AF_DLI
	AF_ECMA
	AF_GOSIP
	AF_HYLINK
	AF_IMPLINK
	AF_INET
	AF_INET6
	AF_ISO
	AF_KEY
	AF_LAST
	AF_LAT
	AF_LINK
	AF_MAX
	AF_NBS
	AF_NIT
	AF_NS
	AF_OSI
	AF_OSINET
	AF_PUP
	AF_ROUTE
	AF_SNA
	AF_UNIX
	AF_UNSPEC
	AF_USER
	AF_WAN
	AF_X25
	IOV_MAX
	IP_OPTIONS
	IP_HDRINCL
	IP_TOS
	IP_TTL
	IP_RECVOPTS
	IP_RECVRETOPTS
	IP_RETOPTS
	MSG_BCAST
	MSG_BTAG
	MSG_CTLFLAGS
	MSG_CTLIGNORE
	MSG_CTRUNC
	MSG_DONTROUTE
	MSG_DONTWAIT
	MSG_EOF
	MSG_EOR
	MSG_ERRQUEUE
	MSG_ETAG
	MSG_FIN
	MSG_MAXIOVLEN
	MSG_MCAST
	MSG_NOSIGNAL
	MSG_OOB
	MSG_PEEK
	MSG_PROXY
	MSG_RST
	MSG_SYN
	MSG_TRUNC
	MSG_URG
	MSG_WAITALL
	MSG_WIRE
	PF_802
	PF_AAL
	PF_APPLETALK
	PF_CCITT
	PF_CHAOS
	PF_CTF
	PF_DATAKIT
	PF_DECnet
	PF_DLI
	PF_ECMA
	PF_GOSIP
	PF_HYLINK
	PF_IMPLINK
	PF_INET
	PF_INET6
	PF_ISO
	PF_KEY
	PF_LAST
	PF_LAT
	PF_LINK
	PF_MAX
	PF_NBS
	PF_NIT
	PF_NS
	PF_OSI
	PF_OSINET
	PF_PUP
	PF_ROUTE
	PF_SNA
	PF_UNIX
	PF_UNSPEC
	PF_USER
	PF_WAN
	PF_X25
	SCM_CONNECT
	SCM_CREDENTIALS
	SCM_CREDS
	SCM_RIGHTS
	SCM_TIMESTAMP
	SHUT_RD
	SHUT_RDWR
	SHUT_WR
	SOCK_DGRAM
	SOCK_RAW
	SOCK_RDM
	SOCK_SEQPACKET
	SOCK_STREAM
	SOL_SOCKET
	SOMAXCONN
	SO_ACCEPTCONN
	SO_ATTACH_FILTER
	SO_BACKLOG
	SO_BROADCAST
	SO_CHAMELEON
	SO_DEBUG
	SO_DETACH_FILTER
	SO_DGRAM_ERRIND
	SO_DONTLINGER
	SO_DONTROUTE
	SO_ERROR
	SO_FAMILY
	SO_KEEPALIVE
	SO_LINGER
	SO_OOBINLINE
	SO_PASSCRED
	SO_PASSIFNAME
	SO_PEERCRED
	SO_PROTOCOL
	SO_PROTOTYPE
	SO_RCVBUF
	SO_RCVLOWAT
	SO_RCVTIMEO
	SO_REUSEADDR
	SO_REUSEPORT
	SO_SECURITY_AUTHENTICATION
	SO_SECURITY_ENCRYPTION_NETWORK
	SO_SECURITY_ENCRYPTION_TRANSPORT
	SO_SNDBUF
	SO_SNDLOWAT
	SO_SNDTIMEO
	SO_STATE
	SO_TYPE
	SO_USELOOPBACK
	SO_XOPEN
	SO_XSE
	UIO_MAXIOV
);

@EXPORT_OK = qw(CR LF CRLF $CR $LF $CRLF

	       IPPROTO_IP
	       IPPROTO_IPV6
	       IPPROTO_RAW
	       IPPROTO_ICMP
	       IPPROTO_TCP
	       IPPROTO_UDP

	       TCP_KEEPALIVE
	       TCP_MAXRT
	       TCP_MAXSEG
	       TCP_NODELAY
	       TCP_STDURG);

%EXPORT_TAGS = (
    crlf    => [qw(CR LF CRLF $CR $LF $CRLF)],
    all     => [@EXPORT, @EXPORT_OK],
);

BEGIN {
    sub CR   () {"\015"}
    sub LF   () {"\012"}
    sub CRLF () {"\015\012"}
}

*CR   = \CR();
*LF   = \LF();
*CRLF = \CRLF();

sub sockaddr_in {
    if (@_ == 6 && !wantarray) { # perl5.001m compat; use this && die
	my($af, $port, @quad) = @_;
	warnings::warn "6-ARG sockaddr_in call is deprecated" 
	    if warnings::enabled();
	pack_sockaddr_in($port, inet_aton(join('.', @quad)));
    } elsif (wantarray) {
	croak "usage:   (port,iaddr) = sockaddr_in(sin_sv)" unless @_ == 1;
        unpack_sockaddr_in(@_);
    } else {
	croak "usage:   sin_sv = sockaddr_in(port,iaddr))" unless @_ == 2;
        pack_sockaddr_in(@_);
    }
}

sub sockaddr_un {
    if (wantarray) {
	croak "usage:   (filename) = sockaddr_un(sun_sv)" unless @_ == 1;
        unpack_sockaddr_un(@_);
    } else {
	croak "usage:   sun_sv = sockaddr_un(filename)" unless @_ == 1;
        pack_sockaddr_un(@_);
    }
}

sub AUTOLOAD {
    my($constname);
    ($constname = $AUTOLOAD) =~ s/.*:://;
    croak "&Socket::constant not defined" if $constname eq 'constant';
    my ($error, $val) = constant($constname);
    if ($error) {
	croak $error;
    }
    *$AUTOLOAD = sub { $val };
    goto &$AUTOLOAD;
}

XSLoader::load 'Socket', $VERSION;

1;
