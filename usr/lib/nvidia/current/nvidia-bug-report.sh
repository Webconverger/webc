#!/bin/sh

# NVIDIA Graphics Driver bug reporting shell script.  This shell
# script will generate a log file named "nvidia-bug-report.log.gz", which
# should be attached when emailing bug reports to NVIDIA.

PATH="/sbin:/usr/sbin:$PATH"

BASE_LOG_FILENAME="nvidia-bug-report.log"

# check if gzip is present
GZIP_CMD=`which gzip 2> /dev/null | head -n 1`
if [ $? -eq 0 -a "$GZIP_CMD" ]; then
    GZIP_CMD="gzip -c"
    LOG_FILENAME="$BASE_LOG_FILENAME.gz"
    OLD_LOG_FILENAME="$BASE_LOG_FILENAME.old.gz"
else
    GZIP_CMD="cat"
    LOG_FILENAME=$BASE_LOG_FILENAME
    OLD_LOG_FILENAME="$BASE_LOG_FILENAME.old"
fi


NVIDIA_BUG_REPORT_CHANGE='$Change: 12564671 $'
NVIDIA_BUG_REPORT_VERSION=`echo "$NVIDIA_BUG_REPORT_CHANGE" | tr -c -d "[:digit:]"`


#
# echo_metadata() - echo metadata of specified file
#

echo_metadata() {
    printf "*** ls: "
    /bin/ls -l --full-time "$1" 2> /dev/null

    if [ $? -ne 0 ]; then
        # Run dumb ls -l. We might not get one-second mtime granularity, but
        # that is probably okay.
        ls -l "$1"
    fi
}


#
# append() - append the contents of the specified file to the log
#

append() {
    (
        echo "____________________________________________"
        echo ""

        if [ ! -f "$1" ]; then
            echo "*** $1 does not exist"
        elif [ ! -r "$1" ]; then
            echo "*** $1 is not readable"
        else
            echo "*** $1"
            echo_metadata "$1"
            cat  "$1"
        fi
        echo ""
    ) | $GZIP_CMD >> $LOG_FILENAME
}

#
# append_silent() - same as append(), but don't print anything
# if the file does not exist
#

append_silent() {
    (
        if [ -f "$1" -a -r "$1" ]; then
            echo "____________________________________________"
            echo ""
            echo "*** $1"
            echo_metadata "$1"
            cat  "$1"
            echo ""
        fi
    ) | $GZIP_CMD >> $LOG_FILENAME
}

#
# append_glob() - use the shell to expand a list of files, and invoke
# append() for each of them
#

append_glob() {
    for i in `ls $1 2> /dev/null;`; do
        append "$i"
    done
}

#
# append_binary_file() - Encode a binary file into a ascii string format
# using 'base64' and append the contents output to the log file
#

append_binary_file() {
    (
        base64=`which base64 2> /dev/null | head -n 1`

        if [ $? -eq 0 -a -x "$base64" ]; then
                if [ -f "$1" -a -r "$1" ]; then
                    echo "____________________________________________"
                    echo ""
                    echo "base64 \"$1\""
                    echo ""
                    base64 "$1" 2> /dev/null
                    echo ""
                fi
        else
            echo "Skipping $1 output (base64 not found)"
            echo ""
        fi

    ) | $GZIP_CMD >> $LOG_FILENAME
}

#
# Start of script
#


# check that we are root (needed for `lspci -vxxx` and potentially for
# accessing kernel log files)

if [ `id -u` -ne 0 ]; then
    echo "ERROR: Please run $(basename $0) as root."
    exit 1
fi


# move any old log file (zipped) out of the way

if [ -f $LOG_FILENAME ]; then
    mv $LOG_FILENAME $OLD_LOG_FILENAME
fi


# make sure what we can write to the log file

touch $LOG_FILENAME 2> /dev/null

if [ $? -ne 0 ]; then
    echo
    echo "ERROR: Working directory is not writable; please cd to a directory"
    echo "       where you have write permission so that the $LOG_FILENAME"
    echo "       file can be written."
    echo
    exit 1
fi


# print a start message to stdout

