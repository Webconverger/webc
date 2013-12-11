FoxSaver.UrlDownloader = function(callbkfn, args) {
    this.callbackObject = function() {
        if (callbkfn) {
            callbkfn(args)
        }
    };
    this.onMyLocChange = null
};
FoxSaver.UrlDownloader.prototype = {setLocationChangeHanler: function(myFunc) {
        var me = this;
        this.onMyLocChange = function() {
            myFunc()
        }
    }, onStateChange: function(webProgress, request, stateFlags, status) {
        const wpl = Components.interfaces.nsIWebProgressListener;
        var isLoadFinished = (stateFlags & wpl.STATE_STOP);
        if (isLoadFinished && this.callbackObject) {
            window.setTimeout(this.callbackObject, 0)
        }
    }, QueryInterface: function(iid) {
        if (iid.equals(Components.interfaces.nsIWebProgressListener) || iid.equals(Components.interfaces.nsISupportsWeakReference) || iid.equals(Components.interfaces.nsISupports)) {
            return this
        }
        throw Components.results.NS_NOINTERFACE
    }, onStatusChange: function(webProgress, request, status, message) {
    }, onLocationChange: function(webProgress, request, location) {
        if (this.onMyLocChange) {
            window.setTimeout(this.onMyLocChange, 100)
        }
    }, onProgressChange: function(webProgress, request, curSelfProgress, maxSelfProgress, curTotalProgress, maxTotalProgress) {
    }, onSecurityChange: function(webProgress, request, state) {
    }}