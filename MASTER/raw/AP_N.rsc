/ip dhcp-server lease
add address=$ADD-AP$ allow-dual-stack-queue=no mac-address=$MAC-AP$ server=dhcp2

/ip hotspot ip-binding
add address=$ADD-AP$ mac-address=$MAC-AP$ to-address=$ADD-AP$ type=bypassed

/tool netwatch
add down-script=":tool fetch  url=http://mrmeeseek.herokuapp.com/network_device/\
    set-up-status/$PLACE-ID$/$ADD-AP$/f http-method=post;" host=$ADD-AP$ \
    up-script=":tool fetch  url=http://mrmeeseek.herokuapp.com/network_device/se\
    t-up-status/$PLACE-ID$/$ADD-AP$/t http-method=post;"
