FoxSaver.Util.Buffer = function(A) {
    this.size = A;
    this.buffer = new Array();
    this.afterPush = null;
    this.afterShift = null
};
FoxSaver.Util.Buffer.prototype.occupancy = function() {
    return this.buffer.length
};
FoxSaver.Util.Buffer.prototype.isEmpty = function() {
    return this.buffer.length == 0
};
FoxSaver.Util.Buffer.prototype.isFull = function() {
    return this.buffer.length >= this.size
};
FoxSaver.Util.Buffer.prototype.overflow = function() {
    return this.buffer.length > this.size
};
FoxSaver.Util.Buffer.prototype._push = function(C, A, D) {
    this.buffer.push(C);
    if (this.afterPush != null) {
        var B = this.afterPush;
        this.afterPush = null;
        B()
    }
    A()
};
FoxSaver.Util.Buffer.prototype.push = function(C, A, D) {
    var B = this;
    if (this.isFull()) {
        this.afterShift = function() {
            B._push(C, A, D)
        }
    } else {
        B._push(C, A, D)
    }
};
FoxSaver.Util.Buffer.prototype._shift = function(A, D) {
    var C = this.buffer.shift();
    if (this.afterShift != null) {
        var B = this.afterShift;
        this.afterShift = null;
        B()
    }
    A(C)
};
FoxSaver.Util.Buffer.prototype.shift = function(A, C) {
    var B = this;
    if (this.isEmpty()) {
        this.afterPush = function() {
            B._shift(A, C)
        }
    } else {
        B._shift(A, C)
    }
};
FoxSaver.Util.Buffer.prototype.unshift = function(A) {
    this.buffer.unshift(A);
    this.trim()
};
FoxSaver.Util.Buffer.prototype.trim = function() {
    while (this.overflow()) {
        var A = this.buffer.length;
        var B = this.buffer.pop();
        this.buffer.length = A - 1;
        if (B.free) {
            B.free()
        }
    }
};
FoxSaver.Util.Buffer.prototype.peekTail = function() {
    if (this.isEmpty()) {
        return null
    }
    return this.buffer[this.buffer.length - 1]
};
FoxSaver.Util.Buffer.prototype.peekHead = function() {
    if (this.isEmpty()) {
        return null
    }
    return this.buffer[0]
};
FoxSaver.Util.Buffer.prototype.print = function(A) {
    if (A == null) {
        A = false
    }
    var B = this.buffer.map(function(C) {
        return C.currentImage.index
    });
    if (A) {
        B.reverse()
    }
    return B.join(", ")
}