FoxSaver.Util.Ajax = function(A) {
    this.action = A.action;
    this.args = FoxSaver.Util.dig(A, "args", []);
    this.onSuccess = FoxSaver.Util.dig(A, "onSuccess", FoxSaver.Util.nop);
    this.onFailure = FoxSaver.Util.dig(A, "onFailure", FoxSaver.Util.nop);
    this.finallyDo = FoxSaver.Util.dig(A, "finallyDo", FoxSaver.Util.nop)
};
FoxSaver.Util.Ajax.prototype.url = function() {
    var A = [this.action, this.argStr()];
    return A.join("")
};
FoxSaver.Util.Ajax.prototype.argStr = function() {
    var A = [];
    for (var B in this.args) {
        A.push(B + "=" + encodeURIComponent(this.args[B]))
    }
    var C = A.join("&");
    if (C != "") {
        C = "?" + C
    }
    return C
};
FoxSaver.Util.Ajax.prototype.exe = function() {
    var B = this;
    var A = {success: function(D) {
            var C = B.onSuccess(D);
            B.finallyDo(C)
        }, failure: function(D) {
            var C = B.onFailure(D);
            B.finallyDo(C)
        }};
    FoxSaver.YUI.util.Connect.asyncRequest("GET", this.url(), A)
};
FoxSaver.Util.Ajax.prototype.stop = function() {
    this.onSuccess = FoxSaver.Util.nop;
    this.onFailure = FoxSaver.Util.nop
}