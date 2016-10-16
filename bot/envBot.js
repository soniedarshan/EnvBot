'use strict';

var Botkit = require('botkit'); // Botkit Object
var constants = require('./constants');

var handlerREGEX = [/set/,/environment/,/repository/,/repo/, /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?/];
var messageTypes = ['direct_message','direct_mention','mention'];

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
controller.hears('Hey', messageTypes, function(bot,message) {
	bot.reply(message,'Hello <@'+message.user+'>, how may I be of help? Mention me, and type in Help, or tell me if you need me to set up an environment for you.');
});

controller.hears('Help', messageTypes, function(bot,message) {
	bot.reply(message,'<@'+message.user+'>, Check this out.');	
});

controller.hears(handlerREGEX, messageTypes, function(bot, message) {
	var pattern = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/;
	if(!pattern.test(message.text)) {
		bot.reply(message, '<@' + message.user + '>, Can I have the URL?');
	} else {
		var repoData = {
			body: message.text,
			link: pattern.exec(message.text)[0]
		};

		createDockerFile(repoData.link, function(dockerFile) {
			if (dockerFile) {
				bot.reply(message, dockerFile);
			} else {
				bot.reply(message, 'Error in creating docker file.')
			}
		});
	}
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