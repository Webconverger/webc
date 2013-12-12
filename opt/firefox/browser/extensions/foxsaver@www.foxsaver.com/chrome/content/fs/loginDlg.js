FoxSaver.loginDlg = {init: function() {
        this.loginInfo = window.arguments[0];
        this.menuEl = window.arguments[1];
        this.dlgEl = document.getElementById("foxsaver-login-dialog");
        var A = document.getElementById("login_uname");
        var B = document.getElementById("login_upwd");
        A.disable = false;
        B.disable = false;
        this.menuEl.label = FoxSaver.Util.getLoginStatus(this.loginInfo);
        A.value = this.loginInfo.uname;
        B.value = this.loginInfo.pwd
    }, setPref: function(B) {
        if (B) {
            var A = document.getElementById("login_uname");
            var C = document.getElementById("login_upwd");
            FoxSaver.Util.setLoginStatus(true, A.value, C.value)
        } else {
            FoxSaver.Util.setLoginStatus(false, "", "")
        }
        FoxSaver.loginDlg.menuEl.label = FoxSaver.Util.getLoginStatus(FoxSaver.loginDlg.loginInfo)
    }, onFailLogIn: function() {
        var A = document.getElementById("loginmessage");
        A.value = "Eror in Authenticate your user name/password!";
        FoxSaver.loginDlg.setPref(false)
    }, onSubmitBtn: function() {
        var B = document.getElementById("login_uname");
        var D = document.getElementById("login_upwd");
        var A = B ? B.value : "";
        var C = D ? D.value : "";
        if (!A || !C) {
            return false
        }
        B.disable = true;
        D.disable = true;
        window.setTimeout(function() {
            FoxSaver.loginDlg.sendAjax(A, C)
        }, 10);
        return false
    }, sendAjax: function(name, pwd) {
        var cb = {success: function(o) {
                var result = eval("(" + o.responseText + ")");
                if (result[0]) {
                    FoxSaver.loginDlg.setPref(true);
                    FoxSaver.loginDlg.dlgEl.cancelDialog()
                } else {
                    FoxSaver.loginDlg.onFailLogIn()
                }
            }, failure: function(o) {
                FoxSaver.loginDlg.dlgEl.cancelDialog();
                window.alert("Connection Error, Please Try Again Later!")
            }};
        var server = "http://www.foxsaver.com/account/ajax_login";
        var args = "remember_me=1";
        args += "&name=" + name;
        args += "&password=" + pwd;
        FoxSaver.YUI.util.Connect.asyncRequest("POST", server, cb, args);
        return
    }}