FoxSaver.ImageTab = function(B) {
    this.busy = false;
    this.tab = gBrowser.addTab("chrome://foxsaver/content/tab_src.html");
    this.tab.style.display = "none";
    this.browser = gBrowser.getBrowserForTab(this.tab);
    var A = this;
    this.browser.addEventListener("load", function() {
        A.iframe = A.browser.contentDocument.getElementById("img_holder");
        A.iframe.addEventListener("load", A.cont, true);
        A.iframe.addEventListener("error", A.abort, true)
    }, true)
};
FoxSaver.ImageTab.prototype.cont = function() {
};
FoxSaver.ImageTab.prototype.abort = function() {
};
FoxSaver.ImageTab.prototype.open = function(C, A, D) {
    var B = this;
    this.cont = A;
    this.abort = D;
    this.iframe.src = C;
    this.busy = true
};
FoxSaver.ImageTab.prototype.close = function() {
    if (this.tab) {
        this.cont = function() {
        };
        this.abort = function() {
        };
        gBrowser.removeTab(this.tab);
        this.tab = null
    }
};
FoxSaver.ImageTab.prototype.free = function() {
    this.busy = false
};
FoxSaver.ImageTab.prototype.stop = function() {
    this.close();
    this.busy = false
};
FoxSaver.ImageTab.prototype.isBusy = function() {
    return this.busy
}