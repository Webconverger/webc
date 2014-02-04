/************************************************************************/
/*                                                                      */
/*      Zoom Page  -  Firefox Extension  -  Options                     */
/*                                                                      */
/*      Javascript for Options dialog                                   */
/*                                                                      */
/*      Copyright (C) 2009-2014  by  DW-dev                             */
/*                                                                      */
/*      Last Edit  -  21 Jan 2014                                       */
/*                                                                      */
/************************************************************************/

"use strict";

var zoomPageOptions =
{
    appInfo: Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULAppInfo),
    versionComparator: Components.classes["@mozilla.org/xpcom/version-comparator;1"].getService(Components.interfaces.nsIVersionComparator),
    ffVersion: "",
    
    prefs: Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.zoompage."),
    
    zoomLevels: new Array("30-50-67-80-90-100-110-120-133-150-170-200-240-300",
                          "30-50-75-100-125-150-200-300-400",
                          "30-50-75-90-100-110-125-150-200-300-400",
                          "30-50-67-80-90-100-110-120-133-150-170-200-240-300-400",
                          "25-50-75-100-125-150-200-300-400-500",
                          "25-50-75-90-100-110-125-150-200-300-400-500",
                          "25-50-67-80-90-100-110-120-133-150-170-200-240-300-400-500"),
    
    initPrefs: function()
    {
        var i,menulist,checkbox,textbox,tooltip;
        var defaultlevel,fittowidthmin,fittowidthmax,fittowidthful,imgdefaultlevel,imgfittowindowmin,imgfittowindowmax;
        var levelArray = new Array();
        
        /* Determine Firefox version */
        
        if (zoomPageOptions.versionComparator.compare(zoomPageOptions.appInfo.version,"29.0a1") >= 0) zoomPageOptions.ffVersion = "29.0";
        else if (zoomPageOptions.versionComparator.compare(zoomPageOptions.appInfo.version,"24.0a1") >= 0) zoomPageOptions.ffVersion = "24.0";
        else if (zoomPageOptions.versionComparator.compare(zoomPageOptions.appInfo.version,"22.0a1") >= 0) zoomPageOptions.ffVersion = "22.0";
        else if (zoomPageOptions.versionComparator.compare(zoomPageOptions.appInfo.version,"19.0a1") >= 0) zoomPageOptions.ffVersion = "19.0";
        else if (zoomPageOptions.versionComparator.compare(zoomPageOptions.appInfo.version,"17.0a1") >= 0) zoomPageOptions.ffVersion = "17.0";
        else if (zoomPageOptions.versionComparator.compare(zoomPageOptions.appInfo.version,"14.0a1") >= 0) zoomPageOptions.ffVersion = "14.0";
        else if (zoomPageOptions.versionComparator.compare(zoomPageOptions.appInfo.version,"4.0a1") >= 0) zoomPageOptions.ffVersion = "4.0";
        else zoomPageOptions.ffVersion = "3.6";
        
        /* Zoom Mode */
        
        menulist = document.getElementById("zoompage-zoommode");
        try
        {
            menulist.selectedIndex = zoomPageOptions.prefs.getIntPref("zoommode");
        }
        catch(e)
        {
            menulist.selectedIndex = 2;
        }
        
        menulist.setAttribute("tooltiptext",menulist.children[0].children[menulist.selectedIndex].getAttribute("tooltiptext"));
        
        /* Image Zoom Mode */
        
        menulist = document.getElementById("zoompage-imagezoommode");
        try
        {
            menulist.selectedIndex = zoomPageOptions.prefs.getIntPref("imagezoommode");
        }
        catch(e)
        {
            menulist.selectedIndex = 1;
        }
        
        menulist.setAttribute("tooltiptext",menulist.children[0].children[menulist.selectedIndex].getAttribute("tooltiptext"));
        
        /* Button Style */
        
        menulist = document.getElementById("zoompage-buttonstyle");
        if (zoomPageOptions.ffVersion == +"3.6") menulist.setAttribute("disabled","true");
        try
        {
            if (zoomPageOptions.ffVersion == +"3.6") menulist.value = "c";
            else if (zoomPageOptions.ffVersion >= +"4.0") menulist.value = zoomPageOptions.prefs.getCharPref("buttonstyle");
        }
        catch(e)
        {
            if (zoomPageOptions.ffVersion == +"3.6") menulist.value = "c";
            else if (zoomPageOptions.ffVersion >= +"4.0") menulist.value = "n";
        }
        
        /* Explicit Zoom - X Prefix */
        
        checkbox = document.getElementById("zoompage-expprefix");
        try
        {
            checkbox.checked = zoomPageOptions.prefs.getBoolPref("expprefix");
        }
        catch(e)
        {
            checkbox.checked = true;
        }
        
        /* Default Zoom - D Prefix */
        
        checkbox = document.getElementById("zoompage-defprefix");
        try
        {
            checkbox.checked = zoomPageOptions.prefs.getBoolPref("defprefix");
        }
        catch(e)
        {
            checkbox.checked = true;
        }
        
        /* Default Zoom - Dotted Border */
        
        checkbox = document.getElementById("zoompage-defborder");
        try
        {
            checkbox.checked = zoomPageOptions.prefs.getBoolPref("defborder");
        }
        catch(e)
        {
            checkbox.checked = true;
        }
        
        /* Fit-To-Width Zoom - F Prefix */
        
        checkbox = document.getElementById("zoompage-ftwprefix");
        try
        {
            checkbox.checked = zoomPageOptions.prefs.getBoolPref("ftwprefix");
        }
        catch(e)
        {
            checkbox.checked = true;
        }
        
        /* Fit-To-Width Zoom - Dashed Border */
        
        checkbox = document.getElementById("zoompage-ftwborder");
        try
        {
            checkbox.checked = zoomPageOptions.prefs.getBoolPref("ftwborder");
        }
        catch(e)
        {
            checkbox.checked = true;
        }
        
        /* Site-Specific Zoom - S Prefix */
        
        checkbox = document.getElementById("zoompage-ssprefix");
        try
        {
            checkbox.checked = zoomPageOptions.prefs.getBoolPref("ssprefix");
        }
        catch(e)
        {
            checkbox.checked = true;
        }
        
        /* Site-Specific Zoom - Solid Border */
        
        checkbox = document.getElementById("zoompage-ssborder");
        try
        {
            checkbox.checked = zoomPageOptions.prefs.getBoolPref("ssborder");
        }
        catch(e)
        {
            checkbox.checked = true;
        }
        
        /* Full Page - P Prefix */
        
        checkbox = document.getElementById("zoompage-fpprefix");
        try
        {
            checkbox.checked = zoomPageOptions.prefs.getBoolPref("fpprefix");
        }
        catch(e)
        {
            checkbox.checked = true;
        }
        
        /* Text Only - T Prefix */
        
        checkbox = document.getElementById("zoompage-toprefix");
        try
        {
            checkbox.checked = zoomPageOptions.prefs.getBoolPref("toprefix");
        }
        catch(e)
        {
            checkbox.checked = true;
        }
        
        /* Text Only - Italic Display */
        
        checkbox = document.getElementById("zoompage-toitalic");
        try
        {
            checkbox.checked = zoomPageOptions.prefs.getBoolPref("toitalic");
        }
        catch(e)
        {
            checkbox.checked = true;
        }
        
        /* Text Only - Red Display */
        
        checkbox = document.getElementById("zoompage-tored");
        try
        {
            checkbox.checked = zoomPageOptions.prefs.getBoolPref("tored");
        }
        catch(e)
        {
            checkbox.checked = true;
        }
        
        /* Percent Sign  - % Suffix */
        
        checkbox = document.getElementById("zoompage-pcsuffix");
        try
        {
            checkbox.checked = zoomPageOptions.prefs.getBoolPref("pcsuffix");
        }
        catch(e)
        {
            checkbox.checked = true;
        }
        
        /* Swap Click Actions */
        
        checkbox = document.getElementById("zoompage-swapactions");
        try
        {
            checkbox.checked = zoomPageOptions.prefs.getBoolPref("swapactions");
        }
        catch(e)
        {
            checkbox.checked = true;
        }
        
        /* Custom Zoom Levels */
        
        textbox = document.getElementById("zoompage-customlevels");
        try
        {
            textbox.value = document.getElementById("zoompage-custommarker").value + "  " + zoomPageOptions.prefs.getCharPref("customlevels");
        }
        catch(e)
        {
            textbox.value = document.getElementById("zoompage-custommarker").value + "  " + "100";
        }
        
        /* Current Zoom Levels */
        
        zoomPageOptions.zoomLevels[7] = zoomPageOptions.prefs.getCharPref("customlevels");
        
        menulist = document.getElementById("zoompage-zoomlevels");
        menulist.appendItem(document.getElementById("zoompage-firefoxmarker").value + "  " + zoomPageOptions.zoomLevels[0]);
        menulist.appendItem("1:  " + zoomPageOptions.zoomLevels[1]);
        menulist.appendItem("2:  " + zoomPageOptions.zoomLevels[2]);
        menulist.appendItem("3:  " + zoomPageOptions.zoomLevels[3]);
        menulist.appendItem("4:  " + zoomPageOptions.zoomLevels[4]);
        menulist.appendItem("5:  " + zoomPageOptions.zoomLevels[5]);
        menulist.appendItem("6:  " + zoomPageOptions.zoomLevels[6]);
        menulist.appendItem(document.getElementById("zoompage-custommarker").value + "  " + zoomPageOptions.zoomLevels[7]);
        try
        {
            menulist.selectedIndex = zoomPageOptions.prefs.getIntPref("zoomlevels");
        }
        catch(e)
        {
            menulist.selectedIndex = 0;
        }
        
        tooltip = document.getElementById("zoompage-zoomlevels-tooltip-label");
        tooltip.setAttribute("value",menulist.getItemAtIndex(menulist.selectedIndex).label.substr(4));
        
        /* Default Zoom Level */
        
        levelArray = zoomPageOptions.zoomLevels[document.getElementById("zoompage-zoomlevels").selectedIndex].split("-");
        
        menulist = document.getElementById("zoompage-defaultlevel");
        defaultlevel = zoomPageOptions.prefs.getIntPref("defaultlevel");
        for (i = 0; i < levelArray.length; i++) menulist.appendItem(levelArray[i],levelArray[i]);
        for (i = 0; i < levelArray.length; i++) if (levelArray[i] == defaultlevel) break;
        if (i < levelArray.length) menulist.value = levelArray[i]; else menulist.value = 100;
        defaultlevel = menulist.value;
        
        /* Fit-To-Width Zoom Minimum */
        
        menulist = document.getElementById("zoompage-fittowidthmin");
        fittowidthmin = zoomPageOptions.prefs.getIntPref("fittowidthmin");
        for (i = 0; i < levelArray.length; i++) if (Number(levelArray[i]) <= defaultlevel) menulist.appendItem(levelArray[i],levelArray[i]);
        for (i = 0; i < levelArray.length; i++) if (Number(levelArray[i]) <= defaultlevel && levelArray[i] == fittowidthmin) break;
        if (i < levelArray.length) menulist.value = levelArray[i]; else menulist.value = defaultlevel;
        
        /* Fit-To-Width Zoom Maximum (half-screen window) */
        
        menulist = document.getElementById("zoompage-fittowidthmax");
        fittowidthmax = zoomPageOptions.prefs.getIntPref("fittowidthmax");
        for (i = 0; i < levelArray.length; i++) if (Number(levelArray[i]) >= defaultlevel) menulist.appendItem(levelArray[i],levelArray[i]);
        for (i = 0; i < levelArray.length; i++) if (Number(levelArray[i]) >= defaultlevel && levelArray[i] == fittowidthmax) break;
        if (i < levelArray.length) menulist.value = levelArray[i]; else menulist.value = defaultlevel;
        fittowidthmax = menulist.value;
        
        /* Fit-To-Width Zoom Extension (full-screen window) */
        
        menulist = document.getElementById("zoompage-fittowidthful");
        fittowidthful = zoomPageOptions.prefs.getIntPref("fittowidthful");
        for (i = 0; i < levelArray.length; i++) if (Number(levelArray[i]) >= fittowidthmax) menulist.appendItem(levelArray[i],levelArray[i]);
        for (i = 0; i < levelArray.length; i++) if (Number(levelArray[i]) >= fittowidthmax && levelArray[i] == fittowidthful) break;
        if (i < levelArray.length) menulist.value = levelArray[i]; else menulist.value = fittowidthmax;
        
        /* Image Default Zoom Level */
        
        levelArray = zoomPageOptions.zoomLevels[document.getElementById("zoompage-zoomlevels").selectedIndex].split("-");
        
        menulist = document.getElementById("zoompage-imgdefaultlevel");
        imgdefaultlevel = zoomPageOptions.prefs.getIntPref("imgdefaultlevel");
        for (i = 0; i < levelArray.length; i++) menulist.appendItem(levelArray[i],levelArray[i]);
        for (i = 0; i < levelArray.length; i++) if (levelArray[i] == imgdefaultlevel) break;
        if (i < levelArray.length) menulist.value = levelArray[i]; else menulist.value = 100;
        imgdefaultlevel = menulist.value;
        
        /* Image Fit-To-Window Zoom Minimum */
        
        menulist = document.getElementById("zoompage-imgfittowindowmin");
        imgfittowindowmin = zoomPageOptions.prefs.getIntPref("imgfittowindowmin");
        for (i = 0; i < levelArray.length; i++) if (Number(levelArray[i]) <= imgdefaultlevel) menulist.appendItem(levelArray[i],levelArray[i]);
        for (i = 0; i < levelArray.length; i++) if (Number(levelArray[i]) <= imgdefaultlevel && levelArray[i] == imgfittowindowmin) break;
        if (i < levelArray.length) menulist.value = levelArray[i]; else menulist.value = imgdefaultlevel;
        
        /* Image Fit-To-Window Zoom Maximum */
        
        menulist = document.getElementById("zoompage-imgfittowindowmax");
        imgfittowindowmax = zoomPageOptions.prefs.getIntPref("imgfittowindowmax");
        for (i = 0; i < levelArray.length; i++) if (Number(levelArray[i]) >= imgdefaultlevel) menulist.appendItem(levelArray[i],levelArray[i]);
        for (i = 0; i < levelArray.length; i++) if (Number(levelArray[i]) >= imgdefaultlevel && levelArray[i] == imgfittowindowmax) break;
        if (i < levelArray.length) menulist.value = levelArray[i]; else menulist.value = imgdefaultlevel;
    },
    
    onChangeZoomMode: function()
    {
        var menulist;
        
        menulist = document.getElementById("zoompage-zoommode");
        menulist.setAttribute("tooltiptext",menulist.children[0].children[menulist.selectedIndex].getAttribute("tooltiptext"));
    },
    
    onChangeImageZoomMode: function()
    {
        var menulist;
        
        menulist = document.getElementById("zoompage-imagezoommode");
        menulist.setAttribute("tooltiptext",menulist.children[0].children[menulist.selectedIndex].getAttribute("tooltiptext"));
    },
    
    onChangeZoomLevels: function()
    {
        var i,menulist,tooltip;
        var defaultlevel,fittowidthmin,fittowidthmax,fittowidthful,imgdefaultlevel,imgfittowindowmin,imgfittowindowmax;
        var levelArray = new Array();
        
        function snapToLevel(level)
        {
            for (i = 0; i < levelArray.length; i++)
                if (Number(levelArray[i]) >= level)
                {
                    if (i > 0 && level-Number(levelArray[i-1]) < Number(levelArray[i])-level) i--;
                    return Number(levelArray[i]);
                }
                
            return Number(levelArray[i-1]);
        }
        
        menulist = document.getElementById("zoompage-zoomlevels");
        tooltip = document.getElementById("zoompage-zoomlevels-tooltip-label");
        tooltip.setAttribute("value",menulist.getItemAtIndex(menulist.selectedIndex).label.substr(4));
        
        levelArray = zoomPageOptions.zoomLevels[document.getElementById("zoompage-zoomlevels").selectedIndex].split("-");
        
        menulist = document.getElementById("zoompage-defaultlevel");
        defaultlevel = snapToLevel(menulist.value);
        menulist.removeAllItems();
        for (i = 0; i < levelArray.length; i++) menulist.appendItem(levelArray[i],levelArray[i]);
        menulist.value = defaultlevel;
        
        menulist = document.getElementById("zoompage-fittowidthmin");
        fittowidthmin = snapToLevel(menulist.value);
        if (fittowidthmin > defaultlevel) fittowidthmin = defaultlevel;
        menulist.removeAllItems();
        for (i = 0; i < levelArray.length; i++) if (Number(levelArray[i]) <= defaultlevel) menulist.appendItem(levelArray[i],levelArray[i]);
        menulist.value = fittowidthmin;
        
        menulist = document.getElementById("zoompage-fittowidthmax");
        fittowidthmax = snapToLevel(menulist.value);
        if (fittowidthmax < defaultlevel) fittowidthmax = defaultlevel;
        menulist.removeAllItems();
        for (i = 0; i < levelArray.length; i++) if (Number(levelArray[i]) >= defaultlevel) menulist.appendItem(levelArray[i],levelArray[i]);
        menulist.value = fittowidthmax;
        
        menulist = document.getElementById("zoompage-fittowidthful");
        fittowidthful = snapToLevel(menulist.value);
        if (fittowidthful < fittowidthmax) fittowidthful = fittowidthmax;
        menulist.removeAllItems();
        for (i = 0; i < levelArray.length; i++) if (Number(levelArray[i]) >= fittowidthmax) menulist.appendItem(levelArray[i],levelArray[i]);
        menulist.value = fittowidthful;
        
        menulist = document.getElementById("zoompage-imgdefaultlevel");
        imgdefaultlevel = snapToLevel(menulist.value);
        menulist.removeAllItems();
        for (i = 0; i < levelArray.length; i++) menulist.appendItem(levelArray[i],levelArray[i]);
        menulist.value = imgdefaultlevel;
        
        menulist = document.getElementById("zoompage-imgfittowindowmin");
        imgfittowindowmin = snapToLevel(menulist.value);
        if (imgfittowindowmin > imgdefaultlevel) imgfittowindowmin = imgdefaultlevel;
        menulist.removeAllItems();
        for (i = 0; i < levelArray.length; i++) if (Number(levelArray[i]) <= imgdefaultlevel) menulist.appendItem(levelArray[i],levelArray[i]);
        menulist.value = imgfittowindowmin;
        
        menulist = document.getElementById("zoompage-imgfittowindowmax");
        imgfittowindowmax = snapToLevel(menulist.value);
        if (imgfittowindowmax < imgdefaultlevel) imgfittowindowmax = imgdefaultlevel;
        menulist.removeAllItems();
        for (i = 0; i < levelArray.length; i++) if (Number(levelArray[i]) >= imgdefaultlevel) menulist.appendItem(levelArray[i],levelArray[i]);
        menulist.value = imgfittowindowmax;
    },
    
    onCommandCustomCopy: function()
    {
        var menulist,textbox;
        
        menulist = document.getElementById("zoompage-zoomlevels");
        
        textbox = document.getElementById("zoompage-customlevels");
        
        textbox.value = document.getElementById("zoompage-custommarker").value + "  " + menulist.label.substr(4);
    },
    
    onCommandCustomValidate: function()
    {
        var i,textbox,textstr,levels,index,menulist;
        var levelArray = new Array();
        
        textbox = document.getElementById("zoompage-customlevels");
        
        textstr = textbox.value;
        
        for (i = 0; i < textstr.length; i++)
        {
            if (textstr.charAt(i) >= "0" && textstr.charAt(i) <= "9") continue;
            if (textstr.charAt(i) == "-") continue;
            textstr = textstr.substr(0,i) + textstr.substr(i+1);
            i--;
        }
        
        levelArray = textstr.split("-");
        levelArray.push("100");
        levelArray.sort(function(a,b){ return a-b; });
        
        for (i = 0; i < levelArray.length; i++)
        {
            if (Number(levelArray[i]) < 1 || Number(levelArray[i]) > 10000) { levelArray.splice(i,1); i--; }
            if (i > 0 && levelArray[i] == levelArray[i-1]) { levelArray.splice(i,1); i--; }
        }
        
        levels = "" + levelArray[0];
        for (i = 1; i < levelArray.length; i++) levels = levels + "-" + levelArray[i];
        
        textbox.value = document.getElementById("zoompage-custommarker").value + "  " + levels;
        
        zoomPageOptions.zoomLevels[7] = levels;
        
        menulist = document.getElementById("zoompage-zoomlevels");
        index = menulist.selectedIndex;
        
        menulist.removeItemAt(7);
        menulist.appendItem(document.getElementById("zoompage-custommarker").value + "  " + zoomPageOptions.zoomLevels[7]);
        
        menulist.selectedIndex = index;
        
        if (index == 7) zoomPageOptions.onChangeZoomLevels();
    },
    
    savePrefs: function()
    {
        var i;
        
        zoomPageOptions.onCommandCustomValidate();
        
        /* Zoom Mode */
        
        zoomPageOptions.prefs.setIntPref("zoommode",document.getElementById("zoompage-zoommode").selectedIndex);
        
        /* Image Zoom Mode */
        
        zoomPageOptions.prefs.setIntPref("imagezoommode",document.getElementById("zoompage-imagezoommode").selectedIndex);
        
        /* Button Style */
        
        zoomPageOptions.prefs.setCharPref("buttonstyle",document.getElementById("zoompage-buttonstyle").value);
        
        /* Explicit Zoom - X Prefix */
        
        zoomPageOptions.prefs.setBoolPref("expprefix",document.getElementById("zoompage-expprefix").checked);
        
        /* Default Zoom - D Prefix */
        
        zoomPageOptions.prefs.setBoolPref("defprefix",document.getElementById("zoompage-defprefix").checked);
        
        /* Default Zoom - Dotted Border */
        
        zoomPageOptions.prefs.setBoolPref("defborder",document.getElementById("zoompage-defborder").checked);
        
        /* Fit-To-Width Zoom - F Prefix */
        
        zoomPageOptions.prefs.setBoolPref("ftwprefix",document.getElementById("zoompage-ftwprefix").checked);
        
        /* Fit-To-Width Zoom - Dashed Border */
        
        zoomPageOptions.prefs.setBoolPref("ftwborder",document.getElementById("zoompage-ftwborder").checked);
        
        /* Site-Specific Zoom - S Prefix */
        
        zoomPageOptions.prefs.setBoolPref("ssprefix",document.getElementById("zoompage-ssprefix").checked);
        
        /* Site-Specific Zoom - Solid Border */
        
        zoomPageOptions.prefs.setBoolPref("ssborder",document.getElementById("zoompage-ssborder").checked);
        
        /* Full Page - P Prefix */
        
        zoomPageOptions.prefs.setBoolPref("fpprefix",document.getElementById("zoompage-fpprefix").checked);
        
        /* Text Only - T Prefix */
        
        zoomPageOptions.prefs.setBoolPref("toprefix",document.getElementById("zoompage-toprefix").checked);
        
        /* Text Only - Italic Display */
        
        zoomPageOptions.prefs.setBoolPref("toitalic",document.getElementById("zoompage-toitalic").checked);
        
        /* Text Only - Red Display */
        
        zoomPageOptions.prefs.setBoolPref("tored",document.getElementById("zoompage-tored").checked);
        
        /* Percent Sign - % Suffix */
        
        zoomPageOptions.prefs.setBoolPref("pcsuffix",document.getElementById("zoompage-pcsuffix").checked);
        
        /* Swap Click Actions */
        
        zoomPageOptions.prefs.setBoolPref("swapactions",document.getElementById("zoompage-swapactions").checked);
        
        /* Current Zoom Levels */
        
        zoomPageOptions.prefs.setIntPref("zoomlevels",document.getElementById("zoompage-zoomlevels").selectedIndex);
        
        /* Custom Zoom Levels */
        
        zoomPageOptions.prefs.setCharPref("customlevels",document.getElementById("zoompage-customlevels").value.substr(4));
        
        /* Default Zoom Level */
        
        zoomPageOptions.prefs.setIntPref("defaultlevel",document.getElementById("zoompage-defaultlevel").value);
        
        /* Fit-To-Width Zoom Minimum */
        
        zoomPageOptions.prefs.setIntPref("fittowidthmin",document.getElementById("zoompage-fittowidthmin").value);
        
        /* Fit-To-Width Zoom Maximum (half-screen window) */
        
        zoomPageOptions.prefs.setIntPref("fittowidthmax",document.getElementById("zoompage-fittowidthmax").value);
        
        /* Fit-To-Width Zoom Extension (full-screen window) */
        
        zoomPageOptions.prefs.setIntPref("fittowidthful",document.getElementById("zoompage-fittowidthful").value);
        
        /* Image Default Zoom Level */
        
        zoomPageOptions.prefs.setIntPref("imgdefaultlevel",document.getElementById("zoompage-imgdefaultlevel").value);
        
        /* Fit-To-Width Zoom Minimum */
        
        zoomPageOptions.prefs.setIntPref("imgfittowindowmin",document.getElementById("zoompage-imgfittowindowmin").value);
        
        /* Fit-To-Width Zoom Maximum */
        
        zoomPageOptions.prefs.setIntPref("imgfittowindowmax",document.getElementById("zoompage-imgfittowindowmax").value);
    }
};
