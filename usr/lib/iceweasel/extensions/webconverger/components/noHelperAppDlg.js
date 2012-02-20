Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");

function removeUnknownContentTypeDialog() {}

removeUnknownContentTypeDialog.prototype = {
	classID: Components.ID("{be1472ad-6f60-4dc1-bc62-9145fe220879}"),

	QueryInterface: function(iid) {
		if (!iid.equals(Components.interfaces.nsIHelperAppLauncherDialog) && ! iid.equals(Components.interfaces.nsISupports)) {
			throw Components.results.NS_ERROR_NO_INTERFACE;
		}
		return this;
	},

	show: function(aLauncher, aContext, aReason) {
		const NS_BINDING_ABORTED = 0x804b0002;
		aLauncher.cancel(NS_BINDING_ABORTED);
		return;
	},
	promptForSaveToFile: function(aLauncher, aContext, aDefaultFile, aSuggestedFileExtension, aForcePrompt) {
		const NS_BINDING_ABORTED = 0x804b0002;
		aLauncher.cancel(NS_BINDING_ABORTED);
		return;
	}
}

var NSGetFactory = XPCOMUtils.generateNSGetFactory([removeUnknownContentTypeDialog]);

