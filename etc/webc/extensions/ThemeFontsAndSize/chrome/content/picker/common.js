var themefontsizechangerrainbowColorStorage = {}; Components.utils.import('resource://themefontsizechanger/colorStorage.js', themefontsizechangerrainbowColorStorage);

var themefontsizechangerrainbowc = {

  prefs :  Components.classes['@mozilla.org/preferences-service;1']
           .getService(Components.interfaces.nsIPrefService)
           .getBranch("extensions.themefontsizechanger."),

  prefService : Components.classes['@mozilla.org/preferences-service;1']
             .getService(Components.interfaces.nsIPrefBranch2),

  storage : themefontsizechangerrainbowColorStorage.ColorStorageService,

  observers : Components.classes["@mozilla.org/observer-service;1"]
              .getService(Components.interfaces.nsIObserverService),

  wm : Components.classes["@mozilla.org/appshell/window-mediator;1"]
       .getService(Components.interfaces.nsIWindowMediator),

  get : function(id) {
    return document.getElementById(id);
  },

  toDate : function(date) {
    var dateStr = (new Date(date)).toDateString();
    var dateRegex = /^(.*?) (.*)$/;
    var result = dateStr.match(dateRegex);
    if(result)
      return result[2];
  },

  getString : function(string, variable) {
    var strings = document.getElementById("themefontsizechangerrainbow-strings");
    if(variable)
      return strings.getFormattedString(string, [variable]);
    return strings.getString(string);
  },

  getFormattedColors : function(colors) {
    var format = themefontsizechangerrainbowc.prefs.getCharPref("format");
    var whole = themefontsizechangerrainbowc.prefs.getBoolPref("wholeNumbers");

    var formatted = [];
    for(var i = 0; i < colors.length; i++)
      formatted.push(colorCommon.formatColor(colors[i], format, whole));
    return formatted;
  },

  getFormattedColor : function(color, format) {
    if(!format)     
      format = themefontsizechangerrainbowc.prefs.getCharPref("format");
    var whole = themefontsizechangerrainbowc.prefs.getBoolPref("wholeNumbers");
    return colorCommon.formatColor(color, format, whole);
  },

  copyColor : function(color, format) {
    if(!format) {
      if(themefontsizechangerrainbowc.prefs.getBoolPref("copyDifferent"))
        format = themefontsizechangerrainbowc.prefs.getCharPref("copyFormat");
      else
        format = themefontsizechangerrainbowc.prefs.getCharPref("format");
    }
    var whole = false;
    themefontsizechangerrainbowc.copy(colorCommon.formatColor(color, format, whole));
  },

  copyColors : function(colors, format) { 
    if(!format) {
      if(themefontsizechangerrainbowc.prefs.getBoolPref("copyDifferent"))
        format = themefontsizechangerrainbowc.prefs.getCharPref("copyFormat");
      else
        format = themefontsizechangerrainbowc.prefs.getCharPref("format");
    }
    var whole = false;
    var formatted = [];
    for(var i = 0; i < colors.length; i++)
      formatted.push(colorCommon.formatColor(colors[i], format, whole));
    themefontsizechangerrainbowc.copy(formatted.join(", "));
  },

  getFirefoxVersion : function() {
    var appinfo = Components.classes["@mozilla.org/xre/app-info;1"]
                  .getService(Components.interfaces.nsIXULAppInfo);
    return parseFloat(appinfo.version);   
  },

  getPlatform : function() {
    var runtime = Components.classes["@mozilla.org/xre/app-info;1"]
                  .getService(Components.interfaces.nsIXULRuntime);
    switch(runtime.OS) {
      case("WINNT"):
       return "Windows";
      case("Darwin"):
       return "Mac";
      default:
       return runtime.OS;
    }
  },

  copy : function(string) {
    var clipboard = Components.classes["@mozilla.org/widget/clipboardhelper;1"]
	                .getService(Components.interfaces.nsIClipboardHelper);
    clipboard.copyString(string);
  },
  
  getChromeWindow : function(win) {
     return win.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
           .getInterface(Components.interfaces.nsIWebNavigation)
           .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
           .rootTreeItem
           .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
           .getInterface(Components.interfaces.nsIDOMWindow)
           .QueryInterface(Components.interfaces.nsIDOMChromeWindow);
  },

  getPixel : function(event) {
    var win = event.target.ownerDocument.defaultView;

    var pageX = event.clientX + win.scrollX;
    var pageY = event.clientY + win.scrollY;

    return themefontsizechangerrainbowc.getWindowPixel(win, pageX, pageY);
  },

  getWindowPixel : function(win, x, y) {
    var canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
    canvas.width = 1;
    canvas.height = 1;
    var context = canvas.getContext("2d");

    context.drawWindow(win, x, y, 1, 1, "white");
    var data = context.getImageData(0, 0, 1, 1).data;
    return "rgb(" + data[0] + "," + data[1] + "," + data[2] + ")";
  },

  getBgColor : function(event) {
    var element = event.target;
    var win = element.ownerDocument.defaultView;
    do {
      var style = win.getComputedStyle(element, null);
      if(style.backgroundColor != "transparent") {
        return style.backgroundColor; }
      if(style.position != "static")// can't get bg color of positioned elements
        return themefontsizechangerrainbowc.getBg(event);
      element = element.parentNode;
    } while(element.parentNode != element
           && element.nodeType == Node.ELEMENT_NODE)
    return "#FFFFFF";
  },

  getBg : function(event) {
     // should really use canvas to compute background color
     return themefontsizechangerrainbowc.getPixel(event);
  },

  textColorAffects : function(element) {
    if(element.nodeType == Node.TEXT_NODE &&
       !/^\s*$/.test(element.nodeValue))
      return true;

    var affects = false;
    var win = element.ownerDocument.defaultView;
    if(element.nodeType == Node.ELEMENT_NODE)
      var parentColor = win.getComputedStyle(element, null).color;

    for(var i = 0; i < element.childNodes.length; i++) {
      var child = element.childNodes[i];

      let childColor;
      if(child.nodeType == Node.ELEMENT_NODE)
        childColor = win.getComputedStyle(child, null).color;
      // if the color is different than the parent then it defined it's own color
      // child.style.color only checks that the inline style was changed
      if(themefontsizechangerrainbowc.textColorAffects(child)
         && (!childColor || !parentColor || (childColor == parentColor))) {
        affects = true;
       }
    }
    return affects;
  },

  elementString : function(element) {
    var string = element.nodeName.toLowerCase();
    if(element.nodeType == Node.ELEMENT_NODE) {
      if(element.id)
        string += "#" + element.id
      else if(element.classList && element.classList.length)
        string += "." + element.classList[0];
    }
    return string;
  },

  openPanel : function(panel, loc, width, height) {
    var browser = document.getElementById("content");
    var content = browser.mPanelContainer.boxObject;
    panel.style.backgroundColor = "white";
    
    var anchor = document.getElementById("addon-bar")
      || document.getElementById("status-bar");
    
    var x, y;
    switch(loc) {
      case 'nw':
        x = content.screenX;
        y = content.screenY;
        panel.openPopupAtScreen(x, y, false);
        break;
      case 'ne':
        x = content.screenX + browser.contentWindow.innerWidth - width;
        y = content.screenY;
        panel.openPopupAtScreen(x, y, false);
        break;
      case 'sw':
       if(themefontsizechangerrainbowc.getPlatform() == "Linux") {
         x = content.screenX;
         y = content.screenY + browser.contentWindow.innerHeight - height;
         panel.openPopupAtScreen(x, y, false);
       }
       else
         panel.openPopup(anchor, "before_start", 0, 0);
       break;
      case 'se':
       if(themefontsizechangerrainbowc.getPlatform() == "Linux") {
         x = content.screenX + browser.contentWindow.innerWidth - width;
         y = content.screenY + browser.contentWindow.innerHeight - height;
         panel.openPopupAtScreen(x, y, false);
       }
       else
         panel.openPopup(anchor, "before_end", 0, 0);
       break;
    }
  },

  preventEvents : function (win, events) {
    for(var i = 0; i < events.length; i++)
      win.addEventListener(events[i], themefontsizechangerrainbowc.prevent, true); 
  },

  allowEvents : function(win, events) {
    for(var i = 0; i < events.length; i++)
      win.removeEventListener(events[i], themefontsizechangerrainbowc.prevent, true); 
  },

  prevent : function (event) {
    if(event.target.nodeName != "HTML") { // allow scroll
      event.preventDefault();
      event.stopPropagation();
    }
  },

  getStyleSheetByTitle : function(title) {
    var sheets = document.styleSheets;
    for(let i = 0; i < sheets.length; i++) {
      if(sheets[i].title == title)
        return sheets[i];
    }
  },

  registerSheet : function(sheet) {
    /* add a user style sheet that applies to all documents */
    var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"]
              .getService(Components.interfaces.nsIStyleSheetService);
    var ios = Components.classes["@mozilla.org/network/io-service;1"]
              .getService(Components.interfaces.nsIIOService);
    var uri = ios.newURI(sheet, null, null);
    if(!sss.sheetRegistered(uri, sss.AGENT_SHEET))
      sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET); 
  },

  unregisterSheet : function(sheet) {
    var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"]
              .getService(Components.interfaces.nsIStyleSheetService);
    var ios = Components.classes["@mozilla.org/network/io-service;1"]
              .getService(Components.interfaces.nsIIOService);
    var uri = ios.newURI(sheet, null, null);
    if(sss.sheetRegistered(uri, sss.AGENT_SHEET))
      sss.unregisterSheet(uri, sss.AGENT_SHEET);
  },

  /* inserts a rule for this tree cell property */
  addCellProperty : function(sheet, property, decl) {
    var rule = "treechildren::-moz-tree-cell(" + property + ")" + decl;
    sheet.insertRule(rule, 0);
  },

  openLibrary : function(color) {
    var library = themefontsizechangerrainbowc.wm.getMostRecentWindow("themefontsizechangerrainbow:library")
                  || window.openDialog("chrome://themefontsizechanger/content/library/library.xul",
                       "themefontsizechangerrainbow:library", "chrome,all,dialog=yes", color);
    library.focus();
  },

  openPicker : function(color) {
     var color = colorCommon.isValid(color) ? colorCommon.toHex(color) : '';
     window.openDialog("chrome://themefontsizechanger/content/picker/picker.xul",
                      "", "chrome,all,dialog=yes", color);
  },

  openPrefs : function() {
    window.openDialog("chrome://themefontsizechanger/content/options.xul",
                      "", "chrome,all,dialog=yes");
  },
  
  mapWindows : function(callback) {
    var enumerator =  themefontsizechangerrainbowc.wm.getEnumerator("navigator:browser");
    while(enumerator.hasMoreElements()) {
      var win = enumerator.getNext().QueryInterface(Components.interfaces.nsIDOMWindow);
      themefontsizechangerrainbowc.mapNestedFrames(win, callback);
    }
  },
  
  mapNestedFrames : function(win, callback) {
    for (var i = 0; i < win.frames.length; i++) {
      var frame = win.frames[i].QueryInterface(Components.interfaces.nsIDOMWindow);
      callback(frame);
      themefontsizechangerrainbowc.mapNestedFrames(frame, callback);
    }
  },
}

themefontsizechangerrainbowc.prefs.QueryInterface(Components.interfaces.nsIPrefBranch2); // for addObserver

