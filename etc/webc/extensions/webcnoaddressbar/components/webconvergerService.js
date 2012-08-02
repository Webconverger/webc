const Cc = Components.classes;
const Ci = Components.interfaces;

Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");

function WebconvergerService() {}

WebconvergerService.prototype = {
  observe: function(aSubject, aTopic, aData) {
    switch(aTopic) {
      case "profile-after-change":
        Components.utils.import("resource://webconverger/webconvergerModule.jsm");
        break;
    }
  },
  classDescription: "Webconverger Service",
  contractID: "@webconverger.com/webconverger-service;2",
  classID: Components.ID("{a41ae9a1-4eec-4c6b-b0e4-4c3033115d2c}"),
  QueryInterface: XPCOMUtils.generateQI([Ci.nsIObserver]),
  _xpcom_categories: [{category: "profile-after-change"}]
}

if (XPCOMUtils.generateNSGetFactory)
  var NSGetFactory = XPCOMUtils.generateNSGetFactory([WebconvergerService]);
else
  var NSGetModule = XPCOMUtils.generateNSGetModule([WebconvergerService]);

