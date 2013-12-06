/*-----------------------------------------------------
  Copyright (c) 2011 Hunter Paolini.  All Rights Reserved.
  -----------------------------------------------------*/

/**
 * @fileOverview Code to examine output of Web documents
 */

var EXPORTED_SYMBOLS = ["contentListener", "scanURL", "publicObj", "formatList", "LIST_TYPE"];

const Cc = Components.classes;
const Ci = Components.interfaces;

const nsITimerIface = Ci.nsITimer;
const nsIDOMXPathResultIface = Ci.nsIDOMXPathResult;
const nsIDOMHTMLStyleElementIface = Ci.nsIDOMHTMLStyleElement;
const nsIDOMHTMLScriptElementIface = Ci.nsIDOMHTMLScriptElement;
const nsIWebNavigationIface = Ci.nsIWebNavigation;

/**
 * Preference branch
 */
let Prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService);
Prefs = Prefs.getBranch("extensions.procon.");

/**
 * String bundle
 */
const stringBundleService = Cc["@mozilla.org/intl/stringbundle;1"].getService(Ci.nsIStringBundleService);
let stringBundle = stringBundleService.createBundle("chrome://procon/locale/overlay.properties");

/**
 * Schemes ignored by the filter
 */
let ignoredSchemes =
{
    resource   : true,
    about      : true,
    chrome     : true,
    data       : true,
    javascript : true
};

/**
 * Latest blocked URI
 */
let blockedURI = null;

/**
 * Cache of visited addresses
 */
var cacheObj = function()
{
    this.blacklist =
    {
    };
    
    this.whitelist =
    {
    };
};

/**
 * Types of lists allowed
 */
const LIST_TYPE =
{
    SITES : 0,
    WORDS : 1
}

/**
 * Prepare strings containing unicode characters
 */
function formatList(str, type)
{
    let list = "";

    // convert unicode characters
    for (let i = 0, len = str.length; i < len; i++)
    {
        let character = str.charCodeAt(i);
        if (character > 127)
        {
            let hexVal = Number(character).toString(16);
            list += "\\u" + ("000" + hexVal).match(/.{4}$/)[0];
            continue;
        }
        list += str.charAt(i);
    }

    // remove trailing newlines
    list = "\n" + list + "\n";
    let array = list.split(/[\r\n]+/);
    array.pop();
    array.shift();

    list = (type === LIST_TYPE.WORDS)
        ? "(?:^|\\b|\\s)(?:" + array.join("|") + ")(?:$|\\b|\\s)"
        : array.join("|");

    return list;
}

/**
 * Blacklist preferences object
 */
