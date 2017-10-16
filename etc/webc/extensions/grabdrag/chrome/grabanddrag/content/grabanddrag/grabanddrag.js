// Grab and Drag extension by Ian Weiner: ian.weiner (at) gmail.com
//
// See license.txt for more information (GPL)
//

function gadGrabAndDragExtensionNS() {

this.gadInit=gadInit;
this.gadClose=gadClose;
this.clearDragInfo=clearDragInfo; 
this.gadToggleKeyHandler=gadToggleKeyHandler;
this.gadToggle=gadToggle;
this.gadOnItem=gadOnItem;
this.gadShowOptions=gadShowOptions;
this.openBlacklist=openBlacklist;

const gadVERSION = "3.1.0";

const gadPrefListener = {
	domain: "extensions.grabanddrag.",
	observe: function(subject, topic, prefName) {
		gadInit();
	}
}
const gadSTRBUNDLE = Components.classes['@mozilla.org/intl/stringbundle;1'].getService(Components.interfaces.nsIStringBundleService);
const domWindowUtils = window.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowUtils);
const gadClipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper); 
const gadPrompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
const gadPrefService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
const GAD_UUID = "{477c4c36-24eb-11da-94d4-00e08161165f}"; 

var gadContentArea, gadRenderingArea, gadAppContent, gadCIbox, gadCIbrowser;
var gadScrollObj;
var gadStartX, gadStartY, gadLastX, gadLastY, gadLastMoveX, gadLastMoveY, gadLastTime, gadLastVel, gadshortdT, gadshortdX;
var gadOn, gadVer, gadFirstCall=true;
var gadStdCursor, gadDragCursor, gadDragInc, gadMult, gadReverse, gadSBMode, gadButton, gadQTonCnt, gadQToffCnt;
var gadTogKey, gadUseCtrl, gadUseAlt, gadUseShift;
var gadMoveTime, gadFlickOn, gadFlickSpeed, gadFlickTimeLimit, gadFlickWholePage, gadFlickHoriz, gadSavedDown;
var gadInQT, gadWasScrolling, gadDragDoc, gadTO;
var gadCopyOnQToff, gadDownStr, gadStrToCpy, gadOnText, gadStrict;
var gadBlacklist = new gadFilter();
var gadTextDoesntCount = new gadFilter();
var gadCountsAsText = new gadFilter();

var gadScrollIntervalObj, gadScrollLoopInterval, gadScrollLastLoop, gadScrollLastMoveLoop;
var gadScrollToGo, gadSmoothStop, gadSmoothFactor, gadScrollHoriz;
var gadScrollVel, gadScrollVelMult, gadScrollDistance, gadScrollMaxInterval, gadScrollFrictionMult;
var gadDists = new gadStack(50), gadVels = new gadStack(50), gadTimes = new gadStack(50);
var gadMomOn, gadMomExtent, gadMomVariation, gadMomFriction;

var gadPref = gadPrefService.getBranch("extensions.grabanddrag.");
var gadPrefRoot = gadPrefService.getBranch(null);
var gadPbi = gadPrefRoot.QueryInterface(Components.interfaces.nsIPrefBranchInternal);

function mod(m,n) {	return (m>=0?m%n:(n-((n-m)%n))%n); } // mod should always be positive!
function sgn(n) { if (n<0) return -1; if (n>0) return 1; return 0; }

// gadFilter
function gadFilter() {
	this.locFilters = []; this.elFilters = []; this.specialFilter=[];
	this.linksBLon = false;
	
	this.clearFilters = function() {
		this.locFilters = []; this.elFilters = []; this.specialFilter = [];
		this.linksBLon = false;
	}
	this.addFromString = function(textin) {
		var objin = JSON.parse(textin);
		for (var i=0; i<objin.length; i++) {			
			if (objin[i].on=="true") {
				// process adblock plus style domain filter rules
				var tmp = objin[i].url.replace(/\^\|$/, "^")       // remove anchors following separator placeholder
										 .replace(/\W/g, "\\$&")    // escape special symbols
										 .replace(/\\\*/g, ".*")      // replace wildcards by .*
										 // process separator placeholders (all ANSI charaters but alphanumeric characters and _%.-)
										 .replace(/\\\^/g, "(?:[\\x00-\\x24\\x26-\\x2C\\x2F\\x3A-\\x40\\x5B-\\x5E\\x60\\x7B-\\x80]|$)")
										 .replace(/^\\\|\\\|/, "^[\\w\\-]+:\\/+(?!\\/)(?:[^.\\/]+\\.)*?") // process extended anchor at expression start
										 .replace(/^\\\|/, "^")       // process anchor at expression start
										 .replace(/\\\|$/, "$");      // process anchor at expression end
				this.locFilters.push(new RegExp(tmp,"i"));
				if (objin[i].elem=="*") {
					this.elFilters.push("*");
				} else {
					this.elFilters.push(objin[i].elem+","+objin[i].elem.replace(/,/g," *,")+" *");
				}
				if (objin[i].id == "links") this.linksBLon = true;	// this is pretty hacky. might be nice to add computed style selectors to blacklists, but maybe not worth the effort
			}
		}
	}
	this.setFromString = function(textin,specialin) {		
		this.clearFilters();
		this.addFromString(textin);
		if (specialin!="") {
			this.specialFilter=new RegExp(specialin,"i");
		}
	}
	this.test = function(el) {
		if (!(el instanceof Element)) return false;
		
		if (this.specialFilter.test) {
			if (this.specialFilter.test(el.nodeName)) return true;
		}
		
		var loc = el.ownerDocument.documentURI.split("?",1); loc=loc[0];
		
		for (var i=0; i<this.locFilters.length; i++) {
			if (this.locFilters[i].test(loc)) {
				try { 
					if (el.mozMatchesSelector(this.elFilters[i])) {
						return true;
					}
				} catch(err) { }
			}
		}
		return false;
	}
}

