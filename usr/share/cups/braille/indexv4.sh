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

if [ $FIRMWARE -ge 103000 ]
then
  # Firmware 10.30 and above support temporary parameters
  INIT=$'\033'D

  # Margins are implemented in software
  INIT+=TM0,BI0

  # Common options
  INIT+="$(commonOptions)"
  [ $? = 0 ] || exit 1

  # Paper size
  INIT+=,CH$PRINTABLETEXTWIDTH,LP$PRINTABLETEXTHEIGHT

  case $LINESPACING in
    500)  INIT+=,LS50 ;;
    1000) INIT+=,LS100 ;;
    *)
      echo "ERROR: unsupported $LINESPACING line spacing" >&2
      exit 1
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
      # Firmware 11.02.1 and above allow to make sure to be using a 8-dot table
      8) INIT+=,BT6 ;;
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
