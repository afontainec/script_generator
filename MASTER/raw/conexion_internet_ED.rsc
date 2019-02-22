/interface ethernet
set [ find default-name=ether1 ] name=wan
/ip address
add address=$PUBLIC-IP$ comment="local address for dhcp lease" interface=wan
/ip route
add comment="wan gateway " distance=1 gateway=$ISP-GATEWAY$
