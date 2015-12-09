const {classes: Cc, interfaces: Ci, utils: Cu} = Components;

Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://gre/modules/XPCOMUtils.jsm");

function FileBlock() {}

FileBlock.prototype = {
  appDir: null,
  profileDir: null,
  tempDir: null,
  // List of domains for the whitelist
  whitelist: [],
  // Chrome pages that should not be shown
  chromeBlacklist: ["browser", "mozapps", "marionette", "specialpowers",
                    "branding", "alerts"],
  initialize: function() {
    this.appDir = Services.io.newFileURI(Services.dirsvc.get("CurProcD", Ci.nsIFile)).spec;
    var profileDir = Services.dirsvc.get("ProfD", Ci.nsIFile);
    this.profileDir = Services.io.newFileURI(profileDir).spec
    this.tempDir = Services.io.newFileURI(Services.dirsvc.get("TmpD", Ci.nsIFile)).spec;
    try {
      var whitelist = Services.prefs.getCharPref("extensions.webconverger.whitelist");
      this.whitelist = whitelist.split(",");
      for (var i=0; i < this.whitelist.length; i++) {
        this.whitelist[i] = this.whitelist[i].trim();
      }
    } catch(e) {}

    var whitelistFile = profileDir.clone();
    whitelistFile.append("webconverger.whitelist");
    if (!whitelistFile.exists()) {
      return;
    }
    var stream = Cc["@mozilla.org/network/file-input-stream;1"]
                           .createInstance(Ci.nsIFileInputStream);

    stream.init(whitelist, 0x01, 0644, 0);

    var lis = stream.QueryInterface(Components.interfaces.nsILineInputStream);
    var line = {value:null};

    do {
      var more = lis.readLine(line);
      try {
        var file = Cc["@mozilla.org/file/local;1"]
                     .createInstance(Ci.nsILocalFile);
        file.initWithPath(line.value);
        this.whitelist.push(ioService.newFileURI(file).spec.toLowerCase());
      } catch (ex) {
        /* Invalid path */
      }
    } while (more);
    stream.close();
  },
  shouldLoad: function(aContentType, aContentLocation, aRequestOrigin, aContext, aMimeTypeGuess, aExtra) {
    if (!this.appDir) {
      this.initialize();
    }
    // We need to allow access to any files in the profile directory,
    // application directory or the temporary directory. Without these,
    // Firefox won't start
    if (aContentLocation.spec.match(this.profileDir) ||
        aContentLocation.spec.match(this.appDir) ||
        aContentLocation.spec.match(this.tempDir)) {
      return Ci.nsIContentPolicy.ACCEPT;
    }
    // Allow everything on the whitelist first
    if (aContentLocation.scheme == "http" ||
      aContentLocation.scheme == "https") {
      for (var i=0; i< this.whitelist.length; i++) {
        if (aContentLocation.host == this.whitelist[i] ||
            aContentLocation.host.substr(aContentLocation.host.length - this.whitelist[i].length - 1) == "." + this.whitelist[i]) {
          return Ci.nsIContentPolicy.ACCEPT;
        }
      }
    }
    if (aContentLocation.scheme == "chrome") {
      // This prevents loading of chrome files into the browser window
      if (aRequestOrigin &&
          (aRequestOrigin.spec == "chrome://browser/content/browser.xul" ||
          aRequestOrigin.scheme == "moz-nullprincipal")) {
        for (var i=0; i < this.chromeBlacklist.length; i++) {
          if (aContentLocation.host == this.chromeBlacklist[i]) {
            return Ci.nsIContentPolicy.REJECT_REQUEST;
          }
        }
      }
      // All chrome requests come through here, so we have to allow them
      // (Like loading the main browser window for instance)
      return Ci.nsIContentPolicy.ACCEPT;
    }
    // Prevent the loading of resource files into the main browser window
    if (aContentLocation.scheme == "resource") {
      if (aRequestOrigin && aRequestOrigin.scheme == "moz-nullprincipal") {
        return Ci.nsIContentPolicy.REJECT_REQUEST;
      }
      return Ci.nsIContentPolicy.ACCEPT;
    }
    // Only allow these three about URLs
    if (aContentLocation.scheme == "about") {
      if (aContentLocation.spec == "about:" ||
          /^about:certerror/.test(aContentLocation.spec) ||
          /^about:neterror/.test(aContentLocation.spec) ||
          /^about:buildconfig/.test(aContentLocation.spec) ||
          /^about:credits/.test(aContentLocation.spec) ||
          /^about:license/.test(aContentLocation.spec) ||
//          /^about:srcdoc/.test(aContentLocation.spec) || // Needed for Australis
//          /^about:customizing/.test(aContentLocation.spec) || // Needed for Australis
          /^about:blank/.test(aContentLocation.spec)) {
        return Ci.nsIContentPolicy.ACCEPT;
      }
      return Ci.nsIContentPolicy.REJECT_REQUEST;
    }
    // We allow all javascript and data URLs
    if (aContentLocation.scheme == "data" ||
        aContentLocation.scheme == "javascript") {
        return Ci.nsIContentPolicy.ACCEPT;
    }
    // Deny all files
    if (aContentLocation.scheme == "file") {
      return Ci.nsIContentPolicy.REJECT_REQUEST;
    }
    // Allow view source
//    if (aContentLocation.scheme == "view-source") {
//      return Ci.nsIContentPolicy.ACCEPT;
//    }
    // If we had a whitelist, reject everything else
    if (this.whitelist.length > 0) {
      if (aContentType == Ci.nsIContentPolicy.TYPE_DOCUMENT) {
        // Services.prompt.alert(null, "Webconverger", "Not allowed, whitelist only permits: " + this.whitelist.join(", "));
        return Ci.nsIContentPolicy.REJECT_REQUEST;
      }
    }
    // If there is no whitelist, allow everything (because we denied file URLs)
    return Ci.nsIContentPolicy.ACCEPT;
  },
  shouldProcess: function(aContentType, aContentLocation, aRequestOrigin, aContext, aMimeTypeGuess, aExtra) {
    return Ci.nsIContentPolicy.ACCEPT;
  },
  classDescription: "Webconverger FileBlock Service",
  contractID: "@webconverger.com/fileblock-service;1",
  classID: Components.ID('{607c1749-dc0a-463c-96cf-8ec6c3901319}'),
  QueryInterface: XPCOMUtils.generateQI([Ci.nsIContentPolicy])
}

var NSGetFactory = XPCOMUtils.generateNSGetFactory([FileBlock]);
