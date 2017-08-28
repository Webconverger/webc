#!/bin/sh

if \
    [ -x /etc/console-setup/cached_setup_keyboard.sh ] \
        && /etc/console-setup/cached_setup_keyboard.sh
then
    :
else
    if [ -f /etc/default/locale ]; then
        # In order to permit auto-detection of the charmap when
        # console-setup-mini operates without configuration file.
        . /etc/default/locale
        export LANG
    fi
    setupcon -k
fi
