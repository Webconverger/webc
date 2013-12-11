FoxSaver.SearchPageImage = function(A) {
    this.doc = A;
    this.bgDiv = null;
    this.canvasEl = null;
    this.searchEngine = null;
    this.id = "fs_searchpage_bk";
    this.tmpImg = new Image();
    this.tmpImg.onload = this.onload;
    this.imgSrc = ""
};
FoxSaver.SearchPageImage.prototype.setImage = function(A, E) {
    var C = this;
    FoxSaver.imageManager.randomize();
    var B = FoxSaver.imageManager.current();
    FoxSaver.imageManager.next();
    if (!B.src) {
        E();
        return
    }
    var D = FoxSaver.cache.lookup(B.src, function(F) {
        C.imgSrc = F;
        C.setImageAttribute();
        A()
    }, E);
    if (B.img_src_hash) {
        this.aboutDiv = this.doc.createElement("div");
        this.aboutDiv.innerHTML = '<a href="http://www.foxsaver.com/public/picture/' + B.img_src_hash + '">' + B.title + "</a>";
        this.bgDiv.appendChild(this.aboutDiv)
    }
};
FoxSaver.SearchPageImage.prototype.isSupportedPage = function() {
    var A = (this.doc.location.href) ? this.doc.location.href.toLowerCase() : "";
    var C = false;
    this.searchEngine = null;
    switch (A) {
        case"http://www.google.com/":
            this.searchEngine = "google";
            C = true;
            break;
        case"http://www.google.com/firefox":
            this.searchEngine = "gfox";
            C = true;
            break;
        case"http://search.yahoo.com/":
        case"http://search.yahoo.com/web":
            this.searchEngine = "yahoo";
            C = true;
            break;
        case"http://www.live.com/?searchonly=true&mkt=en-US":
        case"http://www.live.com/":
            this.searchEngine = "msn";
            C = true;
            break;
        case"http://www.baidu.com/":
            this.searchEngine = "baidu";
            C = true;
            break
    }
    if (A.indexOf("http://www.google.com/webhp") == 0) {
        var B = FoxSaver.Util.getParameter("q", A);
        if (B == null || B.length == 0) {
            this.searchEngine = "google";
            C = true
        }
    }
    if (A.indexOf("http://www.google.com/firefox") == 0) {
        var B = FoxSaver.Util.getParameter("q", A);
        if (B == null || B.length == 0) {
            this.searchEngine = "gfox";
            C = true
        }
    }
    return C
};
FoxSaver.SearchPageImage.prototype.setImageAttribute = function() {
    if (!this.canvasEl || !this.imgSrc) {
        return
    }
    this.tmpImg.src = this.imgSrc
};
FoxSaver.SearchPageImage.prototype._render = function(A, B) {
    this.bgDiv = this.doc.createElement("div");
    this.bgDiv.id = this.id + "_div";
    this.bgDiv.style.border = "0px";
    this.bgDiv.style.textAlign = "center";
    this.bgDiv.style.width = "100%";
    this.bgDiv.style.height = "auto";
    this.bgDiv.style.overflow = "hidden";
    this.bgDiv.style.margin = "10px";
    this.canvasEl = this.doc.createElement("canvas");
    this.canvasEl.id = this.id;
    this.bgDiv.appendChild(this.canvasEl);
    this.setImage(A, B)
};
FoxSaver.SearchPageImage.prototype.render = function() {
    var C = this;
    if (!this.isSupportedPage()) {
        return
    }
    var D = FoxSaver.preference.isDirty();
    var A = FoxSaver.imageManager.sourceExpired();
    var B = D || A;
    FoxSaver.log("reload: " + B);
    FoxSaver.imageManager.load(function() {
        C._render(FoxSaver.Util.nop, FoxSaver.Util.nop)
    }, B)
};
FoxSaver.SearchPageImage.prototype.onload = function() {
    var A = FoxSaver.searchPageImage;
    A.show()
};
FoxSaver.SearchPageImage.prototype.cpToCanvas = function() {
    if (!this.imgSrc || !this.canvasEl) {
        return false
    }
    var E = window.screen.availHeight - 500;
    if (E < 50) {
        E = 0
    }
    var B = this.tmpImg.width;
    var D = this.tmpImg.height;
    if (E < D) {
        var C = E / D;
        B = Math.round(B * C);
        D = E;
        this.tmpImg.width = B + "px";
        this.tmpImg.height = D + "px"
    }
    if (!B || !D || B < 10 || D < 10) {
        return false
    }
    this.canvasEl.style.width = B + "px";
    this.canvasEl.style.height = D + "px";
    this.canvasEl.width = B;
    this.canvasEl.height = D;
    var A = this.canvasEl.getContext("2d");
    A.save();
    A.clearRect(0, 0, B, D);
    A.translate(0, 0);
    A.drawImage(this.tmpImg, 0, 0, B, D);
    A.restore();
    return true
};
FoxSaver.SearchPageImage.prototype.show = function() {
    var E = this;
    if (!E.cpToCanvas()) {
        return
    }
    switch (this.searchEngine) {
        case"google":
            var D = this.doc.forms[0];
            if (D) {
                D.appendChild(this.bgDiv)
            }
            break;
        case"gfox":
            var C = this.doc.getElementById("frame");
            if (C && C.firstChild) {
                C.style.width = "80%";
                var H = this.doc.createElement("tr");
                var G = this.doc.createElement("td");
                H.appendChild(G);
                this.bgDiv.style.margin = "0 0 0 -10px";
                G.appendChild(this.bgDiv);
                C.firstChild.insertBefore(H, C.firstChild.childNodes[4]);
                var J = this.canvasEl.clientWidth;
                var B = C.firstChild.childNodes[3].clientWidth;
                if (B < J) {
                    C.style.width = J + "px"
                }
            }
            break;
        case"yahoo":
            var I = this.doc.getElementById("ft");
            if (I) {
                I.insertBefore(this.bgDiv, I.firstChild)
            }
            break;
        case"msn":
            var F = this.doc.getElementById("sc_hibr");
            if (F) {
                F.appendChild(this.bgDiv)
            }
            break;
        case"baidu":
            var A = this.doc.getElementById("km");
            if (A && A.parentNode) {
                A.parentNode.insertBefore(this.bgDiv, A)
            }
            break
    }
    this.addBehavior()
};
FoxSaver.SearchPageImage.prototype.addBehavior = function() {
    var A = this
}