FoxSaver.Page.MenuBarBtn = function(C) {
    var B = this;
    this.doc = C;
    var A = C.getElementById("body");
    this.pauseBtn = C.getElementById("pauseplay");
    this.pageVarHolderEl = C.getElementById("hiddenVarContainer");
    if (!A) {
        return
    }
    FoxSaver.YUI.util.Event.on(A, "click", function(D) {
        B.onClick(D)
    }, true)
};
FoxSaver.Page.MenuBarBtn.prototype.onClick = function(C) {
    var B = this;
    var A = FoxSaver.YUI.util.Event.getTarget(C);
    if (A && A.className) {
        switch (A.className) {
            case"fs_ctl_btn":
                if (A.id) {
                    this.onIDBtnClick(A)
                }
                break;
            case"fs_ctl_img":
                this.onOverviewImgClick(A);
                break;
            default:
                break
            }
    }
};
FoxSaver.Page.MenuBarBtn.prototype.onIDBtnClick = function(A) {
    switch (A.id) {
        case"pauseplay":
            if (this.getPlayPauseState(A) == "play") {
                this.pausing(A)
            } else {
                this.playing(A)
            }
            break;
        case"prev":
            this.prev(A);
            break;
        case"next":
            this.next(A);
            break;
        case"close":
            this.close(A);
            break;
        default:
            break
        }
};
FoxSaver.Page.MenuBarBtn.prototype.onOverviewImgClick = function(A) {
    this.pausing(this.pauseBtn);
    var B = A.id.replace("fs_index_", "")
};
FoxSaver.Page.MenuBarBtn.prototype.getPlayPauseState = function(A) {
    if (A.src == "chrome://foxsaver/skin/icons/fsPlay.png") {
        return"pause"
    }
    if (A.src == "chrome://foxsaver/skin/icons/fsPause.png") {
        return"play"
    }
    return null
};
FoxSaver.Page.MenuBarBtn.prototype.pausing = function(A) {
    if (this.getPlayPauseState(A) == "play") {
        A.src = "chrome://foxsaver/skin/icons/fsPlay.png";
        FoxSaver.fs.action.pause()
    }
};
FoxSaver.Page.MenuBarBtn.prototype.playing = function(A) {
    if (this.getPlayPauseState(A) == "pause") {
        A.src = "chrome://foxsaver/skin/icons/fsPause.png";
        FoxSaver.fs.action.on()
    }
};
FoxSaver.Page.MenuBarBtn.prototype.prev = function(A) {
    this.pausing(this.pauseBtn);
    FoxSaver.fs.action.prev()
};
FoxSaver.Page.MenuBarBtn.prototype.next = function(A) {
    this.pausing(this.pauseBtn);
    FoxSaver.fs.action.next()
};
FoxSaver.Page.MenuBarBtn.prototype.close = function(A) {
    FoxSaver.fs.stop()
};
FoxSaver.Page.MenuBarBtn.prototype.setLoadedImage = function(A) {
    if (!this.pageVarHolderEl) {
        return
    }
    var D = {1: "http://www.smugmug.com/photos/181195055-O.jpg", 2: "http://www.smugmug.com/photos/181195077-O.jpg", 6: "http://www.smugmug.com/photos/181195118-O.jpg", 9: "http://www.smugmug.com/photos/181195140-O.jpg", 10: "http://www.smugmug.com/photos/181195151-O.jpg", 12: "http://www.smugmug.com/photos/181195167-O.jpg", 16: "http://www.smugmug.com/photos/181195055-O.jpg", 19: "http://www.smugmug.com/photos/181195077-O.jpg", 20: "http://www.smugmug.com/photos/181195118-O.jpg", 22: "http://www.smugmug.com/photos/181195055-O.jpg", 26: "http://www.smugmug.com/photos/181195140-O.jpg", 29: "http://www.smugmug.com/photos/181195151-O.jpg", 30: "http://www.smugmug.com/photos/181195267-O.jpg"};
    var C = "([";
    for (var B in D) {
        C += "{0:" + B + ",1:\"" + D[B] + '"},'
    }
    C += "{}])";
    this.pageVarHolderEl.innerHTML = C
}