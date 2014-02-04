/************************************************************************/
/*                                                                      */
/*      Zoom Page  -  Firefox Extension  -  Main Window                 */
/*                                                                      */
/*      Javascript for Main Window overlay                              */
/*                                                                      */
/*      Copyright (C) 2009-2014  by  DW-dev                             */
/*                                                                      */
/*      Last Edit  -  21 Jan 2014                                       */
/*                                                                      */
/************************************************************************/

/************************************************************************/
/*                                                                      */
/* Refer to Firefox source code: mozilla-release\...                    */
/*                                                                      */
/*   browser\base\content\browser-textZoom.js - FullZoom - Firefox 3    */
/*   browser\base\content\browser-fullZoom.js - FullZoom - Firefox 4    */
/*   toolkit\content\viewZoomOverlay.js       - ZoomManager             */
/*                                                                      */
/************************************************************************/

/************************************************************************/
/*                                                                      */
/* FullZoom                                                             */
/*                                                                      */
/*   FullZoom.onContentPrefSet() - apply or remove site-specific        */
/*                               - redefined for fit-to-width           */
/*                                                                      */
/*   FullZoom.onContentPrefRemoved() - apply or remove site-specific    */
/*                                   - redefined for fit-to-width       */
/*                                                                      */
/*   FullZoom.onLocationChange() - apply or remove site-specific        */
/*                                                                      */
/*   FullZoom.enlarge() - increase zoom level and apply site-specific   */
/*                      - calls ZoomManager.enlarge()                   */
/*                                                                      */
/*   FullZoom.reduce()  - reduce zoom level and apply site-specific     */
/*                      - calls ZoomManager.reduce()                    */
/*                                                                      */
/*   FullZoom.reset()   - reset zoom level and remove site-specific     */
/*                      - redefined for fit-to-width                    */
/*                                                                      */
/************************************************************************/

/************************************************************************/
/*                                                                      */
/* ZoomManager                                                          */
/*                                                                      */
/*   ZoomManager.MIN           - minimum zoom value                     */
/*                                                                      */
/*   ZoomManager.MAX           - maximum zoom value                     */
/*                                                                      */
/*   ZoomManager.zoomValues[]  - array of zoom values                   */
/*                                                                      */
/*   ZoomManager.snap()        - snap to closest zoom value             */
/*                                                                      */
/*   ZoomManager.zoom          - zoom value for selected browser        */
/*                                                                      */
/*   ZoomManager.useFullZoom   - use full page zoom                     */
/*                                                                      */
/*   ZoomManager.setZoomForBrowser() - redefined to set percent         */
/*                                                                      */
/*   ZoomManager.enlarge()     - increase zoom level                    */
/*                             - redefined to avoid using snap()        */
/*                             - implicitly calls setZoomForBrowser()   */
/*                                                                      */
/*   ZoomManager.reduce()      - reduce zoom level                      */
/*                             - redefined to avoid using snap()        */
/*                             - implicitly calls setZoomForBrowser()   */
/*                                                                      */
/*   ZoomManager.reset()       - reset zoom level to 1                  */
/*                               implicitly calls setZoomForBrowser()   */
/*                                                                      */
/*   ZoomManager.toggleZoom()  - toggle zoom (text-only or full-page)   */
/*                               implicitly calls setZoomForBrowser()   */
/*                                                                      */
/************************************************************************/

/************************************************************************/
/*                                                                      */
/* Zoom Modes                                                           */
/*                                                                      */
/*   Default Zoom         -  Applied when tab opened.                   */
/*   (D/X)                                                              */
/*                                                                      */
/*   Fit-To-Width Zoom    -  Applied when different page loaded,        */
/*   (F/X)                   or when page manually reloaded,            */
/*                           or when browser window resized.            */
/*                                                                      */
/*   Default Zoom +       -  Applied when page loaded or reloaded,      */
/*   Site-Specific Zoom      or when page manually reloaded,            */
/*   (D/S)                   or when tab selected. If site value not    */
/*                           defined, then set to Default Zoom.         */
/*                                                                      */
/*   Fit-To-Width Zoom +  -  Applied when page loaded or reloaded,      */
/*   Site-Specific Zoom      or when page manually reloaded,            */
/*   (F/S)                   or when tab selected. If site value not    */
/*                           defined, then set to Fit-To-Width Zoom.    */
/*                                                                      */
/************************************************************************/

/************************************************************************/
/*                                                                      */
/* Display Indicators                                                   */
/*                                                                      */
/*   X - Explict Zoom applied.                                          */
/*   D - Default Zoom applied.                                          */
/*   F - Fit-To-Width/Window Zoom applied.                              */
/*   S - Site-Specific Zoom applied.                                    */
/*   P - Applied to Full Page.                                          */
/*   T - Applied to Text Only.                                          */
/*                                                                      */
/************************************************************************/

/************************************************************************/
/*                                                                      */
/* Event Actions                                                        */
/*                                                                      */
/*   TabOpen            - Set default zoom.                             */
/*                                                                      */
/*   ContentPrefSet     - Set last fit-to-width or site-specific zoom.  */
/*                                                                      */
/*   ContentPrefRemoved - Set last fit-to-width or site-specific zoom.  */
/*                                                                      */
/*   LocationChange     - Set last fit-to-width or site-specific zoom.  */
/*                                                                      */
/*   hashchange         - Set fit-to-width zoom.                        */
/*                                                                      */
/*   DOMContentLoaded   - Not used.                                     */
/*                                                                      */
/*   load               - Not used.                                     */
/*                                                                      */
/*   pageshow           - Set fit-to-width zoom.                        */
/*                      - Set image default or fit-to-window zoom.      */
/*                                                                      */
/*   TabSelect          - Set fit-to-width zoom.                        */
/*                                                                      */
/*   overflow           - Not used.                                     */
/*                                                                      */
/*   underflow          - Not used.                                     */
/*                                                                      */
/*   resize             - Set fit-to-width zoom.                        */
/*                      - Set image fit-to-window zoom.                 */
/*                                                                      */
/************************************************************************/

"use strict";

