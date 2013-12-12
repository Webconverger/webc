FoxSaver.Iframe = function() {
    this.busy = false;
    var A = gBrowser.getBrowserForTab(FoxSaver.hiddenTab.tab);
    var C = A.contentDocument;
    this.iframe = C.createElement("iframe");
    this.iframe.style.height = "2000px";
    this.iframe.style.width = "4000px";
    C.body.appendChild(this.iframe);
    var B = this;
    this.iframe.addEventListener("load", function() {
        var D = B.cont;
        B.cont = function() {
        };
        D()
    }, true);
    this.iframe.addEventListener("error", function() {
        FoxSaver.log("iframe error");
        var D = B.abort;
        B.abort = function() {
        };
        D()
    }, true)
};
FoxSaver.Iframe.prototype.getImage = function() {
    return this.iframe.contentDocument.images[0]
};
FoxSaver.Iframe.prototype.cont = function() {
};
FoxSaver.Iframe.prototype.abort = function() {
};
FoxSaver.Iframe.prototype.loadSrc = function(C, A, D) {
    var B = this;
    this.busy = true;
    this.cont = A;
    this.abort = D;
    if (this.iframe.src) {
        FoxSaver.Util.doom(this.iframe.src)
    }
    this.iframe.setAttribute("src", C);
    FoxSaver.Util.doNotCache(C)
};
FoxSaver.Iframe.prototype.isBusy = function() {
    return this.busy
};
FoxSaver.Iframe.prototype.free = function() {
    this.cont = function() {
    };
    this.abort = function() {
    };
    this.busy = false
};
FoxSaver.Iframe.prototype.loadImage = function(B, A, C) {
    this.busy = true;
    A()
}