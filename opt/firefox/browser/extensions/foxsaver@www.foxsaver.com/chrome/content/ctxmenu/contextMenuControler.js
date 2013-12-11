FoxSaver.contextMenuControler = function() {
    var A = this;
    this.mycontextMenuItems = new Array();
    this.ctxmenu = document.getElementById("contentAreaContextMenu");
    if (this.ctxmenu) {
        this.ctxmenu.addEventListener("popupshowing", function(B) {
            if (this == B.explicitOriginalTarget) {
                A.prepareContextMenu(B)
            }
        }, false)
    }
    FoxSaver.facebookmenu = new FoxSaver.FacebookMenu();
    FoxSaver.smugmugmenu = new FoxSaver.SmugmugMenu();
    FoxSaver.flickrmenu = new FoxSaver.FlickrMenu();
    FoxSaver.imgmenu = new FoxSaver.ImageMenu();
    FoxSaver.defaultmenu = new FoxSaver.DefaultMenu();
    this.registerMenuItem(FoxSaver.facebookmenu);
    this.registerMenuItem(FoxSaver.smugmugmenu);
    this.registerMenuItem(FoxSaver.flickrmenu);
    this.registerMenuItem(FoxSaver.imgmenu)
};
FoxSaver.contextMenuControler.prototype.prepareContextMenu = function(A) {
    for (var B in this.mycontextMenuItems) {
        this.mycontextMenuItems[B].prepareContextMenu(A)
    }
    for (var B in this.mycontextMenuItems) {
        if (this.mycontextMenuItems[B].isMenuShown()) {
            return
        }
    }
    this.defaultBehavior(A)
};
FoxSaver.contextMenuControler.prototype.registerMenuItem = function(A) {
    if (!A || !A.prepareContextMenu) {
        return
    }
    this.mycontextMenuItems.push(A)
};
FoxSaver.contextMenuControler.prototype.defaultBehavior = function(A) {
    FoxSaver.defaultmenu.prepareContextMenu(A)
}