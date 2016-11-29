'use strict';

var Botkit = require('botkit'); // Botkit Object
var constants = require('./constants');
var dockerData = require('./dockerData');
var GitUrlParse = require("git-url-parse");

var messageTypes = ['direct_message', 'direct_mention', 'mention'];

var gitSite = /(http|ftp|https):\/\/(github+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?/;
var urlPattern = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/;

/* TESTBOT_TOKEN must be initialized in Environment Variables
 * add : export TESTBOT_TOKEN='xxxx'
 * run : source ~/bash_profile
 */
if (!process.env.TESTBOT_TOKEN) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

/* DOCKERBOT_TOKEN must be initialized in Environment Variables
 * add : export DOCKERBOT_TOKEN='xxxx'
 * run : source ~/bash_profile
 */
if (!process.env.DOCKERBOT_TOKEN) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

// control verbosity
var controller = Botkit.slackbot({
    debug: false
});

// start slack Real Time Messaging client
controller.spawn({
    token: process.env.DOCKERBOT_TOKEN
}).startRTM()


// HANDLE HELP
controller.hears("help", messageTypes, function(bot, message) {
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

// USE CASE 1 : Generate a DockerFile from Github Repo
controller.hears("file", messageTypes, function(bot, message) {
    if (!urlPattern.test(message.text)) {
        bot.reply(message, '<@' + message.user + '>, Can I have the URL?');
    } else if (urlPattern.test(message.text) && !gitSite.test(message.text)) {
        bot.reply(message, '<@' + message.user + '>, Can I have a valid URL(i.e., belonging to a GitHub repository)?');
    } else {

        var repoData = {
            body: message.text,
            link: urlPattern.exec(message.text)[0],
            name: GitUrlParse(urlPattern.exec(message.text)[0]).name
        };

        console.log('Repo name : ', repoData.name);

        createDockerFile(repoData, function(dockerFile) {
            if (dockerFile) {

                var err1 = "undefined";
                var err2 = "Package manager not found";
                if (dockerFile.search(err1) !== -1 || dockerFile.search(err2) !== -1) {
                    return bot.reply(message, 'DockerizeMe cannot find the required files in the repository to create DockerFile.');
                }

                var reply = {
                    "attachments": [{
                        "title": "Dockerfile",
                        "pretext": "",
                        "text": dockerFile,
                        "mrkdwn_in": ["text", "pretext"]
                    }]
                };
                return bot.reply(message, reply);
            } else {
                return bot.reply(message, 'Error in creating docker file.')
            }
        });
    }
});

// USE CASE 2 : Return Docker Image for pre-defined popular technology environments.
controller.hears("request", messageTypes, function(bot, message) {

    var title, pretext, text = '';

    var stacks = /(mean|python|lamp|ubuntu|mysql|redis|postgres)/i;
    var stack = '';
    if (stacks.test(message.text)) {
        stack = stacks.exec(message.text)[0];
        stack = stack.toLowerCase();
    }
    var title_link = '';

    if (message.text.length < 20) {
        bot.reply(message, "Invalid Command.");
        return;
    }

    if (message.text === 'request docker image') {
        title = 'Available Docker Images';
        title_link = 'https://pages.github.ncsu.edu/dasoni/EnvBot/';
        color: '#7CD197'
        pretext = '';

        var count = 1;
        Object.keys(dockerData).forEach(function(key) {
            text += count + '. ' + firstToUpperCase(key) + '\n';
            count += 1;
        });

    } else if (Object.keys(dockerData).includes(stack)) {
        title = 'Commands';
        pretext = 'You can enter the following commands to setup the docker image: ';

        text = '';

        dockerData[stack].forEach(function(cmd) {
            text += cmd + "\n";
        });
    } else {
        title = 'Available Docker Images';
        pretext = 'Sorry. Docker image unavailable.';

        var count = 1;
        Object.keys(dockerData).forEach(function(key) {
            text += count + '. ' + key + '\n';
            count += 1;
        });
    }

    var reply = {
        "attachments": [{
            "title": title,
            "pretext": pretext,
            "title_link": title_link,
            "text": text,
            mrkdwn_in: ['text', 'pretext']
        }]
    };

    bot.reply(message, reply)
});

// TODO USE CASE 3 : Build Docker image from Github repo
// Still in progress.
// As mentioned in http://54.71.194.30:4014/docker-hub/builds/ : there is a manual process involved which cannot be manipulated without their API support.
controller.hears('image', messageTypes, function(bot, message) {
    // Temporarily linked to DockerizeMe repo
     if (!urlPattern.test(message.text)) {
        bot.reply(message, '<@' + message.user + '>, Can I have the URL?');
    } else if (urlPattern.test(message.text) && !gitSite.test(message.text)) {
        bot.reply(message, '<@' + message.user + '>, Can I have a valid URL(i.e., belonging to a GitHub repository)?');
    }
    var repoData = {
        body: message.text,
        link: urlPattern.exec(message.text)[0],
        name: GitUrlParse(urlPattern.exec(message.text)[0]).name
    };
    console.log('Calling create docker file', repoData.link);

    createDockerFile(repoData, function(dockerFile) {
        if (dockerFile) {

            var err1 = "undefined";
            var err2 = "Package manager not found";
            if (dockerFile.search(err1) !== -1 || dockerFile.search(err2) !== -1) {
                return bot.reply(message, 'DockerizeMe cannot find the required files in the repository to create DockerFile.');
            }

            createDockerImage(repoData.name, function(err, data) {
                if (err) {
                    console.log('Error while creating docker Image : ' + err);
                } else {
                    var command = 'docker pull ashah7/' + repoData.name.toLowerCase();
                    var reply = {
                        "attachments": [{
                            "title": "Commands to pull Docker Image",
                            "pretext": "",
                            "text": command,
                            "mrkdwn_in": ["text", "pretext"]
                        }]
                    };

                    bot.reply(message, reply);
                }
            });
        } else {
            return bot.reply(message, 'Error in creating docker file.')
        }
    });
});

function createDockerFile(repoData, callback) {
    console.log('calling bash script');
    const exec = require('child_process').exec;
    var cmd = `sh create_dockerfile.sh ${repoData.link} ${repoData.name}`;
    console.log(cmd); 
    exec(cmd, {
        cwd: './DockerizeMe'
    }, (error, stdout, stderr) => {
        if (error) {
            console.log(`Error in executing command : ${error}`);
        } else if (stderr) {
            console.log(`I/O Standard Error  : ${stderr}`);
        } else {
            console.log(stdout);
            callback(stdout);
        }
    });
}

function firstToUpperCase( str ) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
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
            console.log('Docker image build and pushed successfully.')
            callback(null, stdout);
        }
    });
}
