FoxSaver.Util.Timer = function() {
    this.timer = null
};
FoxSaver.Util.Timer.prototype.start = function(C, A) {
    this.stop();
    var B = this;
    this.timer = window.setTimeout(function() {
        B.timer = null;
        C()
    }, A)
};
FoxSaver.Util.Timer.prototype.stop = function() {
    if (this.timer) {
        window.clearTimeout(this.timer);
        this.timer = null
    }
}