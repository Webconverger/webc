// Disable default browser checking.
pref("browser.shell.checkDefaultBrowser", false);

// Don't disable our bundled extensions in the application directory
pref("extensions.autoDisableScopes", 11);
pref("extensions.shownSelectionUI", true);

// Don't nag the user
pref("browser.rights.3.shown", true);
pref("toolkit.telemetry.prompted", 2);
pref("toolkit.telemetry.rejected", true);
pref("toolkit.telemetry.enabled", false);

pref("browser.newtab.url", "about:blank");
pref("browser.startup.homepage", "file:/opt/firefox/browser/defaults/preferences/homepage.properties");

// Disable updates, since we use git
pref("app.update.auto", false);
pref("app.update.enabled", false);

pref("browser.search.defaultenginename", "DDG");

pref("general.config.obscure_value", 0);
pref("general.config.filename", "mozilla.cfg");

// Disable https://blog.mozilla.org/metrics/2012/09/21/firefox-health-report/
pref("datareporting.healthreport.uploadEnabled", false);
