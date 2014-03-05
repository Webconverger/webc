FoxSaver.ImageManager = function() {
    this.indexOnShow = 0;
    this.index = 0;
    this.images = new Array();
    this.images2 = new Array();
    this.state = "fresh";
    this.tempSource = null
};
FoxSaver.ImageManager.prototype.decIndexOnShow = function() {
    this.indexOnShow = FoxSaver.Util.forceRange(this.indexOnShow - 1, this.images.length)
};
FoxSaver.ImageManager.prototype.resetIndex = function() {
    this.index = this.indexOnShow
};
FoxSaver.ImageManager.prototype.cont = function() {
};
FoxSaver.ImageManager.prototype.clear = function() {
    this.state = "fresh"
};
FoxSaver.ImageManager.prototype.setupSource = function() {
    if (this.tempSource != null) {
        this.source = this.tempSource;
        this.tempSource = null;
        return
    }
    this.source = null;
    if (FoxSaver.preference.isFoxSaverPhotoEnabled()) {
        this.source = FoxSaver.plusSource(this.source, new FoxSaver.FSSource())
    }
    if (FoxSaver.Util.isShowingUserOwnPhotos()) {
        this.source = FoxSaver.plusSource(this.source, new FoxSaver.LocalSource())
    }
    if (FoxSaver.Util.isShowingUserRssFeeds()) {
        var B = FoxSaver.Util.getUserRssFeedUrlList();
        var A;
        for (A = 0; A < B.length; A++) {
            FoxSaver.log("rss suorce included: " + B[A]);
            this.source = FoxSaver.plusSource(this.source, FoxSaver.Rss.source(B[A]))
        }
    }
    if (!this.source) {
        this.source = new FoxSaver.FSSource()
    }
};
FoxSaver.ImageManager.prototype.stop = function() {
    if (this.source) {
        this.source.stop()
    }
};
FoxSaver.ImageManager.prototype._load = function(B) {
    var A = this;
    this.stop();
    this.state = "loading";
    this.setupSource();
    this.images2 = new Array();
    this.indexOnShow = 0;
    this.index = 0;
    this.source.load(function() {
        A.state = "loaded";
        A.images = A.images2;
        var C = A.cont;
        A.cont = function() {
        };
        C()
    }, function() {
        A.state = "loaded";
        k = A.cont;
        A.cont = function() {
        };
        k()
    })
};
FoxSaver.ImageManager.prototype.refresh = function(A) {
    this.stop();
    if (A) {
        this.cont = A
    }
    this._load()
};
FoxSaver.ImageManager.prototype.load = function(A, B) {
    if (A) {
        this.cont = function() {
            A()
        }
    }
    if (B == null) {
        B = true
    }
    switch (this.state) {
        case"fresh":
            this._load();
            break;
        case"loading":
            break;
        case"loaded":
            if (B) {
                this._load()
            } else {
                A()
            }
            break;
        default:
        }
};
FoxSaver.ImageManager.prototype.current = function() {
    if (this.images.length == 0) {
        return null
    }
    this.index = FoxSaver.Util.forceRange(this.index, this.images.length);
    var A = this.images[this.index];
    if (!A.valid) {
        this.images.splice(this.index, 1);
        return this.current()
    }
    A.index = this.index;
    return A
};
FoxSaver.ImageManager.prototype.next = function() {
    this.index++;
    this.index = FoxSaver.Util.forceRange(this.index, this.images.length)
};
FoxSaver.ImageManager.prototype.prev = function() {
    this.index--;
    this.index = FoxSaver.Util.forceRange(this.index, this.images.length)
};
FoxSaver.ImageManager.prototype.randomize = function() {
    if (FoxSaver.preference.getBool("enable_random_image_show") == false)
        return;
    var A = Math.min(this.images.length - 1, this.images.length - this.index);
    var C = Math.round(Math.random() * A);
    var B = FoxSaver.Util.forceRange(this.index + C, this.images.length);
    FoxSaver.Util.arraySwap(this.images, this.index, B)
};
FoxSaver.ImageManager.prototype.isEmpty = function() {
    return this.images.length == 0
};
FoxSaver.ImageManager.prototype.setIndex = function(A) {
    this.index = FoxSaver.Util.forceRange(A, this.images.length)
};
FoxSaver.ImageManager.exist = function(A, C) {
    if (!C.src) {
        return false
    }
    var B = false;
    A.map(function(D) {
        if (D.src && D.src == C.src) {
            B = true
        }
    });
    return B
};
FoxSaver.ImageManager.prototype.add = function(A) {
    switch (this.state) {
        case"loading":
            if (!FoxSaver.ImageManager.exist(this.images2, A)) {
                this.images2.push(A)
            }
            break;
        case"loaded":
            if (!FoxSaver.ImageManager.exist(this.images, A)) {
                this.images.push(A)
            }
            break;
        default:
            alert("wrong state of image manager")
        }
};
FoxSaver.ImageManager.prototype.sourceExpired = function() {
    if (this.source) {
        return this.source.expired()
    } else {
        return false
    }
};
FoxSaver.ImageManager.prototype.setTempSource = function(A) {
    this.tempSource = A
}