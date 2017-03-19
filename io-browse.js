var ValuateTool = require('./valuate_search.js');

var webPage = require('webpage');
var page = webPage.create();

page.open("https://app.park.io/", function inspect(status) {
	if (status === 'success') {
		// TODO: 
	}
});

function check_price(domain_list) {
	var v_page = webPage.create();
	
	page.open("www.valuate.com", function inspect(status) {
		if (status === 'success') {
			// Inject js code to remove single check limit
			if (page.injectJs('tools/inject_valuate.js')) {
				
			}
		}
	});
}