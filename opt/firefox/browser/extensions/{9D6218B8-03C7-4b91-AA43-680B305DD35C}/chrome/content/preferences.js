/*-----------------------------------------------------
  Copyright (c) 2011 Hunter Paolini.  All Rights Reserved.
  -----------------------------------------------------*/

//const Cc = Components.classes;
//const Ci = Components.interfaces;

var prompts = Cc["@mozilla.org/embedcomp/prompt-service;1"].getService(Ci.nsIPromptService);
var Prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService);
Prefs = Prefs.getBranch("extensions.procon.");

const prefwindow =
{
    stringsBundle : null,
    load : function()
    {
        if (!common.authenticateUser())
            window.close();

        var node = document.getElementById("procon-preferences");
        var button_box = document.getAnonymousElementByAttribute(node, "anonid", "dlg-buttons");
        var extra = document.getElementById("btn-extra");   
        var extra2 = document.getAnonymousElementByAttribute(node, "dlgtype", "extra2");

        node.removeChild(extra);
        extra.setAttribute("hidden", "false");
        button_box.insertBefore(extra, extra2.nextSibling);

        this.stringsBundle = document.getElementById("procon-strings");

        // display messages passed as arguments
        var promptVals = (window.arguments)
            ? window.arguments[1]
            : {};

        if (promptVals && promptVals.title && promptVals.message)
        {
            window.setTimeout(function()
            {
                prompts.alert(null, promptVals.title, promptVals.message);
            }, 150);
        }
    },

    accept : function()
    {
        try
        {
            common.updateButtonElements();
            subscriptionsPane.saveSubscriptions();
            Components.utils.import("resource://procon/filter.jsm", null).publicObj.updatePrefs();
        }
        catch(e)
        {
            dump(e);
        }
        
        {
            let Prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService);
            if (Prefs.getBoolPref("extensions.procon.blacklist.advanced.renderDelay") == true)
            {
                Prefs.setIntPref("nglayout.initialpaint.delay", 100000);
            }
            else if (Prefs.prefHasUserValue("nglayout.initialpaint.delay")
                && Prefs.getIntPref("nglayout.initialpaint.delay") == 100000)
            {
                Prefs.clearUserPref("nglayout.initialpaint.delay");
            }
        }
    },

    unload : function()
    {
        {
            let Prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService);
            if (Prefs.getBoolPref("browser.preferences.instantApply") == true)
                this.accept();
        }
    },

    reload : function(promptTitle, promptMsg)
    {
        var opener = window.opener,
        promptVals =
        {
            title : promptTitle,
            message : promptMsg
        };

        if (opener)
        {
            opener.setTimeout(function()
            {
                opener.procon.onMenuItemCommand(null, promptVals);
            }, 50);
        }

        {
            let Prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService);
            // prevent from being called twice
            if (Prefs.getBoolPref("browser.preferences.instantApply") != true)
                this.accept();
        }
        window.close();
    },

    openDonationPage : function()
    {
        window.opener.open("http://hpaolini.com/donate/",
            "_new",
            "");
    }
};

