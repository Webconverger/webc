pref("browser.display.background_color", "#000000");

pref("devtools.errorconsole.enabled", false);

pref("devtools.gcli.hideIntro", true);
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
pref("security.warn_viewing_mixed", false);
pref("security.warn_viewing_mixed.show_once", false);
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

// Block extension installs
pref("xpinstall.enabled", false);

// Prevent slow script dialogs
pref("dom.max_chrome_script_run_time", 0);
pref("dom.max_script_run_time", 0);

// Disable the popup window that shows up when F7 is pressed
pref("accessibility.browsewithcaret_shortcut.enabled", false);

pref("network.protocol-handler.external.mailto", false);
pref("network.protocol-handler.external.news", false);
pref("network.protocol-handler.external.nntp", false);
pref("network.protocol-handler.external.snews", false);

pref("plugin.default.state", 2);

// Disable bookmarking addon
pref("browser.pocket.enabled", false);
// Disable reader view function
pref("reader.parse-on-load.enabled", false);
