# REPORT MILESTONE

### Problem Statement

Setting up project repositories from GitHub is a common initial step in the development of most open-source softwares. This mainly involves setting up the environment with the required services, libraries and frameworks. This task can often be difficult and can cost the developer precious time and energy. **DockerBot** solves this problem by providing the accurate commands for the creation of the Docker files and images for the required environment.

### The primary features of DockerBot

1. Make use of modified [DockerizeMe](https://github.com/akshat-shah/DockerizeMe/tree/DockerBot) to generate Dockerfile from a given repository.
2. Used [docker](https://www.docker.com/) to create and build docker containers and image and pushed them on a private bot account [Docker Hub](hub.docker.com). 
3. Made available commands to setup popular environments and technological stacks present on docker registry.

###Screenshots

![Help](https://media.github.ncsu.edu/user/4504/files/1ba5e818-ba41-11e6-8b39-46ced39b2395)

### Reflection on development process & project

[TODO]

### Limitations & Future Work

1. Upon requests for creation of docker images for a given github repository, the bot currently creates a docker image and pushes it on its own docker hub account. This can be changed to give a more personalized experience by uploading it to the requestor's docker account instead.
2. Create a private Database for the bot to store the list of images generated in the past to avoid duplication of work.
3. Automatically add images for popular stacks and languages instead of manually adding commands. 
