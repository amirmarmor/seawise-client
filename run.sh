#!/bin/bash
sudo rm -rf docker
docker-compose down --remove-orphans
if [ "$1" == 'build' ]
then
  docker-compose up --build
else
  docker-compose up
fi

now=$(date +"%T")
echo "[$now] Running"

