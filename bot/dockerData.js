"use strict";

module.exports = Object.freeze({
	// Commands for setting up MEAN stack.
	'python' : [
		'`docker pull python`',
		'`docker run -it python:2.7.12 /bin/bash`'
	],
	'mean' : [
		'`docker pull maccam912/meanjs`',
		'`docker run -i -t -p 80:3000 maccam912/meanjs bash`'
	],
	'lamp' : [
		'`docker pull reinblau/lamp`',
		'`docker run -it reinblau/lamp:5.6 /bin/bash`'
	],
	'ubuntu' : [
		'`docker pull ubuntu`',
		'`docker run -it ubuntu:14.04 /bin/bash`'
	],
	'mysql' : [
		'`docker pull mysql`',
		'`docker run -i -t mysql:8.0.0 /bin/bash`'
	],
	'redis' : [
		'`docker pull redis`',
		'`docker run -i -t redis:latest /bin/bash`'
	],
	'postgres' : [
		'`docker pull postgres`',
		'`docker run -i -t postgres:latest /bin/bash`'
	]
});
