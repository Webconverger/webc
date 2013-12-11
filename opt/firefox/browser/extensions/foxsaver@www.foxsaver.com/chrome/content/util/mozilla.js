FoxSaver.Util.isCurrentWindowInFront = function() {
    var B;
    try {
        var A = (Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator));
        B = A.getMostRecentWindow("navigator:browser");
        if (B == window) {
            return true
        }
    } catch (C) {
        FoxSaver.log("isCurrent Window (getMostRecentWindow) exception:\n" + C + "\n")
    }
    return false
};
FoxSaver.Util.hasOtherWindows = function() {

  return false; //AGA
   
    var A = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService();
    var C = A.QueryInterface(Components.interfaces.nsIWindowMediator);
    var D = C.getEnumerator(null);
    var B = 0;
    while (D.hasMoreElements() && B<2)
    {
     D.getNext();
     B++
    }
    return B > 1 ? true : false
};
FoxSaver.Util.newTab = function(A) {
    if (!A) {
        A = "chrome://foxsaver/content/slideshow.html"
    }
    var B = gBrowser.addTab(A);
    gBrowser.selectedTab = B;
    return B
};
FoxSaver.Util.isFullScreenOK = function(A) {
    return FoxSaver.Util.isMaximized(A) && !FoxSaver.Util.hasOtherWindows();
};
FoxSaver.Util.isMaximized = function(E) {
    var A = 26;
    var C = E.screenX - E.screen.left > A;
    var B = E.screenY - E.screen.top > A;
    var D = E.screen.availHeight > (E.outerHeight + E.screenY + A);
    var F = E.screen.availWidth > (E.outerWidth + E.screenX + A);
    return !(C || B || D || F)
};
FoxSaver.Util.isMinimized = function(A) {
    return A.outerHeight < 100 || A.outerWidth < 200
};

FoxSaver.Util.isExtensionPresent = function(aGUID)
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
 
 FoxSaver.log("testing for '"+aGUID+"' presence.");
 
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
   {
    result=true;
    FoxSaver.log("found: '"+addon.id+"', named: '"+addon.name+"', version: "+addon.version);
   }
   done=true;
  }

  //getVersion(aGUID, function(ver) {version=ver; done=true});
  getVersion(aGUID, cBack);
  
  var thread=Components.classes["@mozilla.org/thread-manager;1"].getService(Components.interfaces.nsIThreadManager).currentThread;
  while (!done && thread)
   thread.processNextEvent(true);
   
  FoxSaver.log("extension '"+aGUID+(result ? "' present.":"' ABSENT"));
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

