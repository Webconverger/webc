FoxSaver.gStringBundle = null;
FoxSaver.gBundle = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
FoxSaver.autoslidestrings = FoxSaver.gBundle.createBundle("chrome://foxsaver/locale/foxsaver.properties");
FoxSaver.Util.isUrl = function(A) {
    var B = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return B.test(A)
};
FoxSaver.Util.setLoginStatus = function(D, A, C) {
    try {
        FoxSaver.preference.setBool("login_session", D);
        if (A) {
            FoxSaver.preference.setString("foxsaver_user_name", A)
        }
        FoxSaver.preference.setString("foxsaver_user_password", C)
    } catch (B) {
    }
};
FoxSaver.Util.getLoginStatus = function(A) {
    E = "";
    try {
        A.login = FoxSaver.preference.getBool("login_session");
        A.uname = FoxSaver.preference.getString("foxsaver_user_name");
        A.pwd = FoxSaver.preference.getString("foxsaver_user_password");
        var B = FoxSaver.Util.getLocalStr("LoginMenuTextOn");
        var C = FoxSaver.Util.getLocalStr("LoginMenuTextOff");
        var E = B;
        if (A.login) {
            E = C
        }
    } catch (D) {
    }
    return E
};
FoxSaver.Util.openHTMLpageInNewTab = function(B) {
    if (!B || !FoxSaver.Util.isUrl(B)) {
        FoxSaver.log("Not a valid html page, Can not open");
        return false
    }
    var A = -1;
    var D = gBrowser.browsers.length;
    var G = null;
    var H = null;
    for (var C = 0; C < D; C++) {
        G = gBrowser.getBrowserAtIndex(C);
        H = gBrowser.mTabContainer.childNodes[C];
        try {
            var I = B.toLowerCase();
            var E = (G.homePage) ? G.homePage.toLowerCase() : "";
            if (I === E) {
                FoxSaver.log("found home page");
                A = C;
                if (H !== gBrowser.selectedTab) {
                    gBrowser.selectedTab = H;
                    G.goHome()
                }
                return true
            }
        } catch (F) {
            Components.utils.reportError(F);
            return false
        }
    }
    H = gBrowser.addTab(B);
    gBrowser.selectedTab = H;
    G = gBrowser.getBrowserForTab(H);
    G.homePage = B;
    return true
};
FoxSaver.Util.isBigPicture = function(C) {
    var A = C.width ? C.width : 0;
    var B = C.height ? C.height : 0;
    var D = (C.src != null && C.src.indexOf("icon") < 0 && C.src.indexOf("button") < 0 && C.src.indexOf("open") < 0 && C.src.indexOf("close") < 0 && C.src.indexOf("marker") < 0 && C.src.indexOf("arrow") < 0 && C.src.indexOf("slider") < 0 && C.src.indexOf("map") < 0 && C.src.indexOf("transparent") < 0 && C.src.indexOf("spaceball") < 0 && FoxSaver.Util.isImage(C.src) && A > 300 && B > 200);
    return D
};
FoxSaver.Util.getLocalStr = function(A) {
    try {
        var C = FoxSaver.autoslidestrings.GetStringFromName(A);
        if (C) {
            return C
        }
    } catch (B) {
    }
    return""
};
FoxSaver.Util.mapDom = function(D, C) {
    if (!D) {
        return
    }
    C(D);
    var B = D.childNodes;
    for (var A = 0; A < B.length; A++) {
        FoxSaver.Util.mapDom(B[A], C)
    }
};
FoxSaver.Util.dig = function(C, B, A) {
    if (typeof (C[B]) == "undefined") {
        return A
    }
    return C[B]
};
FoxSaver.Util.hr2ms = function(A) {
    return A * 3600000
};
FoxSaver.Util.nop = function() {
};
FoxSaver.Util.inEl = function(B, A, C) {
    if (!B) {
        return false
    }
    if (A > B.offsetLeft && A < (B.offsetLeft + B.offsetWidth) && C > B.offsetTop && C < (B.offsetTop + B.offsetHeight)) {
        return true
    }
    return false
};
FoxSaver.Util.copyHash = function(C, B) {
    for (var A in B) {
        C[A] = B[A]
    }
};
FoxSaver.Util.switchCase = function(A, C) {
    for (var B = 0; B < C.length; B++) {
        var D = C[B];
        if (D.inCase(A)) {
            D.weDo(A);
            return
        }
    }
};
FoxSaver.Util.unit = function(A, B) {
    A()
};
FoxSaver.Util.bind = function(A, B) {
    return function(C, D) {
        A(function() {
            B(C, D)
        }, D)
    }
};
FoxSaver.Util.sequence = function(A) {
    if (A.length == 0) {
        return FoxSaver.Util.unit
    }
    var B = A.shift();
    return FoxSaver.Util.bind(B, FoxSaver.Util.sequence(A))
};
FoxSaver.Util.or = function(A, B) {
    return function(D, C) {
        A(D, function() {
            B(D, C)
        })
    }
};
FoxSaver.Util.por = function(A, C) {
    var B = "working";
    return function(F, E) {
        var D = function(H) {
            switch (B) {
                case"working":
                case"aborted1":
                    B = "finished";
                    F(H);
                    break;
                default:
                }
        };
        var G = function() {
            switch (B) {
                case"working":
                    B = "aborted1";
                    break;
                case"aborted1":
                    E();
                    break;
                default:
                }
        };
        A(D, G);
        if (B != "finished") {
            C(D, G)
        }
    }
};
FoxSaver.Util.trim = function(A) {
    return A.replace(/^\s+|\s+$/g, "")
};
FoxSaver.Util.ltrim = function(A) {
    return A.replace(/^\s+/, "")
};
FoxSaver.Util.rtrim = function(A) {
    return A.replace(/\s+$/, "")
};
FoxSaver.Util.getFolder = function(C) {
    var B = C ? FoxSaver.FileIO.open(C) : null;
    var A = FoxSaver.Util.fileBrowse("folder", B);
    return A
};
FoxSaver.Util.copy = function(C, A, B) {
    if (!C || !A) {
        return null
    }
    srcfile = FoxSaver.FileIO.open(C);
    return FoxSaver.FileIO._cpFromFileHanlde(srcfile, A, B)
};
FoxSaver.Util.getLocalFileName = function getLocalFileName(B) {
    var A = FoxSaver.Util.getFoxSaverPath() + FoxSaver.DirIO.sep + B + "-mozdat.txt";
    return A
};
FoxSaver.Util.save2Local = function(C, B) {
    if (!C) {
        return false
    }
    var A = FoxSaver.FileIO.open(C);
    var D = false;
    if (A) {
        FoxSaver.FileIO.write(A, B)
    }
    return D
};
FoxSaver.Util.getUserOwnPhotosToImageList = function() {
    if (!FoxSaver.Util.isShowingUserOwnPhotos()) {
        return null
    }
    var C = [];
    var B = 0;
    var A = FoxSaver.preference.isUserPhotoEnabled() ? FoxSaver.Util.getDirectoryPhotosToImageList(FoxSaver.preference.getUserDirectoryFile()) : [];
    var E = FoxSaver.preference.isUserPhoto2Enabled() ? FoxSaver.Util.getDirectoryPhotosToImageList(FoxSaver.preference.getUserDirectory2File()) : [];
    var D = FoxSaver.preference.isUserPhoto3Enabled() ? FoxSaver.Util.getDirectoryPhotosToImageList(FoxSaver.preference.getUserDirectory3File()) : [];
    for (B = 0; B < A.length; ++B) {
        C.push(A[B])
    }
    for (B = 0; B < E.length; ++B) {
        C.push(E[B])
    }
    for (B = 0; B < D.length; ++B) {
        C.push(D[B])
    }
    if (C.length == 0) {
        return null
    }
    return C
};
FoxSaver.Util.getDirectoryPhotosToImageList = function(D) {
    var G = [];
    var B = FoxSaver.DirIO.read(D, true, 5), C;
    var F = FoxSaver.preference.getImageExtensions();
    if (!F) {
        F = DEF["image_extensions"]
    }
    F = F.toLowerCase().replace(/\s+/, "") + ",";
    if (B) {
        for (C = 0; C < B.length; ++C) {
            if (!B[C].isDirectory()) {
                var A = FoxSaver.FileIO.ext(B[C]);
                if (A) {
                    A += ",";
                    A = A.toLowerCase().replace(/\s+/, "");
                    if (F.indexOf(A) >= 0) {
                        var E = {};
                        E.title = B[C].path;
                        E.description = "";
                        E.author = "";
                        E.src = FoxSaver.FileIO.path(B[C]);
                        E.website = E.src;
                        E.localPath = B[C].path;
                        G.push(E)
                    }
                }
            }
        }
    }
    return G
};
FoxSaver.Util.isImage = function(D) {
    if (!D || D.length < 1) {
        return false
    }
    if (D.indexOf("http://") == 0) {
        D = D.substring(7)
    }
    var E = D.indexOf("/");
    if (E < 0) {
        return false
    }
    D = D.substring(E + 1);
    var B = D.lastIndexOf("?");
    if (B > 0) {
        D = D.substring(0, B)
    }
    var F = 0;
    if ((F = D.lastIndexOf(".")) < 0) {
        return false
    }
    var C = FoxSaver.preference.getImageExtensions();
    if (!C) {
        C = DEF["image_extensions"]
    }
    C = C.toLowerCase().replace(/\s+/, "") + ",";
    var A = D.substring(F + 1);
    if (A) {
        A += ",";
        A = A.toLowerCase().replace(/\s+/, "");
        if (C.indexOf(A) >= 0) {
            return true
        }
    }
    return false
};
FoxSaver.Util.isShowingUserOwnPhotos = function() {
    return(FoxSaver.preference.isUserPhotoEnabled() && FoxSaver.Util.isValidDirectory(FoxSaver.preference.getUserDirectoryFile()) || FoxSaver.preference.isUserPhoto2Enabled() && FoxSaver.Util.isValidDirectory(FoxSaver.preference.getUserDirectory2File()) || FoxSaver.preference.isUserPhoto3Enabled() && FoxSaver.Util.isValidDirectory(FoxSaver.preference.getUserDirectory3File()))
};
FoxSaver.Util.isValidDirectory = function(A) {
    return A && A.exists() && A.isDirectory()
};
FoxSaver.Util.isShowingUserRssFeeds = function() {
    var B = FoxSaver.preference.isUserRssEnabled();
    var A = FoxSaver.preference.getUserRssUrls();
    if (!B || !A || FoxSaver.Util.trim(A).length <= 0) {
        return false
    }
    return true
};
FoxSaver.Util.getUserRssFeedUrlList = function() {
    var E = FoxSaver.preference.getUserRssUrls();
    if (E == null) {
        return[]
    }
    E = FoxSaver.Util.trim(E);
    if (E.length <= 0) {
        return[]
    }
    var D = E.split("\n");
    var C;
    var B = [];
    for (C = 0; C < D.length; C++) {
        var A = FoxSaver.Util.trim(D[C]);
        if (A != null && A.length > 0 && A.indexOf("http") == 0) {
            B[B.length] = A
        }
    }
    return B
};
FoxSaver.Util.getHourDiffFromTimeStamp = function(A) {
    if (!A) {
        A = 0
    }
    A = parseInt(A);
    var B = new Date();
    var C = Math.round((B.getTime() - A) / 3600000);
    return C
};
FoxSaver.Util.getJSON_from_local_file = function(C) {
    if (!C) {
        return null
    }
    var B = FoxSaver.FileIO.open(C);
    if (!B || !B.exists()) {
        return null
    }
    var F = B.lastModifiedTime;
    var E = FoxSaver.Util.getHourDiffFromTimeStamp(F);
    var A = FoxSaver.FileIO.read(B);
    if (!A) {
        return null
    }
    var D = {"_timestamp": F, "diffinhours": E, "data": A};
    return D
};
FoxSaver.Util.getFoxSaverPath = function() {
    var B = FoxSaver.DirIO.get("ProfD").path;
    var A = FoxSaver.DirIO.open(B);
    A.append("foxsaver");
    FoxSaver.Util.ensureDirectory(A.path);
    return A.path
};
FoxSaver.Util.getCachePath = function() {
    var A = FoxSaver.DirIO.open(FoxSaver.Util.getFoxSaverPath());
    A.append("cache");
    FoxSaver.Util.ensureDirectory(A.path);
    return A.path
};
FoxSaver.Util.ensureDirectory = function(A) {
    var B = FoxSaver.FileIO.open(A);
    if (B && !B.exists()) {
        B.create(1, 509)
    }
};
FoxSaver.Util.logHashKeys = function(B) {
    for (var A in B) {
        FoxSaver.log(A)
    }
};
FoxSaver.Util.doNotCache = function(A) {
    try {
        var B = FoxSaver.Util.getIOService().newURI(A, null, null);
        var C = Components.classes["@mozilla.org/image/cache;1"].getService();
        var E = C.QueryInterface(Components.interfaces.imgICache);
        E.removeEntry(B)
    } catch (D) {
    }
};
FoxSaver.Util.arrayContains = function(C, B) {
    for (var A = 0; A < C.length; A++) {
        if (C[A] == B) {
            return true
        }
    }
    return false
};
FoxSaver.Util.forceRange = function(A, B) {
    if (A < 0) {
        return B - 1
    }
    if (A >= B) {
        return 0
    }
    return A
};
FoxSaver.Util.arraySwap = function(D, C, A) {
    C = FoxSaver.Util.forceRange(C, D.length);
    A = FoxSaver.Util.forceRange(A, D.length);
    var B = D[C];
    D[C] = D[A];
    D[A] = B
};
FoxSaver.Util.arrayPermute = function(C) {
    if (FoxSaver.preference.getBool("enable_random_image_show") == false)
        return;
    for (var A = C.length; A > 1; A--) {
        var B = Math.round(Math.random() * A);
        FoxSaver.Util.arraySwap(C, A - 1, Math.max(0, A - 1 - B))
    }
};
FoxSaver.Util.natList = function(C) {
    var A = new Array();
    for (var B = 0; B < C; B++) {
        A[B] = B
    }
    return A
};
FoxSaver.Util.download = function(B) {
    var D = "";
    var A = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 65536);
    var F = B.getContent();
    while (true) {
        var C = F.read(A);
        if (C <= 0) {
            break
        }
        var E = new java.lang.String(A, 0, C);
        D += E
    }
    F.close();
    return D
};
FoxSaver.Util.parseJason = function(raw) {
    if (raw != null && raw.length > 0) {
        return eval("(" + raw + ")")
    } else {
        return[]
    }
};
FoxSaver.Util.isHttp = function(A) {
    return A.indexOf("http://") == 0
};
FoxSaver.Util.checkAds = function(B) {
    var A = ["chrome://", "googlesyndication", "valueclick", "doubleclick", "rightmedia", "fastclick", "valuead", "realmedia", "aquantitive", "yieldmanager"];
    for (i = 0; i < A.length; i++) {
        if (B.indexOf(A[i]) >= 0) {
            return true
        }
    }
    return false
};
FoxSaver.Util.isValidRSSLink = function(A) {
    if ((A && A.indexOf("format=rss200") > 0 && A.indexOf("smugmug.com/hack/feed.mg") > 0) || (A && A.indexOf("format=rss") > 0 && A.indexOf("api.flickr.com/services/feeds/photos_") > 0)) {
        return true
    }
};
FoxSaver.Util.isValidHeaderLinkEl = function(A) {
    if (A && A.type == "application/rss+xml" && A.rel == "alternate" && !A.disabled) {
        return true
    }
    return false
};
FoxSaver.Util.getParameter = function(C, B) {
    C = C.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var A = "[\\?&]" + C + "=([^&#]*)";
    var E = new RegExp(A);
    var D = E.exec(B);
    if (D == null) {
        return null
    } else {
        return D[1]
    }
}