echo ""
echo "nvidia-bug-report.sh will now collect information about your"
echo "system and create the file '$LOG_FILENAME' in the current"
echo "directory.  It may take several seconds to run.  In some"
echo "cases, it may hang trying to capture data generated dynamically"
echo "by the Linux kernel and/or the NVIDIA kernel module.  While"
echo "the bug report log file will be incomplete if this happens, it"
echo "may still contain enough data to diagnose your problem." 
echo ""
echo "Please include the '$LOG_FILENAME' log file when reporting"
echo "your bug via the nV News NVIDIA Linux forum (see www.nvnews.net)"
echo "or by sending email to 'linux-bugs@nvidia.com'."
echo ""
echo -n "Running $(basename $0)...";


# print prologue to the log file

(
    echo "____________________________________________"
    echo ""
    echo "Start of NVIDIA bug report log file.  Please include this file"
    echo "when reporting a graphics driver bug via the nV News NVIDIA"
    echo "Linux forum (see www.nvnews.net) or by sending email to"
    echo "'linux-bugs@nvidia.com'."
    echo ""
    echo "nvidia-bug-report.sh Version: $NVIDIA_BUG_REPORT_VERSION"
    echo ""
    echo "Date: `date`"
    echo "uname: `uname -a`"
    echo ""
) | $GZIP_CMD >> $LOG_FILENAME


# append useful files

append "/etc/issue"

append_silent "/etc/redhat-release"
append_silent "/etc/redhat_version"
append_silent "/etc/fedora-release"
append_silent "/etc/slackware-release"
append_silent "/etc/slackware-version"
append_silent "/etc/debian_release"
append_silent "/etc/debian_version"
append_silent "/etc/mandrake-release"
append_silent "/etc/yellowdog-release"
append_silent "/etc/sun-release"
append_silent "/etc/release"
append_silent "/etc/gentoo-release"

append "/var/log/nvidia-installer.log"

# append the X log; also, extract the config file named in the X log
# and append it; look for X log files with names of the form:
# /var/log/{XFree86,Xorg}.{0,1,2,3,4,5,6,7}.{log,log.old}

xconfig_file_list=
svp_config_file_list=
NEW_LINE="
"

for log_basename in /var/log/XFree86 /var/log/Xorg; do
    for i in 0 1 2 3 4 5 6 7; do
        for log_suffix in log log.old; do
            log_filename="${log_basename}.${i}.${log_suffix}"
            append_silent "${log_filename}"

            # look for the X configuration files/directories referenced by this X log
            if [ -f ${log_filename} -a -r ${log_filename} ]; then
                config_file=`grep "Using config file" ${log_filename} | cut -f 2 -d \"`
                config_dir=`grep "Using config directory" ${log_filename} | cut -f 2 -d \"`
                sys_config_dir=`grep "Using system config directory" ${log_filename} | cut -f 2 -d \"`
                for j in "$config_file" "$config_dir" "$sys_config_dir"; do
                    if [ "$j" ]; then
                        # multiple of the logs we find above might reference the
                        # same X configuration file; keep a list of which X
                        # configuration files we find, and only append X
                        # configuration files we have not already appended
                        echo "${xconfig_file_list}" | grep ":${j}:" > /dev/null
                        if [ "$?" != "0" ]; then
                            xconfig_file_list="${xconfig_file_list}:${j}:"
                            if [ -d "$j" ]; then
                                append_glob "$j/*.conf"
                            else
                                append "$j"
                            fi
                        fi
                    fi
                done

                # append NVIDIA 3D Vision Pro configuration settings
                svp_conf_files=`grep "Option \"3DVisionProConfigFile\"" ${log_filename} | cut -f 4 -d \"`
                if [ "${svp_conf_files}" ]; then
                    OLD_IFS="$IFS"
                    IFS=$NEW_LINE
                    for svp_file in ${svp_conf_files}; do
                        IFS="$OLD_IFS"
                        echo "${svp_config_file_list}" | grep ":${svp_file}:" > /dev/null
                        if [ "$?" != "0" ]; then
                            svp_config_file_list="${svp_config_file_list}:${svp_file}:"
                            append_binary_file "${svp_file}"
                        fi
                        IFS=$NEW_LINE
                    done
                    IFS="$OLD_IFS"
                fi
            fi

        done
    done
done

# append ldd info

