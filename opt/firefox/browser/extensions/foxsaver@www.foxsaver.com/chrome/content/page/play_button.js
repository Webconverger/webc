FoxSaver.Page.PlayButton = function(B, A) {
    if (A == null) {
        A = "playing"
    }
    this.myClass = FoxSaver.Page.PlayButton;
    this.myClass.superclass.constructor.call(this, B, "foxsaverpauseplay", FoxSaver.Util.localize("buttonPlay"));
    this.state = A
};
FoxSaver.YUI.lang.extend(FoxSaver.Page.PlayButton, FoxSaver.Page.ToolbarButton);
FoxSaver.Page.PlayButton.prototype.play = function() {
    var A = this.doc.getElementById(this.id);
    this.state = "playing";
    A.src = "chrome://foxsaver/skin/icons/fsPause.png";
    FoxSaver.fs.action.on()
};
FoxSaver.Page.PlayButton.prototype.pause = function() {
    var A = this.doc.getElementById(this.id);
    this.state = "paused";
    A.src = "chrome://foxsaver/skin/icons/fsPlay.png";
    FoxSaver.fs.action.pause()
};
FoxSaver.Page.PlayButton.prototype.onClick = function() {
    switch (this.state) {
        case"playing":
            this.pause();
            break;
        case"paused":
            this.play();
            break;
        default:
        }
}