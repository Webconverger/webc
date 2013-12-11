FoxSaver.Page.ExitToolTip = function(B, C) {
    this.myClass = FoxSaver.Page.ExitToolTip;
    this.myClass.superclass.constructor.call(this, B, C, 100);
    var A = this.el();
    A.innerHTML = FoxSaver.Util.getLocalStr("exitFoxSaverMsg")
};
FoxSaver.YUI.lang.extend(FoxSaver.Page.ExitToolTip, FoxSaver.Page.ToolTip);
FoxSaver.Page.ExitToolTip.prototype.followCursor = function() {
    FoxSaver.YUI.util.Dom.setXY(this.el(), [this.x, this.y])
};
FoxSaver.Page.ExitToolTip.prototype.fadeOut = function() {
    if (!FoxSaver.toolbar) {
        return
    }
    var A = FoxSaver.Util.inEl(FoxSaver.toolbar.el(), this.x, this.y);
    if (A) {
        return
    }
    this.followCursor();
    this.myClass.superclass.fadeOut.call(this)
}