(
    echo "____________________________________________"
    echo ""

    glxinfo=`which glxinfo 2> /dev/null | head -n 1`

    if [ $? -eq 0 -a -x "$glxinfo" ]; then
        echo "ldd $glxinfo"
        echo ""
        ldd $glxinfo 2> /dev/null
        echo ""
    else
        echo "Skipping ldd output (glxinfo not found)"
        echo ""
    fi
) | $GZIP_CMD >> $LOG_FILENAME

# lspci information

(
    echo "____________________________________________"
    echo ""

    lspci=`which lspci 2> /dev/null | head -n 1`

    if [ $? -eq 0 -a -x "$lspci" ]; then
        echo "$lspci -d \"10de:*\" -v -xxx"
        echo ""
        $lspci -d "10de:*" -v -xxx 2> /dev/null
        echo ""
        echo "____________________________________________"
        echo ""
        echo "$lspci -t"
        echo ""
        $lspci -t 2> /dev/null
        echo ""
        echo "____________________________________________"
        echo ""
        echo "$lspci -nn"
        echo ""
        $lspci -nn 2> /dev/null
    else
        echo "Skipping lspci output (lspci not found)"
        echo ""
    fi
) | $GZIP_CMD >> $LOG_FILENAME

# lsusb information

(
    echo "____________________________________________"
    echo ""

    lsusb=`which lsusb 2> /dev/null | head -n 1`

    if [ $? -eq 0 -a -x "$lsusb" ]; then
        echo "$lsusb"
        echo ""
        $lsusb 2> /dev/null
        echo ""
    else
        echo "Skipping lsusb output (lsusb not found)"
        echo ""
    fi
) | $GZIP_CMD >> $LOG_FILENAME

# dmidecode

(
    echo "____________________________________________"
    echo ""

    dmidecode=`which dmidecode 2> /dev/null | head -n 1`

    if [ $? -eq 0 -a -x "$dmidecode" ]; then
        echo "$dmidecode"
        echo ""
        $dmidecode 2> /dev/null
        echo ""
    else
        echo "Skipping dmidecode output (dmidecode not found)"
        echo ""
    fi
) | $GZIP_CMD >> $LOG_FILENAME

# module version magic

(
    echo "____________________________________________"
    echo ""

    modinfo=`which modinfo 2> /dev/null | head -n 1`

    if [ $? -eq 0 -a -x "$modinfo" ]; then
        echo "$modinfo nvidia | grep vermagic"
        echo ""
        ( $modinfo nvidia | grep vermagic ) 2> /dev/null
        echo ""
    else
        echo "Skipping modinfo output (modinfo not found)"
        echo ""
    fi
) | $GZIP_CMD >> $LOG_FILENAME

# get any relevant kernel messages

(
    echo "____________________________________________"
    echo ""
    echo "Scanning kernel log files for NVRM messages:"
    echo ""

    for i in /var/log/messages /var/log/kernel.log ; do
        if [ -f $i -a -r $i ]; then
            echo "  $i:"
            ( cat $i | grep NVRM ) 2> /dev/null
        else
            echo "$i is not readable"
        fi
    done
) | $GZIP_CMD >> $LOG_FILENAME

# append dmesg output

(
    echo ""
    echo "____________________________________________"
    echo ""
    echo "dmesg:"
    echo ""
    dmesg 2> /dev/null
) | $GZIP_CMD >> $LOG_FILENAME

# print gcc & g++ version info

(
    which gcc >/dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "____________________________________________"
        echo ""
        gcc -v 2>&1
    fi

    which g++ >/dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "____________________________________________"
        echo ""
        g++ -v 2>&1
    fi
) | $GZIP_CMD >> $LOG_FILENAME

# In case of failure, if xset returns with delay, we print the
# message from check "$?" & if it returns error immediately before kill,
# we directly write the error to the log file.

(
    echo "____________________________________________"
    echo ""
    echo "xset -q:"
    echo ""

    xset -q 2>&1 & sleep 1 ; kill -9 $! > /dev/null 2>&1

    if [ $? -eq 0 ]; then
        # The xset process is still there.
        echo "xset could not connect to an X server"
    fi
) | $GZIP_CMD >> $LOG_FILENAME

# In case of failure, if nvidia-settings returns with delay, we print the
# message from check "$?" & if it returns error immediately before kill,
# we directly write the error to the log file.

