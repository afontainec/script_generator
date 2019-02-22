/ip pool
add name=dhcp_pool0 ranges=172.16.1.2-172.16.1.254
/ip dhcp-server
add address-pool=dhcp_pool0 disabled=no interface=ether2 lease-time=1h name=\
    dhcp1
/ip address
add address=172.16.1.1/24 comment="SUBNET ADMINISTRACION ACCIONET PUERTO 2" \
    interface=ether2 network=172.16.1.0

/ip dhcp-server network
add address=172.16.1.0/24 dns-server=8.8.8.8,8.8.4.4 gateway=172.16.1.1
/ip firewall nat
add action=masquerade chain=srcnat out-interface=wan