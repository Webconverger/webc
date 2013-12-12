FoxSaver.PlusSource = function(B, A) {
    this.s1 = B;
    this.s2 = A
};
FoxSaver.PlusSource.prototype.expired = function() {
    return this.s1.expired() || this.s2.expired()
};
FoxSaver.PlusSource.prototype.validate = function(A, D) {
    var B = this;
    var C = FoxSaver.Util.por(function(F, E) {
        B.s1.validate(F, E)
    }, function(F, E) {
        B.s2.validate(F, E)
    });
    C(A, D)
};
FoxSaver.PlusSource.prototype.load = function(A, D) {
    var C = this;
    var B = FoxSaver.Util.por(function(F, E) {
        C.s1.load(F, E)
    }, function(F, E) {
        C.s2.load(F, E)
    });
    B(A, D)
};
FoxSaver.plusSource = function(B, A) {
    if (!B) {
        return A
    }
    if (!A) {
        return B
    }
    return new FoxSaver.PlusSource(B, A)
};
FoxSaver.PlusSource.prototype.stop = function() {
    this.s1.stop();
    this.s2.stop()
}