FoxSaver.Util.ResourceManager = function() {
    this.resources = new Array()
};
FoxSaver.Util.ResourceManager.prototype.length = function() {
    return this.resources.length
};
FoxSaver.Util.ResourceManager.prototype.getResource = function() {
    var A = this.findIdlingResource();
    if (A) {
        return A
    }
    A = this.newResource();
    if (A) {
        this.resources.push(A);
        return A
    }
    return null
};
FoxSaver.Util.ResourceManager.prototype.findIdlingResource = function() {
    for (var A = 0; A < this.resources.length; A++) {
        var B = this.resources[A];
        if (!B.isBusy()) {
            return B
        }
    }
    return null
};
FoxSaver.Util.ResourceManager.prototype.newResource = function() {
    return null
};
FoxSaver.Util.ResourceManager.prototype.freeAll = function() {
    this.resources.map(function(A) {
        A.free()
    })
};
FoxSaver.Util.ResourceManager.prototype.clear = function() {
    this.resources = new Array()
}