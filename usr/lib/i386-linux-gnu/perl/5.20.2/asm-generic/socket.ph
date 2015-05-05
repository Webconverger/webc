require '_h2ph_pre.ph';

no warnings qw(redefine misc);

unless(defined(&__ASM_GENERIC_SOCKET_H)) {
    eval 'sub __ASM_GENERIC_SOCKET_H () {1;}' unless defined(&__ASM_GENERIC_SOCKET_H);
    require 'asm/sockios.ph';
    eval 'sub SOL_SOCKET () {1;}' unless defined(&SOL_SOCKET);
    eval 'sub SO_DEBUG () {1;}' unless defined(&SO_DEBUG);
    eval 'sub SO_REUSEADDR () {2;}' unless defined(&SO_REUSEADDR);
    eval 'sub SO_TYPE () {3;}' unless defined(&SO_TYPE);
    eval 'sub SO_ERROR () {4;}' unless defined(&SO_ERROR);
    eval 'sub SO_DONTROUTE () {5;}' unless defined(&SO_DONTROUTE);
    eval 'sub SO_BROADCAST () {6;}' unless defined(&SO_BROADCAST);
    eval 'sub SO_SNDBUF () {7;}' unless defined(&SO_SNDBUF);
    eval 'sub SO_RCVBUF () {8;}' unless defined(&SO_RCVBUF);
    eval 'sub SO_SNDBUFFORCE () {32;}' unless defined(&SO_SNDBUFFORCE);
    eval 'sub SO_RCVBUFFORCE () {33;}' unless defined(&SO_RCVBUFFORCE);
    eval 'sub SO_KEEPALIVE () {9;}' unless defined(&SO_KEEPALIVE);
    eval 'sub SO_OOBINLINE () {10;}' unless defined(&SO_OOBINLINE);
    eval 'sub SO_NO_CHECK () {11;}' unless defined(&SO_NO_CHECK);
    eval 'sub SO_PRIORITY () {12;}' unless defined(&SO_PRIORITY);
    eval 'sub SO_LINGER () {13;}' unless defined(&SO_LINGER);
    eval 'sub SO_BSDCOMPAT () {14;}' unless defined(&SO_BSDCOMPAT);
    eval 'sub SO_REUSEPORT () {15;}' unless defined(&SO_REUSEPORT);
    unless(defined(&SO_PASSCRED)) {
	eval 'sub SO_PASSCRED () {16;}' unless defined(&SO_PASSCRED);
	eval 'sub SO_PEERCRED () {17;}' unless defined(&SO_PEERCRED);
	eval 'sub SO_RCVLOWAT () {18;}' unless defined(&SO_RCVLOWAT);
	eval 'sub SO_SNDLOWAT () {19;}' unless defined(&SO_SNDLOWAT);
	eval 'sub SO_RCVTIMEO () {20;}' unless defined(&SO_RCVTIMEO);
	eval 'sub SO_SNDTIMEO () {21;}' unless defined(&SO_SNDTIMEO);
    }
    eval 'sub SO_SECURITY_AUTHENTICATION () {22;}' unless defined(&SO_SECURITY_AUTHENTICATION);
    eval 'sub SO_SECURITY_ENCRYPTION_TRANSPORT () {23;}' unless defined(&SO_SECURITY_ENCRYPTION_TRANSPORT);
    eval 'sub SO_SECURITY_ENCRYPTION_NETWORK () {24;}' unless defined(&SO_SECURITY_ENCRYPTION_NETWORK);
    eval 'sub SO_BINDTODEVICE () {25;}' unless defined(&SO_BINDTODEVICE);
    eval 'sub SO_ATTACH_FILTER () {26;}' unless defined(&SO_ATTACH_FILTER);
    eval 'sub SO_DETACH_FILTER () {27;}' unless defined(&SO_DETACH_FILTER);
    eval 'sub SO_GET_FILTER () { &SO_ATTACH_FILTER;}' unless defined(&SO_GET_FILTER);
    eval 'sub SO_PEERNAME () {28;}' unless defined(&SO_PEERNAME);
    eval 'sub SO_TIMESTAMP () {29;}' unless defined(&SO_TIMESTAMP);
    eval 'sub SCM_TIMESTAMP () { &SO_TIMESTAMP;}' unless defined(&SCM_TIMESTAMP);
    eval 'sub SO_ACCEPTCONN () {30;}' unless defined(&SO_ACCEPTCONN);
    eval 'sub SO_PEERSEC () {31;}' unless defined(&SO_PEERSEC);
    eval 'sub SO_PASSSEC () {34;}' unless defined(&SO_PASSSEC);
    eval 'sub SO_TIMESTAMPNS () {35;}' unless defined(&SO_TIMESTAMPNS);
    eval 'sub SCM_TIMESTAMPNS () { &SO_TIMESTAMPNS;}' unless defined(&SCM_TIMESTAMPNS);
    eval 'sub SO_MARK () {36;}' unless defined(&SO_MARK);
    eval 'sub SO_TIMESTAMPING () {37;}' unless defined(&SO_TIMESTAMPING);
    eval 'sub SCM_TIMESTAMPING () { &SO_TIMESTAMPING;}' unless defined(&SCM_TIMESTAMPING);
    eval 'sub SO_PROTOCOL () {38;}' unless defined(&SO_PROTOCOL);
    eval 'sub SO_DOMAIN () {39;}' unless defined(&SO_DOMAIN);
    eval 'sub SO_RXQ_OVFL () {40;}' unless defined(&SO_RXQ_OVFL);
    eval 'sub SO_WIFI_STATUS () {41;}' unless defined(&SO_WIFI_STATUS);
    eval 'sub SCM_WIFI_STATUS () { &SO_WIFI_STATUS;}' unless defined(&SCM_WIFI_STATUS);
    eval 'sub SO_PEEK_OFF () {42;}' unless defined(&SO_PEEK_OFF);
    eval 'sub SO_NOFCS () {43;}' unless defined(&SO_NOFCS);
    eval 'sub SO_LOCK_FILTER () {44;}' unless defined(&SO_LOCK_FILTER);
    eval 'sub SO_SELECT_ERR_QUEUE () {45;}' unless defined(&SO_SELECT_ERR_QUEUE);
    eval 'sub SO_BUSY_POLL () {46;}' unless defined(&SO_BUSY_POLL);
    eval 'sub SO_MAX_PACING_RATE () {47;}' unless defined(&SO_MAX_PACING_RATE);
    eval 'sub SO_BPF_EXTENSIONS () {48;}' unless defined(&SO_BPF_EXTENSIONS);
}
1;
