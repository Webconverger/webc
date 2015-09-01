// Disable default browser checking.
pref("browser.shell.checkDefaultBrowser", false);

// Don't disable our bundled extensions in the application directory
pref("extensions.autoDisableScopes", 11);
pref("extensions.shownSelectionUI", true);

// master kill switch for submitting data to Mozilla
// https://bugzilla.mozilla.org/show_bug.cgi?id=862563
pref("datareporting.policy.dataSubmissionEnabled", false);
pref("datareporting.policy.dataSubmissionPolicyBypassNotification", true);
// Leaving these around, although the above two lines should do it
pref("browser.rights.3.shown", true);
pref("toolkit.telemetry.prompted", 999);
pref("toolkit.telemetry.rejected", true);
pref("toolkit.telemetry.enabled", false);

// https://bugzilla.mozilla.org/show_bug.cgi?id=1100304
pref("media.gmp-gmpopenh264.autoupdate", false);
pref("media.gmp-gmpopenh264.enabled", false);
pref("media.gmp-gmpopenh264.provider.enabled", false);

// Disable tiles https://support.mozilla.org/en-US/kb/how-do-tiles-work-firefox#w_how-do-i-turn-it-onoff
// https://bugzilla.mozilla.org/show_bug.cgi?id=1054202
pref("browser.newtabpage.enabled", false);
pref("browser.newtabpage.directory.source", 'data:application/json,{}');
pref("browser.newtabpage.directory.ping", "");

pref("browser.newtab.url", "about:blank");
pref("browser.startup.homepage", "file:/opt/firefox/browser/defaults/preferences/homepage.properties");

// Disable updates, since we use git
pref("app.update.auto", false);
pref("app.update.enabled", false);
pref("app.update.url", "");

pref("general.config.obscure_value", 0);
pref("general.config.filename", "mozilla.cfg");

// Disable https://blog.mozilla.org/metrics/2012/09/21/firefox-health-report/
pref("datareporting.healthreport.uploadEnabled", false);
pref("datareporting.healthreport.service.enabled", false);

//Disable plugin checking
pref("plugins.hide_infobar_for_outdated_plugin", true);

// Don't ask to install the Flash plugin
pref("plugins.notifyMissingFlash", false);

pref("datareporting.policy.dataSubmissionPolicyBypassNotification", true);
pref("media.eme.enabled", false);
pref("media.gmp-manager.url", "");
pref("extensions.blocklist.enabled", false);
pref("browser.safebrowsing.enabled", false);

// https://github.com/Webconverger/webconverger-addon/issues/64
pref("geo.enabled", false);
pref("browser.search.geoip.url", "");
pref("geo.wifi.uri", "");
pref("browser.search.geoSpecificDefaults", false);

pref("browser.safebrowsing.phishing.enabled", false);
pref("browser.safebrowsing.malware.enabled", false);
pref("browser.safebrowsing.downloads.enabled", false);
pref("browser.safebrowsing.downloads.remote.enabled", false);

// https://github.com/Webconverger/webconverger-addon/issues/65
pref("media.gmp-gmpopenh264.autoupdate", false);
pref("media.gmp-gmpopenh264.enabled", false);
pref("media.gmp-gmpopenh264.provider.enabled", false);

// Disable crash reporter
pref("toolkit.crashreporter.enabled", false);
