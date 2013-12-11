FoxSaver.Rss.Flickr = {};
FoxSaver.Rss.Flickr.getUrl = function(A) {
    return A
};
FoxSaver.Rss.Flickr.parse = function(C) {
    FoxSaver.log("flickr parse");
    var G = new DOMParser();
    var F = G.parseFromString(C, "text/xml");
    if (F.documentElement.nodeName == "parsererror") {
        return[]
    }
    var A = F.getElementsByTagName("item");
    var B = [];
    var D;
    for (D = 0; D < A.length; D++) {
        B[D] = {};
        try {
            B[D].src = A[D].getElementsByTagName("media:content")[0].getAttribute("url");
            if (B[D].src != null && B[D].src.indexOf("_m.jpg") > 0) {
                B[D].src = B[D].src.replace(/_\w.jpg/, ".jpg")
            }
            B[D].author = A[D].getElementsByTagName("author")[0].firstChild.nodeValue;
            B[D].title = A[D].getElementsByTagName("media:title")[0].firstChild.nodeValue;
            B[D].website = A[D].getElementsByTagName("link")[0].firstChild.nodeValue;
            B[D].description = A[D].getElementsByTagName("description")[0].firstChild.nodeValue
        } catch (E) {
            FoxSaver.log(E)
        }
    }
    return B
};
FoxSaver.Rss.Flickr.addCaseSetting = function() {
    FoxSaver.Rss.caseSettings.push({keyword: "flickr.com", feed: FoxSaver.Rss.Flickr})
};
FoxSaver.Rss.Flickr.addCaseSetting()