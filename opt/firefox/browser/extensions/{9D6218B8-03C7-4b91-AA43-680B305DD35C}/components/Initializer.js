const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");

const nsIDOMWindowIface = Ci.nsIDOMWindow;
const nsIHttpChannelIface = Ci.nsIHttpChannel;
const nsIInterfaceRequestorIface = Ci.nsIInterfaceRequestor;
const nsIChannelIface = Ci.nsIChannel;

/**
 * ComponentCollector Constructor.
 * @constructor
 */
function ComponentCollectorService()
{
    Cu.import("resource://procon/filter.jsm");
}

ComponentCollectorService.prototype =
{
    classID : Components.ID('{93909B7A-FCD8-11DF-A754-F892DFD72085}'),
    classDescription : 'ProCon Latte Content Filter Initializer',
    contractID : '@corvineum.org/startup;1',
    _xpcom_categories : [
        {
            category : 'profile-after-change'
        }],
    initializeComponent : function()
    {
        this.observerService = Cc['@mozilla.org/observer-service;1'].getService(Ci.nsIObserverService);
        this.observerService.addObserver(this, 'xpcom-shutdown', false);
        this.observerService.addObserver(this, 'http-on-modify-request', false);
    },

    deinitializeComponent : function()
    {
        this.observerService.removeObserver(this, 'http-on-modify-request');
        this.observerService.removeObserver(this, 'xpcom-shutdown');
    },

    observe : function(aSubject, aTopic, aData)
    {
        if (aTopic == 'http-on-modify-request')
        {
            this.observeRequest(aSubject);
        }
        else if (aTopic == 'profile-after-change')
        {
            this.initializeComponent();
        }
        else if (aTopic == 'xpcom-shutdown')
        {
            this.deinitializeComponent();
        }
    },

    observeRequest : function(aSubject)
    {
        if (!(aSubject instanceof nsIHttpChannelIface))
            return;

        if (aSubject.loadFlags & nsIChannelIface.LOAD_INITIAL_DOCUMENT_URI)
        {
            let httpChannel = aSubject.QueryInterface(nsIHttpChannelIface);
            let win = this.getDomWindowForRequest(httpChannel);
            if (!win || !win.wrappedJSObject)
            {
                // This is not a request that originated from a DOM node (might be
                // a cert validation request, or a phishing protection request,
                // for instance). So we ignore it.
                return;
            }

            scanURL(aSubject, httpChannel.URI);
        }
    },

    getInterfaceForRequest : function(request, iface)
    {
        /**
         * @param {nsISupports} supports The instance to retrieve the interface from.
         * @return {nsISupports} The associated interface instance, or null.
         */
        function getIface(supports)
        {
            if (supports == null)
                return null;

            if (!(supports instanceof nsIInterfaceRequestorIface))
                return null;

            var callbacks = supports.QueryInterface(nsIInterfaceRequestorIface);

            try
            {
                return callbacks.getInterface(iface);
            }
            catch (e)
            {
                return null;
            }
        }

        var obj = getIface(request.notificationCallbacks);
        if (!obj && request.loadGroup != null)
        {
            // If we were unable to get the interface from the request
            // itself, try to get one from the request's load group (required
            // for XHRs).
            obj = getIface(request.loadGroup.groupObserver);
        }

        return obj;
    },

    getDomWindowForRequest : function(request)
    {
        return this.getInterfaceForRequest(request, nsIDOMWindowIface);
    },

    // nsISupports interface implementation
    QueryInterface: XPCOMUtils.generateQI([Ci.nsIObserver])
};

// XPCOMUtils.generateNSGetFactory was introduced in Mozilla 2 (Firefox 4).
// XPCOMUtils.generateNSGetModule is for Mozilla 1.9.x (Firefox 3).
if (XPCOMUtils.generateNSGetFactory)
{
    var NSGetFactory = XPCOMUtils.generateNSGetFactory([ComponentCollectorService]);
}
else
{
    var NSGetModule = XPCOMUtils.generateNSGetModule([ComponentCollectorService]);
}
