#!/bin/bash

. "/home/webc/aga-mod.conf"

AGA_cfg_srv="shops.amag.ru"
AGA_action_url="http://${AGA_cfg_srv}/kiosk/action?config=$AGA_mode"
AGA_action_file="/etc/webc/aga-action"

sleep 1h
while (true); do
  if curl -f -o "$AGA_action_file.tmp" --retry 3 "$AGA_action_url"
  then
    sed  's/^\xef\xbb\xbf//' $AGA_action_file.tmp > $AGA_action_file
    . $AGA_action_file
  fi
  test -e "$AGA_action_file" && rm -f "$AGA_action_file"
  test -e "$AGA_action_file.tmp" && rm -f "$AGA_action_file.tmp"
  sleep 30
done
