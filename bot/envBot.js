'use strict';

var Botkit = require('botkit'); // Botkit Object
var inputAnalyzer = require('./InputAnalyzer');

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