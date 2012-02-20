#!/bin/sh

# 20050524 Thomas Hood: Cleaned up; added --dev-dir option

DEV_DIR="/dev"
MAJOR=116
OSSMAJOR=14
DSP_MINOR=""
MAX_CARDS=4
OWNER=root.root
PERM=666
DIR_PERM=755
WIPE_OLD=yes

if [ "`grep "^audio:" /etc/group`x" != x ]; then
  OWNER=root.audio
fi

echo_usage () {
  echo "Usage: snddevices [-h|--help] [max] [--no-wipe] [--dev-dir=PATHNAME] [--owner=USER:GROUP]"
}

report_error () {
  echo "${0}: Error: $*" >&2
}

while [ "$1" ] ; do
  case "$1" in 
    "-?"|-h|--help) echo_usage ; exit 0 ;;
    max) DSP_MINOR=19 ;;
    --no-wipe) WIPE_OLD="" ;;
    --dev-dir) DEV_DIR="$2" ; shift ;;
    --dev-dir=*) DEV_DIR="${1#--dev-dir=}" ;;
    --owner) OWNER="$2" ; shift ;;
    --owner=*) OWNER="${1#--owner=}" ;;
    *) echo_usage >&2 ; exit 1 ;;
  esac
  shift
done

if [ "$OWNER" = "root.audio" ] ; then
  PERM=660
  DIR_PERM=750
fi

# Meant to be called from assert_*_args only
report_args_error () {
  # report_error "Incorrect call: ${FUNCNAME[2]}() takes $* arguments"
  report_error "Incorrect call: needs $* arguments"
}

assert_one_arg () {
  { [ "$1" ] && [ -z "$2" ] ; } || { report_args_error "one" ; exit 99 ; }
}

assert_two_args () {
  { [ "$2" ] && [ -z "$3" ] ; } || { report_args_error "two" ; exit 99 ; }
}

assert_three_args () {
  { [ "$3" ] && [ -z "$4" ] ; } || { report_args_error "three" ; exit 99 ; }
}

assert_three_or_four_args () {
  { [ "$3" ] && [ -z "$5" ] ; } || { report_args_error "three or four" ; exit 99 ; }
}

# $1 destination-relative pathname of source
# $2 DEV_DIR-relative pathname of destination
link_file () {
  assert_two_args "$@"
  ln -sf "$1" "$DEV_DIR/$2"
}

# $1 DEV_DIR-relative pathname of source
# $2 DEV_DIR-relative pathname of destination
move_file () {
  assert_two_args "$@"
  mv -f "$DEV_DIR/$1" "$DEV_DIR/$2"
}

# $1 DEV_DIR-relative shell glob pattern of files to delete
del_file_pattern () {
  assert_one_arg "$@"
  eval rm -f "$DEV_DIR/$1"
}

# $1 DEV_DIR-relative pathname to make
make_dir () {
  assert_one_arg "$@"
  mkdir -p "$DEV_DIR/$1"
}

# $1 DEV_DIR-relative pathname to delete
del_dir () {
  assert_one_arg "$@"
  rmdir "$DEV_DIR/$1"
}

# $1 DEV_DIR-relative pathname to test
is_dir () {
  assert_one_arg "$@"
  [ -d "$DEV_DIR/$1" ]
}

# $1 owner:group
# $2 DEV_DIR-relative pathname whose owner will be changed
change_owner () {
  assert_two_args "$@"
  chown "$1" "$DEV_DIR/$2"
}

# $1 perms
# $2 DEV_DIR-relative pathname whose perms will be changed
change_perms () {
  assert_two_args "$@"
  chmod "$1" "$DEV_DIR/$2"
}

# $1 DEV_DIR-relative pathname of node to make
# $2 major
# $3 minor
make_char_node () {
  assert_three_args "$@"
  rm -f "$DEV_DIR/$1"
  mknod "$DEV_DIR/$1" c "$2" "$3"
}


# $1 DEV_DIR-relative pathname of device to create
# $2 minor number of device to create
create_oss_dev () {
  assert_two_args "$@"
  del_file_pattern "$1"
  echo -n "Creating $1..."
  make_char_node "$1" "$OSSMAJOR" "$2"
  change_owner "$OWNER" "$1"
  change_perms "$PERM"  "$1"
  echo "done."
}

