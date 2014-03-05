#!/bin/bash

AGA_cfg_file="/home/webc/aga.conf"
AGA_int_file="/etc/network/interfaces"
AGA_int_ori_file="/etc/network/interfaces.ori"
AGA_resolv_file="/etc/resolv.conf"


AGA_net="unknown-net"
AGA_shop_id="unknown-shop"

. "$AGA_cfg_file"

AGA_has_eth0()
{
  ifconfig | grep -qs '^eth0'
}

AGA_dhcp_on()
{
  grep -qs 'iface eth0 inet dhcp' $AGA_int_file
}

AGA_has_network()
{
  netstat -rn | grep -qs '^0.0.0.0'
}

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
   address 172.$AGA_net.$AGA_shop_id.30
   netmask 255.255.255.128
   gateway 172.$AGA_net.$AGA_shop_id.1
	pre-up iptables-restore < /etc/iptables.conf
	ethernet-wol g
EOF
  echo nameserver 172.$AGA_net.$AGA_shop_id.1 > ${AGA_resolv_file}
  ifup eth0
  sleep 5
  if (arp-scan -q -arpspa=172.$AGA_net.$AGA_shop_id.30 172.$AGA_net.$AGA_shop_id.1 | grep -qs "172.$AGA_net.$AGA_shop_id.1") then 
    exit
  fi
fi

while (true); do
  for ((AGA_net=20; AGA_net<=29; AGA_net++)) do 
    for ((AGA_shop_id=1; AGA_shop_id<=254; AGA_shop_id++)) do
      if (arp-scan -q -arpspa=172.$AGA_net.$AGA_shop_id.30 172.$AGA_net.$AGA_shop_id.1 | grep -qs "172.$AGA_net.$AGA_shop_id.1") then
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
   address 172.$AGA_net.$AGA_shop_id.30
   netmask 255.255.255.128
   gateway 172.$AGA_net.$AGA_shop_id.1
	pre-up iptables-restore < /etc/iptables.conf
	ethernet-wol g

EOF
        echo nameserver 172.$AGA_net.$AGA_shop_id.1 > $AGA_resolv_file
        ifup eth0
        exit
      fi
    done
  done
done
