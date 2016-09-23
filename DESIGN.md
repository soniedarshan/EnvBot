# Design Milestone

## Problem Statement

Setting up repositories from GitHub, is a common initial step in the development of most open-source softwares. This majorly involves setting up the environment with the required services, libraries and frameworks, in a non-conflicting way. This task can often be arduous and can cost the developer precious time and energy.

This is a problem because the software being developed will serve the same purpose on any platform it is designed for. However, the environment it will be developed in, will differ from platform to platform. This should not get in the way of what should otherwise be a seamless process for the development and subsequent production of the software. This is the problem we are trying to solve with EnvBot.

## Bot Description

EnvBot is a Slack-bot that will help solve the above problem by automating the creation of the required environment. It will parse a GitHub repository given by the user and port its dependencies into a Docker image. It will also give an option to build the Docker image and create a container on the local machine. Another task which EnvBot will be capable is of setting up environments using pre-defined Dockerfiles. 

Bots are generally used for small, simple and certain but laborious and time-consuming tasks. They help automate these tasks. Setting up an environment is one such time-consuming task, which involves the same set of commands, for different services, which don’t really change their names on a regular basis. Some services might require the user to type in long, complex commands on the terminal. If wrong, the command will either be rejected or might install something harmful to the setup. A bot can foolproof this process. Thus, EnvBot can be a good solution. 

## Design Sketches

* Wireframe Mockup:

![wireframe](https://media.github.ncsu.edu/user/5692/files/ffd8e468-8107-11e6-918d-065c4a481533)

* Storyboard

![storyboard](https://media.github.ncsu.edu/user/5692/files/61aae41a-8113-11e6-9f7d-61484c932073)

## Architecture Design


![Architechture Design](https://media.github.ncsu.edu/user/4504/files/f1820cfa-8107-11e6-8cd1-3d6d98547f4f)


**Application Interface** - User will communicate with the EnvBot through the Slack- either web application and the desktop based application. The application interface will communicate with EnvBot server when invoked. The interface also indirectly interacts with the underlying host machine once docker container is set up.

**Application Host/Local Machine** - When the user acknowledges to set up the environment, the docker image shall get executed on the local machine to create a docker container.

**Bot Server** - This will constitute the heart of the EnvBot. The server will be constantly running, and hearing for its invocation from slack application. Upon any request, it will run the Dockerize Me Instance in order to create the docker image. Also, upon additional user request, this component will communicate with the application host/local machine component to execute the docker image.

**Github REST API** - DockerizeMe instance within the remote bot server will make REST Api calls to Github in order to recognize the technology and thus create the Docker Image as the end product.

### Constraints

1. Bot uses a command line terminal and requires setting up of environment variables. This is not possible while using the service of bot from Slack mobile application. So, we assume that bot services will not be used on mobile app. 
2. Docker is a user-friendly layer on top of Linux Containers, a set of Linux kernel features allowing namespacing of file system configuration, network resources, process tables, and other kernel-mediated resources which were historically global. These features are very specific to Linux, and an application running in a Docker container is still interfacing directly with the host's Linux kernel (though it only has access to the subset of resources exposed to the namespaces in which it participates). Similarly, opcodes are run directly on the hardware with no emulation on virtualization in place, so hardware differences are not abstracted away either. Docker is thus not cross-OS (or cross-architecture) portable and therefore, makes our bot platform dependent. So, for our purpose, we assume that service of bot will be used only on single platform (probably Linux-based OS).
3. Bot will be event-driven. That is, it will be only running when hosted on owner’s local server on his machine, or it’s uploaded to a server where it can run 24–7 and anyone can access the bot’s functionality at any time.
4. Bot has the highest permission granted. Therefore, it can be added into any channel and anyone can use its services.

### Additional Patterns

1. **Explicit Invocation** - This would fit the most of the bot regime. The bot will not do anything till it has been asked. This would not be true for something like a sync bot or error reporting bot. But in our case, the bot will only start executing when someone mentions the bot and passes a github link. Hence our bot fits the explicit invocation pattern.  

2. **Main Program and Subprogram** - The bot would be the main program. When the bot receives a request from the user to set up an environment, it would call another service (Dockerize Me) and wait for it’s execution to complete. The service would return a response message which would be passed to the user. Hence this bot fits the main program and sub-program pattern. 