# $1 DEV_DIR-relative base pathname of devices to create
# $2 minor number offset of devices to create
create_oss_dev_range () {
  assert_two_args "$@"
  tmp=0
  tmp1=0
  del_file_pattern "$1"
  del_file_pattern "${1}?"
  echo -n "Creating $1?..."
  while [ "$tmp1" -lt "$MAX_CARDS" ]; do
    minor=`expr $2 + $tmp`
    make_char_node "$1$tmp1" "$OSSMAJOR" "$minor"
    change_owner "$OWNER" "$1$tmp1"
    change_perms "$PERM"  "$1$tmp1"
    tmp=`expr $tmp + 16`
    tmp1=`expr $tmp1 + 1`
  done
  echo "done."
}

# $1 DEV_DIR-relative pathname of device to create
# $2 minor number of device to create
create_single_dev () {
  assert_two_args "$@"
  del_file_pattern "$1"
  echo -n "Creating $1..."
  make_char_node "$1" "$MAJOR" "$2"
  change_owner "$OWNER" "$1"
  change_perms "$PERM"  "$1"
  echo "done."
}

# $1 DEV_DIR-relative base pathname of devices to create
# $2 minor number offset of devices to create
create_card_dev_range () {
  assert_two_args "$@"
  tmp=0
  del_file_pattern "$1"
  del_file_pattern "${1}?"
  echo -n "Creating $1?..."
  while [ "$tmp" -lt "$MAX_CARDS" ]; do
    minor=`expr $tmp \* 32`
    minor=`expr $2 + $minor`
    make_char_node "${1}C${tmp}" "$MAJOR" "$minor"
    change_owner "$OWNER" "${1}C${tmp}"
    change_perms "$PERM"  "${1}C${tmp}"
    tmp=`expr $tmp + 1`
  done
  echo "done."
}

# $1 DEV_DIR-relative base pathname of devices to create
# $2 minor number offset of devices to create
# $3 number of devices to create
# [$4 device name suffix]
create_device_dev_range () {
  assert_three_or_four_args "$@"
  tmp=0
  del_file_pattern "$1"
  del_file_pattern "${1}?"
  echo -n "Creating $1??$4..."
  while [ "$tmp" -lt "$MAX_CARDS" ]; do
    tmp1=0
    while [ "$tmp1" -lt "$3" ]; do
      minor=`expr $tmp \* 32`
      minor=`expr $2 + $minor + $tmp1`
      make_char_node "${1}C${tmp}D${tmp1}${4}" "$MAJOR" "$minor"
      change_owner "$OWNER" "${1}C${tmp}D${tmp1}${4}"
      change_perms "$PERM"  "${1}C${tmp}D${tmp1}${4}"
      tmp1=`expr $tmp1 + 1`
    done
    tmp=`expr $tmp + 1`
  done
  echo "done."
}

# OSS (Lite) compatible devices...

if test "$OSSMAJOR" -eq 14; then
  create_oss_dev_range mixer            0
  create_oss_dev       sequencer        1
  create_oss_dev_range midi0            2	# /dev/midi is for tclmidi
  create_oss_dev_range dsp              3
  create_oss_dev_range audio            4
  create_oss_dev       sndstat          6
  create_oss_dev       music            8
  create_oss_dev_range dmmidi           9
  create_oss_dev_range dmfm             10
  create_oss_dev_range amixer           11	# alternate mixer
  create_oss_dev_range adsp             12	# alternate dsp
  create_oss_dev_range amidi            13	# alternate midi
  create_oss_dev_range admmidi          14	# alternate direct midi
  # create symlinks
  link_file mixer0 mixer
  link_file midi00 midi		# /dev/midi0 is for tclmidi
  link_file dsp0   dsp
  link_file audio0 audio
  link_file music  sequencer2
  link_file adsp0  adsp
  link_file amidi0 amidi
fi

# Remove old devices

if [ "$WIPE_OLD" = yes ] ; then
  move_file sndstat 1sndstat 
  del_file_pattern 'snd*'
  move_file 1sndstat sndstat

  if is_dir snd ; then
    del_file_pattern 'snd/*'
    del_dir snd
  fi
fi

# Create new ones

make_dir snd
change_owner "$OWNER"    snd
change_perms "$DIR_PERM" snd
create_card_dev_range   snd/control     0
create_single_dev       snd/seq         1
create_single_dev       snd/timer       33
create_device_dev_range snd/hw          4	4
create_device_dev_range snd/midi        8	8
create_device_dev_range snd/pcm         16	8	p
create_device_dev_range snd/pcm         24	8	c

# Create loader devices

del_file_pattern 'aload*'
create_card_dev_range   aload       0
create_single_dev       aloadSEQ    1

