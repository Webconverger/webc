#
# Copyright (c) 2015-2016, 2018 Samuel Thibault <samuel.thibault@ens-lyon.org>
# 
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
# 
# 
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
# 
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.
# 

. /usr/share/cups/braille/cups-braille.sh

FIRMWARE=$(getOptionNumber IndexFirmwareVersion)
[ $? = 0 ] || exit 1
DUPLEX=$(getOption Duplex)
[ -n "$DUPLEX" ] || DUPLEX=None
ZFOLDING=$(getOption ZFolding)
[ -n "$ZFOLDING" ] || ZFOLDING=False
SIDEWAYS=$(getOption SideWays)
[ -n "$SIDEWAYS" ] || SIDEWAYS=False
SADDLESTITCH=$(getOption SaddleStitch)
[ -n "$SADDLESTITCH" ] || SADDLESTITCH=False
TABLE=$(getOptionNumber IndexTable)
[ $? = 0 ] || exit 1
MULTIPLEIMPACT=$(getOptionNumber IndexMultipleImpact)
[ $? = 0 ] || exit 1
HWPAGENUMBER=$(getOption HardwarePageNumber)

# Convert from 100th of mm to Inch fraction
mmToIndexIn () {
  # 100th of mm
  MM=$1

  # 120th of inches
  IN120=$(($MM * 12 / 254))

  # Integer part
  INT=$(($IN120 / 120 ))

  # Fractional part, first in 120th of inch
  FRAC=$(($IN120 % 120))

  # Convert to Index-specific values
  if [ $FRAC -lt 30 ];  then
    # Round down to zero
    FRAC=0
  elif [ $FRAC -ge 30 -a $FRAC -lt 40 ];  then
    # Round down to a quarter
    FRAC=1
  elif [ $FRAC -ge 40 -a $FRAC -lt 60 ];  then
    # Round down to a third
    FRAC=2
  elif [ $FRAC -ge 60 -a $FRAC -lt 80 ];  then
    # Round down to a half
    FRAC=3
  elif [ $FRAC -ge 80 -a $FRAC -lt 90 ];  then
    # Round down to two thirds
    FRAC=4
  else
    # Round down to three quarters
    FRAC=5
  fi

  echo $INT$FRAC
}

# Return options common to v3 and v4
commonOptions() {
  INIT=
  # Disable options we don't want: first line offset and page numbering
  INIT+=,FO0

  # Support hardware-assisted multiple copies
  if [ $NB != 1 ]
  then
    INIT+=,MC$NB
  fi

  INIT+=,MI$MULTIPLEIMPACT

  case "$DUPLEX" in
    None|DuplexNoTumble) ;;
    *) printf "ERROR: duplex mode %s is not supported\n" "$DUPLEX" >&2 ; exit 1;;
  esac

  case "$DUPLEX,$ZFOLDING,$SADDLESTITCH,$SIDEWAYS" in
    None,False,False,False)           INIT+=,DP1 ;; # Single Sided
    DuplexNoTumble,False,False,False) INIT+=,DP2 ;; # Double Sided

    DuplexNoTumble,True,False,False)  INIT+=,DP3 ;; # Double Sided z-folding
    None,True,False,False)            INIT+=,DP5 ;; # Single Sided z-folding

    DuplexNoTumble,False,True,False)  INIT+=,DP4 ;; # Double Sided Saddle Stitch
    None,False,True,False)            INIT+=,DP8 ;; # Single Sided Saddle Stitch

    DuplexNoTumble,True,False,True)   INIT+=,DP6 ;; # Double Sided z-folding sideways
    None,True,False,True)             INIT+=,DP7 ;; # Single Sided z-folding sideways

    *) printf "ERROR: unsupported page folding: duplex=%s z-folding=%s sideways=%s saddlestich=%s\n" "$DUPLEX" "$ZFOLDING" "$SIDEWAYS" "$SADDLESTITCH" >&2 ; exit 1 ;;
  esac

  # Configure dots spacing
  case "$TEXTDOTDISTANCE" in
    220) INIT+=,TD1 ;;
    250) INIT+=,TD0 ;;
    320) INIT+=,TD2 ;;
    *)   printf "ERROR: unsupported '%s' text dot distance\n" "$TEXTDOTDISTANCE" >&2 ; exit 1 ;;
  esac
  case "$GRAPHICDOTDISTANCE" in
    160) INIT+=,GD2 ;;
    200) INIT+=,GD0 ;;
    250) INIT+=,GD1 ;;
    *)   printf "ERROR: unsupported '%s' graphic dot distance\n" "$GRAPHICDOTDISTANCE" >&2 ; exit 1 ;;
  esac

  # Currently unused, implemented in software
  case "$HWPAGENUMBER" in
    None|'')     INIT+=,PN0 ;;
    Top)         INIT+=,PN1 ;;
    TopLeft)     INIT+=,PN2 ;;
    TopRight)    INIT+=,PN3 ;;
    Bottom)      INIT+=,PN4 ;;
    BottomLeft)  INIT+=,PN5 ;;
    BottomRight) INIT+=,PN6 ;;
    *)   printf "ERROR: unsupported %s page number\n" "$HWPAGENUMBER" >&2 ; exit 1 ;;
  esac

  echo "$INIT"
}
