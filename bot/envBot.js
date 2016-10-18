'use strict';

var Botkit = require('botkit'); // Botkit Object
var inputAnalyzer = require('./InputAnalyzer');


var gitSite = /(http|ftp|https):\/\/github([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?/;
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
// controller.hears('Hello',['direct_message','direct_mention','mention'], function(bot,message) {
//   console.log(message);
//   bot.reply(message,'Hello <@'+message.user+'>');
// });

controller.hears('Hey',['direct_message','direct_mention','mention'], function(bot,message) {
  //console.log(message);
  bot.reply(message,'Hello <@'+message.user+'>, how may I be of help? Mention me, and type in Help, or tell me if you need me to set up an environment for you.');
});

controller.hears('Help', ['direct_message','direct_mention','mention'], function(bot,message) {
  //console.log(message);
  bot.reply(message,'<@'+message.user+'>, Check this out.');
});

controller.hears([/set/i,/environment/i,/repository/i,/repo/i, gitSite], ['direct_message', 'direct_mention', 'mention'], function(bot, message) {
	var patt = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/;
	if(!patt.test(message.text))
	{
		bot.reply(message, '<@' + message.user + '>, Can I have the URL?');
	}
	else if(patt.test(message.text) && !gitSite.test(message.text))
	{
		bot.reply(message, '<@' + message.user + '>, Can I have a valid URL(i.e., belonging to a GitHub repository)?');
	}
	else
	{
		bot.reply(message, '<@' + message.user + '>, I\'ll get right on that!');
		var repoData = {
			body: message.text,
			link: patt.exec(message.text)[0]
		};
	}
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