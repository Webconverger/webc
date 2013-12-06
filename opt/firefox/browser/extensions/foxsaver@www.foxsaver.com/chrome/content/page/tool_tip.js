FoxSaver.Page.ToolTip = function(B, C, A) {
    if (A == null) {
        A = 3000
    }
    this.doc = B;
    this.id = C;
    this.waitTime = A;
    this.state = "off";
    this.x = 0;
    this.y = 0;
    this.anim = new FoxSaver.Util.Animation();
    this.setupController();
    this.addBehavior()
};
FoxSaver.Page.ToolTip.prototype.addBehavior = function() {
    var A = this;
    FoxSaver.YUI.util.Event.on(this.doc.getElementById("body"), "mousemove", function(B) {
        A.onBodyMouseMove(B)
    })
};
FoxSaver.Page.ToolTip.prototype.onBodyMouseMove = function(A) {
    this.x = A.pageX;
    this.y = A.pageY;
    switch (this.state) {
        case"off":
            this.fadeOut();
            break;
        case"fadingIn":
            this.show();
            break;
        case"fadingOut":
            if (this.doNotHide()) {
                this.show()
            }
            break;
        default:
        }
};
FoxSaver.Page.ToolTip.prototype.doNotHide = function() {
    return false
};
FoxSaver.Page.ToolTip.prototype.setupController = function() {
    var A = this;
    this.controller = new FoxSaver.Util.Idle({waitTime: this.waitTime, breakEvents: ["mousemove"], work: function() {
            A.fadeIn()
        }, onInterruption: function() {
            this.idle()
        }, workingPermit: function() {
            return !A.doNotHide()
        }})
};
FoxSaver.Page.ToolTip.prototype.fadeOut = function() {
    var B = this;
    this.state = "fadingOut";
    var A = this.doc.getElementById(this.id);
    this.anim.stop();
    this.anim.setup({target: A, duration: 0.5, attributes: {opacity: {from: 0, to: 0.9, unit: ""}}, method: "eastOut", onComplete: function() {
            if (!B.onHold) {
                B.state = "onShow";
                B.controller.idle()
            }
        }});
    this.anim.start()
};
FoxSaver.Page.ToolTip.prototype.fadeIn = function() {
    var B = this;
    this.state = "fadingIn";
    var A = this.doc.getElementById(this.id);
    this.anim.stop();
    this.anim.setup({target: A, duration: 2, attributes: {opacity: {from: 0.9, to: 0, unit: ""}}, method: "eastOut", onComplete: function() {
            B.state = "off"
        }});
    this.anim.start()
};
FoxSaver.Page.ToolTip.prototype.show = function() {
    var A = this.doc.getElementById(this.id);
    this.anim.stop();
    this.state = "onShow";
    A.style.opacity = "0.9";
    this.controller.idle()
};
FoxSaver.Page.ToolTip.prototype.stop = function() {
    this.controller.stop();
    this.anim.stop()
};
FoxSaver.Page.ToolTip.prototype.el = function() {
    return this.doc.getElementById(this.id)
}