FoxSaver.Rss.Smugmug = {};
FoxSaver.Rss.Smugmug.getUrl = function(C) {
    var B = [];
    if (C && C.indexOf("smugmug.com") > 0) {
        var E = C.split("&");
        var D;
        var A = false;
        for (D = 0; D < E.length; D++) {
            if (E[D].indexOf("format") == 0) {
            } else {
                if (E[D].indexOf("Size") == 0) {
                    B[B.length] = "Size=Large";
                    A = true
                } else {
                    B[B.length] = E[D]
                }
            }
        }
        if (!A) {
            B[B.length] = "Size=Large"
        }
        return B.join("&")
    }
    return null
};
FoxSaver.Rss.Smugmug.parse = function(C) {
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
            B[D].src = A[D].getElementsByTagName("enclosure")[0].getAttribute("url");
            B[D].author = A[D].getElementsByTagName("author")[0].firstChild.nodeValue;
            B[D].title = A[D].getElementsByTagName("title")[0].firstChild.nodeValue;
            B[D].description = A[D].getElementsByTagName("description")[0].firstChild.nodeValue
        } catch (E) {
        }
    }
    return B
};
FoxSaver.Rss.Smugmug.addCaseSetting = function() {
    FoxSaver.Rss.caseSettings.push({keyword: "smugmug.com", feed: FoxSaver.Rss.Smugmug})
};
FoxSaver.Rss.Smugmug.addCaseSetting()