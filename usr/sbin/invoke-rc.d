#!/bin/sh  
#
# invoke-rc.d.sysvinit - Executes initscript actions
#
# SysVinit /etc/rc?.d version for Debian's sysvinit package
#
# Copyright (C) 2000,2001 Henrique de Moraes Holschuh <hmh@debian.org>
#
# This program is free software; you can redistribute it and/or modify it
# under the terms of the GNU General Public License as published by the Free
# Software Foundation; either version 2 of the License, or (at your option)
# any later version.
#
# This program is distributed in the hope that it will be useful, but
# WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
# or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
# for more details.
#
# You should have received a copy of the GNU General Public License along
# with this program; if not, write to the Free Software Foundation, Inc.,
# 51 Franklin St, Fifth Floor, Boston, MA 02110-1301, USA.

# Constants
RUNLEVEL=/sbin/runlevel
POLICYHELPER=/usr/sbin/policy-rc.d
INITDPREFIX=/etc/init.d/
UPSTARTDIR=/etc/init/
RCDPREFIX=/etc/rc

# Options
BEQUIET=
MODE=
ACTION=
FALLBACK=
NOFALLBACK=
FORCE=
RETRY=
RETURNFAILURE=
RC=
is_upstart=

# Shell options
set +e

dohelp () {
 # 
 # outputs help and usage
 #
cat <<EOF

invoke-rc.d, Debian/SysVinit (/etc/rc?.d) initscript subsystem.
Copyright (c) 2000,2001 Henrique de Moraes Holschuh <hmh@debian.org>

Usage:
  invoke-rc.d [options] <basename> <action> [extra parameters]

  basename - Initscript ID, as per update-rc.d(8)
  action   - Initscript action. Known actions are:
                start, [force-]stop, restart,
                [force-]reload, status
  WARNING: not all initscripts implement all of the above actions.

  extra parameters are passed as is to the initscript, following 
  the action (first initscript parameter).

Options:
  --quiet
     Quiet mode, no error messages are generated.
  --force
     Try to run the initscript regardless of policy and subsystem
     non-fatal errors.
  --try-anyway
     Try to run init script even if a non-fatal error is found.
  --disclose-deny
     Return status code 101 instead of status code 0 if
     initscript action is denied by local policy rules or
     runlevel constrains.
  --query
     Returns one of status codes 100-106, does not run
     the initscript. Implies --disclose-deny and --no-fallback.
  --no-fallback
     Ignores any fallback action requests by the policy layer.
     Warning: this is usually a very *bad* idea for any actions
     other than "start".
  --help
     Outputs help message to stdout

EOF
}

printerror () {
 #
 # prints an error message
 #  $* - error message
 #
if test x${BEQUIET} = x ; then
    echo `basename $0`: "$*" >&2
fi
}

formataction () {
 #
 # formats a list in $* into $printaction
 # for human-friendly printing to stderr
 # and sets $naction to action or actions
 #
printaction=`echo $* | sed 's/ /, /g'`
if test $# -eq 1 ; then
    naction=action
else
    naction=actions
fi
}

querypolicy () {
 #
 # queries policy database
 # returns: $RC = 104 - ok, run
 #          $RC = 101 - ok, do not run
 #        other - exit with status $RC, maybe run if $RETRY
 #          initial status of $RC is taken into account.
 #

policyaction="${ACTION}"
if test x${RC} = "x101" ; then
    if test "${ACTION}" = "start" || test "${ACTION}" = "restart" ; then
	policyaction="(${ACTION})"
    fi
fi

if test "x${POLICYHELPER}" != x && test -x "${POLICYHELPER}" ; then
    FALLBACK=`${POLICYHELPER} ${BEQUIET} ${INITSCRIPTID} "${policyaction}" ${RL}`
    RC=$?
    formataction ${ACTION}
    case ${RC} in
	0)   RC=104
	     ;;
	1)   RC=105
	     ;;
	101) if test x${FORCE} != x ; then
		printerror Overriding policy-rc.d denied execution of ${printaction}.
		RC=104
	     else
		printerror policy-rc.d denied execution of ${printaction}.
	     fi
	     ;;
    esac
    if test x${MODE} != xquery ; then
      case ${RC} in
	105) printerror policy-rc.d query returned \"behaviour undefined\",
	     printerror assuming \"${printaction}\" is allowed.
	     RC=104
	     ;;
	106) formataction ${FALLBACK}
	     if test x${FORCE} = x ; then
		 if test x${NOFALLBACK} = x ; then
		     ACTION="${FALLBACK}"
		     printerror executing ${naction} \"${printaction}\" instead due to policy-rc.d request.
		     RC=104
		 else
		     printerror ignoring policy-rc.d fallback request: ${printaction}.
		     RC=101
		 fi
	     else
		 printerror ignoring policy-rc.d fallback request: ${printaction}.
		 RC=104
	     fi
	     ;;
      esac
    fi
    case ${RC} in
      100|101|102|103|104|105|106) ;;
      *) printerror WARNING: policy-rc.d returned unexpected error status ${RC}, 102 used instead.
         RC=102
	 ;;
    esac
