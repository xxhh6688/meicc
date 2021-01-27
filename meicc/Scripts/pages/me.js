let me = {
    show: false,
    title: "修改个人信息",
    switchIndex:1,
    user: {
        Id:0,
        Name: "",
        Cellphone:"",
        OldPsw: "",
        NewPsw: "",
        NewPsw2:""
    },
    init: function () {
        let self = this;
        common.getCurrentUser().then(function () {
            self.user.Id = common.currentUser.Id;
            self.user.Name = common.currentUser.Name;
            self.user.Cellphone = common.currentUser.Cellphone;
        });
    },
    cleanup: function () {
        let self = this;
        self.user.Id = 0;
        self.user.Name = "";
        self.user.Cellphone = "";
        self.user.OldPsw = "";
        self.user.NewPsw = "";
        self.user.NewPsw2 = "";
        self.switchIndex = 1;
    },
    updateUserInfo: function () {
        let self = this;
        let inputData = {
            Name:self.user.Name
        };
        $.ajax({
            url: "/tables/Users({0})".format(self.user.Id),
            method: "patch",
            data:JSON.stringify(inputData),
            success: function (data) {
                alert("已更新用户信息");
            },
            error: function (error) {
            },
            complete: function () {
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    },
    updateUserPsw: function () {
        let self = this;
        if (self.user.NewPsw.trim() != self.user.NewPsw2.trim()) {
            alert("两次输入密码不一致");
            return;
        }

        if (self.user.NewPsw.trim() == "") {
            alert("密码不能为空");
            return;
        }

        self.checkUser().then(function (data) {
            if (data == 404) {
                alert("旧密码不正确");
                return;
            }
            else if (data == 500) {
                alert("服务器错误");
                return;
            }
            else if(data == 0){
                let inputData = {
                    Password: self.user.NewPsw
                };
                $.ajax({
                    url: "/tables/Users({0})".format(self.user.Id),
                    method: "patch",
                    data: JSON.stringify(inputData),
                    success: function (data) {
                        alert("已更新密码");
                    },
                    error: function (error) {
                    },
                    complete: function () {
                    },
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                });
            }
        });
    },
    checkUser: function () {
        let self = this;
        let inputData = {
            "Cellphone": self.user.Cellphone,
            "Password": self.user.OldPsw
        };
        let d = $.Deferred();
        $.ajax({
            url: "/api/User/Login",
            method: "post",
            data: JSON.stringify(inputData),
            success: function (data) {
                d.resolve(data.StatusCode);
            },
            error: function (error) {
                d.resolve(500);
            },
            complete: function () {
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
        return d;
    }
};