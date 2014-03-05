/*-----------------------------------------------------
  Copyright (c) 2011 Hunter Paolini.  All Rights Reserved.
  -----------------------------------------------------*/

var EXPORTED_SYMBOLS = ["preferences"];

const Cc = Components.classes;
const Ci = Components.interfaces;

var preferences =
{
    getPrefByType : function(name)
    {
        var pref = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch);
        switch (pref.getPrefType(name))
        {
            case pref.PREF_BOOL :
                return pref.getBoolPref(name);
            case pref.PREF_INT :
                return pref.getIntPref(name);
            case pref.PREF_STRING :
                try
                {
                    return pref.getComplexValue(name, Ci.nsIPrefLocalizedString).data;
                }
                catch(e)
                {
                    return pref.getComplexValue(name, Ci.nsISupportsString).data;
                }
        }
        return null;
    },

    setPrefByType : function(name, value)
    {
        var pref = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch);
        switch (pref.getPrefType(name))
        {
            case pref.PREF_BOOL :
                value = /^true$/i.test(value);
                pref.setBoolPref(name, value);
                break;
            case pref.PREF_INT :
                pref.setIntPref(name, value);
                break;
            case pref.PREF_STRING :
                var str = Cc["@mozilla.org/supports-string;1"].createInstance(Ci.nsISupportsString);
                str.data = value;
                pref.setComplexValue(name, Ci.nsISupportsString, str);
                break;
            default :
                break;
        }
    }
};
