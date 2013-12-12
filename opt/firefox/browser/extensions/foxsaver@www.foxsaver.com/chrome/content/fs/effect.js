FoxSaver.Effects = function(A) {
    this.effectLength = A;
    this.tilted = false;
    this.canvas = null;
    this.anim = null;
    this.imgObj = null;
    this.imgDescObj = null
};
FoxSaver.Effects.prototype.setup = function(A) {
    if (A.canvas) {
        this.canvas = A.canvas
    }
    if (A.anim) {
        this.anim = A.anim
    }
    if (A.image) {
        this.imgObj = A.image
    }
    if (A.currentImage) {
        this.imgDescObj = A.currentImage
    }
    this.ctx = FoxSaver.ctx;
    this.iframe = (A.iframe) ? A.iframe : null
};
FoxSaver.Effects.prototype.hideCanvas = function() {
    if (!this.canvas || !this.imgObj) {
        return
    }
    this.imgObj.style.display = "none";
    this.canvas.style.opacity = 0;
    this.canvas.style.width = "0px";
    this.canvas.style.height = "0px";
    this.canvas.width = 0;
    this.canvas.height = 0;
    this.canvas.style.border = ""
};
FoxSaver.Effects.prototype.hideall = function() {
    if (FoxSaver.slideImageElem) {
        FoxSaver.slideImageElem.style.display = "none"
    }
    if (!this.canvas || !this.imgObj) {
        return
    }
    this.imgObj.style.display = "none";
    this.canvas.style.opacity = 0
};
FoxSaver.Effects.prototype.centerElem = function(C) {
    if (!C || FoxSaver.slideshowDocument == null) {
        return
    }
    var A = FoxSaver.slideshowDocument.body.clientWidth;
    var B = FoxSaver.slideshowDocument.body.clientHeight;
    C.style.position = "absolute";
    C.style.left = ((A - C.width) / 2) + "px";
    C.style.top = ((B - C.height) / 2) + "px"
};
FoxSaver.Effects.prototype.repositionCanvas = function() {
    if (!this.canvas || !this.imgObj) {
        return
    }
    var J = this.imgObj.width;
    var G = this.imgObj.height;
    var F = FoxSaver.slideshowDocument.body.clientWidth - 10;
    var B = FoxSaver.slideshowDocument.body.clientHeight - 10;
    var E = J;
    var H = G;
    var I = 2.56;
    var D = F / J;
    var A = B / G;
    var C = Math.min(D, A);
    if (I >= 0) {
        if (C > I) {
            C = I
        }
    }
    E = Math.ceil(J * C);
    H = Math.ceil(G * C);
    this.canvas.width = E;
    this.canvas.height = H;
    FoxSaver.YUI.util.Dom.setStyle(this.canvas, "width", E + "px");
    FoxSaver.YUI.util.Dom.setStyle(this.canvas, "height", H + "px");
    this.centerElem(this.imgObj);
    this.centerElem(this.canvas)
};
FoxSaver.Effects.prototype.drawIFrame2Canvas = function() {
    if (!this.iframe) {
        return
    }
    this.repositionCanvas()
};
FoxSaver.Effects.prototype.drawCurImg2Canvas = function() {
    this.repositionCanvas();
    if (!this.canvas || !this.imgObj || !FoxSaver.ctx) {
        return
    }
    if (this.imgObj.width < 64 || this.imgObj.height < 64) {
        tilt = false
    }
    this.imgObj.style.display = "none";
    this.canvas.style.opacity = 0;
    var B = this.canvas.width;
    var E = this.canvas.height;
    FoxSaver.ctx.save();
    FoxSaver.ctx.clearRect(0, 0, B, E);
    FoxSaver.ctx.translate(0, 0);
    var D = 1;
    var A = 0;
    var F = 0;
    if (this.tilted) {
        D = 0.9;
        var C = (Math.random() - 0.4) / 11;
        if (C < 0) {
            C -= 0.01
        }
        if (C > 0) {
            C += 0.02
        }
        FoxSaver.ctx.rotate(C);
        A = Math.round(B * 0.05);
        F = Math.round(E * 0.05);
        if (C > 0) {
            A = Math.round(B * 0.07);
            F = Math.round(E * 0.03)
        }
    } else {
    }
    FoxSaver.ctx.drawImage(this.imgObj, A, F, Math.round(B * D), Math.round(E * D));
    FoxSaver.ctx.restore()
};
FoxSaver.Effects.prototype.showCurImg = function() {
    if (!this.canvas || !this.imgObj) {
        return
    }
    this.canvas.style.opacity = 1;
    this.imgObj.style.display = "none";
    this.imgObj.width = 0;
    this.imgObj.height = 0
};
FoxSaver.Effects.prototype.showWaitingClearImg = function(A) {
    if (!this.canvas || !this.imgObj) {
        return
    }
    this.canvas.style.opacity = 0;
    this.imgObj.width = 0;
    this.imgObj.height = 0;
    this.imgObj.style.display = "none";
    switch (A) {
        case"clear":
            this.imgObj.src = "chrome://foxsaver/skin/clear.gif";
            break;
        case"wait":
            this.imgObj.src = "chrome://foxsaver/skin/loading.gif";
            break;
        default:
            this.imgObj.src = "chrome://foxsaver/skin/loading.gif";
            break
        }
};
FoxSaver.Effects.prototype.randomPreEffect = function(A) {
    this.showImgDesc(true);
    this.hideall();
    var D = FoxSaver.preference.hasSpecialEffects();
    var C = 0;
    if (D) {
        C = Math.round(Math.random() * 2)
    }
    if (C > 2) {
        C = 2
    }
    var B = {};
    switch (C) {
        case 0:
        case 1:
            this.tilted = false;
            this.drawCurImg2Canvas();
            break;
        case 2:
            this.tilted = true;
            this.drawCurImg2Canvas();
            break
    }
    B.opacity = {from: 0, to: 1, unit: ""};
    if (this.anim) {
        this.anim.setup({"target": this.canvas, "duration": (FoxSaver.preference.hasFadeInOut() ? 2 : 0), "attributes": B, "method": "easeOut", "onComplete": A});
        this.anim.start()
    }
};
FoxSaver.Effects.prototype.randomPostEffect = function(I) {
    var C = FoxSaver.preference.hasSpecialEffects();
    var H = 0;
    if (C) {
        H = Math.round(Math.random() * 3)
    }
    if (H > 3) {
        H = 3
    }
    if (this.tilted) {
        H = 0
    }
    if (!this.canvas) {
        H = 0
    }
    var B = {};
    var A = "easeOut";
    switch (H) {
        case 0:
        case 1:
        case 2:
            B.opacity = {from: 1, to: 0, unit: ""};
            break;
        case 3:
            A = "backOut";
            var G = this.canvas.width;
            var D = this.canvas.height;
            var E = Math.round(Math.random() * G);
            var F = Math.round(Math.random() * D);
            B.points = {to: [E, F], control: [[800, 300], [-200, 400]], unit: ""};
            B.width = {from: G, to: 0, unit: "px"};
            B.height = {from: D, to: 0, unit: "px"};
            break
    }
    if (this.anim) {
        this.anim.setup({"target": this.canvas, "duration": (FoxSaver.preference.hasFadeInOut() ? 2 : 0), "attributes": B, "method": A, "onComplete": I});
        this.anim.start()
    }
};
FoxSaver.Effects.prototype.showImgDesc = function(A) {
    if (!A) {
        window.content.status = "";
        return
    }
    if (!this.imgDescObj) {
        return
    }
    var B = "";
    window.content.status = this.imgDescObj.getDescString()
}