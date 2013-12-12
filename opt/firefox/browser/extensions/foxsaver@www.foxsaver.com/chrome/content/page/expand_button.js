FoxSaver.Page.ExpandButton = function(A) {
    this.myClass = FoxSaver.Page.ExpandButton;
    this.myClass.superclass.constructor.call(this, A, "foxsaverexpand", FoxSaver.Util.localize("buttonExpand"))
};
FoxSaver.YUI.lang.extend(FoxSaver.Page.ExpandButton, FoxSaver.Page.ToolbarButton);
FoxSaver.Page.ExpandButton.prototype.onClick = function() {
    if (!FoxSaver.expanded) {
        FoxSaver.expanded = true;
        FoxSaver.Util.expendToFullerScreen(FoxSaver.tab.savedScreenInfo);
        this.hide()
    }
}