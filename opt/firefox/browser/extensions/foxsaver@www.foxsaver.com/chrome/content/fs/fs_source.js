FoxSaver.FSSource = function() {
    this.myClass = FoxSaver.FSSource;
    this.myClass.superclass.constructor.call(this, 6);
    this.url = "http://static.foxsaver.com/js/v1/recent.js";
    this.cacheFileName = FoxSaver.Util.getLocalFileName("foxsaver");
    this.type = "foxsaver"
};
FoxSaver.YUI.lang.extend(FoxSaver.FSSource, FoxSaver.Source);
FoxSaver.FSSource.prototype.parse = function(B) {
    var A = FoxSaver.Util.parseJason(B);
    FoxSaver.today = A.publish_date;
    return A.photos
};
FoxSaver.FSSource.prototype.failure = function(A, D) {
    var C = FoxSaver.Util.getJSON_from_local_file(this.cacheFileName);
    if (!C || !C.data) {
        D();
        return
    }
    var B = this.parse(C.data);
    A(B)
};
FoxSaver.FSSource.prototype._load = function(A, C) {
    var B = this;
    this.ajax = new FoxSaver.Util.Ajax({action: this.url, onSuccess: function(E) {
            FoxSaver.Util.save2Local(B.cacheFileName, E.responseText);
            var D = FoxSaver.Util.or(function(G, F) {
                var H = B.parse(E.responseText);
                G(H)
            }, function(G, F) {
                B.failure(G, F)
            });
            D(A, C)
        }, onFailure: function() {
            FoxSaver.log("load fs source failure");
            B.failure(A, C)
        }});
    this.ajax.exe()
};
FoxSaver.FSSource.prototype.stop = function() {
    this.myClass.superclass.stop.call(this);
    if (this.ajax != null) {
        this.ajax.stop()
    }
}