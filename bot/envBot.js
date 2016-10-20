'use strict';

var Botkit = require('botkit'); // Botkit Object
var constants = require('./constants');
var dockerData = require('./dockerData');

var messageTypes = ['direct_message','direct_mention','mention'];

var gitSite = /(http|ftp|https):\/\/(github+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?/;
var urlPattern = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/;
var starterREGEX = [/hey/i, /help/i, /how/i];
var dockerCmdREGEX = [/request docker image( |:)*(python|mean|lamp)+/i];
var dockerFileREGEX = [/(docker file|dockerfile)/i, gitSite];


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

// HANDLE HELP
controller.hears(starterREGEX, messageTypes, function(bot,message) {
	//'Hello <@'+message.user+'>, how may I be of help? Mention me, and type in Help, or tell me if you need me to set up an environment for you.'
	var reply = {
		"attachments": [
        {
            "fallback": "Hello <@" + message.user + ">, how may I be of help? Go to this link to check out the list of commands!",
            "pretext": "Hello <@" + message.user + ">, how may I be of help? Go to this link to check out the list of commands!",
            "title": "EnvBot, How-to",
            "title_link": "https://pages.github.ncsu.edu/dasoni/EnvBot/",
            "text": "Command Cheatsheet",
            "color": "#7CD197"
        }
    ]
	};
	bot.reply(message,reply);
});

// USE CASE 1 : Generate a DockerFile from Github Repo
controller.hears(dockerFileREGEX, messageTypes, function(bot, message) {
	
	if(!urlPattern.test(message.text)) {
		bot.reply(message, '<@' + message.user + '>, Can I have the URL?');
	} else if(urlPattern.test(message.text) && !gitSite.test(message.text)) {
		bot.reply(message, '<@' + message.user + '>, Can I have a valid URL(i.e., belonging to a GitHub repository)?');
	} else {
		console.log(pattern.exec(message.text)[0]);
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

// USE CASE 2 : Return Docker Image for pre-defined popular technology environments.
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

// TODO USE CASE 3 : Build Docker image from Github repo

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