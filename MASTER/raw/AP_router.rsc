/interface wireless
set [ find default-name=wlan1 ] disabled=no mode=ap-bridge ssid="$SSID$"
/interface wireless security-profiles
set [ find default=yes ] supplicant-identity=MikroTik
