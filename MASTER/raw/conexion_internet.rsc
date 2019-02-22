/interface ethernet
set [ find default-name=ether1 ] name=wan
/ip dhcp-client
add comment="CLIENTE DE INTERNET POR PUERTO 1" dhcp-options=hostname,clientid \
    disabled=no interface=wan

