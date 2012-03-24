/* http://webconverger.org/kiosk/
*/

pref("accessibility.typeaheadfind.flashBar", 0);
pref("app.update.enabled", false);
pref("browser.download.dir", "/dev/null");
pref("browser.download.manager.useWindow", false);
pref("browser.download.show_plugins_in_list", false);
pref("browser.download.downloadDir", "/dev/null");
pref("browser.download.folderList", 2);
pref("browser.download.manager.quitBehavior", 2);
pref("browser.helperApps.deleteTempFileOnExit", true);
pref("browser.download.lastDir", "/dev/null");
pref("browser.preferences.advanced.selectedTabIndex", 2);
pref("browser.startup.homepage_override.mstone", "ignore");
pref("browser.tabs.autoHide", false);
pref("browser.tabs.tabMinWidth", 0);

pref("browser.tabs.warnOnClose", false);
pref("browser.tabs.warnOnOpen", false);
pref("browser.urlbar.hideGoButton", true);
pref("network.cookie.prefsMigrated", true);
pref("pref.advanced.javascript.disable_button.advanced", false);
pref("pref.privacy.disable_button.view_cookies", false);
pref("security.warn_entering_secure", false);
pref("security.warn_leaving_secure", false);
pref("security.warn_submit_insecure", false);
pref("signon.rememberSignons", false);

pref("extensions.update.enabled", false);

// Disable default browser checking.
pref("browser.shell.checkDefaultBrowser", false);

// Make sure new windows open in a tab
pref("browser.link.open_newwindow", 3);
pref("browser.link.open_external",3);
pref("browser.link.open_newwindow.restriction", 0);

// Defence in depth
pref("browser.sessionstore.enabled", false);
pref("browser.sessionstore.resume_from_crash", false);
pref("xpinstall.enabled", false);
pref("privateBrowsingEnabled", true);
pref("browser.privatebrowsing.autostart", true);
pref("browser.privatebrowsing.dont_prompt_on_enter", true);
pref("privacy.sanitize.sanitizeOnShutdown", true);
pref("privacy.clearOnShutdown.offlineApps", true);
pref("privacy.clearOnShutdown.passwords", true);
pref("privacy.clearOnShutdown.siteSettings", true);
// cpd = Clear Private Data
pref("privacy.cpd.offlineApps", true);
pref("privacy.cpd.passwords", true);
pref("privacy.sanitize.sanitizeOnShutdown", true);
// Prevent slow script dialogs
pref("dom.max_chrome_script_run_time", 0);
pref("dom.max_script_run_time", 0);

// Disable the popup window that shows up when F7 is pressed
pref("accessibility.browsewithcaret_shortcut.enabled", false);

pref("network.protocol-handler.external.mailto", false);
pref("network.protocol-handler.external.news", false);
pref("network.protocol-handler.external.nntp", false);
pref("network.protocol-handler.external.snews", false);
