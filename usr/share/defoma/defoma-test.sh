#! /bin/sh

mkdir -p var/lib/defoma/scripts
mkdir -p usr/share/defoma/scripts
mkdir -p etc/defoma

cp -r /usr/share/defoma/* usr/share/defoma
cp /etc/defoma/*.subst-rule etc/defoma

SYSTEM="postscript\npspreview\npsprint\nx-postscript\nxfont"
for i in /var/lib/defoma/*.font-cache; do
  s=${i##*/}
  s=${s%.font-cache}
  if ! echo -e "$SYSTEM" | fgrep -q -x -e "$s"; then
    cp $i var/lib/defoma
  fi
done

echo "export DEFOMA_TEST_DIR=`pwd`; ${SHELL:-bash}"

