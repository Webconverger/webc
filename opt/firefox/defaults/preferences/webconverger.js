// Disable default browser checking.
pref("browser.shell.checkDefaultBrowser", false);

// Don't disable our bundled extensions in the application directory
pref("extensions.autoDisableScopes", 11);
pref("extensions.shownSelectionUI", true);

pref("browser.rights.3.shown", true);
pref("toolkit.telemetry.prompted", 2);
pref("toolkit.telemetry.rejected", true);

pref("browser.newtab.url", "about:blank");
pref("browser.startup.homepage", "file:/opt/firefox/defaults/preferences/homepage.properties");

// Disable updates, since we use git
pref("app.update.auto", false);
pref("app.update.enabled", false);

pref("keyword.URL", "https://duckduckgo.com/?t=webconverger&q=");

pref("general.config.obscure_value", 0);
pref("general.config.filename", "mozilla.cfg");