var blacklistObj = function()
{
    this.enabled = Prefs.getBoolPref("blacklist.enabled");

    let subscriptions_sites = [], subscriptions_words = [];

    if (Prefs.getBoolPref("subscriptions.enabled"))
    {
        let subscriptions_sitesObj = Prefs.getComplexValue("subscriptions.blacklist.sites", Ci.nsISupportsString).data;
        let subscriptions_wordsObj = Prefs.getComplexValue("subscriptions.blacklist.words", Ci.nsISupportsString).data;

        subscriptions_sitesObj = JSON.parse(subscriptions_sitesObj);
        subscriptions_wordsObj = JSON.parse(subscriptions_wordsObj);

        for (var i in subscriptions_sitesObj)
            subscriptions_sites.push(subscriptions_sitesObj[i]);

        for (var i in subscriptions_wordsObj)
            subscriptions_words.push(subscriptions_wordsObj[i]);
 
        subscriptions_sites = (subscriptions_sites.length)
            ? "|" + subscriptions_sites.join("|")
            : "";
        subscriptions_words = (subscriptions_words.length)
            ? "|" + subscriptions_words.join("|")
            : "";
    }

    let sites = Prefs.getComplexValue("blacklist.sites", Ci.nsISupportsString).data;
    let words = Prefs.getComplexValue("blacklist.words", Ci.nsISupportsString).data;
  
    this.sites = new RegExp(formatList(sites, LIST_TYPE.SITES) + subscriptions_sites, "gi");
    this.words = new RegExp(formatList(words, LIST_TYPE.WORDS) + subscriptions_words, "gi");
    this.sites_enabled = Prefs.getBoolPref("blacklist.sites.enabled");
    this.words_enabled = Prefs.getBoolPref("blacklist.words.enabled");

    delete sites;
    delete words;
    delete subscriptions_sites;
    delete subscriptions_words;

    //advanced preferences
    this.advanced_limitNetAccess   = Prefs.getBoolPref("blacklist.advanced.limitNetAccess");
    this.advanced_showDetails      = Prefs.getBoolPref("blacklist.advanced.showDetails");
    this.advanced_customWarning    = Prefs.getBoolPref("blacklist.advanced.customWarning");
    this.advanced_customWarningMsg = Prefs.getComplexValue("blacklist.advanced.customWarningMsg", Ci.nsISupportsString).data;
    this.advanced_redirect         = Prefs.getBoolPref("blacklist.advanced.redirect");
    this.advanced_redirectURL      = Prefs.getComplexValue("blacklist.advanced.redirectURL", Ci.nsISupportsString).data;
    this.advanced_examineMeta      = Prefs.getBoolPref("blacklist.advanced.examineMeta");
};

/**
 * Whitelist preferences object
 */
var whitelistObj = function()
{
    this.enabled = Prefs.getBoolPref("whitelist.enabled");
    let subscriptions_sites = [];
 
    if (Prefs.getBoolPref("subscriptions.enabled"))
    {
        let subscriptions_sitesObj = Prefs.getComplexValue("subscriptions.whitelist.sites", Ci.nsISupportsString).data;
        subscriptions_sitesObj = JSON.parse(subscriptions_sitesObj);

        for (var i in subscriptions_sitesObj)
            subscriptions_sites.push(subscriptions_sitesObj[i]);
 
        subscriptions_sites = (subscriptions_sites.length)
            ? "|" + subscriptions_sites.join("|")
            : "";
    }
 
    let sites = Prefs.getComplexValue("whitelist.sites", Ci.nsISupportsString).data;

    if (this.enabled && Prefs.getBoolPref("blacklist.advanced.redirect"))
    {
        this.sites = new RegExp(formatList(Prefs.getComplexValue("blacklist.advanced.redirectURL", Ci.nsISupportsString).data
                        + "\n" + sites, LIST_TYPE.SITES) + subscriptions_sites, "gi");
    }
    else if (Prefs.getBoolPref("blacklist.advanced.redirect"))
    {
        // BUGFIX: http://proconlatte.com/bugs/view.php?id=7
        this.sites = new RegExp(formatList(Prefs.getComplexValue("blacklist.advanced.redirectURL", Ci.nsISupportsString).data, LIST_TYPE.SITES), "gi");
        this.enabled = true;
    }
    else
    {
        this.sites = new RegExp(formatList(sites, LIST_TYPE.SITES) + subscriptions_sites, "gi");
    }

    delete sites;
    delete subscriptions_sites;
};

// establish session access for blocked sites 
whitelistObj.prototype.session =
{
    pages :
    {
    },

    domains :
    {
    }
};

/**
 * Profanity list preferences object
 */
