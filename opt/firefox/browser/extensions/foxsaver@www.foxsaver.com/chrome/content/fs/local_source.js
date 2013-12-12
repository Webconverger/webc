FoxSaver.LocalSource = function() {
    this.myClass = FoxSaver.LocalSource;
    this.myClass.superclass.constructor.call(this, 24);
    this.type = "local";
    this.timer = new FoxSaver.Util.Timer()
};
FoxSaver.YUI.lang.extend(FoxSaver.LocalSource, FoxSaver.Source);
FoxSaver.LocalSource.prototype._load = function(A, C) {
    var B = this;
    this.timer.start(function() {
        var D = FoxSaver.Util.getUserOwnPhotosToImageList();
        A(D)
    }, 0)
};
FoxSaver.LocalSource.prototype.stop = function() {
    this.myClass.superclass.stop.call(this);
    this.timer.stop()
}