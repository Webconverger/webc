FoxSaver.FileIO = {localfileCID: "@mozilla.org/file/local;1", localfileIID: Components.interfaces.nsILocalFile, finstreamCID: "@mozilla.org/network/file-input-stream;1", finstreamIID: Components.interfaces.nsIFileInputStream, foutstreamCID: "@mozilla.org/network/file-output-stream;1", foutstreamIID: Components.interfaces.nsIFileOutputStream, sinstreamCID: "@mozilla.org/scriptableinputstream;1", sinstreamIID: Components.interfaces.nsIScriptableInputStream, suniconvCID: "@mozilla.org/intl/scriptableunicodeconverter", suniconvIID: Components.interfaces.nsIScriptableUnicodeConverter, ioserviceCID: "@mozilla.org/network/io-service;1", ioserviceIID: Components.interfaces.nsIIOService, downloadserviceCID: "@mozilla.org/download-manager;1", downloadserviceIID: Components.interfaces.nsIDownloadManager, webserviceCID: "@mozilla.org/embedding/browser/nsWebBrowserPersist;1", webserviceIID: Components.interfaces.nsIWebBrowserPersist, netstreamserviceCID: "@mozilla.org/network/stream-loader;1", netstreamserviceIID: Components.interfaces.nsIStreamLoader, uriserviceCID: "@mozilla.org/network/standard-url;1", uriserviceIID: Components.interfaces.nsIURI, fprotohandlerIID: Components.interfaces.nsIFileProtocolHandler, open: function(path) {
        try {
            var file = Components.classes[this.localfileCID].createInstance(this.localfileIID);
            file.initWithPath(path);
            return file
        } catch (e) {
            return false
        }
    }, read: function(file, charset) {
        try {
            var data = new String();
            var fiStream = Components.classes[this.finstreamCID].createInstance(this.finstreamIID);
            var siStream = Components.classes[this.sinstreamCID].createInstance(this.sinstreamIID);
            fiStream.init(file, 1, 0, false);
            siStream.init(fiStream);
            data += siStream.read(-1);
            siStream.close();
            fiStream.close();
            if (charset) {
                data = this.toUnicode(charset, data)
            }
            return data
        } catch (e) {
            return false
        }
    }, readAsync: function(file, observer) {
        try {
            var ioService = Components.classes[this.ioserviceCID].getService(this.ioserviceIID);
            var fileURI = ioService.newFileURI(file);
            var channel = ioService.newChannelFromURI(fileURI);
            observer = observer ? observer : {onStreamComplete: function(aLoader, aContext, aStatus, aLength, aResult) {
                }};
            var sl = Components.classes[this.netstreamserviceCID].createInstance(this.netstreamserviceIID);
            sl.init(channel, observer, null);
            return true
        } catch (e) {
            return false
        }
    }, readURL: function(aURL) {
        try {
            var ioService = Components.classes[this.ioserviceCID].getService(this.ioserviceIID);
            var scriptableStream = Components.classes[this.sinstreamCID].createInstance(this.sinstreamIID);
            var channel = ioService.newChannel(aURL, null, null);
            var input = channel.open();
            scriptableStream.init(input);
            var str = scriptableStream.read(input.available());
            scriptableStream.close();
            input.close();
            return str
        } catch (e) {
            return false
        }
    }, exportImgFromCanvas: function(canvasElem, targetFile) {
        if (!canvasElem) {
            return null
        }
        var ioService = Components.classes[this.ioserviceCID].getService(this.ioserviceIID);
        var source = ioService.newURI(canvasElem.toDataURL("image/png", ""), "UTF8", null);
        var target = io.newFileURI(targetFile);
        var persist = Components.classes[this.webserviceCID].createInstance(this.webserviceIID);
        persist.persistFlags = this.webserviceIID.PERSIST_FLAGS_REPLACE_EXISTING_FILES;
        persist.persistFlags |= this.webserviceIID.PERSIST_FLAGS_AUTODETECT_APPLY_CONVERSION;
        persist.saveURI(source, null, null, null, null, targetFile, null);
        return persist
    }, downloadURL: function(uri, targetFile, callbkfn) {
        var dm = Components.classes[this.downloadserviceCID].getService(this.downloadserviceIID);
        var fromUri = Components.classes[this.uriserviceCID].createInstance(this.uriserviceIID);
        fromUri.spec = uri;
        var cacheEntry = FoxSaver.Util.openCacheEntry(uri);
        var ioService = Components.classes[this.ioserviceCID].getService(this.ioserviceIID);
        var persist = Components.classes[this.webserviceCID].createInstance(this.webserviceIID);
        if (!persist) {
            return null
        }
        persist.persistFlags = this.webserviceIID.PERSIST_FLAGS_REPLACE_EXISTING_FILES | this.webserviceIID.PERSIST_FLAGS_BYPASS_CACHE | this.webserviceIID.PERSIST_FLAGS_FAIL_ON_BROKEN_LINKS | this.webserviceIID.PERSIST_FLAGS_AUTODETECT_APPLY_CONVERSION | this.webserviceIID.PERSIST_FLAGS_CLEANUP_ON_FAILURE;
        if (callbkfn) {
            persist.progressListener = new FoxSaver.UrlDownloader(callbkfn)
        }
        try {
            persist.saveURI(fromUri, cacheEntry, null, null, null, targetFile, null)
        } catch (e) {
            FoxSaver.log("downloadurl failed" + e)
        }
        return persist
    }, isPersistFinished: function(persist) {
        if (!persist || !persist.currentState) {
            return false
        }
        return(persist.currentState == PERSIST_STATE_FINISHED)
    }, write: function(file, data, mode, charset) {
        try {
            var foStream = Components.classes[this.foutstreamCID].createInstance(this.foutstreamIID);
            if (charset) {
                data = this.fromUnicode(charset, data)
            }
            var flags = 2 | 8 | 32;
            if (mode == "a") {
                flags = 2 | 16
            }
            foStream.init(file, flags, 436, 0);
            foStream.write(data, data.length);
            foStream.close();
            return true
        } catch (e) {
            return false
        }
    }, create: function(file) {
        try {
            file.create(0, 436);
            return true
        } catch (e) {
            return false
        }
    }, unlink: function(file) {
        try {
            file.remove(false);
            return true
        } catch (e) {
            return false
        }
    }, path: function(file) {
        try {
            return"file:///" + file.path.replace(/\\/g, "\/").replace(/^\s*\/?/, "").replace(/\ /g, "%20")
        } catch (e) {
            return false
        }
    }, url: function(file) {
        try {
            var ios = Components.classes[ioserviceCID].getService(ioserviceIID);
            var fileHandler = ios.getProtocolHandler("file").QueryInterface(fprotohandlerIID);
            return fileHandler.getURLSpecFromFile(file)
        } catch (e) {
            return false
        }
    }, basename: function(file) {
        var rv = null;
        try {
            var leafName = file.leafName;
            var dotIndex = leafName.lastIndexOf(".");
            rv = (dotIndex > 0) ? leafName.substring(0, dotIndex - 1) : "";
            return rv
        } catch (e) {
            return null
        }
    }, ext: function(file) {
        var rv = null;
        try {
            var leafName = file.leafName;
            var dotIndex = leafName.lastIndexOf(".");
            rv = (dotIndex >= 0) ? leafName.substring(dotIndex + 1) : "";
            return rv
        } catch (e) {
            return null
        }
    }, _rmFile: function(filename) {
        var tgtf = FoxSaver.FileIO.open(filename);
        if (tgtf && tgtf.exists()) {
            FoxSaver.FileIO.unlink(tgtf)
        }
    }, _cpFromFileHanlde: function(srcfile, targetFolderName, targetName) {
        if (!srcfile || !srcfile.exists() || !srcfile.isFile()) {
            return null
        }
        targetFolder = FoxSaver.DirIO.open(targetFolderName);
        if (!targetFolder) {
            return null
        }
        if (!targetFolder.exists()) {
            FoxSaver.DirIO.create(targetFolder)
        }
        if (targetName) {
            targetName = FoxSaver.Util.trim(targetName.replace(FoxSaver.DirIO.sep, "-"));
            var targetFileFullName = targetFolder.path + FoxSaver.DirIO.sep + targetName;
            FoxSaver.FileIO._rmFile(targetFileFullName)
        }
        try {
            srcfile.copyTo(targetFolder, targetName);
            if (!targetName) {
                targetName = srcfile.leafName
            }
            return targetFileFullName
        } catch (e) {
            return null
        }
        return null
    }, toUnicode: function(charset, data) {
        if (charset == -1) {
            return data
        }
        try {
            var uniConv = Components.classes[this.suniconvCID].createInstance(this.suniconvIID);
            uniConv.charset = charset;
            data = uniConv.ConvertToUnicode(data)
        } catch (e) {
        }
        return data
    }, fromUnicode: function(charset, data) {
        try {
            var uniConv = Components.classes[this.suniconvCID].createInstance(this.suniconvIID);
            uniConv.charset = charset;
            data = uniConv.ConvertFromUnicode(data)
        } catch (e) {
        }
        return data
    }};
