FoxSaver.ElSource = function(A) {
    this.myClass = FoxSaver.ElSource;
    this.myClass.superclass.constructor.call(this, 100);
    this.els = A;
    this.type = "el";
    this.timer = new FoxSaver.Util.Timer()
};
FoxSaver.YUI.lang.extend(FoxSaver.ElSource, FoxSaver.Source);
FoxSaver.ElSource.prototype.validateEntry = function(A) {
    return true
};
FoxSaver.ElSource.prototype.setupData = function() {
    var B = this;
    FoxSaver.log("els length: " + this.els.length);
    this.data = new Array();
    for (var A = 0; A < this.els.length; A++) {
        this.data.push(new FoxSaver.Image({el: this.els[A]}))
    }
};
FoxSaver.ElSource.prototype._load = function(A, C) {
    var B = this;
    this.timer.start(function() {
        B.setupData();
        A(B.data)
    }, 0)
};
FoxSaver.ElSource.prototype.stop = function() {
    this.myClass.superclass.stop.call(this);
    this.timer.stop()
}