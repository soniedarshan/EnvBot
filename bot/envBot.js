'use strict';

var Botkit = require('botkit'); // Botkit Object
var inputAnalyzer = require('./InputAnalyzer');
var constants = require('./constants');

/* TESTBOT_TOKEN must be initialized in Environment Variables
 * add : export TESTBOT_TOKEN='xxxx'
 * run : source ~/bash_profile
 * TODO add : export ENVBOT_TOKEN='' 
 */ 
if (!process.env.TESTBOT_TOKEN) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

// control verbosity
var controller = Botkit.slackbot({
  debug: false
});

// start slack Real Time Messaging client 
controller.spawn({
  token: process.env.TESTBOT_TOKEN
}).startRTM()

// INPUT_HANDLERS :

// test handler : hello 
controller.hears('Hello',['direct_message','direct_mention','mention'], function(bot,message) {
  console.log(message);
  bot.reply(message,'Hello <@'+message.user+'>');
});

/*

should look like : 

controller.hears(expectedInput(), ['direct_message','direct_mention', 'mention'], function(bot, message) {
	// decode given message
	var input = inputAnalyzer.decode_message(message);
	
	// call DOCKERIZE_ME and return DockerFile
	var DockerFile = createDockerFile();

	// create a Snippet for the DockerFile
	bot.reply('Create Snippet Code');

});
*/

/*
function expectedInput() {
	return 'REGEX'.match() // REGEX that would match with out input style.
}
*/

controller.hears('dockerizeMe', ['direct_message'], function(bot, message) {
	var link = 'https://github.com/alt-code/DockerizeMe.git';

	createDockerFile(link, function(dockerFile) {
		if (dockerFile) {
			bot.reply(message, dockerFile);
		}
	});

});

function createDockerFile(repo, callback) {
	const exec = require('child_process').exec;
			
	exec(`sh create_dockerfile.sh ${repo}`, {cwd : constants.cwd}, (error, stdout, stderr) => {
		if (error) {
			console.log(`Error in executing command : ${error}`);
		} else if (stderr) {
			console.log(`I/O Standard Error  : ${stderr}`);
		} else {
			exec('cat DockerFile', {cwd : constants.cwd}, (error, stdout, stderr) => {
				if (error) {
					console.log(`Error in executing command : ${error}`);
				} else if (stderr) {
					console.log(`I/O Standard Error  : ${stderr}`);
				} else {
					console.log(`Command to CAT output : ${stdout}`);
					callback(stdout);
				}
			});
		}
		callback(null);
	});		
}