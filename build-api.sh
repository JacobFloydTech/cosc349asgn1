apt-get update
# Install NVM

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
# Load NVM into the current shell
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

source "$NVM_DIR/nvm.sh"

nvm install 20
# Use Node v20
nvm use 20
# Install frontend deps
cd /vagrant/
npm install
nohup node index.js > server.log 2>&1 & 