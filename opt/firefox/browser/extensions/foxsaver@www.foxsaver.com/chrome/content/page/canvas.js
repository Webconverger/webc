FoxSaver.Page.Canvas = function(A, B) {
    this.doc = A;
    if (B) {
        this.canvas = this.doc.getElementById(B)
    } else {
        this.canvas = this.doc.createElement("canvas");
        A.body.appendChild(this.canvas)
    }
    this.context = this.canvas.getContext("2d");
    this.anim = new FoxSaver.Util.Animation();
    this.timer = new FoxSaver.Util.Timer();
    this.reflexRatio = 0.95;
    this.busy = false
};
FoxSaver.Page.Canvas.prototype.stop = function() {
    this.timer.stop();
    this.anim.stop()
};
FoxSaver.Page.Canvas.prototype.hide = function() {
    this.stop();
    this.canvas.style.opacity = 0
};
FoxSaver.Page.Canvas.prototype.show = function() {
    if (FoxSaver.slideImageElem) {
        FoxSaver.slideImageElem.style.opacity = 0;
        FoxSaver.slideImageElem.style.display = "none"
    }
    this.stop();
    this.canvas.style.opacity = 1
};
FoxSaver.Page.Canvas.prototype.effect = function(B, C, A) {
    this.stop();
    this.anim.setup({target: this.canvas, duration: (FoxSaver.preference.hasFadeInOut() ? 2 : 0), attributes: B, method: C, onComplete: A});
    if (FoxSaver.slideImageElem) {
        FoxSaver.slideImageElem.style.opacity = 0;
        FoxSaver.slideImageElem.style.display = "none"
    }
    this.anim.start()
};
FoxSaver.Page.Canvas.prototype.appear = function(A) {
    this.effect({opacity: {from: 0, to: 1}}, "easeOut", A)
};
FoxSaver.Page.Canvas.prototype.hold = function(A, B) {
    if (B == null) {
        B = FoxSaver.preference.getDisplaySeconds() * 1000
    }
    this.timer.start(A, B)
};
FoxSaver.Page.Canvas.prototype.disappear = function(A) {
    this.effect({opacity: {from: 1, to: 0}}, "easeOut", A)
};
FoxSaver.Page.Canvas.prototype._drawImage = function(D, A, G, B, C, E, F) {
    this.hNew = C;
    if (F) {
        this.resizeCanvasForReflex()
    }
    this.context.save();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.translate(0, 0);
    if (E != 0) {
        this.context.rotate(E)
    }
    A = Math.ceil(A);
    G = Math.ceil(G);
    B = Math.ceil(B);
    C = Math.ceil(C);
    this.context.drawImage(D, A, G, B, C);
    if (F) {
        this.doReflex(D, A, (G + C), B, this.hNew - C)
    }
    this.context.restore()
};
FoxSaver.Page.Canvas.prototype.drawImage = function(G) {
    this.busy = true;
    this.canvas.style.opacity = 0;
    var I = G.width;
    var P = G.height;
    var E = 0;
    var C = 0;
    var F = this.setTilt();
    var D = (F == 0) ? this.isReflex() : false;
    if (F > 0) {
        I = Math.cos(F) * G.width + Math.sin(F) * G.height;
        P = Math.sin(F) * G.width + Math.cos(F) * G.height;
        E = Math.sin(F) * G.height;
        C = F < 0 ? -Math.sin(F) * G.width : 0
    } else {
        if (F < 0) {
            I = Math.cos(F) * G.width - Math.sin(F) * G.height;
            P = -Math.sin(F) * G.width + Math.cos(F) * G.height;
            E = 0;
            C = -Math.sin(F) * G.width
        }
    }
    var M = this.doc.body.clientWidth - 10;
    var N = this.doc.body.clientHeight - 10;
    if (N < 0) {
        N = 0
    }
    N = (D) ? Math.round(N * this.reflexRatio) : N;
    var L = FoxSaver.preference.isFitSmallPicturesToScreen();
    if (G.width > M || G.height > N) {
        L = true
    }
    this.smartFit((L) ? M : G.width, (L) ? N : G.height, I / P);
    var A = 1;
    if (F != 0) {
        A = 0.95
    }
    var O = this.canvas.height / P * A;
    var K = G.width * O;
    var B = G.height * O;
    var J = E * O + this.canvas.width * (1 - A) / 2;
    var H = C * O + this.canvas.height * (1 - A) / 2;
    this._drawImage(G, J, H, K, B, F, D)
};
FoxSaver.Page.Canvas.prototype.resizeTo = function(A, B) {
    this.canvas.width = A;
    this.canvas.height = B;
    FoxSaver.YUI.util.Dom.setStyle(this.canvas, "width", A + "px");
    FoxSaver.YUI.util.Dom.setStyle(this.canvas, "height", B + "px")
};
FoxSaver.Page.Canvas.prototype.center = function() {
    var A = this.doc.body.clientWidth;
    var B = this.doc.body.clientHeight;
    this.canvas.style.position = "absolute";
    this.canvas.style.left = ((A - this.canvas.width) / 2) + "px";
    this.canvas.style.top = ((B - this.canvas.height) / 2) + "px"
};
FoxSaver.Page.Canvas.prototype.fitHeight = function(A, B, C) {
    var A = Math.ceil(B * C);
    this.resizeTo(A, B);
    this.center()
};
FoxSaver.Page.Canvas.prototype.fitWidth = function(A, B, C) {
    var B = Math.ceil(A / C);
    this.resizeTo(A, B);
    this.center()
};
FoxSaver.Page.Canvas.prototype.smartFit = function(A, B, C) {
    if (A / B < C) {
        this.fitWidth(A, B, C)
    } else {
        this.fitHeight(A, B, C)
    }
};
FoxSaver.Page.Canvas.prototype.randomAngle = function() {
    var A = (Math.random() - 0.4) / 11;
    if (A < 0) {
        A -= 0.01
    }
    if (A > 0) {
        A += 0.02
    }
    return A
};
FoxSaver.Page.Canvas.prototype.setTilt = function() {
    if (!FoxSaver.preference.isTiltingImageEnabled()) {
        return 0
    }
    var A = Math.random();
    if (A > 0.8) {
        return this.randomAngle()
    }
    return 0
};
FoxSaver.Page.Canvas.prototype.isReflex = function() {
    if (!FoxSaver.preference.isImageReflectionEnabled()) {
        return false
    }
    var A = Math.random();
    if (A > 0.4) {
        return true
    }
    return false
};
FoxSaver.Page.Canvas.prototype.resizeCanvasForReflex = function() {
    this.hNew = Math.round(this.canvas.height / this.reflexRatio);
    var A = this.doc.body.clientHeight;
    if (this.canvas.height < A * this.reflexRatio) {
        this.hNew = A;
        if (A > this.canvas.height * 1.25) {
            this.hNew = Math.round(this.canvas.height * 1.25)
        }
    }
    this.canvas.height = this.hNew;
    FoxSaver.YUI.util.Dom.setStyle(this.canvas, "height", this.hNew + "px")
};
FoxSaver.Page.Canvas.prototype.doReflex = function(E, A, F, B, C) {
    this.context.save();
    this.context.translate(A, E.height + F - 1);
    this.context.scale(1, -1);
    this.context.drawImage(E, 0, 0, B, E.height);
    this.context.restore();
    this.context.globalCompositeOperation = "destination-out";
    var D = this.context.createLinearGradient(A, F, A, F + C);
    D.addColorStop(1, "rgba(255, 255, 255, 1.0)");
    D.addColorStop(0, "rgba(255, 255, 255, 0.3)");
    this.context.fillStyle = D;
    this.context.fillRect(A, F, B, C)
};
FoxSaver.Page.Canvas.prototype.free = function() {
    this.hide();
    this.busy = false
};
FoxSaver.Page.Canvas.prototype.isBusy = function() {
    return this.busy
}