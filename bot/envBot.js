'use strict';

var Botkit = require('botkit'); // Botkit Object
var constants = require('./constants');
var dockerData = require('./dockerData');

var messageTypes = ['direct_message','direct_mention','mention'];

var gitSite = /(http|ftp|https):\/\/(github+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?/;
var urlPattern = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))+([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/;
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
	bot.reply(message,'Hello <@'+message.user+'>, how may I be of help? Mention me, and type in Help, or tell me if you need me to set up an environment for you.');
});

// USE CASE 1 : Generate a DockerFile from Github Repo
controller.hears(dockerFileREGEX, messageTypes, function(bot, message) {
	
	if(!urlPattern.test(message.text)) {
		bot.reply(message, '<@' + message.user + '>, Can I have the URL?');
	} else if(urlPattern.test(message.text) && !gitSite.test(message.text)) {
		bot.reply(message, '<@' + message.user + '>, Can I have a valid URL(i.e., belonging to a GitHub repository)?');
	} else {

		var repoData = {
			body: message.text,
			link: urlPattern.exec(message.text)[0]
		};

		console.log('Calling create docker file', repoData.link);

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
// Still in progress.
controller.hears('use case 3', messageTypes, function(bot, message) {
	// if(!urlPattern.test(message.text)) {
	// 	bot.reply(message, '<@' + message.user + '>, Can I have the URL?');
	// } else if(urlPattern.test(message.text) && !gitSite.test(message.text)) {
	// 	bot.reply(message, '<@' + message.user + '>, Can I have a valid URL(i.e., belonging to a GitHub repository)?');
	// } else {

		var repoData = {
			body: message.text,
			link: 'https://github.com/alt-code/DockerizeMe.git'
		};

		console.log('Calling create docker file', repoData.link);

		createDockerFile(repoData.link, function(dockerFile) {
			if (dockerFile) {
				
				
				if (repoData.link.charAt(repoData.link.length-1) === '/') {
					repoData.link = repoData.link.substring(0, repoData.link.length-1);
				}

				var repoName = repoData.link.substring(repoData.link.lastIndexOf('/')+1);
				repoName = repoName.replace('.git', '');

				createDockerImage(repoName, function(err, data) {
					if (err) {
						console.log('Error while creating docker Image : ' + err);
					} else {
						var command = 'docker pull ashah7/' + repoName.toLowerCase;
						var reply = {
							"attachments": [{
								"title" : "Commands to pull Docker Image",
								"pretext" : "",
								"text" : command,
								"mrkdwn_in" : ["text", "pretext"]
						}]};

						bot.reply(message, reply);
					}
				});


			} else {
				return bot.reply(message, 'Error in creating docker file.')
			}
		});
	//}
});

function createDockerFile(repo, callback) {
	console.log('calling bash script');
	const exec = require('child_process').exec;

	exec(`sh create_dockerfile.sh ${repo}`, {cwd : constants.cwd}, (error, stdout, stderr) => {
		if (error) {
			console.log(`Error in executing command : ${error}`);
		} else if (stderr) {
			console.log(`I/O Standard Error  : ${stderr}`);
		} else {
			console.log('return answer', stdout);
			callback(stdout);
		}
	});
}

function createDockerImage(repoName, callback) {
	
	var cwd = './DockerizeMe/' + repoName + '/';

	console.log('Calling dockerize.sh');

	const exec = require('child_process').exec;
	exec(`sh dockerize.sh ${repoName.toLowerCase()}`, {cwd : cwd}, (error, stdout, stderr) => {
		if (error) {
			console.log(`Error in executing command : ${error}`);
			callback(error, stdout);
		} else if (stderr) {
			console.log(`I/O Standard Error  : ${stderr}`);
			callback(stderr, stdout);
		} else {
			callback(null, stdout);
		}
	});
}