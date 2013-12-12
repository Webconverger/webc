FoxSaver.HiddenTab = function() {
    this.tab = null
};
FoxSaver.HiddenTab.prototype.open = function() {
    if (!this.tab) {
        var A = "chrome://foxsaver/content/tab_src.html";
        this.tab = gBrowser.addTab(A);
        FoxSaver.Util.doNotCache(A)
    }
    this.tab.style.display = "none"
};
FoxSaver.HiddenTab.prototype.close = function() {
    try {
        if (this.tab) {
            var A = this.tab;
            this.tab = null;
            try {
                gBrowser.removeTab(A)
            } catch (B) {
                FoxSaver.log("FoxSaver.HiddenTab.prototype.close gBrowser.removeTab:" + B)
            }
        }
        FoxSaver.iframeManager.clear()
    } catch (B) {
        FoxSaver.log("FoxSaver.HiddenTab.prototype.close:" + B)
    }
}