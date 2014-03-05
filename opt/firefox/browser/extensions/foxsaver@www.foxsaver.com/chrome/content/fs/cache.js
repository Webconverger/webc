FoxSaver.Cache = function() {
};
FoxSaver.Cache.cacheFileName = function(A) {
    var C = A.lastIndexOf(".");
    var B = (C >= 0) ? A.substring(C + 1) : "jpg";
    if (B.length > 4) {
        B = "jpg"
    }
    var D = FoxSaver.Util.getCachePath() + FoxSaver.DirIO.sep;
    return D + FoxSaver.HashUtil.hex_sha1(A) + "." + B
};
FoxSaver.Cache.prototype.cache = function(C, A, G) {
    var D = this;
    var B = FoxSaver.Cache.cacheFileName(C);
    var F = FoxSaver.FileIO.open(B);
    try {
        FoxSaver.FileIO.downloadURL(C, F, function() {
            var H = FoxSaver.FileIO.open(B);
            if (H && H.exists()) {
                var I = FoxSaver.FileIO.path(H);
                A(I)
            } else {
                G()
            }
        })
    } catch (E) {
        log(E);
        G()
    }
};
FoxSaver.Cache.prototype.lookup = function(C, A, G, E) {
    if (C.indexOf("file://") == 0) {
        A(C);
        return
    }
    if (E == null) {
        E = true
    }
    var B = FoxSaver.Cache.cacheFileName(C);
    var D = FoxSaver.FileIO.open(B);
    if (D && D.exists()) {
        var F = FoxSaver.FileIO.path(D);
        A(F)
    } else {
        if (E) {
            this.cache(C, A, G)
        } else {
            G()
        }
    }
}