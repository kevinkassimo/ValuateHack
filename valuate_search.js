var webPage = require('webpage');
var fs = require('fs');
var page = webPage.create();

console.log("hello!");

// Log rrror messages
function log_error(msg) {
	console.log("ERROR: " + msg);
}

// variable exposing whether the page is loading or not
var isLoading = false;
page.onLoadStarted = function() {
	isLoading = true;
	console.log('Loading started');
};
page.onLoadFinished = function() {
	isLoading = false;
	console.log('Loading finished');
};
page.onConsoleMessage = function(msg) {
	var noise = /(^::.*$)|(regHelp)/;
	if (!noise.test(msg)) {
		console.log(msg);
	}
}

// clear cookies each time, make sure that the web is always clean from start
function clearCookies() {
	phantom.clearCookies();
}

// config.json file parsing
var config = JSON.parse(fs.read('config.json', 'utf8'));

//console.log(config.username);

// CORE EXECUTIONS:
var steps = [
	function start() {
		page.open("https://www.valuate.com/login/", function (status) {});
	},
	function login() {
		var rect = page.evaluate(function eval_func1(config) {
			
			
			var domain_form = $(document.forms[0]);
			console.log(config);
			domain_form.find('input[name="Login"]').val(config.username);
			domain_form.find('input[name="Password"]').val(config.password);
			
			console.log(domain_form.find('input[name="Login"]').attr("value"));
			console.log(domain_form.find('input[type="submit"]').val());
			
			domain_form.find('input[type="submit"]').click();
			return domain_form.find('input[type="submit"]').get(0).getBoundingClientRect();
		}, config);
		//page.sendEvent('click', rect.left + rect.width / 2, rect.top + rect.height / 2);
//		page.open("https://www.valuate.com/login/", function inspect(status) {
//			if (status === 'success') {
//				// Inject js code to remove single check limit
//				var rect = page.evaluate(function eval_func1(config) {
//					var domain_form = $(document.forms[0]);
//					console.log(config);
//					domain_form.find('input[name="Login"]').val(config.username);
//					domain_form.find('input[name="Password"]').val(config.password);
//					return domain_form.find('input[type="submit"]').get(0).getBoundingClientRect();
//				});
//				page.sendEvent('click', rect.left + rect.width / 2, rect.top + rect.height / 2);
//			}
//		}, config);
		console.log("Step 1 finished");
	},
	function () {
		//console.log(page.content);
		console.log(page.url);
		//page.open("https://www.valuate.com/", function (status) {});
		//console.log("switching");
	},
	function () {
			//console.log(page.content);
			console.log(page.url);
			//page.open("https://www.valuate.com/", function (status) {});
			//console.log("switching");
	},
	function () {
				//console.log(page.content);
				console.log(page.url);
				//page.open("https://www.valuate.com/", function (status) {});
				//console.log("switching");
	},
	function enter_list() {
		var url = "https://www.valuate.com/";
		//console.log(page.content);
		console.log(page.cookies);
		
		if (page.url !== url) {
			console.log("redoing...");
			wait_redo_step();
		}
		//
		if (page.injectJs('tools/inject_valuate.js')) {
			var rect = page.evaluate(function eval_func2(config) {
				var domain_form = $('#content1').find('form');
				var domain_textarea = domain_form.find('textarea');
				var domain_submit_button = domain_form.find('input[type="submit"]');
				
				var domain_list_string = "";
				for (var i = 0; i < config.domains.length; i++) {
					domain_list_string += (config.domains[i] + "\n");
				}
//				for (var domain_item of domains) {
//					domain_list_string += (domain_item + "\n");
//				}
				
				domain_textarea.val(domain_list_string);
				
				return domain_submit_button[0].getBoundingClientRect();
			}, config);
			// click the submit button
			page.sendEvent('click', rect.left + rect.width / 2, rect.top + rect.height / 2);
		}
		
		console.log("Step 2 finished");
	}, function result() {
		fs.write("sample.html", page.content, "w");
		//console.log(page.content);
	}
];


// step management
var step_index = 0;
var MAX_RETRY_COUNT = 10;
var retries = 0;

function step(timeout) {
	setInterval(handle_step, timeout);
}

function handle_step() {
	if (step_index >= steps.length) {
		phantom.exit();
	}
	
	if (isLoading === false && typeof steps[step_index] === "function") {
		// Execute on step
		steps[step_index]();
		step_index++;
	}
	if (typeof steps[step_index] != "function") {
		log_error("handle_step: current step not a function");
	}
}

function wait_redo_step() {
	retries++;
	if (retries > MAX_RETRY_COUNT) {
		log_error("wait_redo_step: step retry failed at step " + step_index + ".");
		phantom.exit();
	}
}

function goto_step(index) {
	
}
// call on function success, so that we can clear the step pool
function next_step() {
	
}


// This one works for 
function check_price() {
	// set interval to 1s polling, may need to be longer.
	clearCookies();
	console.log("hello my friend");
	step(5000);
};

console.log("script running");

check_price();

//module.exports = {
//	check_price: check_price
//};