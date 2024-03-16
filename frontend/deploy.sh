#########################################
# 1. Build the react app
# 2. Copy the build folder to the vps
# 3. Restart the gateway
#########################################

# 1. Build the react app
npm run build

# 2. Copy the build folder to the vps
ROOT=root
VPS_IP=competitionmanager.be
scp -r build/index.html $ROOT@$VPS_IP:~/build/

# 3. Restart the gateway
# ssh $ROOT@$VPS_IP "docker-compose restart gateway"





