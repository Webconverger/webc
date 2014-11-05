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

		var nobrand = false;
		try {
			nobrand = Services.prefs.getBoolPref("extensions.webconverger.nobrand");
		} catch(e) {}
		if (!nobrand) {
		var insertAfter = document.getElementById("alltabs-button");
		document.getElementById("alltabs-button");
		var allTabsButton = document.getElementById("alltabs-button");
		var spacer = document.createElement("spacer");
		spacer.setAttribute("flex", "1");
		insertAfter.parentNode.appendChild(spacer);
		var box = document.createElement("box");
		box.setAttribute("pack", "center");
		box.setAttribute("align", "center");
		var image = document.createElement("image");
		image.setAttribute("src", "chrome://webconverger/content/webclogo.svg");
		image.setAttribute("tooltiptext", "Webconverger");
		box.appendChild(image);
		insertAfter.parentNode.appendChild(box);
		}
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

