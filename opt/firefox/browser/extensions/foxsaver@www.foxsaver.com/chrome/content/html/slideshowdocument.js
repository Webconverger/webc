var gBundle = Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService);
var autoslidestrings = gBundle.createBundle("chrome://foxsaver/locale/foxsaver.properties");
var myImgThumbnailList = null;
var maxThumbnailShown = 0;
var lastUpdTimeStamp = 0;
var lastStartIndex = 0;
var myToolTip = null;
function foxsavernullfunction() {
}
function getLocalStr(A) {
    try {
        var C = autoslidestrings.GetStringFromName(A);
        if (C) {
            return C
        }
    } catch (B) {
    }
    return""
}
function ssdInit() {
    FoxSaver.YUI.util.Event.addListener("pgup", "click", onPgUpImg);
    FoxSaver.YUI.util.Event.addListener("pgdown", "click", onPgDownImg);
    window.onresize = ssdWindowResize;
    FoxSaver.YUI.util.Event.onAvailable("slideshowImage", function() {
        ssdCenter("slideshowImage")
    });
    FoxSaver.YUI.util.Event.onAvailable("mycanvas", function() {
        ssdCenter("mycanvas")
    });
    appendEnoughChildImg();
    ssdWindowResize()
}
function onPgDownImg() {
    initialThumbViewList(lastStartIndex + 1);
    lastStartIndex++;
    if (lastStartIndex > myImgThumbnailList.length - 1) {
        lastStartIndex = 0
    }
}
function onPgUpImg() {
    initialThumbViewList(lastStartIndex - 1);
    lastStartIndex--;
    if (lastStartIndex < 0) {
        lastStartIndex = myImgThumbnailList.length - 1
    }
}
function appendEnoughChildImg() {
    return;
    var C = document.getElementById("OverviewImgPanel");
    var A = window.outerWidth - 220;
    if (A < 100) {
        C.innerHTML = "";
        maxThumbnailShown = 0;
        return
    }
    maxThumbnailShown = Math.floor(A / 100);
    for (var B = 0; B < maxThumbnailShown; B++) {
        var D = document.createElement("img");
        D.width = 90;
        D.height = 90;
        D.src = "chrome://foxsaver/skin/clear.gif";
        D.className = "fs_ctl_img";
        D.id = "";
        regBtnEvt(D);
        C.appendChild(D)
    }
}
function initialThumbViewList(iStart) {
    return;
    var curTime = new Date();
    var curTimestamp = curTime.getTime();
    var diffInMins = (curTimestamp - lastUpdTimeStamp) / 60000;
    if (myImgThumbnailList && myImgThumbnailList.length > 1 && iStart == lastStartIndex && diffInMins < 1) {
        return
    }
    if (!iStart) {
        iStart = 0
    }
    var varEl = document.getElementById("hiddenVarContainer");
    myImgThumbnailList = eval(varEl.innerHTML);
    if (!myImgThumbnailList || myImgThumbnailList.length < 2) {
        return
    }
    var overviewEl = document.getElementById("OverviewImgPanel");
    lastUpdTimeStamp = curTimestamp;
    var imgNodes = overviewEl.childNodes;
    var j = 0;
    for (var i = 0; i < imgNodes.length; i++) {
        if (imgNodes[i].nodeName != "IMG") {
            continue
        }
        j++;
        var k = (j + iStart) % (myImgThumbnailList.length - 1);
        var curNode = myImgThumbnailList[k];
        imgNodes[i].src = curNode[1];
        imgNodes[i].id = "fs_index_" + curNode[0]
    }
}
function reCalDivElSize() {
    var A = document.getElementById("leftMenu");
    var C = document.body.clientWidth;
    var G = A.clientWidth;
    var F = Math.round((C - G) / 2);
    A.style.marginLeft = F + "px";
    return;
    var D = document.getElementById("OverviewImgPanel");
    var A = document.getElementById("leftMenu");
    var C = document.body.clientWidth;
    var G = A.clientWidth + 50;
    var H = C - G;
    var F = 0;
    if (H < 10) {
        H = 10
    }
    var E = Math.floor(H / 100);
    F = (H % 100);
    if (F < 0) {
        F = 0
    }
    H = E * 100 + 5;
    D.style.width = H + "px";
    var B = document.getElementById("rightMenu");
    B.style.marginLeft = F + "px"
}
function regBtnEvt(A) {
    if (!A) {
        return
    }
    FoxSaver.YUI.util.Event.addListener(A, "mouseover", ssdButtonMouseOver);
    FoxSaver.YUI.util.Event.addListener(A, "mouseout", ssdButtonMouseOut);
    FoxSaver.YUI.util.Event.addListener(A, "mousedown", ssdButtonMouseDown);
    FoxSaver.YUI.util.Event.addListener(A, "mouseup", ssdButtonMouseUp)
}
function ssdClose() {
}
function ssdWindowResize(A) {
    ssdCenter("mycanvas");
    reCalDivElSize()
}
function ssdMouseInRegion(B, A, C) {
    if (!B) {
        return false
    }
    if (A > B.offsetLeft && A < B.offsetWidth && C > B.offsetTop && C < (B.offsetTop + B.offsetHeight)) {
        return true
    }
    return false
}
function ssdOverViewEnter(A) {
    stopMyMenuBarAnim();
    FoxSaver.YUI.util.Dom.setStyle("menubar", "opacity", "0.9")
}
function ssdButtonMouseOver(B) {
    var A = FoxSaver.YUI.util.Event.getTarget(B);
    if (A && A) {
        switch (A.className) {
            case"fs_ctl_btn":
                FoxSaver.YUI.util.Dom.setStyle(A, "opacity", "1");
                break;
            case"fs_ovt_btn":
                FoxSaver.YUI.util.Dom.setStyle(A, "opacity", "1");
                break;
            case"fs_ctl_img":
                FoxSaver.YUI.util.Dom.setStyle(A, "opacity", "1");
                FoxSaver.YUI.util.Dom.setStyle(A, "border", "2px solid yellow");
                FoxSaver.YUI.util.Dom.setStyle(A, "width", "95px");
                FoxSaver.YUI.util.Dom.setStyle(A, "height", "95px");
                break;
            default:
                break
            }
    }
}
function ssdButtonMouseOut(B) {
    var A = FoxSaver.YUI.util.Event.getTarget(B);
    if (A && A) {
        ssdResetButtons();
        switch (A.className) {
            case"fs_ctl_btn":
                FoxSaver.YUI.util.Dom.setStyle(A, "opacity", "0.5");
                break;
            case"fs_ovt_btn":
                FoxSaver.YUI.util.Dom.setStyle(A, "opacity", "0.5");
                break;
            case"fs_ctl_img":
                FoxSaver.YUI.util.Dom.setStyle(A, "opacity", "0.5");
                FoxSaver.YUI.util.Dom.setStyle(A, "border", "2px solid white");
                FoxSaver.YUI.util.Dom.setStyle(A, "width", "90px");
                FoxSaver.YUI.util.Dom.setStyle(A, "height", "90px");
                break;
            default:
                break
            }
    }
}
function ssdButtonMouseDown(B) {
    var A = FoxSaver.YUI.util.Event.getTarget(B);
    if (A && A) {
        ssdResetButtons();
        switch (A.className) {
            case"fs_ctl_btn":
                A.width = 34;
                A.height = 34;
                A.style.marginLeft = 2;
                break;
            case"fs_ovt_btn":
                A.width = 13;
                A.height = 72;
                A.style.marginLeft = 2;
                break;
            default:
                break
            }
    }
}
function ssdButtonMouseUp(B) {
    var A = FoxSaver.YUI.util.Event.getTarget(B);
    if (A && A) {
        ssdResetButtons();
        switch (A.className) {
            case"fs_ctl_btn":
                A.width = 36;
                A.height = 36;
                A.style.marginLeft = 0;
                break;
            case"fs_ovt_btn":
                A.width = 15;
                A.height = 75;
                A.style.marginLeft = 0;
                break;
            default:
                break
            }
    }
}
function ssdPositionBottom() {
    var C = document.getElementById("menubar");
    if (!C) {
        return
    }
    var B = document.body.clientWidth;
    var D = document.body.clientHeight;
    FoxSaver.YUI.util.Dom.setStyle(C, "position", "absolute");
    FoxSaver.YUI.util.Dom.setStyle(C, "width", "100%");
    FoxSaver.YUI.util.Dom.setStyle(C, "height", "100px");
    FoxSaver.YUI.util.Dom.setStyle(C, "left", "0px");
    FoxSaver.YUI.util.Dom.setStyle(C, "top", (D - 101) + "px");
    var A = FoxSaver.YUI.util.Dom.getStyle(C, "top")
}
function ssdCenter(D) {
    var C;
    C = document.getElementById(D);
    if (!C) {
        return
    }
    var A = document.body.clientWidth;
    var B = document.body.clientHeight;
    C.style.position = "absolute";
    C.style.left = ((A - C.width) / 2) + "px";
    C.style.top = ((B - C.height) / 2) + "px"
}
function ssdResetButtons() {
}
FoxSaver.YUI.util.Event.addListener(window, "load", ssdInit);
FoxSaver.YUI.util.Event.addListener(window, "unload", ssdClose)