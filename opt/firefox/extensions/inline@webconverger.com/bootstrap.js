Components.utils.import("resource://gre/modules/Services.jsm");

function startup( data, reason )
{
	var sRoot = Services.io.newFileURI(data.installPath).spec;
	if (data.installPath.isFile())
		sRoot = "jar:" + sRoot + "!/";

	Services.scriptloader.loadSubScript(sRoot + "components/inlinedisposition.js", this);

	Services.obs.addObserver(InlineDispositionService, "http-on-examine-response", false);
}

function shutdown( data, reason )
{
	Services.obs.removeObserver(InlineDispositionService, "http-on-examine-response");
}

function install( data, reason ) { }

function uninstall( data, reason ) { }
