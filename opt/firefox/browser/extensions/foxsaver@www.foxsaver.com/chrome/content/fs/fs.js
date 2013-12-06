FoxSaver.clearGlobalVariable = function() {
    FoxSaver.expanded = false;
    FoxSaver.slideshowContent = null;
    FoxSaver.slideshowDocument = null;
    FoxSaver.urlbar = null;
    FoxSaver.slideImageElem = null;
    FoxSaver.slideCanvasElem = null;
    FoxSaver.slideShowState = "stop";
    if (FoxSaver.toolbar) {
        FoxSaver.toolbar.stop();
        FoxSaver.toolbar = null
    }
};
FoxSaver.initialDocument = function() {
    FoxSaver.slideshowContent = window.content;
    FoxSaver.slideshowDocument = FoxSaver.slideshowContent.document;
    if (!FoxSaver.slideshowDocument) {
        return
    }
    FoxSaver.slideImageElem = FoxSaver.slideshowDocument.getElementById("slideshowImage");
    FoxSaver.slideCanvasElem = FoxSaver.slideshowDocument.getElementById("mycanvas");
    if (!FoxSaver.slideImageElem || !FoxSaver.slideCanvasElem) {
        return
    }
    FoxSaver.slideCanvasElem.title = FoxSaver.Util.getLocalStr("exitFoxSaverMsg");
    FoxSaver.ctx = null;
    if (FoxSaver.slideCanvasElem) {
        FoxSaver.ctx = FoxSaver.slideCanvasElem.getContext("2d")
    }
    var A = document.getElementById("nav-bar");
    if (A) {
        A.setAttribute("fullscreentoolbar", "false")
    }
    FoxSaver.slideshowDocument.title = "FoxSaver: Top Selected Images";
    FoxSaver.urlbar = document.getElementById("urlbar");
    if (FoxSaver.urlbar) {
        FoxSaver.urlbar.value = FoxSaver.slideshowDocument.title
    }
    if (!FoxSaver.preference.getDisplayFoxSaverLogo()) {
        FoxSaver.slideshowDocument.getElementById("foxsaver_logo").style.display = "none"
    }
    window.content.status = "";
    FoxSaver.toolbar = new FoxSaver.Page.Toolbar(FoxSaver.slideshowDocument, "menubar");
    FoxSaver.imgNumber = new FoxSaver.Page.ImgNumber(FoxSaver.slideshowDocument);
    if (!FoxSaver.preference.isStopToolTipDisabled()) {
        FoxSaver.exitToolTip = new FoxSaver.Page.ExitToolTip(FoxSaver.slideshowDocument, "foxsaver_exit_tool_tip")
    }
};
FoxSaver.FS = function() {
    var A = this;
    FoxSaver.clearGlobalVariable();
    this.iMins = FoxSaver.preference.getIdleMinutes() > 0 ? FoxSaver.preference.getIdleMinutes() : 3;
    this.controller = new FoxSaver.Util.Idle({waitTime: 60 * 1000, breakEvents: ["click", "mousemove", "DOMMouseScroll", "keydown"], work: function() {
            if (FoxSaver.preference.isUserWebPageEnabled()) {
                A.startHtmlPage()
            } else {
                A.start()
            }
        }, onInterruption: function(B) {
            if (this.state == "on") {
                A.idle()
            }
        }, workingPermit: function() {
            A.idleSteps--;
            if (A.iMins != FoxSaver.preference.getIdleMinutes()) {
                A.setIMins(FoxSaver.preference.getIdleMinutes())
            }
            FoxSaver.log(A.idleSteps);
            return A.idleSteps <= 0 && !FoxSaver.Util.hasOtherWindows() && !FoxSaver.Util.isNoActionOnCurrentPage()
        }});
    this.exemptionIds = ["foxsaver_statusbar_icon", "foxsaver_statusbar_menu_start", "foxsaver_statusbar_menu_start_ordered", "foxsaver_statusbar_menu_toggle", "foxsaver_statusbar_menu_idle_minutes", "foxsaver_statusbar_menu_choose_directory", "foxsaver_statusbar_menu_options", "foxsaver_statusbar_menu_about"];
    this.setupWorkingInterruption();
    this.state = "off"
};
FoxSaver.FS.prototype.exempted = function(A) {
    return FoxSaver.Util.arrayContains(this.exemptionIds, A)
};
FoxSaver.FS.prototype.setupWorkingInterruption = function() {
    var B = this;
    var A = ["click", "keydown", "mousemove"];
    A.map(function(C) {
        FoxSaver.YUI.util.Event.on(window, C, function(D) {
            if (B.state == "working") {
                if (!B.exempted(D.target.id)) {
                    B.onWorkInterruption(D)
                }
            }
        }, true)
    })
};
FoxSaver.FS.prototype.setIMins = function(A) {
    this.iMins = A;
    this.idleSteps = A
};
FoxSaver.FS.prototype.onWorkInterruption = function(A) {
    switch (A.type) {
        case"keydown":
            switch (A.keyCode) {
                case 33:
                case 38:
                    FoxSaver.prevButton.onClick();
                    break;
                case 32:
                case 34:
                case 40:
                    FoxSaver.nextButton.onClick();
                    break;
                case 122:
                    break;
                default:
                    this.stop()
            }
            break;
        case"click":
            if (FoxSaver.Util.isRightClick(A)) {
                this.stop()
            }
            break;
        case"mousemove":
            if (FoxSaver.preference.isStopFoxSaverByMouseMove()) {
                this.stop()
            }
            break;
        case"pageshow":
            FoxSaver.log(A.target);
            if (A.target instanceof ImageDocument) {
                FoxSaver.log("e is foxsaver page.")
            } else {
                this.stop()
            }
            break;
        default:
            this.stop()
        }
};
FoxSaver.FS.prototype.idle = function() {
    this.state = "idling";
    this.idleSteps = this.iMins;
    this.controller.idle()
};
FoxSaver.FS.prototype.stop = function() {
    if (this.state == "off") {
        return
    }
    FoxSaver.eventManager.fire("FoxSaver.Stop");
    this.state = "off";
    FoxSaver.clearGlobalVariable();
    FoxSaver.imageManager.stop();
    FoxSaver.tab.close();
    window.content.status = "";
    if (this.action) {
        this.action.stop()
    }
    if (FoxSaver.preference.isFoxSaverEnabled()) {
        this.idle()
    } else {
        this.controller.stop()
    }
};
FoxSaver.FS.prototype.openOptionsDialog = function(A) {
    window.openDialog("chrome://foxsaver/content/options.xul", "foxsaver_options", "chrome,modal=yes,centerscreen,dialog=yes,resizable=yes")
};
FoxSaver.FS.prototype.openLoginDialog = function(C) {
    var B = window.document.getElementById("foxsaver_statusbar_menu_login");
    if (FoxSaver.loginStatus.login) {
        FoxSaver.Util.setLoginStatus(false, "", "");
        B.label = FoxSaver.Util.getLoginStatus(FoxSaver.loginStatus);
        var A = {success: function(D) {
            }, failure: function(D) {
            }};
        FoxSaver.YUI.util.Connect.asyncRequest("GET", "http://www.foxsaver.com/account/logout", A)
    } else {
        window.openDialog("chrome://foxsaver/content/login.xul", "foxsaver_options", "chrome,modal=yes,centerscreen,dialog=yes,resizable=yes", FoxSaver.loginStatus, B)
    }
};
FoxSaver.FS.prototype.onStatusBarIconClick = function(A) {
    if (!A || A.button != 0) {
        return
    }
    this.toggle(A)
};
FoxSaver.FS.prototype.toggle = function(A) {
    if (!FoxSaver.Util.toggleAllButtons()) {
        this.stop()
    } else {
        if (this.state == "off") {
            this.idle()
        }
    }
};
FoxSaver.FS.prototype.startHtmlPage = function() {
    var A = FoxSaver.preference.getUserWebPageUrl();
    FoxSaver.Util.openHTMLpageInNewTab(A);
    this.idle()
};
FoxSaver.FS.prototype.start = function(A) {
    var B = this;
    FoxSaver.eventManager.fire("FoxSaver.Start");
    if (A == null) {
        A = false
    }
    if (this.state == "working") {
        return
    }
    this.controller.stop();
    FoxSaver.tab.open(function() {
        FoxSaver.imageManager.load(function() {
            B.state = "working";
            B.action = new FoxSaver.Action();
            B.action.start(A)
        })
    })
};
FoxSaver.FS.prototype.restart = function(A) {
    if (A == null) {
        A = false
    }
    this.action = new FoxSaver.Action();
    this.action.start(A)
}