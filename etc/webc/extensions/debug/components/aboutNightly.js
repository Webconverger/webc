const Cc = Components.classes;
const Ci = Components.interfaces;

Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");

function AboutNightly() {}
AboutNightly.prototype = {
    classDescription: "about:nightly",
    contractID: "@mozilla.org/network/protocol/about;1?what=nightly",
    classID: Components.ID("{4cec494a-d33a-4ee7-83d6-461925b5d84b}"),
    QueryInterface: XPCOMUtils.generateQI([Ci.nsIAboutModule]),
  
    getURIFlags: function(aURI) {
        return Ci.nsIAboutModule.ALLOW_SCRIPT;
    },
  
    newChannel: function(aURI) {
        let ios = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
        let channel = ios.newChannel("chrome://nightly/content/aboutNightly.xhtml",
                                     null, null);
        channel.originalURI = aURI;
        return channel;
    }
};


var components = [AboutNightly];

if (XPCOMUtils.generateNSGetFactory)
    var NSGetFactory = XPCOMUtils.generateNSGetFactory(components);
else
    var NSGetModule = XPCOMUtils.generateNSGetModule(components);
