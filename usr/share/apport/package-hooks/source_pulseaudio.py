'''apport package hook for pulseaudio

(c) 2009 Canonical Ltd.
Author:
Matt Zimmerman <mdz@ubuntu.com>

'''

from apport.hookutils import *
import re

def add_info(report):
	attach_alsa(report)
	recent_syslog(re.compile(r'pulseaudio\['))
	attach_conffiles(report, 'pulseaudio')