const io =
{
    branchName : "extensions.procon.",
    allowedPrefs :
    [
        "blacklist\\.advanced\\.customWarning",
        "blacklist\\.advanced\\.examineMeta",
        "blacklist\\.advanced\\.limitNetAccess",
        "blacklist\\.advanced\\.redirect",
        "blacklist\\.advanced\\.renderDelay",
        "blacklist\\.advanced\\.showDetails",
        "blacklist\\.enabled",
        "blacklist\\.sites\\.enabled",
        "blacklist\\.words\\.enabled",
        "misc\\.showMenuButton",
        "misc\\.showStatusButton",
        "profanitylist\\.enabled",
        "subscriptions\\.enabled",
        "whitelist\\.enabled",
        "blacklist\\.advanced\\.customWarningMsg",
        "blacklist\\.advanced\\.redirectURL",
        "blacklist\\.sites",
        "blacklist\\.words",
        "profanitylist\\.placeholder",
        "profanitylist\\.words",
        "subscriptions\\.urls",
        "whitelist\\.sites"
    ],

    "export": function()
    {
        var preferences = Components.utils.import("resource://procon/preferences.jsm", null).preferences;
        var count =
        {
            value : 0
        };
        var str = "[ProCon Latte 3.3]\n# Updated: " + new Date() + "\n\n# preferences\n", endStr = "";
        var children = Prefs.getChildList("", count);
        var allowedPrefsRegex = new RegExp("^\\b(?:" + this.allowedPrefs.join("|") + ")\\b", "i");
        for (var i = 0; i < count.value; ++i)
        {
            var name = children[i];
            if (allowedPrefsRegex.test(name))
            {
                var value = preferences.getPrefByType(this.branchName + name);
                
                if (name == "profanitylist.words"
                    || name == "blacklist.sites"
                    || name == "blacklist.words"
                    || name == "whitelist.sites")
                {
                    var valueArr = value.split("\n");
                    if (valueArr.length > 1)
                    {
                        endStr += name + " =\n" + value + "\n\n";
                    }
                    else
                    {
                        endStr += name + " = " + value + "\n\n";
                    }
                }
                else if (name == "subscriptions.urls")
                {
                    value = JSON.parse(value);
                    var len = value.length;

                    for (var j = 0; j < len; j++)
                        value[j] = decodeURIComponent(value[j]);

                    value = value.join("\n");
                    if (len > 1)
                    {
                        endStr += name + " =\n" + value + "\n\n";
                    }
                    else
                    {
                        endStr += name + " = " + value + "\n\n";
                    }
                }
                else
                {
                    str += name + " = " + value + "\n";
                }
            }
        }

        str += "\n" + endStr;

        if (this.save(str))
        {
            prompts.alert(null,
                document.getElementById("export-menuitem").label,
                prefwindow.stringsBundle.getString('exportSuccess'));
        }
    },

    "import" : function()
    {
        var arr = this.open();

        if (!arr)
            return;

        if (!(/^\[procon latte.*\]$/gi.test(arr[0])))
        {
            prompts.alert(null,
                document.getElementById("import-menuitem").label,
                prefwindow.stringsBundle.getString('importInvalid'));
            return;
        }

        var preferences = Components.utils.import("resource://procon/preferences.jsm", null).preferences;
        var listRegex = new RegExp("^\\b(?:profanitylist\\.words|blacklist\\.(?:sites|words)(?!\\.enabled)|whitelist\\.sites|subscriptions\\.urls)\\b", "i");
        var allowedPrefsRegex = new RegExp("^\\b(?:" + this.allowedPrefs.join("|") + ")\\b", "i");

        for (var i = 1, len = arr.length; i < len; i++)
        {
            var element = arr[i];
            if (element.length < 3 || /^\s*#/m.test(element))
                continue;

            if (listRegex.test(element))
            {
                var name = element.match(listRegex)[0];
                var index = element.indexOf("=");
                if (index <= 0)
                    continue;
                
                var value = [];
                var firstVal = element.substring(index + 1, element.length).replace(/^\s+|\s+$/g, "");
                
                if (firstVal.length > 0)
                    value.push(firstVal);
                
                while (arr[++i] && arr[i].length > 0 && !(allowedPrefsRegex.test(arr[i])))
                    value.push(arr[i]);
 
                i--;
 
                if (name == "subscriptions.urls")
                {
                    for (var j = 0; j < value.length; j++)
                        value[j] = encodeURIComponent(decodeURIComponent(value[j]));

                    preferences.setPrefByType(this.branchName + name, JSON.stringify(value));
                }
                else
                {
                    preferences.setPrefByType(this.branchName + name, value.join("\n"));
                }
            }
            else
            {
                var index = element.indexOf("=");
                if (index <= 0)
                    continue;
                
                var name = element.substring(0, index).replace(/^\s+|\s+$/g, "");
                var value = element.substring(index + 1, element.length).replace(/^\s+|\s+$/g, "");
                if (allowedPrefsRegex.test(name))
                    preferences.setPrefByType(this.branchName + name, value);
            }
        }

        // update new subscriptions
        (new (Components.utils.import("resource://procon/subscriptions.jsm", null).subscriptions)).update();

        prefwindow.reload(document.getElementById("import-menuitem").label, prefwindow.stringsBundle.getString('importSuccess'));

        //nsIPrefServiceObj.savePrefFile(null); // store the pref immediately
    },

    reset : function()
    {
        var result = prompts.confirm(null, document.getElementById("restore-menuitem").label, prefwindow.stringsBundle.getString('restorePrompt'));

        if (!result)
            return;

        {
            let Prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService);
            if (Prefs.prefHasUserValue("nglayout.initialpaint.delay") && Prefs.getIntPref("nglayout.initialpaint.delay") == 100000)
                Prefs.clearUserPref("nglayout.initialpaint.delay");
        }

        var count =
        {
            value : 0
        };
        var children = Prefs.getChildList("", count);
        for (var i = 0; i < count.value; ++i)
        {
            var name = children[i];
            if (Prefs.prefHasUserValue(name))
                Prefs.clearUserPref(name);
        }

        prefwindow.reload(document.getElementById("restore-menuitem").label, prefwindow.stringsBundle.getString('restorePromptSuccess'));
    },

    save : function(str)
    {
        var fp = Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker);
        var stream = Cc["@mozilla.org/network/file-output-stream;1"].createInstance(Ci.nsIFileOutputStream);
        str = this.convertUnicodeToUTF8(str);
        fp.init(window, null, fp.modeSave);
        fp.defaultString='procon.txt';
        fp.appendFilter("ProCon "+prefwindow.stringsBundle.getString('configFile'),"*.txt");
        fp.appendFilters(fp.filterAll);

        if (fp.show() != fp.returnCancel)
        {
            if (fp.file.exists())
                fp.file.remove(true);

            fp.file.create(fp.file.NORMAL_FILE_TYPE, 0666);
            stream.init(fp.file, 0x04 | 0x08 | 0x20, 420, 0 );
            stream.write(str, str.length);
            stream.close();
            return true;
        }
    },

    open : function()
    {
        var fp = Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker);
        var stream = Cc["@mozilla.org/network/file-input-stream;1"].createInstance(Ci.nsIFileInputStream);
        var streamIO = Cc["@mozilla.org/scriptableinputstream;1"].createInstance(Ci.nsIScriptableInputStream);

        fp.init(window, null, fp.modeOpen);
        fp.defaultExtension = 'txt';
        fp.appendFilter("ProCon " + prefwindow.stringsBundle.getString('configFile'), "*.txt");
        fp.appendFilters(fp.filterAll);

        if (fp.show() != fp.returnCancel)
        {
            var converter = Cc["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Ci.nsIScriptableUnicodeConverter);
            converter.charset = "UTF-8";
            stream.init(fp.file, 0x01, 00004, null);
            streamIO.init(stream);
            var input = streamIO.read(stream.available());
            input = converter.ConvertToUnicode(input);
            streamIO.close();
            stream.close();

            var linebreak = "\n";
            if (/(\r\n?|\n\r?)/.test(input))
                lineBreak = RegExp.$1;

            return input.split(linebreak);
        }
        return null;
    },

    convertUnicodeToUTF8 : function(str)
    {
        var converter = Cc["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Ci.nsIScriptableUnicodeConverter);
        converter.charset = "UTF-8";
        var UTF = converter.ConvertFromUnicode(str);
        var fin = converter.Finish();

        if(fin.length > 0)
            return UTF + fin;

        return UTF;
    }
};