var zoomPage =
{
    /********************************************************************/
    
    /* Shared variables */
    
    appInfo: Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULAppInfo),
    versionComparator: Components.classes["@mozilla.org/xpcom/version-comparator;1"].getService(Components.interfaces.nsIVersionComparator),
    ffVersion: "",
    
    runtime: Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULRuntime),
    osPlatform: "",
    
    prefs: Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.zoompage."),
    
    otherPrefs: Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch),
    
    contentPrefs: null,
    
    winmed: Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator),
    
    zoomLevels: new Array("30-50-67-80-90-100-110-120-133-150-170-200-240-300",
                          "30-50-75-100-125-150-200-300-400",
                          "30-50-75-90-100-110-125-150-200-300-400",
                          "30-50-67-80-90-100-110-120-133-150-170-200-240-300-400",
                          "25-50-75-100-125-150-200-300-400-500",
                          "25-50-75-90-100-110-125-150-200-300-400-500",
                          "25-50-67-80-90-100-110-120-133-150-170-200-240-300-400-500"),
    
    zoomMode: 0,
    imagezoomMode: 0,
    
    lastFitToWidth: 1.0,
    
    debugCount: 0,
    
    enableTrace: false,
    
    defaultImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTFH80I3AAAAvUlEQVQ4T+2UwQ3DIBAEXUbKcQnpkBL8pAzKoAyyE9aS4xBsJJ4ZaQUceyd0GC8NnlKQkpQ9siY+xEOK0hZCKCmlknN+j6yJex/fJZhSjLH0YB+f/V3k7RfbcVFO+hN6s9l/C/zOa6IWBVsrin3piHvKRTVR35OtFcU8q5zX+MkjuYUuM9taUcyzynmNnzySW0w/4fQeTr9lmPodwuhLYVylLnffMvNdl0WB3vT+NhQZLnrFv+hH0Sm46LK+ABH7FH8cYFfIAAAAAElFTkSuQmCC",
    expandImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwQAADsEBuJFr7QAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTFH80I3AAAAwUlEQVQ4T+2U0Q3DIAxEM0bHyQjdiFEYIZ+M4TEyBvWjttSqDgSJzz7pRIDjgkzIFvBUZZWoTmvpMz7FQ1VUR865ikhNKbWWPuM2j28IJimlVIcwHWutwzw+83dR72+YKwhlp5dQm8P8t8Bv60K0RLkZP3cS4fNWUw4qROv+PgB9bguuYB4fftaxOOL0MNTDPebnkwpZvsPlNVx+yrD0O4TZm0K7q7rcvcvtRaZhKFCb3t+GkOnQEf/Qr9AlWOi2vwCoD/eQ88YwWgAAAABJRU5ErkJggg==",
    shrinkImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwAAADsABataJCQAAABp0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuMTFH80I3AAAAxUlEQVQ4T+2U0Q3DIAxEM0bHyQjdiFEYIZ+M4TEYg/qlJlKQCUXis086IeC4EBOyObxVUSWqbC19xqd4qZLqiDEWESk557Olz7jN4xuCSVJKBUIIBFyiD8zjUw1D1fsNq9TQGlaxUHbahdoc5r/RhlXw2zoXLVHsLm7BZzXloFy07uK+Xgvz+MxPLV30MPNpRL3QGobMzyflsnyHy2u4/JRh6XcIszeFdlc98utdvh6kGoYCtXn62xAyHTriH3oLXYKFbvsHKPP2cA7NywgAAAAASUVORK5CYII=",
    
    /********************************************************************/
    
    /* Listen for changes to settings */
    
    prefsObserver:
    {
        register: function()
        {
            /* Query nsIPrefBranch2 interface to observe changes to pref values */
            zoomPage.prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);
            
            /* Add the observer */
            zoomPage.prefs.addObserver("",this,false);
        },
        
        observe: function(subject,topic,data)
        {
            var i,button,values,browser;
            var levelArray = new Array();
            
            if (topic != "nsPref:changed") return;
            
            /* Load option settings */
            
            zoomPage.zoomMode = zoomPage.prefs.getIntPref("zoommode");
            zoomPage.imagezoomMode = zoomPage.prefs.getIntPref("imagezoommode");
            
            /* Button style */
            
            if (zoomPage.ffVersion >= +"4.0")
            {
                /* Apply button style */
                
                document.getElementById("main-window").setAttribute("zoompage-buttonstyle",zoomPage.prefs.getCharPref("buttonstyle"));
            }
            
            /* Zoom Levels */
            
            zoomPage.zoomLevels[7] = zoomPage.prefs.getCharPref("customlevels");
            
            levelArray = zoomPage.zoomLevels[zoomPage.prefs.getIntPref("zoomlevels")].split("-");
            values = "" + levelArray[0]/100;
            for (i = 1; i < levelArray.length; i++) values = values + "," + levelArray[i]/100;
            
            zoomPage.otherPrefs.setIntPref("zoom.minPercent",levelArray[0]);
            zoomPage.otherPrefs.setIntPref("zoom.maxPercent",levelArray[levelArray.length-1]);
            zoomPage.otherPrefs.setCharPref("toolkit.zoomManager.zoomValues",values);
            
            delete ZoomManager.MIN;
            ZoomManager.MIN = levelArray[0]/100;
            delete ZoomManager.MAX;
            ZoomManager.MAX = levelArray[levelArray.length-1]/100;
            ZoomManager.zoomValues.length = 0;
            for (i = 0; i < levelArray.length; i++) ZoomManager.zoomValues[i] = levelArray[i]/100;
            
            /* Synchronize Firefox's Site-Specific zoom preference */
            
            zoomPage.otherPrefs.setBoolPref("browser.zoom.siteSpecific",zoomPage.zoomMode >> 1);
            
            /* Set appropriate zoom level */
            
            browser = gBrowser.selectedBrowser;
            
            if (zoomPage.imagePage(browser))  /* image page */
            {
                /* Adjust zoom value for selected tab - in case zoom levels have been changed */
                
                if (ZoomManager.zoom < ZoomManager.MIN) ZoomManager.zoom = ZoomManager.MIN;
                else if (ZoomManager.zoom > ZoomManager.MAX) ZoomManager.zoom = ZoomManager.MAX;
                
                /* Fit-To-Window - in case zoom mode has been changed */
                
                if (zoomPage.imagezoomMode == 1)
                {
                    zoomPage.fitToWindow(browser);  /* normal page - fit-to-width zoom */
                }
                
                /* Update zoom percentage and indicators */
                
                zoomPage.setPercent(1);
            }
            else  /* not image page */
            {
                zoomPage.getSiteSpecific(browser,
                function(browser,sitevalue)
                {
                    /* Adjust zoom value for selected tab - in case zoom levels have been changed */
                    
                    if (ZoomManager.zoom < ZoomManager.MIN) ZoomManager.zoom = ZoomManager.MIN;
                    else if (ZoomManager.zoom > ZoomManager.MAX) ZoomManager.zoom = ZoomManager.MAX;
                    
                    /* Site-Specific Zoom - apply saved site-specific value */
                    
                    if (zoomPage.zoomMode == 2 || zoomPage.zoomMode == 3)
                    {
                        if (typeof sitevalue != "undefined")
                        {
                            if (sitevalue < ZoomManager.MIN) ZoomManager.zoom = ZoomManager.MIN;
                            else if (sitevalue > ZoomManager.MAX) ZoomManager.zoom = ZoomManager.MAX;
                            else ZoomManager.zoom = sitevalue;
                        }
                        else ZoomManager.zoom = zoomPage.prefs.getIntPref("defaultlevel")/100;
                    }
                    
                    /* Fit-To-Width Zoom or Fit-To-Width Zoom + Site-Specific Zoom (if site-specific not set) - in case zoom mode has been changed */
                    
                    if (zoomPage.zoomMode == 1 || zoomPage.zoomMode == 3 && typeof sitevalue == "undefined")
                    {
                        if (zoomPage.specialPage(browser,false)) ;  /* special page - not fit-to-width zoom */
                        else zoomPage.fitToWidth(browser);  /* normal page - fit-to-width zoom */
                    }
                    
                    /* Site-Specific Zoom - update saved site-specific value */
                    
                    if (zoomPage.zoomMode == 2 || zoomPage.zoomMode == 3)
                    {
                        if (typeof sitevalue != "undefined")
                        {
                            if (zoomPage.ffVersion >= +"24.0") FullZoom._applyZoomToPref(browser); else FullZoom._applySettingToPref();
                        }
                    }
                    
                    /* Synchronize Firefox's Site-Specific Zoom global content preference */
                    
                    if (zoomPage.zoomMode == 1 || zoomPage.zoomMode == 3)
                    {
                        zoomPage.setSiteSpecific(null,browser.zoompage_lastFitToWidth);  /* set global content preference same as fit-to-width zoom */
                    }
                    else
                    {
                        zoomPage.setSiteSpecific(null,zoomPage.prefs.getIntPref("defaultlevel")/100);  /* set global content preference same as default zoom */
                    }
                    
                    /* Update zoom percentage and indicators */
                    
                    zoomPage.setPercent(2);
                });
            }
        }
    },
    
    /********************************************************************/
    
    /* Listen for changes to toolbar button location (FF29+) */
    
    widgetListener:
    {
        onWidgetAdded: function(aWidgetId,aArea,aPosition)
        {
            zoomPage.setPercent(3);
        },
        
        onCustomizeStart: function(aWindow)
        {
            window.setTimeout(
            function()
            {
                var percent;
                
                if (document.getElementById("zoompage-item") != null)  /* button in Customize tab - in toolbar, menu panel or palette */
                {
                    /* if button in toolbar */
                    
                    percent = document.getElementById("zoompage-percent-label-" + zoomPage.activeButtonStyle());
                    
                    percent.setAttribute("value","100%");
                    percent.style.removeProperty("font-style");
                    percent.style.removeProperty("color");
                    percent.style.removeProperty("outline");
                    percent.style.removeProperty("outline-offset");
                    
                    /* if button in menu panel or palette */
                    
                    percent = document.getElementById("zoompage-percent-label-n");
                    
                    percent.setAttribute("value","100%");
                    percent.style.removeProperty("font-style");
                    percent.style.removeProperty("color");
                    percent.style.removeProperty("outline");
                    percent.style.removeProperty("outline-offset");
                }
            },150);
        }
    },
    
    /********************************************************************/
    
    /* Load and Unload functions */
    
    onLoad: function()
    {
        var i,navbar,button,values,defaultlevel,fittowidthmin,fittowidthmax,fittowidthful,tab,browser;
        var colors = new Array();
        var levelArray = new Array();
        
        window.removeEventListener("load",zoomPage.onLoad,false);
        
        /* Determine Firefox version and set attribute */
        
        if (zoomPage.versionComparator.compare(zoomPage.appInfo.version,"29.0a1") >= 0) zoomPage.ffVersion = "29.0";
        else if (zoomPage.versionComparator.compare(zoomPage.appInfo.version,"24.0a1") >= 0) zoomPage.ffVersion = "24.0";
        else if (zoomPage.versionComparator.compare(zoomPage.appInfo.version,"22.0a1") >= 0) zoomPage.ffVersion = "22.0";
        else if (zoomPage.versionComparator.compare(zoomPage.appInfo.version,"19.0a1") >= 0) zoomPage.ffVersion = "19.0";
        else if (zoomPage.versionComparator.compare(zoomPage.appInfo.version,"17.0a1") >= 0) zoomPage.ffVersion = "17.0";
        else if (zoomPage.versionComparator.compare(zoomPage.appInfo.version,"14.0a1") >= 0) zoomPage.ffVersion = "14.0";
        else if (zoomPage.versionComparator.compare(zoomPage.appInfo.version,"4.0a1") >= 0) zoomPage.ffVersion = "4.0";
        else zoomPage.ffVersion = "3.6";
        
        document.getElementById("main-window").setAttribute("zoompage-ffversion",zoomPage.ffVersion);
        
        /* Determine operating system platform and set attribute */
        
        zoomPage.osPlatform = zoomPage.runtime.OS;
        
        document.getElementById("main-window").setAttribute("zoompage-osplatform",zoomPage.osPlatform);
        
        /* Initialize content preferences reference */
        
        if (zoomPage.ffVersion >= +"22.0") zoomPage.contentPrefs = Components.classes["@mozilla.org/content-pref/service;1"].getService(Components.interfaces.nsIContentPrefService2);
        else zoomPage.contentPrefs = Components.classes["@mozilla.org/content-pref/service;1"].getService(Components.interfaces.nsIContentPrefService);
        
        /* Migrate option settings to Version 5.0 */
        
        if (!zoomPage.prefs.getBoolPref("migrated50"))
        {
            zoomPage.prefs.setBoolPref("swapactions",zoomPage.prefs.getBoolPref("leftclick"));
            zoomPage.prefs.setIntPref("defaultlevel",zoomPage.prefs.getIntPref("defaultzoom"));
            
            zoomPage.prefs.setBoolPref("migrated50",true);
        }
        
        /* Migrate option settings to Version 6.0 */
        
        if (!zoomPage.prefs.getBoolPref("migrated60"))
        {
            zoomPage.prefs.setIntPref("automaticmode",zoomPage.prefs.getIntPref("automaticzoom"));
            
            zoomPage.prefs.setBoolPref("migrated60",true);
        }
        
        /* Migrate option settings to Version 7.0 */
        
        if (!zoomPage.prefs.getBoolPref("migrated70"))
        {
            zoomPage.prefs.setIntPref("zoommode",zoomPage.prefs.getIntPref("automaticmode"));
            zoomPage.prefs.setBoolPref("toprefix",zoomPage.prefs.getBoolPref("prefixpercent"));
            zoomPage.prefs.setBoolPref("toitalic",zoomPage.prefs.getBoolPref("italicpercent"));
            zoomPage.prefs.setBoolPref("tored",zoomPage.prefs.getBoolPref("redpercent"));
            
            zoomPage.prefs.setBoolPref("migrated70",true);
        }
        
        /* Migrate option settings to Version 8.0 */
        
        if (!zoomPage.prefs.getBoolPref("migrated80"))
        {
            zoomPage.prefs.setIntPref("imagezoommode",1);
            zoomPage.prefs.setIntPref("imgdefaultlevel",100);
            
            if (zoomPage.prefs.prefHasUserValue("imagelevel"))
            {
                if (zoomPage.prefs.getIntPref("imagelevel") <= 1) zoomPage.prefs.setIntPref("imagezoommode",0);
                if (zoomPage.prefs.getIntPref("imagelevel") == 1) zoomPage.prefs.setIntPref("imgdefaultlevel",zoomPage.prefs.getIntPref("defaultlevel"));
            }
            
            zoomPage.prefs.setBoolPref("migrated80",true);
        }
        
        /* Load option settings */
        
        zoomPage.zoomMode = zoomPage.prefs.getIntPref("zoommode");
        zoomPage.imagezoomMode = zoomPage.prefs.getIntPref("imagezoommode");
        
        /* Redefine existing functions */
        
        zoomPage.redefineFunctions();
        
        /* Add button to navigation toolbar on first run after installation */
        
        if (zoomPage.prefs.getBoolPref("firstrun"))
        {
            if (zoomPage.ffVersion >= +"29.0")
            {
                if (CustomizableUI.getPlacementOfWidget("zoompage-buttonmenu") == null)  /* button in palette */
                {
                    CustomizableUI.addWidgetToArea("zoompage-buttonmenu","nav-bar",null);
                }
            }
            else if (zoomPage.ffVersion >= +"4.0")
            {
                if (document.getElementById("zoompage-item") == null)  /* button in palette */
                {
                    navbar = document.getElementById("nav-bar");
                    navbar.setAttribute("collapsed","false");
                    navbar.insertItem("zoompage-item",null,null,false);
                    navbar.setAttribute("currentset",navbar.currentSet);
                    document.persist("nav-bar","currentset");
                }
            }
            
            zoomPage.prefs.setBoolPref("firstrun",false);
        }
        
        /* Button style */
        
        if (zoomPage.ffVersion == +"3.6") zoomPage.prefs.setCharPref("buttonstyle","c");
        else if (zoomPage.ffVersion >= +"4.0")
        {
            /* Apply button style */
            
            document.getElementById("main-window").setAttribute("zoompage-buttonstyle",zoomPage.prefs.getCharPref("buttonstyle"));
            
            /* Adjust button icons for dark theme */
            
            colors =  window.getComputedStyle(document.getElementById("main-window"),null).
                      getPropertyValue("color").match(/rgb\((\d+),\s(\d+),\s(\d+)\)/);
            
            if (Number(colors[1])+Number(colors[2])+Number(colors[3]) >= 0x80+0x80+0x80)  /* light text means dark theme */
                document.getElementById("main-window").setAttribute("zoompage-darktheme","");
        }
        
        /* Zoom Levels */
        
        zoomPage.zoomLevels[7] = zoomPage.prefs.getCharPref("customlevels");
        
        levelArray = zoomPage.zoomLevels[zoomPage.prefs.getIntPref("zoomlevels")].split("-");
        values = "" + levelArray[0]/100;
        for (i = 1; i < levelArray.length; i++) values = values + "," + levelArray[i]/100;
        
        zoomPage.otherPrefs.setIntPref("zoom.minPercent",levelArray[0]);
        zoomPage.otherPrefs.setIntPref("zoom.maxPercent",levelArray[levelArray.length-1]);
        zoomPage.otherPrefs.setCharPref("toolkit.zoomManager.zoomValues",values);
        
        delete ZoomManager.MIN;
        ZoomManager.MIN = levelArray[0]/100;
        delete ZoomManager.MAX;
        ZoomManager.MAX = levelArray[levelArray.length-1]/100;
        ZoomManager.zoomValues.length = 0;
        for (i = 0; i < levelArray.length; i++) ZoomManager.zoomValues[i] = levelArray[i]/100;
        
        /* Validate Default Zoom level preference */
        
        defaultlevel = zoomPage.prefs.getIntPref("defaultlevel");
        if (levelArray.indexOf(String(defaultlevel)) == -1) zoomPage.prefs.setIntPref("defaultlevel",100);
        defaultlevel = zoomPage.prefs.getIntPref("defaultlevel");
        
        /* Validate Fit-To-Width minimum and maximum zoom level preferences */
        
        fittowidthmin = zoomPage.prefs.getIntPref("fittowidthmin");
        if (fittowidthmin > defaultlevel || levelArray.indexOf(String(fittowidthmin)) == -1) zoomPage.prefs.setIntPref("fittowidthmin",defaultlevel);
        
        fittowidthmax = zoomPage.prefs.getIntPref("fittowidthmax");
        if (fittowidthmax < defaultlevel || levelArray.indexOf(String(fittowidthmax)) == -1) zoomPage.prefs.setIntPref("fittowidthmax",defaultlevel);
        fittowidthmax = zoomPage.prefs.getIntPref("fittowidthmax");
        
        fittowidthful = zoomPage.prefs.getIntPref("fittowidthful");
        if (fittowidthful < fittowidthmax || levelArray.indexOf(String(fittowidthful)) == -1) zoomPage.prefs.setIntPref("fittowidthful",fittowidthmax);
        
        /* Synchronize Firefox's Site-Specific Zoom preference */
        
        zoomPage.otherPrefs.setBoolPref("browser.zoom.siteSpecific",zoomPage.zoomMode >> 1);
        
        /* Synchronize Firefox's Site-Specific Zoom global default zoom content preference */
        
        delete FullZoom._globalValue;  /* too soon to call FullZoom.reset() */
        FullZoom._globalValue = zoomPage.prefs.getIntPref("defaultlevel")/100;  /* too soon to call FullZoom.reset() */
        
        zoomPage.setSiteSpecific(null,zoomPage.prefs.getIntPref("defaultlevel")/100);  /* set global content preference */
        
        /* Disable Firefox's Image Resizing (scaling) preferences */
        
        zoomPage.otherPrefs.setBoolPref("browser.enable_automatic_image_resizing",false);
        zoomPage.otherPrefs.setBoolPref("browser.enable_click_image_resizing",false);
        
        /* Register preferences observer */
        
        zoomPage.prefsObserver.register();
        
        /* Add listeners for tabs */
        
        gBrowser.tabContainer.addEventListener("TabOpen",zoomPage.onTabOpen,false);
        gBrowser.tabContainer.addEventListener("TabSelect",zoomPage.onTabSelect,false);
        
        /* Add listeners for manual reloads and manual fit-to-width shortcut */
        
        window.addEventListener("keypress",zoomPage.onWindowKeyPress,true);  /* reload shortcuts (F5 or Ctrl+R) and fit-to-width shorcut (Ctrl+') */
        document.getElementById("context-reload").addEventListener("click",zoomPage.onReloadClick,false);  /* reload on content context menu */
        document.getElementById("context_reloadTab").addEventListener("click",zoomPage.onReloadClick,false);  /* reload tab on tab context menu */
        document.getElementById("context_reloadAllTabs").addEventListener("click",zoomPage.onReloadAllClick,false);  /* reload all tabs on tab context menu */
        if (document.getElementById("reload-button") != null) document.getElementById("reload-button").addEventListener("click",zoomPage.onReloadClick,false);  /* reload button */
        if (document.getElementById("urlbar-reload-button") != null) document.getElementById("urlbar-reload-button").addEventListener("click",zoomPage.onReloadClick,false);  /* urlbar reload button (FF29+) */
        
        /* Add listener for button added to toolbar */
        
        if (zoomPage.ffVersion >= +"29.0")
        {
            CustomizableUI.addListener(zoomPage.widgetListener);
        }
        else if (zoomPage.ffVersion >= +"4.0")
        {
            document.getElementById("navigator-toolbox").addEventListener("drop",zoomPage.onButtonDrop,false);
            document.getElementById("addon-bar").addEventListener("drop",zoomPage.onButtonDrop,false);
        }
        
        /* Add listener for Menu Panel or Overflow Panel showing */
        
        if (zoomPage.ffVersion >= +"29.0")
        {
            document.getElementById("PanelUI-popup").addEventListener("popupshowing",zoomPage.onPanelUIPopupShowing,false);
            document.getElementById("widget-overflow").addEventListener("popupshowing",zoomPage.onOverflowPopupShowing,false);
        }
        
        /* Do same as onTabOpen() for tabs that do not fire TabOpen events on browser startup */
        
        for (i = 0; i < gBrowser.tabContainer.childNodes.length; i++)
        {
            tab = gBrowser.tabContainer.childNodes[i];
            
            browser = tab.linkedBrowser;
            
            /* Initialize resize timeout */
            
            browser.zoompage_resizeTimeout = null;
            
            /* Initialize previous uri, width and height */
            
            browser.zoompage_previousURI = "";  /* too soon to access browser.currentURI.spec - FF3.6 */
            browser.zoompage_previousWidth = 0;  /* too soon to access browser.contentWindow.innerWidth */
            browser.zoompage_previousHeight = 0;  /* too soon to access browser.contentWindow.innerHeight */
            
            /* Initialize last fit-to-width/window zoom values */
            
            browser.zoompage_lastFitToWidth = 1.0;
            browser.zoompage_lastFitToWindow = 1.0;
            
            /* Add listeners for browser */
            
            browser.addEventListener("pageshow",zoomPage.onPageShow,false);
            browser.addEventListener("hashchange",zoomPage.onHashChange,false);
            browser.addEventListener("resize",zoomPage.onBrowserResize,false);
            browser.addEventListener("DOMMouseScroll",zoomPage.onBrowserScroll,false);
            browser.addEventListener("click",zoomPage.onContentClick,false);
            
            window.setTimeout(
            function(browser,tab)
            {
				/* Initialize was pending flag */
				
				if (tab.hasAttribute("pending")) browser.zoompage_wasPending = true;
				else browser.zoompage_wasPending = false;
				
                /* Default Zoom - set zoom value for tab opened */
                
                if (zoomPage.zoomMode == 0)
                {
                    ZoomManager.setZoomForBrowser(browser,zoomPage.prefs.getIntPref("defaultlevel")/100);
                }
                
                zoomPage.setPercent(4);
            }
            ,0,browser,tab);  /* delay required by Firefox 3.6 */
        }
        
        /* Initialize zoom percentage and indicators */
        
        zoomPage.setPercent(5);
    },
    
    onUnload: function()
    {
        var moreBrowsers,browserWindows;
        
        moreBrowsers = false;
        browserWindows = zoomPage.winmed.getEnumerator("navigator:browser");
        while (browserWindows.hasMoreElements()) if (browserWindows.getNext() != window) moreBrowsers = true;
        
        if (!moreBrowsers)  /* last browser */
        {
            /* Enable Firefox's Image Resizing preferences */
            
            zoomPage.otherPrefs.setBoolPref("browser.enable_automatic_image_resizing",true);
            zoomPage.otherPrefs.setBoolPref("browser.enable_click_image_resizing",true);
            
            /* Enable Firefox's Site-Specific Zoom preference */
            
            zoomPage.otherPrefs.setBoolPref("browser.zoom.siteSpecific",true);
        }
    },
    
    /********************************************************************/
    
    /* Redefine existing functions */
    
    redefineFunctions: function()
    {
        /* Redefine FullZoom.onContentPrefSet() */
        
        FullZoom.zoompage_old_onContentPrefSet = FullZoom.onContentPrefSet;
        
        FullZoom.onContentPrefSet =
        function new_onContentPrefSet(aGroup, aName, aValue)
        {
            var browser;
            
            browser = gBrowser.selectedBrowser;
            
            zoomPage.getSiteSpecific(browser,
            function(browser,sitevalue)
            {
                if (zoomPage.zoomMode == 3 && typeof sitevalue == "undefined")
                {
                    /* In case of changes to global content preference in another browser window */
                    
                    if (aGroup == null) return;
                }
                
                FullZoom._isNextContentPrefChangeInternal = false;  /* FF24+ */
                FullZoom.zoompage_old_onContentPrefSet(aGroup,aName,aValue);
            });
        };
        
        /* Redefine FullZoom.onContentPrefRemoved() */
        
        FullZoom.zoompage_old_onContentPrefRemoved = FullZoom.onContentPrefRemoved;
        
        FullZoom.onContentPrefRemoved =
        function new_onContentPrefRemoved(aGroup, aName)
        {
            var browser;
            
            browser = gBrowser.selectedBrowser;
            
            zoomPage.getSiteSpecific(browser,
            function(browser,sitevalue)
            {
                if (zoomPage.zoomMode == 3 && typeof sitevalue == "undefined")
                {
                    /* In case of changes to global or site content preferences in another browser window */
                    
                    if (aGroup == null) return;
                    ZoomManager.zoom = browser.zoompage_lastFitToWidth;
                    return;
                }
                
                FullZoom._isNextContentPrefChangeInternal = false;  /* FF24+ */
                FullZoom.zoompage_old_onContentPrefRemoved(aGroup,aName);
            });
        };
        
        /* Redefine FullZoom.onLocationChange() */
        
        FullZoom.zoompage_old_onLocationChange = FullZoom.onLocationChange;
        
        FullZoom.onLocationChange =
        function new_onLocationChange(aURI, aIsTabSwitch, aBrowser)
        {
            var browser;
            
            browser = aBrowser || gBrowser.selectedBrowser;  /* browser may be undefined */
            
            zoomPage.getSiteSpecific(browser,
            function(browser,sitevalue)
            {
                var style;
                
                if (aIsTabSwitch)  /* tab select - TabSelect event will follow immediately */
                {
                    if (browser.zoompage_wasPending)
                    {
                        browser.zoompage_previousURI = "";
                        browser.zoompage_lastFitToWidth = zoomPage.lastFitToWidth;
                    }
                    
                    if (zoomPage.imagePage(browser)) ;  /* image page */
                    else  /* not image page */
                    {
                        /* Fit-To-Width Zoom or Fit-To-Width Zoom + Site-Specific Zoom (if site-specific not set) - do nothing */
                        
                        if (zoomPage.zoomMode == 1 || (zoomPage.zoomMode == 3 && typeof sitevalue == "undefined")) ;
                        else FullZoom.zoompage_old_onLocationChange(aURI,aIsTabSwitch,aBrowser);  /* Firefox site-specific zoom */
                    }
                }
                else  /* page load - pageshow event may not be for some time */
                {
                    if (zoomPage.imagePage(browser))  /* image page */
                    {
                        /* Create style element with CSS rule for cursor appearance */
                        
                        style = browser.contentDocument.createElement("style");
                        style.id = "zoompage-style";
                        style.type = "text/css";
                        style.innerHTML = "body > img { cursor: default !important; }";
                        browser.contentDocument.childNodes[0].childNodes[0].appendChild(style);
                    }
                    else  /* not image page */
                    {
                        /* Fit-To-Width Zoom or Fit-To-Width Zoom + Site-Specific Zoom (if site-specific not set) - set last zoom value for different page loaded */
                        
                        if (zoomPage.zoomMode == 1 || (zoomPage.zoomMode == 3 && typeof sitevalue == "undefined"))
                        {
                            if (zoomPage.specialPage(browser,true)) ;  /* special page - not fit-to-width zoom */
                            else  /* normal page - best guess fit-to-width zoom */
                            {
                                if (browser.currentURI.spec != browser.zoompage_previousURI)  /* ignore minor refreshes/updates which don't change uri */
                                    ZoomManager.setZoomForBrowser(browser,browser.zoompage_lastFitToWidth);
                            }
                        }
                        else FullZoom.zoompage_old_onLocationChange(aURI,aIsTabSwitch,aBrowser);  /* Firefox site-specific zoom */
                    }
                }
            });
        };
        
        /* Redefine FullZoom.reset() */
        
        FullZoom.reset =
        function new_reset(callback)
        {
            var browser;
            
            ZoomManager.zoom = 1.0;
            
            browser = gBrowser.selectedBrowser;
            
            if (zoomPage.imagePage(browser))  /* image page */
            {
                if (zoomPage.imagezoomMode == 1) zoomPage.fitToWindow(browser);  /* image - fit-to-window zoom */
                else ZoomManager.zoom = zoomPage.prefs.getIntPref("imgdefaultlevel")/100;
            }
            else  /* not image page */
            {
                if (zoomPage.zoomMode == 1 || zoomPage.zoomMode == 3)
                {
                    if (zoomPage.specialPage(browser,true)) ;  /* special page - not fit-to-width zoom */
                    else zoomPage.fitToWidth(browser);  /* normal page - fit-to-width zoom */
                }
                else ZoomManager.zoom = zoomPage.prefs.getIntPref("defaultlevel")/100;
            }
            
            if (zoomPage.ffVersion >= +"24.0") this._removePref(browser);
            else if (zoomPage.ffVersion >= +"22.0") this._removePref(callback);
            else this._removePref();
        };
        
        /* Redefine ZoomManager.setZoomForBrowser() */
        
        ZoomManager.setZoomForBrowser =
        function new_setZoomForBrowser(aBrowser, aVal)
        {
            if (aVal < this.MIN || aVal > this.MAX)
                throw Components.results.NS_ERROR_INVALID_ARG;
            
            if (aBrowser == gBrowser) aBrowser = gBrowser.selectedBrowser;  /* because 'set zoom()' in Zoom Manager sets aBrowser to getBrowser() */
            
            var markupDocumentViewer = aBrowser.markupDocumentViewer;
            
            if (this.useFullZoom || zoomPage.imagePage(aBrowser))
            {
                markupDocumentViewer.textZoom = 1;
                markupDocumentViewer.fullZoom = aVal;
            }
            else
            {
                markupDocumentViewer.textZoom = aVal;
                markupDocumentViewer.fullZoom = 1;
            }
            
            if (zoomPage.imagePage(aBrowser)) zoomPage.setImageCursor(aBrowser);
            
            zoomPage.setPercent(6);
        };
        
        /* Redefine ZoomManager.enlarge() */
        
        ZoomManager.enlarge =
        function new_enlarge()
        {
            var i;
            
            for (i = 0; i < this.zoomValues.length && Math.round(this.zoom*100)/100 >= this.zoomValues[i]; i++) ;
            
            if (i < this.zoomValues.length) this.zoom = this.zoomValues[i];
        };
        
        /* Redefine ZoomManager.reduce() */
        
        ZoomManager.reduce =
        function new_reduce()
        {
            var i;
            
            for (i = this.zoomValues.length-1; i >= 0 && Math.round(this.zoom*100)/100 <= this.zoomValues[i]; i--) ;
            
            if (i >= 0) this.zoom = this.zoomValues[i];
        };
    },
    
    /********************************************************************/
    
    /* Additional functions */
    
    activeButtonStyle: function()
    {
        if (window.getComputedStyle(document.getElementById("zoompage-style-c"),null).getPropertyValue("display") != "none") return "c";
        if (window.getComputedStyle(document.getElementById("zoompage-style-n"),null).getPropertyValue("display") != "none") return "n";
        if (window.getComputedStyle(document.getElementById("zoompage-style-s"),null).getPropertyValue("display") != "none") return "s";
        if (window.getComputedStyle(document.getElementById("zoompage-style-t"),null).getPropertyValue("display") != "none") return "t";
        if (window.getComputedStyle(document.getElementById("zoompage-style-m"),null).getPropertyValue("display") != "none") return "m";
        
        return "n";
    },
    
    setPercent: function(trace)
    {
        if (document.getElementById("main-window").hasAttribute("customizing")) return;
        
        window.setTimeout(function() { zoomPage.setPercentDelayed(trace); },10);  /* allow time for zooming to complete */
    },
    
    setPercentDelayed: function(trace)
    {
        var browser,percent,string,outlinecolor;
        
        if (document.getElementById("zoompage-item") != null)  /* button accessible */
        {
            browser = gBrowser.selectedBrowser;
            
            if (zoomPage.imagePage(browser))  /* image page */
            {
                /* Initialize */
                
                if (zoomPage.ffVersion == +"3.6")
                {
                    percent = document.getAnonymousElementByAttribute(document.getElementById("zoompage-percent"),"class","statusbarpanel-text"); 
                }
                else if (zoomPage.ffVersion >= +"4.0")
                {
                    percent = document.getElementById("zoompage-percent-label-" + zoomPage.activeButtonStyle());
                }
                
                /* Calculate display field width */
                
                zoomPage.calculateDisplayWidth();
                
                /* Determine active indicators */
                
                percent.style.removeProperty("font-style");
                percent.style.removeProperty("color");
                percent.style.removeProperty("outline");
                percent.style.removeProperty("outline-offset");
                
                string = "" + Math.round(ZoomManager.zoom*100);
                
                if (zoomPage.osPlatform == "Darwin") outlinecolor = "#B0B0B0"; else outlinecolor = "#C0C0C0";
                
                /* Explicit / Default / Fit-To-Width indicators */
                
                if (zoomPage.imagezoomMode == 0)
                {
                    if (Math.round(ZoomManager.zoom*100) == zoomPage.prefs.getIntPref("imgdefaultlevel"))
                    {
                        if (zoomPage.prefs.getBoolPref("defprefix")) string = document.getElementById("zoompage-defflag").value + string;
                        if (zoomPage.prefs.getBoolPref("defborder"))
                        {
                            percent.style.setProperty("outline","1px dotted " + outlinecolor,"");
                            percent.style.setProperty("outline-offset","-1px","");
                        }
                    }
                    else if (zoomPage.prefs.getBoolPref("expprefix")) string = document.getElementById("zoompage-expflag").value + string;
                }
                else if (zoomPage.imagezoomMode == 1)
                {
                    if (Math.round(ZoomManager.zoom*100) == Math.round(browser.zoompage_lastFitToWindow*100))
                    {
                        if (zoomPage.prefs.getBoolPref("ftwprefix")) string = document.getElementById("zoompage-ftwflag").value + string;
                        if (zoomPage.prefs.getBoolPref("ftwborder"))
                        {
                            percent.style.setProperty("outline","1px dashed " + outlinecolor,"");
                            percent.style.setProperty("outline-offset","-1px","");
                        }
                    }
                    else if (zoomPage.prefs.getBoolPref("expprefix")) string = document.getElementById("zoompage-expflag").value + string;
                }
                
                /* Percent indicator */
                
                if (zoomPage.prefs.getBoolPref("pcsuffix")) string = string + "%";
                
                /* Trace source of setPercent() */
                
                if (zoomPage.enableTrace) string = trace + " - " + string;
                
                /* Update zoom percentage and indicators */
                
                percent.setAttribute("value",string);
            }
            else  /* not image page */
            {
                zoomPage.getSiteSpecific(browser,
                function(browser,sitevalue)
                {
                    var percent,string,outlinecolor;
                    
                    /* Initialize */
                    
                    if (zoomPage.ffVersion == +"3.6")
                    {
                        percent = document.getAnonymousElementByAttribute(document.getElementById("zoompage-percent"),"class","statusbarpanel-text"); 
                    }
                    else if (zoomPage.ffVersion >= +"4.0")
                    {
                        percent = document.getElementById("zoompage-percent-label-" + zoomPage.activeButtonStyle());
                    }
                    
                    /* Calculate display field width */
                    
                    zoomPage.calculateDisplayWidth();
                    
                    /* Determine active indicators */
                    
                    percent.style.removeProperty("font-style");
                    percent.style.removeProperty("color");
                    percent.style.removeProperty("outline");
                    percent.style.removeProperty("outline-offset");
                    
                    string = "" + Math.round(ZoomManager.zoom*100);
                    
                    if (zoomPage.osPlatform == "Darwin") outlinecolor = "#B0B0B0"; else outlinecolor = "#C0C0C0";
                    
                    /* Full Page / Text Only indicators */
                    
                    if (zoomPage.otherPrefs.getBoolPref("browser.zoom.full"))
                    {
                        if (zoomPage.prefs.getBoolPref("fpprefix")) string = document.getElementById("zoompage-fpflag").value + string;
                    }
                    else
                    {
                        if (zoomPage.prefs.getBoolPref("toprefix")) string = document.getElementById("zoompage-toflag").value + string;
                        if (zoomPage.prefs.getBoolPref("toitalic")) percent.style.setProperty("font-style","italic","");
                        if (zoomPage.prefs.getBoolPref("tored")) percent.style.setProperty("color","#800000","");
                    }
                    
                    /* Explicit / Default / Fit-To-Width / Site-Specific indicators */
                    
                    if ((zoomPage.zoomMode == 2 || zoomPage.zoomMode == 3) && typeof sitevalue != "undefined")
                    {
                        if (zoomPage.prefs.getBoolPref("ssprefix")) string = document.getElementById("zoompage-ssflag").value + string;
                        if (zoomPage.prefs.getBoolPref("ssborder"))
                        {
                            percent.style.setProperty("outline","1px solid " + outlinecolor,"");
                            percent.style.setProperty("outline-offset","-1px","");
                        }
                    }
                    else if (zoomPage.zoomMode == 0 || zoomPage.zoomMode == 2)
                    {
                        if (Math.round(ZoomManager.zoom*100) == zoomPage.prefs.getIntPref("defaultlevel"))
                        {
                            if (zoomPage.prefs.getBoolPref("defprefix")) string = document.getElementById("zoompage-defflag").value + string;
                            if (zoomPage.prefs.getBoolPref("defborder"))
                            {
                                percent.style.setProperty("outline","1px dotted " + outlinecolor,"");
                                percent.style.setProperty("outline-offset","-1px","");
                            }
                        }
                        else if (zoomPage.prefs.getBoolPref("expprefix")) string = document.getElementById("zoompage-expflag").value + string;
                    }
                    else if (zoomPage.zoomMode == 1 || zoomPage.zoomMode == 3)
                    {
                        if (zoomPage.specialPage(browser,false))
                        {
                            if (Math.round(ZoomManager.zoom*100) == zoomPage.prefs.getIntPref("defaultlevel"))
                            {
                                if (zoomPage.prefs.getBoolPref("defprefix")) string = document.getElementById("zoompage-defflag").value + string;
                                if (zoomPage.prefs.getBoolPref("defborder"))
                                {
                                    percent.style.setProperty("outline","1px dotted " + outlinecolor,"");
                                    percent.style.setProperty("outline-offset","-1px","");
                                }
                            }
                            else if (zoomPage.prefs.getBoolPref("expprefix")) string = document.getElementById("zoompage-expflag").value + string;
                        }
                        else
                        {
                            if (Math.round(ZoomManager.zoom*100) == Math.round(browser.zoompage_lastFitToWidth*100))
                            {
                                if (zoomPage.prefs.getBoolPref("ftwprefix")) string = document.getElementById("zoompage-ftwflag").value + string;
                                if (zoomPage.prefs.getBoolPref("ftwborder"))
                                {
                                    percent.style.setProperty("outline","1px dashed " + outlinecolor,"");
                                    percent.style.setProperty("outline-offset","-1px","");
                                }
                            }
                            else if (zoomPage.prefs.getBoolPref("expprefix")) string = document.getElementById("zoompage-expflag").value + string;
                        }
                    }
                    
                    /* Percent indicator */
                    
                    if (zoomPage.prefs.getBoolPref("pcsuffix")) string = string + "%";
                    
                    /* Trace source of setPercent() */
                    
                    if (zoomPage.enableTrace) string = trace + " - " + string;
                    
                    /* Update zoom percentage and indicators */
                    
                    percent.setAttribute("value",string);
                });
            }
        }
    },
    
    calculateDisplayWidth: function()
    {
        var percent,numW,expW,defW,ftwW,ssW,fpW,toW,pcW,maxW1,maxW2,maxW3;
        
        if (zoomPage.ffVersion == +"3.6")
        {
            percent = document.getAnonymousElementByAttribute(document.getElementById("zoompage-percent"),"class","statusbarpanel-text"); 
        }
        else if (zoomPage.ffVersion >= +"4.0")
        {
            percent = document.getElementById("zoompage-percent-label-" + zoomPage.activeButtonStyle());
        }
        
        /* Calculate field width */
        
        percent.setAttribute("value","");
        percent.style.removeProperty("width");
        percent.style.setProperty("font-style","italic","");
        percent.style.setProperty("font-weight","bold","");
        
        percent.setAttribute("value","888");
        numW = percent.boxObject.width;
        
        percent.setAttribute("value",document.getElementById("zoompage-expflag").value + "888");
        if (zoomPage.prefs.getBoolPref("expprefix")) expW = percent.boxObject.width; else expW = numW;
        percent.setAttribute("value",document.getElementById("zoompage-defflag").value + "888");
        if (zoomPage.prefs.getBoolPref("defprefix")) defW = percent.boxObject.width; else defW = numW;
        percent.setAttribute("value",document.getElementById("zoompage-ftwflag").value + "888");
        if (zoomPage.prefs.getBoolPref("ftwprefix")) ftwW = percent.boxObject.width; else ftwW = numW;
        percent.setAttribute("value",document.getElementById("zoompage-ssflag").value + "888");
        if (zoomPage.prefs.getBoolPref("ssprefix")) ssW = percent.boxObject.width; else ssW = numW;
        maxW1 = Math.max(expW,defW,ftwW,ssW)-numW;
        
        percent.setAttribute("value",document.getElementById("zoompage-fpflag").value + "888");
        if (zoomPage.prefs.getBoolPref("fpprefix")) fpW = percent.boxObject.width; else fpW = numW;
        percent.setAttribute("value",document.getElementById("zoompage-toflag").value + "888");
        if (zoomPage.prefs.getBoolPref("toprefix")) toW = percent.boxObject.width; else toW = numW;
        maxW2 = Math.max(fpW,toW)-numW;
        
        percent.setAttribute("value","888" + "%");
        if (zoomPage.prefs.getBoolPref("pcsuffix")) pcW = percent.boxObject.width; else pcW = numW;
        maxW3 = pcW-numW;
        
        percent.style.setProperty("width",(maxW1+maxW2+numW+maxW3+4)+"px","important");
        
        percent.style.removeProperty("font-style");
        percent.style.removeProperty("font-weight");
    },
    
    setImageCursor: function(browser)
    {
        zoomPage.setImageCursorDelayed(browser);  /* immediately */

        window.setTimeout(function(browser) { zoomPage.setImageCursorDelayed(browser); },100,browser);  /* allow time for zooming to complete */
    },
    
    setImageCursorDelayed: function(browser)
    {
        var cursorimage,style;
        
        if (zoomPage.imagezoomMode == 0)
        {
            if (Math.round(ZoomManager.getZoomForBrowser(browser)*100) == zoomPage.prefs.getIntPref("imgdefaultlevel"))
            {
                if (browser.contentWindow.scrollMaxX > 0 || browser.contentWindow.scrollMaxY > 0) cursorimage = zoomPage.shrinkImage;
                else cursorimage = zoomPage.expandImage;
            }
            else cursorimage = zoomPage.defaultImage;
        }
        else
        {
            if (Math.round(ZoomManager.getZoomForBrowser(browser)*100) == Math.round(browser.zoompage_lastFitToWindow*100)) cursorimage = zoomPage.defaultImage;
            else
            {
                if (browser.contentWindow.scrollMaxX > 0 || browser.contentWindow.scrollMaxY > 0) cursorimage = zoomPage.shrinkImage;
                else cursorimage = zoomPage.expandImage;
            }
        }
        
        /* Update style element with new CSS rule for cursor appearance*/
        
        style = browser.contentDocument.getElementById("zoompage-style");
        if (style) style.innerHTML = "body > img { cursor: url(" + cursorimage + ") 8 8,default !important; }";
    },
    
    fitToWidth: function(browser)
    {
        var min,max,ful,scale,zoom,clientWidth,scrollWidth;
        
        min = zoomPage.prefs.getIntPref("fittowidthmin")/100;
        max = zoomPage.prefs.getIntPref("fittowidthmax")/100;
        ful = zoomPage.prefs.getIntPref("fittowidthful")/100;
        
        if (browser.boxObject.width > window.screen.width/2)
        {
            scale = (browser.boxObject.width-window.screen.width/2)/(window.screen.width/2);
            max += (ful-max)*scale;
        }
        
        zoom = max;
        ZoomManager.setZoomForBrowser(browser,zoom);
        
        if (browser.contentWindow.scrollMaxX > 0)  /* horizontal scroll bar */
        {
            clientWidth = browser.contentWindow.innerWidth;
            scrollWidth = clientWidth+browser.contentWindow.scrollMaxX;
            if (browser.contentWindow.scrollMaxY > 0) scrollWidth = scrollWidth-17/max; /* vertical scroll bar */
            
            zoom = Math.floor((clientWidth/scrollWidth)*max*100)/100;
            if (zoom < min) zoom = min;
            
            ZoomManager.setZoomForBrowser(browser,zoom);
            
            while (browser.contentWindow.scrollMaxX > 0 && zoom > min)  /* horizontal scroll bar */
                ZoomManager.setZoomForBrowser(browser,(zoom -= 0.01));
        }
        
        browser.zoompage_lastFitToWidth = zoom;
        
        zoomPage.lastFitToWidth = zoom;
        
        /* Fit-To-Width Zoom or Fit-To-Width Zoom + Site-Specific Zoom - update global content preference  */
        
        if (zoomPage.zoomMode == 1 || zoomPage.zoomMode == 3)
        {
            if (browser == gBrowser.selectedBrowser) zoomPage.setSiteSpecific(null,browser.zoompage_lastFitToWidth);  /* set global content preference same as fit-to-width zoom */
        }
    },
    
    fitToWindow: function(browser)
    {
        var min,max,zoom,zoomX,zoomY,clientWidth,scrollWidth,clientHeight,scrollHeight;
        
        min = zoomPage.prefs.getIntPref("imgfittowindowmin")/100;
        max = zoomPage.prefs.getIntPref("imgfittowindowmax")/100;
        
        zoom = max;
        ZoomManager.setZoomForBrowser(browser,zoom);
        
        if (browser.contentWindow.scrollMaxX > 0 || browser.contentWindow.scrollMaxY > 0)  /* horizontal or vertical scroll bar */
        {
            clientWidth = browser.contentWindow.innerWidth;
            scrollWidth = clientWidth+browser.contentWindow.scrollMaxX;
            if (browser.contentWindow.scrollMaxY > 0) scrollWidth = scrollWidth-17/max; /* vertical scroll bar */
            
            clientHeight = browser.contentWindow.innerHeight;
            scrollHeight = clientHeight+browser.contentWindow.scrollMaxY;
            if (browser.contentWindow.scrollMaxX > 0) scrollHeight = scrollHeight-17/max;  /* horizontal scroll bar */
            
            zoomX = Math.floor((clientWidth/scrollWidth)*max*100)/100;
            zoomY = Math.floor((clientHeight/scrollHeight)*max*100)/100;
            zoom = Math.min(zoomX,zoomY);
            if (zoom < min) zoom = min;
            
            ZoomManager.setZoomForBrowser(browser,zoom);
            
            while ((browser.contentWindow.scrollMaxX > 0 || browser.contentWindow.scrollMaxY > 0) && zoom > min)  /* horizontal or vertical scroll bar */
                ZoomManager.setZoomForBrowser(browser,(zoom -= 0.01));
        }
        
        browser.zoompage_lastFitToWindow = zoom;
    },
    
    specialPage: function(browser,setzoom)
    {
        if (typeof browser.currentURI == "undefined")  /* may be undefined if call to specialPage() delayed */
        {
        }
        else if (document.getElementById("print-preview-toolbar") != null)  /* print preview mode */
        {
        }
        else if (document.getElementById("printedit-toolbar") != null &&
                 document.getElementById("printedit-toolbar").getAttribute("collapsed") == "false")  /* print edit mode */
        {
        }
        else if (browser.currentURI.spec.substr(0,6) == "about:")  /* special Firefox uri */
        {
            if (setzoom) ZoomManager.setZoomForBrowser(browser,zoomPage.prefs.getIntPref("defaultlevel")/100);
        }
        else if (browser.contentDocument && browser.contentDocument instanceof Ci.nsIImageDocument)  /* image document */
        {
            return false;  /* should not happen - specialPage() should not be called for image page */
        }
        else if (browser.contentDocument && browser.contentDocument.mozSyntheticDocument)  /* media document - video/audio (not image) - FF8+ */
        {
            if (setzoom) ZoomManager.setZoomForBrowser(browser,zoomPage.prefs.getIntPref("defaultlevel")/100);
        }
        else
        {
            return false;
        }
        
        /* Special Page */
        
        if (zoomPage.zoomMode == 1 || zoomPage.zoomMode == 3)
        {
            browser.zoompage_lastFitToWidth = ZoomManager.getZoomForBrowser(browser);
            zoomPage.setSiteSpecific(null,zoomPage.prefs.getIntPref("defaultlevel")/100);
        }
        
        return true;
    },
    
    imagePage: function(browser)
    {
        if (browser.contentDocument && browser.contentDocument instanceof Ci.nsIImageDocument)  /* image document */
        {
            return true;
        }
        
        return false;
    },
    
    getSiteSpecific: function(browser,callback)
    {
        var domain,context,pref,value;
        
        /* assumes that browser is never null */
        
        if (typeof browser.currentURI == "undefined") return;
        
        if (zoomPage.ffVersion >= +"22.0")
        {
            domain = browser.currentURI.spec;
            context = gBrowser.contentDocument.defaultView.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIWebNavigation).QueryInterface(Ci.nsILoadContext);
            pref = zoomPage.contentPrefs.getCachedByDomainAndName(domain,FullZoom.name,context);
            if (pref) callback(browser,pref.value);
            else
            {
                value = undefined;
                zoomPage.contentPrefs.getByDomainAndName(domain,FullZoom.name,context,{ handleResult: function (pref) value = pref.value, handleCompletion: function() callback(browser,value) });
            }
        }
        else if (zoomPage.ffVersion >= +"19.0")
        {
            domain = browser.currentURI;
            context = gBrowser.contentDocument.defaultView.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIWebNavigation).QueryInterface(Ci.nsILoadContext);
            callback(browser,zoomPage.contentPrefs.getPref(domain,FullZoom.name,context));
        }
        else
        {
            domain = browser.currentURI;
            callback(browser,zoomPage.contentPrefs.getPref(domain,FullZoom.name));
        }
    },
    
    setSiteSpecific: function(browser,value)
    {
        var domain,context;
        
        /* assumes that browser is always null */
        
        if (zoomPage.ffVersion >= +"22.0")
        {
            context = gBrowser.contentDocument.defaultView.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIWebNavigation).QueryInterface(Ci.nsILoadContext);
            zoomPage.contentPrefs.setGlobal(FullZoom.name,value,context);
        }
        else if (zoomPage.ffVersion >= +"19.0")
        {
            domain = null;
            context = gBrowser.contentDocument.defaultView.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIWebNavigation).QueryInterface(Ci.nsILoadContext);
            zoomPage.contentPrefs.setPref(domain,FullZoom.name,value,context);
        }
        else
        {
            domain = null;
            zoomPage.contentPrefs.setPref(domain,FullZoom.name,value);
        }
    },
    
    /********************************************************************/
    
    /* Event handlers */
    
    onTooltipPopupShowing: function(event)
    {
        var browser;
        
        browser = gBrowser.selectedBrowser;
        
        if (zoomPage.prefs.getBoolPref("swapactions"))
        {
            document.getElementById("zoompage-zoomdisplay-tip-1a").setAttribute("hidden","true");
            document.getElementById("zoompage-zoomdisplay-tip-1b").removeAttribute("hidden");
            document.getElementById("zoompage-zoomdisplay-tip-2a").removeAttribute("hidden");
            document.getElementById("zoompage-zoomdisplay-tip-2b").setAttribute("hidden","true");
        }
        else
        {
            document.getElementById("zoompage-zoomdisplay-tip-1a").removeAttribute("hidden");
            document.getElementById("zoompage-zoomdisplay-tip-1b").setAttribute("hidden","true");
            document.getElementById("zoompage-zoomdisplay-tip-2a").setAttribute("hidden","true");
            document.getElementById("zoompage-zoomdisplay-tip-2b").removeAttribute("hidden");
        }
        
        if (zoomPage.imagePage(browser))  /* image page */
        {
            if (zoomPage.imagezoomMode == 0)
            {
                document.getElementById("zoompage-zoomdisplay-tip-3a").setAttribute("hidden","true");
                document.getElementById("zoompage-zoomdisplay-tip-3b").setAttribute("hidden","true");
                document.getElementById("zoompage-zoomdisplay-tip-3c").removeAttribute("hidden");
            }
            else
            {
                document.getElementById("zoompage-zoomdisplay-tip-3a").removeAttribute("hidden");
                document.getElementById("zoompage-zoomdisplay-tip-3b").setAttribute("hidden","true");
                document.getElementById("zoompage-zoomdisplay-tip-3c").setAttribute("hidden","true");
            }
            
            document.getElementById("zoompage-zoomdisplay-tip-4a").setAttribute("hidden","true");
            document.getElementById("zoompage-zoomdisplay-tip-4b").setAttribute("hidden","true");
        }
        else  /* not image page */
        {
            if (zoomPage.zoomMode == 0 || zoomPage.zoomMode == 2)
            {
                document.getElementById("zoompage-zoomdisplay-tip-3a").setAttribute("hidden","true");
                document.getElementById("zoompage-zoomdisplay-tip-3b").removeAttribute("hidden");
                document.getElementById("zoompage-zoomdisplay-tip-3c").setAttribute("hidden","true");
            }
            else
            {
                document.getElementById("zoompage-zoomdisplay-tip-3a").removeAttribute("hidden");
                document.getElementById("zoompage-zoomdisplay-tip-3b").setAttribute("hidden","true");
                document.getElementById("zoompage-zoomdisplay-tip-3c").setAttribute("hidden","true");
            }
            
            if (zoomPage.otherPrefs.getBoolPref("browser.zoom.full"))
            {
                document.getElementById("zoompage-zoomdisplay-tip-4a").setAttribute("hidden","true");
                document.getElementById("zoompage-zoomdisplay-tip-4b").removeAttribute("hidden");
            }
            else
            {
                document.getElementById("zoompage-zoomdisplay-tip-4a").removeAttribute("hidden");
                document.getElementById("zoompage-zoomdisplay-tip-4b").setAttribute("hidden","true");
            }
        }
    },
    
    onDisplayClick: function(event)
    {
        var i,j,browser,menuPopup,menuItem,zoomDisplay;
        var levelArray = new Array();
        
        browser = gBrowser.selectedBrowser;
        
        if (event.button == 0 && !event.shiftKey && !event.ctrlKey && !zoomPage.prefs.getBoolPref("swapactions") ||  /* click - actions not swapped */
            event.button == 0 && event.ctrlKey && zoomPage.prefs.getBoolPref("swapactions") ||  /* ctrl+click - actions swapped */
            event.button == 1 && zoomPage.prefs.getBoolPref("swapactions"))  /* middle-click - actions swapped */
        {
            menuPopup = document.getElementById("zoompage-zoommenupopup");
            
            if (menuPopup.state == "closed")
            {
                for (i = menuPopup.childNodes.length-1; i >= 0; i--)
                {
                    menuItem = menuPopup.childNodes[i];
                    if (menuItem.localName == "menuitem")
                    {
                        menuItem.removeEventListener("click",zoomPage.onMenuItemClick,false);
                        if (menuItem.getAttribute("value") == -2) menuItem.removeEventListener("mouseover",zoomPage.onOptionsMouseOver,false);
                        else menuItem.removeEventListener("mouseover",zoomPage.onMenuItemMouseOver,false);
                    }
                    menuPopup.removeChild(menuItem);
                }
                
                levelArray = zoomPage.zoomLevels[zoomPage.prefs.getIntPref("zoomlevels")].split("-");
                
                for (i = 0; i < levelArray.length; i++)
                {
                    menuItem = document.createElement("menuitem");
                    menuPopup.appendChild(menuItem);
                    menuItem.setAttribute("label",levelArray[i]);
                    menuItem.setAttribute("value",levelArray[i]);
                    menuItem.addEventListener("click",zoomPage.onMenuItemClick,false);
                    menuItem.addEventListener("mouseover",zoomPage.onMenuItemMouseOver,false);
                    
                    if (zoomPage.prefs.getBoolPref("pcsuffix")) menuItem.setAttribute("label",menuItem.getAttribute("label") + "%");
                    
                    if (zoomPage.imagePage(browser))  /* image page */
                    {
                        if (zoomPage.prefs.getIntPref("imgdefaultlevel") == levelArray[i]) menuItem.style.setProperty("font-weight","bold","");
                    }
                    else  /* not image page */
                    {
                        if (zoomPage.prefs.getIntPref("defaultlevel") == levelArray[i]) menuItem.style.setProperty("font-weight","bold","");
                    }
                }
                
                menuItem = document.createElement("separator");
                menuPopup.appendChild(menuItem);
                menuItem.setAttribute("class","groove");
                menuItem.style.setProperty("margin-top","1px","");
                menuItem.style.setProperty("margin-bottom","0px","");
                
                menuItem = document.createElement("menuitem");
                menuPopup.appendChild(menuItem);
                menuItem.setAttribute("class","menuitem-iconic zoompage-iconic");
                menuItem.setAttribute("image","chrome://zoompage/skin/zoompage-menu-fittowidth.png");
                menuItem.setAttribute("value",-1);
                if (zoomPage.imagePage(browser)) menuItem.setAttribute("tooltip","zoompage-fittowindow-tip");
                else menuItem.setAttribute("tooltip","zoompage-fittowidth-tip");
                menuItem.addEventListener("click",zoomPage.onMenuItemClick,false);
                menuItem.addEventListener("mouseover",zoomPage.onMenuItemMouseOver,false);
                
                menuItem = document.createElement("separator");
                menuPopup.appendChild(menuItem);
                menuItem.setAttribute("class","groove");
                menuItem.style.setProperty("margin-top","1px","");
                menuItem.style.setProperty("margin-bottom","0px","");
                
                menuItem = document.createElement("menuitem");
                menuPopup.appendChild(menuItem);
                menuItem.setAttribute("class","menuitem-iconic zoompage-iconic");
                menuItem.setAttribute("image","chrome://zoompage/skin/zoompage-menu-options.png");
                menuItem.setAttribute("value",-2);
                menuItem.setAttribute("tooltip","zoompage-options-tip");
                menuItem.addEventListener("click",zoomPage.onMenuItemClick,false);
                menuItem.addEventListener("mouseover",zoomPage.onOptionsMouseOver,false);
                
                if (zoomPage.ffVersion == +"3.6") zoomDisplay = document.getElementById("zoompage-zoomdisplay");
                else if (zoomPage.ffVersion >= +"4.0") zoomDisplay = document.getElementById("zoompage-zoomdisplay-" + zoomPage.activeButtonStyle());
                
                // if (zoomPage.ffVersion >= +"29.0") gBrowser.selectedBrowser.contentWindow.focus();  /* workaround to stop autoclose of Overflow Panel if browser window has lost focus */
                
                menuPopup.openPopup(zoomDisplay,"after_start",0,0,false,false,null);
            }
        }
        else if (event.button == 0 && !event.shiftKey && !event.ctrlKey && zoomPage.prefs.getBoolPref("swapactions") ||  /* click - actions swapped */
                 event.button == 0 && event.ctrlKey && !zoomPage.prefs.getBoolPref("swapactions") ||  /* ctrl+click - actions not swapped */
                 event.button == 1 && !zoomPage.prefs.getBoolPref("swapactions"))  /* middle-click - actions not swapped */
        {
            FullZoom.reset();
            
            zoomPage.setPercent(11);
        }
        else if (event.button == 0 && event.shiftKey)  /* shift+click */
        {
            if (zoomPage.imagePage(browser))  /* image page */
            {
                if (zoomPage.imagezoomMode == 0) zoomPage.fitToWindow(browser);  /* image - fit-to-window zoom */
                else ZoomManager.zoom = zoomPage.prefs.getIntPref("imgdefaultlevel")/100;
            }
            else  /* not image page */
            {
                if (zoomPage.zoomMode == 0 || zoomPage.zoomMode == 2)
                {
                    if (zoomPage.specialPage(browser,true)) ;  /* special page - not fit-to-width zoom */
                    else zoomPage.fitToWidth(browser);  /* normal page - fit-to-width zoom */
                }
                else ZoomManager.zoom = zoomPage.prefs.getIntPref("defaultlevel")/100;
                
                if (zoomPage.ffVersion >= +"24.0") FullZoom._applyZoomToPref(browser); else FullZoom._applySettingToPref();
            }
            
            zoomPage.setPercent(12);
        }
        else if (event.button == 2)  /* right-click */
        {
            if (!zoomPage.imagePage(browser)) ZoomManager.toggleZoom();
            
            if (zoomPage.ffVersion >= +"4.0") event.preventDefault();
            
            zoomPage.setPercent(13);
        }
    },
    
    onDisplayDblClick: function(event)
    {
        event.preventDefault();
    },
    
    onDisplayContextMenu: function(event)
    {
        event.preventDefault();
    },
    
    onMenuPopupShowing: function(event)
    {
        var menuPopup,zoomDisplay,offsetX,offsetY;
        
        menuPopup = document.getElementById("zoompage-zoommenupopup");
        
        if (zoomPage.ffVersion == +"3.6")
        {
            zoomDisplay = document.getElementById("zoompage-zoomdisplay");
            
            offsetX = (zoomDisplay.boxObject.width-menuPopup.boxObject.width)/2+0;
            offsetY = 0;
        }
        else if (zoomPage.ffVersion >= +"4.0")
        {
            zoomDisplay = document.getElementById("zoompage-zoomdisplay-" + zoomPage.activeButtonStyle());
            
            if (zoomPage.osPlatform == "WINNT") offsetX = (zoomDisplay.boxObject.width-menuPopup.boxObject.width)/2+1;
            else if (zoomPage.osPlatform == "Linux") offsetX = (zoomDisplay.boxObject.width-menuPopup.boxObject.width)/2+0;
            else if (zoomPage.osPlatform == "Darwin") offsetX = (zoomDisplay.boxObject.width-menuPopup.boxObject.width)/2+1;
            
            if (zoomPage.osPlatform == "WINNT") { if (zoomPage.activeButtonStyle() == "t") offsetY = 1; else offsetY = -3; }
            else if (zoomPage.osPlatform == "Linux") offsetY = 0;
            else if (zoomPage.osPlatform == "Darwin")  { if (zoomPage.activeButtonStyle() == "t") offsetY = 2; else offsetY = 1; }
        }
        
        menuPopup.moveTo(menuPopup.boxObject.screenX+offsetX,menuPopup.boxObject.screenY+offsetY);
    },
    
    onMenuItemMouseOver: function(event)
    {
        var menuPopup;
        
        menuPopup = document.getElementById("zoompage-modemenupopup");
        
        menuPopup.hidePopup();
    },
    
    onOptionsMouseOver: function(event)
    {
        var i,browser,menuPopup,menuItem,offsetX,offsetY;
        
        browser = gBrowser.selectedBrowser;
        
        menuPopup = document.getElementById("zoompage-modemenupopup");
        
        document.getAnonymousElementByAttribute(menuPopup,"class","popup-internal-box").setAttribute("orient","horizontal"); 
        
        if (menuPopup.state == "closed")
        {
            for (i = menuPopup.childNodes.length-1; i >= 0; i--)
            {
                menuItem = menuPopup.childNodes[i];
                menuItem.removeEventListener("click",zoomPage.onMenuItemClick,false);
                menuPopup.removeChild(menuItem);
            }
            
            if (zoomPage.imagePage(browser))  /* image page */
            {
                menuItem = document.createElement("menuitem");
                menuPopup.appendChild(menuItem);
                menuItem.setAttribute("label",document.getElementById("zoompage-defflag").value + "/" + document.getElementById("zoompage-expflag").value);
                menuItem.setAttribute("value",-20);
                menuItem.setAttribute("tooltip","zoompage-defaultzoom-tip");
                menuItem.addEventListener("click",zoomPage.onMenuItemClick,false);
                if (zoomPage.prefs.getIntPref("imagezoommode") == 0) menuItem.style.setProperty("font-weight","bold","");
                
                menuItem = document.createElement("menuitem");
                menuPopup.appendChild(menuItem);
                menuItem.setAttribute("label",document.getElementById("zoompage-ftwflag").value + "/" + document.getElementById("zoompage-expflag").value);
                menuItem.setAttribute("value",-21);
                menuItem.setAttribute("tooltip","zoompage-fittowindow-tip");
                menuItem.addEventListener("click",zoomPage.onMenuItemClick,false);
                if (zoomPage.prefs.getIntPref("imagezoommode") == 1) menuItem.style.setProperty("font-weight","bold","");
            }
            else  /* not image page */
            {
                menuItem = document.createElement("menuitem");
                menuPopup.appendChild(menuItem);
                menuItem.setAttribute("label",document.getElementById("zoompage-defflag").value + "/" + document.getElementById("zoompage-expflag").value);
                menuItem.setAttribute("value",-10);
                menuItem.setAttribute("tooltip","zoompage-defaultzoom-tip");
                menuItem.addEventListener("click",zoomPage.onMenuItemClick,false);
                if (zoomPage.prefs.getIntPref("zoommode") == 0) menuItem.style.setProperty("font-weight","bold","");
                
                menuItem = document.createElement("menuitem");
                menuPopup.appendChild(menuItem);
                menuItem.setAttribute("label",document.getElementById("zoompage-ftwflag").value + "/" + document.getElementById("zoompage-expflag").value);
                menuItem.setAttribute("value",-11);
                menuItem.setAttribute("tooltip","zoompage-fittowidth-tip");
                menuItem.addEventListener("click",zoomPage.onMenuItemClick,false);
                if (zoomPage.prefs.getIntPref("zoommode") == 1) menuItem.style.setProperty("font-weight","bold","");
                
                menuItem = document.createElement("menuitem");
                menuPopup.appendChild(menuItem);
                menuItem.setAttribute("label",document.getElementById("zoompage-defflag").value + "/" + document.getElementById("zoompage-ssflag").value);
                menuItem.setAttribute("value",-12);
                menuItem.setAttribute("tooltip","zoompage-defzoomsitespec-tip");
                menuItem.addEventListener("click",zoomPage.onMenuItemClick,false);
                if (zoomPage.prefs.getIntPref("zoommode") == 2) menuItem.style.setProperty("font-weight","bold","");
                
                menuItem = document.createElement("menuitem");
                menuPopup.appendChild(menuItem);
                menuItem.setAttribute("label",document.getElementById("zoompage-ftwflag").value + "/" + document.getElementById("zoompage-ssflag").value);
                menuItem.setAttribute("value",-13);
                menuItem.setAttribute("tooltip","zoompage-ftwzoomsitespec-tip");
                menuItem.addEventListener("click",zoomPage.onMenuItemClick,false);
                if (zoomPage.prefs.getIntPref("zoommode") == 3) menuItem.style.setProperty("font-weight","bold","");
            }
            
            if (zoomPage.osPlatform == "WINNT") { offsetX = 0; offsetY = 3; }
            else if (zoomPage.osPlatform == "Linux")  { offsetX = -2; offsetY = 0; }
            else if (zoomPage.osPlatform == "Darwin")  { offsetX = -1; offsetY = 4; }
            
            menuPopup.openPopup(document.getElementById("zoompage-zoommenupopup").lastChild,"end_after",offsetX,offsetY,false,false,null);
        }
    },
    
    onMenuItemClick: function(event)
    {
        var level,browser,optionsWindow;
        
        level = event.target.getAttribute("value");
        
        if (event.button == 0 || event.button == 1)  /* click or middle-click */
        {
            if (level >= 0)  /* percentage value */
            {
                browser = gBrowser.selectedBrowser;
                
                /* Set zoom value */
                
                ZoomManager.zoom = level/100;
                
                if (zoomPage.ffVersion >= +"24.0") FullZoom._applyZoomToPref(browser); else FullZoom._applySettingToPref();
                
                /* Set Default Zoom or Image Default Zoom level */
                
                if (event.ctrlKey || event.button == 1)  /* ctrl+click or middle-click */
                {
                    if (zoomPage.imagePage(browser))  /* image page */
                    {
                        zoomPage.prefs.setIntPref("imgdefaultlevel",level);  /* set image default zoom */
                    }
                    else  /* not image page */
                    {
                        zoomPage.prefs.setIntPref("defaultlevel",level);  /* set default zoom */
                        if (zoomPage.zoomMode == 0 || zoomPage.zoomMode == 2)  zoomPage.setSiteSpecific(null,level/100);  /* set global content preference */
                    }
                }
                
                zoomPage.setPercent(14);
            }
            else if (level == -1)  /* fit-to-width/window */
            {
                browser = gBrowser.selectedBrowser;
                
                if (zoomPage.imagePage(browser))  /* image page */
                {
                    zoomPage.fitToWindow(browser);  /* image - fit-to-window zoom */
                }
                else  /* not image page */
                {
                    if (zoomPage.specialPage(browser,true)) ;  /* special page - not fit-to-width zoom */
                    else zoomPage.fitToWidth(browser);  /* normal page - fit-to-width zoom */
                    
                    if (zoomPage.ffVersion >= +"24.0") FullZoom._applyZoomToPref(browser); else FullZoom._applySettingToPref();
                }
                
                zoomPage.setPercent(15);
            }
            else if (level == -2) /* options */
            {
                optionsWindow = zoomPage.winmed.getMostRecentWindow("zoompage-options");
                
                if (optionsWindow) optionsWindow.focus();
                else window.openDialog("chrome://zoompage/content/zoompage-options.xul","","chrome,dialog,modal,titlebar,centerscreen",null);
            }
            else if (level <= -10 && level >= -13) /* zoom modes */
            {
                zoomPage.prefs.setIntPref("zoommode",-level-10);  /* set zoom mode */
            }
            else if (level <= -20 && level >= -21) /* image zoom modes */
            {
                zoomPage.prefs.setIntPref("imagezoommode",-level-20);  /* set image zoom mode */
            }
        }
        
        if (event.button == 1) document.getElementById("zoompage-zoommenupopup").hidePopup();
    },
    
    onTabOpen: function(event)
    {
        var tab,browser;
        
        tab = event.target;
        
        browser = tab.linkedBrowser;
        
        /* Initialize resize timeout */
        
        browser.zoompage_resizeTimeout = null;
        
        /* Initialize previous uri and previous width */
        
        browser.zoompage_previousURI = "";  /* too soon to access browser.currentURI.spec - FF3.6 */
        browser.zoompage_previousWidth = 0;  /* too soon to access browser.contentWindow.innerWidth */
        browser.zoompage_previousHeight = 0;  /* too soon to access browser.contentWindow.innerHeight */
        
        /* Initialize last fit-to-width/window zoom values */
        
        browser.zoompage_lastFitToWidth = zoomPage.lastFitToWidth;
        browser.zoompage_lastFitToWindow = 1.0;
        
        /* Add listeners for browser */
        
        browser.addEventListener("pageshow",zoomPage.onPageShow,false);
        browser.addEventListener("hashchange",zoomPage.onHashChange,false);
        browser.addEventListener("resize",zoomPage.onBrowserResize,false);
        browser.addEventListener("DOMMouseScroll",zoomPage.onBrowserScroll,false);
        browser.addEventListener("click",zoomPage.onContentClick,false);
        
        window.setTimeout(
        function(browser,tab)
        {
			/* Initialize was pending flag */
			
			if (tab.hasAttribute("pending")) browser.zoompage_wasPending = true;
			else browser.zoompage_wasPending = false;
			
            /* Default Zoom - set zoom value for tab opened */
            
            if (zoomPage.zoomMode == 0)
            {
                ZoomManager.setZoomForBrowser(browser,zoomPage.prefs.getIntPref("defaultlevel")/100);
            }
            
            zoomPage.setPercent(21);
        }
        ,0,browser,tab);  /* delay required by Firefox 3.6 */
    },
    
    onPageShow: function(event)
    {
        var browser;
        
        browser = event.currentTarget;
        
        window.setTimeout(
        function(browser)
        {
            if (zoomPage.imagePage(browser))  /* image page */
            {
                /* Fit-To-Window Zoom - set zoom value for page loaded */
                
                if (zoomPage.imagezoomMode == 1) zoomPage.fitToWindow(browser);  /* image - fit-to-window zoom */
                
                else
                {
                    /* Default Zoom - set zoom value for page loaded */
                    
                    ZoomManager.setZoomForBrowser(browser,zoomPage.prefs.getIntPref("imgdefaultlevel")/100);
                }
                
                browser.zoompage_previousURI = browser.currentURI.spec;
                
                zoomPage.setPercent(22);
            }
            else  /* not image page */
            {
                zoomPage.getSiteSpecific(browser,
                function(browser,sitevalue)
                {
                    /* Site-Specific Zoom - set zoom value for page loaded or reloaded - already applied by onLocationChange() */
                    
                    /* Fit-To-Width Zoom or Fit-To-Width Zoom + Site-Specific Zoom (if site-specific not set) - set zoom value for different page loaded */
                    
                    if (zoomPage.zoomMode == 1 || (zoomPage.zoomMode == 3 && typeof sitevalue == "undefined"))
                    {
                        if (zoomPage.specialPage(browser,false)) ;  /* special page - not fit-to-width zoom */
                        else  /* normal page - fit-to-width zoom */
                        {
                            if (browser.currentURI.spec != browser.zoompage_previousURI)  /* ignore minor refreshes/updates which don't change uri */
                                zoomPage.fitToWidth(browser);
                        }
                    }
                    
                    /* Synchronize Firefox's Site-Specific Zoom global content preference */
                    
                    if (zoomPage.zoomMode == 1 || zoomPage.zoomMode == 3)
                    {
                        zoomPage.setSiteSpecific(null,browser.zoompage_lastFitToWidth);  /* set global content preference same as fit-to-width zoom */
                    }
                    else
                    {
                        zoomPage.setSiteSpecific(null,zoomPage.prefs.getIntPref("defaultlevel")/100);  /* set global content preference same as default zoom */
                    }
                    
                    browser.zoompage_previousURI = browser.currentURI.spec;
                    
                    zoomPage.setPercent(23);
                });
            }
        }
        ,0,browser);  /* delay required by Firefox 3.6 */
        
        if (browser.currentURI.spec.indexOf("#") != -1) zoomPage.onHashChange(event);
    },
    
    onHashChange: function(event)
    {
        var browser;
        
        browser = event.currentTarget;
        
        window.setTimeout(
        function(browser)
        {
            if (zoomPage.imagePage(browser))  /* image page */
            {
                browser.zoompage_previousURI = browser.currentURI.spec;
                
                zoomPage.setPercent(24);
            }
            else  /* not image page */
            {
                zoomPage.getSiteSpecific(browser,
                function(browser,sitevalue)
                {
                    /* Fit-To-Width Zoom or Fit-To-Width Zoom + Site-Specific Zoom (if site-specific not set) - set zoom value for URI hash changed */
                    
                    if (zoomPage.zoomMode == 1 || (zoomPage.zoomMode == 3 && typeof sitevalue == "undefined"))
                    {
                        if (zoomPage.specialPage(browser,false)) ;  /* special page - not fit-to-width zoom */
                        else zoomPage.fitToWidth(browser);  /* normal page - fit-to-width zoom */
                    }
                    
                    /* Fit-To-Width Zoom or Fit-To-Width Zoom + Site-Specific Zoom - update global content preference  */
                    
                    if (zoomPage.zoomMode == 1 || zoomPage.zoomMode == 3)
                    {
                        zoomPage.setSiteSpecific(null,browser.zoompage_lastFitToWidth);  /* set global content preference same as fit-to-width zoom */
                    }
                    
                    browser.zoompage_previousURI = browser.currentURI.spec;
                    
                    zoomPage.setPercent(25);
                });
            }
        }
        ,200,browser);  /* allow time for contents to update after URI hash changed */
    },
    
    onTabSelect: function(event)
    {
        var browser;
        
        browser = gBrowser.selectedBrowser;
        
        if (zoomPage.imagePage(browser))  /* image page */
        {
            /* Adjust zoom value for selected tab - in case zoom levels have been changed */
            
            if (ZoomManager.zoom < ZoomManager.MIN) ZoomManager.zoom = ZoomManager.MIN;
            else if (ZoomManager.zoom > ZoomManager.MAX) ZoomManager.zoom = ZoomManager.MAX;
            
            zoomPage.setPercent(26);
        }
        else  /* not image page */
        {
            zoomPage.getSiteSpecific(browser,
            function(browser,sitevalue)
            {
                /* Site-Specific Zoom - set zoom value for page loaded or reloaded - already applied by onLocationChange() */
                
                /* Adjust zoom value for selected tab - in case zoom levels have been changed */
                
                if (ZoomManager.zoom < ZoomManager.MIN) ZoomManager.zoom = ZoomManager.MIN;
                else if (ZoomManager.zoom > ZoomManager.MAX) ZoomManager.zoom = ZoomManager.MAX;
                
                /* Fit-To-Width Zoom + Site-Specific Zoom (if site-specific not set) - in case zoom mode has been changed */
                
                if (zoomPage.zoomMode == 3 && typeof sitevalue == "undefined")
                {
                    if (zoomPage.specialPage(browser,false)) ;  /* special page - not fit-to-width zoom */
                    else zoomPage.fitToWidth(browser);  /* normal page - fit-to-width zoom */
                }
                
                /* Site-Specific Zoom - update saved site-specific value */
                
                if (zoomPage.zoomMode == 2 || zoomPage.zoomMode == 3)
                {
                    if (typeof sitevalue != "undefined")
                    {
                        if (zoomPage.ffVersion >= +"24.0") FullZoom._applyZoomToPref(browser); else FullZoom._applySettingToPref();
                    }
                }
                
                /* Synchronize Firefox's Site-Specific Zoom global content preference */
                
                if (zoomPage.zoomMode == 1 || zoomPage.zoomMode == 3)
                {
                    zoomPage.setSiteSpecific(null,browser.zoompage_lastFitToWidth);  /* set global content preference same as fit-to-width zoom */
                }
                else
                {
                    zoomPage.setSiteSpecific(null,zoomPage.prefs.getIntPref("defaultlevel")/100);  /* set global content preference same as default zoom */
                }
                
                zoomPage.setPercent(27);
            });
        }
    },
    
    onContentClick: function(event)
    {
        var browser,imgLeft,imgTop,cursorX,cursorY,browserWidth,browserHeight,scrollX,scrollY;
        
        browser = gBrowser.selectedBrowser;
        
        /* Viewing image - alternate clicks on image restore to initial size or fit-to-window */
        
        if (event.button == 0 && event.target.localName == "img" && event.target.ownerDocument instanceof Ci.nsIImageDocument)
        {
            if (zoomPage.imagezoomMode == 0)
            {
                if (Math.round(ZoomManager.zoom*100) == zoomPage.prefs.getIntPref("imgdefaultlevel")) zoomPage.fitToWindow(browser);  /* image page - fit-to-window zoom */
                else  /* image page - default zoom */
                {
                    imgLeft = window.getComputedStyle(event.target,null).getPropertyValue("left");
                    imgTop = window.getComputedStyle(event.target,null).getPropertyValue("top");
                    
                    cursorX = event.clientX-imgLeft.substr(0,imgLeft.length-2)+browser.contentWindow.scrollX;
                    cursorY = event.clientY-imgTop.substr(0,imgTop.length-2)+browser.contentWindow.scrollY;
                    
                    ZoomManager.zoom = zoomPage.prefs.getIntPref("imgdefaultlevel")/100;
                    
                    if (browser.contentWindow.scrollMaxY > 0) browserWidth = (browser.boxObject.width-17)/(zoomPage.prefs.getIntPref("imgdefaultlevel")/100);
                    else browserWidth = browser.boxObject.width/(zoomPage.prefs.getIntPref("imgdefaultlevel")/100);
                    
                    if (browser.contentWindow.scrollMaxX > 0) browserHeight = (browser.boxObject.height-17)/(zoomPage.prefs.getIntPref("imgdefaultlevel")/100);
                    else browserHeight = browser.boxObject.height/(zoomPage.prefs.getIntPref("imgdefaultlevel")/100);
                    
                    scrollX = 0;
                    scrollY = 0;
                    
                    if (cursorX > browserWidth/2) scrollX = cursorX-browserWidth/2;
                    if (cursorY > browserHeight/2) scrollY = cursorY-browserHeight/2;
                    
                    browser.contentWindow.scrollTo(scrollX,scrollY); 
                }
            }
            else
            {
                if (Math.round(ZoomManager.zoom*100) == Math.round(browser.zoompage_lastFitToWindow*100))  /* image page - default zoom */
                {
                    imgLeft = window.getComputedStyle(event.target,null).getPropertyValue("left");
                    imgTop = window.getComputedStyle(event.target,null).getPropertyValue("top");
                    
                    cursorX = event.clientX-imgLeft.substr(0,imgLeft.length-2)+browser.contentWindow.scrollX;
                    cursorY = event.clientY-imgTop.substr(0,imgTop.length-2)+browser.contentWindow.scrollY;
                    
                    ZoomManager.zoom = zoomPage.prefs.getIntPref("imgdefaultlevel")/100;
                    
                    if (browser.contentWindow.scrollMaxY > 0) browserWidth = (browser.boxObject.width-17)/(zoomPage.prefs.getIntPref("imgdefaultlevel")/100);
                    else browserWidth = (browser.boxObject.width)/(zoomPage.prefs.getIntPref("imgdefaultlevel")/100);
                    
                    if (browser.contentWindow.scrollMaxX > 0) browserHeight = (browser.boxObject.height-17)/(zoomPage.prefs.getIntPref("imgdefaultlevel")/100);
                    else browserHeight = (browser.boxObject.height)/(zoomPage.prefs.getIntPref("imgdefaultlevel")/100);
                    
                    scrollX = 0;
                    scrollY = 0;
                    
                    if (cursorX > browserWidth/2) scrollX = cursorX-browserWidth/2;
                    if (cursorY > browserHeight/2) scrollY = cursorY-browserHeight/2;
                    
                    browser.contentWindow.scrollTo(scrollX,scrollY); 
                }
                else zoomPage.fitToWindow(browser);  /* image page - fit-to-window zoom */
            }
            
            zoomPage.setPercent(31);
        }
    },
    
    onBrowserResize: function(event)
    {
        var browser,timeout;
        
        browser = event.currentTarget;
        
        if (document.getElementById("main-window").hasAttribute("tiletabs-ffversion"))  /* Tile Tabs installed */
        {
            if (gBrowser.getNotificationBox(browser).style.getPropertyValue("visibility") == "hidden") return;
        }
        else  /* Tile Tabs not installed */
        {
            if (browser != gBrowser.selectedBrowser) return;
        }
        
		if (zoomPage.imagePage(browser))
		{
		    if (Math.round(ZoomManager.getZoomForBrowser(browser)*100) > zoomPage.prefs.getIntPref("imgfittowindowmin"))
			    browser.contentDocument.body.style.setProperty("overflow","hidden","");
		}
        
        // if (browser.zoompage_resizeTimeout != null) return;  /* to update zoom during resize */
        if (browser.zoompage_resizeTimeout != null) window.clearTimeout(browser.zoompage_resizeTimeout);  /* to update zoom at end of resize */
        
        if (zoomPage.imagePage(browser)) timeout = 10; else timeout= 100;
        
        browser.zoompage_resizeTimeout = window.setTimeout(
        function(browser)
        {
            var width,height;
            
            if (zoomPage.imagePage(browser))  /* image page */
            {
                width = browser.boxObject.width;
                height = browser.boxObject.height;
                
                /* Fit-To-Window - set zoom value for browser window resized */
                
                if (zoomPage.imagezoomMode == 1)
                {
                    if (width != browser.zoompage_previousWidth || height != browser.zoompage_previousHeight)  /* ignore resizes that don't change browser window size */
                        zoomPage.fitToWindow(browser);  /* image - fit-to-window zoom */
                }
                
                browser.zoompage_previousWidth = width;
                browser.zoompage_previousHeight = height;
                browser.zoompage_resizeTimeout = null;
                
                if (zoomPage.imagePage(browser)) browser.contentDocument.body.style.removeProperty("overflow");
                
                if (zoomPage.imagePage(browser)) zoomPage.setImageCursor(browser);  /* Default Zoom - resize does not zoom image so have to update cursor here */
                
                zoomPage.setPercent(32);
            }
            else  /* not image page */
            {
                zoomPage.getSiteSpecific(browser,
                function(browser,sitevalue)
                {
                    var width,height;
                    
                    width = browser.boxObject.width;
                    height = browser.boxObject.height;
                    
                    /* Fit-To-Width Zoom or Fit-To-Width Zoom + Site-Specific Zoom (if site-specific not set) - set zoom value for browser window resized */
                    
                    if (zoomPage.zoomMode == 1 || (zoomPage.zoomMode == 3 && typeof sitevalue == "undefined"))
                    {
                        if (zoomPage.specialPage(browser,false)) ;  /* special page - not fit-to-width zoom */
                        else  /* normal page - fit-to-width zoom */
                        {
                            if (width != browser.zoompage_previousWidth)  /* ignore resizes that don't change browser window width */
                            {
                                if (!browser.zoompage_wasPending) zoomPage.fitToWidth(browser);  /* ignore first resize after selecting pending tab */
                                browser.zoompage_wasPending = false;
                            }
                        }
                    }
                    
                    browser.zoompage_previousWidth = width;
                    browser.zoompage_previousHeight = height;
                    browser.zoompage_resizeTimeout = null;
                    
                    if (zoomPage.imagePage(browser)) browser.contentDocument.body.style.removeProperty("overflow");
                    
                    if (zoomPage.imagePage(browser)) zoomPage.setImageCursor(browser);  /* Default Zoom - resize does not zoom image so have to update cursor here */
                    
                    zoomPage.setPercent(33);
                });
            }
        }
        ,timeout,browser);
    },
    
    onBrowserScroll: function(event)
    {
        var browser,action;
        
        browser = event.currentTarget;
        
        if (event.ctrlKey)
        {
            if (zoomPage.ffVersion >= +"17.0") action = zoomPage.otherPrefs.getIntPref("mousewheel.with_control.action");
            else action = zoomPage.otherPrefs.getIntPref("mousewheel.withcontrolkey.action");
            
            if (action == 3)
            {
                if (event.detail < 0) FullZoom.enlarge(); else FullZoom.reduce();
            }
            
            event.stopPropagation();
            event.preventDefault();
            
            zoomPage.setPercent(34);
        }
    },
    
    onReloadClick: function(event)
    {
        var browser;
        
        browser = gBrowser.selectedBrowser;
        
        zoomPage.getSiteSpecific(browser,
        function(browser,sitevalue)
        {
            /* Fit-To-Width Zoom or Fit-To-Width Zoom + Site-Specific Zoom (if site-specific not set) - set zoom value for page manually reloaded */
            
            if (zoomPage.zoomMode == 1 || (zoomPage.zoomMode == 3 && typeof sitevalue == "undefined"))
            {
                browser.zoompage_previousURI = "";
            }
        });
    },
    
    onReloadAllClick: function(event)
    {
        var i,browser;
        
        for (i = 0; i < gBrowser.tabContainer.childNodes.length; i++)
        {
            browser = gBrowser.tabContainer.childNodes[i].linkedBrowser;
            
            zoomPage.getSiteSpecific(browser,
            function(browser,sitevalue)
            {
                /* Fit-To-Width Zoom or Fit-To-Width Zoom + Site-Specific Zoom (if site-specific not set) - set zoom value for page manually reloaded */
                
                if (zoomPage.zoomMode == 1 || (zoomPage.zoomMode == 3 && typeof sitevalue == "undefined"))
                {
                    browser.zoompage_previousURI = "";
                }
            });
        }
    },
    
    onWindowKeyPress: function(event)
    {
        var browser;
        
        browser = gBrowser.selectedBrowser;
        
        zoomPage.getSiteSpecific(browser,
        function(browser,sitevalue)
        {
            /* Fit-To-Width Zoom or Fit-To-Width Zoom + Site-Specific Zoom (if site-specific not set) - set zoom value for page manually reloaded */
            
            if (zoomPage.zoomMode == 1 || (zoomPage.zoomMode == 3 && typeof sitevalue == "undefined"))
            {
                if ((event.keyCode == event.DOM_VK_F5))
                {
                    browser.zoompage_previousURI = "";
                }
                else if ((event.charCode == "r".charCodeAt(0) || event.charCode == "R".charCodeAt(0)) && (event.ctrlKey || event.metaKey))
                {
                    browser.zoompage_previousURI = "";
                }
            }
        });
        
        /* Fit-To-Width or Default-% Shortcut - manual fit-to-width or default-% shortcut */
        
        if (event.charCode == "'".charCodeAt(0) && (event.ctrlKey || event.metaKey))
        {
            if (zoomPage.imagePage(browser))  /* image page */
            {
                if (zoomPage.imagezoomMode == 0) zoomPage.fitToWindow(browser);  /* image - fit-to-window zoom */
                else ZoomManager.zoom = zoomPage.prefs.getIntPref("imgdefaultlevel")/100;
            }
            else  /* not image page */
            {
                if (zoomPage.zoomMode == 0 || zoomPage.zoomMode == 2)
                {
                    if (zoomPage.specialPage(browser,true)) ;  /* special page - not fit-to-width zoom */
                    else zoomPage.fitToWidth(browser);  /* normal page - fit-to-width zoom */
                }
                else ZoomManager.zoom = zoomPage.prefs.getIntPref("defaultlevel")/100;
                
                if (zoomPage.ffVersion >= +"24.0") FullZoom._applyZoomToPref(browser); else FullZoom._applySettingToPref();
            }
            
            event.preventDefault();
            event.stopPropagation();
            
            zoomPage.setPercent(35);
        }
    },
    
    onButtonDrop: function(event)  /* Firefox 4.0-28.0 */
    {
        zoomPage.setPercent(36);
        
        if (document.getElementById("reload-button") != null) document.getElementById("reload-button").addEventListener("click",zoomPage.onReloadClick,false);
    },

    onPanelUIPopupShowing: function(event)  /* Firefox 29.0+ */
    {
        zoomPage.setPercent(37);
    },
    
    onOverflowPopupShowing: function(event)  /* Firefox 29.0+ */
    {
        zoomPage.setPercent(38);
    },
    
    /********************************************************************/
    
    /* Debug function */
    
    debugMessage: function(module,information)
    {
        var info;
        
        zoomPage.debugCount++;
        info = document.getElementById("zoompage-debug-info");
        info.textContent = zoomPage.debugCount + " - " + module + " - " + information;
    }
};

/************************************************************************/

/* Start Zoom Page */

window.addEventListener("load",zoomPage.onLoad,false);
window.addEventListener("unload",zoomPage.onUnload,false);

/************************************************************************/
