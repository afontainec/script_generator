/ip dhcp-server lease
add address=10.5.49.101 allow-dual-stack-queue=no mac-address=$MAC_AP2$ server=dhcp2

/ip hotspot ip-binding
add address=10.5.49.101 mac-address=$MAC_AP2$ to-address=10.5.49.101 type=bypassed

/tool netwatch
add down-script=":tool fetch  url=http://mrmeeseek.herokuapp.com/network_device/\
    set-up-status/$PLACE-ID$/10.5.49.101/f http-method=post;" host=10.5.49.101 \
    up-script=":tool fetch  url=http://mrmeeseek.herokuapp.com/network_device/se\
    t-up-status/$PLACE-ID$/10.5.49.101/t http-method=post;"
