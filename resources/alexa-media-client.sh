#! /bin/sh
# /etc/init.d/alexa-media-client

# The following part always gets executed.
ROOT=/home/pi/alexa-media-client

# The following part carries out specific functions depending on arguments.
case "$1" in
  start)
    (cd $ROOT; node client/ > /var/log/alexa-media-client.log)&
    echo "alexa-media-client is alive"
    ;;
  stop)
    pkill -9 node # will kill all node
    echo "alexa-media-client is dead"
    ;;
  *)
    echo "Usage: /etc/init.d/alexa-media-client {start|stop}"
    exit 1
    ;;
esac

exit 0