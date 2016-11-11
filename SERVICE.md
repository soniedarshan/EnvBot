Link to Screencast - https://youtu.be/8eatUh3KyWg   
Link to Worksheet - https://github.ncsu.edu/dasoni/EnvBot/blob/master/WORKSHEET.md  
Link to Trello cards - https://trello.com/b/xm0RHPxd/dockerbot  
Link to Bot code - https://github.ncsu.edu/dasoni/EnvBot/tree/master/bot   
Link to DockerizeMe - https://github.com/alt-code/DockerizeMe   

##Internal work flow of each usecase

### Use Case 1
1. Take input from user and parse for github url.
2. Call DocerizeMe running on local server by passing the extracted github url.
3. DockerizeMe generates DockerFile for the github repo.
4. We process the DockerFile and display it in code snippet format.

### Use Case 2
1. Take input from user for desired technology stack. If user does not enter any technology stack with the request command, then present a list of available technology stack to choose from. User then requests his desired technology stack with request command.
2. Parse user's choice and search for Docker image in database which contains official images on Docker Hub.
3. Generate a pull command with the Docker image and notifies the user. The user can directly copy the pull command and request docker image on own.

### Use Case 3
1. Take input from user and parse for github url.
2. Call DocerizeMe running on local server by passing the extracted github url.
3. DockerizeMe generates DockerFile for the github repo.
4. We call bash scripts to copy the generated DockerFile into github repo (cloned on local machine by DockerizeMe).
5. Another bash script runs on local server to generate docker image for the github repo. (Building docker image may take time)
6. After docker image is created, local server authenticates login credentials with Docker Hub.
7. After successful authentication, the generated docker image is pushed on docker hub by automatically running a bash script.
8. The bot notifies the user by posting a pull command with the docker image hosted on docker hub.
