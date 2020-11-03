# -*- coding: UTF-8 -*-
# Copyright © 2011-2012 Piotr Ożarowski <piotr@debian.org>
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
import logging
from os import environ, listdir, remove, rmdir
from os.path import dirname, exists, join, getsize, split
from subprocess import Popen, PIPE

from debpython.pydist import PUBLIC_DIR_RE
from debpython.tools import memoize, sitedir

log = logging.getLogger(__name__)


def parse(fpaths, other=None):
    """Parse namespace_packages.txt files."""
    result = set(other or [])
    for fpath in fpaths:
        with open(fpath, 'r') as fp:
            for line in fp:
                if line:
                    result.add(line.strip())
    return result


@memoize
def load(package=None):
    """Return a set of namespaces to regenerate/clean.

    :param package: limit namespaces to the ones needed by given package
    """
    fpaths = None
    # DESTDIR is used in tests
    nsdir = "%s/usr/share/python/ns/" % environ.get('DESTDIR', '')
    if package:
        # only one package is processed, no need to load all files
        fpath = join(nsdir, package)
        if exists(fpath):
            fpaths = [fpath]
    else:
        # load all files
        if exists(nsdir):
            fpaths = [join(nsdir, i) for i in listdir(nsdir)]

    if fpaths:
        result = set(i.replace('.', '/') for i in parse(fpaths))
    else:
        result = set()
    return result


def add_namespace_files(files, package=None, action=None):
    """Add __init__.py files to given generator."""
    if action is not None:
        namespaces = load(package)
        already_processed = set()
        removal_candidates = set()
    for fn in files:
        yield fn
        if action is None:
            continue
        dpath = dirname(fn)
        if dpath not in already_processed:
            already_processed.add(dpath)
            m = PUBLIC_DIR_RE.match(dpath)
            if m:
                public_dir = m.group()
                while dpath != public_dir:
                    ns_dir = dpath[len(public_dir) + 1:]
                    if ns_dir in namespaces:
                        fpath = join(dpath, '__init__.py')
                        if action is True:
                            try:
                                open(fpath, 'a').close()
                            except Exception:
                                log.error('cannot create %s', fpath)
                            else:
                                yield fpath
                        else:  # action is False
                            # postpone it due to dpkg -S call
                            removal_candidates.add(fpath)
                    already_processed.add(dpath)
                    dpath = split(dpath)[0]

    # now deal with to-be-removed namespace candidates (dpkg -S is expensive)
    # dpgk -S is used just to be safe (in case some other package is providing
    # __init__.py file although it's in /usr/share/python/ns dir)
    if action is False and removal_candidates:
        process = Popen("/usr/bin/dpkg -S %s 2>/dev/null" % \
                        ' '.join(removal_candidates), shell=True, stdout=PIPE)
        # FIXME: len(search_string) > 131072
        stdout, stderr = process.communicate()
        for line in stdout.splitlines():
            ns = line.split(': ', 1)[1]
            if ns in removal_candidates:
                removal_candidates.remove(ns)

        for fpath in removal_candidates:
            try:
                remove(fpath)
            except (IOError, OSError), e:
                log.error('cannot remove %s', fpath)
                log.debug(e)
            else:
                yield fpath


def remove_from_package(package, namespaces, versions):
    """Remove empty __init__.py files for requested namespaces."""
    if not isinstance(namespaces, set):
        namespaces = set(namespaces)
    keep = set()
    for ns in namespaces:
        for version in versions:
            fpath = join(sitedir(version, package), *ns.split('.'))
            fpath = join(fpath, '__init__.py')
            if not exists(fpath):
                continue
            if getsize(fpath) != 0:
                log.warning('file not empty, cannot share %s namespace', ns)
                keep.add(ns)
                break

    # return a set of namespaces that should be handled by pycompile/pyclean
    result = namespaces - keep

    # remove empty __init__.py files, if available
    for ns in result:
        for version in versions:
            dpath = join(sitedir(version, package), *ns.split('.'))
            fpath = join(dpath, '__init__.py')
            if exists(fpath):
                remove(fpath)
                if not listdir(dpath):
                    rmdir(dpath)
        # clean pyshared dir as well
        dpath = join('debian', package, 'usr/share/pyshared', *ns.split('.'))
        fpath = join(dpath, '__init__.py')
        if exists(fpath):
            remove(fpath)
            if not listdir(dpath):
                rmdir(dpath)
    return result
