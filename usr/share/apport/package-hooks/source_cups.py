'''apport package hook for cups

(c) 2009 Canonical Ltd.
Author: Brian Murray <brian@ubuntu.com>
'''

from apport.hookutils import *

def add_info(report):
    attach_hardware(report)
    attach_printing(report)
    attach_mac_events(report, ['/usr/sbin/cupsd',
                               '/usr/lib/cups/backend/cups-pdf'])
