var request = require('request');
var fs = require("fs");

var token = "token " + "****";
var userId = "akshat-shah";

var urlRoot = "https://api.github.com";

forkRepo('soniedarshan', 'darshan_docker');

function forkRepo(userName, repoName) {

	var options = {
		url: urlRoot + '/repos/' + userName + "/" + repoName + "/forks",
		method: 'POST',
		headers: {
			"User-Agent": "EnableIssues",
			"content-type": "application/json",
			"Authorization": token
		}
	};

	// Send a http request to url and specify a callback that will be called upon its return.
	request(options, function (error, response, body) {
		if (error) {
			console.log('Error : ',error);
		} else {
			console.log(response);
		}
	});
}