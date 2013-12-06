FoxSaver.DefaultMenu = function() {
    this.myClass = FoxSaver.DefaultMenu;
    this.src = "";
    this.alt = "";
    this.cursite = "";
    this.myClass.superclass.constructor.call(this, "fs_play_in_page_photo");
    this.url = "";
    this.images = null;
    this.showPlayCurPageMenu = false
};
FoxSaver.YUI.lang.extend(FoxSaver.DefaultMenu, FoxSaver.contextMenu);
FoxSaver.DefaultMenu.prototype.isValidLink = function() {
    this.showPlayCurPageMenu = false;
    if (!document.popupNode) {
        return
    }
    var C = document.popupNode;
    var A = (C instanceof HTMLAnchorElement);
    var B = (C instanceof HTMLHtmlElement);
    if (A) {
        return false
    } else {
        if (!B) {
            this.checkCurrentPage()
        }
    }
    return true
};
FoxSaver.DefaultMenu.prototype._extractImages = function(D) {
    if (!D) {
        return
    }
    var B = this;
    var A = D.body;
    var C = FoxSaver.Util.mapDom(A, function(F) {
        if (!F || !F.tagName) {
            return
        }
        switch (F.tagName) {
            case"FRAME":
            case"IFRAME":
                var E = F.contentDocument;
                B._extractImages(E);
                break;
            case"IMG":
                if (FoxSaver.Util.isBigPicture(F)) {
                    B.images.push(F)
                }
                break;
            case"A":
                break;
            default:
            }
    })
};
FoxSaver.DefaultMenu.prototype.extractImages = function() {
    var A = gBrowser.getBrowserForTab(gBrowser.selectedTab);
    var B = A.contentDocument;
    this.images = new Array();
    this._extractImages(B)
};
FoxSaver.DefaultMenu.prototype.checkCurrentPage = function() {
    var A = window.content.document.location.href;
    if (!A) {
        return
    }
    if (this.url != A) {
        this.extractImages()
    }
    if (this.images == null || this.images.length < 1) {
        return
    }
    this.showPlayCurPageMenu = true
};
FoxSaver.DefaultMenu.prototype.log = function() {
    for (var A = 0; A < this.images.length; A++) {
        FoxSaver.log(this.images[A].src)
    }
};
FoxSaver.DefaultMenu.prototype.onClick = function(A) {
    if (this.showPlayCurPageMenu) {
        this.log();
        var B = new FoxSaver.ElSource(this.images);
        FoxSaver.imageManager.setTempSource(B);
        FoxSaver.fs.start(true)
    } else {
    }
}