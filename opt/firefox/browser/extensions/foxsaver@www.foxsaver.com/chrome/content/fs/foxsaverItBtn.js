FoxSaver.FoxSaverItBtn = function(A) {
    this.doc = A;
    this.id = "fs_it_btn_for_img";
    this.btnEl = null;
    this.curImgSrc = null;
    this.cursite = ""
};
FoxSaver.FoxSaverItBtn.prototype.render = function() {
    var A = this.doc.createElement("div");
    A.id = this.id;
    A.style.display = "none";
    A.style.border = "2px solid #474645";
    A.style.borderRight = "1px solid white";
    A.style.position = "absolute";
    A.style.padding = "3px 5px 1px 5px";
    A.style.width = "70px";
    A.style.height = "15px";
    A.style.cursor = "pointer";
    A.style.fontWeight = "bold";
    A.style.fontSize = "12px";
    A.style.top = "0px";
    A.style.left = "0px";
    A.style.zIndex = "1000";
    A.style.overflow = "hidden";
    A.style.opacity = "0.7";
    A.style.backgroundColor = "#2E1E17";
    A.style.color = "#FFFFFF";
    A.innerHTML = "FoxSaverIt&reg;";
    this.doc.body.appendChild(A);
    this.btnEl = A;
    this.addBehavior()
};
FoxSaver.FoxSaverItBtn.prototype.addBehaviorForOneImg = function(B) {
    var A = this;
    if (B.src == "http://l.yimg.com/www.flickr.com/images/spaceball.gif") {
        B.style.display = "none";
        return
    }
    if (!FoxSaver.Util.isBigPicture(B)) {
        return
    }
    FoxSaver.YUI.util.Event.on(B, "mouseover", function(D) {
        if (!B.src) {
            return
        }
        A.curImgSrc = null;
        if (B.width < 300 || B.height < 200) {
            return
        }
        A.curImgSrc = B.src;
        var C = FoxSaver.YUI.util.Dom.getXY(B);
        A.btnEl.style.display = "block";
        A.btnEl.style.top = (C[1] + 2) + "px";
        A.btnEl.style.left = (C[0] + 2) + "px"
    }, true);
    FoxSaver.YUI.util.Event.on(B, "mouseout", function(F) {
        var E = FoxSaver.YUI.util.Event.getXY(F);
        var G = FoxSaver.YUI.util.Dom.getXY(B);
        var C = B.width;
        var D = B.height;
        if (E[0] > G[0] && E[0] < (G[0] + C) && E[1] > G[1] && E[1] < (G[1] + D)) {
            return
        }
        A.hide()
    }, true)
};
FoxSaver.FoxSaverItBtn.prototype.addBehavior = function() {
    var A = this;
    FoxSaver.YUI.util.Event.on(this.btnEl, "click", function() {
        A.onClickFsItBtn()
    }, true);
    FoxSaver.YUI.util.Event.on(this.btnEl, "mouseout", function(C) {
        var B = FoxSaver.YUI.util.Event.getTarget(C);
        if (B && B.tagName != "IMG") {
            A.hide()
        }
    }, true)
};
FoxSaver.FoxSaverItBtn.prototype.hide = function() {
    if (!this.btnEl) {
        return
    }
    this.btnEl.style.display = "none"
};
FoxSaver.FoxSaverItBtn.prototype.init = function() {
    var A = this;
    FoxSaver.YUI.util.Event.on(this.doc.defaultView, "load", function(B) {
        A.show()
    }, false)
};
FoxSaver.FoxSaverItBtn.prototype.show = function() {
    var E = this;
    if (!this.doc || !this.doc.location || !this.doc.location.href || this.doc.location.protocol.indexOf("http") < 0 || !this.doc.location.host || !this.doc.images || this.doc.images.length < 1) {
        return false
    }
    var C = this.doc.location.host.toLowerCase();
    var B = ["flickr", "picasaweb", "smugmug", "pbase"];
    var A = false;
    B.map(function(F) {
        if (C.indexOf(F) >= 0 && !A) {
            A = true;
            E.render()
        }
    });
    if (!A) {
        return
    }
    for (var D = 0; D < this.doc.images.length; D++) {
        E.addBehaviorForOneImg(this.doc.images[D])
    }
    this.cursite = window.content.document.location.href
};
FoxSaver.FoxSaverItBtn.prototype.onClickFsItBtn = function() {
    var B = (this.alt) ? this.alt : window.content.document.title;
    var C = "http://www.foxsaver.com";
    if (FoxSaver.debug) {
        C = "http://localhost:3000"
    }
    var A = C + "/submit?img_src=" + encodeURIComponent(this.curImgSrc) + "&title=" + encodeURIComponent(B) + "&website=" + encodeURIComponent(this.cursite);
    FoxSaver.Util.newTab(A)
}