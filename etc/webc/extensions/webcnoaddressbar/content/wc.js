function installButton(toolbarId, id) {
	var toolbar = document.getElementById(toolbarId);
	var before = null;
	toolbar.insertItem(id, before);
	toolbar.setAttribute("currentset", toolbar.currentSet);
	document.persist(toolbar.id, "currentset");
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
			document.getElementById("wc-print").removeAttribute("hidden");
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

