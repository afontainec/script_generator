/interface ethernet
set [ find default-name=ether1 ] name=WAN1

/interface lte
set [ find ] name=WAN2


/ip dhcp-client
add add-default-route=no comment=defconf dhcp-options=hostname,clientid \
    disabled=no interface=WAN1
add add-default-route=no dhcp-options=hostname,clientid disabled=no \
    interface=WAN2

/ip firewall mangle
add action=accept chain=prerouting dst-address=$ISP1-ADDRESS$ in-interface=\
    hotspot_bridge
add action=accept chain=prerouting dst-address=$ISP2-ADDRESS$ in-interface=\
    hotspot_bridge
add action=mark-connection chain=prerouting connection-mark=no-mark \
    in-interface=WAN1 new-connection-mark=ISP1_conn
add action=mark-connection chain=prerouting connection-mark=no-mark \
    in-interface=WAN2 new-connection-mark=ISP2_conn
add action=mark-connection chain=prerouting connection-mark=no-mark \
    dst-address-type=!local hotspot=auth in-interface=hotspot_bridge \
    new-connection-mark=ISP1_conn passthrough=yes per-connection-classifier=\
    src-address:2/0
add action=mark-connection chain=prerouting connection-mark=no-mark \
    dst-address-type=!local hotspot=auth in-interface=hotspot_bridge \
    new-connection-mark=ISP2_conn passthrough=yes per-connection-classifier=\
    src-address:2/1
add action=mark-routing chain=prerouting connection-mark=ISP1_conn \
    in-interface=hotspot_bridge new-routing-mark=to_ISP1
add action=mark-routing chain=prerouting connection-mark=ISP2_conn \
    in-interface=hotspot_bridge new-routing-mark=to_ISP2
add action=mark-routing chain=output connection-mark=ISP1_conn \
    new-routing-mark=to_ISP1
add action=mark-routing chain=output connection-mark=ISP2_conn \
    new-routing-mark=to_ISP2

/ip firewall nat
add action=masquerade chain=srcnat out-interface=WAN1
add action=masquerade chain=srcnat out-interface=WAN2

/ip firewall nat
add action=accept chain=pre-hotspot disabled=no dst-address-type=!local hotspot=auth

/ip route
add check-gateway=ping distance=1 gateway=$ISP1-GATEWAY$ routing-mark=to_ISP1
add check-gateway=ping distance=1 gateway=$ISP2-GATEWAY$ routing-mark=to_ISP2
add check-gateway=ping distance=1 gateway=$ISP1-GATEWAY$
add check-gateway=ping distance=2 gateway=$ISP2-GATEWAY$
