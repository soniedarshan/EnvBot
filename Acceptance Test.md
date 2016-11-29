**GIVEN:** Private chat with bot or Bot is mentioned in the message

## Usecase 1
```
WHEN: User wants to generate dockerfile for a valid public github repo link, 

Type:
dockerfile repo_link 
or 
docker file repo_link  

Valid repo_link format:
Clone with HTTPS link of github repo
github.com/user_name/repo_name
www.github.com/user_name/repo_name
https://github.com/user_name/repo_name
https://www.github.com/user_name/repo_name

THEN: Snippet of Docker file is posted as a message.

Tested Examples: 
dockerfile https://github.com/rchakra3/wolf
docker file https://github.com/tjunnone/npm-check-updates
dockerfile https://github.com/akshat-shah/python-test
docker file https://github.com/akshat-shah/DockerizeMe
```
```
WHEN: User wants to generate dockerfile for a valid public github repo link and DockerizeMe does not find files in the github repo required to create docker file
THEN: Error "DockerizeMe cannot find the required files in the repository to create DockerFile." as a message.
```
```
WHEN: User wants to generate dockerfile but provides incorrect repo link in wrong format
THEN: Error "Can I have a valid URL(i.e., belonging to a GitHub repository)?" as a message.
```
```
WHEN: User wants to generate dockerfile but provides repo link that does not exist or is private
THEN: Bot ignores such requests and does not reply.
```

## Usecase 2
```
WHEN: User wants Docker images of popular technology stacks and user knows available technology stacks with the bot.
Type - 
request docker image technology_stack_name
THEN: Bot replies with the docker commands to pull and run the image of requested technology stack.
Tested Examples-
request docker image python
request docker image 2. mean
request docker image 6.redis
```
```
WHEN: User wants Docker images of popular technology stacks and user does not know about available technology stack
Type - 
request docker image
THEN: Bot replies with a list of available images of technology stack.
```
```
WHEN: User wants Docker images of popular technology stacks and requests an invalid or unavailable technology stack.
THEN: Bot replies with error message "Sorry. Docker Image Unavailable" aloing with a list of available technology stacks.
```
