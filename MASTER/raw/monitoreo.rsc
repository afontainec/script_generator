/system scheduler
add interval=1m name=pollingNotification on-event="/tool fetch http-method=post http-content-type=\"application/json\" http-data\
    =\"{\\\"place_id\\\":\\\"$PLACE-ID$\\\",\\\"ip\\\":\\\"0.0.0.0\\\",\\\"is_up\\\":\\\"true\\\"}\" url=\"https://mrmeeseek.he\
    rokuapp.com/network_device/set-up-status/polling/\"" policy=\
    ftp,reboot,read,write,policy,test,password,sniff,sensitive,romon start-time=startup