var profanitylistObj = function()
{
    this.enabled = Prefs.getBoolPref("profanitylist.enabled");
    let subscriptions_words = [];

    if (Prefs.getBoolPref("subscriptions.enabled"))
    {
        let subscriptions_wordsObj = Prefs.getComplexValue("subscriptions.profanitylist.words", Ci.nsISupportsString).data;
        subscriptions_wordsObj = JSON.parse(subscriptions_wordsObj);

        for (var i in subscriptions_wordsObj)
            subscriptions_words.push(subscriptions_wordsObj[i]);
 
        subscriptions_words = (subscriptions_words.length)
            ? "|" + subscriptions_words.join("|")
            : "";
    }

    let words = Prefs.getComplexValue("profanitylist.words", Ci.nsISupportsString).data;

    this.words = new RegExp(formatList(words, LIST_TYPE.WORDS) + subscriptions_words, "gi");

    delete words;
    delete subscriptions_words;

    // regex might strip the first space sometimes
    this.placeholder = " " + Prefs.getComplexValue("profanitylist.placeholder", Ci.nsISupportsString).data;
};

let blacklist     = new blacklistObj();
let whitelist     = new whitelistObj();
let profanitylist = new profanitylistObj();
let cache         = new cacheObj();

/**
 * Public functions
 */
var publicObj =
{
    updatePrefs : function()
    {
        blacklist     = new blacklistObj();
        whitelist     = new whitelistObj();
        profanitylist = new profanitylistObj();
        cache         = new cacheObj();
    },

    getBlockedURI : function()
    {
        return blockedURI;
    },

    setWhitelistSessionPage : function(url)
    {
        whitelist.session.pages[decodeURIComponent(url)] = 1;
    },

    setWhitelistSessionDomain : function(url)
    {
        whitelist.session.domains[decodeURIComponent(url)] = 1;
    }
};

/**
 * Check whether the whitelist contains the URI parameters
 */
function inWhitelist(host, spec)
{
    if (typeof whitelist.session.domains[host] !== "undefined" || typeof whitelist.session.pages[spec] !== "undefined")
    {
        return true;
    }
    else if (whitelist.enabled)
    {
        let match = -1;

        //get or store from cache
        if (typeof cache.whitelist[spec] !== "undefined")
        {
            match = cache.whitelist[spec];
        }
        else
        {
            match = spec.search(whitelist.sites);

            //prevent bypass of whitelist keywords via parameters
            if (match !== -1)
            {
                let prematchStr = spec.substr(0, match);
                if (prematchStr.indexOf("?") !== -1 || prematchStr.indexOf("#") !== -1)
                    match = -1;
            }
            cache.whitelist[spec] = match;
        }

        if (match !== -1)
            return true;

    }

    return false;
}

/**
 * URL filtering
 */
function scanURL(aSubject, uri)
{
    if (blacklist.enabled && blacklist.sites_enabled && typeof ignoredSchemes[uri.scheme] === "undefined")
    {
        let URI_spec = decodeURIComponent(uri.spec);
        let URI_host = decodeURIComponent(uri.host);

        if (inWhitelist(URI_host, URI_spec))
            return;

        if (blacklist.advanced_limitNetAccess)
        {
            aSubject.cancel(Components.results.NS_ERROR_FAILURE); // Cancel the request
            let webNav = aSubject.notificationCallbacks.getInterface(nsIWebNavigationIface);
            let msg = (blacklist.advanced_showDetails)
                ? stringBundle.GetStringFromName("internetBlockEnabled")
                : "";
            filteredNode(webNav, uri, msg, false);
            return; // internet-wide block has been enabled in advanced prefs
        }

        let match = -1;

        //get or store result from cache
        if (typeof cache.blacklist[URI_spec] !== "undefined")
        {
            match = cache.blacklist[URI_spec];
        }
        else
        {
            match = URI_spec.search(blacklist.sites);
            cache.blacklist[URI_spec] = match;
        }

        if (match !== -1)
        {
            aSubject.cancel(Components.results.NS_ERROR_FAILURE); // Cancel the request
            let webNav = aSubject.notificationCallbacks.getInterface(nsIWebNavigationIface);
            let msg = (blacklist.advanced_showDetails)
                ? stringBundle.GetStringFromName("addressMatched") + " \"" + URI_spec.substr(match,20) + "\u2026\""
                : "";
            filteredNode(webNav, uri, msg, false);
            return;
        }
    }
}

