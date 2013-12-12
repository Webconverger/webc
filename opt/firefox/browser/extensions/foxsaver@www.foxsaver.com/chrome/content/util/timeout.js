FoxSaver.Util.Timeout = function(A) {
    this.duration = A;
    this.timer = new FoxSaver.Util.Timer();
    this.state = "fresh"
};
FoxSaver.Util.Timeout.prototype.start = function(D, E, B) {
    if (this.state != "fresh") {
        FoxSaver.log("You cannot reuse a timeout.");
        return
    }
    var C = this;
    this.state = "working";
    var A = function(G) {
        if (C.state == "working") {
            C.state = "finished";
            E(G)
        }
    };
    var F = function() {
        if (C.state == "working") {
            C.state = "aborted";
            B()
        }
    };
    D(A, F);
    if (this.duration > 0) {
        this.timer.start(F, this.duration)
    }
};
FoxSaver.Util.Timeout.prototype.stop = function() {
    this.timer.stop();
    this.state = "aborted"
}