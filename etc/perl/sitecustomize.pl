# This script is only provided as a transition mechanism for
# removing the current working directory from the library search path
# in a user-configurable way.
#
# It was considered too risky to remove "." from @INC globally in the
# jessie security update which introduced this file, but administrators
# are given the option to to override this default by uncommenting the
# last line of this file.
#
# It is hoped that a future update to jessie might change this default,
# once more is known about the impact on real world Debian systems.
#
# However, please note that this facility is expected to be removed after
# the Debian stretch release, at which point any code in this file will
# not have any effect.
#
# Please see CVE-2016-1238 for background information on the risks
# of having "." on @INC.

#pop @INC if $INC[-1] eq '.' and !$ENV{PERL_USE_UNSAFE_INC};
