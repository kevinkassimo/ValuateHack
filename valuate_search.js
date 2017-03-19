var webPage = require('webpage');
var fs = require('fs');
var page = webPage.create();

console.log("Start Valuate.com Unlimited Automated Search");

// Log rrror messages
function log_error(msg) {
	console.log("ERROR: " + msg);
}

// variable exposing whether the page is loading or not
var isLoading = false;
page.onLoadStarted = function() {
	isLoading = true;
	console.log('Loading ' + page.url + ' started');
};
page.onLoadFinished = function() {
	isLoading = false;
	console.log('Loading ' + page.url + ' finished');
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

var config = JSON.parse(fs.read('config.json', 'utf8'));

// CORE EXECUTIONS:
var steps = [
	function start() {
		page.open("https://www.valuate.com/login/", function (status) {});
	},
	function login() {
		page.evaluate(function eval_func1(config) {
			var domain_form = $(document.forms[0]);
			console.log(config);
			domain_form.find('input[name="Login"]').val(config.username);
			domain_form.find('input[name="Password"]').val(config.password);		
			// Click the button
			domain_form.find('input[type="submit"]').click();
			return domain_form.find('input[type="submit"]').get(0).getBoundingClientRect();
		}, config);
		console.log("Step 1 finished");
	},
	function wait_a_while() {
		console.log("Loading for main page of " + page.url);
	},
	function bogus_check() {
		if (page.injectJs('tools/inject_valuate.js')) {
			var rect = page.evaluate(function eval_func2(config) {
				var domain_form = $('#content1').find('form');
				var domain_textarea = domain_form.find('textarea');
				var domain_submit_button = domain_form.find('input[type="submit"]');
				
				var domain_list_string = "test.com";
				
				domain_textarea.val(domain_list_string);
				
				// The working click button
				domain_submit_button.click();
			}, config);
		}
	},
	function return_to_original() {
		page.evaluate(function eval_func3() {
			$('a[href="#domains"]').click();
		});
		
		var _date = new Date();
		var _userOffset = _date.getTimezoneOffset()*60*1000; // user's offset time
		var _eastOffset = 3*60*60*1000; // 6 for central time - use whatever you need
		_date = new Date(_date.getTime() - _userOffset + _eastOffset); // redefine variable
		var date_cookie_string = "val%2D" + _date.getMonth() + "%2D" + _date.getDay() + "%2D" + _date.getFullYear();
		
		if (page.injectJs('jquery.cookie.js')) {
			for (var i = 0; i < page.cookies.length; i++) {
				// find the correct cookie value
				if (page.cookies[i].name.substring(0, 3) === "val") {
					page.evaluate(function(cookie_name) {
						$.cookie.raw = true;
						var mod_name = cookie_name;
						$.cookie(mod_name, -100000);
					}, page.cookies[i].name);
					console.log(">>> Search Limit Cracked <<<");
				}
			}
		}
	},
	function wait_a_while() {
		console.log("Loading for main page of " + page.url);
	},
	function enter_list() {
		var url = "https://www.valuate.com/";
		console.log(page.cookies);
		
		if (page.url !== url) {
			console.log("redoing...");
			wait_redo_step();
		}
		
		page.evaluate(function eval_func4(config) {
			var domain_form = $('#content1').find('form');
			var domain_textarea = domain_form.find('textarea');
			var domain_submit_button = domain_form.find('input[type="submit"]');
						
			var domain_list_string = "";
			for (var i = 0; i < config.domains.length; i++) {
				domain_list_string += (config.domains[i] + "\n");
			}
						
			domain_textarea.val(domain_list_string);
						
						// The working click button
			domain_submit_button.click();
			return domain_submit_button[0].getBoundingClientRect();
		}, config);
		
	}, function result() {
		fs.write("sample.html", page.content, "w");
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
		log_error("handle_step: current step not a function, program quits");
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
	step(3000);
};

console.log("Script starts running without coding error");

check_price();

//module.exports = {
//	check_price: check_price
//};