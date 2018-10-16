
# Clean and remove Docker images 
echo "Clean and remove docker images"
docker rm -f $(docker ps -aq)
docker rmi -f $(docker images -a q)
echo "./Clean and remove docker images"

# Teardown network
echo "Teardown network" 
cd basic-network
./teardown.sh
echo "./Teardown network"

# Build and compile chaincode
echo "Build and compile chaincode"
cd ../chaincode/consultant-app
go build 
echo "./Build and compile chaincode"

# Start netowork setup 
echo "Start network setup"
cd ../../consultant-app
./startFabric.sh
echo "./Start network setup"

# Install necessary packages
echo "Install necessary packages" 
npm install
echo "./Install necessary packages"

# Register admin to network 
echo "Register admin to network"
node registerAdmin.js
echo "./Register admin to network"

# Register user to network 
echo "Register user to network"
node registerUser.js
echo "./Register user to network"

# Start App
echo "Start App"
node server.js 
echo "./Start App"

