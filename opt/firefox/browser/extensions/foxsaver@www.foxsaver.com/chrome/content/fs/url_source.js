FoxSaver.UrlSource = function(B, A) {
    if (A == null) {
        A = false
    }
    this.doNotDownload = A;
    this.myClass = FoxSaver.UrlSource;
    this.myClass.superclass.constructor.call(this, 100);
    this.urls = B;
    this.type = "in_page";
    this.timer = new FoxSaver.Util.Timer()
};
FoxSaver.YUI.lang.extend(FoxSaver.UrlSource, FoxSaver.Source);
FoxSaver.UrlSource.prototype.setupData = function() {
    var A = this;
    this.data = this.urls.map(function(D) {
        var C = {src: D, doNotDownload: A.doNotDownload};
        var B = new FoxSaver.Image(C);
        return B
    })
};
FoxSaver.UrlSource.prototype._load = function(A, C) {
    var B = this;
    this.timer.start(function() {
        B.setupData();
        A(B.data)
    }, 0)
};
FoxSaver.UrlSource.prototype.stop = function() {
    this.myClass.superclass.stop.call(this);
    this.timer.stop()
}