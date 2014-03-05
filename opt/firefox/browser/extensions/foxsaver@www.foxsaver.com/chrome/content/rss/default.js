FoxSaver.Rss.Default = {};
FoxSaver.Rss.Default.getUrl = function(A) {
    return A
};
FoxSaver.Rss.Default.parse = function(H) {
    var G = new DOMParser();
    var F = G.parseFromString(H, "text/xml");
    if (F.documentElement.nodeName == "parsererror") {
        return[]
    }
    var A = F.getElementsByTagName("item");
    var B = [];
    var C;
    for (C = 0; C < A.length; C++) {
        B[C] = {};
        try {
            try {
                B[C].website = A[C].getElementsByTagName("link")[0].firstChild.nodeValue;
                B[C].title = A[C].getElementsByTagName("title")[0].firstChild.nodeValue
            } catch (E) {
            }
            if (A[C].getElementsByTagName("content").length > 0) {
                try {
                    B[C].src = A[C].getElementsByTagName("content")[0].getAttribute("url");
                    B[C].mediaType = FoxSaver.Util.isImage(B[C].src) ? "image" : "html";
                    B[C].description = A[C].getElementsByTagName("description")[0].firstChild.nodeValue;
                    B[C].author = A[C].getElementsByTagName("author")[0].firstChild.nodeValue
                } catch (E) {
                }
            } else {
                try {
                    B[C].src = A[C].getElementsByTagName("media:content")[0].getAttribute("url");
                    var D = A[C].getElementsByTagName("media:content")[0].getAttribute("type");
                    B[C].mediaType = D.indexOf("image") >= 0 ? "image" : "html";
                    B[C].description = A[C].getElementsByTagName("media:description")[0].firstChild.nodeValue
                } catch (E) {
                }
            }
        } catch (E) {
        }
    }
    return B
}