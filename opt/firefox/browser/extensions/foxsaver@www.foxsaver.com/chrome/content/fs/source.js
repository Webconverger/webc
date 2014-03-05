FoxSaver.Source = function(A) {
    if (A == null) {
        this.age = 6
    } else {
        this.age = A
    }
    this.expireTime = null;
    this.cache = null;
    this.timer = new FoxSaver.Util.Timer();
    this.doNotValidate = false
};
FoxSaver.Source.prototype.setExpireTime = function() {
    var A = new Date();
    var B = A.getTime();
    this.expireTime = B + FoxSaver.Util.hr2ms(this.age)
};
FoxSaver.Source.prototype.expired = function() {
    if (this.expireTime == null) {
        return false
    }
    var A = new Date();
    var B = A.getTime();
    if (B > this.expireTime) {
        this.setExpireTime();
        return true
    } else {
        return false
    }
};
FoxSaver.Source.prototype.validateEntry = function(B) {
    if (this.doNotValidate) {
        return true
    }
    var A = B.src;
    return A && (B.mediaType == "image" || FoxSaver.Util.isImage(A))
};
FoxSaver.Source.prototype.useCache = function(A, C) {
    var B = this;
    this.timer.start(function() {
        B._useCache(A, C)
    }, 0)
};
FoxSaver.Source.prototype._useCache = function(A, B) {
    if (this.cache == null || this.cache.length == 0) {
        B();
        return
    }
    this.cache.map(function(C) {
        FoxSaver.imageManager.add(C)
    });
    A()
};
FoxSaver.Source.prototype.processData = function(B, A, C) {
    this._processData(B, function(D) {
        FoxSaver.imageManager.add(D)
    }, A, C)
};
FoxSaver.Source.prototype.validate = function(A, C) {
    var B = this;
    this._load(function(D) {
        B.validateData(D, A, C)
    }, C)
};
FoxSaver.Source.prototype.validateData = function(C, A, D) {
    var B = false;
    this._processData(C, function(E) {
        B = true
    }, function() {
        if (B) {
            A()
        } else {
            D()
        }
    }, D)
};
FoxSaver.Source.prototype._processData = function(E, D, A, F) {
    var C = this;
    if (!E || E.length == 0) {
        F();
        return
    }
    var B = new Array();
    E.map(function(H) {
        if (!C.validateEntry(H)) {
            return
        }
        H.type = C.type;
        var G = new FoxSaver.Image(H);
        B.push(G);
        D(G)
    });
    if (B.length == 0) {
        F()
    } else {
        this.setExpireTime();
        this.cache = B;
        A()
    }
};
FoxSaver.Source.prototype.load = function(A, E) {
    var C = this;
    var D = FoxSaver.Util.or(function(G, F) {
        C._load(function(H) {
            C.processData(H, G, F)
        }, F)
    }, function(G, F) {
        C.useCache(G, F)
    });
    var B = FoxSaver.Util.or(function(G, F) {
        C.useCache(G, F)
    }, D);
    if (!this.expired()) {
        B(A, E)
    } else {
        D(A, E)
    }
};
FoxSaver.Source.prototype.stop = function() {
    this.timer.stop()
}