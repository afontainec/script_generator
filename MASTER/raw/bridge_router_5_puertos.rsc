/interface bridge
add name=hotspot_bridge
/interface bridge port
add bridge=hotspot_bridge interface=wlan1 trusted=yes
add bridge=hotspot_bridge interface=ether3 trusted=yes
add bridge=hotspot_bridge interface=ether4 trusted=yes
add bridge=hotspot_bridge interface=ether5 trusted=yes