FoxSaver.DirIO = {sep: "/", dirservCID: "@mozilla.org/file/directory_service;1", propsIID: Components.interfaces.nsIProperties, fileIID: Components.interfaces.nsIFile, get: function(type) {
        try {
            var dir = Components.classes[this.dirservCID].createInstance(this.propsIID).get(type, this.fileIID);
            return dir
        } catch (e) {
            return false
        }
    }, open: function(path) {
        return FoxSaver.FileIO.open(path)
    }, create: function(dir) {
        try {
            dir.create(1, 436);
            return true
        } catch (e) {
            return false
        }
    }, read: function(dir, recursive, level) {
        var list = new Array();
        if (!level) {
            level = -1
        }
        try {
            if (dir && dir.isDirectory()) {
                if (recursive == null) {
                    recursive = false
                }
                var files = dir.directoryEntries;
                var list = new Array();
                this._read(files, list, recursive, level)
            }
        } catch (e) {
        }
        return list
    }, _read: function(dirEntry, list, recursive, level) {
        if (level == 0) {
            return
        }
        if (level > 0) {
            level--
        }
        try {
            while (dirEntry.hasMoreElements()) {
                var curFile = dirEntry.getNext().QueryInterface(FoxSaver.FileIO.localfileIID);
                if (curFile) {
                    list.push(curFile);
                    if (curFile.isDirectory() && recursive) {
                        var curDir = curFile.directoryEntries;
                        this._read(curDir, list, recursive, level)
                    }
                }
            }
        } catch (e) {
        }
    }, unlink: function(dir, recursive) {
        try {
            if (recursive == null) {
                recursive = false
            }
            dir.remove(recursive);
            return true
        } catch (e) {
            return false
        }
    }, path: function(dir) {
        return FoxSaver.FileIO.path(dir)
    }, url: function(dir) {
        return FoxSaver.FileIO.url(dir)
    }, split: function(str, join) {
        var arr = str.split(/\/|\\/), i;
        str = new String();
        for (i = 0; i < arr.length; ++i) {
            str += arr[i] + ((i != arr.length - 1) ? join : "")
        }
        return str
    }, join: function(str, split) {
        var arr = str.split(split), i;
        str = new String();
        for (i = 0; i < arr.length; ++i) {
            str += arr[i] + ((i != arr.length - 1) ? this.sep : "")
        }
        return str
    }};
if (navigator.platform.toLowerCase().indexOf("win") > -1) {
    FoxSaver.DirIO.sep = "\\"
}