const mainPane =
{
    load : function()
    {
        this.toggleStatus(null);
        this.togglePassButton();
    },

    toggleStatus : function(el)
    {
        var bool = (el)
            ? el.checked
            : document.getElementById("pref-blacklist-enabled").value;
        document.getElementById("checkbox-blacklist-sites-enabled").disabled = 
        document.getElementById("checkbox-blacklist-words-enabled").disabled = !(bool);
    },

    togglePassButton : function()
    {
        if (Prefs.prefHasUserValue("general.password"))
        {
            document.getElementById("btn-set-pass").hidden = true;
            document.getElementById("btn-rem-pass").hidden = false;
        }
    },

    removePassword : function(el)
    {
        Prefs.clearUserPref("general.password");
        el.hidden = true;
        document.getElementById("btn-set-pass").hidden = false;
        prompts.alert(null,
            prefwindow.stringsBundle.getString('passwordPromptTitle'),
            prefwindow.stringsBundle.getString('passwordRemoved'));
    },

    setPassword : function(el)
    {
        var password =
        {
            value : ""
        },
        passwordConfirmation =
        {
            value : ""
        },
        check =
        {
            value : false
        }; //XXX: need to pass an object for the checkbox, even if hidden

        var password_result = prompts.promptPassword(null,
                                prefwindow.stringsBundle.getString('passwordPromptTitle'),
                                prefwindow.stringsBundle.getString('passwordPrompt'),
                                password,
                                null,
                                check);

        if (!password_result)
            return;

        var passwordConfirmation_result = prompts.promptPassword(null,
                                            prefwindow.stringsBundle.getString('passwordPromptTitle'),
                                            prefwindow.stringsBundle.getString('passwordPromptAgain'),
                                            passwordConfirmation,
                                            null,
                                            check);

        if (!passwordConfirmation_result)
            return;

        if (password.value == passwordConfirmation.value)
        {
            try
            {
                Prefs.setCharPref("general.password", hex_md5(password.value));
                el.hidden = true;
                document.getElementById("btn-rem-pass").hidden = false;
                prompts.alert(null,
                    prefwindow.stringsBundle.getString('passwordPromptTitle'),
                    prefwindow.stringsBundle.getString('passwordPromptSuccess'));
            }
            catch(e)
            {
            }
        }
        else
        {
            prompts.alert(null,
                prefwindow.stringsBundle.getString('passwordPromptTitle'),
                prefwindow.stringsBundle.getString('passwordPromptFailure'));
        }
    }
};

