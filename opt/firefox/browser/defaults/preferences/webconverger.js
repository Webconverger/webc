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

// https://github.com/Webconverger/webconverger-addon/issues/64
pref("geo.enabled", false);
pref("browser.search.geoip.url", "");
pref("geo.wifi.uri", "");
pref("browser.search.geoSpecificDefaults", false);

// https://wiki.mozilla.org/Phishing_Protection#Prefs
pref("browser.safebrowsing.enabled", false);
pref("browser.safebrowsing.malware.enabled", false);
// https://wiki.mozilla.org/Security/Application_Reputation#Prefs
pref("browser.safebrowsing.downloads.enabled", false);
pref("browser.safebrowsing.downloads.remote.enabled", false);

// https://github.com/Webconverger/webconverger-addon/issues/65
pref("media.gmp-gmpopenh264.autoupdate", false);
pref("media.gmp-gmpopenh264.enabled", false);
pref("media.gmp-gmpopenh264.provider.enabled", false);

// Disable crash reporter
pref("toolkit.crashreporter.enabled", false);

// Disable self-repair.mozilla.org https://wiki.mozilla.org/Advocacy/heartbeat
pref("browser.selfsupport.url", "");

// Disable geo.mozilla.org connections https://bugzilla.mozilla.org/show_bug.cgi?id=1216026
// https://support.mozilla.org/en-US/kb/how-stop-firefox-making-automatic-connections#w_mozilla-content
pref("browser.aboutHomeSnippets.updateUrl",		"");

// https://discourse.mozilla-community.org/t/test-html5-videos-on-youtube/1325
pref("media.fragmented-mp4.exposed", true);
pref("media.fragmented-mp4.ffmpeg.enabled", true);
pref("media.mediasource.enabled", true);
pref("media.mediasource.mp4.enabled", true);

// https://wiki.mozilla.org/Security/Tracking_protection#Prefs
pref("privacy.trackingprotection.enabled", false);
pref("privacy.trackingprotection.pbmode.enabled", false);

// https://wiki.mozilla.org/Addons/Extension_Signing
// Can be removed from Firefox 44, assuming that we figure out how to get our addon signed
pref("xpinstall.signatures.required", false);

// http://kb.mozillazine.org/Browser.search.suggest.enabled
pref("browser.search.suggest.enabled",           false);

// A notification to tell you are behind a captive portal might trigger falsely, hence disabled
pref("network.captive-portal-service.enabled", false);
