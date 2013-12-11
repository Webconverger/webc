FoxSaver.preferenceWindow = {init: function() {
        FoxSaver.preference.version = FoxSaver.preference.getInt("foxsaver.preference.version");
        var C = document.getElementsByAttribute("preftype", "*");
        for (var A = 0, B, E; A < C.length; A++) {
            B = C[A].getAttribute("preftype");
            E = C[A].getAttribute("id");
            switch (B) {
                case"bool":
                    C[A].checked = FoxSaver.preference.getBool(E);
                    break;
                case"string":
                    C[A].value = FoxSaver.preference.getString(E);
                    break;
                case"int":
                    C[A].value = FoxSaver.preference.getInt(E);
                    break;
                case"file":
                    if (FoxSaver.preference.getFile(E)) {
                        var D = FoxSaver.preference.getFile(E);
                        C[A].file = D;
                        if (!D) {
                            return
                        }
                        C[A].value = D.path
                    }
                    break
                }
        }
    }, setFilePref: function(B) {
        if (!B.value) {
            return
        }
        var A = (B.file && B.file.exists()) ? B.file : null;
        if (B.file && B.file.path != B.value) {
            A = FoxSaver.DirIO.open(B.value)
        }
        if (A && A.isDirectory()) {
            FoxSaver.preference._getPrefs().setComplexValue(B.getAttribute("id"), Components.interfaces.nsILocalFile, A)
        }
    }, setPrefs: function() {
        var E = document.getElementsByAttribute("preftype", "*");
        var B = FoxSaver.preference.isUserPhotoEnabled();
        for (var C = 0, D, F; C < E.length; C++) {
            D = E[C].getAttribute("preftype");
            F = E[C].getAttribute("id");
            switch (D) {
                case"bool":
                    FoxSaver.preference.setBool(F, (E[C].checked));
                    break;
                case"string":
                    FoxSaver.preference.setString(F, E[C].value);
                    break;
                case"int":
                    FoxSaver.preference.setInt(F, parseInt(E[C].value));
                    break;
                case"file":
                    this.setFilePref(E[C]);
                    break
                }
        }
        var A = FoxSaver.preference.isUserPhotoEnabled();
        return true
    }, browseCache: function() {
        var B = FoxSaver.DirIO.open(FoxSaver.Util.getCachePath());
        try {
            B.launch()
        } catch (A) {
            this.openExternal(B)
        }
    }, selectPictureDirectory: function() {
        var A = FoxSaver.preference.getUserDirectoryFile();
        A = FoxSaver.Util.getFolder((A == null ? "" : A.path));
        if (A) {
            FoxSaver.preference.setUserDirectoryFile(A);
            FoxSaver.preference.setUserPhotoEnabled(true)
        }
    }, setSelectedIdleMinutes: function(D) {
        var A = D.target;
        if (A.hasChildNodes()) {
            var C;
            for (C = 0; C < A.childNodes.length; C++) {
                var B = A.childNodes[C].getAttribute("label");
                if (FoxSaver.preference.getIdleMinutes() == B) {
                    A.childNodes[C].setAttribute("checked", "true")
                } else {
                    A.childNodes[C].removeAttribute("checked")
                }
            }
        }
    }, openExternal: function(A) {
        var C = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService).newFileURI(A);
        var B = Components.classes["@mozilla.org/uriloader/external-protocol-service;1"].getService(Components.interfaces.nsIExternalProtocolService);
        B.loadUrl(C);
        return
    }}