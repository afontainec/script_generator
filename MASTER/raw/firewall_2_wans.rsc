/ip firewall filter
add action=accept chain=input comment="Allow API for monitor device" dst-port=8728 protocol=\
    tcp
add action=accept chain=input comment="defconf: accept established,related,untracked" \
    connection-state=established,related,untracked
add action=drop chain=input comment="defconf: drop invalid" connection-state=invalid
add action=accept chain=input comment="defconf: accept ICMP" protocol=icmp
add action=accept chain=forward comment="defconf: accept in ipsec policy" ipsec-policy=\
    in,ipsec
add action=accept chain=forward comment="defconf: accept out ipsec policy" ipsec-policy=\
    out,ipsec
add action=fasttrack-connection chain=forward comment="defconf: fasttrack" connection-state=\
    established,related
add action=accept chain=forward comment="defconf: accept established,related, untracked" \
    connection-state=established,related,untracked
add action=drop chain=forward comment="defconf: drop invalid" connection-state=invalid
add action=drop chain=forward comment="defconf:  drop all from WAN not DSTNATed" \
    connection-nat-state=!dstnat connection-state=new  in-interface=WAN1
add action=drop chain=forward comment="defconf:  drop all from WAN not DSTNATed" \
    connection-nat-state=!dstnat connection-state=new  in-interface=WAN2