FoxSaver.Util.expendToFullerScreen = function(G)
{
 if (!G)
 {
  G = {}
 }
 
 if (!G.toolboxIconSize)
 {
  var D = document.getElementById("navigator-toolbox");
  G.toolboxMode = D.getAttribute("mode");
  G.toolboxIconSize = D.getAttribute("iconsize")
 }
 
 var F = document.getElementById("nav-bar");
 
 if (F)
 {
  F.setAttribute("moz-collapsed", "true")
 }
 
 gBrowser.mPrefs.setBoolPref("browser.tabs.forceHide", true);
 gBrowser.setStripVisibilityTo(false);
 var A = document.getElementById("content");
 var B = null;
 if (A)
 {
  B = document.getAnonymousElementByAttribute(A, "anonid", "strip");
  if (B)
  {
   B.setAttribute("hidden", "true")
  }
 }


 if (!G.fullScreen) 
 {
  if (FoxSaver.Util.isExtensionPresent("vkeyboard@stlouis-shopper.com"))
  {
   try 
   {
    var vkBox=document.getElementById("VKboard_box");
    if (vkBox)
    {
     if (vkBox.hasAttribute("hidden"))
     {
      G.vkBox=true;
      G.vkBoxValue=vkBox.getAttribute("hidden");
      if (G.vkBox!="hidden")
       vkBox.setAttribute("hidden", "true");
     }
    }
   }
   catch (E)
   {
   }
  }
 
  G.fullScreen = window.fullScreen;
  window.fullScreen = true;
  var D = document.getElementById("navigator-toolbox");
  G.display = D.style.display;
  //D.style.display = "none";
  D.style.display = "";
  if (FoxSaver.preference.isHideSidebar())
  {
   try 
   {
     var C = document.getElementById("sidebar-box");
     G.isSidebarCollapsed = document.getElementById("sidebar-box").getAttribute("collapsed") == "true";
     C.setAttribute("moz-collapsed", "true")
   }
   catch (E)
   {
   }
  }
 }
};
FoxSaver.Util.collapseFullerScreen = function(F) {
    if (!F) {
        F = {}
    }
    var D = document.getElementById("nav-bar");
    if (D) {
        D.removeAttribute("moz-collapsed")
    }
    gBrowser.mPrefs.setBoolPref("browser.tabs.forceHide", false);
    gBrowser.setStripVisibilityTo(true);
    var A = document.getElementById("content");
    if (A) {
        node2 = document.getAnonymousElementByAttribute(A, "anonid", "strip");
        if (node2) {
            node2.removeAttribute("hidden")
        }
    }
    
    
	   try 
	   {
	    var vkBox=document.getElementById("VKboard_box");
	    if (F.vkBox && vkBox)
	    {
	     if (vkBox.hasAttribute("hidden"))
       vkBox.setAttribute("hidden", F.vkBoxValue);
	    }
	   }
	   catch (E)
	   {
	   }
    
    try {
        if (FoxSaver.preference.isHideSidebar()) {
            var B = document.getElementById("sidebar-box");
            if (!F.isSidebarCollapsed) {
                B.removeAttribute("moz-collapsed")
            }
        }
        var C = document.getElementById("navigator-toolbox");
        if (F.display) {
            C.style.display = F.display
        } else {
            C.style.display = ""
        }
        window.fullScreen = F.fullScreen ? true : false
    } catch (E) {
    }
    var C = document.getElementById("navigator-toolbox");
    if (F.toolboxIconSize) {
        C.setAttribute("mode", F.toolboxMode);
        C.setAttribute("iconsize", F.toolboxIconSize)
    }
};
FoxSaver.Util.toggleAllButtons = function(D) {
    if (D == null) {
        D = false
    }
    var E = document.getElementById("foxsaver_statusbar_menu_toggle");
    var B = document.getElementById("foxsaver_menu_item_toggle");
    var A = document.getElementById("foxsaver_statusbar_icon");
    if (!E || !B || !A) {
        return false
    }
    var C = (FoxSaver.preference) ? FoxSaver.preference.isFoxSaverEnabled() : true;
    if (!C) {
        if (!D) {
            if (FoxSaver.preference) {
                FoxSaver.preference.enableFoxSaver()
            }
        }
        A.removeAttribute("disabled");
        B.removeAttribute("checked");
        E.removeAttribute("checked");
        return true
    } else {
        if (!D) {
            if (FoxSaver.preference) {
                FoxSaver.preference.disableFoxSaver()
            }
        }
        A.setAttribute("disabled", true);
        B.setAttribute("checked", true);
        E.setAttribute("checked", true);
        return false
    }
    return false
};
FoxSaver.Util.isNoActionOnCurrentPage = function() {
    FoxSaver.log("window.content.opener " + window.content.opener);
    if (FoxSaver.Util.isMinimized(window.content)) {
        return true
    }
    if (FoxSaver.Util.hasLargeFlash(window)) {
        return true
    }
    if (window.content.opener && FoxSaver.Util.hasOtherWindows()) {
        return true
    }
    var C = FoxSaver.preference.getNoActionSites();
    if (!C) {
        return false
    }
    var A = window.content.document.location.href;
    if (!A) {
        return false
    }
    A = A.toLowerCase();
    var D = C.split(/[ \t\n\r\f\v]+/);
    if (!D) {
        return false
    }
    for (var B = 0; B < D.length; B++) {
        if (D[B] && D[B].length > 0 && A.indexOf(D[B].toLowerCase()) > 0) {
            return true
        }
    }
    return false
};
FoxSaver.Util.hasLargeFlash = function() {
    var B = window.content.document.embeds;
    FoxSaver.log("found embeds: " + B);
    if (B != null && B.length > 0) {
        for (var A = 0; A < B.length; A++) {
            if (B[A].type == "application/x-shockwave-flash") {
                FoxSaver.log("flash size = " + B[A].clientWidth + "x" + B[A].clientHeight);
                if (B[A].clientHeight * B[A].clientWidth > 0.08 * window.screen.availWidth * window.screen.availHeight) {
                    return true
                }
            }
        }
    }
    return false
};
FoxSaver.Util.isRightClick = function(B) {
    var A;
    if (!B) {
        B = window.event
    }
    if (B.which) {
        A = (B.which == 3)
    } else {
        if (B.button) {
            A = (B.button == 2)
        }
    }
    return A
};
FoxSaver.Util.localize = function(B) {
    if (!FoxSaver.gStringBundle) {
        try {
            var A = Components.classes["@mozilla.org/intl/stringbundle;1"].getService();
            A = A.QueryInterface(Components.interfaces.nsIStringBundleService);
            FoxSaver.gStringBundle = A.createBundle("chrome://foxsaver/locale/foxsaver.properties")
        } catch (C) {
            FoxSaver.log("FoxSaver.Util.localize:" + C);
            return B
        }
    }
    if (FoxSaver.gStringBundle) {
        try {
            return FoxSaver.gStringBundle.GetStringFromName(B)
        } catch (D) {
            FoxSaver.log(B + "\n" + D);
            return B
        }
    }
    return null
};
FoxSaver.Util.fileBrowse = function(F, D) {
    var E = Components.interfaces.nsIFilePicker;
    var B = Components.classes["@mozilla.org/filepicker;1"].createInstance(E);
    if (F == "open") {
        B.init(window, FoxSaver.Util.localize("Open"), E.modeOpen)
    } else {
        if (F == "save") {
            B.init(window, FoxSaver.Util.localize("SaveAs"), E.modeSave)
        } else {
            if (F == "folder") {
                B.init(window, FoxSaver.Util.localize("SelectFolder"), E.modeGetFolder)
            }
        }
    }
    B.appendFilters(E.filterText | E.filterHTML | E.filterXML | E.filterAll);
    if (D && D.exists()) {
        B.displayDirectory = D;
        if (D.isFile()) {
            B.defaultString = D.leafName
        }
    }
    var C = B.show();
    if (C == E.returnOK || E.returnReplace) {
        var A = B.file;
        return A
    } else {
        return false
    }
};
FoxSaver.Util.getCacheService = function() {
    var B = Components.classes["@mozilla.org/network/cache-service;1"];
    var A = B.getService(Components.interfaces.nsICacheService);
    return A
};
FoxSaver.Util.createCacheSession = function(F, E, B) {
    var D = null;
    if (E == null) {
        E = 0
    }
    if (B == null) {
        B = true
    }
    try {
        switch (F) {
            case"FTP":
                if (!FoxSaver.Util.ftpSession) {
                    var A = FoxSaver.Util.getCacheService();
                    FoxSaver.Util.ftpSession = A.createSession("FTP", E, B)
                }
                D = FoxSaver.Util.ftpSession;
                break;
            case"HTTP":
                if (!FoxSaver.Util.httpSession) {
                    var A = FoxSaver.Util.getCacheService();
                    FoxSaver.Util.httpSession = A.createSession("HTTP", E, B)
                }
                D = FoxSaver.Util.httpSession;
            case"image":
                if (!FoxSaver.Util.imageSession) {
                    var A = FoxSaver.Util.getCacheService();
                    FoxSaver.Util.imageSession = A.createSession("HTTP", E, B)
                }
                D = FoxSaver.Util.imageSession;
                break
            }
    } catch (C) {
        FoxSaver.log("FoxSaver.Util.createCacheSession:" + C)
    }
    return D
};
FoxSaver.Util.clearAllCacheEntries = function(E) {
    try {
        if (E) {
            var A = FoxSaver.Util.createCacheSession("HTTP", Components.interfaces.nsICache.STORE_ANYWHERE, true);
            if (A) {
                A.evictEntries()
            }
            var D = FoxSaver.Util.createCacheSession("FTP", Components.interfaces.nsICache.STORE_ANYWHERE, true);
            if (D) {
                D.evictEntries()
            }
        }
        var C = FoxSaver.Util.createCacheSession("image", Components.interfaces.nsICache.STORE_ANYWHERE, true);
        if (C) {
            C.evictEntries()
        }
    } catch (B) {
    }
};
FoxSaver.Util.openCacheEntry = function(A, F) {
    var G = null;
    if (A && A.toLowerCase().indexOf("ftp://") == 0) {
        G = "FTP"
    }
    if (A && A.toLowerCase().indexOf("http://") == 0) {
        G = "HTTP"
    }
    if (!G) {
        return null
    }
    if (!F) {
        F = Components.interfaces.nsICache.ACCESS_READ
    }
    var E = FoxSaver.Util.createCacheSession(G, Components.interfaces.nsICache.STORE_ANYWHERE, true);
    if (!E) {
        return null
    }
    try {
        E.doomEntriesIfExpired = false;
        var C = FoxSaver.Util.getIOService().newURI(A, null, null);
        var B = E.openCacheEntry(C.spec, F, true);
        return B
    } catch (D) {
    }
    return null
};
FoxSaver.Util.copyFileFromCacheEntry = function(A, C, B) {
    var D = false;
    if (A) {
        switch (A.deviceID) {
            case"disk":
                if (FoxSaver.FileIO._cpFromFileHanlde(A.file, C, B)) {
                    D = true
                }
                break;
            case"memory":
                break;
            default:
                break
            }
    }
    return D
};
FoxSaver.Util.wrapInputStream = function(C) {
    var A = Components.interfaces.nsIScriptableInputStream;
    var B = Components.classes["@mozilla.org/scriptableinputstream;1"];
    var D = B.createInstance(A);
    D.init(C);
    return D
};
FoxSaver.Util.getIOService = function() {
    var B = Components.classes["@mozilla.org/network/io-service;1"];
    var A = B.getService(Components.interfaces.nsIIOService);
    return A
};
FoxSaver.Util.downloadHTTP = function(B) {
    var E = FoxSaver.Util.getIOService();
    var D = E.newURI(B, null, null);
    var C = E.newChannelFromURI(D);
    var A = FoxSaver.Util.wrapInputStream(C.open());
    var F = A.read(A.available());
    A.close();
    return F
};
FoxSaver.Util.read = function(B) {
    var C = B.toString();
    var E = FoxSaver.Util.openCacheEntry(C, Components.interfaces.nsICache.ACCESS_READ);
    var A = FoxSaver.Util.wrapInputStream(E.transport.openInputStream(0, -1, 0));
    var D = A.read(A.available());
    A.close();
    E.close();
    return D
};
FoxSaver.Util.readMetaData = function(A, D) {
    var C = A.toString();
    var E = FoxSaver.Util.openCacheEntry(C, Components.interfaces.nsICache.ACCESS_READ);
    var B = E.getMetaDataElement(D);
    E.close();
    return B
};
FoxSaver.Util.doom = function(B) {
    try {
        var C = B.toString();
        var E = FoxSaver.Util.createCacheSession("image");
        var A = E.openCacheEntry(C, Components.interfaces.nsICache.ACCESS_READ_WRITE, true);
        if (A) {
            A.doom();
            A.close()
        }
    } catch (D) {
    }
};
FoxSaver.Util.write = function(C, F) {
    var D = C.toString();
    var A = FoxSaver.Util.openCacheEntry(D, Components.interfaces.nsICache.ACCESS_WRITE);
    var B = A.transport.openOutputStream(0, -1, 0);
    var E = B.write(F, F.length);
    A.setMetaDataElement("size", F.length);
    B.close();
    A.markValid();
    A.close();
    return E
};
FoxSaver.Util.clearFSLocalFolder = function() {
    var D = FoxSaver.Util.getCachePath();
    if (!D) {
        return
    }
    var C = FoxSaver.DirIO.open(D);
    var A = FoxSaver.DirIO.read(C, false, 1), B;
    var E = function(G) {
        if (!G || !G.lastModifiedTime) {
            return 0
        }
        return G.lastModifiedTime
    };
    var F = function(H, G) {
        return(E(G) - E(H))
    };
    if (A) {
        A.sort(F);
        for (B = 100; B < A.length; ++B) {
            FoxSaver.FileIO.unlink(A[B])
        }
    }
}