log(){
  now=$(date +"%T")
  echo "[$now] $@"
}

log "Building seawise-backend"
rm -rf ./backend/node_modules
rm -rf ./client/node_modules
docker build -t seawise-manager .

log "AWS login"
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 351636776414.dkr.ecr.us-east-1.amazonaws.com

log "Tagging"
docker tag seawise-manager:latest 351636776414.dkr.ecr.us-east-1.amazonaws.com/seawise-manager:latest

log "Pushing..."
docker push 351636776414.dkr.ecr.us-east-1.amazonaws.com/seawise-manager:latest