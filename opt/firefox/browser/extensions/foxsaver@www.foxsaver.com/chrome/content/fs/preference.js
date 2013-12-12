const DEF = [];
FoxSaver.preference = {preferencesBranch: null, preferencesService: null, version: null, init: function() {
        this.version = this.getInt("foxsaver.preference.version");
        var B = true;
        try {
            B = this.getBool("enable_foxsaver");
            if (!B) {
                FoxSaver.Util.toggleAllButtons();
                FoxSaver.Util.toggleAllButtons()
            }
        } catch (A) {
            alert(A)
        }
        this.initStatusBarIcon();
        return B
    }, isDirty: function() {
        var A = this.version;
        this.version = this.getInt("foxsaver.preference.version");
        return this.version != A
    }, setDirty: function() {
        var A = this._getPrefs();
        if (A) {
            A.setIntPref("foxsaver.preference.version", this.getInt("foxsaver.preference.version") + 1)
        }
    }, initStatusBarIcon: function() {
        if (this.getHideStatusBarIcon()) {
            document.getElementById("FoxSaverStatusBarIcon").style.display = "none"
        } else {
            document.getElementById("FoxSaverStatusBarIcon").style.display = "block"
        }
    }, toggleStatusBarIcon: function() {
        this.setBool("hide_status_bar_icon", !this.getHideStatusBarIcon());
        this.initStatusBarIcon()
    }, _getPrefsService: function() {
        if (this.preferencesService) {
            return this.preferencesService
        }
        try {
            this.preferencesService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService)
        } catch (A) {
            dump("failed to get prefs service!\n")
        }
        return this.preferencesService
    }, _getPrefs: function() {
        if (this.preferencesBranch) {
            return this.preferencesBranch
        }
        try {
            var B = this._getPrefsService();
            if (B) {
                this.preferencesBranch = B.getBranch("codetch.")
            }
            if (this.preferencesBranch) {
                return this.preferencesBranch
            } else {
                dump("failed to get codetch prefs!\n")
            }
        } catch (A) {
            dump("failed to get codetch prefs!\n")
        }
        return null
    }, getString: function(A) {
        try {
            var C = this._getPrefs().getCharPref(A);
            return C
        } catch (B) {
        }
        return DEF[A]
    }, getBool: function(A) {
        try {
            var C = this._getPrefs().getBoolPref(A);
            return C
        } catch (B) {
        }
        return(DEF[A])
    }, getInt: function(A) {
        try {
            var C = this._getPrefs().getIntPref(A);
            return C
        } catch (B) {
        }
        return DEF[A]
    }, getFile: function(A) {
        try {
            var C = this._getPrefs().getComplexValue(A, Components.interfaces.nsILocalFile);
            return C
        } catch (B) {
        }
        return DEF[A]
    }, getUnichar: function(A, C) {
        var B = this._getPrefs();
        if (B) {
            try {
                var E = B.getComplexValue(A, Components.interfaces.nsISupportsString).data;
                return E
            } catch (D) {
            }
        }
        return DEF[name]
    }, setBool: function(D, A) {
        var C = this._getPrefs();
        if (C) {
            var B = this.getBool(D);
            if (B != A) {
                if (this.isInCheckDirtyList(D)) {
                    this.setDirty()
                }
                C.setBoolPref(D, A)
            }
        }
    }, setString: function(D, A) {
        var C = this._getPrefs();
        if (C) {
            var B = this.getString(D);
            if (B != A) {
                if (this.isInCheckDirtyList(D)) {
                    this.setDirty()
                }
                C.setCharPref(D, A)
            }
        }
    }, setInt: function(D, A) {
        var C = this._getPrefs();
        if (C) {
            var B = this.getInt(D);
            if (B != A) {
                if (this.isInCheckDirtyList(D)) {
                    this.setDirty()
                }
                C.setIntPref(D, A)
            }
        }
    }, setFile: function(C, D) {
        var B = this._getPrefs();
        if (B) {
            var A = this.getFile(C);
            if (A != D) {
                if (this.isInCheckDirtyList(C)) {
                    this.setDirty()
                }
                B.setComplexValue(C, Components.interfaces.nsILocalFile, D)
            }
        }
    }, setUnichar: function(A, D) {
        var C = this._getPrefs();
        if (C) {
            try {
                var B = this.getUnichar(A);
                if (B != D) {
                    if (this.isInCheckDirtyList(A)) {
                        this.setDirty()
                    }
                    var F = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
                    F.data = D;
                    C.setComplexValue(A, Components.interfaces.nsISupportsString, F)
                }
            } catch (E) {
            }
        }
    }, isInCheckDirtyList: function(A) {
        return["enable_foxsaver_photos", "enable_user_photos", "enable_user_photos2", "enable_user_photos3", "user_dir", "user_dir2", "user_dir3", "enable_user_rss_sources", "user_rss_urls"].indexOf(A) >= 0
    }, getIdleMinutes: function() {
        return this.getInt("idle_minutes")
    }, setIdleMinutes: function(A) {
        return this.setInt("idle_minutes", A)
    }, getDisplaySeconds: function() {
        return this.getInt("display_seconds")
    }, getImageExtensions: function() {
        return this.getString("image_extensions")
    }, getNoActionSites: function() {
        return this.getString("quiet_sites")
    }, disableFoxSaver: function() {
        return this.setBool("enable_foxsaver", false)
    }, enableFoxSaver: function() {
        return this.setBool("enable_foxsaver", true)
    }, isFoxSaverEnabled: function() {
        return this.getBool("enable_foxsaver")
    }, isFoxSaverPhotoEnabled: function() {
        return this.getBool("enable_foxsaver_photos")
    }, isUserWebPageEnabled: function() {
        return this.getBool("enable_user_web_page")
    }, getUserWebPageUrl: function() {
        return this.getString("user_web_page_url")
    }, isUserPhotoEnabled: function() {
        return this.getBool("enable_user_photos")
    }, isUserPhoto2Enabled: function() {
        return this.getBool("enable_user_photos2")
    }, isUserPhoto3Enabled: function() {
        return this.getBool("enable_user_photos3")
    }, isUserRssEnabled: function() {
        return this.getBool("enable_user_rss_sources")
    }, getUserRssUrls: function() {
        return this.getString("user_rss_urls")
    }, setUserPhotoEnabled: function(A) {
        this.setBool("enable_user_photos", A)
    }, hasSpecialEffects: function() {
        return this.isTiltingImageEnabled() || this.isTiltingImageEnabled()
    }, isTiltingImageEnabled: function() {
        return this.getBool("enable_random_tilting_image")
    }, isImageReflectionEnabled: function() {
        return this.getBool("enable_random_image_reflection")
    }, hasFadeInOut: function() {
        return this.getBool("has_fade_in_out")
    }, getUserDirectoryFile: function() {
        return this.getFile("user_dir")
    }, getUserDirectory2File: function() {
        return this.getFile("user_dir2")
    }, getUserDirectory3File: function() {
        return this.getFile("user_dir3")
    }, setUserDirectoryFile: function(A) {
        return this.setFile("user_dir", A)
    }, getSaveDirectoryFile: function() {
        return this.getFile("save_dir")
    }, getHideStatusBarIcon: function() {
        return this.getBool("hide_status_bar_icon")
    }, getDisplayFoxSaverLogo: function() {
        return this.getBool("has_foxsaver_logo")
    }, isAutoFullScreen: function() {
        return this.getBool("switch_to_fullscreen_if_maximized")
    }, isHideSidebar: function() {
        return this.getBool("hide_sidebar_if_fullscreen")
    }, isAutoPlayByFoxSaverButtonEnabled: function() {
        return this.getBool("enable_auto_play_by_foxsaver_button")
    }, isSearchPageImageEnabled: function() {
        return this.getBool("enable_search_page_image")
    }, isStopToolTipDisabled: function() {
        return this.getBool("disable_tooltip_to_stop")
    }, isStopFoxSaverByMouseMove: function() {
        return this.getBool("stop_foxsaver_by_mouse_move")
    }, isFitSmallPicturesToScreen: function() {
        return this.getBool("fit_small_pictures_to_screen")
    }};
