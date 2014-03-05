Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");

function FontSizeChangerStartup(){}
FontSizeChangerStartup.prototype={
   QueryInterface: function(aIID) {
    if(!aIID.equals(COIN.nsISupports) && !aIID.equals(COIN.nsIObserver)) throw CORE.NS_ERROR_NO_INTERFACE;
    return this;
  },
  classID: Components.ID("{4cc56fc1-f5df-464d-a6c4-a72b2c4198f2}"),
  classDescription: "FontSizeChanger Startup",  
  contractID: "@themefontsizechanger/startup;1",
  xpcomobserversadded:false,
  getContextCSS:function(fontcolor,backgrouncolor){

	if(fontcolor=="-moz-use-system-font" && backgrouncolor=="-moz-use-system-font") return "";
	
	var rawcss="@namespace url(http://www.w3.org/1999/xhtml);\n@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);\n\n.menu-accel-container { display: none !important; }\n\nmenupopup, context-menu, menupopup > menu > menupopup,\n#BMB_bookmarksPopup .arrowscrollbox-scrollbox, #bookmarksMenuPopup\n{ -moz-appearance: none !important;\nmax-height: 800px !important;\noverflow-y: auto !important; }\n\n#bookmarksMenuPopup .arrowscrollbox-scrollbox\n{ overflow-y: auto !important;\npadding-bottom: 10px !important; }\n\nmenupopup, context-menu, menupopup > menu > menupopup\n{ -moz-appearance: none!important; \nbackground: /*BACKGROUNDCOLOR*/ no-repeat !important;\nfont-size: 13px !important;\nborder-radius: 2px !important; \npadding: 0 !important;\n}\n\n.menu-right\n{ margin: -5px 0 !important; }\n\nmenupopup menu,\nmenupopup menuitem, \npanel, popup > menu, .splitmenu-menuitem, \n#PlacesChevronPopup .menu-iconic.bookmark-item, #interclue-state-popup menuitem\n{ -moz-appearance: none !important;\nborder: 1px solid transparent !important; \nfont-size: 13px !important; \ncolor: /*FONTCOLOR*/ !important;\n}\n\nmenupopup .popup-internal-box,\n#appmenuPrimaryPane menupopup .popup-internal-box,\n#appmenuSecondaryPane menupopup .popup-internal-box,\n#appmenuPrimaryPane menupopup,\n#appmenuSecondaryPane,\n.menuitem-iconic.interclue-selected\n{ padding: 3px !important;\nbackground: /*BACKGROUNDCOLOR*/ no-repeat !important;\nborder: 1px solid rgba(10,10,10, .5) !important; }\n\nmenubar > menu:hover, menubar > menu:focus,  \n.splitmenu-menu:hover, .splitmenu-menuitem:hover, \nmenupopup menuitem:hover, menupopup menu:hover, \npopup menu:hover, popup menuitem:hover,\nmenuitem:hover,\nmenupopup > menu:hover,menupopup > menu:focus, \npopup > menu:focus, popup > menu:hover,\n#appmenuPrimaryPane menu:hover,\n#appmenuSecondaryPane menu:hover,\n#appmenu_webDeveloper:hover, \n#appmenu_charsetMenu:hover,\n#nightly-appmenu:hover,\n#mmsearchpopupsearchengine menuitem:hover,\n.menuitem-iconic.menu-iconic.mmsearch_freesearch.mmsearch_freesearch-group:hover\n{ -moz-appearance: none !important;\nbackground: /*FONTCOLOR*/ no-repeat !important;\nborder-radius: 3px !important;\nborder: 1px solid rgba(10,10,10,.1) !important; \ncolor: /*BACKGROUNDCOLOR*/ !important;\n}\n\nmenu[_moz-menuactive=\"true\"],\nmenuitem[_moz-menuactive=\"true\"],\n.splitmenu-menuitem[_moz-menuactive=\"true\"]\n{ background-color: transparent !important;\nbox-shadow: none !important; }\n\nmenupopup, popup, context-menu\n{ border: 1px solid transparent !important; }\n\nmenu.menu-iconic > .menu-iconic-left,\nmenuitem.menuitem-iconic > .menu-iconic-left,\n.splitmenu-menuitem[iconic=\"true\"] > .menu-iconic-left\n{ -moz-appearance: none !important;\npadding-top: 0px !important;}\n\n#appmenu-popup .popup-internal-box\n{\nborder: none !important; }\n\n#appmenuPrimaryPane,\n#appmenuSecondaryPane\n{\nbackground: /*BACKGROUNDCOLOR*/ no-repeat !important;\nbox-shadow: inset rgba(0,0,0, 0.3) 1px 6px 16px 2px  !important;\nborder-radius: 3px !important;\nborder: 1px solid rgba(0,0,0,.3) !important; }\n\n#appmenu-popup menu>.menu-right\n{ padding: 0 !important;\nmargin-left: -2px !important; }\n\n.splitmenu-menuitem, .splitmenu-menu\n{ -moz-appearance: none !important; \nbackground: none !important;\n}\n\n.splitmenu-menu:hover, .splitmenu-menuitem:hover{ \n background: /*FONTCOLOR*/ no-repeat !important;\n color: /*BACKGROUNDCOLOR*/ !important;\n}\n\n/*GLOBAL CASCADE WORKAROUNDS*/\nmenubar > menu:hover > *,  \n.splitmenu-menu:hover > *, .splitmenu-menuitem:hover > *, \nmenupopup menuitem:hover > *, menupopup menu:hover > *, \npopup menu:hover > *, popup menuitem:hover > *,\nmenuitem:hover > *,\nmenupopup > menu:hover > *, popup > menu:hover > *,\n#appmenuPrimaryPane menu:hover > *,\n#appmenuSecondaryPane menu:hover > *,\n#appmenu_webDeveloper:hover > *, \n#appmenu_charsetMenu:hover > *,\n#nightly-appmenu:hover > *,\n#mmsearchpopupsearchengine menuitem:hover > *,\n.menuitem-iconic.menu-iconic.mmsearch_freesearch.mmsearch_freesearch-group:hover > * { \n color: /*BACKGROUNDCOLOR*/ !important;\n}\n\n#appmenu_webDeveloper:hover {\nborder: none !important;\n}";
	
	/*FONTCOLOR*/
	if(fontcolor=="-moz-use-system-font") rawcss=rawcss.replace(/color: \/\*FONTCOLOR\*\/ !important;/g,"").replace(/background: \/\*FONTCOLOR\*\/ no-repeat !important;/g,"");
	else {
	
		rawcss=rawcss.replace(/color: \/\*FONTCOLOR\*\/ !important;/g,"color: "+fontcolor+" !important;");
		
		if(backgrouncolor=="-moz-use-system-font") rawcss=rawcss.replace(/background: \/\*FONTCOLOR\*\/ no-repeat !important;/g,"");
		else rawcss=rawcss.replace(/background: \/\*FONTCOLOR\*\/ no-repeat !important;/g,"background: "+fontcolor+" no-repeat !important;");
		
	}
	
	/*BACKGROUNDCOLOR*/
	if(backgrouncolor=="-moz-use-system-font") rawcss=rawcss.replace(/background: \/\*BACKGROUNDCOLOR\*\/ no-repeat !important;/g,"").replace(/color: \/\*BACKGROUNDCOLOR\*\/ !important;/g,"");
	else {
	
		rawcss=rawcss.replace(/background: \/\*BACKGROUNDCOLOR\*\/ no-repeat !important;/g,"background: "+backgrouncolor+" no-repeat !important;");
		
		if(fontcolor=="-moz-use-system-font") rawcss=rawcss.replace(/color: \/\*BACKGROUNDCOLOR\*\/ !important;/g,"");
		else rawcss=rawcss.replace(/color: \/\*BACKGROUNDCOLOR\*\/ !important;/g,"color: "+backgrouncolor+" !important;");
	
	}
	
	return rawcss;
	
  },
  observe: function(aSubject,aTopic,aData) {
    switch(aTopic) {
      case "xpcom-startup":
       
        var observerService = COCL["@mozilla.org/observer-service;1"].getService(COIN.nsIObserverService);
        //observerService.addObserver(this,"quit-application",false);        
		observerService.addObserver(this,"profile-after-change",false);
		//observerService.addObserver(this,"quit-application-requested",false);
		this.xpcomobserversadded=true;
	
		break;
      case "profile-after-change":
	  
		   if(!this.xpcomobserversadded){
				var observerService = COCL["@mozilla.org/observer-service;1"].getService(COIN.nsIObserverService);
				observerService.addObserver(this,"quit-application",false);        
				//observerService.addObserver(this,"profile-after-change",false);
				observerService.addObserver(this,"quit-application-requested",false);
			}

			var size = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch).getCharPref("extensions.themefontsizechanger.currentfontsize");

			var fontfamily = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch).getCharPref("extensions.themefontsizechanger.currentfontfamily");

			var fontstyle = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch).getCharPref("extensions.themefontsizechanger.currentfontstyle");

			var fontweight = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch).getCharPref("extensions.themefontsizechanger.currentfontweight");
			
			var fontcolor = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch).getCharPref("extensions.themefontsizechanger.currentfontcolor");

			var backgroundcolor = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch).getCharPref("extensions.themefontsizechanger.currentbackgroundcolor");			
						
			var sss = Components.classes['@mozilla.org/content/style-sheet-service;1'].getService(Components.interfaces.nsIStyleSheetService);
			var ios = Components.classes['@mozilla.org/network/io-service;1'].getService(Components.interfaces.nsIIOService);
			var css = '@namespace url("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul");\n'
			+'@namespace html url("http://www.w3.org/1999/xhtml");\n'
			+'@namespace svg url("http://www.w3.org/2000/svg");\n'
			+'* {'
			+(size=="-moz-use-system-font" ? "" : 'font-size: '+ size + "px"+' !important;')
			+(fontfamily=="-moz-use-system-font" ? "" : "font-family:" + fontfamily + ' !important;')
			+(fontstyle=="-moz-use-system-font" ? "" : "font-style:" + fontstyle + ' !important;')
			+(fontweight=="-moz-use-system-font" ? "" : "font-weight:" + fontweight + ' !important;')	
			+(fontcolor=="-moz-use-system-font" ? "" : "color:" + fontcolor + ' !important;')
									
			+'}';
		
			if(Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch).getBoolPref("extensions.themefontsizechanger.contextmenuenabled")) var contextCSS=this.getContextCSS(fontcolor,backgroundcolor);
			else var contextCSS="";		
		
			var uri = ios.newURI('data:text/css,' + encodeURIComponent(css + contextCSS), null, null);
			if (!sss.sheetRegistered(uri, sss.USER_SHEET)) {
				sss.loadAndRegisterSheet(uri, sss.USER_SHEET);
			}	
			
			var themefontsizechangerprefsinstance = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
			var themefontsizechangersbiconhide = themefontsizechangerprefsinstance.getBoolPref("extensions.themefontsizechanger.sbiconhide");
			if (themefontsizechangersbiconhide) {
				var sss = Components.classes['@mozilla.org/content/style-sheet-service;1'].getService(Components.interfaces.nsIStyleSheetService);
				var ios = Components.classes['@mozilla.org/network/io-service;1'].getService(Components.interfaces.nsIIOService);
				var css = "@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);#themefontsizechanger-statusbar {display: none !important;}";
				var uri = ios.newURI("data:text/css," + encodeURIComponent(css), null, null);
				sss.loadAndRegisterSheet(uri, sss.USER_SHEET);
			}
		
			var themefontsizechangerprefsinstance = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
			var isThemeDefault = themefontsizechangerprefsinstance.getCharPref("general.skins.selectedSkin") == "classic/1.0";
			if (!isThemeDefault) {
				var sss2 = Components.classes['@mozilla.org/content/style-sheet-service;1'].getService(Components.interfaces.nsIStyleSheetService);
				var ios2 = Components.classes['@mozilla.org/network/io-service;1'].getService(Components.interfaces.nsIIOService);
				var css2 = "@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);#tfsc-backgroundcolor-groupbox {display: none !important;}";
				var uri2 = ios2.newURI("data:text/css," + encodeURIComponent(css2), null, null);
				sss2.loadAndRegisterSheet(uri2, sss2.USER_SHEET);
			}			
			
			/*
			var themefontsizechangertoolsmnhide = themefontsizechangerprefsinstance.getBoolPref("extensions.themefontsizechanger.toolsmnhide");
			if (!themefontsizechangertoolsmnhide) {
				sss = Components.classes['@mozilla.org/content/style-sheet-service;1'].getService(Components.interfaces.nsIStyleSheetService);
				ios = Components.classes['@mozilla.org/network/io-service;1'].getService(Components.interfaces.nsIIOService);
				var css = "@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);#themefontsizechanger-tools-menu {display: -moz-box !important;}";
				var uri = ios.newURI("data:text/css," + css, null, null);
				sss.loadAndRegisterSheet(uri, sss.USER_SHEET);
			}
			*/
	
       break;
      case "quit-application":
        
        break;
      case "quit-application-requested":	
		
        break;		
      default:
        throw Components.Exception("Unknown topic: "+aTopic);
    }
  },
};
var objects=[FontSizeChangerStartup];
const COIN=Components.interfaces;  
const CORE=Components.results;
const COCL=Components.classes;
const FontSizeChangerOBSERVERNAME="FontSizeChangerStartup";
function FactHolder(aObjc){
  this.contractID=aObjc.prototype.contractID;
  this.className=aObjc.prototype.classDescription;
  this.CID=aObjc.prototype.classID;
  this.factory={
    createInstance:function(aOuter,aIID){
      if(aOuter) {throw CORE.NS_ERROR_NO_AGGREGATION;}
      return (new this.constructor).QueryInterface(aIID);
    }
  };
  this.factory.constructor=aObjc;
}
function NSGetModule(compMgr,flSpec){
  for(var i in objects) {bbModule._objects[i]=new FactHolder(objects[i]);}
  return bbModule;
}
var bbModule={
  _objects:{},
  canUnload:function(aComMan){
    return true;
  },
  getClassObject:function(aComMan,aCID,aIID) {
    if (!aIID.equals(COIN.nsIFactory)) throw CORE.NS_ERROR_NOT_IMPLEMENTED;
    for (var keyo in this._objects) {
      if (aCID.equals(this._objects[keyo].CID))
        return this._objects[keyo].factory;
    }
    throw CORE.NS_ERROR_NO_INTERFACE;
  },	  
  unregisterSelf:function(aCompMgr,aFlSpec,aLoc){
    var categoryManager=COCL["@mozilla.org/categorymanager;1"].getService(COIN.nsICategoryManager);
    categoryManager.deleteCategoryEntry("xpcom-startup",FontSizeChangerOBSERVERNAME,true);
    aComMan.QueryInterface(COIN.nsIComponentRegistrar);
    for (var keyo in this._objects) {
      var objc=this._objects[keyo];
      aComMan.unregisterFactoryLocation(objc.CID,aFlSpec);
    }
  },
  registerSelf:function(aComMan,aFlSpec,aLoc,aType){
    aComMan.QueryInterface(COIN.nsIComponentRegistrar);
    for (var keyo in this._objects){
      var objc=this._objects[keyo];
      aComMan.registerFactoryLocation(objc.CID,objc.className,objc.contractID,aFlSpec,aLoc,aType);
    }
    var categoryManager=COCL["@mozilla.org/categorymanager;1"].getService(COIN.nsICategoryManager);
    categoryManager.addCategoryEntry("xpcom-startup",FontSizeChangerOBSERVERNAME,FontSizeChangerStartup.prototype.contractID,true,true);
    categoryManager.addCategoryEntry("xpcom-shutdown", FontSizeChangerOBSERVERNAME,FontSizeChangerStartup.prototype.contractID,true,true);
  },	   
};

/**
* XPCOMUtils.generateNSGetFactory was introduced in Mozilla 2 (Firefox 4).
* XPCOMUtils.generateNSGetModule is for Mozilla 1.9.2 (Firefox 3.6).
*/
if (XPCOMUtils.generateNSGetFactory)
    var NSGetFactory = XPCOMUtils.generateNSGetFactory(objects);