const blacklistPane =
{
    load : function()
    {
        this.toggleStatus(null);
    },

    toggleStatus : function(el)
    {
        if (el == "checkbox-blacklist-warning-custom")
        {
            document.getElementById("textbox-blacklist-warning-custom-msg").disabled = !(document.getElementById(el).checked);
        }
        else if (el == "checkbox-blacklist-redirect")
        {
            document.getElementById("textbox-blacklist-redirect-address").disabled = !(document.getElementById(el).checked);
        }
        else
        {
            document.getElementById("textbox-blacklist-warning-custom-msg").disabled = 
                !(document.getElementById("checkbox-blacklist-warning-custom").checked);
            document.getElementById("textbox-blacklist-redirect-address").disabled = 
                !(document.getElementById("checkbox-blacklist-redirect").checked);
        }
    }
};

const subscriptionsPane =
{
    subscriptionsObj : null,

    load : function()
    {
        this.subscriptionsObj = (new (Components.utils.import("resource://procon/subscriptions.jsm", null).subscriptions));
        this.getUrls();
        this.updateTimeDescription();
    },

    updateTimeDescription : function()
    {
        var lastUpdatedDescription = document.getElementById("last-updated-description");
        var lastUpdateTime = document.getElementById("pref-subscriptions-lastUpdateTime").value;
        var time = (new Date()).getTime() / 1000;

        while (lastUpdatedDescription.firstChild)
            lastUpdatedDescription.removeChild(lastUpdatedDescription.firstChild);

        var newValue = " ";
        
        if (document.getElementById("subscription-list").itemCount > 0)
            newValue = prefwindow.stringsBundle.getFormattedString("subscriptionLastUpdated", [ Math.round((time - lastUpdateTime) / 3600) ]);

        lastUpdatedDescription.appendChild(document.createTextNode(newValue));
    },

    activateButtons : function()
    {
        if (document.getElementById("subscription-list").selectedCount > 0)
        {
            document.getElementById("subscription-remove-button").disabled = false;
        }
        else
        {
            document.getElementById("subscription-remove-button").disabled = true;
        }
    },

    getSelectedListItem : function(listBox)
    {
        var selectedItem = listBox.getSelectedItem(0);
        
        if (!selectedItem)
            return;

        var newText = selectedItem.getAttribute("label");
        var textBox = document.getElementById("subscription-input");
        textBox.value = newText;
        this.activateButtons();
    },

    addListItem : function()
    {
        var listBox = document.getElementById("subscription-list");
        var textBox = document.getElementById("subscription-input");
        var label = decodeURIComponent(textBox.value);
        var value = encodeURIComponent(label);

        if (value.length == 0)
            return;

        for (var i = 0, len = listBox.itemCount; i < len; i++)
        {
            var selectedItem = listBox.getItemAtIndex(i);
            if (value == selectedItem.value)
                return;
        }

        if (!this.subscriptionsObj.getFromURL(label))
        {
            prompts.alert(null,
                document.getElementById("subscriptionsPane").label,
                prefwindow.stringsBundle.getString('subscriptionInvalid'));
            return;
        }

        listBox.appendItem(label, value);
        this.saveSubscriptionsUrls(listBox);
    },

    removeListItem : function()
    {
        var listBox = document.getElementById("subscription-list");
        var selectedItem = listBox.getSelectedItem(0);
        var index = listBox.getIndexOfItem(selectedItem);
        listBox.removeItemAt(index);
        var textBox = document.getElementById("subscription-input");
        textBox.value = "";
        this.activateButtons();
        this.saveSubscriptionsUrls(listBox);
    },

    saveSubscriptionsUrls : function(listBox)
    {
        var listPrefs = [], len = listBox.itemCount;

        for (var i = 0; i < len; i++)
        {
            var value = listBox.getItemAtIndex(i).value;
            if (value.length > 0)
                listPrefs.push(value);
        }

        var updateButton = document.getElementById("subscriptions-update-button");
        updateButton.disabled = (!len)
            ? true
            : false;

        // save encoded urls
        document.getElementById("pref-subscriptions-urls").value = JSON.stringify(listPrefs);
    },

    saveSubscriptions : function()
    {
        if (this.subscriptionsObj == null)
        {
            if (Prefs.getBoolPref("subscriptions.enabled") == true)
            {
                this.subscriptionsObj = (new (Components.utils.import("resource://procon/subscriptions.jsm", null).subscriptions));
                this.subscriptionsObj.update();
            }
            return;
        }

        var subscriptionUrls = document.getElementById("pref-subscriptions-urls").value;
        var listPrefs = JSON.parse(subscriptionUrls);
        this.subscriptionsObj.save(listPrefs);
    },

    updateSubscriptions : function()
    {
        var success = this.subscriptionsObj.update();
        if (success)
        {
            prompts.alert(null,
                document.getElementById("subscriptionsPane").label,
                prefwindow.stringsBundle.getString('subscriptionSuccess'));
        }
        else
        {
            prompts.alert(null,
                document.getElementById("subscriptionsPane").label,
                prefwindow.stringsBundle.getString('subscriptionFailure'));
        }
        this.updateTimeDescription();
    },

    getUrls : function()
    {
        var listBox = document.getElementById("subscription-list");
        var subscriptionUrls = document.getElementById("pref-subscriptions-urls").value;
        var listPrefs = JSON.parse(subscriptionUrls);
        var len = listPrefs.length;

        for (var i = 0; i < len; i++)
        {
            var value = listPrefs[i];
            if (value.length > 0)
                listBox.appendItem(decodeURIComponent(value), value);
        }

        var updateButton = document.getElementById("subscriptions-update-button");
        updateButton.disabled = (!len)
            ? true
            : false;
    }
};
