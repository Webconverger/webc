var EXPORTED_SYMBOLS = [];

const {classes: Cc, interfaces: Ci, utils: Cu} = Components;

const gPrefService = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService);
const gPrefBranch = gPrefService.getBranch(null).QueryInterface(Ci.nsIPrefBranch2);
const idleService = Cc["@mozilla.org/widget/idleservice;1"].getService(Ci.nsIIdleService)

Cu.import("resource://gre/modules/Services.jsm");

var timeout = 0;

var idleObserver = {
  observe: function(subject, topic, data) {
    idleService.removeIdleObserver(idleObserver, timeout);
    var nsIAppStartup = Cc["@mozilla.org/toolkit/app-startup;1"].getService(Ci.nsIAppStartup);
    nsIAppStartup.quit(nsIAppStartup.eForceQuit);
  }
};

var gProxyUsername;
var gProxyPassword;

//try {
//  timeout = gPrefBranch.getIntPref("extensions.webconverger.kioskresetstation");
//  if (timeout > 0) {
//    idleService.addIdleObserver(idleObserver, timeout); // timeout is in minutes
//  }
//} catch (ex) {}

var HTTPObserver = {
  observe: function observe(subject, topic, data) {
    switch (topic) {
    case "http-on-modify-request":
      var httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);
      dump("Basic "+ btoa(gProxyUsername + ":" + gProxyPassword));
      httpChannel.setRequestHeader("Proxy-Authorization", "Basic "+ btoa(gProxyUsername + ":" + gProxyPassword), false);
      break;
    }
  }
}

try {
  gProxyUsername = Services.prefs.getCharPref("extensions.webconverger.proxyusername");
  gProxyPassword = Services.prefs.getCharPref("extensions.webconverger.proxypassword");
  Services.obs.addObserver(HTTPObserver, "http-on-modify-request", false);
} catch (e) {}
