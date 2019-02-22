/ip hotspot profile
add dns-name=connect.accionet.cl hotspot-address=10.5.50.1 html-directory=master_hotspot login-by=http-chap,trial \
    name=hsprof1 trial-uptime-reset=15m
/ip hotspot user profile
set [ find default=yes ] idle-timeout=15m mac-cookie-timeout=1m on-logout=":local macAddress \$\"mac-address\";\r\
    \n:local descarga \$\"bytes-out\";\r\
    \n:local carga \$\"bytes-in\";\r\
    \n:local tiempo \$\"uptime-secs\";\r\
    \n:tool fetch url=http://mrmeeseek.herokuapp.com/session/new http-method=post http-data=\"payload={\\\"macAddress\
    \\\":  \\\" \$macAddress\\\" ,  \\\"bytesOut\\\": \\\"\$descarga\\\"  ,  \\\"bytesIn\\\": \\\"\$carga\\\" ,  \\\"s\
    essionTime\\\": \\\"\$tiempo\\\" ,  \\\"placeId\\\": $PLACE-ID$}\""
/ip pool
add name=hs-pool ranges=10.5.48.1-10.5.50.0,10.5.50.2-10.5.51.254
/ip dhcp-server
add address-pool=hs-pool disabled=no interface=hotspot_bridge lease-time=1h name=dhcp2
/ip hotspot
add address-pool=hs-pool addresses-per-mac=1 disabled=no idle-timeout=15m interface=hotspot_bridge name=hotspot1 \
    profile=hsprof1
/ip address
add address=10.5.50.1/22 comment="hotspot network" interface=hotspot_bridge \
    network=10.5.48.0
/ip dhcp-server network
add address=10.5.48.0/22 comment="hotspot network" gateway=10.5.50.1
/ip dns
set servers=8.8.8.8,8.8.4.4
/ip firewall filter
add action=passthrough chain=unused-hs-chain comment="place hotspot rules here" disabled=yes
/ip firewall nat
add action=passthrough chain=unused-hs-chain comment="place hotspot rules here" disabled=yes
add action=masquerade chain=srcnat comment="masquerade hotspot network" \
    src-address=10.5.48.0/22
/ip hotspot walled-garden
add dst-host=*herokuapp*
add dst-host=code.jquery.com
add dst-host=s3.amazonaws.com
