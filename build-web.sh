apt-get update
apt-get install -y curl
# Install NVM
export NVM_DIR="$HOME/.nvm"
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
# Load NVM into the current shell
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
# Install Node.js v20 (LTS)
nvm install 20
# Use Node v20
nvm use 20
# Install frontend deps
cd /vagrant/
npm install
npm install
nohup npm run dev > server.log 2>&1 & 