FoxSaver.Page.Button = function(B, D, C) {
    var A = this;
    this.doc = B;
    this.id = D;
    this.dom = B.getElementById(D);
    if (!this.dom) {
        return
    }
    this.dom.title = C ? C : FoxSaver.Util.localize("helloMessage");
    this.dom.addEventListener("click", function(E) {
        A.onClick()
    }, true);
    this.enabled = true
};
FoxSaver.Page.Button.prototype.hide = function() {
    if (!this.dom) {
        return
    }
    this.dom.style.visibility = "hidden"
};
FoxSaver.Page.Button.prototype.show = function() {
    if (!this.dom) {
        return
    }
    if (this.enabled) {
        this.dom.style.visibility = "visible"
    }
};
FoxSaver.Page.Button.prototype.onClick = function() {
};
FoxSaver.Page.Button.prototype.disable = function() {
    FoxSaver.log("this is disabled now");
    this.enabled = false
}