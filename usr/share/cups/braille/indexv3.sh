#
# Copyright (c) 2015-2018 Samuel Thibault <samuel.thibault@ens-lyon.org>
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

. /usr/share/cups/braille/index.sh

# Whether lengths should be given to the embosser in In or Mm
PAPERLENGTH=$(getAttribute IndexPaperLength)

if [ $FIRMWARE -ge 103000 ]
then
  # Firmware 10.30 and above support temporary parameters
  INIT=$'\033'D

  # Margins are implemented in software
  INIT+=TM0,BI0

  # Trying to disable banner page seems to pose problems
  #INIT+=,BP

  # Common options
  INIT+="$(commonOptions)"
  [ $? = 0 ] || exit 1

  # Paper size
  case "$PAPERLENGTH" in
    In)
      INIT+=,PW$(mmToIndexIn $PAGEWIDTH),PL$(mmToIndexIn $PAGEHEIGHT)
      ;;
    Mm)
      INIT+=,PW$(($PAGEWIDTH / 100)),PL$(($PAGEHEIGHT / 100))
      ;;
    *) ;;
  esac

  case $LINESPACING in
    250)  INIT+=,LS0 ;;
    375)  INIT+=,LS1 ;;
    450)  INIT+=,LS2 ;;
    475)  INIT+=,LS3 ;;
    500)  INIT+=,LS4 ;;
    525)  INIT+=,LS5 ;;
    550)  INIT+=,LS6 ;;
    750)  INIT+=,LS7 ;;
    1000) INIT+=,LS8 ;;
    *)
      if [ $FIRMWARE  -lt 120130 ]
      then
	echo "ERROR: unsupported $LINESPACING line spacing, please upgrade firmware to at least 12.01.3" >&2
	exit 1
      fi
      if [ $LINESPACING -lt 100 ]
      then
	echo "ERROR: too small $LINESPACING line spacing" >&2
	exit 1
      fi
      INIT+=,LS$(($LINESPACING / 10))
      ;;
  esac

  if [ $LIBLOUIS1 != None -o \
       $LIBLOUIS2 != None -o \
       $LIBLOUIS3 != None -o \
       $LIBLOUIS4 != None ]
  then
    # software-translated, enforce a 6-dot table if needed
    case $TEXTDOTS in
      # Firmware 11.02.1 and above allow to make sure to be using a 6-dot table
      6) INIT+=,BT0 ;;
      # Hoping the user properly configured an 8-dot table
      8) ;;
      *)   echo "ERROR: unsupported $TEXTDOTS dots" >&2 ; exit 1 ;;
    esac
  else
    # Hoping the user configured a table with appropriate number of dots
    INIT+=,BT$TABLE
  fi

  # roger
  INIT+=";"
else
  # No support for temporary parameters.  Hoping that the user configured CUPS
  # the same way as the embosser.
  INIT=
fi
