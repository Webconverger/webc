FoxSaver.ImageMenu = function() {
    this.myClass = FoxSaver.ImageMenu;
    this.src = "";
    this.alt = "";
    this.cursite = "";
    this.myClass.superclass.constructor.call(this, "fs_user_submit_photo")
};
FoxSaver.YUI.lang.extend(FoxSaver.ImageMenu, FoxSaver.contextMenu);
FoxSaver.ImageMenu.prototype.isValidLink = function() {
    this.popNode = null;
    if (!document.popupNode) {
        return false
    }
    this.popNode = document.popupNode;
    var A = (this.popNode instanceof HTMLImageElement);
    if (!A) {
        return false
    }
    return true
};
FoxSaver.ImageMenu.prototype.testLink = function() {
    if (!this.popNode) {
        return false
    }
    var A = this.popNode;
    this.popNode = null;
    if (!A) {
        return false
    }
    var C = (A instanceof HTMLImageElement);
    if (!C || !A.src) {
        return false
    }
    if (A.width < 275) {
        return false
    }
    if (A.height < 275) {
        return false
    }
    var B = A.width / (A.height + 1);
    if (B > 4 || B < 0.25) {
        return false
    }
    this.src = A.src;
    if (A.src.indexOf("images/spaceball.gif") >= 0) {
        if (A.previousSibling && A.previousSibling.src) {
            this.src = A.previousSibling.src
        }
    }
    this.alt = A.alt;
    this.cursite = window.content.document.location.href;
    return true
};
FoxSaver.ImageMenu.prototype.onClick = function(B) {
    if (!this.testLink()) {
        return false
    }
    var C = (this.alt) ? this.alt : window.content.document.title;
    var D = "http://www.foxsaver.com";
    if (FoxSaver.debug) {
        D = "http://localhost:3000"
    }
    var A = D + "/submit?img_src=" + encodeURIComponent(this.src) + "&title=" + encodeURIComponent(C) + "&website=" + encodeURIComponent(this.cursite);
    FoxSaver.Util.newTab(A);
    this.src = ""
}