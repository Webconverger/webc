/*-----------------------------------------------------
  Copyright (c) 2011 Hunter Paolini.  All Rights Reserved.
  -----------------------------------------------------*/

var EXPORTED_SYMBOLS = ["houseKeeping"];

let currentVersion = "3.3";

function houseKeeping()
{
    let preferences = Components.utils.import("resource://procon/preferences.jsm", null).preferences;
    let Prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
    let Prefs_old = Prefs.getBranch("procon.");
    Prefs = Prefs.getBranch("extensions.procon.");

    let prefNames =
    {
        // booleans
        "whitelist.enabled" : "enableWhiteList",
        "blacklist.enabled" : "enabled",
        "blacklist.advanced.limitNetAccess" : "bat",
        "blacklist.advanced.renderDelay" : "pDelay",
        "blacklist.advanced.examineMeta" : "exMeta",
        "blacklist.advanced.showDetails" : "reason",
        "blacklist.advanced.customWarning" : "customWarn",      
        "blacklist.advanced.redirect" : "pcust",      
        "profanitylist.enabled" : "filteron",
        "misc.showStatusButton" : "pstatus",
        "misc.showMenuButton" : "htm",
        //"blacklist.words.enabled" : "",
        //"blacklist.sites.enabled" : "" 

        // strings
        "profanitylist.placeholder" : "customCens",
        "whitelist.sites" : "whiteList",
        "blacklist.sites" : "urlregex",
        "blacklist.advanced.customWarningMsg" : "WarningMsg",
        "blacklist.words" : "wordregex",
        "profanitylist.words" : "wordlist",
        "blacklist.advanced.redirectURL" : "psit",
        //"general.password" : "password"
    };

    for (var newName in prefNames)
    {
        let oldName = prefNames[newName];
        if (Prefs_old.prefHasUserValue(oldName))
        {
            var oldValue = preferences.getPrefByType("procon." + oldName);

            if (oldName == "htm")
                oldValue = !oldValue;

            preferences.setPrefByType("extensions.procon." + newName, oldValue);
            Prefs_old.clearUserPref(oldName);
        }
    }

    if (Prefs_old.prefHasUserValue("password"))
    {
        Prefs.setCharPref("general.password", Prefs_old.getCharPref("password"));
        Prefs_old.clearUserPref("password");
    }

    if (Prefs_old.prefHasUserValue("action"))
    {
        switch (Prefs_old.getIntPref("action"))
        {
            case 0 :
                Prefs.setBoolPref("blacklist.words.enabled", true);
                Prefs.setBoolPref("blacklist.sites.enabled", false);
                break;
            case 1 :
                Prefs.setBoolPref("blacklist.words.enabled", false);
                Prefs.setBoolPref("blacklist.sites.enabled", true);
                break;
            case 2 :
                Prefs.setBoolPref("blacklist.words.enabled", true);
                Prefs.setBoolPref("blacklist.sites.enabled", true);
                break;
        }
        Prefs_old.clearUserPref("action");
    }

    if (Prefs_old.prefHasUserValue("authenticated"))
        Prefs_old.clearUserPref("authenticated");

    if (Prefs_old.prefHasUserValue("addons"))
        Prefs_old.clearUserPref("addons");

    Prefs.setCharPref("currentVersion", currentVersion);

    Components.utils.import("resource://procon/filter.jsm", null).publicObj.updatePrefs();
}
