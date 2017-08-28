# -*- coding: UTF-8 -*-
# Copyright © 2010-2012 Piotr Ożarowski <piotr@debian.org>
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.

import logging
from debpython.pydist import parse_pydep, guess_dependency
from debpython.version import DEFAULT, SUPPORTED, debsorted, vrepr, vrange_str

# minimum version required for pycompile/pyclean
MINPYCDEP = 'python:any (>= 2.6.6-7~)'

log = logging.getLogger(__name__)


class Dependencies(object):
    """Store relations (dependencies, etc.) between packages."""

    def __init__(self, package):
        self.package = package
        self.depends = []
        self.recommends = []
        self.suggests = []
        self.enhances = []
        self.breaks = []
        self.rtscripts = []

    def export_to(self, dh):
        """Fill in debhelper's substvars."""
        for i in sorted(self.depends):
            dh.addsubstvar(self.package, 'python:Depends', i)
        for i in sorted(self.recommends):
            dh.addsubstvar(self.package, 'python:Recommends', i)
        for i in sorted(self.suggests):
            dh.addsubstvar(self.package, 'python:Suggests', i)
        for i in sorted(self.enhances):
            dh.addsubstvar(self.package, 'python:Enhances', i)
        for i in sorted(self.breaks):
            dh.addsubstvar(self.package, 'python:Breaks', i)
        for i in self.rtscripts:
            dh.add_rtupdate(self.package, i)

    def __str__(self):
        return "D=%s; R=%s; S=%s; E=%s, B=%s; RT=%s" % (self.depends, \
                self.recommends, self.suggests, self.enhances, \
                self.breaks, self.rtscripts)

    def depend(self, value):
        if value and value not in self.depends:
            self.depends.append(value)

    def recommend(self, value):
        if value and value not in self.recommends:
            self.recommends.append(value)

    def suggest(self, value):
        if value and value not in self.suggests:
            self.suggests.append(value)

    def enhance(self, value):
        if value and value not in self.enhances:
            self.enhances.append(value)

    def break_(self, value):
        if value and value not in self.breaks:
            self.breaks.append(value)

    def rtscript(self, value):
        if value not in self.rtscripts:
            self.rtscripts.append(value)

    def parse(self, stats, options):
        log.debug('generating dependencies for package %s', self.package)

        pub_vers = sorted(stats['public_vers'].union(stats['ext']))
        if pub_vers:
            dbgpkg = self.package.endswith('-dbg')
            tpl = 'python-dbg' if dbgpkg else 'python'
            minv = pub_vers[0]
            maxv = pub_vers[-1]
            # generating "python2.X | python2.Y | python2.Z" dependencies
            # disabled (see #625740):
            #if dbgpkg:
            #    tpl2 = 'python%d.%d-dbg'
            #else:
            #    tpl2 = 'python%d.%d'
            #self.depend(' | '.join(tpl2 % i for i in debsorted(pub_vers)))

            # additional Depends to block python package transitions
            if minv <= DEFAULT:
                self.depend("%s (>= %d.%d)" % \
                            (tpl, minv[0], minv[1]))
            if maxv >= DEFAULT:
                self.depend("%s (<< %d.%d)" % \
                            (tpl, maxv[0], maxv[1] + 1))

        # make sure pycompile binary is available
        if stats['compile']:
            self.depend(MINPYCDEP)

        for interpreter, version in stats['shebangs']:
            self.depend("%s:any" % interpreter)

        for private_dir, details in stats['private_dirs'].iteritems():
            versions = list(v for i, v in details.get('shebangs', []) if v)

            for v in versions:
                if v in SUPPORTED:
                    self.depend("python%d.%d:any" % v)
                else:
                    log.info('dependency on python%s (from shebang) ignored'
                             ' - it\'s not supported anymore', vrepr(v))
            # /usr/bin/python shebang → add python to Depends
            if any(True for i, v in details.get('shebangs', []) if v is None):
                self.depend('python:any')

            if details.get('compile', False):
                self.depend(MINPYCDEP)
                args = ''
                vr = options.vrange
                if len(versions) == 1:  # only one version from shebang
                    args += "-V %s" % vrepr(versions[0])
                elif vr:
                    # if there are no hardcoded versions in shebang or there
                    # are scripts for different Python versions: compile with
                    # default Python version (or the one requested via X-P-V)
                    args += "-V %s" % vrange_str(vr)
                    if vr == (None, None):
                        pass
                    elif vr[0] == vr[1]:
                        self.depend("python%s:any" % vrepr(vr[0]))
                    else:
                        if vr[0]:  # minimum version specified
                            self.depend("python:any (>= %s)" % vrepr(vr[0]))
                        if vr[1]:  # maximum version specified
                            self.depend("python:any (<< %d.%d)" % \
                                       (vr[1][0], vr[1][1] + 1))

                for pattern in options.regexpr or []:
                    args += " -X '%s'" % pattern.replace("'", r"'\''")
                self.rtscript((private_dir, args))

        if options.guess_deps:
            for fn in stats['requires.txt']:
                # TODO: should options.recommends and options.suggests be
                # removed from requires.txt?
                for i in parse_pydep(fn):
                    self.depend(i)

        # add dependencies from --depends
        for item in options.depends or []:
            self.depend(guess_dependency(item))
        # add dependencies from --recommends
        for item in options.recommends or []:
            self.recommend(guess_dependency(item))
        # add dependencies from --suggests
        for item in options.suggests or []:
            self.suggest(guess_dependency(item))

        log.debug(self)
