#!/bin/bash
. "/etc/webc/functions.sh"
. "/etc/webc/webc.conf"

cmdline_has debug && set -x

upgrade() {

# webc.conf exports the currently mounted git revision
if test -z "$current_git_revision"; then
	logs "No current revision found, not running git-fs? Skipping upgrade"
	return
fi

# See to what we should be updating. fetch_revision is
# the revision we should fetch from the git server (it
# can only be a branch or tag name, since we can't fetch
# a sha directly).
#
# Note that there is a second revision parameter,
# git_revision, which must always contain a sha and must
# only be used on the real kernel cmdline in the
# bootloader config to tell the initrd which revision to
# mount. It is automatically generated below based on
# fetch_revision.

if cmdline_has fetch-revision
then
	fetch_revision=$(cmdline_get fetch-revision)
else
	fetch_revision=master
fi

logs "Fetching git revision ${fetch_revision}"

# Fetch the git revision. It will not be stored
# in any local branch, just in FETCH_HEAD.
rm -f /.git/FETCH_HEAD
rm -f /.git/*.lock
if ! git --git-dir "${git_repo}" fetch --depth=1 --quiet origin "${fetch_revision}" || ! git --git-dir "${git_repo}" rev-parse --verify --quiet FETCH_HEAD
then
# Fetching the revision failed, to prevent an
# unbootable system, bail out now. Since we're not
# updating $live_image/live/webc-cmdline, this will be
# retried after the next reboot.
	logs "Fetching git revision ${fetch_revision} failed"
	return
fi

if test -z "$(git --git-dir "${git_repo}" tag --contains FETCH_HEAD)"
then
# If there is no tag that contains the
# downloaded revision yet, create one. Keeping a
# tag for every revision downloaded allows git
# fetch to not download these revisions again
# (since it does not take into account all
# commit objects in the repository, only named
# refs when telling the server what we already
# have).
	git tag "fetched-${fetch_revision}-$(date '+%s')" FETCH_HEAD
fi

# Get the sha has of the latest revision we just fetched
git_revision=$(git --git-dir "${git_repo}" rev-parse FETCH_HEAD)
logs "Successfully fetched git revision (got ${git_revision})"

# TODO: Also enter this if when boot_append was changed
if test "${current_git_revision}" != "${git_revision}"
then
# The config says we should be running a different
# revision than we're currently running, so change our
# bootloader config to make sure that happens.

if test -f $live_image/boot/live.cfg.in
then
# This is the "live" version, which
# offers a boot menu
	if ! generate_live_config $live_image "${git_repo}" "${git_revision}"
	then
		logs "Updating bootloader config failed!"
		return
	fi
else
# This is the "installed" version, which
# does not show a boot prompt and just
# boots the default entry
	if ! generate_installed_config $live_image "${git_repo}" "${git_revision}"
	then
		logs "Updating bootloader config failed!"
		return
	fi
fi

	logs "Updated bootloader to boot from ${git_revision}"
else
	logs "Already running ${current_git_revision}, no upgrade needed"
fi
}

logs "Upgrade waiting to be triggered."
wait_for $upgrade_pipe 2>/dev/null

if cmdline_has noupgrade
then
	logs "Upgrade disabled."
else
	upgrade
fi

echo ACK > $upgrade_pipe

# upgrade should restart via inittab and get blocked
# until $upgrade_pipe is re-created
