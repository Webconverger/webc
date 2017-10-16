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

from __future__ import with_statement
import codecs
import logging
import os
import re
from cPickle import dumps
from glob import glob
from os.path import exists, isdir, join, split
from shutil import rmtree
from subprocess import PIPE, Popen
from debpython.version import RANGE_PATTERN, getver, get_requested_versions

log = logging.getLogger(__name__)
EGGnPTH_RE = re.compile(r'(.*?)(-py\d\.\d(?:-[^.]*)?)?(\.egg-info|\.pth)$')
SHEBANG_RE = re.compile(r'^#!\s*(.*?/bin/.*?)(python(2\.\d+)?(?:-dbg)?)(?:\s(.*))?[$\r\n].*')
SHAREDLIB_RE = re.compile(r'NEEDED.*libpython(\d\.\d)')
INSTALL_RE = re.compile(r"""
    (?P<pattern>.+?)  # file pattern
    (?:\s+  # optional Python module name:
    (?P<module>[A-Za-z][A-Za-z0-9_.]*)?
    )?
    \s*  # optional version range:
    (?P<vrange>%s)?$
""" % RANGE_PATTERN, re.VERBOSE)
REMOVE_RE = re.compile(r"""
    (?P<pattern>.+?)  # file pattern
    \s*  # optional version range:
    (?P<vrange>%s)?$
""" % RANGE_PATTERN, re.VERBOSE)


def sitedir(version, package=None, gdb=False):
    """Return path to site-packages directory.

    >>> sitedir((2, 5))
    '/usr/lib/python2.5/site-packages/'
    >>> sitedir((2, 7), 'python-foo', True)
    'debian/python-foo/usr/lib/debug/usr/lib/python2.7/dist-packages/'
    """
    if isinstance(version, basestring):
        version = tuple(int(i) for i in version.split('.'))

    if version >= (2, 6):
        path = "/usr/lib/python%d.%d/dist-packages/" % version
    else:
        path = "/usr/lib/python%d.%d/site-packages/" % version

    if gdb:
        path = "/usr/lib/debug%s" % path
    if package:
        path = "debian/%s%s" % (package, path)

    return path


def relpath(target, link):
    """Return relative path.

    >>> relpath('/usr/share/python-foo/foo.py', '/usr/bin/foo', )
    '../share/python-foo/foo.py'
    """
    t = target.split('/')
    l = link.split('/')
    while l[0] == t[0]:
        del l[0], t[0]
    return '/'.join(['..'] * (len(l) - 1) + t)


def relative_symlink(target, link):
    """Create relative symlink."""
    return os.symlink(relpath(target, link), link)


def fix_shebang(fpath, replacement=None):
    """Normalize file's shebang.

    :param replacement: new shebang command (path to interpreter and options)
    """
    try:
        with open(fpath) as fp:
            fcontent = fp.readlines()
        if not fcontent:
            log.debug('fix_shebang: ignoring empty file: %s', fpath)
            return None
    except IOError:
        log.error('cannot open %s', fpath)
        return False

    match = SHEBANG_RE.match(fcontent[0])
    if not match:
        return None
    if not replacement:
        path, interpreter, version, argv = match.groups()
        if path != '/usr/bin':  # f.e. /usr/local/* or */bin/env
            replacement = "/usr/bin/%s" % interpreter
        if interpreter == 'python2':
            replacement = '/usr/bin/python'
        if replacement and argv:
            replacement += " %s" % argv
    if replacement:
        log.info('replacing shebang in %s (%s)', fpath, fcontent[0])
        # do not catch IOError here, the file is zeroed at this stage so it's
        # better to fail dh_python2
        with open(fpath, 'w') as fp:
            fp.write("#! %s\n" % replacement)
            fp.writelines(fcontent[1:])
    return True


def shebang2pyver(fpath):
    """Check file's shebang.

    :rtype: tuple
    :returns: pair of Python interpreter string and Python version
    """
    try:
        with open(fpath) as fp:
            data = fp.read(32)
            match = SHEBANG_RE.match(data)
            if not match:
                return None
            res = match.groups()
            if res[1:3] != (None, None):
                if res[2]:
                    return res[1], getver(res[2])
                return res[1], None
    except IOError:
        log.error('cannot open %s', fpath)


