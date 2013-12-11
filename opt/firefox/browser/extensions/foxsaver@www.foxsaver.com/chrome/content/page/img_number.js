FoxSaver.Page.ImgNumber = function(A) {
    this.doc = A;
    this.imginfo = null;
    this.id = "foxsaver_img_number"
};
FoxSaver.Page.ImgNumber.prototype.setTotal = function(A) {
    this.total = A
};
FoxSaver.Page.ImgNumber.prototype.setIndex = function(A, B) {
    this.index = A;
    this.imginfo = B;
    this.reDraw()
};
FoxSaver.Page.ImgNumber.prototype.getEl = function() {
    return this.doc.getElementById(this.id)
};
FoxSaver.Page.ImgNumber.prototype.reDraw = function() {
    if (this.index && this.total) {
        var A = this.getEl();
        A.innerHTML = "";
        A.innerHTML = this.index + "/" + this.total;
        if (this.imginfo && this.imginfo.title) {
            A.innerHTML += "<br>" + this.imginfo.title;
            if (this.imginfo.author) {
                A.innerHTML += " By " + this.imginfo.author
            }
        }
    }
}