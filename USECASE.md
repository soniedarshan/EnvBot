### Use Case

Use Case 1
```
Use Case: Generate a DockerFile from Github repo
1 Preconditions
   User must have code repo on Github.
2 Main Flow
   User will request DockerFile for code repo on Github [S1]. Bot creates DockerFile and posts snippet of its contents [S2].
3 Subflows
  [S1] User types dockerfile command followed by web address of Github repo.
  [S2] Bot will use DockerizeMe and generate a DockerFile for the Github repo.
4 Alternative Flows
  [E1] DockerFile can't be generated if Github repository is empty or has only .md files.
```

Use Case 2
```
Use Case: Return Docker Image for pre-defined popular technology environments.
1 Preconditions
   DockerHub should have base images available.
2 Main Flow
   User will request technology environment and bot will return a list of available enivronments [S1]. User will type command with his choice and bot will post docker command with image of technology environment [S2]. User will request technology stack with his requirement and bot will post docker command for image of technology enivronment [S3].
3 Subflows
  [S1] User types 'request docker' command to request technology environment and bot will return a list of avilable technology stack in its database.
  [S2] User specifies his choice by typing stack_name as shown in the list and bot will post a docker command to pull the image of that stack from DockerHub.
  [S3] User already knows which choices are available and directly requests that environment by typing 'request docker stack_name'. Bot will post a docker command to pull the image of that stack from DockerHub
4 Alternative Flows
  [E1] Reuqested stack not found or is not available.
```

Use Case 3
```
Use Case: Build Docker image from Github repo
1 Preconditions
   User must have code repository on Github 
2 Main Flow
   User will request Docker image for code repo on Github [S1]. Bot creates Docker image and posts docker command to pull the image from DockerHub [S2].
3 Subflows
  [S1] User types dockerimage command followed by web address of Github repo.
  [S2] Bot will generate and add the DockerFile and return a DockerHub image address with pull command. 
4 Alternative Flows
  [E1] Image build fails.
```
