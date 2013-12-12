FoxSaver.Tab = function(A) {
    this.url = A;
    this.tab = null;
    this.oldSelTab = null;
    this.savedScreenInfo = {};
    this.controller = new FoxSaver.Util.Idle({waitTime: 100, breakEvents: [], work: null, onInterruption: function(C) {
        }, exemptionIds: [], workingPermit: function() {
        }});
    var B = this;
    FoxSaver.YUI.util.Event.on(window, "click", function(C) {
        if (B.isSelectedTabChanged()) {
            FoxSaver.fs.stop()
        }
    }, true)
};
FoxSaver.Tab.prototype.open = function(A) {
    var B = this;
    this.oldSelTab = gBrowser.selectedTab;
    FoxSaver.hiddenTab.open();
    if (B.tab) {
        gBrowser.selectedTab = B.tab
    } else {
        B.tab = FoxSaver.Util.newTab()
    }
    var D = function() {
        if (B.isSelectedTabChanged()) {
            FoxSaver.myWebListner.setLocationChangeHanler(function() {
            });
            FoxSaver.fs.stop()
        }
    };
    FoxSaver.myWebListner.setLocationChangeHanler(D);
    if (FoxSaver.preference.isAutoFullScreen() && FoxSaver.Util.isFullScreenOK(window)) {
        try {
            FoxSaver.log("Automatically expanding...");
            FoxSaver.Util.expendToFullerScreen(B.savedScreenInfo);
            FoxSaver.expanded = true
        } catch (C) {
            FoxSaver.log("Exception:" + C)
        }
    }
    B.documentReady(A)
};
FoxSaver.Tab.prototype.documentReady = function(A) {
    var C = this;
    this.controller.work = function() {
        if (FoxSaver.slideCanvasElem) {
            A()
        } else {
            FoxSaver.fs.stop();
            C.close()
        }
    };
    var B = 100;
    this.controller.workingPermit = function() {
        FoxSaver.initialDocument();
        B--;
        return(FoxSaver.slideCanvasElem || B < 0)
    };
    this.controller.idle()
};
FoxSaver.Tab.prototype.close = function() {
    try {
        FoxSaver.hiddenTab.close();
        if (this.tab) {
            this.controller.stop();
            FoxSaver.Util.collapseFullerScreen(this.savedScreenInfo);
            this.savedScreenInfo = {};
            gBrowser.removeTab(this.tab);
            if (this.oldSelTab && this.oldSelTab != gBrowser.selectedTab) {
                gBrowser.selectedTab = this.oldSelTab
            }
            this.tab = null;
            FoxSaver.canvasManager.clear()
        }
    } catch (A) {
        FoxSaver.log("FoxSaver.Tab.prototype.close:" + A)
    }
};
FoxSaver.Tab.prototype.isSelectedTabChanged = function() {
    var A = this;
    if (A.tab && gBrowser.selectedTab != A.tab) {
        return true
    }
    return false
}