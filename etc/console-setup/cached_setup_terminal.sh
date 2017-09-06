#!/bin/sh

{ :
printf '\033%%G' 
} < /dev/tty${1#vcs} > /dev/tty${1#vcs}