(
    echo "____________________________________________"
    echo ""
    echo "nvidia-settings -q all:"
    echo ""

    DPY="$DISPLAY"
    [ "$DPY" ] || DPY=":0"
    DISPLAY= nvidia-settings -c "$DPY" -q all 2>&1 & sleep 1 ; kill -9 $! > /dev/null 2>&1

    if [ $? -eq 0 ]; then
        # The nvidia-settings process is still there.
        echo "nvidia-settings could not connect to an X server"
    fi
) | $GZIP_CMD >> $LOG_FILENAME


sync > /dev/null 2>&1
sync > /dev/null 2>&1

# append useful /proc files

append "/proc/cmdline"
append "/proc/cpuinfo"
append "/proc/interrupts"
append "/proc/meminfo"
append "/proc/modules"
append "/proc/version"
append "/proc/pci"
append "/proc/iomem"
append "/proc/mtrr"

append "/proc/driver/nvidia/version"
GPU=0
while [ -d /proc/driver/nvidia/gpus/$GPU ]; do
    append "/proc/driver/nvidia/gpus/$GPU/information"
    append "/proc/driver/nvidia/gpus/$GPU/registry"
    GPU=$((GPU + 1))
done
append_glob "/proc/driver/nvidia/agp/*"
append_glob "/proc/driver/nvidia/warnings/*"
append "/proc/driver/nvidia/params"
append "/proc/driver/nvidia/registry"

append_glob "/proc/acpi/video/*/*/info"

append "/proc/asound/cards"
append "/proc/asound/pcm"
append "/proc/asound/modules"
append "/proc/asound/devices"
append "/proc/asound/version"
append "/proc/asound/timers"
append "/proc/asound/hwdep"

for CARD in /proc/asound/card[0-9]*; do
    for CODEC in $CARD/codec*; do
        [ -d $CODEC ] && append_glob "$CODEC/*"
        [ -f $CODEC ] && append "$CODEC"
    done
    for ELD in $CARD/eld*; do
        [ -f $ELD ] && append "$ELD"
    done
done

# nvidia-smi

(
    echo "____________________________________________"
    echo ""

    nvidia_smi=`which nvidia-smi 2> /dev/null | head -n 1`

    if [ $? -eq 0 -a -x "$nvidia_smi" ]; then
        echo "$nvidia_smi -q"
        echo ""
        $nvidia_smi -q
        echo ""

        echo "$nvidia_smi -q -u"
        echo ""
        $nvidia_smi -q -u
        echo "" 
    else
        echo "Skipping nvidia-smi output (nvidia-smi not found)"
        echo ""
    fi
) | $GZIP_CMD >> $LOG_FILENAME

# nvidia-debugdump

(
    echo "____________________________________________"
    echo ""

    nvidia_debugdump=`which nvidia-debugdump 2> /dev/null | head -n 1`

    if [ $? -eq 0 -a -x "$nvidia_debugdump" ]; then
    
        base64=`which base64 2> /dev/null | head -n 1`
        
        if [ $? -eq 0 -a -x "$base64" ]; then
            # make sure what we can write to the temp file
            
            NVDD_TEMP_FILENAME="nvidia-debugdump-temp$$.log"
            
            touch $NVDD_TEMP_FILENAME 2> /dev/null

            if [ $? -ne 0 ]; then
                echo "Skipping nvidia-debugdump output (can't create temp file $NVDD_TEMP_FILENAME)"
                echo ""
                # don't fail here, continue
            else
                echo "$nvidia_debugdump -D"
                echo ""
                $nvidia_debugdump -D -f $NVDD_TEMP_FILENAME 2> /dev/null
                $base64 $NVDD_TEMP_FILENAME 2> /dev/null
                echo ""
                
                # remove the temporary file when complete
                rm $NVDD_TEMP_FILENAME 2> /dev/null
            fi
        else
            echo "Skipping nvidia-debugdump output (base64 not found)"
            echo ""
        fi
    else
        echo "Skipping nvidia-debugdump output (nvidia-debugdump not found)"
        echo ""
    fi
) | $GZIP_CMD >> $LOG_FILENAME

(
    echo "____________________________________________"

    # print epilogue to log file

    echo ""
    echo "End of NVIDIA bug report log file."
) | $GZIP_CMD >> $LOG_FILENAME

# Done

echo " complete."
echo ""
