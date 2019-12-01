#!/bin/bash

# Installs shortcut to the browser on the desktop
# and dependencies

SCRIPT_PATH="$0";
WD=`pwd`

if([ -h "${SCRIPT_PATH}" ]) then
   while([ -h "${SCRIPT_PATH}" ]) do SCRIPT_PATH=`readlink "${SCRIPT_PATH}"`; done
fi
pushd . > /dev/null
cd `dirname ${SCRIPT_PATH}` > /dev/null
SCRIPT_PATH=`pwd`
popd > /dev/null

# Now we know where we are installed. Lets create the shortcut.
INSTALLDIR=${SCRIPT_PATH};
DESKTOP=~/Desktop;
ARCH=`/bin/uname -p`

SHORTCUT=openkiosk.desktop;

touch ${DESKTOP}/${SHORTCUT};
chmod a+rx ${DESKTOP}/${SHORTCUT};

echo "[Desktop Entry]"                            > ${DESKTOP}/${SHORTCUT};
echo "Encoding=UTF-8"                            >> ${DESKTOP}/${SHORTCUT};
echo "Version=8.0"                               >> ${DESKTOP}/${SHORTCUT};
echo "Type=Application"                          >> ${DESKTOP}/${SHORTCUT};
echo "Terminal=false"                            >> ${DESKTOP}/${SHORTCUT};
echo "Exec=$INSTALLDIR/openkiosk"                >> ${DESKTOP}/${SHORTCUT};
echo "Path=$INSTALLDIR/"                         >> ${DESKTOP}/${SHORTCUT};
echo "Icon=$INSTALLDIR/openkiosk.png"            >> ${DESKTOP}/${SHORTCUT};
echo "Name=OpenKiosk"                            >> ${DESKTOP}/${SHORTCUT};

function taskbarShortcut
{
  shortcuts=`/usr/bin/gsettings get org.gnome.shell favorite-apps | sed -e's:\[::g' -e's:\]::g'`;
  shortcuts="['${SHORTCUT}', $shortcuts]";
  /usr/bin/gsettings set org.gnome.shell favorite-apps "$shortcuts" > /dev/null 2>&1;
}

if [ -d /usr/share/applications ]; then
  if [ "$1" = "-i" ] && [ -f /usr/share/applications/${SHORTCUT} ]; then
    taskbarShortcut;
  else
    /usr/bin/gsettings get org.gnome.shell favorite-apps > /dev/null 2>&1;
    if [ $? -eq 0 ]; then
      sudo cp ${DESKTOP}/${SHORTCUT} /usr/share/applications/;
      taskbarShortcut;
    fi
  fi
fi

exit 0;

