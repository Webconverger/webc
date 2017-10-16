var EXPORTED_SYMBOLS = [];

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cr = Components.results;

Components.utils.import("resource://gre/modules/Services.jsm");

const idleService = Cc["@mozilla.org/widget/idleservice;1"].getService(Ci.nsIIdleService)

var timeout = 0;

var idleObserver = {
  observe: function(subject, topic, data) {
    idleService.removeIdleObserver(idleObserver, timeout);
    Services.startup.quit(Services.startup.eForceQuit);
  }
};

var gProxyUsername = null;
var gProxyPassword = null;
var gForceSafeSearch = false;

try {
  timeout = Services.prefs.getIntPref("extensions.webconverger.kioskresetstation");
  if (timeout > 0) {
    idleService.addIdleObserver(idleObserver, timeout); // timeout is in minutes
  }
} catch (ex) {}

var HTTPObserver = {
  observe: function observe(subject, topic, data) {
    switch (topic) {
      case "http-on-modify-request":
        var httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);
        if (gProxyUsername && gProxyPassword) {
          httpChannel.setRequestHeader("Proxy-Authorization", "Basic "+ btoa(gProxyUsername + ":" + gProxyPassword), false);
        }
        if (!gForceSafeSearch) {
          return;
        }
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
  gProxyUsername = Services.prefs.getCharPref("extensions.webconverger.proxyusername");
  gProxyPassword = Services.prefs.getCharPref("extensions.webconverger.proxypassword");
} catch (e) {}
try {
  gForceSafeSearch = Services.prefs.getBoolPref("extensions.webconverger.forcesafesearch");
} catch (ex) {}

Services.obs.addObserver(HTTPObserver, "http-on-modify-request", false);

try {
  Components.utils.import("resource:///modules/UITour.jsm");
  UITour.origOnPageEvent = UITour.onPageEvent;
  UITour.onPageEvent = function(a, b) {
    var aEvent = b;
    if (!aEvent) {
      aEvent = a;
    }
    if (aEvent.detail.action == "resetFirefox") {
      return;
    }
    UITour.origOnPageEvent(a, b);
  }
} catch (e) {}
