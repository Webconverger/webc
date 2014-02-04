/************************************************************************/
/*                                                                      */
/*      Zoom Page  -  Firefox Extension  -  Customize Toolbar Window    */
/*                                                                      */
/*      Javascript for Customize Toolbar overlay                        */
/*                                                                      */
/*      Copyright (C) 2009-2014  by  DW-dev                             */
/*                                                                      */
/*      Last Edit  -  21 Jan 2014                                       */
/*                                                                      */
/************************************************************************/

"use strict";

var zoomPageCustomizeToolbar =
{
    /********************************************************************/
    
    /* Shared variables */
    
    prefs: Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch),
	
    /********************************************************************/
    
    /* Load and Unload functions */
    
    onLoad: function()
    {
        var colors = new Array();
        
        /* Add listener for button added to toolbar */
        
        document.getElementById("palette-box").addEventListener("drop",zoomPageCustomizeToolbar.onButtonDrop,false);
        
        /* Adjust button icons for dark theme */
        
        colors =  window.getComputedStyle(document.getElementById("CustomizeToolbarWindow"),null).
                  getPropertyValue("color").match(/rgb\((\d+),\s(\d+),\s(\d+)\)/);
        
        if (Number(colors[1])+Number(colors[2])+Number(colors[3]) >= 0x80+0x80+0x80)  /* light text means dark theme */
            document.getElementById("CustomizeToolbarWindow").setAttribute("zoompage-darktheme","");
            
        /* Set percent to 100% without decoration */
        
        if (document.getElementById("zoompage-item") != null)  /* button in Customize window */
        {
            document.getElementById("zoompage-percent-label-n").setAttribute("value","100%");
            document.getElementById("zoompage-percent-label-n").style.removeProperty("font-style");
            document.getElementById("zoompage-percent-label-n").style.removeProperty("color");
            document.getElementById("zoompage-percent-label-n").style.removeProperty("outline");
            document.getElementById("zoompage-percent-label-n").style.removeProperty("outline-offset");
        }
    },
    
    onUnload: function()
    {
    },
    
    /********************************************************************/
    
    /* Event handlers */
    
    onButtonDrop: function(event)
    {
        /* Set percent to 100% without decoration */
        
        if (document.getElementById("zoompage-item") != null)  /* button in Customize window */
        {
            document.getElementById("zoompage-percent-label-n").setAttribute("value","100%");
            document.getElementById("zoompage-percent-label-n").style.removeProperty("font-style");
            document.getElementById("zoompage-percent-label-n").style.removeProperty("color");
            document.getElementById("zoompage-percent-label-n").style.removeProperty("outline");
            document.getElementById("zoompage-percent-label-n").style.removeProperty("outline-offset");
        }
    }
};

/************************************************************************/

/* Start Zoom Page Customize Toolbar */

window.addEventListener("load",zoomPageCustomizeToolbar.onLoad,false);

/************************************************************************/
