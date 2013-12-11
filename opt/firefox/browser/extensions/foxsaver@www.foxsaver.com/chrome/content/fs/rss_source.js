FoxSaver.RssSource = function(A, B) {
    this.myClass = FoxSaver.RssSource;
    this.myClass.superclass.constructor.call(this, 1);
    this.url = A;
    this.parse = B;
    this.type = "rss"
};
FoxSaver.YUI.lang.extend(FoxSaver.RssSource, FoxSaver.Source);
FoxSaver.RssSource.prototype._load = function(A, C) {
    var B = this;
    this.ajax = new FoxSaver.Util.Ajax({action: this.url, onSuccess: function(E) {
            var D = B.parse(E.responseText);
            A(D)
        }, onFailure: C});
    this.ajax.exe()
};
FoxSaver.RssSource.prototype.stop = function() {
    this.myClass.superclass.stop.call(this);
    if (this.ajax != null) {
        this.ajax.stop()
    }
}