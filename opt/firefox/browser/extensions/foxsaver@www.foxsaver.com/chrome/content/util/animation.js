FoxSaver.Util.Animation = function() {
    this.state = "off";
    this.anim = null
};
FoxSaver.Util.Animation.prototype.setup = function(A) {
    if (!A.target) {
        FoxSaver.log("error in get the target elem to create animation");
        return
    }
    this.anim = new FoxSaver.YUI.util.Motion(A.target);
    this.anim.duration = A.duration;
    this.anim.attributes = A.attributes;
    switch (A.method) {
        case"easeOut":
            this.anim.method = FoxSaver.YUI.util.Easing.easeOut;
            break;
        case"backOut":
            this.anim.method = FoxSaver.YUI.util.Easing.backOut;
            break;
        default:
            break
    }
    this.cont = A.onComplete;
    var B = this;
    this.anim.onComplete.subscribe(function() {
        if (B.state == "on") {
            B.cont()
        }
    })
};
FoxSaver.Util.Animation.prototype.cont = function() {
};
FoxSaver.Util.Animation.prototype.start = function() {
    if (this.anim) {
        this.state = "on";
        this.anim.animate()
    }
};
FoxSaver.Util.Animation.prototype.stop = function() {
    if (this.anim) {
        this.state = "off";
        this.anim.stop();
        this.anim = null
    }
}