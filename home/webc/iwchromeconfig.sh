#!/bin/bash

# The default location of the userChrome.css file
userChrome="/etc/iceweasel/profile/chrome/userChrome.css"

# Test we have a command to follow
if [ -z $1 ]; then
   exit
fi

# Split the options
ARGS=`echo $1 | sed '{1,$ s/,/ /g}'`

# Process all the options
for OPT in $ARGS; do

   # Check the option to set
   case $OPT in
      nosearch)
         echo '#search-container { display: none !important; }' >> $userChrome
      ;;
      noaddress)
         echo '#urlbar-container { visibility: collapse; } #search-container { display: none !important; }' >> $userChrome
      ;;
      fullscreen)
         echo '#navigator-toolbox { display: none !important; }' >> $userChrome
      ;;
   esac

done
