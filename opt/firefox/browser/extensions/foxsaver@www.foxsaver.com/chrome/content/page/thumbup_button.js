FoxSaver.Page.ThumbUpButton = function(A) {
    this.myClass = FoxSaver.Page.ThumbUpButton;
    this.myClass.superclass.constructor.call(this, A, "foxsaverthumbup", FoxSaver.Util.localize("buttonThumbup"));
    this.imgId = ""
};
FoxSaver.YUI.lang.extend(FoxSaver.Page.ThumbUpButton, FoxSaver.Page.ToolbarButton);
FoxSaver.Page.ThumbUpButton.prototype.onClick = function() {
    this.sendAjax()
};
FoxSaver.Page.ThumbUpButton.prototype.setImageId = function(A) {
    this.imgId = "";
    if (A && FoxSaver.loginStatus && FoxSaver.loginStatus.login) {
        FoxSaver.thumbButton.show();
        this.imgId = A
    } else {
        this.hide()
    }
};
FoxSaver.Page.ThumbUpButton.prototype.sendAjax = function() {
    if (!this.imgId) {
        return
    }
    var A = {success: function(C) {
            FoxSaver.log("Thumb up suc")
        }, failure: function(C) {
            FoxSaver.log("Thumb up fail")
        }};
    var B = "http://www.foxsaver.com/public/vote_up/" + this.imgId;
    FoxSaver.YUI.util.Connect.asyncRequest("GET", B, A)
}