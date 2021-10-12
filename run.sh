#!/bin/bash

docker-compose -f ./redis.yaml down
docker-compose -f ./redis.yaml up -d

now=$(date +"%T")
echo "[$now] Running"

