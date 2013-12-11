FoxSaver.HashUtil = {hexcase: 0, b64pad: "", chrsz: 8, hex_sha1: function(s) {
        return this.binb2hex(this.core_sha1(this.str2binb(s), s.length * this.chrsz))
    }, b64_sha1: function(s) {
        return this.binb2b64(this.core_sha1(this.str2binb(s), s.length * this.chrsz))
    }, str_sha1: function(s) {
        return this.binb2str(this.core_sha1(this.str2binb(s), s.length * this.chrsz))
    }, hex_hmac_sha1: function(key, data) {
        return this.binb2hex(this.core_hmac_sha1(key, data))
    }, b64_hmac_sha1: function(key, data) {
        return this.binb2b64(this.core_hmac_sha1(key, data))
    }, str_hmac_sha1: function(key, data) {
        return this.binb2str(this.core_hmac_sha1(key, data))
    }, sha1_vm_test: function() {
        return this.hex_sha1("abc") == "a9993e364706816aba3e25717850c26c9cd0d89d"
    }, core_sha1: function(x, len) {
        x[len >> 5] |= 128 << (24 - len % 32);
        x[((len + 64 >> 9) << 4) + 15] = len;
        var w = Array(80);
        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;
        var e = -1009589776;
        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;
            var olde = e;
            for (var j = 0; j < 80; j++) {
                if (j < 16) {
                    w[j] = x[i + j]
                } else {
                    w[j] = this.rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1)
                }
                var t = this.safe_add(this.safe_add(this.rol(a, 5), this.sha1_ft(j, b, c, d)), this.safe_add(this.safe_add(e, w[j]), this.sha1_kt(j)));
                e = d;
                d = c;
                c = this.rol(b, 30);
                b = a;
                a = t
            }
            a = this.safe_add(a, olda);
            b = this.safe_add(b, oldb);
            c = this.safe_add(c, oldc);
            d = this.safe_add(d, oldd);
            e = this.safe_add(e, olde)
        }
        return Array(a, b, c, d, e)
    }, sha1_ft: function(t, b, c, d) {
        if (t < 20) {
            return(b & c) | ((~b) & d)
        }
        if (t < 40) {
            return b ^ c ^ d
        }
        if (t < 60) {
            return(b & c) | (b & d) | (c & d)
        }
        return b ^ c ^ d
    }, sha1_kt: function(t) {
        return(t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514
    }, core_hmac_sha1: function(key, data) {
        var bkey = this.str2binb(key);
        if (bkey.length > 16) {
            bkey = this.core_sha1(bkey, key.length * this.chrsz)
        }
        var ipad = Array(16), opad = Array(16);
        for (var i = 0; i < 16; i++) {
            ipad[i] = bkey[i] ^ 909522486;
            opad[i] = bkey[i] ^ 1549556828
        }
        var hash = this.core_sha1(ipad.concat(this.str2binb(data)), 512 + data.length * this.chrsz);
        return this.core_sha1(opad.concat(hash), 512 + 160)
    }, safe_add: function(x, y) {
        var lsw = (x & 65535) + (y & 65535);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return(msw << 16) | (lsw & 65535)
    }, rol: function(num, cnt) {
        return(num << cnt) | (num >>> (32 - cnt))
    }, str2binb: function(str) {
        var bin = Array();
        var mask = (1 << this.chrsz) - 1;
        for (var i = 0; i < str.length * this.chrsz; i += this.chrsz) {
            var j = str.charCodeAt(i / this.chrsz);
            if (!j) {
                j = 0
            }
            if (bin[i >> 5] == null) {
                bin[i >> 5] = 0
            }
            bin[i >> 5] |= (j & mask) << (32 - this.chrsz - i % 32)
        }
        return bin
    }, binb2str: function(bin) {
        var str = "";
        var mask = (1 << this.chrsz) - 1;
        for (var i = 0; i < bin.length * 32; i += this.chrsz) {
            str += String.fromCharCode((bin[i >> 5] >>> (32 - this.chrsz - i % 32)) & mask)
        }
        return str
    }, binb2hex: function(binarray) {
        var hex_tab = this.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for (var i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 15) + hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 15)
        }
        return str
    }, binb2b64: function(binarray) {
        var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var str = "";
        for (var i = 0; i < binarray.length * 4; i += 3) {
            var triplet = (((binarray[i >> 2] >> 8 * (3 - i % 4)) & 255) << 16) | (((binarray[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4)) & 255) << 8) | ((binarray[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4)) & 255);
            for (var j = 0; j < 4; j++) {
                if (i * 8 + j * 6 > binarray.length * 32) {
                    str += this.b64pad
                } else {
                    str += tab.charAt((triplet >> 6 * (3 - j)) & 63)
                }
            }
        }
        return str
    }}