DEF["disable_tooltip_to_stop"] = true;
DEF["display_seconds"] = 30;
DEF["enable_auto_play_by_foxsaver_button"] = true;
DEF["enable_foxsaver"] = true;
DEF["enable_foxsaver_photos"] = false;
DEF["enable_random_image_reflection"] = false;
DEF["enable_rss_sources"] = true;
DEF["enable_user_rss_sources"] = true;
DEF["enable_random_tilting_image"] = false;
DEF["enable_user_photos"] = false;
DEF["enable_user_photos2"] = false;
DEF["enable_user_photos3"] = false;
DEF["enable_user_web_page"] = false;
DEF["enable_search_page_image"] = false;
DEF["foxsaver.preference.version"] = 0;
DEF["fit_small_pictures_to_screen"] = true;
DEF["has_fade_in_out"] = true;
DEF["has_foxsaver_logo"] = false;
DEF["hide_sidebar_if_fullscreen"] = true;
DEF["hide_status_bar_icon"] = true;
DEF["idle_minutes"] = 3;
DEF["image_extensions"] = "jpg,gif,png,jpeg";
DEF["quiet_sites"] = "";
DEF["user_dir"] = null;
DEF["user_dir2"] = null;
DEF["user_dir3"] = null;
DEF["user_rss_urls"] = "http://shops.amag.ru/adv";
DEF["user_web_page_url"] = "http://www.amag.ru";
DEF["save_dir"] = null;
DEF["switch_to_fullscreen_if_maximized"] = true;
DEF["stop_foxsaver_by_mouse_move"] = true;
DEF["login_session"] = false;
DEF["foxsaver_user_name"] = "";
DEF["foxsaver_user_password"] = "";
DEF["enable_random_image_show"] = false
