Components.utils.import("resource://gre/modules/Services.jsm");

(function () {
  function startup()
  {
    var sheet = Services.io.newURI("chrome://scrollbars/content/scrollbars.css", null, null);
    var sss   = Components.classes["@mozilla.org/content/style-sheet-service;1"]
                          .getService(Components.interfaces.nsIStyleSheetService);
    if (!sss.sheetRegistered(sheet,sss.AGENT_SHEET)) {
      sss.loadAndRegisterSheet(sheet,sss.AGENT_SHEET);
    }
    window.removeEventListener("load", startup, false);
  }

  function shutdown()
  {
    window.removeEventListener("unload", shutdown, false);
  }

  window.addEventListener("load", startup, false);
  window.addEventListener("unload", shutdown, false);
})();
