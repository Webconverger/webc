FoxSaver.Page.Toolbar = function(A, B) {
    this.myClass = FoxSaver.Page.Toolbar;
    this.myClass.superclass.constructor.call(this, A, B);
    this.setupButtons()
};
FoxSaver.YUI.lang.extend(FoxSaver.Page.Toolbar, FoxSaver.Page.ToolTip);
FoxSaver.Page.Toolbar.prototype.setupButtons = function() {
    FoxSaver.nextButton = new FoxSaver.Page.NextButton(this.doc);
    FoxSaver.closeButton = new FoxSaver.Page.CloseButton(this.doc);
    FoxSaver.playButton = new FoxSaver.Page.PlayButton(this.doc);
    FoxSaver.prevButton = new FoxSaver.Page.PrevButton(this.doc);
    FoxSaver.voteButton = new FoxSaver.Page.VoteButton(this.doc);
    FoxSaver.thumbButton = new FoxSaver.Page.ThumbUpButton(this.doc);
    FoxSaver.infoButton = new FoxSaver.Page.InfoButton(this.doc);
    FoxSaver.expandButton = new FoxSaver.Page.ExpandButton(this.doc);
    FoxSaver.thumbButton.hide();
    if (FoxSaver.expanded) {
        FoxSaver.expandButton.hide()
    }
};
FoxSaver.Page.Toolbar.prototype.doNotHide = function() {
    return FoxSaver.Util.inEl(this.el(), this.x, this.y)
}