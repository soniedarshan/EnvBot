# REPORT MILESTONE

### Problem Statement

Setting up project repositories from GitHub is a common initial step in the development of most open-source softwares. This mainly involves setting up the environment with the required services, libraries and frameworks. This task can often be difficult and can cost the developer precious time and energy. **DockerBot** solves this problem by providing the accurate commands for the creation of the Docker files and images for the required environment.

### The primary features of DockerBot

1. Make use of modified [DockerizeMe](https://github.com/akshat-shah/DockerizeMe/tree/DockerBot) to generate Dockerfile from a given repository.
2. Used [docker](https://www.docker.com/) to create and build docker containers and image and pushed them on a private bot account [Docker Hub](hub.docker.com). 
3. Made available commands to setup popular environments and technological stacks present on docker registry.

### Screenshots

#### Help Command
![Help](https://media.github.ncsu.edu/user/4504/files/1ba5e818-ba41-11e6-8b39-46ced39b2395)
#### Help Page
![Help Page](https://media.github.ncsu.edu/user/4504/files/3bbbb830-ba41-11e6-84d0-fb6c131388cf)
#### Use Case 1
![Use Case 1](https://media.github.ncsu.edu/user/4504/files/500ad794-ba41-11e6-8250-2e63d9a4aeb3)
#### Use Case 2
![Use Case 2](https://media.github.ncsu.edu/user/4504/files/6170fa0e-ba41-11e6-897c-1c6d2476249e)
#### Use Case 3
![Use Case 3](https://media.github.ncsu.edu/user/4504/files/77ab62fa-ba41-11e6-9a76-28574f86b73e)

### Demo Video

[Demo Video](https://youtu.be/G8r2dEbfXQ4)

### Reflection on development process & project
The development process followed for this project was iterative. Iterative development prescribes the construction of initially small but ever larger portions of a software project to help all those involved to uncover important issues early before problems or faulty assumptions can lead to disaster. Our development process started with exploring various use cases of DockerizeMe and thinking of how DockerizeMe can be integrated with a slackbot. After looking at the capabilities of DockerizeMe, mini use-cases were implemented woth mock data and slack interactions were created supoorted by Selenium testing of the same. The initial design was shaped into final architecutre for a full-fledged systemp to accomplish our project goals ,i.e., the three use-cases. With the implementation of minor toy-use cases in the beginning, we were able to eliminate bad design choices early in our development phase. The fully designed system was tested using mock data and later was polished for the deployment on local server. At the end, the bot was deployed on AWS server by following automated deployment process.  

Our four member team collaborated with each other and did individual's best to complete the whole project. All project requirements and pending tasks were mapped out using Trello cards as well as worksheet. The use of such task tracking techniques was vey useful in anticipating effor requirements and communicationg for task delegation among the team members.
The milestone delivery format adapted by professor made sure that all the software components were delivered on time with efficient project planning.


### Limitations & Future Work

1. Upon requests for creation of docker images for a given github repository, the bot currently creates a docker image and pushes it on its own docker hub account. This can be changed to give a more personalized experience by uploading it to the requestor's docker account instead.
2. Create a private Database for the bot to store the list of images generated in the past to avoid duplication of work.
3. Automatically add images for popular stacks and languages instead of manually adding commands. 
