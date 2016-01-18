#! /bin/sh
# /etc/init.d/media-proxy

# The following part always gets executed.
echo "This part always gets executed"
ROOT=/home/pi/firetv

# The following part carries out specific functions depending on arguments.
case "$1" in
  start)
    cd $ROOT
    node client/ &
    echo "media-proxy is alive"
    cd - 
    ;;
  stop)
    pkill -9 node # will kill all node
    ;;
  *)
    echo "Usage: /etc/init.d/media-proxy {start|stop}"
    exit 1
    ;;
esac

exit 0