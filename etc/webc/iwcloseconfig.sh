#!/bin/bash

# Test we have a command to follow
if [ -z $1 ]; then
   exit
fi

# FireFox "fix" for the last tab not having a close 'X'
if [ $1 = 'activefix' -o $1 = 'everyfix' ]; then
   echo '.tabbrowser-tab[selected="true"] .tab-close-button { display: -moz-box !important; visbility: visible !important; }' >> /etc/iceweasel/profile/chrome/userChrome.css
fi

# Select the default mode : for webconverger this is 3 (on the strip)
iconset="3"

# Make sure the prefs are set correctly
if [ $1 = 'active' -o $1 = 'activefix' ]; then
   iconset="0"
elif [ $1 = 'every' -o $1 = 'everyfix' ]; then
   iconset="1"
elif [ $1 = 'none' ]; then
   iconset="2"
elif [ $1 = 'strip' ]; then
   iconset="3"
fi

# Inject the preference
for i in /etc/webc/iceweasel/extensions/webc*/defaults/preferences/prefs.js
do
	echo "pref(\"browser.tabs.closeButtons\", $iconset);" >> $i
done

