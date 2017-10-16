Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
const Ci = Components.interfaces;
const Cc = Components.classes;

function AboutHandler() {}
AboutHandler.prototype = {
	/* nsIAboutModule */
	newChannel: function(aURI) {
		var ioService = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
		var uri = ioService.newURI("about:blank", null, null);
		var channel = ioService.newChannelFromURI(uri, null).QueryInterface(Ci.nsIHttpChannel);
		return channel;
	},

	getURIFlags: function getURIFlags(aURI) {
		return 0;
	},

	classDescription: "about home replacement",
	contractID: "@mozilla.org/network/protocol/about;1?what=home",
	classID: Components.ID("{c9201eeb-fbbd-459d-91d2-61e758e49ea2}"),
	QueryInterface: XPCOMUtils.generateQI([Ci.nsIAboutModule]),
};

if (XPCOMUtils.generateNSGetFactory) // FF4
var NSGetFactory = XPCOMUtils.generateNSGetFactory([AboutHandler]);
else // FF3.6
var NSGetModule = XPCOMUtils.generateNSGetModule([AboutHandler]);
