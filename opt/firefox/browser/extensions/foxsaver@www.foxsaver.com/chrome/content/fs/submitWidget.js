FoxSaver.submitWidget = function(A) {
    this.doc = A;
    this.id = "fs_submit_img_dlg";
    this.aTestEl = null;
    this.curImgSrc = null;
    this.cursite = ""
};
FoxSaver.submitWidget.getSubmitWidget = function() {
    var A = "";
    A += '<div id="fs_submit_img_dlg" style="display:none;">';
    A += '<div class="hd">Please enter detail infor for this photo:</div>';
    A += '<div class="bd">';
    A += '<form action="http://www.foxsaver.com/submit" method="POST" name="foxsaveritForm" onsubmit="return false;">';
    A += "<table cellspacing=0 cellpadding=0 border=0>";
    A += "<tr>";
    A += '<td width=65><label class="mylabel" for="img_src">Image URL</label></div>';
    A += '<td><input class="textBox"  id="fsphotosrc" type="text" name="img_src" value="" ';
    A += 'onblur="onUpdPhotoSrc();" onkeydown="return myPhotoSrcKeyDown(event);"></td>';
    A += "</tr>";
    A += "<tr>";
    A += '<td width=65><label class="mylabel" for="website">Website</label></div>';
    A += '<td><input class="textBox"  id="fsphotosite" type="text" name="website" value="http://"></td>';
    A += "</tr>";
    A += "<tr>";
    A += '<td width=65><label class="mylabel" for="title">Title</label></td>';
    A += '<td width=100%><input class="textBox" id="fsphototitle" type="text" name="title" value=""></td>';
    A += "</tr>";
    A += "<tr>";
    A += '<td width=65><label class="mylabel" for="author">Author</label></div>';
    A += '<td><input class="textBox"  id="fsphotoauthor" type="text" name="author" value=""></td>';
    A += "</tr>";
    A += "<tr>";
    A += '<td width=65 valign="top"><label class="mylabel" for="author">Description</label></div>';
    A += '<td><textarea class="textBox"  id="fsphotodescription" name="description" rows="7"></textarea>';
    A += "</tr>";
    A += "<tr>";
    A += "<td width=65>&nbsp;</td>";
    A += "<td>";
    A += '<div id="buttonPanel" class="marL38">';
    A += '<button type="button" id="foxsaverRecBtn">';
    A += '<div class="outer"><div class="label" >Recommend</div></div>';
    A += "</button>&nbsp;&nbsp;";
    A += "<button type=\"button\" onclick=\"document.getElementById('fs_submit_img_dlg').style.display='none';\">";
    A += '<div class="outer"><div class="label">Cancel</div></div>';
    A += "</button>";
    A += "</div>";
    A += "</td>";
    A += "</tr>";
    A += "</table>";
    A += "</form>";
    A += "</div>";
    A += "</div>";
    return A
};
FoxSaver.submitWidgetPublic = function() {
    (function() {
        var A = {onFSPhotoRecommendSubmit: function() {
            }, showwnd: function(C) {
                var B = document.getElementById("fs_submit_img_dlg");
                if (C) {
                    B.style.display = ""
                } else {
                    B.style.display = "none"
                }
            }, handleSucSubmitImg: function() {
                this.showwnd(false)
            }, handleFailSubmitImg: function() {
                this.showwnd(false);
                alert("Error Occurs while trying to submit your recommended photos! Please Try Again;")
            }}
    })()
};
FoxSaver.submitWidget.prototype.onAjaxSuc = function(A) {
};
FoxSaver.submitWidget.prototype.onAjaxFail = function(A) {
    alert("Error in Connecting!")
};
FoxSaver.submitWidget.prototype.onRecBtnClick = function(E) {
    if (!E) {
        return
    }
    var F = "http://www.foxsaver.com/submit";
    E.hide(E);
    var A = {success: function(J) {
            var I = E.onAjaxSuc(J)
        }, failure: function(J) {
            var I = E.onAjaxFail(J)
        }};
    var H = E.doc.getElementById("fsphototitle");
    var D = E.doc.getElementById("fsphotoauthor");
    var C = E.doc.getElementById("fsphotosite");
    var G = E.doc.getElementById("fsphotodescription");
    var B = "resulttype=ajax";
    if (H) {
        B += "&phototitle=" + H
    }
    if (D) {
        B += "&photoauthor=" + D
    }
    if (C) {
        B += "&photosite=" + C
    }
    if (G) {
        B += "&photodescription=" + G
    }
    FoxSaver.YUI.util.Connect.asyncRequest("POST", F, A, B);
    return false
};
FoxSaver.submitWidget.prototype.render = function() {
    var F = this.doc;
    var B = this;
    if (!F.location || !F.location.href || F.location.href.indexOf("foxsaver") >= 0) {
        return
    }
    this.aTestEl = F.getElementById(this.id);
    if (this.aTestEl) {
        return
    }
    try {
        var G = FoxSaver.submitWidget.getSubmitWidget();
        var A = F.createElement("div");
        A.innerHTML = G;
        F.body.appendChild(A);
        var D = F.createElement("link");
        D.rel = "stylesheet";
        D.type = "text/css";
        D.href = "chrome://foxsaver/skin/submitWidget.css";
        F.body.appendChild(D);
        var C = F.getElementById("foxsaverRecBtn");
        FoxSaver.YUI.util.Event.on(C, "click", function() {
            B.onRecBtnClick(B)
        }, true);
        this.doc.foxsaveritForm.onsubmit = B.onRecBtnClick
    } catch (E) {
    }
};
FoxSaver.submitWidget.prototype.setContent = function(A, I, C, B, D) {
    FoxSaver.log(A + I + C + B + D);
    var J = this.doc.getElementById("fsphotosrc");
    if (J) {
        J.value = A ? A : ""
    }
    var H = this.doc.getElementById("fsphototitle");
    if (H) {
        H.value = I ? I : ""
    }
    var G = this.doc.getElementById("fsphotosite");
    if (G) {
        G.value = B ? B : ""
    }
    var F = this.doc.getElementById("fsphotoauthor");
    if (F) {
        F.value = C ? C : ""
    }
    var E = this.doc.getElementById("fsphotodescription");
    if (E) {
        E.value = D ? D : ""
    }
};
FoxSaver.submitWidget.prototype.hide = function(A) {
    if (!A) {
        A = this
    }
    if (!A.aTestEl) {
        A.aTestEl = A.doc.getElementById(this.id)
    }
    if (!A.aTestEl) {
        return
    }
    A.aTestEl.style.display = "none"
};
FoxSaver.submitWidget.prototype.show = function() {
    if (!this.aTestEl) {
        this.aTestEl = this.doc.getElementById(this.id)
    }
    if (this.aTestEl) {
        this.aTestEl.style.display = ""
    }
    var A = Math.round(this.doc.body.clientWidth / 2) - 200;
    var B = Math.round(this.doc.body.clientHeight / 2) - 150;
    if (A < 0) {
        A = 10
    }
    if (B < 0) {
        B = 10
    }
    var C = [A, B];
    FoxSaver.YUI.util.Dom.setXY(this.aTestEl, C)
};
FoxSaver.submitWidget.prototype.init = function() {
    if (!this.doc.body) {
        return
    }
    var D = this.doc.getElementsByTagName("head")[0];
    var A = this.doc.createElement("script");
    var C = " var fsTmpFunc = ";
    var B = " ; fsTmpFunc();";
    A.innerHTML = C + FoxSaver.submitWidgetPublic.toString() + B;
    if (D) {
        D.appendChild(A)
    } else {
        this.doc.body.appendChild(A)
    }
}