/**
 * Content listener
 */
function contentListener(event)
{
    let doc = event.target;
    let body = doc.body;

    if (!body || body.childElementCount === 0 || (blacklist.enabled === false && profanitylist.enabled === false))
        return;

    let elements = doc.evaluate('//text()[normalize-space()]',
        body,
        null,
        nsIDOMXPathResultIface.ORDERED_NODE_SNAPSHOT_TYPE,
        null);

    let URI = doc.baseURIObject;
    let URI_host = decodeURIComponent(URI.host);
    let URI_spec = decodeURIComponent(URI.spec);

    let scanContentAllowed = (blacklist.enabled 
        && blacklist.words_enabled 
        && typeof ignoredSchemes[URI.scheme] === "undefined" 
        && !(inWhitelist(URI_host, URI_spec)));

    if (scanContentAllowed)
    {
        // check meta tags
        if (blacklist.advanced_examineMeta)
        {
            let elements = doc.evaluate('/html/head/meta[@name="description"]/@content',
                body,
                null,
                nsIDOMXPathResultIface.STRING_TYPE,
                null);
            elements = elements.stringValue;
            var match = elements.search(blacklist.words);
            
            if (match !== -1)
            {
                let msg = (blacklist.advanced_showDetails)
                    ? stringBundle.GetStringFromName("metaTagMatched") + " \"" + elements.substr(match,20) + "\u2026\""
                    : "";
                filteredNode(doc, URI, msg, true);
                return;
            }
        }

        let cf = new contentFilter(doc, elements);
        cf.traceDoc(0);
    }

    if (profanitylist.enabled)
    {
        let pf = new profanityFilter(doc, elements);
        pf.traceDoc(0);
    }

    let timer = Cc["@mozilla.org/timer;1"].createInstance(nsITimerIface);
    timer.initWithCallback(
        function()
        {
            body.addEventListener("DOMNodeInserted", 
            function(event)
            {
                let elements = doc.evaluate('descendant-or-self::text()[normalize-space()]',
                    event.target,
                    null,
                    nsIDOMXPathResultIface.ORDERED_NODE_SNAPSHOT_TYPE,
                    null);

                if (scanContentAllowed)
                {
                    let cf = new contentFilter(doc, elements);
                    cf.traceDoc(0);
                }

                if (profanitylist.enabled)
                {
                    let pf = new profanityFilter(doc, elements);
                    pf.traceDoc(0);
                }
            }, false);
        }, 100, nsITimerIface.TYPE_ONE_SHOT);
}

/**
 * Content filter
 */
var contentFilter = function(doc, elements)
{
    this.i = 0;
    this.t = "";
    this.pause = 3;
    this.nodesPerBatch = 20;
    this.doc = doc;
    this.elements = elements;
};

contentFilter.prototype.traceDoc = function(ms)
{
    var timer = Cc["@mozilla.org/timer;1"].createInstance(nsITimerIface), _that = this;
    timer.initWithCallback(
        (function(_that)
        {
            return function()
            {
                _that.filter(_that);
            };
        })(_that), ms, nsITimerIface.TYPE_ONE_SHOT);
};

contentFilter.prototype.filter = function(_that)
{
    var el, data = "", loopCount = 0;

    while ((el=_that.elements.snapshotItem(_that.i++)) && (loopCount <= _that.nodesPerBatch))
    {
        var pn = el.parentNode;

        if (pn === null || pn.nodeType === 9 || pn.nodeType === 11 
            || (pn.nodeType === 1 && !(pn instanceof nsIDOMHTMLScriptElementIface || pn instanceof nsIDOMHTMLStyleElementIface)))
        {
            data += el.data + " ";
        }

        loopCount++;
    }

    _that.t += data + " ";

    if (el != null)
    {
        _that.i--;
        _that.traceDoc(_that.pause);
    }
    else
    {
        var match = _that.t.search(blacklist.words);
        if (match !== -1)
        {
            let msg = (blacklist.advanced_showDetails)
                ? stringBundle.GetStringFromName("contentMatched") + " \"" + _that.t.substr(match,20) + "\u2026\""
                : "";
            filteredNode(_that.doc, _that.doc.baseURIObject, msg, true);
        }
    }
};

