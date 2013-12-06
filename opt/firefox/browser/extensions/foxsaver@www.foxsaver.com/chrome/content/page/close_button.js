FoxSaver.Page.CloseButton = function(A) {
    this.myClass = FoxSaver.Page.CloseButton;
    this.myClass.superclass.constructor.call(this, A, "foxsaverclose", FoxSaver.Util.localize("buttonClose"))
};
FoxSaver.YUI.lang.extend(FoxSaver.Page.CloseButton, FoxSaver.Page.ToolbarButton);
FoxSaver.Page.CloseButton.prototype.onClick = function() {
    FoxSaver.fs.stop()
}