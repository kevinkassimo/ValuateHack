// Injected replacement function, so that the limit would be removed.
function CheckfmCompare() {
	CleanLists();

	if(eval("document.lo" + "cation.href").toLowerCase().indexOf("www.valuate.com") == -1 && eval("document.lo" + "cation.href").toLowerCase().indexOf("valuate.com") == -1) {
			alert('You cannot use a proxy service to get domain valuations.\nWhy not create an account and select the plan that best fit your needs?'); 
			return false;		
	}
		
	if (CountDomains + CountRefDomains == 0) {
		alert('Domain names to valuate?'); 
		document.fmCompare.l.focus();
		return false;
	}
	
	// Limit code removed here.
	
	init();

	return false;		
}