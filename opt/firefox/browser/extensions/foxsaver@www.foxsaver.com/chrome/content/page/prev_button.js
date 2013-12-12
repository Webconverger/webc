FoxSaver.Page.PrevButton = function(A) {
    this.myClass = FoxSaver.Page.PrevButton;
    this.myClass.superclass.constructor.call(this, A, "foxsaverprev", FoxSaver.Util.localize("buttonPrevImage"))
};
FoxSaver.YUI.lang.extend(FoxSaver.Page.PrevButton, FoxSaver.Page.ToolbarButton);
FoxSaver.Page.PrevButton.prototype.onClick = function() {
    FoxSaver.playButton.pause();
    FoxSaver.fs.action.prev()
}