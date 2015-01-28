var EXPORTED_SYMBOLS = [];

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cr = Components.results;

Components.utils.import("resource://gre/modules/Services.jsm");

const gPrefService = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService);
const gPrefBranch = gPrefService.getBranch(null).QueryInterface(Ci.nsIPrefBranch2);
const idleService = Cc["@mozilla.org/widget/idleservice;1"].getService(Ci.nsIIdleService)

var timeout = 0;

var idleObserver = {
	observe: function(subject, topic, data) {
		idleService.removeIdleObserver(idleObserver, timeout);
		var nsIAppStartup = Cc["@mozilla.org/toolkit/app-startup;1"].getService(Ci.nsIAppStartup);
		nsIAppStartup.quit(nsIAppStartup.eForceQuit);
	}
};


try {
	timeout = gPrefBranch.getIntPref("extensions.webconverger.kioskresetstation");
	if (timeout > 0) {
		idleService.addIdleObserver(idleObserver, timeout); // timeout is in minutes
	}
} catch (ex) {}

var HTTPObserver = {
	observe: function observe(subject, topic, data) {
		switch (topic) {
			case "http-on-modify-request":
				var httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);
				if (/.*\.google\..*/.test(httpChannel.URI.host)) {
					if (/^(\/custom|\/search|\/images\/complete)/.test(httpChannel.URI.path)) {
						if (httpChannel.URI.spec.indexOf("safe=strict") == -1) {
							httpChannel.redirectTo(Services.io.newURI(httpChannel.URI.spec + "&safe=strict", null, null));
						}
					}
					return;
				}
				if (/.*\.yahoo\.com/.test(httpChannel.URI.host)) {
					if (/^(\/search)/.test(httpChannel.URI.path)) {
						if (httpChannel.URI.spec.indexOf("vm=r") == -1) {
							httpChannel.redirectTo(Services.io.newURI(httpChannel.URI.spec + "&vm=r", null, null));
						}
					}
					return;
				}
				if (/.*\.bing\.com/.test(httpChannel.URI.host)) {
					if (/^(\/search|\/videos|\/images|\/news)/.test(httpChannel.URI.path)) {
						if (httpChannel.URI.spec.indexOf("adlt=strict") == -1) {
							httpChannel.redirectTo(Services.io.newURI(httpChannel.URI.spec + "&adlt=strict", null, null));
						}
					}
					return;
				}
				if (httpChannel.URI.host == "duckduckgo.com") {
					if (httpChannel.URI.spec.indexOf("kp=1") == -1) {
						httpChannel.redirectTo(Services.io.newURI(httpChannel.URI.spec + "&kp=1", null, null));
					}
					return;
				}
		}
	}
}

try {
	if (gPrefBranch.getBoolPref("extensions.webconverger.forcesafesearch")) {
		Services.obs.addObserver(HTTPObserver, "http-on-modify-request", false);
	}
} catch (ex) {}
