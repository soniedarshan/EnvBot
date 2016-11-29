## Usecase 1
```
Given: Private chat with bot or Bot is mentioned in the message

When: User wants to generate dockerfile for a valid public github repo link, type-

dockerfile repo_link or docker file repo_link  

Valid repo_link format: Clone with HTTPS link of github repo or github.com/user_name/repo_name or www.github.com/user_name/repo_name or 
https://github.com/user_name/repo_name or https://www.github.com/user_name/repo_name

Then: Snippet of Docker file is posted as a message.

Tested Examples: 
dockerfile https://github.com/rchakra3/wolf
docker file https://github.com/tjunnone/npm-check-updates
dockerfile https://github.com/akshat-shah/python-test
docker file https://github.com/akshat-shah/DockerizeMe
```
```
Given: Private chat with bot or Bot is mentioned in the message
When: User wants to generate dockerfile for a valid public github repo link and DockerizeMe does not find files in the github repo required to create docker file
Then: Error "DockerizeMe cannot find the required files in the repository to create DockerFile." as a message.
```
```
Given: Private chat with bot or Bot is mentioned in the message
When: User wants to generate dockerfile but provides incorrect repo link in wrong format
Then: Error "Can I have a valid URL(i.e., belonging to a GitHub repository)?" as a message.
```
```
Given: Private chat with bot or Bot is mentioned in the message
When: User wants to generate dockerfile but provides repo link that does not exist or is private
Then: Bot ignores such requests and does not reply.
```
