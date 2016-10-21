'use strict';

var Botkit = require('botkit'); // Botkit Object
var constants = require('./constants');
var dockerData = require('./dockerData');
var mockData = require('./mockData');
var messageTypes = ['direct_message', 'direct_mention', 'mention'];

var gitSite = /(http|ftp|https):\/\/(github+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?/;
var urlPattern = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/;

var starterREGEX = [/hey/i, /help/i, /how/i];
var dockerCmdREGEX = [/request docker image( |:)*(python|mean|lamp)*/i];
var dockerFileREGEX = [/(docker image|dockerimage)/i, gitSite];


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
controller.hears(starterREGEX, messageTypes, function(bot, message) {
    //'Hello <@'+message.user+'>, how may I be of help? Mention me, and type in Help, or tell me if you need me to set up an environment for you.'
    var reply = {
        "attachments": [{
            "fallback": "Hello <@" + message.user + ">, how may I be of help? Go to this link to check out the list of commands!",
            "pretext": "Hello <@" + message.user + ">, how may I be of help? Go to this link to check out the list of commands!",
            "title": "EnvBot, How-to",
            "title_link": "https://pages.github.ncsu.edu/dasoni/EnvBot/",
            "text": "Command Cheatsheet",
            "color": "#7CD197"
        }]
    };
    bot.reply(message, reply);
});

// // USE CASE 1 : Generate a DockerFile from Github Repo
// controller.hears(dockerFileREGEX, messageTypes, function(bot, message) {

//     if (!urlPattern.test(message.text)) {
//         bot.reply(message, '<@' + message.user + '>, Can I have the URL?');
//     } else if (urlPattern.test(message.text) && !gitSite.test(message.text)) {
//         bot.reply(message, '<@' + message.user + '>, Can I have a valid URL(i.e., belonging to a GitHub repository)?');
//     } else {

//         var repoData = {
//             body: message.text,
//             link: urlPattern.exec(message.text)[0]
//         };

//         console.log('Calling create docker file', repoData.link);

//         var reply = {
//             "attachments": [{
//                 "title": "Dockerfile",
//                 "pretext": "",
//                 "text": mockData['use-case-1'],
//                 "mrkdwn_in": ["text", "pretext"]
//             }]
//         };
//         return bot.reply(message, reply);

//         // createDockerFile(repoData.link, function(dockerFile) {
//         // 	if (dockerFile) {
//         // 		var reply = {
//         // 			"attachments": [{
//         // 				"title" : "Dockerfile",
//         // 				"pretext" : "",
//         // 				"text" : dockerFile,
//         // 				"mrkdwn_in" : ["text", "pretext"]
//         // 		}]};
//         // 		return bot.reply(message, reply);
//         // 	} else {
//         // 		return bot.reply(message, 'Error in creating docker file.')
//         // 	}
//         // });
//     }
// });

// USE CASE 2 : Return Docker Image for pre-defined popular technology environments.
controller.hears(dockerCmdREGEX, messageTypes, function(bot, message) {

    var reply = mockData['use-case-2'][message.text];
    return bot.reply(message, reply);

});

// TODO USE CASE 3 : Build Docker image from Github repo
// Still in progress.
controller.hears(dockerFileREGEX, messageTypes, function(bot, message) {
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

    return bot.reply(message, mockData['use-case-3']);
    //}
});

function createDockerFile(repo, callback) {
    console.log('calling bash script');
    const exec = require('child_process').exec;

    exec(`sh create_dockerfile.sh ${repo}`, {
        cwd: constants.cwd
    }, (error, stdout, stderr) => {
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
    exec(`sh dockerize.sh ${repoName.toLowerCase()}`, {
        cwd: cwd
    }, (error, stdout, stderr) => {
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
