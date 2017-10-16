# The content of this file will be appended to the keyboard layout.
# The following is an example how to make Alt+j switch to to the next
# console and Alt+k switch to the previous console.

# Uncomment the following lines for Linux.  Notice that everything is
# replicated for all possible values of the modifiers shiftl, shiftr
# and ctrll (shiftl and shiftr are used for groups 1..4 of XKB and
# ctrll is used to fix the broken CapsLock when Linux console is in
# Unicode mode).

# alt keycode 36 = Incr_Console
# shiftl alt keycode 36 = Incr_Console
# shiftr alt keycode 36 = Incr_Console
# shiftr shiftl alt keycode 36 = Incr_Console
# ctrll alt keycode 36 = Incr_Console
# ctrll shiftl alt keycode 36 = Incr_Console
# ctrll shiftr alt keycode 36 = Incr_Console
# ctrll shiftr shiftl alt keycode 36 = Incr_Console
#
# alt keycode 37 = Decr_Console
# shiftl alt keycode 37 = Decr_Console
# shiftr alt keycode 37 = Decr_Console
# shiftr shiftl alt keycode 37 = Decr_Console
# ctrll alt keycode 37 = Decr_Console
# ctrll shiftl alt keycode 37 = Decr_Console
# ctrll shiftr alt keycode 37 = Decr_Console
# ctrll shiftr shiftl alt keycode 37 = Decr_Console

# For the same result on FreeBSD uncomment the following lines:

#  036   'j'    'J'    nl     nl     nscr   nscr   nl     nl      C
#  037   'k'    'K'    vt     vt     pscr   pscr   nl     nl      C
