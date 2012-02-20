#!/bin/sh
#
# Wrapper to the GNU's install-info, to be compatible with the one that used to
# be packaged by dpkg on Debian.
#
# written by Norbert Preining, this is not copyrightable ;-)
#
set -e

if [ -z "$DPKG_RUNNING_VERSION" ] ; then
  # it seems we are running from outside a maintainer script, so give a
  # warning and call ginstall-info without anything else
  echo "This is not dpkg install-info anymore, but GNU install-info" >&2
  echo "See the man page for ginstall-info for command line arguments" >&2
  ginstall-info "$@"
else 
  # we are running from a maintainer script, simply ignore the call
  # since we have trigger support and people should rebuild their
  # package with new debhelper which does not add calls to install-info
  # Do not complain if called with "--remove" or "--remove-exactly",
  # as these are used in old packages' prerm scripts (see #546165)
  while [ -n "$1" ]; do
    case "$1" in
      --remove|--remove-exactly)
        exit 0
        ;;
      *)
        shift
        ;;
    esac
  done
  echo "Ignoring install-info called from maintainer script" >&2
  echo "The package $DPKG_MAINTSCRIPT_PACKAGE should be rebuilt with new debhelper to get trigger support" >&2
fi


