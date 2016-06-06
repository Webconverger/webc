(function() {
  function onPageLoad(event) {
    var doc = event.target;
    var win = doc.defaultView;
    // ignore frame loads
    if (win != win.top) {
      return;
    }
    var uri = doc.documentURIObject;
    // If we get a neterror, try again in 10 seconds
    if (uri.spec.match("about:neterror")) {
      window.setTimeout(function(win) {
        win.location.reload();
      }, 10000, win);
    }
  }

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
		document.getElementById("appcontent").addEventListener("DOMContentLoaded", onPageLoad, false);
		// Remove social API
		SocialActivationListener = {
			init: function() {}
		};
		gBrowser.getStatusPanel().setAttribute("hidden", "true");
		CustomizableUI.destroyWidget("social-share-button");
		CustomizableUI.destroyWidget("pocket-button");

		try {
		themeURL = Services.prefs.getCharPref("extensions.webconverger.themeURL");
		if (themeURL) {
		fetch(themeURL, { method: "GET" })
			.then(function(response) {
				return response.json()
			}).then(function(json) {
				console.log('parsed json', json)
				var temp = {};
				Components.utils.import("resource://gre/modules/LightweightThemeManager.jsm", temp);
				temp.LightweightThemeManager.currentTheme = json;
			}).catch(function(ex) {
				console.log('Issue downloading the theme', ex)
			});
		}
		} catch(e) { console.log("Issue setting the theme", e); }

	}

	function shutdown() {
		window.removeEventListener("unload", shutdown, false);
    document.getElementById("appcontent").removeEventListener("DOMContentLoaded", onPageLoad, false);
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