// a gadStack is an object that holds a stack of data and data analysis routines-- used to 
// hold/analyze user's dragging behavior for momentum implementation. emphasis is on fast 
// writing to data struct during the dragging in order to maximize performance
function gadStack(k) {
	this.entries = new Array(k);
	this.length=0; this.next=0; this.n=k;
	
	this.add = function(x) {
		this.entries[this.next]=x; 
		if (this.length < this.n) this.length++;
		this.next=mod(this.next+1,this.n);
	}
	this.clear = function() { this.length=0; }
	this.val = function(m) { return this.entries[mod(this.next-1-m,this.n)]; }
	this.sum = function () { var i; var tot=0; for (i=0; i<this.length; i++) tot+=this.val(i); return tot; }
	this.avg = function(m,N) { 
		var i; var tot=0; N=Math.min(N,this.length-1);
		for (i=m; i<=N; i++) tot+=this.val(i); 
		return tot/(N-m+1); 
	}
	this.biasedAvg = function(m,N) {  // biased to lower values to reduce large outliers
		var s=0, c=0, i, tot=1.0; N=Math.min(N,this.length-1);
		for (i=m; i<=N; i++) tot*=this.val(i); 
		tot = Math.pow(tot,1/(N-m+1)); 
		for (i=m; i<=N; i++) {
			if (this.val(i) < tot) { s+=this.val(i); c++; }
		}
		return (s>0?s/c:tot);		
	}
	this.sumWithin = function(D) { 
		var dist=0, i; 
		for (i=0; (dist<D)&&(i<this.length); i++) dist+=this.val(i);
		return i-1;
	}
	this.maxabs = function(m,N) { 
		var i; var v=Math.abs(this.val(m)); N=Math.min(N,this.length-1);
		for (i=m; i<=N; i++) v=Math.max(v,Math.abs(this.val(i))); 
		return v; 
	}
	this.minabs = function(m,N) { 
		var i; var v=Math.abs(this.val(m)); N=Math.min(N,this.length-1);
		for (i=m; i<=N; i++) v=Math.min(v,Math.abs(this.val(i))); 
		return v; 
	}
}
function gadShowOptions(intro) {
	// https://github.com/Webconverger/webc/issues/155#issuecomment-17544896
	if (intro) {
	//	window.openDialog("chrome://grabanddrag/content/gadIntro.xul", "gadIntro", "chrome=yes,dialog=yes,resizable=yes");
	} else {
	//	window.openDialog("chrome://grabanddrag/content/gadPrefs.xul", "gadPrefs", "chrome=yes,dialog=yes,resizable=yes");
	}
}

function openBlacklist(inpar,edits) {
	window.openDialog("chrome://grabanddrag/content/gadBL.xul", "gadBL", "chrome=yes,dialog=yes,resizable=yes",inpar,edits);
}

function gadInit()
{  
	gadInQT=false; gadWasScrolling=false; gadSavedDown = null; 
	if (gadFirstCall) {
		gadFirstCall=false;
		window.addEventListener("customizationchange", gadUpdateButton, false);
		gadVer = gadPrefRoot.getCharPref("extensions.grabanddrag-version");
		gadPrefRoot.setCharPref("extensions.grabanddrag-version", gadVERSION); 
		// new install or version update
		if (gadVer != gadVERSION) {
			if (gadVer=="0.0.0") try { gadVer = gadPrefRoot.getCharPref("grabAndDrag-version"); } catch(err) { } 	
			gadVer=parseFloat(gadVer.substr(0,3));
			if (gadVer<2.8) {		// new install or upgrade from very old install; run wizard
				gadShowOptions(true);
			} else {
				if (gadVer<3.1) convertPrefs();
				gadShowOptions(false);
			}
		}		
		updateHiddenBLs();
		gadPbi.addObserver(gadPrefListener.domain, gadPrefListener, false);
	}

	try { document.getElementById("gad-options").setAttribute("hidden",!gadPref.getBoolPref("toolsMenuEntry")) } catch(err) { }
	try { document.getElementById("gad-toggle-option").setAttribute("hidden",!gadPref.getBoolPref("toolsMenuEntry")) } catch(err) { }

	gadOn = gadPref.getBoolPref("on");
	gadTogKey = gadPref.getIntPref("togKey");
	gadUseCtrl = gadPref.getBoolPref("useCtrl");
	gadUseAlt = gadPref.getBoolPref("useAlt");
	gadUseShift = gadPref.getBoolPref("useShift");
	gadDragInc = parseFloat(gadPref.getCharPref("dragInc"));
	gadMult = parseFloat(gadPref.getCharPref("mult"));
	gadReverse = (gadPref.getBoolPref("reverse")?(-1):(1));
	gadSBMode = gadPref.getBoolPref("sbmode");
	gadStdCursor = gadPref.getCharPref("grabCursor");
	if (gadPref.getBoolPref("samecur")) gadDragCursor = gadStdCursor;
	else gadDragCursor = gadPref.getCharPref("grabbingCursor");
	gadFlickOn = gadPref.getBoolPref("flickon");
	gadFlickHoriz = gadPref.getIntPref("flickhoriz");
	gadFlickSpeed = parseFloat(gadPref.getCharPref("flickspeed_ppms"));
	gadFlickTimeLimit = parseFloat(gadPref.getCharPref("flicktimelimit"));
	gadFlickWholePage = (gadPref.getIntPref("flickwhole")==-1);
	gadMomOn = gadPref.getBoolPref("momOn");
	gadMomVariation = parseFloat(gadPref.getCharPref("momVariation"));
	gadMomExtent = parseFloat(gadPref.getCharPref("momExtent")); 
	gadMomFriction = parseFloat(gadPref.getCharPref("momFriction"));
	gadSmoothStop = gadPref.getBoolPref("smoothStop");
	gadButton = gadPref.getIntPref("button");
	gadQTonCnt = (gadPref.getBoolPref("qtOn")?gadPref.getIntPref("qtOnCnt"):-1);
	gadQToffCnt = gadPref.getIntPref("qtOffCnt");
	gadCopyOnQToff = gadPref.getBoolPref("qtOffCopy");
	gadStrict = gadPref.getBoolPref("strict");
	gadshortdT= gadPref.getIntPref("shortdT");
	gadshortdX = gadPref.getIntPref("shortdX");
	gadBlacklist.setFromString(gadPref.getCharPref("blacklist"),gadPref.getCharPref("specialBL"));
	try { gadBlacklist.addFromString(gadPref.getCharPref("hiddenBL"+String(gadPref.getIntPref("button")))); } catch(err) { }
	gadTextDoesntCount.setFromString(gadPref.getCharPref("textdoesntcount"),"");
	gadCountsAsText.setFromString(gadPref.getCharPref("countsastext"),"");
	
	//*** maybe clean up or unify these... do we need three?
	gadContentArea = document.getElementById("content");	// tab browser, for tab selection events
	if (!gadContentArea) return;
	gadRenderingArea = document.getElementById("content").mPanelContainer;	// tabpanels 
	if (!gadRenderingArea) return;
	gadAppContent = document.getElementById("appcontent"); 	// box holding tab browser and misc
	if (!gadAppContent) return;
	// for Cool Iris, if installed
	gadCIbox = document.getElementById("cooliris-preview-overlay");	// plays role of appcontent
	if (gadCIbox) gadCIbrowser = gadCIbox.getPreviewFrame();	// plays role of tabpanels

	// clean up any old listeners
	gadRenderingArea.removeEventListener("mousedown", gadDownHandler, true);
	gadAppContent.removeEventListener("mousedown",gadDownPreempt, true);
	gadRenderingArea.removeEventListener("click",gadClickHandler, true);
	gadAppContent.removeEventListener("DOMContentLoaded", gadLoad, true);
	gadAppContent.removeEventListener("click",gadClickPreempt, true);
	gadContentArea.removeEventListener("select", gadTabSelect, false);
	if (gadCIbox) {
		gadCIbrowser.removeEventListener("mousedown", gadDownHandler, true);
		gadCIbox.removeEventListener("mousedown",gadDownPreempt, true);
		gadCIbrowser.removeEventListener("click",gadClickHandler, true);
		gadCIbox.removeEventListener("click",gadClickPreempt, true);
		gadCIbox.removeEventListener("DOMContentLoaded", gadLoad, true);
	}
	window.removeEventListener("mouseup", gadUpHandler, true);
	window.removeEventListener("mousedown", gadUpHandler, true);
	window.removeEventListener("mousemove", gadMoveScrollBar, true);
	window.removeEventListener("DOMContentLoaded", gadUpHandler, true);

	if (gadOn) { 
		gadRenderingArea.addEventListener("mousedown", gadDownHandler, true);
		gadAppContent.addEventListener("mousedown",gadDownPreempt, true);
		gadRenderingArea.addEventListener("click",gadClickHandler, true);
		gadAppContent.addEventListener("click",gadClickPreempt, true);
		gadAppContent.addEventListener("DOMContentLoaded", gadLoad, true);
		if (gadCIbox) {
			gadCIbrowser.addEventListener("mousedown", gadDownHandler, true);
			gadCIbox.addEventListener("mousedown",gadDownPreempt, true);
			gadCIbrowser.addEventListener("click",gadClickHandler, true);
			gadCIbox.addEventListener("click",gadClickPreempt, true);
			gadCIbox.addEventListener("DOMContentLoaded", gadLoad, true);
		}
	}
	
	gadContentArea.addEventListener("select", gadTabSelect, false);
	gadUpdateBrowser();
}

