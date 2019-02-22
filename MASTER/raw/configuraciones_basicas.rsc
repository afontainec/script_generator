/system identity
set name=$PLACE-NAME$

/ system scheduler add name="Reboot Router Daily" on-event="/system reboot" start-date=jan/01/1970 start-time=07:00:00 interval=1d comment="" disabled=no

/ip service
set telnet disabled=yes
set ftp disabled=yes
set ssh disabled=yes
set api-ssl disabled=yes

/system clock
set time-zone-name=America/Santiago

