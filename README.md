# CSC-510-Project

## Problem Statement

Setting up repositories from GitHub is a common initial step in the development of most open-source softwares. This majorly involves setting up the environment with the required services, libraries and frameworks, in a non-conflicting way. This task can often be arduous and can cost the developer precious time and energy.

This is a problem because the software being developed will serve the same purpose on any platform it is designed for. However, the environment it will be developed in, will differ from platform to platform. This should not get in the way of what should otherwise be a seamless process for the development and subsequent production of the software. This is the problem we are trying to solve with EnvBot.

## Bot Description

EnvBot is a Slack-bot that helps solve the above problem by automating the creation of the required environment. It has the following use-cases:
* It parses a GitHub repository given by the user and creates a Docker File. 
* It adds the generated Docker file to the cloned version of the requested repository on the Bot server. DockerHub then begins to create a Docker Image upon noticing this, which is later available to download for the user, as prompted by the bot. 
* It also sets up environments of popular tech stacks using pre-defined Dockerfiles. 

Bots are generally used for small, simple and certain but laborious and time-consuming tasks. They help automate these tasks. Setting up an environment is one such time-consuming task, which involves the same set of commands, for different services, which don’t really change their names on a regular basis. Some services might require the user to type in long, complex commands on the terminal. If wrong, the command will either be rejected or might install something harmful to the setup. A bot can foolproof this process. Thus, EnvBot can be a good solution. 

## Screencast

Link to the screencast - https://youtu.be/fms7xrIKDgI

### Limitations & Future Work

1. Upon requests for creation of docker images for a given github repository, the bot currently creates a docker image and pushes it on its own docker hub account. This can be changed to give a more personalized experience by uploading it to the requestor's docker account instead.
2. Create a private Database for the bot to store the list of images generated in the past to avoid duplication of work.
3. Automatically add images for popular stacks and languages instead of manually adding commands. 