function gadTabSelect() 
{
	gadUpdateBrowser();
}

function gadClose()
{
	gadContentArea.removeEventListener("select", gadTabSelect, false);
	gadPbi.removeObserver(gadPrefListener.domain, gadPrefListener);
	gadAppContent.removeEventListener("mousedown",gadDownPreempt, true);
	try {
		gadRenderingArea.removeEventListener("mousedown", gadDownHandler, true);
		gadRenderingArea.removeEventListener("click",gadClickHandler, true);
	} catch(err) { } // may already be purged 
	gadAppContent.removeEventListener("DOMContentLoaded", gadLoad, true);
	gadAppContent.removeEventListener("click",gadClickPreempt, true);
	window.removeEventListener("mouseup", gadUpHandler, true);
	window.removeEventListener("mousedown", gadUpHandler, true);
	window.removeEventListener("mousemove", gadMoveScrollBar, true);
	window.removeEventListener("customizationchange", gadUpdateButton, false);
	window.removeEventListener("load", gadInit, false);

	gadContentArea=null; gadRenderingArea=null; gadAppContent=null;
	gadScrollObj=null; gadPref=null;
	gadPrefRoot=null; 
	gadPbi=null;	
}

// The following two preempts are attached at Appcontent to catch clicks on scrollbars etc
// set some variables for later use by down and click handlers
function gadDownPreempt(e) 
{ 
	gadWasScrolling = (gadScrollIntervalObj)?true:false;
	gadSavedDown = {target:e.originalTarget,//e.target,
					type:e.type,
					sx:e.screenX,
					sy:e.screenY, 
					x:Math.round((e.screenX-document.getElementById("main-window").boxObject.screenX)/domWindowUtils.screenPixelsPerCSSPixel),
					y:Math.round((e.screenY-document.getElementById("main-window").boxObject.screenY)/domWindowUtils.screenPixelsPerCSSPixel),
					button:e.button, 
					count:e.detail, 
					modifier:(e.altKey ? Ci.nsIDOMNSEvent.ALT_MASK : 0) | (e.ctrlKey ? Ci.nsIDOMNSEvent.CONTROL_MASK : 0) |
								(e.shiftKey ? Ci.nsIDOMNSEvent.SHIFT_MASK : 0) | (e.metaKey ? Ci.nsIDOMNSEvent.META_MASK : 0)
	};
	
	var pointercur = (e.target.ownerDocument.defaultView.getComputedStyle(e.target, "").getPropertyValue("cursor")=="pointer");
	
	// here's where we need to deal w/left/right dragging on links -- textdoesntcount, also drag handlers....
	
	try { gadOnText = ( (e.explicitOriginalTarget.nodeType==document.TEXT_NODE && !gadTextDoesntCount.test(e.target) && !(pointercur && gadBlacklist.linksBLon)) || 
						gadCountsAsText.test(e.target));
	} catch(err) { gadOnText = false; }
	//save the selected text for later copying to clipboard if necessary
	if (gadInQT) {
		gadDownStr = e.originalTarget.ownerDocument.defaultView.getSelection().toString();
		if (e.button==gadButton && !gadOnText && (gadQToffCnt==0)) {
			gadInQT=false;
			gadUpdateBrowser();
			if (gadCopyOnQToff) {
				try { 
					gadClipboardHelper.copyString(gadDownStr); 
					window.goDoCommand("cmd_selectNone");	
				} catch(err) { }
			}
		}
	}
}
// catches clicks for quick toggle
// preempt the normal image size toggling to allow dragging of images
// preempt clicks triggered by drags, clicks meant to stop momentum
function gadClickPreempt(e) 
{ 

	// QT logic
	if (gadInQT) {
		// not a real click, just pass it through and ignore it
		if (gadSavedDown) {
			if ((Math.abs(gadSavedDown.sx-e.screenX) > gadshortdX) || (Math.abs(gadSavedDown.sy-e.screenY) > gadshortdX)) {
				return true;
			}
		}
		// a click for exiting QT...
		if (e.button==gadButton && !gadOnText) {	
			// save for later copying to clipboard..
			if (e.detail==1 && gadCopyOnQToff) {
				gadStrToCpy = gadDownStr; // save for 2nd click if necessary
			}
			// triggered exiting QT...
			if (e.detail>=gadQToffCnt) { 
				gadInQT=false;
				gadUpdateBrowser();
				if (gadCopyOnQToff && gadStrToCpy) {
					try { 
						gadClipboardHelper.copyString(gadStrToCpy); 
					} catch(err) { }
				}
			}
		}
		return true;
	} 
	// everything below called only when G&D is on and not in QT:
	// start quick toggle from [double] clicking text node
	if (e.button==gadButton && e.detail>=gadQTonCnt && gadQTonCnt>=0 &&
								(gadSavedDown) && !gadOnItem(e.originalTarget) && gadOnText) {	
		gadInQT=true;
		gadUpdateBrowser();
		return true;
	}
	// preempt image toggling
	if (e.originalTarget.ownerDocument instanceof HTMLDocument) {
		if (!(gadSavedDown) && (typeof e.originalTarget.ownerDocument.toggleImageSize == 'function') && 
					e.originalTarget.nodeName.toLowerCase()=="img" && e.button==gadButton && e.button==0) {					 
			e.preventDefault(); e.stopPropagation(); // stop propagation to keep clicks from reaching the browser(?) and triggering image rescaling
			gadWasScrolling=false; 
			return false;
		}
	}
	// preempt if click was to stop momentum/flick scrolling, and "fake" clicks generated 
	// while dragging. this must be handled at the appcontent level in order to work, but we 
	// only want to preempt WasScrolling clicks if the scrolling really was ended (so user 
	// can still click other appcontent UI elements during scrolling)
	if ((gadWasScrolling && !gadScrollIntervalObj) || !(gadSavedDown)) { 
		e.preventDefault(); e.stopPropagation(); 
		gadWasScrolling=false; 
		return false;
	}
}

