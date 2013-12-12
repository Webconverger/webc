FoxSaver.Action = function(A) {
    if (A == null) {
        A = 3
    }
    this.state = "off";
    this.shuffle = true;
    this.effect = new FoxSaver.Effects(2);
    this.direction = "next";
    this.buffer = new FoxSaver.Util.BiBuffer(A, this.direction);
    this.setupPipeline()
};
FoxSaver.Action.prototype.setDirection = function(A) {
    if (this.direction == A) {
        return
    }
    this.direction = A;
    this.preBufferPipeline.stop();
    this.buffer.setDirection(this.direction);
    FoxSaver.imageManager.setIndex(this.adjustIndex());
    this.setupPreBufferPipeline();
    this.preBufferPipeline.start()
};
FoxSaver.Action.prototype.adjustIndex = function() {
    var A = this.buffer.peekTail();
    if (A == null) {
        return 0
    }
    switch (this.direction) {
        case"prev":
            return A.currentImage.index - 1;
        case"next":
            return A.currentImage.index + 1;
        default:
        }
};
FoxSaver.Action.prototype.setupPreBufferPipeline = function() {
    var C = this;
    var B = [];
    B.push(function(E, D, G, F) {
        C.syncSource(E, D, G, F)
    });
    B.push(function(E, D, G, F) {
        C.downloadImage(E, D, G, F)
    });
    for (var A = 0; A < 10; A++) {
        B.push(function(E, D, G, F) {
            D()
        })
    }
    B.push(function(E, D, G, F) {
        C.loadImage(E, D, G, F)
    });
    B.push(function(E, D, G, F) {
        C.canvasImage(E, D, G, F)
    });
    B.push(function(E, D, G, F) {
        C.produce(E, D, G, F)
    });
    this.preBufferPipeline = new FoxSaver.Util.Pipeline(B)
};
FoxSaver.Action.prototype.setupPostBufferPipeline = function() {
    var B = this;
    var A = [];
    A.push(function(D, C, F, E) {
        B.displayImage(D, C, F, E)
    });
    this.postBufferPipeline = new FoxSaver.Util.Pipeline(A)
};
FoxSaver.Action.prototype.setupPipeline = function() {
    this.setupPreBufferPipeline();
    this.setupPostBufferPipeline()
};
FoxSaver.Action.prototype.startPipeline = function() {
    this.preBufferPipeline.start();
    this.postBufferPipeline.start()
};
FoxSaver.Action.prototype.stopPipeline = function() {
    this.preBufferPipeline.stop();
    this.postBufferPipeline.stop()
};
FoxSaver.Action.prototype.pause = function() {
    if (this.state == "paused") {
        return
    }
    this.state = "paused";
    this.shuffle = false;
    this.stopCurrentCanvas()
};
FoxSaver.Action.prototype.p = function() {
    switch (this.state) {
        case"on":
            this.pause();
            break;
        case"paused":
            this.on();
            break;
        default:
        }
};
FoxSaver.Action.prototype.on = function() {
    if (this.state == "on") {
        return
    }
    this.state = "on";
    this.shuffle = true;
    this.play()
};
FoxSaver.Action.prototype.prev = function() {
};
FoxSaver.Action.prototype.play = function() {
};
FoxSaver.Action.prototype.next = function() {
};
FoxSaver.Action.prototype.off = function() {
    this.state = "off"
};
FoxSaver.Action.prototype.start = function(A) {
    FoxSaver.log("ACTION START!!!!!! with state: " + A);
    if (A == null) {
        A = false
    }
    FoxSaver.imageManager.resetIndex();
    this.state = "on";
    this.noPostEffect = true;
    if (A) {
        FoxSaver.playButton.pause()
    }
    this.startPipeline()
};
FoxSaver.Action.prototype.stop = function(A) {
    FoxSaver.log("ACTION STOP!!!!!");
    FoxSaver.iframeManager.freeAll();
    FoxSaver.canvasManager.freeAll();
    this.state = "off";
    this.stopPipeline();
    this.stopCurrentCanvas()
};
FoxSaver.Action.prototype.nextImage = function() {
    if (FoxSaver.imageManager.isEmpty()) {
        return null
    }
    var A;
    switch (this.direction) {
        case"prev":
            A = FoxSaver.imageManager.current();
            FoxSaver.imageManager.prev();
            break;
        case"next":
            if (this.shuffle) {
                FoxSaver.imageManager.randomize()
            }
            A = FoxSaver.imageManager.current();
            FoxSaver.imageManager.next();
            break;
        default:
    }
    FoxSaver.log("image index:" + A.index);
    return A
};
FoxSaver.Action.prototype.syncSource = function(B, A, G, C) {
    var E = this;
    var F = FoxSaver.preference.isDirty();
    var D = FoxSaver.imageManager.sourceExpired();
    if (F || D) {
        FoxSaver.imageManager.load(function() {
            var H = E.state == "paused";
            E.stop();
            FoxSaver.imageManager.setIndex(0);
            FoxSaver.fs.restart(H)
        }, F);
        A()
    } else {
        A()
    }
};
FoxSaver.Action.prototype.downloadImage = function(B, A, F, C) {
    var E = this;
    if (this.state == "off") {
        return
    }
    var D = this.nextImage();
    if (!D) {
        alert("No image can be found with the currently specified sources.  Please verify sources and try again.");
        FoxSaver.fs.stop();
        return
    }
    C.currentImage = D;
    C.currentImageIndex = D.index;
    D.download(A, F)
};
FoxSaver.Action.prototype.loadImage = function(B, A, G, C) {
    var F = this;
    var E = C.currentImage;
    var D = FoxSaver.iframeManager.getResource();
    FoxSaver.log("number of iframes: " + FoxSaver.iframeManager.length());
    C.iframe = D;
    C.free = function() {
        if (C.iframe) {
            C.iframe.free()
        }
        if (C.canvas) {
            C.canvas.free()
        }
    };
    E.load(D, function(H) {
        C.image = H;
        A()
    }, G)
};
FoxSaver.Action.prototype.canvasImage = function(B, A, E, D) {
    var C = FoxSaver.canvasManager.getResource();
    FoxSaver.log("number of canvases: " + FoxSaver.canvasManager.length());
    C.drawImage(D.image);
    D.canvas = C;
    A()
};
FoxSaver.Action.prototype.produce = function(B, A, E, C) {
    var D = this;
    C.stop = function() {
        D.buffer.buffer.afterShift = null
    };
    this.buffer.push(C, A, E)
};
FoxSaver.Action.prototype.consume = function(B, A, E, C) {
    var D = this;
    this.buffer.shift(function(F) {
        FoxSaver.Util.copyHash(C, F);
        D.buffer.log();
        A()
    }, E)
};
FoxSaver.Action.prototype.preEffect = function(B, A, G, D) {
    var E = this;
    if (this.state == "off") {
        return
    }
    try {
        this.currentImage = D.currentImage;
        if (D.currentImage.type == "foxsaver") {
            FoxSaver.voteButton.show()
        } else {
            FoxSaver.voteButton.hide()
        }
        FoxSaver.imageManager.indexOnShow = D.currentImage.index;
        FoxSaver.imgNumber.setTotal(FoxSaver.imageManager.images.length);
        FoxSaver.imgNumber.setIndex(D.currentImageIndex + 1, D.currentImage);
        FoxSaver.infoButton.setUrl(D.currentImage.website);
        if (FoxSaver.thumbButton) {
            var C = D.currentImage.img_src_hash ? D.currentImage.img_src_hash : "";
            FoxSaver.thumbButton.setImageId(C)
        }
        D.canvas.center();
        if (this.state == "paused") {
            if (this.currentCanvas) {
                this.currentCanvas.hide()
            }
        }
        this.currentCanvas = D.canvas;
        D.stop = function() {
            D.canvas.stop()
        };
        if (this.state == "paused") {
            D.canvas.show();
            A()
        } else {
            D.canvas.appear(A)
        }
    } catch (F) {
        FoxSaver.log("FoxSaver.Action.prototype.preEffect:" + F);
        G()
    }
};
FoxSaver.Action.prototype.hold = function(B, A, D, C) {
    if (this.state == "off") {
        return
    }
    this.currentCanvas.show();
    this.noPostEffect = false;
    if (this.state == "paused") {
        D();
        return
    }
    C.canvas.hold(A)
};
FoxSaver.Action.prototype.postEffect = function(B, A, F, C) {
    var E = this;
    if (this.state == "off") {
        return
    }
    if (this.state == "paused") {
        A();
        return
    }
    if (this.noPostEffect) {
        A();
        return
    }
    var D = FoxSaver.Util.por(function(H, G) {
        E.currentCanvas.disappear(H)
    }, function(H, G) {
        E.currentCanvas.hold(H, 1000)
    });
    D(A, F)
};
FoxSaver.Action.prototype.displayImage = function(D, I, F, G) {
    FoxSaver.log("display state: " + this.state);
    var H = this;
    var A = function() {
        FoxSaver.Util.clearAllCacheEntries(false);
        H.clearListeners()
    };
    var J = function() {
        A();
        I()
    };
    var C = function() {
        A();
        F()
    };
    var B = FoxSaver.Util.sequence([function(L, K) {
            H.consume(D, L, K, G)
        }, FoxSaver.Util.por(function(L, K) {
            H.postEffect(D, L, K, G)
        }, function(L, K) {
            H.addListeners(L, K)
        }), FoxSaver.Util.por(function(L, K) {
            H.preEffect(D, L, K, G)
        }, function(L, K) {
            H.addListeners(L, K)
        }), FoxSaver.Util.por(function(L, K) {
            H.hold(D, L, K, G)
        }, function(L, K) {
            H.addListeners(L, K)
        })]);
    try {
        B(J, C)
    } catch (E) {
        FoxSaver.log("FoxSaver.Action.prototype.displayImage:" + E);
        C()
    }
};
FoxSaver.Action.prototype.addListeners = function(A, C) {
    var B = this;
    B.next = function() {
        B.stopCurrentCanvas();
        B.setDirection("next");
        A()
    };
    B.prev = function() {
        B.stopCurrentCanvas();
        B.setDirection("prev");
        A()
    };
    B.play = B.next
};
FoxSaver.Action.prototype.clearListeners = function() {
    this.next = FoxSaver.Util.nop;
    this.prev = FoxSaver.Util.nop;
    this.play = FoxSaver.Util.nop
};
FoxSaver.Action.prototype.stopCurrentCanvas = function() {
    if (this.currentCanvas) {
        this.currentCanvas.stop()
    }
};
FoxSaver.Action.prototype.unit = function(B, A, D, C) {
    A()
}