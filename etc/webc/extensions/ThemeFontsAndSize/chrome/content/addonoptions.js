function load() {
	    document.getElementById("hidesbicon").addEventListener("command", function (event) {var sss = Components.classes['@mozilla.org/content/style-sheet-service;1'].getService(Components.interfaces.nsIStyleSheetService);var ios = Components.classes['@mozilla.org/network/io-service;1'].getService(Components.interfaces.nsIIOService);var css = "@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);#themefontsizechanger-statusbar {display: none !important;}";var uri = ios.newURI("data:text/css," + encodeURIComponent(css), null, null);if (!sss.sheetRegistered(uri, sss.USER_SHEET)) {sss.loadAndRegisterSheet(uri, sss.USER_SHEET);var themefontsizechangerprefsinstance = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);var themefontsizechangersbiconhide = themefontsizechangerprefsinstance.getBoolPref("extensions.themefontsizechanger.sbiconhide");themefontsizechangerprefsinstance.setBoolPref("extensions.themefontsizechanger.sbiconhide", true);} else {sss.unregisterSheet(uri, sss.USER_SHEET);var themefontsizechangerprefsinstance = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);var themefontsizechangersbiconhide = themefontsizechangerprefsinstance.getBoolPref("extensions.themefontsizechanger.sbiconhide");themefontsizechangerprefsinstance.setBoolPref("extensions.themefontsizechanger.sbiconhide", false);}}, false);
	    document.getElementById("hidetoolsmenu").addEventListener("command", function (event) {
var themefontsizechangerprefsinstance = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
themefontsizechangerprefsinstance.setBoolPref("extensions.themefontsizechanger.hidetoolsmenu", event.target.checked);
	    }, false);
	    document.getElementById("hideappmenu").addEventListener("command", function (event) {
var themefontsizechangerprefsinstance = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
themefontsizechangerprefsinstance.setBoolPref("extensions.themefontsizechanger.hideappmenu", event.target.checked);
	    }, false);	
	    document.getElementById("abbreviatetoolbarbuttontext").addEventListener("command", function (event) {
var themefontsizechangerprefsinstance = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
themefontsizechangerprefsinstance.setBoolPref("extensions.themefontsizechanger.abbreviatetoolbarbuttontext", event.target.checked);
	    }, false);		        
}