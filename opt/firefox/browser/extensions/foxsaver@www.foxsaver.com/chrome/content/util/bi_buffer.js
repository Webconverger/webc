FoxSaver.Util.BiBuffer = function(A, B) {
    this.size = A;
    this.prevBuffer = new FoxSaver.Util.Buffer(A);
    this.nextBuffer = new FoxSaver.Util.Buffer(A);
    this.setDirection(B)
};
FoxSaver.Util.BiBuffer.prototype.occupancy = function() {
    return this.prevBuffer.occupancy + this.nextBuffer.occupancy
};
FoxSaver.Util.BiBuffer.prototype.peekTail = function() {
    var A = this.buffer.peekTail();
    if (A == null) {
        A = this.otherBuffer.peekHead()
    }
    return A
};
FoxSaver.Util.BiBuffer.prototype.setDirection = function(B) {
    this.direction = B;
    switch (B) {
        case"prev":
            this.buffer = this.prevBuffer;
            this.otherBuffer = this.nextBuffer;
            break;
        case"next":
            this.buffer = this.nextBuffer;
            this.otherBuffer = this.prevBuffer;
            break;
        default:
    }
    if (!this.buffer.isEmpty()) {
        var A = this.buffer.buffer.shift();
        this.otherBuffer.buffer.unshift(A)
    }
};
FoxSaver.Util.BiBuffer.prototype.push = function(B, A, C) {
    this.buffer.push(B, A, C)
};
FoxSaver.Util.BiBuffer.prototype.shift = function(A, C) {
    var B = this;
    this.buffer.shift(function(D) {
        B.otherBuffer.unshift(D);
        A(D)
    }, C)
};
FoxSaver.Util.BiBuffer.prototype.print = function() {
    var A = "[" + this.prevBuffer.print(true) + " | " + this.nextBuffer.print() + "]";
    return A
};
FoxSaver.Util.BiBuffer.prototype.log = function() {
    FoxSaver.log(this.print())
}