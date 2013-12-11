FoxSaver.Util.Idle = function(A) {
    this.waitTime = A.waitTime;
    this._work = A.work;
    this._onInterruption = A.onInterruption;
    this.workingPermit = A.workingPermit;
    this.state = "off";
    var B = this;
    A.breakEvents.map(function(C) {
        FoxSaver.YUI.util.Event.addListener(window, C, function(D) {
            B.onInterruption(D)
        }, true)
    });
    this.timer = new FoxSaver.Util.Timer()
};
FoxSaver.Util.Idle.prototype.onInterruption = function() {
    if (this.state == "on") {
        this._onInterruption()
    }
};
FoxSaver.Util.Idle.prototype.idle = function() {
    var A = this;
    this.stop();
    this.state = "on";
    this.timer.start(function() {
        if (A.workingPermit()) {
            A.work()
        } else {
            A.idle()
        }
    }, this.waitTime)
};
FoxSaver.Util.Idle.prototype.work = function() {
    this.stop();
    this._work()
};
FoxSaver.Util.Idle.prototype.stop = function() {
    this.state = "off";
    this.timer.stop()
}