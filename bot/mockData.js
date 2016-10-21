"use strict";

module.exports = Object.freeze({
	'use-case-1' : "FROM ubuntu:14.04\nRUN sudo apt-get update\nRUN sudo apt-get install -y git\nRUN cd /src;pip install -r requirements.txt ",
	'use-case-2' : {
		'request docker image' : {
			"attachments" : [{
			"title" : 'Available Docker Images',
			"pretext" : '',
			"text" : '1. Python\n2. Mean\n3. Lamp',
			"mrkdwn_in" : ['text', 'pretext']
			}]
		},
		'request docker image python' : {
			"attachments" : [{
			"title" : 'Commands',
			"pretext" : 'You can enter the following commands to setup the docker image: ',
			"text" : '`docker pull python`\n`docker run -it python:2.7.12 /bin/bash`',
			"mrkdwn_in" : ['text', 'pretext']
			}]
		},
		'request docker image node' : {
			"attachments" : [{
			"title" : 'Available Docker Images',
			"pretext" : 'Sorry. Docker image unavailable.',
			"text" : '1. Python\n2. Mean\n3. Lamp',
			"mrkdwn_in" : ['text', 'pretext']
			}]
		}
	},
	'use-case-3' : 'docker pull dockerBot/ + dockerizeMe'
});
