FoxSaver.Page.ToolbarButton = function(A, C, B) {
    this.myClass = FoxSaver.Page.ToolbarButton;
    this.myClass.superclass.constructor.call(this, A, C, B);
    this.addBehavior()
};
FoxSaver.YUI.lang.extend(FoxSaver.Page.ToolbarButton, FoxSaver.Page.Button);
FoxSaver.Page.ToolbarButton.prototype.addBehavior = function() {
    var A = this;
    FoxSaver.YUI.util.Event.on(this.el(), "mouseover", function(B) {
        A.onMouseOver(B)
    });
    FoxSaver.YUI.util.Event.on(this.el(), "mouseout", function(B) {
        A.onMouseOut(B)
    });
    FoxSaver.YUI.util.Event.on(this.el(), "mouseup", function(B) {
        A.onMouseUp(B)
    });
    FoxSaver.YUI.util.Event.on(this.el(), "mousedown", function(B) {
        A.onMouseDown(B)
    })
};
FoxSaver.Page.ToolbarButton.prototype.el = function() {
    return this.doc.getElementById(this.id)
};
FoxSaver.Page.ToolbarButton.prototype.onMouseOver = function() {
    var A = this.el();
    if (A) {
        FoxSaver.YUI.util.Dom.setStyle(A, "opacity", "1")
    }
};
FoxSaver.Page.ToolbarButton.prototype.onMouseOut = function() {
    var A = this.el();
    if (A) {
        FoxSaver.YUI.util.Dom.setStyle(A, "opacity", "0.5")
    }
};
FoxSaver.Page.ToolbarButton.prototype.onMouseDown = function() {
    var A = this.el();
    if (A) {
        A.width = 34;
        A.height = 34;
        A.style.marginLeft = 2
    }
};
FoxSaver.Page.ToolbarButton.prototype.onMouseUp = function() {
    var A = this.el();
    if (A) {
        A.width = 36;
        A.height = 36;
        A.style.marginLeft = 0
    }
}