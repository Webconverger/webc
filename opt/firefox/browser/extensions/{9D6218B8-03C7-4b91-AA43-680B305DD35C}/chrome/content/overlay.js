/*-----------------------------------------------------
  Copyright (c) 2011 Hunter Paolini.  All Rights Reserved.
  -----------------------------------------------------*/

var procon =
{
    onLoad : function()
    {
        procon.common = Cu.import("chrome://procon/content/common.js", null).common;
        procon.common.updateButtonElements();
    },

    onMenuItemCommand : function(e, args)
    {
        window.openDialog("chrome://procon/content/preferences.xul",
            "procon-preferences",
            "chrome,titlebar,toolbar,centerscreen,resizable,modal",
            "mainPane",
            args);
    },

    onToolbarButtonCommand : function(e)
    {
        procon.onMenuItemCommand(e, null);
    },

    onStatusbarButtonCommand : function(e)
    {
        procon.onMenuItemCommand(e, null);
    },

    openAbout : function(e)
    {
        Cu.import("resource://gre/modules/AddonManager.jsm");
        AddonManager.getAddonByID("{9D6218B8-03C7-4b91-AA43-680B305DD35C}",
            function(addon)
            {
                openDialog("chrome://mozapps/content/extensions/about.xul", "", "chrome,centerscreen,modal", addon);
            });
    },

    onNotificationPopupShowing : function(e)
    {
        var domainSessionMenuItem = document.getElementById("procon-notification-popup-domain-session");
        var domainWhitelistMenuItem = document.getElementById("procon-notification-popup-domain-whitelist");

        var URI = Cu.import("resource://procon/filter.jsm", null).publicObj.getBlockedURI();
        var stringBundle = document.getElementById("procon-strings");

        domainSessionMenuItem.setAttribute("label", stringBundle.getFormattedString("domainAllowTemp", [URI.host]));
        domainWhitelistMenuItem.setAttribute("label", stringBundle.getFormattedString("domainAddWhitelist", [URI.host]));
    },

    allowPage : function(e)
    {
        if (!procon.common.authenticateUser())
            return;

        try
        {
            //var URI = window.content.document.baseURIObject;alert(URI.spec);
            var publicObj = Cu.import("resource://procon/filter.jsm", null).publicObj;
            var URI = publicObj.getBlockedURI();
            publicObj.setWhitelistSessionPage(URI.spec);
            window.content.location = URI.spec;
        }
        catch(err)
        {
            dump("Procon publicObj: " + err);
        }
    },

    allowDomain : function(e)
    {
        if (!procon.common.authenticateUser())
            return;

        try
        {
            var publicObj = Cu.import("resource://procon/filter.jsm", null).publicObj;
            var URI = publicObj.getBlockedURI();
            publicObj.setWhitelistSessionDomain(URI.host);
            window.content.location = URI.spec;
        }
        catch(err)
        {
            dump("Procon publicObj: " + err);
        }
    },

    addBlacklistSite : function(el)
    {
        if (!procon.common.authenticateUser())
            return;

        var prompts = Cc["@mozilla.org/embedcomp/prompt-service;1"].getService(Ci.nsIPromptService);
        var check =
        {
            value : false
        };
        var input =
        {
            value : window.content.document.baseURIObject.host || ""
        };
        var result = prompts.prompt(null, el.label, document.getElementById("procon-strings").getString("siteBlockPrompt"), input, null, check);

        if (!result)
            return;

        var prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService);

        var value = prefs.getComplexValue("extensions.procon.blacklist.sites", Ci.nsISupportsString).data;
        var complex_value = Cc["@mozilla.org/supports-string;1"].createInstance(Ci.nsISupportsString);
        complex_value.data = value + "\n" + input.value;
        prefs.setComplexValue("extensions.procon.blacklist.sites", Ci.nsISupportsString, complex_value);

        try
        {
            Cu.import("resource://procon/filter.jsm", null).publicObj.updatePrefs();
        }
        catch(e)
        {
            dump("Procon publicObj: " + e);
        }
    },

    addBlacklistWord : function(el)
    {
        if (!procon.common.authenticateUser())
            return;

        var prompts = Cc["@mozilla.org/embedcomp/prompt-service;1"].getService(Ci.nsIPromptService);

        var check =
        {
            value : false
        };
        var input =
        {
            value : window.content.document.getSelection() || ""
        };
        var result = prompts.prompt(null, el.label, document.getElementById("procon-strings").getString("wordBlockPrompt"), input, null, check);
 
        if (!result)
            return;
 
        var prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService);
 
        var value = prefs.getComplexValue("extensions.procon.blacklist.words", Ci.nsISupportsString).data;
        var complex_value = Cc["@mozilla.org/supports-string;1"].createInstance(Ci.nsISupportsString);
        complex_value.data = value + "\n" + input.value;
        prefs.setComplexValue("extensions.procon.blacklist.words", Ci.nsISupportsString, complex_value);

        try
        {
            Cu.import("resource://procon/filter.jsm", null).publicObj.updatePrefs();
        }
        catch(e)
        {
            dump("Procon publicObj: " + e);
        }
    },

    addWhitelistSite : function(el)
    {
        if (!procon.common.authenticateUser())
            return;

        var prompts = Cc["@mozilla.org/embedcomp/prompt-service;1"].getService(Ci.nsIPromptService);
        var check =
        {
            value : false
        };
        var input =
        {
            value : window.content.document.baseURIObject.host || ""
        };
        var result = prompts.prompt(null, el.label, document.getElementById("procon-strings").getString("siteTrustPrompt"), input, null, check);

        if (!result)
            return;

        var prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService);

        var value = prefs.getComplexValue("extensions.procon.whitelist.sites", Ci.nsISupportsString).data;
        var complex_value = Cc["@mozilla.org/supports-string;1"].createInstance(Ci.nsISupportsString);
        complex_value.data = value + "\n" + input.value;
        prefs.setComplexValue("extensions.procon.whitelist.sites", Ci.nsISupportsString, complex_value);

        try
        {
            Cu.import("resource://procon/filter.jsm", null).publicObj.updatePrefs();
        }
        catch(e)
        {
            dump("Procon publicObj: " + e);
        }
    },

    addProfanitylistWord : function(el)
    {
        if (!procon.common.authenticateUser())
            return;

        var prompts = Cc["@mozilla.org/embedcomp/prompt-service;1"].getService(Ci.nsIPromptService);
        var check =
        {
            value : false
        };
        var input =
        {
            value : window.content.document.getSelection() || ""
        };
        var result = prompts.prompt(null, el.label, document.getElementById("procon-strings").getString("wordCensorPrompt"), input, null, check);

        if (!result)
            return;

        var prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService);

        var value = prefs.getComplexValue("extensions.procon.profanitylist.words", Ci.nsISupportsString).data;
        var complex_value = Cc["@mozilla.org/supports-string;1"].createInstance(Ci.nsISupportsString);
        complex_value.data = value + "\n" + input.value;
        prefs.setComplexValue("extensions.procon.profanitylist.words", Ci.nsISupportsString, complex_value);

        try
        {
            Cu.import("resource://procon/filter.jsm", null).publicObj.updatePrefs();
        }
        catch(e)
        {
            dump("Procon publicObj: " + e);
        }
    }
};

window.addEventListener("load", procon.onLoad, false);
