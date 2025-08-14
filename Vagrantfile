# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure("2") do |config|
  # The most common configuration options are documented and commented below.
  # For a complete reference, please see the online documentation at
  # https://docs.vagrantup.com.

  # Every Vagrant development environment requires a box. You can search for
  # boxes at https://vagrantcloud.com/search.
  config.vm.box = "bento/ubuntu-22.04"
  
  config.vm.define "dbserver" do |dbserver|
    dbserver.vm.network "private_network", ip: "10.10.10.10"
    dbserver.vm.synced_folder "databaseVM", "/vagrant"
    dbserver.vm.provision "shell", path: "build-database.sh"
  end

  config.vm.define "apiserver" do |apiserver|
    apiserver.vm.hostname = "apiserver"

    apiserver.vm.network "private_network", ip: "192.168.33.10"
    apiserver.vm.synced_folder "apiVM", "/vagrant"
    apiserver.vm.provision "shell", path: "build-api.sh"
  end
  config.vm.define "webserver" do |webserver|

    webserver.vm.network "private_network", ip: "192.168.30.11"
    webserver.vm.synced_folder "frontendVM", "/vagrant"
    webserver.vm.provision "shell", path: "build-web.sh"
  end
end
