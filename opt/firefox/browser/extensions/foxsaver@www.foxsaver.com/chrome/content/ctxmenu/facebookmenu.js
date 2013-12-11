FoxSaver.FacebookMenu = function() {
    this.myClass = FoxSaver.FacebookMenu;
    this.myClass.superclass.constructor.call(this, "fs_preview_facebook_rss_photo")
};
FoxSaver.YUI.lang.extend(FoxSaver.FacebookMenu, FoxSaver.contextMenu);
FoxSaver.FacebookMenu.prototype.isValidLink = function() {
    return false;
    FoxSaver.log(location.href);
    var A = this.findLinkAsc(document.popupNode);
    if (A && A.href && A.href.toLowerCase().indexOf("facebook") > 0) {
        this.href = A.href;
        return true
    }
    return null
};
FoxSaver.FacebookMenu.prototype.onClick = function(A) {
    FoxSaver.log("hello facebook rss")
}