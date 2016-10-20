'use strict';

var Botkit = require('botkit'); // Botkit Object
var constants = require('./constants');
var dockerData = require('./dockerData');

var messageTypes = ['direct_message','direct_mention','mention'];
var dockerFileREGEX = [/(docker file|dockerfile)/i, /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?/];
var dockerCmdREGEX = [/request docker image( |:)*(python|mean|lamp)+/i];

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

controller.hears(dockerCmdREGEX, messageTypes, function(bot, message) {
	
	var stacks = /(mean|python|lamp)/ug;
	var stack = stacks.exec(message.text)[0];

	if (Object.keys(dockerData).includes(stack)) {
		var commands = "";

		dockerData[stack].forEach(function(cmd) {
			commands += cmd + "\n";
		});

		var reply = {
			"attachments": [{
				"title" : "Commands",
				"pretext" : "You can enter the following commands to setup the docker image: ",
				"text" : commands,
				"mrkdwn_in" : ["text", "pretext"]
		}]};

		bot.reply(message, reply);
	}
});

controller.hears(dockerFileREGEX, messageTypes, function(bot, message) {
	
	var pattern = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/;
	
	if(!pattern.test(message.text)) {
		bot.reply(message, '<@' + message.user + '>, Can I have the URL?');
	} else {
		console.log("Received a valid link.");
		var repoData = {
			body: message.text,
			link: pattern.exec(message.text)[0]
		};

		createDockerFile(repoData.link, function(dockerFile) {
			if (dockerFile) {
				var reply = {
					"attachments": [{
						"title" : "Dockerfile",
						"pretext" : "",
						"text" : dockerFile,
						"mrkdwn_in" : ["text", "pretext"]
				}]};
				return bot.reply(message, reply);
			} else {
				return bot.reply(message, 'Error in creating docker file.')
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
					return callback(stdout);
				}
			});
		}
	});
}