else
    if test x${RC} = x ; then 
	RC=104
    fi
fi
return
}

verifyparameter () {
 #
 # Verifies if $1 is not null, and $# = 1
 #
if test $# -eq 0 ; then
    printerror syntax error: invalid empty parameter
    exit 103
elif test $# -ne 1 ; then
    printerror syntax error: embedded blanks are not allowed in \"$*\"
    exit 103
fi
return
}

##
##  main
##

## Verifies command line arguments

if test $# -eq 0 ; then
  printerror syntax error: missing required parameter, --help assumed
  dohelp
  exit 103
fi

state=I
while test $# -gt 0 && test ${state} != III ; do
    case "$1" in
      --help)   dohelp 
		exit 0
		;;
      --quiet)  BEQUIET=--quiet
		;;
      --force)  FORCE=yes
		RETRY=yes
		;;
      --try-anyway)
	        RETRY=yes
		;;
      --disclose-deny)
		RETURNFAILURE=yes
		;;
      --query)  MODE=query
		RETURNFAILURE=yes
		;;
      --no-fallback)
		NOFALLBACK=yes
		;;
      --*)	printerror syntax error: unknown option \"$1\"
		exit 103
		;;
	*)      case ${state} in
		I)  verifyparameter $1
		    INITSCRIPTID=$1
		    ;;
		II) verifyparameter $1
		    ACTION=$1
		    ;;
		esac
		state=${state}I
		;;
    esac
    shift
done

if test ${state} != III ; then
    printerror syntax error: missing required parameter
    exit 103
fi

#NOTE: It may not be obvious, but "$@" from this point on must expand
#to the extra initscript parameters, except inside functions.

## sanity checks and just-in-case warnings.
case ${ACTION} in
    start|stop|force-stop|restart|reload|force-reload|status)
	;;
    *)
	if test "x${POLICYHELPER}" != x && test -x "${POLICYHELPER}" ; then
	    printerror action ${ACTION} is unknown, but proceeding anyway.
	fi
	;;
esac

# If we're running on upstart and there's an upstart job of this name, do
# the rest with upstart instead of calling the init script.
if which initctl >/dev/null && initctl version | grep -q upstart \
   && [ -e "$UPSTARTDIR/${INITSCRIPTID}.conf" ]
then
    is_upstart=1
elif test ! -f "${INITDPREFIX}${INITSCRIPTID}" ; then
    ## Verifies if the given initscript ID is known
    ## For sysvinit, this error is critical
    printerror unknown initscript, ${INITDPREFIX}${INITSCRIPTID} not found.
    exit 100
fi

## Queries sysvinit for the current runlevel
RL=`${RUNLEVEL} | sed 's/.*\ //'`
if test ! $? ; then
    printerror "could not determine current runlevel"
    if test x${RETRY} = x ; then
	exit 102
    fi
    RL=
fi

## Running ${RUNLEVEL} to get current runlevel do not work in the boot
## runlevel (scripts in /etc/rcS.d/), as /var/run/utmp contain
## runlevel 0 or 6 (written at shutdown) at that point.
if test x${RL} = x0 || test x${RL} = x6 ; then
    if ps -fp 1 | grep -q 'init boot' ; then
       RL=S
    fi
fi

## Handles shutdown sequences VERY safely
## i.e.: forget about policy, and do all we can to run the script.
## BTW, why the heck are we being run in a shutdown runlevel?!
if test x${RL} = x0 || test x${RL} = x6 ; then
    FORCE=yes
    RETRY=yes
    POLICYHELPER=
    BEQUIET=
    printerror "-----------------------------------------------------"
    printerror "WARNING: 'invoke-rc.d ${INITSCRIPTID} ${ACTION}' called"
    printerror "during shutdown sequence."
    printerror "enabling safe mode: initscript policy layer disabled"
    printerror "-----------------------------------------------------"
fi

## Verifies the existance of proper S??initscriptID and K??initscriptID 
## *links* in the proper /etc/rc?.d/ directory
verifyrclink () {
  #
  # verifies if parameters are non-dangling symlinks
  # all parameters are verified
  #
  doexit=
  while test $# -gt 0 ; do
    if test ! -L "$1" ; then
        printerror not a symlink: $1
        doexit=102
    fi
    if test ! -f "$1" ; then
        printerror dangling symlink: $1
        doexit=102
    fi
    shift
  done
  if test x${doexit} != x && test x${RETRY} = x; then
     exit ${doexit}
  fi
  return 0
}

# we do handle multiple links per runlevel
# but we don't handle embedded blanks in link names :-(
if test x${RL} != x ; then
    SLINK=`ls -d -Q ${RCDPREFIX}${RL}.d/S[0-9][0-9]${INITSCRIPTID} 2>/dev/null | xargs`
    KLINK=`ls -d -Q ${RCDPREFIX}${RL}.d/K[0-9][0-9]${INITSCRIPTID} 2>/dev/null | xargs`
    SSLINK=`ls -d -Q ${RCDPREFIX}S.d/S[0-9][0-9]${INITSCRIPTID} 2>/dev/null | xargs`

    verifyrclink ${SLINK} ${KLINK} ${SSLINK}
