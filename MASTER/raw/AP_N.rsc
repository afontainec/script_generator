/ip dhcp-server lease
add address=$IP-AP$ allow-dual-stack-queue=no mac-address=$MAC-AP$ server=dhcp2

/ip hotspot ip-binding
add address=$IP-AP$ mac-address=$MAC-AP$ to-address=$IP-AP$ type=bypassed

/tool netwatch
add down-script=":tool fetch  url=http://mrmeeseek.herokuapp.com/network_device/\
    set-up-status/$PLACE-ID$/$IP-AP$/f http-method=post;" host=$IP-AP$ \
    up-script=":tool fetch  url=http://mrmeeseek.herokuapp.com/network_device/se\
    t-up-status/$PLACE-ID$/$IP-AP$/t http-method=post;"
