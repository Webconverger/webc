#!/bin/bash

. "/etc/webc/webc.conf"
AGA_cfg_file="/home/webc/aga.conf"
AGA_mod_file="/home/webc/aga-mod.conf"
AGA_int_file="/etc/network/interfaces"
AGA_int_ori_file="/etc/network/interfaces.ori"
AGA_resolv_file="/etc/resolv.conf"

AGA_cfg_file_cached="${live_image}/live/aga.conf"
AGA_mod_file_cached="${live_image}/live/aga-mod.conf"

AGA_net="unknown-net"
AGA_shop_id="unknown-shop"
AGA_ID=1
AGA_mode="kiosk"


AGA_update_cfg() {
  # if writable
  if touch ${live_image}
    then
      # Cache cmdline in case subsequent boots can't reach $config_url
      cp "$AGA_cfg_file" "$AGA_cfg_file_cached"
      logs "CONFIG: cached $(md5sum $AGA_cfg_file_cached) $(tr '\n' ' ' < $AGA_cfg_file_cached)"
      # Kicks off an upgrade
      mkfifo $upgrade_pipe
    else
     # ${live_image} could not be made writable (e.g. live version: booting
     # from an iso fs), so just use the new config downloaded
     # and skip all the other stuff below
     logs "CONFIG: Not a writable boot medium. Could not cache configuration nor upgrade."
  fi
}

AGA_has_eth0()
{
  /sbin/ifconfig | grep -qs '^eth0'
}

AGA_dhcp_on()
{
  grep -qs 'iface eth0 inet dhcp' $AGA_int_file
}

AGA_has_network()
{
  netstat -rn | grep -qs '^0.0.0.0'
}


# begin

# If we have a "cached" version of the configuration on disk,
# copy that to /etc/webc, so we can compare the new version with
# it to detect changes and/or use it in case the new download
# fails.
if test -s "$AGA_cfg_file_cached"
  then
    cp "$AGA_cfg_file_cached" "$AGA_cfg_file"
    logs "CONFIG: Applied cache $(md5sum $AGA_cfg_file)"
  else
    touch "$AGA_cfg_file"
    logs "CONFIG: No cache"
fi
if test -s "$AGA_mod_file_cached"
  then
    cp "$AGA_mod_file_cached" "$AGA_mod_file"
    logs "CONFIG: Applied cache $(md5sum $AGA_mod_file)"
  else
    touch "$AGA_mod_file"
    logs "CONFIG: No cache"
fi

. "$AGA_cfg_file"
. "$AGA_mod_file"

AGA_ip=30
if (test $AGA_mode = "showcase"); 
  then 
    AGA_ip=60
fi
AGA_ip=$(($AGA_ip+$AGA_ID-1))

while ! AGA_has_eth0; do
  sleep 1
done

if (! AGA_dhcp_on) then  # Always On (false), because we have live-boot :) 
  ifdown eth0 || cp -f "$AGA_int_ori_file" "$AGA_int_file" || echo -n > $AGA_resolv_file || ifup eth0
fi
sleep 20
if AGA_has_network; then
  echo AGA_net=\""unknown-net"\" > ${AGA_cfg_file}
  echo AGA_shop_id=\""unknown-shop"\" >> ${AGA_cfg_file}
  exit 
fi

if !(test $AGA_shop_id = "unknown-shop") then
  ifdown eth0
  cat > $AGA_int_file << EOF
# The loopback network interface
auto lo 
iface lo inet loopback

allow-hotplug eth0

iface eth0 inet static
   address 172.$AGA_net.$AGA_shop_id.$AGA_ip
   netmask 255.255.255.128
   gateway 172.$AGA_net.$AGA_shop_id.1
	pre-up iptables-restore < /etc/iptables.conf
	ethernet-wol g
EOF
  echo nameserver 172.$AGA_net.$AGA_shop_id.1 > ${AGA_resolv_file}
  ifup eth0
  sleep 5
  if (arp-scan -q -arpspa=172.$AGA_net.$AGA_shop_id.$AGA_ip 172.$AGA_net.$AGA_shop_id.1 | grep -qs "172.$AGA_net.$AGA_shop_id.1") then 
    AGA_update_cfg
    exit
  fi
fi

while (true); do
  for ((AGA_net=20; AGA_net<=29; AGA_net++)) do 
    for ((AGA_shop_id=0; AGA_shop_id<=255; AGA_shop_id++)) do
      if (arp-scan -q -arpspa=172.$AGA_net.$AGA_shop_id.$AGA_ip 172.$AGA_net.$AGA_shop_id.1 | grep -qs "172.$AGA_net.$AGA_shop_id.1") then
        echo AGA_net=\""$AGA_net"\" > ${AGA_cfg_file}
        echo AGA_shop_id=\""$AGA_shop_id"\" >> ${AGA_cfg_file}
        chmod 644 ${AGA_cfg_file}
        ifdown eth0
        cat > $AGA_int_file << EOF
# The loopback network interface
auto lo 
iface lo inet loopback

allow-hotplug eth0

iface eth0 inet static
   address 172.$AGA_net.$AGA_shop_id.$AGA_ip
   netmask 255.255.255.128
   gateway 172.$AGA_net.$AGA_shop_id.1
	pre-up iptables-restore < /etc/iptables.conf
	ethernet-wol g

EOF
        echo nameserver 172.$AGA_net.$AGA_shop_id.1 > $AGA_resolv_file
        ifup eth0
        AGA_update_cfg
        exit
      fi
    done
  done
done