fi

testexec () {
  #
  # returns true if any of the parameters is
  # executable (after following links)
  #
  while test $# -gt 0 ; do
    if test -x "$1" ; then
       return 0
    fi
    shift
  done
  return 1
}

RC=

###
### LOCAL INITSCRIPT POLICY: Enforce need of a start entry
### in either runlevel S or current runlevel to allow start
### or restart.
###
case ${ACTION} in
  start|restart)
    if testexec ${SLINK} ; then
	RC=104
    elif testexec ${KLINK} ; then
	RC=101
    elif testexec ${SSLINK} ; then
	RC=104
    fi
  ;;
esac

# test if /etc/init.d/initscript is actually executable
if [ -n "$is_upstart" ] || testexec "${INITDPREFIX}${INITSCRIPTID}" ; then
    if test x${RC} = x && test x${MODE} = xquery ; then
        RC=105
    fi

    # call policy layer
    querypolicy
    case ${RC} in
        101|104)
           ;;
        *) if test x${MODE} != xquery ; then
	       printerror policy-rc.d returned error status ${RC}
	       if test x${RETRY} = x ; then
	           exit ${RC}
               else
    	           RC=102
    	       fi
           fi
           ;;
    esac
else
    ###
    ### LOCAL INITSCRIPT POLICY: non-executable initscript; deny exec.
    ### (this is common sense, actually :^P )
    ###
    RC=101
fi

## Handles --query
if test x${MODE} = xquery ; then
    exit ${RC}
fi


setechoactions () {
    if test $# -gt 1 ; then
	echoaction=true
    else
	echoaction=
    fi
}
getnextaction () {
    saction=$1
    shift
    ACTION="$@"
}

if [ -n "$is_upstart" ]; then
    RUNNING=
    DISABLED=
    if status "$INITSCRIPTID" 2>/dev/null | grep -q ' start/'; then
	RUNNING=1
    fi
    UPSTART_VERSION_RUNNING=$(initctl version|awk '{print $3}'|tr -d ')')

    if dpkg --compare-versions "$UPSTART_VERSION_RUNNING" ge 0.9.7
    then
	initctl show-config -e "$INITSCRIPTID"|grep -q '^  start on' || DISABLED=1
    fi
fi

## Executes initscript
## note that $ACTION is a space-separated list of actions
## to be attempted in order until one suceeds.
if test x${FORCE} != x || test ${RC} -eq 104 ; then
    if [ -n "$is_upstart" ] || testexec "${INITDPREFIX}${INITSCRIPTID}" ; then
	RC=102
	setechoactions ${ACTION}
	while test ! -z "${ACTION}" ; do
	    getnextaction ${ACTION}
	    if test ! -z ${echoaction} ; then
		printerror executing initscript action \"${saction}\"...
	    fi

	    if [ -n "$is_upstart" ]; then
		case $saction in
		    status)
			"$saction" "$INITSCRIPTID" && exit 0
			;;
		    start|stop)
			if [ -z "$RUNNING" ] && [ "$saction" = "stop" ]; then
			    exit 0
			elif [ -n "$RUNNING" ] && [ "$saction" = "start" ]; then
			    exit 0
			elif [ -n "$DISABLED" ] && [ "$saction" = "start" ]; then
			    exit 0
			fi
			$saction "$INITSCRIPTID" && exit 0
			;;
		    restart)
			if [ -n "$RUNNING" ] ; then
			    stop "$INITSCRIPTID"
			fi

			# If the job is disabled and is not currently
			# running, the job is not restarted. However, if
			# the job is disabled but has been forced into
			# the running state, we *do* stop and restart it
			# since this is expected behaviour
			# for the admin who forced the start.
			if [ -n "$DISABLED" ] && [ -z "$RUNNING" ]; then
			    exit 0
			fi
			start "$INITSCRIPTID" && exit 0
			;;
		    reload|force-reload)
			reload "$INITSCRIPTID" && exit 0
			;;
		    *)
			# This will almost certainly fail, but give it a try
			initctl "$saction" "$INITSCRIPTID" && exit 0
			;;
		esac
	    else
		"${INITDPREFIX}${INITSCRIPTID}" "${saction}" "$@" && exit 0
	    fi
	    RC=$?

	    if test ! -z "${ACTION}" ; then
		printerror action \"${saction}\" failed, trying next action...
	    fi
	done
	printerror initscript ${INITSCRIPTID}, action \"${saction}\" failed.
	exit ${RC}
    fi
    exit 102
fi

## Handles --disclose-deny and denied "status" action (bug #381497)
if test ${RC} -eq 101 && test x${RETURNFAILURE} = x ; then
    if test "x${ACTION%% *}" = "xstatus"; then
	printerror emulating initscript action \"status\", returning \"unknown\"
	RC=4
    else
        RC=0
    fi
else
    formataction ${ACTION}
    printerror initscript ${naction} \"${printaction}\" not executed.
fi

exit ${RC}
