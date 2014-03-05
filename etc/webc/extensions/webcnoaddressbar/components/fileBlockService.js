const IFileBlock = Components.interfaces.IFileBlock;

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cr = Components.results;

const ioService = Cc["@mozilla.org/network/io-service;1"]
                    .getService(Ci.nsIIOService);
const observerService = Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService);

Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");

function isExtensionPresent(aGUID)
{
 var result=false;
 var done=false;
 /*if (navigator.plugins)
 {
  for (var i=0; i<navigator.plugins.length && result==false; i++)
  {
   result=(navigator.plugins[i].name==A);
  }
 }*/
 
 try
 {
  // Firefox 4 and later; Mozilla 2 and later
  function getVersion(addonID, callback)
  {
   var ascope={};

   if (typeof(Components.classes["@mozilla.org/extensions/manager;1"])!='undefined')
   {
    var extMan=Components.classes["@mozilla.org/extensions/manager;1"].getService(Components.interfaces.nsIExtensionManager);
    var ext=extMan.getItemForID(addonID);
    ext.QueryInterface(Components.interfaces.nsIUpdateItem);
    callback(ext);
    return;
   }
 
   if (typeof(Components.utils)!='undefined' && typeof(Components.utils.import)!='undefined')
    Components.utils.import("resource://gre/modules/AddonManager.jsm", ascope);
   
   ascope.AddonManager.getAddonByID(addonID, callback);
  }
  
  function cBack(addon)
  {
   if (addon)
    result=true;
   
   done=true;
  }

  //getVersion(aGUID, function(ver) {version=ver; done=true});
  getVersion(aGUID, cBack);
  
  var thread=Components.classes["@mozilla.org/thread-manager;1"].getService(Components.interfaces.nsIThreadManager).currentThread;
  while (!done && thread)
   thread.processNextEvent(true);
   
 }
 catch (ex)
 {
  // Firefox 3.6 and before; Mozilla 1.9.2 and before
  var extMan=Components.classes["@mozilla.org/extensions/manager;1"].getService(Components.interfaces.nsIExtensionManager);
  var ext=extMan.getItemForID(addonID);
  if (typeof(ext)!='undefined')
  {
   //ext.QueryInterface(Components.interfaces.nsIUpdateItem);
   result=true;
  }
 }

 return result;
};

function FileBlock() {
}

FileBlock.prototype = {
  profileDir: null,
  appDir: null,
  tempDir: null,
  whitelist: [],
  log: function(string) {
    var aConsoleService = Cc["@mozilla.org/consoleservice;1"].getService(Ci.nsIConsoleService);   
    aConsoleService.logStringMessage(string);
  },

  initializeDirectories: function() {
    var profileDir = Cc["@mozilla.org/file/directory_service;1"]
                  .getService(Ci.nsIProperties)
                  .get("ProfD", Ci.nsILocalFile);

    this.profileDir = ioService.newFileURI(profileDir).spec;

    var whitelist = profileDir;
    whitelist.append("webconverger.whitelist");
    if (whitelist.exists()) {
      var stream = Components.classes["@mozilla.org/network/file-input-stream;1"]
                             .createInstance(Components.interfaces.nsIFileInputStream);
    
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
    }

    var tempDir = Cc["@mozilla.org/file/directory_service;1"]
                  .getService(Ci.nsIProperties)
                  .get("TmpD", Ci.nsILocalFile);

    this.tempDir = ioService.newFileURI(tempDir).spec;
    var appDir = Cc["@mozilla.org/file/directory_service;1"]
                  .getService(Ci.nsIProperties)
                  .get("CurProcD", Ci.nsILocalFile);

    this.appDir = ioService.newFileURI(appDir).spec;
    
    if (isExtensionPresent("foxsaver@www.foxsaver.com"))
     this.whitelist.push(this.profileDir+"foxsaver\/cache\/");
    
  },

  shouldLoad: function(aContentType, aContentLocation, aRequestOrigin, aContext, aMimeTypeGuess, aExtra) {
    if (!this.profileDir) {
      this.initializeDirectories();
    }
    /* Allow anything on the whitelist */
    if (this.whitelist.length > 0) {
      for (var i=0; i < this.whitelist.length; i++) {
        if (aContentLocation.spec.toLowerCase().match(this.whitelist[i])) {
          return Ci.nsIContentPolicy.ACCEPT;
        }
      }
    }
    /* Allow profile dir, temp dir, and application dir */
    if (aContentLocation.spec.match(this.profileDir) ||
          aContentLocation.spec.match(this.appDir) ||
          aContentLocation.spec.match(this.tempDir)) {
      return Ci.nsIContentPolicy.ACCEPT;
    }
    /* Reject anything with a file protocol */
    if (aContentLocation.scheme == "file") {
        return Ci.nsIContentPolicy.REJECT_REQUEST;
    }
    return Ci.nsIContentPolicy.ACCEPT;
  },
  shouldProcess: function(aContentType, aContentLocation, aRequestOrigin, aContext, aMimeTypeGuess, aExtra) {
    if (!this.profileDir) {
      this.initializeDirectories();
    }
    if (!this.profileDir) {
      this.initializeDirectories();
    }
    /* Allow anything on the whitelist */
    if (this.whitelist.length > 0) {
      for (var i=0; i < this.whitelist.length; i++) {
        if (aContentLocation.spec.match(this.whitelist[i])) {
          return Ci.nsIContentPolicy.ACCEPT;
        }
      }
    }
    /* Allow profile dir, temp dir, and application dir */
    if (aContentLocation.spec.match(this.profileDir) ||
          aContentLocation.spec.match(this.appDir) ||
          aContentLocation.spec.match(this.tempDir)) {
      return Ci.nsIContentPolicy.ACCEPT;
    }
    /* Reject anything with a file protocol */
    if (aContentLocation.scheme == "file") {
        return Ci.nsIContentPolicy.REJECT_REQUEST;
    }
    return Ci.nsIContentPolicy.ACCEPT;
  },
  classDescription: "FileBlock Service",
  contractID: "@webconverger.com/fileblock-service;1",
  classID: Components.ID('{607c1749-dc0a-463c-96cf-8ec6c3901319}'),
  QueryInterface: XPCOMUtils.generateQI([Ci.IFileBlock, Ci.nsIContentPolicy]),
  _xpcom_categories: [
    {
      category: "content-policy"
    }
  ]
}

if (XPCOMUtils.generateNSGetFactory)
  var NSGetFactory = XPCOMUtils.generateNSGetFactory([FileBlock]);
else
  var NSGetModule = XPCOMUtils.generateNSGetModule([FileBlock]);
