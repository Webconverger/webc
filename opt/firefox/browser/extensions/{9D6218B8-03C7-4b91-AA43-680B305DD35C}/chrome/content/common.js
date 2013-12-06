/*-----------------------------------------------------
  Copyright (c) 2011 Hunter Paolini.  All Rights Reserved.
  -----------------------------------------------------*/

let Cc = Components.classes;
let Ci = Components.interfaces;
let Cu = Components.utils;

const common =
{
    updateButtonElements : function()
    {
        let Prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService);
        Prefs = Prefs.getBranch("extensions.procon.");

        var wm = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);
        var browserWindow = wm.getMostRecentWindow("navigator:browser");

        if (Prefs.getBoolPref("blacklist.enabled") || Prefs.getBoolPref("profanitylist.enabled"))
        {
            browserWindow.document.getElementById("procon-status-img").setAttribute("src", "chrome://procon/skin/images/security_small.png");
        }
        else
        {
            browserWindow.document.getElementById("procon-status-img").setAttribute("src", "chrome://procon/skin/images/security_small_gray.png");
        }

        browserWindow.document.getElementById("procon-status").hidden = !Prefs.getBoolPref("misc.showStatusButton");
        browserWindow.document.getElementById("procon-menu-button").hidden = !Prefs.getBoolPref("misc.showMenuButton");
    },

    authenticateUser : function()
    {
        let Prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService);
        Prefs = Prefs.getBranch("extensions.procon.");

        if (Prefs.prefHasUserValue("general.password"))
        {
            var prompts = Cc["@mozilla.org/embedcomp/prompt-service;1"].getService(Ci.nsIPromptService);

            var wm = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);
            var browserWindow = wm.getMostRecentWindow("navigator:browser");
            var strings = browserWindow.document.getElementById("procon-strings");

            var password =
            {
                value : ""
            },
            check =
            {
                value : false
            }; //XXX: need to pass an object for the checkbox, even if hidden

            var password_result = prompts.promptPassword(null,
                strings.getString("passwordPromptTitle"),
                strings.getString("passwordPrompt"),
                password,
                null,
                check);

            if (!password_result)
                return false;

            if (Cu.import("chrome://procon/content/third_party/md5.js", null).hex_md5(password.value) != Prefs.getCharPref("general.password"))
            {
                prompts.alert(null,
                    strings.getString("passwordPromptTitle"),
                    strings.getString("passwordPromptWrong"));
                return false;
            }
        }
        return true;
    }
};