// *** 
function gadOnItem(initialNode) 
{
	var nextNode, currNode;
	var doc = initialNode.ownerDocument;
	var st = doc.defaultView.getComputedStyle(initialNode, "");
	var cur = st.getPropertyValue("cursor").replace(/"|'/g,"");

	// Never preempt XUL objects
	if (initialNode.namespaceURI == "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul") return true;
	if (!(doc instanceof HTMLDocument)) return true; // e.g. xml documents
	
	if (gadBlacklist.test(initialNode)) return true;
	
	if (doc.designMode) if (doc.designMode=="on") return true;  

	if ([gadStdCursor,gadDragCursor,"auto","default"].indexOf(cur)==-1) {
		if (/move|grab|resize/i.test(cur)) return true;
		if (/pointer/i.test(cur) && gadBlacklist.linksBLon) return true; // hack for link-like objects 
	}
	
	if (gadStrict) {
		if ([gadStdCursor,gadDragCursor,"auto","default"].indexOf(cur)==-1) {
			return true;	
		}
		if (st.getPropertyValue("-moz-user-select")=="none") {
			return true; //was a hack for Google maps...
		}
		if (doc.defaultView.getComputedStyle(initialNode, "").getPropertyValue("-moz-user-modify") != "read-only") {
			if (gadButton==0) return true;
		}
	}
	

	return false;
}

// ***
function gadDownHandler(e) 
{
	gadStartY = e.screenY; gadStartX = e.screenX;	
	gadMoveTime=0;

	// special case: on an item, unless click was to stop scrolling
	if (!gadWasScrolling && gadOnItem(gadSavedDown.target)) return true;
		
	// special case: quick toggle or wrong button, unless click was to stop scrolling
	if (!gadWasScrolling && (e.button!=gadButton || gadInQT)) return true; 
	// stop the scrolling
	if (gadScrollIntervalObj) {
		content.clearInterval(gadScrollIntervalObj); 
		gadScrollIntervalObj = null;
		// special case: clicked on the scrollbar or other UI elements not part of page
		if (gadSavedDown.target.namespaceURI == "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul") return true;
		e.stopPropagation();
	}	
	e.preventDefault();

	gadScrollObj = gadFindNodeToScroll(gadSavedDown.target);
	window.addEventListener("mouseup", gadUpHandler, true);
	window.addEventListener("mousemove", gadMoveScrollBar, true);
	gadDragDoc = gadSavedDown.target.ownerDocument;
	if (!gadScrollObj.nodeToScrollX && !gadScrollObj.nodeToScrollY) return false;
	gadRenderingArea.removeEventListener("mousedown", gadDownHandler, true);
	gadAppContent.removeEventListener("mousedown",gadDownPreempt, true);
	if (gadCIbrowser) {
		gadCIbrowser.removeEventListener("mousedown", gadDownHandler, true);
		gadCIbox.removeEventListener("mousedown",gadDownPreempt, true);
	}
	window.addEventListener("mousedown", gadUpHandler, true);
	gadLastY = e.screenY; gadLastX = e.screenX;
	gadLastMoveX = e.screenX; gadLastMoveY = e.screenY;
	gadLastVel = 0;
	gadLastTime=(new Date()).getTime(); 
	clearDragInfo();
	if (gadStdCursor!=gadDragCursor) {
		if (gadDragDoc instanceof HTMLDocument) gadSetCursor(gadDragDoc, gadDragCursor, false);
	}
}

function gadMoveScrollBar(e) 
{
	var horiz, time, dX, dY, dXM, dYM, dT, dD, vel;

	e.preventDefault(); e.stopPropagation();   
	window.clearTimeout(gadTO); 
	time = (new Date()).getTime();
	dT = time-gadLastTime; 
	dX = gadLastX - e.screenX;  dY = gadLastY - e.screenY; // how far mouse cursor moved since last function call
	horiz = (Math.abs(dX) > Math.abs(dY));
	
	// ignore slight quick movements 
	if ((gadSavedDown) && dT<=gadshortdT && 
				Math.abs(gadStartX-e.screenX)<=gadshortdX && Math.abs(gadStartY-e.screenY)<=gadshortdX) {
		return;
	}
	
	if ((gadSavedDown) && horiz && gadOnText && (gadQTonCnt==0) && !gadOnItem(gadSavedDown.target)) {		
		window.removeEventListener("mousemove", gadMoveScrollBar, true);
		window.removeEventListener("mouseup", gadUpHandler, true);
		window.removeEventListener("mousedown", gadUpHandler, true);
		window.removeEventListener("DOMContentLoaded", gadUpHandler, true);		
		domWindowUtils.sendMouseEventToWindow(gadSavedDown.type,gadSavedDown.x,gadSavedDown.y,gadSavedDown.button,gadSavedDown.count,gadSavedDown.modifier);
		gadRenderingArea.addEventListener("mousedown", gadDownHandler, true);
		gadAppContent.addEventListener("mousedown",gadDownPreempt, true);
		if (gadCIbrowser) {
			gadCIbrowser.addEventListener("mousedown", gadDownHandler, true);
			gadCIbox.addEventListener("mousedown",gadDownPreempt, true);
		}
		gadInQT=true;
		gadUpdateBrowser();
		return;	
	}
	
	if ((gadSavedDown) && (Math.abs(gadStartX-e.screenX) > gadshortdX || Math.abs(gadStartY-e.screenY) > gadshortdX)) {
		gadSavedDown = null;
		gadMoveTime = time;
	}

	// record the _effective_ screen scroll movement for gesture analysis (even if we don't actually scroll for this call)
	if (gadFlickOn||gadMomOn) {
		if (horiz) dD = dX*gadScrollObj.ratioX; else dD = dY*gadScrollObj.ratioY;
		if (dT==0) return;
		vel = dD/dT;   
		// changed principle scroll direction-- reset data
		if ((gadScrollHoriz!=horiz) || (dD*gadLastVel<0)) {  
			clearDragInfo();
		}
		gadDists.add(dD); gadVels.add(vel); gadTimes.add(dT);
		gadLastVel = vel;
	}
	
	gadScrollHoriz = horiz; 
	gadLastTime = time; gadLastY = e.screenY; gadLastX = e.screenX; 

	// gadLastMoveX/Y are floating point measures in mouse cursor space that keep track of the decimal remainder pixels left over after scrolling. 
	// This is important for precision when scroll ratios are not 1, in particular for full page zoom mode
	dXM = (gadLastMoveX - e.screenX)*gadScrollObj.ratioX;
	dYM = (gadLastMoveY - e.screenY)*gadScrollObj.ratioY;
	
	if ((Math.abs(dXM)>=gadDragInc) || (Math.abs(dYM)>=gadDragInc)) {
		gadLastMoveX = e.screenX + (dXM - Math.round(dXM))/gadScrollObj.ratioX;
		gadLastMoveY = e.screenY + (dYM - Math.round(dYM))/gadScrollObj.ratioY;
		if (horiz && gadScrollObj.nodeToScrollX) gadScrollObj.scrollXBy(Math.round(dXM));
		if (gadScrollObj.nodeToScrollY) gadScrollObj.scrollYBy(Math.round(dYM));
	}

	
	gadTO=window.setTimeout(function() { clearDragInfo(); }, Math.max(2*dT,200)); // if you aren't moving for a while, reset gesture analysis data
}

function clearDragInfo() { gadDists.clear(); gadVels.clear(); gadTimes.clear(); };

function gadBigDecel() 
{	
	var N = gadTimes.sumWithin(gadMomExtent); 
	var M = gadVels.maxabs(0,N);
	return (gadVels.maxabs(0,1)/M < gadMomVariation);
}

// ***
function gadUpHandler(e) 
{  
	window.clearTimeout(gadTO); 
	var time = (new Date()).getTime(); 
	window.removeEventListener("mousemove", gadMoveScrollBar, true);
	window.removeEventListener("mouseup", gadUpHandler, true);
	window.removeEventListener("mousedown", gadUpHandler, true);
	window.removeEventListener("DOMContentLoaded", gadUpHandler, true);
	var dT = time-gadLastTime;
	var aT = gadTimes.biasedAvg(1,50);
	// handle flick gestures and momentum
	var scrollStarted=false;
	if ( (dT<2*aT) && (gadFlickOn||gadMomOn) ) {
		var dist, vel, interval, DXt, DYt, totCurDist;
		DXt = e.screenX - gadStartX; DYt = e.screenY - gadStartY;
		DXt*=gadScrollObj.ratioX; DYt*=gadScrollObj.ratioY; 
		
		totCurDist = Math.abs(gadDists.sum()/(gadScrollHoriz?gadScrollObj.ratioX:gadScrollObj.ratioY));
		interval=7 // 200fps
		gadScrollMaxInterval = aT*3;
		if (gadFlickOn && (time-gadMoveTime < gadFlickTimeLimit)) {  
			// FLICK
			vel = sgn(gadVels.val(0))*gadFlickSpeed;
			// Previous page or next page
			if (gadScrollHoriz && vel<0 && (gadFlickHoriz==2 || 
						(gadFlickHoriz==1 && (!gadScrollObj.nodeToScrollX || gadScrollObj.scrollLeft==0)))) {
				BrowserBack();
			} else if (gadScrollHoriz && vel>0 && gadFlickHoriz==3) {
				BrowserBack();
			} else if (gadScrollHoriz && vel>0 && (gadFlickHoriz==2 ||
						(gadFlickHoriz==1 && (!gadScrollObj.nodeToScrollX || gadScrollObj.scrollLeft==gadScrollObj.scrollW-gadScrollObj.realWidth)))) {
				BrowserForward();				
			} else if (gadScrollHoriz && vel<0 && gadFlickHoriz==3) {
				BrowserForward();
			} else {
				if (gadFlickWholePage) {
					if (gadScrollHoriz) dist = sgn(vel)*(gadScrollObj.scrollW);
					else dist = sgn(vel)*(gadScrollObj.scrollH);
				} else {
					if (gadScrollHoriz) dist = sgn(vel)*(gadScrollObj.realWidth - 15 - Math.abs(DXt));
					else dist = sgn(vel)*(gadScrollObj.realHeight - 15 - Math.abs(DYt));
				}
				gadInitScroll(dist,interval,vel,gadScrollHoriz,false);
				scrollStarted=true;
			}
		} else if (gadMomOn) {
			// MOMENTUM
			if (!gadBigDecel() && (totCurDist > 3) && 
						(gadTimes.sum() > gadMomExtent/4) && (gadDists.length>1)) {
				vel = sgn(gadVels.val(0))*gadVels.maxabs(0,1);
				if (gadScrollHoriz) dist = sgn(vel)*(gadScrollObj.scrollW);
				else dist = sgn(vel)*(gadScrollObj.scrollH);
				gadInitScroll(dist,interval,vel,gadScrollHoriz,true);
				scrollStarted=true;
			}
		}
	}
	var t = e.originalTarget;
	if (gadStdCursor!=gadDragCursor) {
		if (gadDragDoc instanceof HTMLDocument) gadSetCursor(gadDragDoc, gadStdCursor,false);
	}
	if (e.button!=0) e.preventDefault(); // scrollbar bug fixed if we don't preventdefault here. But need it to prevent right click menu. Any negative consequences?

	gadRenderingArea.addEventListener("mousedown", gadDownHandler, true);
	gadAppContent.addEventListener("mousedown",gadDownPreempt, true);
	if (gadCIbrowser) {
		gadCIbrowser.addEventListener("mousedown", gadDownHandler, true);
		gadCIbox.addEventListener("mousedown",gadDownPreempt, true);
	}
	
	//  if we're done scrolling, give focus to the scrolled node
	if (!(gadSavedDown) && !scrollStarted) {
		var focused = document.commandDispatcher.focusedElement;
		if (focused) focused.blur();
		if (gadScrollObj.clientFrame instanceof Window) {
			gadScrollObj.clientFrame.focus();
			// focus the div for kb input, unless it will kill a selection.
			var sel = gadScrollObj.clientFrame.getSelection();
			if (!sel || sel.isCollapsed) {	// not sure why but sometimes getSelection() returns null
				if ((gadScrollObj.nodeToScrollX instanceof Element) && gadScrollHoriz) {
					gadScrollObj.nodeToScrollX.focus(); 			
					focused = document.commandDispatcher.focusedElement;
					if (focused) focused.blur();
				}
				else if (gadScrollObj.nodeToScrollY instanceof Element) {
					gadScrollObj.nodeToScrollY.focus();
					focused = document.commandDispatcher.focusedElement;
					if (focused) focused.blur();
				}
			}
		}  	
	}
}

// ***
//*
// helper to make clicks etc focus scrollable elts for keyboard input and to be default window for text selection etc
function gadFixFocus(n) 
{
	var focused = document.commandDispatcher.focusedElement;
	if (focused) focused.blur();
	
	n.ownerDocument.defaultView.focus();
	n.ownerDocument.documentElement.focus();
	if (gadScrollObj.clientFrame instanceof Window) gadScrollObj.clientFrame.focus();
	if (gadScrollObj.deepestNode) {
		//if (gadScrollObj.deepestNode.nodeName.toLowerCase()!="html") 
		gadScrollObj.deepestNode.focus();
		document.commandDispatcher.focusedElement.blur();
	}
	
	focused = document.commandDispatcher.focusedElement;
	if (focused) focused.blur();

}
//*/

// ***
//handle some useful default browser click actions that we prevented with preventDefault 
//in the mousedown handler.
function gadClickHandler(e) 
{
	if (e.button != gadButton) return; // only continue if the G&D button was clicked
	
	var t = e.originalTarget, br = gBrowser.getBrowserForDocument(e.target.ownerDocument);
	  
	// re-enable middle button autoscrolling (uses same checks as browser.xml)
	try { 
		if (e.button==1 && gadPrefRoot.getBoolPref("general.autoScroll") && !br.isAutoscrollBlocker(t) && 
					!br._scrollingView && br.currentURI.spec!="about:blank") {
			br.startScroll(e);
		}
	} catch(e) {}

	// even in grab anywhere mode, we allow clicks to focus text boxes, etc.
	/*
	if (e.button==0 && gadPreLevel==2) {
		
		// *** THIS STUFF NEEDS FIXIN ***
		
		var ot = e.explicitOriginalTarget;
		
		if (ot.ownerDocument.defaultView.getComputedStyle(ot, "").getPropertyValue("-moz-user-modify") != "read-only") {
			if (!ot.isSameNode(document.commandDispatcher.focusedElement)) {
				ot.focus();
			}
		} else if (!gadInQT) {
			gadFixFocus(e.originalTarget);
		 	try { e.originalTarget.ownerDocument.defaultView.goDoCommand("cmd_selectNone"); } catch(err) { }
		}
		return;
	}*/
	
	// note: code after the following line is never called for prelevel 2 (grab anywhere mode)
	if (gadOnItem(t) || gadInQT) return; 
	// handle left-click focus/deselection actions if they were prevented before
	if (e.button==0) {
	 	gadFixFocus(e.originalTarget);
 		try { e.originalTarget.ownerDocument.defaultView.goDoCommand("cmd_selectNone"); } catch(err) { }
	}
}

function gadToggleKeyHandler(e) 
{
	// hack to not allow hotkey thats just a regular key 
	if (!gadUseCtrl && !gadUseAlt && !gadUseShift && gadTogKey < 112) return;
	
	if ((e.keyCode == gadTogKey) && (e.ctrlKey == gadUseCtrl) && 
			(e.altKey == gadUseAlt) && (e.shiftKey == gadUseShift)) {
		gadToggle();
	}
}


function gadSetCursor(doc, cur, deep) 
{
	if (!doc) return;
	if (doc instanceof HTMLDocument) {
		if (doc.designMode) if (doc.designMode=="on") cur="auto"; // don't change cursor in design mode docs
		if (gadBlacklist.test(doc.body)) cur="auto";
		if (doc.documentElement.style.cursor != cur) {
			doc.documentElement.style.setProperty("cursor", cur, "important");
		}
	}
	if (deep && (doc.evaluate)) {
		var i;		
		var x = doc.evaluate("//frame | //iframe", doc, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null);
		if (x) {
			for (i=0; i<x.snapshotLength; i++) {
				gadSetCursor(x.snapshotItem(i).contentDocument,cur,deep);
			}
		}
	}
}

//called when new webpage loads
function gadLoad(e) {
	gadUpdateBrowser(e.target);
}

function gadUpdateBrowser(doc) {
	gadUpdateButton();	
	if (!doc) doc=content.document;
	
	var BL=gadBlacklist.test(doc.documentElement);
	gadSetCursor(doc, ((gadOn&&!gadInQT&&!BL)?gadStdCursor:"auto"),true);	
	if (gBrowser.getBrowserForDocument(doc)) {
		gBrowser.getBrowserForDocument(doc).setAttribute("autoscroll",(!gadOn || gadInQT || BL || gadButton != 1));
	} 
	
	if (gadCIbrowser) {	
		doc = gadCIbrowser.contentDocument;	
		BL=gadBlacklist.test(doc.documentElement);
		gadSetCursor(doc, ((gadOn&&!gadInQT&&!BL)?gadStdCursor:"auto"),true);	
		gadCIbrowser.setAttribute("autoscroll",(!gadOn || gadInQT || BL || gadButton != 1));
	}
}

function gadUpdateButton() {
	var bu = document.getElementById("grabanddrag-button");
	if (bu) {
		if (gadOn && gadBlacklist.test(content.document.documentElement)) {
			bu.setAttribute("gadOn","BL");
		} else if (gadInQT) {
			bu.setAttribute("gadOn","QT");
		} else {
			bu.setAttribute("gadOn",gadOn);
		}
	}
}

function gadTextToggle() {
	gadInQT=!gadInQT;	
	gadUpdateBrowser();
}
function gadToggle() {
	if (gadInQT) gadTextToggle();
	else gadPref.setBoolPref("on", !gadOn);
}

function gadInitScroll(dist,interval,vel,horiz,friction)
{
	if (horiz && !gadScrollObj.nodeToScrollX) return;
	if (!horiz && !gadScrollObj.nodeToScrollY) return;
	gadScrollLastLoop = (new Date()).getTime();
	
	if (gadScrollIntervalObj) content.clearInterval(gadScrollIntervalObj); 
	var destination;
	gadSmoothFactor=2;
	if (horiz) {
		destination = gadScrollObj.scrollLeft + dist;
		if (destination <= 0) { 
			dist = -gadScrollObj.scrollLeft; 
			gadSmoothFactor=3; 
		} else if (destination >= gadScrollObj.scrollW-gadScrollObj.realWidth)  {
			dist = gadScrollObj.scrollW-gadScrollObj.realWidth-gadScrollObj.scrollLeft;
			gadSmoothFactor=3; 
		}
	} else {
		destination = gadScrollObj.scrollTop + dist;
		if (destination <= 0) {
			dist = -gadScrollObj.scrollTop;
			gadSmoothFactor=3; 
		} else if (destination >= gadScrollObj.scrollH-gadScrollObj.realHeight)  {
			dist = gadScrollObj.scrollH-gadScrollObj.realHeight-gadScrollObj.scrollTop;
			gadSmoothFactor=3; 
		}
	}
	gadScrollLoopInterval = interval;
	gadScrollVel = vel;
	gadScrollVelMult = 1;
	gadScrollHoriz = horiz;
	gadScrollToGo = dist;
	gadScrollDistance = dist;
	gadScrollFrictionMult = (friction?1-gadMomFriction:1);
	gadScrollLastMoveLoop = gadScrollLastLoop;
	gadScrollIntervalObj = content.setInterval(function() { gadScrollLoop(); },gadScrollLoopInterval);
	gadScrollLoop();
}

function gadScrollLoop() 
{
	var toScroll, currentTime, dT, tCk;
	currentTime=(new Date()).getTime();
	// make sure previous loop is done
	if (gadScrollLastLoop==currentTime) {
		content.clearInterval(gadScrollIntervalObj);
		gadScrollIntervalObj = content.setInterval(function() { gadScrollLoop(); },gadScrollLoopInterval);
		return;
	}
	gadScrollLastLoop = currentTime;
	dT = currentTime-gadScrollLastMoveLoop;

	// the following line sacrifices constant speed for smoother motion when the loop is delayed a lot
	if (currentTime-gadScrollLastLoop>gadScrollMaxInterval) dT=gadScrollMaxInterval;
	
	gadScrollVel *= gadScrollFrictionMult;
	toScroll = Math.round(gadScrollVel*gadScrollVelMult*dT);	
	// with friction, we end the loop as soon as we aren't moving in a time step. Must check this before the next 
	// statement to avoid infinite loop
	if (toScroll==0 && gadScrollFrictionMult<1) { 
		content.clearInterval(gadScrollIntervalObj);
		gadScrollIntervalObj=null;
		return;
	}
	// if there's still distance to go and we're moving slowly enough to not scroll a pixel this time, loop
	if ( (Math.abs(toScroll)<gadDragInc*gadScrollVelMult) &&
				(Math.abs(gadScrollToGo)>=gadDragInc*gadScrollVelMult) ) return;
	 // the following must be before smooth velocity scaling below or loop may not end
	if ((toScroll==0)&&(gadScrollToGo!=0)) return;
	if ((gadScrollToGo-toScroll)*sgn(gadScrollToGo) <= 0) {
		toScroll=gadScrollToGo;
	}	
	// fast (tho somewhat inaccurate) hack to smoothly stop
	tCk = Math.max(30,dT)*gadSmoothFactor*gadScrollVel;
	while (gadSmoothStop && ((gadScrollToGo-tCk*gadScrollVelMult)*sgn(gadScrollToGo) < 0)) {
		// it's important that we take ceil below so the last pixel always finishes
		toScroll=sgn(toScroll)*Math.ceil(Math.abs(toScroll)/2);  
		gadScrollVelMult*=0.3;
	}
	gadScrollLastMoveLoop = gadScrollLastLoop;

	if (gadScrollHoriz) gadScrollObj.scrollXBy(toScroll);
	else gadScrollObj.scrollYBy(toScroll);
	gadScrollToGo -= toScroll;

	if (gadScrollToGo==0){
		content.clearInterval(gadScrollIntervalObj);
		gadScrollIntervalObj=null;
		return;
	}
}

function convertPrefs() 
{	
  var i, err, pre;
  var bools  = ["on", "useCtrl", "useAlt", "useShift", "sbmode", "samecur", "reverse", 
  					"flickon", "momOn", "smoothStop", "qtOffCopy", "qtOn", "strict"]; 
  var ints = ["togKey", "button", "qtOnCnt", "qtOffCnt", "flickwhole", "flickhoriz"];
  var chars = ["grabCursor","grabbingCursor", "mult", "dragInc", "flickspeed_ppms", 
  				"flicktimelimit", "momExtent", "momVariation", "momFriction"];
  				
  for (i=0; i<bools.length; i++) {
    try { 
	  gadPrefRoot.setBoolPref("extensions.grabanddrag." + bools[i],gadPrefRoot.getBoolPref("grabAndDrag." + bools[i]));
    } catch(err) { }
  }
  for (i=0; i<ints.length; i++) {
    try { 
	  gadPrefRoot.setIntPref("extensions.grabanddrag." + ints[i],gadPrefRoot.getIntPref("grabAndDrag." + ints[i]));
    } catch(err) { }
  }
  for (i=0; i<chars.length; i++) {
    try { 
	  gadPrefRoot.setCharPref("extensions.grabanddrag." + chars[i],gadPrefRoot.getCharPref("grabAndDrag." + chars[i]));
    } catch(err) { }
  }
  
  var bl = JSON.parse(gadPrefRoot.getCharPref("extensions.grabanddrag.hiddenBL"+String(gadPrefRoot.getIntPref("extensions.grabanddrag.button"))));
  var linkdisable = true;
  for (i=0; i<bl.length; i++) {    
    if (bl[i].url=="*" && bl[i].elem=='*:link,*:visited,*[role="link"]') {
	    linkdisable = (bl[i].on=="true");
	    break;
    }
  }
  gadPrefRoot.clearUserPref("extensions.grabanddrag.hiddenBL0");
  gadPrefRoot.clearUserPref("extensions.grabanddrag.hiddenBL1");
  gadPrefRoot.clearUserPref("extensions.grabanddrag.hiddenBL2");
  
  try { pre = gadPrefRoot.getIntPref("grabAndDrag.preLevel"); } catch(err) { pre = 1; }
  if (pre==0) {	// no grabbing on text --> horizontal drag texttoggle
    gadPrefRoot.setBoolPref("extensions.grabanddrag.qtOn",true);
    gadPrefRoot.setIntPref("extensions.grabanddrag.qtOnCnt",0);
    gadPrefRoot.setIntPref("extensions.grabanddrag.qtOffCnt",0);
  }
  if ((pre==2) || !linkdisable) {	// grabbing on links
    bl = JSON.parse(gadPrefRoot.getCharPref("extensions.grabanddrag.hiddenBL"+String(gadPrefRoot.getIntPref("extensions.grabanddrag.button"))));
    for (i=0; i<bl.length; i++) {
	  if (bl[i].id=="links") {
		bl[i].on = false;
		break;
	  }
    }
    gadPrefRoot.setCharPref("extensions.grabanddrag.hiddenBL"+String(gadPrefRoot.getIntPref("extensions.grabanddrag.button")),JSON.stringify(bl));
  }

  if (pre==0) alert(document.getElementById("bundle_gad").getString("update.pre0change"));
}

function updateHiddenBLs()
{
	var oldBL, newBL, button, i, j;
	for (button=0; button<3; button++) {
		oldBL = JSON.parse(gadPrefRoot.getCharPref("extensions.grabanddrag.hiddenBL" + String(button)));
		gadPrefRoot.clearUserPref("extensions.grabanddrag.hiddenBL" + String(button));
		newBL = JSON.parse(gadPrefRoot.getCharPref("extensions.grabanddrag.hiddenBL" + String(button)));
		for (i=0; i<newBL.length; i++) {
			for (j=0; j<oldBL.length; j++) {
				if (oldBL[j].id == newBL[i].id) {
					newBL[i].on = oldBL[j].on;
					break;
				}	
			}	
		}
		gadPrefRoot.setCharPref("extensions.grabanddrag.hiddenBL" + String(button),JSON.stringify(newBL));
	}		
}


// The following is modified from Marc Boullet's All-in-one Gestures extension
function gadFindNodeToScroll(initialNode) 
{
	
	function getStyle(elem, aProp) {
		var p = elem.ownerDocument.defaultView.getComputedStyle(elem, "").getPropertyValue(aProp);
		var val = parseFloat(p);
		if (!isNaN(val)) return Math.ceil(val);
		if (p == "thin") return 1;
		if (p == "medium") return 3;
		if (p == "thick") return 5;
		return 0;
	}

	function scrollCursorType(neededW, availW, neededH, availH, scrollBarSize) {
		if (neededW <= availW && neededH <= availH) return 3;
		if (neededW > availW && neededH > availH) return 0;
		if (neededW > availW) return ((neededH <= (availH - scrollBarSize)) - 0) << 1;  // 0 or 2
		return (neededW <= (availW - scrollBarSize)) - 0;
	}
  
	const defaultScrollBarSize = 16;
	const twiceScrollBarSize = defaultScrollBarSize * 2;
	var retObj = {isXML: false, nodeToScrollX: null, nodeToScrollY: null, deepestNode: null,
								ratioX: 1, ratioY: 1, clientFrame: null, isFrame: false,
								targetDoc: null, insertionNode: null, realHeight: 1, realWidth: 1, 
								scrollXBy: null, scrollYBy: null, scrollW: 1, scrollH: 1 };
	var realWidth, realHeight, nextNode, currNode, scrollType;
	var targetDoc = initialNode.ownerDocument;
	var docEl = targetDoc.documentElement;
	retObj.insertionNode = (docEl) ? docEl : targetDoc;
	var docBox = docEl.getBoundingClientRect(retObj.insertionNode);
	var clientFrame = targetDoc.defaultView;
	retObj.targetDoc = targetDoc; retObj.clientFrame = clientFrame;
	if (targetDoc instanceof HTMLDocument) { // walk the tree up looking for something to scroll
		if (clientFrame.frameElement) retObj.isFrame = true; else retObj.isFrame = false;
		var bodies = docEl.getElementsByTagName("body");
		if (!bodies || !bodies.length) 
			return retObj;
		var bodyEl = bodies[0];
		if (initialNode == docEl) nextNode = bodyEl;
		else if (initialNode.nodeName.toLowerCase() == "select") nextNode = initialNode.parentNode;
		else nextNode = initialNode;
		do {
			try {
				currNode = nextNode;
				scrollType = 3;
				if (currNode instanceof Element && currNode.ownerDocument.defaultView.getComputedStyle(currNode, "").getPropertyValue("overflow") != "hidden") {
					realWidth = currNode.clientWidth + getStyle(currNode, "border-left-width") + getStyle(currNode, "border-right-width");
					realHeight = currNode.clientHeight + getStyle(currNode, "border-top-width") + getStyle(currNode, "border-bottom-width");

					// if the newer, more reliable API is available, use it
					if ((currNode.scrollTopMax !== undefined) && (currNode.scrollLeftMax !== undefined)) {
						if ((currNode.scrollTopMax > 0) && (currNode.scrollLeftMax > 0)) scrollType = 0;
						if ((currNode.scrollTopMax > 0) && (currNode.scrollLeftMax == 0)) scrollType = 1;
						if ((currNode.scrollTopMax == 0) && (currNode.scrollLeftMax > 0)) scrollType = 2;					
					} else {
						// note: we ignore DIVs etc with "visible" overflow but allow it for body and html elements, 
						// which get scrollbars automatically in frames or from the browser.
						if (currNode.nodeName.toLowerCase()=="html" || currNode.nodeName.toLowerCase()=="body" || 
										currNode.ownerDocument.defaultView.getComputedStyle(currNode, "").getPropertyValue("overflow") != "visible") {
							scrollType = scrollCursorType(currNode.scrollWidth, realWidth, currNode.scrollHeight, realHeight, 0);
						}
					}
				}
				if (scrollType != 3) {
					if (!retObj.deepestNode) retObj.deepestNode = currNode;
					if ((scrollType==0 || scrollType==2)&&(!retObj.nodeToScrollX)) {
						retObj.nodeToScrollX = currNode;
						if (realWidth > twiceScrollBarSize) realWidth -= twiceScrollBarSize;
						if (gadSBMode) retObj.ratioX = -currNode.scrollWidth/realWidth; 
						else retObj.ratioX = gadMult;
						retObj.ratioX *= gadReverse;
						retObj.ratioX /= gBrowser.selectedBrowser.markupDocumentViewer.fullZoom; // "full zoom" unaccounted for in node scrolling code
						retObj.scrollW = currNode.scrollWidth-twiceScrollBarSize; 
						retObj.realWidth = realWidth;
						retObj.scrollXBy = function(dx) { if (this.nodeToScrollX instanceof Element) this.nodeToScrollX.scrollLeft += dx; }
						retObj.__defineGetter__("scrollLeft",function(){ return (this.nodeToScrollX instanceof Element)?this.nodeToScrollX.scrollLeft:0;});
					}
					if ((scrollType==0 || scrollType==1)&&(!retObj.nodeToScrollY)) {
						retObj.nodeToScrollY = currNode;
						if (realHeight > twiceScrollBarSize) realHeight -= twiceScrollBarSize;
						if (gadSBMode) retObj.ratioY = -currNode.scrollHeight/realHeight;
						else retObj.ratioY = gadMult;
						retObj.ratioY *= gadReverse;
						retObj.ratioY /= gBrowser.selectedBrowser.markupDocumentViewer.fullZoom; // "full zoom" unaccounted for in node scrolling code
						retObj.scrollH = currNode.scrollHeight-twiceScrollBarSize;
						retObj.realHeight = realHeight;
						retObj.scrollYBy = function(dy) { if (this.nodeToScrollY instanceof Element) { this.nodeToScrollY.scrollTop += dy; } }
						retObj.__defineGetter__("scrollTop",function(){return (this.nodeToScrollY instanceof Element)?this.nodeToScrollY.scrollTop:0;});
					}
					if (retObj.nodeToScrollX && retObj.nodeToScrollY)	
						return retObj;
				}
				nextNode = currNode.parentNode;
			}
			catch(err) {
				return retObj;
			}
		} while (nextNode && currNode != docEl);
		if (retObj.isFrame) {
			if (retObj.nodeToScrollX || retObj.nodeToScrollY) {
				return retObj;
			} else {
				return gadFindNodeToScroll(clientFrame.frameElement.ownerDocument.documentElement);
			}
		}
	}
	else { // XML document; do our best
		retObj.nodeToScrollX = initialNode;
		retObj.nodeToScrollY = initialNode;
		retObj.deepestNode = initialNode;
		if (docBox) {
			if (gadSBMode) {
				retObj.ratioX = -docBox.width/gadRenderingArea.boxObject.width;
				retObj.ratioY = -docBox.height/gadRenderingArea.boxObject.height;
			} else {
				retObj.ratioX = gadMult;
				retObj.ratioY = gadMult;
			}	            	
			retObj.ratioX *= gadReverse;
			retObj.ratioY *= gadReverse;
			retObj.ratioX /= gBrowser.selectedBrowser.markupDocumentViewer.fullZoom; // "full zoom" unaccounted for in node scrolling code
			retObj.ratioY /= gBrowser.selectedBrowser.markupDocumentViewer.fullZoom; // "full zoom" unaccounted for in node scrolling code
			retObj.scrollW = docBox.width;
			retObj.scrollH = docBox.height;
			retObj.realWidth = gadRenderingArea.boxObject.width;
			retObj.realHeight = gadRenderingArea.boxObject.height;
			try { scrollType = scrollCursorType(docBox.width, gadRenderingArea.boxObject.width,
								docBox.height, gadRenderingArea.boxObject.height, defaultScrollBarSize); } catch(err) { }
			if (scrollType==0 || scrollType==2)	retObj.nodeToScrollX = initialNode;
			if (scrollType==0 || scrollType==1)	retObj.nodeToScrollY = initialNode;
		}
		retObj.isXML = true;
		retObj.scrollXBy = function(dx) { this.clientFrame.scrollBy(dx,0); }
		retObj.scrollYBy = function(dy) { this.clientFrame.scrollBy(0,dy); }
		retObj.__defineGetter__("scrollTop",function(){return this.clientFrame.scrollY;});
		retObj.__defineGetter__("scrollLeft",function(){return this.clientFrame.scrollX;});
	}
	return retObj;
}
// End AiOG


}	

var gadGrabAndDragExtension = new gadGrabAndDragExtensionNS();
window.addEventListener("load", gadGrabAndDragExtension.gadInit, false);
window.addEventListener("keydown", gadGrabAndDragExtension.gadToggleKeyHandler, false); 
window.addEventListener("unload", gadGrabAndDragExtension.gadClose, false);

