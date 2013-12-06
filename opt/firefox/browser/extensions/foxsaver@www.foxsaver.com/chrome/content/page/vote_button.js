FoxSaver.Page.VoteButton = function(A) {
    this.myClass = FoxSaver.Page.VoteButton;
    this.myClass.superclass.constructor.call(this, A, "foxsavervote", FoxSaver.Util.localize("buttonVote"))
};
FoxSaver.YUI.lang.extend(FoxSaver.Page.VoteButton, FoxSaver.Page.ToolbarButton);
FoxSaver.Page.VoteButton.prototype.onClick = function() {
    FoxSaver.fs.stop();
    var B = FoxSaver.today.replace(/-/g, "/");
    var A = "http://www.foxsaver.com/thumbnails/" + B;
    FoxSaver.Util.newTab(A)
}