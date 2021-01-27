let manageUser = {
    show: false,
    title: "管理用户",
    user: {
        Id: 0,
        Name: "",
        Cellphone: "",
        Type: 1
    },
    init: function () {
        let self = this;
        if (getHashValue("id")) {
            self.user.Id = getHashValue("id");
        }

        if (self.user.Id) {
            self.getUserInfo();
        }

        $("#main-nav").hide();
        $("#foot-nav").hide();

    },
    cleanup: function () {
        let self = this;
        self.user.Id = 0;
        self.user.Name = "";
        self.user.Cellphone = "";
        self.user.Type = 1;

        $("#main-nav").show();
        $("#foot-nav").show();
    },
    getUserInfo: function () {
        let self = this;
        $.ajax({
            url: "/tables/Users({0})".format(self.user.Id),
            method: "get",
            success: function (data) {
                self.user.Name = data.Name;
                self.user.Cellphone = data.Cellphone;
                self.user.Type = data.Type;
            },
            error: function (error) {
            },
            complete: function () {
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    },
    updateUserInfo: function () {
        let self = this;
        let inputData = {
            Name: self.user.Name,
            Cellphone: self.user.Cellphone,
            Type:self.user.Type
        };
        $.ajax({
            url: "/tables/Users({0})".format(self.user.Id),
            method: "patch",
            data:JSON.stringify(inputData),
            success: function (data) {
                alert("已更新");
            },
            error: function (error) {
            },
            complete: function () {
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    },
    resetPassword: function () {
        let self = this;
        if (!confirm("确认重置密码?")) {
            return;
        }

        let password = self.user.Cellphone.substr(-6, 6);
        let inputData = {
            Password:password
        };
        $.ajax({
            url: "/tables/Users({0})".format(self.user.Id),
            method: "patch",
            data:JSON.stringify(inputData),
            success: function (data) {
                alert("已重置密码");
            },
            error: function (error) {
            },
            complete: function () {
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    },
    changeUserType: function (type) {
        let self = this;
        if ((self.user.Type & type) == type) {
            self.user.Type = self.user.Type - type;
        }
        else {
            self.user.Type = self.user.Type + type;
        }
    },
    addUser: function () {
        let self = this;
        let inputData = {
            Name: self.user.Name,
            Cellphone: self.user.Cellphone,
            Type: self.user.Type,
            CreateTime: new Date().toISOString(),
            Password: self.user.Cellphone.substr(-6, 6)
        };
        $.ajax({
            url: "/tables/Users",
            method: "post",
            data: JSON.stringify(inputData),
            success: function (data) {
                window.location.href = "/#blade/manage/user?id="+data.Id;
            },
            error: function (error) {
            },
            complete: function () {
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    },
    deleteUser: function () {
        let self = this;
        main.common.checkAdmin();
        if (!confirm("确定删除用户?")) {
            return;
        }

        $.ajax({
            url: "/tables/Users({0})".format(self.user.Id),
            method: "delete",
            success: function (data) {
                alert("已删除");
                window.location.href = "/#blade/manage/users";
            },
            error: function (error) {
            },
            complete: function () {
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    }
};