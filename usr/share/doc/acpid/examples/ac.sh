#!/bin/sh
# /etc/acpid/ac.sh
# Detect loss of AC power and regaining of AC power, and take action
# appropriatly.

# On my laptop anyway, this script doesn't not get different parameters for
# loss of power and regained power. So, I have to use a separate program to
# tell what the adapter status is.

# This uses the spicctrl program for probing the sonypi device.
BACKLIGHT=$(spicctrl -B)

if on_ac_power; then
        # Now on AC power.

        # Tell longrun to go crazy.
        longrun -f performance
        longrun -s 0 100

        # Turn up the backlight unless it's up far enough.
        if [ "$BACKLIGHT" -lt 108 ]; then
                spicctrl -b 108
        fi
else
        # Now off AC power.

        # Tell longrun to be a miser.
        longrun -f economy
        longrun -s 0 50 # adjust to suite..

        # Don't allow the screen to be too bright, but don't turn the
        # backlight _up_ on removal, and don't turn it all the way down, as
        # that is unusable on my laptop in most conditions. Adjust to
        # taste.
        if [ "$BACKLIGHT" -gt 68 ]; then
                spicctrl -b 68
        fi
fi

