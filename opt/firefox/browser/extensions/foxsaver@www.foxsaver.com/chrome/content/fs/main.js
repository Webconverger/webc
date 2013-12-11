FoxSaver.main = function() {
    FoxSaver.loginmessage = "";
    FoxSaver.preference.init();
    FoxSaver.fs = new FoxSaver.FS();
    FoxSaver.tab = new FoxSaver.Tab();
    FoxSaver.hiddenTab = new FoxSaver.HiddenTab();
    FoxSaver.cache = new FoxSaver.Cache();
    FoxSaver.Util.clearAllCacheEntries(true);
    FoxSaver.Util.clearFSLocalFolder();
    FoxSaver.setupSubmitImgWidget = null;
    FoxSaver.loginStatus = {"login": false, "uname": "", "pwd": ""};
    FoxSaver.today = null;
    FoxSaver.myWebListner = new FoxSaver.UrlDownloader();
    gBrowser.addProgressListener(FoxSaver.myWebListner);
    FoxSaver.iframeManager = new FoxSaver.Util.ResourceManager();
    FoxSaver.iframeManager.newResource = function() {
        var B = new FoxSaver.Iframe();
        return B
    };
    FoxSaver.canvasManager = new FoxSaver.Util.ResourceManager();
    FoxSaver.canvasManager.newResource = function() {
        return new FoxSaver.Page.Canvas(FoxSaver.slideshowDocument)
    };
    FoxSaver.imageManager = new FoxSaver.ImageManager();
    if (FoxSaver.preference.isFoxSaverEnabled()) {
        FoxSaver.fs.idle()
    }
    FoxSaver.ctxmenuctr = new FoxSaver.contextMenuControler();
    var A = window.document.getElementById("appcontent");
    if (A && !A.foxsaverit) {
        A.foxsaverit = true;
        A.addEventListener("DOMContentLoaded", FoxSaver.my_wnd_onload, false)
    }
    FoxSaver.Util.getLoginStatus(FoxSaver.loginStatus)
};
FoxSaver.my_wnd_unload = function() {
};
FoxSaver.my_wnd_onload = function(A) {
    var D = A.originalTarget;
    if (!D || !D.defaultView || !D.body || D.contentType != "text/html") {
        return
    }
    if (D.defaultView.wrappedJSObject.foxsavernullfunction) {
        return
    }
    if (!D.location || !D.location.href || D.location.href.indexOf("chrome://") >= 0) {
        return
    }
    if (FoxSaver.preference.isSearchPageImageEnabled()) {
        FoxSaver.searchPageImage = new FoxSaver.SearchPageImage(D);
        FoxSaver.searchPageImage.render()
    }
    if (!D.images || D.images.length < 1) {
        return
    }
    if (FoxSaver.preference.isAutoPlayByFoxSaverButtonEnabled() && D.images.length > 2) {
        FoxSaver.appendDepentJS2Body(D);
        var C = new FoxSaver.PlayInPage(D);
        C.show()
    }
    var B = new FoxSaver.FoxSaverItBtn(D);
    B.init()
};
FoxSaver.appendDepentJS2Body = function(D) {
    var A = ["chrome://foxsaver/content/util/name_space.js", "chrome://foxsaver/content/yui/yahoo.js", "chrome://foxsaver/content/yui/dom.js", "chrome://foxsaver/content/yui/event.js", "chrome://foxsaver/content/yui/animation.js", "chrome://foxsaver/content/yui/dragdrop.js"];
    if (!D.body) {
        return
    }
    var E = D.getElementsByTagName("head")[0];
    for (var B = 0; B < A.length; B++) {
        var C = D.createElement("script");
        C.type = "text/javascript";
        C.src = A[B];
        if (E) {
            E.appendChild(C)
        } else {
            D.body.appendChild(C)
        }
    }
};
window.addEventListener("load", function() {
    window.setTimeout(FoxSaver.main, 500)
}, false)