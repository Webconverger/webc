FoxSaver.SmugmugMenu = function() {
    this.myClass = FoxSaver.SmugmugMenu;
    this.myClass.superclass.constructor.call(this, "fs_preview_smugmug_rss_photo")
};
FoxSaver.YUI.lang.extend(FoxSaver.SmugmugMenu, FoxSaver.contextMenu);
FoxSaver.SmugmugMenu.prototype.isValidLink = function() {
    var A = this.findLinkAsc(document.popupNode);
    if (A && A.href && A.href.toLowerCase().indexOf("format=rss200") > 0 && A.href.toLowerCase().indexOf("smugmug.com/hack/feed.mg") > 0) {
        this.href = A.href;
        return true
    }
    return null
}