def so2pyver(fpath):
    """Return libpython version file is linked to or None.

    :rtype: tuple
    :returns: Python version
    """

    cmd = "readelf -Wd '%s'" % fpath
    process = Popen(cmd, stdout=PIPE, shell=True)
    match = SHAREDLIB_RE.search(process.stdout.read())
    if match:
        return getver(match.groups()[0])


def clean_egg_name(name):
    """Remove Python version and platform name from Egg files/dirs.

    >>> clean_egg_name('python_pipeline-0.1.3_py3k-py3.1.egg-info')
    'python_pipeline-0.1.3_py3k.egg-info'
    >>> clean_egg_name('Foo-1.2-py2.7-linux-x86_64.egg-info')
    'Foo-1.2.egg-info'
    """
    match = EGGnPTH_RE.match(name)
    if match and match.group(2) is not None:
        return ''.join(match.group(1, 3))
    return name


class memoize(object):
    def __init__(self, func):
        self.func = func
        self.cache = {}

    def __call__(self, *args, **kwargs):
        key = dumps((args, kwargs))
        if key not in self.cache:
            self.cache[key] = self.func(*args, **kwargs)
        return self.cache[key]


def pyinstall(package, vrange):
    """Install local files listed in pkg.pyinstall files as public modules."""
    status = True
    srcfpath = "./debian/%s.pyinstall" % package
    if not exists(srcfpath):
        return status
    versions = get_requested_versions(vrange)

    for line in codecs.open(srcfpath, encoding='utf-8'):
        if not line or line.startswith('#'):
            continue
        details = INSTALL_RE.match(line)
        if not details:
            status = False
            log.warn('%s.pyinstall: unrecognized line: %s',
                     package, line)
            continue
        details = details.groupdict()
        if details['module']:
            details['module'] = details['module'].replace('.', '/')
        myvers = versions & get_requested_versions(details['vrange'])
        if not myvers:
            log.debug('%s.pyinstall: no matching versions for line %s',
                      package, line)
            continue
        files = glob(details['pattern'])
        if not files:
            status = False
            log.error('%s.pyinstall: file not found: %s',
                      package, details['pattern'])
            continue
        for fpath in files:
            fpath = fpath.lstrip('/.')
            if details['module']:
                dstname = join(details['module'], split(fpath)[1])
            elif fpath.startswith('debian/'):
                dstname = fpath[7:]
            else:
                dstname = fpath
            for version in myvers:
                dstfpath = join(sitedir(version, package), dstname)
                dstdir = split(dstfpath)[0]
                if not exists(dstdir):
                    try:
                        os.makedirs(dstdir)
                    except Exception:
                        log.error('cannot create %s directory', dstdir)
                        return False
                if exists(dstfpath):
                    try:
                        os.remove(dstfpath)
                    except Exception:
                        status = False
                        log.error('cannot replace %s file', dstfpath)
                        continue
                try:
                    os.link(fpath, dstfpath)
                except Exception:
                    status = False
                    log.error('cannot copy %s file to %s', fpath, dstdir)
    return status


def pyremove(package, vrange):
    """Remove public modules listed in pkg.pyremove file."""
    status = True
    srcfpath = "./debian/%s.pyremove" % package
    if not exists(srcfpath):
        return status
    versions = get_requested_versions(vrange)

    for line in codecs.open(srcfpath, encoding='utf-8'):
        if not line or line.startswith('#'):
            continue
        details = REMOVE_RE.match(line)
        if not details:
            status = False
            log.warn('%s.pyremove: unrecognized line: %s',
                     package, line)
            continue
        details = details.groupdict()
        myvers = versions & get_requested_versions(details['vrange'])
        if not myvers:
            log.debug('%s.pyremove: no matching versions for line %s',
                      package, line)
            continue
        for version in myvers:
            files = glob(sitedir(version, package) + details['pattern'])
            if not files:
                log.debug('%s.pyremove: nothing to remove: python%d.%d, %s',
                          package, version, details['pattern'])
                continue
            for fpath in files:
                if isdir(fpath):
                    try:
                        rmtree(fpath)
                    except Exception, e:
                        status = False
                        log.error(e)
                else:
                    try:
                        os.remove(fpath)
                    except (IOError, OSError), e:
                        status = False
                        log.error(e)
    return status
