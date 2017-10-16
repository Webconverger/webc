var InlineDispositionService =
{

/** XPCOM *********************************************************************/


	// nsISupports members
	QueryInterface: function( iid )
	{
		if ( iid.equals(Components.interfaces.nsISupports) ||
		     iid.equals(Components.interfaces.nsIFactory) ||
		     iid.equals(Components.interfaces.nsIModule) ||
		     iid.equals(Components.interfaces.nsIObserver) )
		{
			return(this);
		}

		throw(Components.results.NS_ERROR_NO_INTERFACE);
	},


	// nsIFactory members
	createInstance: function( outer, iid )
	{
		if (outer == null)
			return(this.QueryInterface(iid));

		throw(Components.results.NS_ERROR_NO_AGGREGATION);
	},

	lockFactory: function( lock )
	{
		throw(Components.results.NS_ERROR_NOT_IMPLEMENTED);
	},


	// nsIModule members
	getClassObject: function( compMgr, cid, iid )
	{
		if (cid.equals(this._CLASS_ID))
			return(this.QueryInterface(iid));

		throw(Components.results.NS_ERROR_NO_INTERFACE);
	},

	registerSelf: function( compMgr, location, loaderStr, type )
	{
		compMgr = compMgr.QueryInterface(Components.interfaces.nsIComponentRegistrar);

		if (!this._registered && !compMgr.isCIDRegistered(this._CLASS_ID))
		{
			this._registered = true;

			// Register component
			compMgr.registerFactoryLocation(
				this._CLASS_ID,
				this._CLASS_NAME,
				this._CONTRACT_ID,
				location,
				loaderStr,
				type
			);

			// Add startup observer
			this._cm.addCategoryEntry("app-startup", this._CLASS_NAME, this._CONTRACT_ID, true, true);
		}
	},

	unregisterSelf: function( compMgr, location, loaderStr )
	{
		compMgr = compMgr.QueryInterface(Components.interfaces.nsIComponentRegistrar);

		if (this._registered)
		{
			this._registered = false;

			// Unregister component
			compMgr.unregisterFactoryLocation(
				this._CLASS_ID,
				location
			);

			// Remove observer
			this._cm.deleteCategoryEntry("app-startup", this._CLASS_NAME, true);
		}
	},

	canUnload: function( compMgr )
	{
		return(true);
	},


	// nsIObserver members
	observe: function( subject, topic, data )
	{
		switch (topic)
		{
			case "http-on-examine-response":
				this._httpResponse(subject);
				break;

			case "app-startup":
				this._os.addObserver(this, "quit-application", false);
				this._os.addObserver(this, "http-on-examine-response", false);
				break;

			case "quit-application":
				this._os.removeObserver(this, topic);
				this._os.removeObserver(this, "http-on-examine-response");
				break;
		}
	},


/** End XPCOM *****************************************************************/



/** Private *******************************************************************/


	// Legacy (pre-Gecko2) XPCOM registration stuff
	_CLASS_ID: Components.ID("{ecef498a-7b53-4bce-a345-80bc18c2c2c9}"),
	_CLASS_NAME: "InlineDisposition Service",
	_CONTRACT_ID: "@code.kliu.org/inlinedisposition;1",
	_registered: false,


	// Service wrappers
	_cm: Components.classes["@mozilla.org/categorymanager;1"].
	     getService(Components.interfaces.nsICategoryManager),

	_os: Components.classes["@mozilla.org/observer-service;1"].
	     getService(Components.interfaces.nsIObserverService),


	// Look for and stop attachment dispositions
	_re: /^\s*attachment/i,

	_httpResponse: function( chan )
	{
		var disp = "";

		try {
			chan = chan.QueryInterface(Components.interfaces.nsIHttpChannel);
			disp = chan.getResponseHeader("Content-Disposition");
		} catch (e) { }

		if (chan.loadFlags & Components.interfaces.nsIChannel.LOAD_DOCUMENT_URI && this._re.test(disp))
			chan.setResponseHeader("Content-Disposition", disp.replace(this._re, "inline"), false);
	}


/** End Private ***************************************************************/

};


function NSGetModule( compMgr, location )
{
	return(InlineDispositionService);
}
