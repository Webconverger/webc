FoxSaver.contextMenu = function(B) {
    var A = this;
    this.id = B;
    this.skipContext = !Components.interfaces.nsIEventQueueService;
    this._lookupMethod = this.lookupMethod();
    this.menuItem = document.getElementById(B);
    this.sepItem = document.getElementById("fsimgsep");
    this.sepItem.hidden = true;
    if (this.menuItem) this.menuItem.hidden = true;
    this.href = null
};
FoxSaver.contextMenu.prototype.isMenuShown = function() {
    return(this.menuItem && !this.menuItem.hidden)
};
FoxSaver.contextMenu.prototype.lookupMethod = function() {
    if (Components.utils && Components.utils.lookupMethod) {
        return Components.utils.lookupMethod
    }
    return Components.lookupMethod
};
FoxSaver.contextMenu.prototype.prepareContextMenu = function(A) {
    var B = this;
    if (this.skipContext) {
        this.skipContext = false;
        window.setTimeout(function() {
            B.prepareContextMenu(A)
        }, 10);
        return
    }
    var C = this.isValidLink();
    if (C) {
        if (this.menuItem) this.menuItem.hidden = false;
        this.sepItem.hidden = false
    } else {
        if (this.menuItem) this.menuItem.hidden = true;
        this.sepItem.hidden = true
    }
};
FoxSaver.contextMenu.prototype.checkLink = function(A) {
    return A.href && /^[a-z]+:\/\/.*/i.test(A.href) && !/^(javascript|mailto|news|file|data):/i.test(A.href)
};
FoxSaver.contextMenu.prototype._wrapAnchor = function(C, E) {
    var A = (C instanceof HTMLAnchorElement);
    var D = (C instanceof HTMLAreaElement);
    if (A || D) {
        var B = E(C, "href")();
        if (B) {
            return{href: B, tagName: "A", getElementsByTagName: E(C, "getElementsByTagName"), description: A ? (d = E(C, "title")()) && d.replace(/\s+/g, " ") || (d = E(C, "innerHTML")()) && d.replace(/\s+/g, " ").replace(/<.*?>/g, "") : (d = (E(C, "alt")() || E(C, "title")())) && d.replace(/\s+/g, " ")}
        }
    }
    return null
};
FoxSaver.contextMenu.prototype.findLinkAsc = function(B) {
    var C = this._lookupMethod;
    var A;
    while (B) {
        A = this._wrapAnchor(B, C);
        if (A) {
            return this.checkLink(A) ? A : null
        }
        B = C(B, "parentNode")()
    }
    return null
};
FoxSaver.contextMenu.prototype.isValidLink = function(A) {
    return this.findLinkAsc(document.popupNode)
};
FoxSaver.contextMenu.prototype.onClick = function() {
    FoxSaver.fs.stop();
    FoxSaver.log("rss ref: " + this.href);
    FoxSaver.imageManager.setTempSource(FoxSaver.Rss.source(this.href));
    FoxSaver.fs.start()
}