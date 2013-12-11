FoxSaver.Page.NextButton = function(A) {
    this.myClass = FoxSaver.Page.NextButton;
    this.myClass.superclass.constructor.call(this, A, "foxsavernext", FoxSaver.Util.localize("buttonNextImage"))
};
FoxSaver.YUI.lang.extend(FoxSaver.Page.NextButton, FoxSaver.Page.ToolbarButton);
FoxSaver.Page.NextButton.prototype.onClick = function() {
    FoxSaver.playButton.pause();
    FoxSaver.fs.action.next()
}