let login = {
    show: false,
    title: "登录系统",
    credential: {
        cellphone: "",
        password:""
    },
    init: function () { },
    cleanup: function () { },
    submit: function () {
        let self = this;
        if (this.credential.cellphone.trim() == "") {
            alert("请输入用户名或手机号");
            return;
        }

        if (this.credential.password.trim() == "") {
            alert("请输入密码");
            return;
        }

        var data = {
            "Cellphone": self.credential.cellphone,
            "Password": self.credential.password
        };

        $.ajax({
            url: "/api/User/Login",
            method: "post",
            data: JSON.stringify(data),
            success: function (data) {
                if (data.StatusCode === 0) {
                    setCookie("meicc_token", parseInt(data.Object), 100);
                    window.location.href = "/#blade/home";
                }
                else {
                    alert(data.Object);
                }
            },
            error: function (error) {
            },
            complete: function () {
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    },
    logout: function () {
        var self = this;
        console.log("call logout");
        main.common.currentUser.Id = 0;
        main.common.currentUser.Name = "";
        main.common.currentUser.Type = 1;
        setCookie("meicc_token", 0, -100);
        window.location.href = "/#blade/home";
    }
};