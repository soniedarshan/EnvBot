#!/bin/bash

# Install DockerizeMe dependency - linguist
sudo apt-get -y update
sudo apt-get -y install build-essential curl m4 ruby texinfo libbz2-dev libcurl4-openssl-dev libexpat-dev libncurses-dev zlib1g-dev
sudo apt-get -y install python-setuptools python-pip
sudo apt-get -y install python-dev
sudo apt-get -y install libicu-dev libmagic-dev
sudo pip install linguist

# Install Node.JS and forever
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g forever

# Install git and clone repositories.
sudo apt-get -y install git
git config --global user.name "akshat-shah"

git clone https://github.com/akshat-shah/EnvBot.git
(cd ./EnvBot/bot && npm install)

git clone https://github.com/akshat-shah/DockerizeMe.git ./EnvBot/bot/DockerizeMe
(cd ./EnvBot/bot/DockerizeMe && git checkout DockerBot)
(cd ./EnvBot/bot/DockerizeMe && sudo pip install -r requirements.txt)
(cd ./EnvBot/bot/DockerizeMe && npm install)

# Run code ### TODO : Run directly from Ansible
(cd ./EnvBot/bot && forever start envBot.js)