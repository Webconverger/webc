var webc = {
	init: function() {
		if (gBrowser) {
			gBrowser.tabContainer.addEventListener("TabClose", webc.tabRemoved, false);
		}
	},
	tabRemoved: function(event) {

		// Get number of tabs
		var num = gBrowser.browsers.length;

		// If there are two tabs, the second tab has no title and the closed tab
		// does have a title (ie is not the same tab) then close the browser
		if ((num == 2) && (!gBrowser.getBrowserAtIndex(1).contentTitle) && event.target.linkedBrowser.contentTitle) {
			goQuitApplication();
		}
		if ((num == 2) && (!gBrowser.getBrowserAtIndex(0).contentTitle)) {
			goQuitApplication();
		}
	}

};

window.addEventListener("load", function load(event) {
	window.removeEventListener("load", load, false); //remove listener, no longer needed
	webc.init();
},
false);

function BrowserLoadURL(aTriggeringEvent, aPostData) { // override browser.js
	var url = gURLBar.value;
	if (url.match(/^file:/) || url.match(/^\//) || url.match(/^resource:/) || url.match(/^about:/)) {
		alert("Access to this protocol has been disabled!");
		return;
	}

	if (aTriggeringEvent instanceof MouseEvent) {
		if (aTriggeringEvent.button == 2) {
			return; // Do nothing for right clicks
		}

		// We have a mouse event (from the go button), so use the standard UI link behaviors
		openUILink(url, aTriggeringEvent, false, false, true, aPostData);
		return;
	}

	if (aTriggeringEvent && aTriggeringEvent.altKey) {
		handleURLBarRevert();
		content.focus();
		gBrowser.loadOneTab(url, null, null, aPostData, false, true
		/* allow third party fixup */
		);
		aTriggeringEvent.preventDefault();
		aTriggeringEvent.stopPropagation();
	}
	else {
		loadURI(url, null, aPostData, true
		/* allow third party fixup */
		);
	}

	focusElement(content);
}


(function() {
	function startup() {
		var navigatorToolbox = document.getElementById("navigator-toolbox");
		navigatorToolbox.iconsize = "small";
		navigatorToolbox.setAttribute("iconsize", "small");
		var showPrintButton = false;
		try {
			showPrintButton = Services.prefs.getBoolPref("extensions.webconverger.showprintbutton");
		} catch (e) {}
		if (showPrintButton) {
			navbar = document.getElementById("nav-bar");
			currentSet = navbar.currentSet;
			newCurrentSet = currentSet.replace('home-button', 'home-button,print-button');
			navbar.currentSet = newCurrentSet;
			document.getElementById("print-button").removeAttribute("hidden");
		} else {
			document.getElementById("print-button").setAttribute("hidden", "true");
		}
		window.removeEventListener("load", startup, false);
	}

	function shutdown() {
		window.removeEventListener("unload", shutdown, false);
	}

	window.addEventListener("load", startup, false);
	window.addEventListener("unload", shutdown, false);
})();
// Disable shift click from opening window
// Fixes https://github.com/Webconverger/webconverger-addon/issues/18
var ffWhereToOpenLink = whereToOpenLink;

whereToOpenLink = function(e, ignoreButton, ignoreAlt) {
	var where = ffWhereToOpenLink(e, ignoreButton, ignoreAlt);
	if (where == "window") {
		where = "tab";
	}
	return where;
}

