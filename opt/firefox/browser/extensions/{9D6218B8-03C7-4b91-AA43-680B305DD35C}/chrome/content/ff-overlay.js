/*-----------------------------------------------------
  Copyright (c) 2011 Hunter Paolini.  All Rights Reserved.
  -----------------------------------------------------*/

procon.onFirefoxLoad = function(event)
{
    var Prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService);
    Prefs = Prefs.getBranch("extensions.procon.");

    // clean unecessary prefs from previous versions
    if (Prefs.getCharPref("currentVersion") < "3.0")
    {
        Cu.import("resource://procon/houseKeeping.jsm", null).houseKeeping();
        Cu.import("chrome://procon/content/common.js", null).common.updateButtonElements();
    }

    // update subscriptions every 72 hours
    if (Prefs.getBoolPref("subscriptions.enabled"))
    {
        var date = new Date();
        var time = date.getTime() / 1000;
        var lastUpdateTime = Prefs.getIntPref("subscriptions.lastUpdateTime");

        if (((time - lastUpdateTime) / 3600) > 72)
        {
            (new (Cu.import("resource://procon/subscriptions.jsm", null).subscriptions)).update();
            Cu.import("resource://procon/filter.jsm", null).publicObj.updatePrefs();
        }
    }

    document.addEventListener("DOMContentLoaded", procon.contentListener, false);
    document.addEventListener("DOMContentLoaded", procon.configProtectionListener, false);

    if (Prefs.prefHasUserValue("general.password"))
        document.getElementById("helpSafeMode").disabled = true;

    try
    {
        Cu.import("resource://gre/modules/AddonManager.jsm");
        AddonManager.addAddonListener(procon.addonProtectionListener);
    }
    catch(ex)
    {
    }
};

procon.onFirefoxUnload = function(event)
{
    document.removeEventListener("DOMContentLoaded", procon.contentListener, false);
};

procon.contentListener = Cu.import("resource://procon/filter.jsm", null).contentListener;

procon.configProtectionListener = function(event)
{
    var loc = event.target.location;

    if (!loc)
        return;

    loc = loc.href.toLowerCase();
    if (((loc == "about:config" || loc == "chrome://global/content/config.xul") && !Cu.import("chrome://procon/content/common.js", null).common.authenticateUser()) || loc.indexOf("://procon/") != - 1)
        event.target.location = "about:blank";
};

procon.addonProtectionListener =
{
    onUninstalling : function(addon)
    {
        if (addon.id == "{9D6218B8-03C7-4b91-AA43-680B305DD35C}" && !Cu.import("chrome://procon/content/common.js", null).common.authenticateUser())
        {
            AddonManager.getAddonByID("{9D6218B8-03C7-4b91-AA43-680B305DD35C}", function(addon) { addon.cancelUninstall(); });
        }
        else
        {
            var Prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService);
            Prefs.clearUserPref("nglayout.initialpaint.delay");
        }
    },

    onDisabling : function(addon)
    {
        if (addon.id == "{9D6218B8-03C7-4b91-AA43-680B305DD35C}" && !Cu.import("chrome://procon/content/common.js", null).common.authenticateUser())
            AddonManager.getAddonByID("{9D6218B8-03C7-4b91-AA43-680B305DD35C}", function(addon) { addon.userDisabled = false; });
    }
}

window.addEventListener("load", procon.onFirefoxLoad, false);
window.addEventListener("unload", procon.onFirefoxUnload, false);
