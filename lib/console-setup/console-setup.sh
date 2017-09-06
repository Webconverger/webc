#!/bin/sh

do_configure=no
case "`uname 2>/dev/null`" in
    *FreeBSD*)
        do_configure=yes
        ;;
    *) # assuming Linux with udev

        # Skip only the first time (i.e. when the system boots)
        [ ! -f /run/console-setup/boot_completed ] || do_configure=yes
        mkdir -p /run/console-setup
        > /run/console-setup/boot_completed
        
        [ /etc/console-setup/cached_setup_terminal.sh \
              -nt /etc/default/keyboard ] || do_configure=yes
        [ /etc/console-setup/cached_setup_terminal.sh \
              -nt /etc/default/console-setup ] || do_configure=yes
        ;;
esac

if [ "$do_configure" = no ]; then
    :
else
    if [ -f /etc/default/locale ]; then
        # In order to permit auto-detection of the charmap when
        # console-setup-mini operates without configuration file.
        . /etc/default/locale
        export LANG
    fi
    setupcon --save
fi
