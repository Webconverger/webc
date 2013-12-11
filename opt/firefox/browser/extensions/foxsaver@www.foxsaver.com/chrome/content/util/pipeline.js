FoxSaver.Util.Pipeline = function(B) {
    this.units = B.map(function(C) {
        var D = new FoxSaver.Util.PipelineUnit(C);
        return D
    });
    for (var A = 0; A < this.units.length; A++) {
        if (A > 0 || A < this.units.length - 1) {
            this.units[A].prev = this.units[A - 1];
            this.units[A].next = this.units[A + 1]
        }
    }
};
FoxSaver.Util.Pipeline.prototype.start = function() {
    this.units.map(function(A) {
        A.state = "ready"
    });
    this.units[0].ready()
};
FoxSaver.Util.Pipeline.prototype.stop = function() {
    this.units.map(function(A) {
        A.stop()
    })
};
FoxSaver.Util.PipelineUnit = function(A) {
    this.fn = A;
    this.prev = null;
    this.next = null;
    this.controller = {timer: new FoxSaver.Util.Timer(), animation: new FoxSaver.Util.Animation()};
    this.state = "off";
    this.args = {}
};
FoxSaver.Util.PipelineUnit.prototype.ready = function() {
    if (this.state == "off") {
        return
    }
    this.state = "ready";
    if (this.prev) {
        if (this.prev.state == "stalled") {
            this.work();
            this.prev.ready()
        }
    } else {
        this.work()
    }
};
FoxSaver.Util.PipelineUnit.prototype.work = function() {
    if (this.state == "off") {
        return
    }
    this.state = "working";
    if (this.prev) {
        this.args = this.prev.args;
        this.prev.args = {}
    }
    var A = this;
    try {
        this.fn(this.controller, function() {
            A.cont()
        }, function() {
            A.abort()
        }, this.args)
    } catch (B) {
        FoxSaver.log("FoxSaver.Util.PipelineUnit.prototype.work:" + B);
        A.abort()
    }
};
FoxSaver.Util.PipelineUnit.prototype.cont = function() {
    if (this.next) {
        if (this.next.state == "ready") {
            this.next.work();
            this.ready()
        } else {
            this.stall()
        }
    } else {
        this.ready()
    }
};
FoxSaver.Util.PipelineUnit.prototype.abort = function() {
    var A = this;
    if (this.state != "off") {
        A.ready()
    }
};
FoxSaver.Util.PipelineUnit.prototype.stall = function() {
    if (this.state == "off") {
        return
    }
    this.state = "stalled"
};
FoxSaver.Util.PipelineUnit.prototype.stop = function() {
    this.state = "off";
    this.controller.timer.stop();
    this.controller.animation.stop();
    if (this.args.free) {
        this.args.free()
    }
    if (this.args.stop) {
        this.args.stop()
    }
}