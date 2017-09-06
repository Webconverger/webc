# This script is only provided as a transition mechanism for
# removing the current working directory from the library search path
# while leaving a temporary way to override this locally.
#
# If you really need "." to be on @INC globally, you can comment
# this away for now. However, please note that this facility
# is expected to be removed after the Debian stretch release,
# at which point any code in this file will not have any effect.
#
# Please see CVE-2016-1238 for background information on the risks
# of having "." on @INC.

pop @INC if $INC[-1] eq '.' and !$ENV{PERL_USE_UNSAFE_INC};
