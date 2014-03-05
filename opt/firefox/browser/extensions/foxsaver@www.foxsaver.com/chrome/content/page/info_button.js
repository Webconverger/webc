FoxSaver.Page.InfoButton = function(A) {
    this.myClass = FoxSaver.Page.InfoButton;
    this.myClass.superclass.constructor.call(this, A, "foxsaverinfo", FoxSaver.Util.localize("buttonInfo"))
};
FoxSaver.YUI.lang.extend(FoxSaver.Page.InfoButton, FoxSaver.Page.ToolbarButton);
FoxSaver.Page.InfoButton.prototype.onClick = function() {
    FoxSaver.fs.stop();
    FoxSaver.Util.newTab(this.url())
};
FoxSaver.Page.InfoButton.prototype.url = function() {
    return this._url
};
FoxSaver.Page.InfoButton.prototype.setImageId = function(A) {
    this._url = "http://vote.foxsaver.com/public/picture/" + A;
    if (A) {
        this.show()
    } else {
        this.hide()
    }
};
FoxSaver.Page.InfoButton.prototype.setUrl = function(A) {
    this._url = A;
    if (A) {
        this.show()
    } else {
        this.hide()
    }
}