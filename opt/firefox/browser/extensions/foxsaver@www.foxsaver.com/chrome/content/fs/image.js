FoxSaver.Image = function(A) {
    this.title = A.title;
    this.description = A.desc;
    this.author = A.author;
    this.src = A.src;
    this.website = A.website;
    this.localPath = A.localPath;
    this.el = A.el;
    this.type = A.type;
    this.img_src_hash = A.img_src_hash;
    this.doNotDownload = false;
    if (A.doNotDownload != null) {
        this.doNotDownload = A.doNotDownload
    }
    this.doNotDownload = this.doNotDownload || this.type == "local" || this.type == "el";
    this.downloading = false;
    this.valid = true
};
FoxSaver.Image.prototype._load = function(C, F, A, B) {
    var D = this;
    var G = function() {
        C.free();
        B()
    };
    if (this.type == "el") {
        A(this.el);
        return
    }
    if (this.loadTimeout) {
        this.loadTimeout.stop()
    }
    var E = 5000;
    this.loadTimeout = new FoxSaver.Util.Timeout(E);
    this.loadTimeout.start(function(H, I) {
        C.loadSrc(F, H, I)
    }, function() {
        var H = C.getImage();
        if (H.width < 300 && H.height < 200) {
            D.valid = false;
            G();
            return
        }
        A(H)
    }, G)
};
FoxSaver.Image.prototype.load = function(B, A, E) {
    var C = this;
    var D = this.src;
    if (!this.doNotDownload) {
        FoxSaver.cache.lookup(D, function(F) {
            C._load(B, F, A, E)
        }, E, false)
    } else {
        this._load(B, D, A, E)
    }
};
FoxSaver.Image.prototype.download = function(A, D) {
    var B = this;
    if (!this.valid) {
        D();
        return
    }
    if (this.doNotDownload) {
        A();
        return
    }
    if (this.downloadTimeout) {
        this.downloadTimeout.stop()
    }
    var C = 10000;
    this.downloadTimeout = new FoxSaver.Util.Timeout(C);
    this.downloadTimeout.start(function(E, F) {
        FoxSaver.cache.lookup(B.src, E, F)
    }, A, D)
};
FoxSaver.Image.prototype.getDescString = function() {
    var A = "";
    if (this.title) {
        A += this.title + " "
    }
    if (this.author) {
        A += "--By " + this.author + " "
    }
    if (this.description && description.length < 12) {
        A += "--" + this.description
    }
    A = A.replace(/&#(\d+);/g, function(B, C) {
        return String.fromCharCode(+C)
    });
    return A
}