/**
 * Profanity filter
 */
var profanityFilter = function(doc, elements)
{
    this.i = 0;
    this.pause = 3;
    this.nodesPerBatch = 20;
    this.doc = doc;
    this.elements = elements;
};

profanityFilter.prototype.traceDoc = function(ms)
{
    var timer = Cc["@mozilla.org/timer;1"].createInstance(nsITimerIface), _that = this;
    timer.initWithCallback((function(_that)
        {
            return function()
            {
                _that.filter(_that);
            };
        })(_that), ms, nsITimerIface.TYPE_ONE_SHOT);
};

profanityFilter.prototype.filter = function(_that)
{
    var el, data = "", loopCount = 0;

    while ((el=_that.elements.snapshotItem(_that.i++)) && (loopCount <= _that.nodesPerBatch))
    {
        var pn = el.parentNode;
        if (pn === null || pn.nodeType === 9 || pn.nodeType === 11
            || (pn.nodeType === 1 && !(pn instanceof nsIDOMHTMLScriptElementIface || pn instanceof nsIDOMHTMLStyleElementIface)))
        {
            data = el.data;
            if (data !== null)
            {
                // FIX for bug, but I don't like it since I'm still
                // not sure why replace() causes the cursor to move
                // BUG: http://proconlatte.com/bugs/view.php?id=6
                var match = data.search(profanitylist.words);
                if (match !== -1)
                    el.data = data.replace(profanitylist.words, profanitylist.placeholder);
            }
        }

        loopCount++;
    }

    if (el != null)
    {
        _that.i--;
        _that.traceDoc(_that.pause);
    }
};

/**
 * Returns browser window
 */
function getBrowser()
{
    let wm = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);
    return wm.getMostRecentWindow("navigator:browser").getBrowser();
}

/**
 * Notifies the user of blocked page
 */
function filteredNode(doc, URI, msg, isContent)
{
    let win = getBrowser();
    //let win = doc.defaultView;
    let contentBrwsr = win.getBrowserForDocument(doc);

    if (isContent)
    {
        //stop loading
        if (contentBrwsr !== null)
            contentBrwsr.stop();

        let docEl = doc.documentElement;
        if (docEl !== null)
        {
            let newEl = docEl.cloneNode(false);
            newEl.innerHTML = '';
            docEl.parentNode.replaceChild(newEl, docEl);
        }

        if (blacklist.advanced_redirect)
        {
            //var contentBrwsr = gBrowser.getBrowserForDocument(doc.defaultView.top.document);
            contentBrwsr.loadURI(blacklist.advanced_redirectURL);
            return; //no need for notification box
        }
    }
    else if (blacklist.advanced_redirect)
    {
        doc.loadURI(blacklist.advanced_redirectURL, nsIWebNavigationIface.LOAD_FLAGS_NONE, null, null, null);
        return;
    }

    let notificationBox = win.getNotificationBox(contentBrwsr);
    notificationBox.removeAllNotifications(false); //remove open notification boxes

    blockedURI = URI;
    let msg = (blacklist.advanced_customWarning)
        ? blacklist.advanced_customWarningMsg + " " + msg
        : stringBundle.GetStringFromName("unavailablePage") + " " + msg;
    let button = [{
        label: stringBundle.GetStringFromName("options"),
        accessKey: null,
        popup: "procon-notification-popup",
        callback: null,
    }];

    notificationBox.appendNotification(msg, null, "chrome://global/skin/icons/blacklist_favicon.png", notificationBox.PRIORITY_WARNING_HIGH, button);  
}
