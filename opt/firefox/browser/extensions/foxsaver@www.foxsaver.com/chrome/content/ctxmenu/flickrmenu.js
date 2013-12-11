FoxSaver.FlickrMenu = function() {
    this.myClass = FoxSaver.FlickrMenu;
    this.myClass.superclass.constructor.call(this, "fs_preview_flickr_rss_photo")
};
FoxSaver.YUI.lang.extend(FoxSaver.FlickrMenu, FoxSaver.contextMenu);
FoxSaver.FlickrMenu.prototype.isValidLink = function() {
    var A = this.findLinkAsc(document.popupNode);
    if (A && A.href && A.href.toLowerCase().indexOf("format=rss") >= 0 && A.href.toLowerCase().indexOf("api.flickr.com/services/feeds/photos_") >= 0) {
        this.href = A.href;
        return true
    }
    return null
}