#!/bin/sh

set -e

REGDOMAIN=
CRDA_CONF=/etc/default/crda

[ -r "$CRDA_CONF" ] && . "$CRDA_CONF"
[ -z "$REGDOMAIN" ] && exit 0

exec /sbin/iw reg set "$REGDOMAIN"
