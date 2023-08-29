#!/bin/bash

echo "cd to root directory..."
cd root

echo "whoami..."
whoami

echo "pwd..."
pwd
sudo yum upgrade -y

## DOCKER ##
## https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-centos-7

curl -fsSL https://get.docker.com/ | sh
sudo systemctl start docker
sudo systemctl status docker
sudo systemctl status docker

# Install gitlab runner
curl -L "https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.rpm.sh" | sudo bash
sudo yum install gitlab-runner
systemctl status gitlab-runner

# Register runner
sudo gitlab-runner register -n --url https://git.cardiff.ac.uk/ --registration-token GR1348941_5kvp9shJRq7Dt1TwGy8 --executor docker --description "Streetwave Deployment Runner" --docker-image "docker:stable" --tag-list deployment --docker-privileged 

# Add deployer user to docker group
sudo adduser deployer
sudo usermod -aG docker deployer