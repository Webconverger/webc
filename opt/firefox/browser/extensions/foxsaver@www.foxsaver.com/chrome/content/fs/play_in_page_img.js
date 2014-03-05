FoxSaver.PlayInPage = function(A) {
    this.doc = A;
    this.id = "fs_play_button_in_page";
    this.sourceType = "unknown";
    this.source = null
};
FoxSaver.PlayInPage.prototype.render = function() {
    if (this.doc && this.doc.title && this.doc.title == "FoxSaver") {
        return
    }
    var A = this.doc.createElement("div");
    A.id = this.id;
    A.style.border = "5px solid #474645";
    A.style.borderRight = "1px solid white";
    A.style.position = "fixed";
    A.style.padding = "0px 5px 1px 0px";
    A.style.width = "145px";
    A.style.height = "20px";
    A.style.cursor = "pointer";
    A.style.fontWeight = "bold";
    A.style.fontSize = "13px";
    A.style.bottom = "0px";
    A.style.right = "0px";
    A.style.zIndex = "1000";
    A.style.overflow = "hidden";
    A.style.opacity = "0";
    A.style.backgroundColor = "#2E1E17";
    A.style.color = "#D3D3FF";
    A.innerHTML = '<img src="chrome://foxsaver/skin/icons/fsHide.png" width=15 height=20 onclick="  \
       var tEl=document.getElementById(\'' + this.id + '\');if (tEl) tEl.style.display=\'none\';  \
      " style="float:left;margin:0px;padding:0px;border:0;">  \
      <div id="fsplaybtn" style="float:left;width:122px;font:bold 13px Arial;margin:3px 5px 1px 3px;overflow:hidden;white-space:nowrap;"> \
      Play by FoxSaver&reg;</div><div id="fs_dd_handle_area" class="dd-handle" onclick=""  \
      style="position:absolute;top:0px;left:143px;float:right;width:15px;height:28px; \
      clear:right;background:#505E45;cursor:move;">   \
      </div>';
    this.doc.body.appendChild(A);
    this.addBehavior()
};
FoxSaver.PlayInPage.prototype.addBehavior = function() {
    var B = this;
    var A = this.doc.getElementById("fsplaybtn");
    FoxSaver.YUI.util.Event.on(A, "click", function() {
        B.getImgSrc(function() {
            FoxSaver.imageManager.setTempSource(B.source);
            FoxSaver.fs.start(true)
        }, function() {
            alert("No valid images are found in this page.")
        })
    }, true);
    this.draggable()
};
FoxSaver.PlayInPage.prototype.draggable = function() {
    if (!this.doc.body) {
        return
    }
    var C = this.doc.getElementsByTagName("head")[0];
    var B = this.doc.createElement("script");
    var A = 'function myFoxSaverReady() {if (!FoxSaver.YUI) return;foxsaver_dd = new FoxSaver.YUI.util.DD("fs_play_button_in_page");foxsaver_dd.setHandleElId("fs_dd_handle_area");  ';
    A += "var anim = new FoxSaver.YUI.util.Anim(\"" + this.id + '", {duration:0.3,height: {from:0,to:20},opacity: { from:0,to:0.8}});anim.animate();};';
    A += "FoxSaver.YUI.util.Event.onAvailable(\"" + this.id + '",myFoxSaverReady);';
    B.innerHTML = A;
    if (C) {
        C.appendChild(B)
    } else {
        this.doc.body.appendChild(B)
    }
};
FoxSaver.PlayInPage.prototype.getRssSrc = function(A, F) {
    var D = this;
    var E = null;
    var C = this.doc.getElementsByTagName("link");
    for (var B = 0; B < C.length; B++) {
        if (FoxSaver.Util.isValidHeaderLinkEl(C[B])) {
            E = FoxSaver.plusSource(E, FoxSaver.Rss.source(C[B].href))
        }
    }
    if (E) {
        E.validate(function() {
            D.sourceType = "rss";
            D.source = E;
            A()
        }, F)
    } else {
        F()
    }
};
FoxSaver.PlayInPage.prototype.getElSrc = function(B, F) {
    var A = new Array();
    for (var D = 0; D < this.doc.images.length; D++) {
        var C = this.doc.images[D];
        if (FoxSaver.Util.isBigPicture(C)) {
            A.push(C)
        }
    }
    if (A && A.length > 2) {
        var E = new FoxSaver.ElSource(A);
        this.sourceType = "el";
        this.source = E;
        B()
    } else {
        F()
    }
};
FoxSaver.PlayInPage.prototype.testImgSrc = function(A, E) {
    var D = this;
    var C = function(G, F) {
        D.getRssSrc(G, F)
    };
    for (var B = 0; B < 10; B++) {
        C = FoxSaver.Util.or(C, function(G, F) {
            if (D.sourceType == "unknown") {
                window.setTimeout(function() {
                    D.getElSrc(G, F)
                }, 1000)
            } else {
                G()
            }
        })
    }
    C(A, E)
};
FoxSaver.PlayInPage.prototype.getImgSrc = function(A, C) {
    var B = this;
    FoxSaver.log(this.sourceType);
    switch (this.sourceType) {
        case"rss":
            A();
            break;
        case"el":
            this.getElSrc(A, C);
            break;
        default:
            C()
        }
};
FoxSaver.PlayInPage.prototype.isBlackRSSSite = function(A) {
    if (A.toLowerCase().indexOf("netvouz") >= 0) {
        return true
    }
    return false
};
FoxSaver.PlayInPage.prototype.show = function() {
    var B = this;
    if (!this.doc || !this.doc.location || !this.doc.location.href || B.isBlackRSSSite(this.doc.location.href)) {
        return false
    }
    var A = this.doc.location.href;
    if (!FoxSaver.Util.isHttp(A) || FoxSaver.Util.checkAds(A.toLowerCase())) {
        return false
    }
    FoxSaver.fs.stop();
    this.testImgSrc(function() {
        B.render()
    }, function() {
    })
}