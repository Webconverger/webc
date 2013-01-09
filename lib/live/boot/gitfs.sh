#!/bin/sh -x

touch /tmp/GITFS-RUN
for s in /.git-fixups/*; do sh "$s"; done
