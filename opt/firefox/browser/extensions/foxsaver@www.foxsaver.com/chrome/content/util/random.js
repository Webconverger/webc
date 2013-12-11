FoxSaver.Util.Random = function() {
    this.range = 0;
    this.step = 0;
    this.sequence = new Array();
    this.lastNum = 0
};
FoxSaver.Util.Random.prototype.setRange = function(B, A) {
    if (A == null) {
        A = false
    }
    this.range = B;
    this.reset(A)
};
FoxSaver.Util.Random.prototype.reset = function(A) {
    if (A == null) {
        A = false
    }
    this.sequence = FoxSaver.Util.natList(this.range);
    if (!A) {
        FoxSaver.Util.arrayPermute(this.sequence);
        if (this.lastNum == this.sequence[0]) {
            FoxSaver.Util.arraySwap(this.sequence, 0, this.sequence.length - 1)
        }
    }
    this.step = 0
};
FoxSaver.Util.Random.prototype.getNumber = function() {
    if (this.step < 0 || this.step >= this.range) {
        this.reset()
    }
    var A = this.sequence[this.step];
    this.step++;
    this.lastNum = A;
    return A
}