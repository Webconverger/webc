/*-----------------------------------------------------
  Copyright (c) 2011 Hunter Paolini.  All Rights Reserved.
  -----------------------------------------------------*/

var EXPORTED_SYMBOLS = ["subscriptions"];

const Cc = Components.classes;
const Ci = Components.interfaces;

let Prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService);
Prefs = Prefs.getBranch("extensions.procon.subscriptions.");

var subscriptions = function()
{
    this.jsObject =
    {
    };
};

subscriptions.prototype.getFromURL = function(url)
{
    var req = Cc["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance(Ci.nsIXMLHttpRequest);
    try
    {
        req.open('GET', url, false);
        req.overrideMimeType("text/plain");
        req.send(null);
        if(req.status == 200 || req.status == 0)
        {
            let jsStr = req.responseText;

            if (!this.isValid(jsStr, url))
            {
                dump("Invalid subscription: "+url+"\n");
            }
            else
            {
                return true;
            }
        }
        else
        {
            dump("Error loading subscription: "+url+"\n");
        }
    }
    catch (e)
    {
        return false;
    }

    return false;
};
  
subscriptions.prototype.isValid = function(jsStr, url)
{
    if (!jsStr)
        return false;
        
    var linebreak = "\n";
    if (/(\r\n?|\n\r?)/.test(jsStr))
        lineBreak = RegExp.$1;
    
    var arr = jsStr.split(linebreak);

    if (!arr)
        return false;

    if(!(new RegExp("procon latte", "gi")).test(arr[0]))
        return false;

    let jsObject =
    {
    };

    var listRe = new RegExp("^(?:profanitylist\\.words|blacklist\\.(?:sites|words)|whitelist\\.sites)", "i");

    for (var i = 1, len = arr.length; i < len; i++)
    {
        var element = arr[i];

        if (element.length < 3 || /^\s*#/m.test(element))
            continue;

        if (listRe.test(element))
        {
            var name = element.match(listRe)[0];
            var index = element.indexOf("=");

            if (index <= 0)
                continue;

            var value = [];
            var firstVal = element.substring(index + 1, element.length).replace(/^\s+|\s+$/g, "");
                
            if (firstVal.length > 0)
                value.push(firstVal);
            
            while (arr[++i] && arr[i].length > 0 && !(listRe.test(arr[i])))
                value.push(arr[i]);

            i--;

            let list = value.join("\n");
            
            jsObject[name] =
            {
            };
            
            // check if list is already formatted as regex pattern
            if (/^\/.*\/$/g.test(list))
            {
                list = list.replace(/^\/|\/$/g, "");
                jsObject[name].regexReady = true;
            }
            
            jsObject[name].list = list;
        }
    }
    
    this.jsObject[encodeURIComponent(url)] = jsObject;
    return true;
};

subscriptions.prototype.save = function(urls)
{
    Components.utils.import("resource://procon/filter.jsm");
 
    let blacklist_sites = Prefs.getComplexValue("blacklist.sites", Ci.nsISupportsString).data;
    let blacklist_words = Prefs.getComplexValue("blacklist.words", Ci.nsISupportsString).data;
    let whitelist_sites = Prefs.getComplexValue("whitelist.sites", Ci.nsISupportsString).data;
    let profanitylist_words = Prefs.getComplexValue("profanitylist.words", Ci.nsISupportsString).data;

    try
    {
        blacklist_sites = JSON.parse(blacklist_sites);
        blacklist_words = JSON.parse(blacklist_words);
        whitelist_sites = JSON.parse(whitelist_sites);
        profanitylist_words = JSON.parse(profanitylist_words);
    }
    catch (e)
    {
        dump("Error saving subscriptions: " + e);
        return;
    }
 
    for (var i in this.jsObject)
    {
        let obj = this.jsObject[i];     
        
        if (obj.hasOwnProperty("blacklist.sites"))
        {
            let bsObj = obj["blacklist.sites"];
            blacklist_sites[i] = (bsObj.hasOwnProperty("regexReady") && bsObj.regexReady)
                ? bsObj.list
                : formatList(bsObj.list, LIST_TYPE.SITES);
        }
        
        if (obj.hasOwnProperty("blacklist.words"))
        {
            let bwObj = obj["blacklist.words"];
            blacklist_words[i] = (bwObj.hasOwnProperty("regexReady") && bwObj.regexReady)
                ? bwObj.list
                : formatList(bwObj.list, LIST_TYPE.WORDS);
        }
        
        if (obj.hasOwnProperty("whitelist.sites"))
        {
            let wsObj = obj["whitelist.sites"];
            whitelist_sites[i] = (wsObj.hasOwnProperty("regexReady") && wsObj.regexReady)
                ? wsObj.list
                : formatList(wsObj.list, LIST_TYPE.SITES);
        }
        
        if (obj.hasOwnProperty("profanitylist.words"))
        {
            let pwObj = obj["profanitylist.words"];
            profanitylist_words[i] = (pwObj.hasOwnProperty("regexReady") && pwObj.regexReady)
                ? pwObj.list
                : formatList(pwObj.list, LIST_TYPE.WORDS);
        }
    }
    
    // remove old subscriptions
    let len = urls.length;
    for (var i in blacklist_sites)
    {
        let found = false;
        for (var j = 0; j < len; j++)
        {
            if (i == urls[j])
                found = true;
        }

        if (!found)
            delete blacklist_sites[i];
    }

    for (var i in blacklist_words)
    {
        let found = false;
        for (var j = 0; j < len; j++)
        {
            if (i == urls[j])
                found = true;
        }

        if (!found)
            delete blacklist_words[i];
    }

    for (var i in whitelist_sites)
    {
        let found = false;
        for (var j = 0; j < len; j++) {
            if (i == urls[j])
                found = true;
        }

        if (!found)
            delete whitelist_sites[i];
    }
    
    for (var i in profanitylist_words)
    {
        let found = false;
        for (var j = 0; j < len; j++) {
            if (i == urls[j])
                found = true;
        }

        if (!found)
            delete profanitylist_words[i];
    }

    // save as complex values
    let blacklist_sites_complex = Cc["@mozilla.org/supports-string;1"].createInstance(Ci.nsISupportsString);
    let blacklist_words_complex = Cc["@mozilla.org/supports-string;1"].createInstance(Ci.nsISupportsString);
    let whitelist_sites_complex = Cc["@mozilla.org/supports-string;1"].createInstance(Ci.nsISupportsString);
    let profanity_words_complex = Cc["@mozilla.org/supports-string;1"].createInstance(Ci.nsISupportsString);
    
    blacklist_sites_complex.data = JSON.stringify(blacklist_sites);
    blacklist_words_complex.data = JSON.stringify(blacklist_words);
    whitelist_sites_complex.data = JSON.stringify(whitelist_sites);
    profanity_words_complex.data = JSON.stringify(profanitylist_words);
    
    Prefs.setComplexValue("blacklist.sites", Ci.nsISupportsString, blacklist_sites_complex);
    Prefs.setComplexValue("blacklist.words", Ci.nsISupportsString, blacklist_words_complex);
    Prefs.setComplexValue("whitelist.sites", Ci.nsISupportsString, whitelist_sites_complex);
    Prefs.setComplexValue("profanitylist.words", Ci.nsISupportsString, profanity_words_complex);
};

subscriptions.prototype.update = function()
{
    try
    {
        let urls = JSON.parse(Prefs.getComplexValue("urls", Ci.nsISupportsString).data);

        for (var i = 0, len = urls.length; i < len; i++)
            this.getFromURL(decodeURIComponent(urls[i]));

        this.save(urls);
        
        let date = new Date();
        let time = date.getTime() / 1000;
        Prefs.setIntPref("lastUpdateTime", time);
    }
    catch(e)
    {
        return false;
    }

    //dump("ProCon: Subscriptions updated successfully...");
    return true;
};
