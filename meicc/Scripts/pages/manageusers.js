let manageUsers = {
    show: false,
    title: "管理用户",
    users: [],
    searchText:"",
    init: function () {
        let self = this;
        main.common.checkAdmin();
        $("#main-nav").hide();
        $("#foot-nav").hide();

        self.getUsers();

    },
    cleanup: function () {
        let self = this;
        $("#main-nav").show();
        $("#foot-nav").show();
    },
    getUsers: function () {
        let self = this;
        $.ajax({
            url: "/tables/Users?$orderby=Id desc",
            method: "get",
            success: function (data) {
                self.users.splice(0, self.users.length);
                $.each(data.value, function (a, b) {
                    b.CreateTime = getFormatedDateShort(b.CreateTime);
                    b.TypeText = "用户, ";
                    if ((b.Type & 8) == 8) {
                        b.TypeText += "管理员, ";
                    }

                    self.users.push(b);
                });
            },
            error: function (error) {
            },
            complete: function () {
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    },
    searchUser: function () {
        let self = this;
        self.users.length = 0;
        $.ajax({
            url: "/tables/Users?$orderby=Id desc&$filter=contains(Name,'{0}') or contains(Cellphone,'{0}')".format(self.searchText),
            method: "get",
            success: function (data) {
                self.users.splice(0, self.users.length);
                $.each(data.value, function (a, b) {
                    b.CreateTime = getFormatedDateShort(b.CreateTime);
                    b.TypeText = "用户, ";
                    if ((b.Type & 8) == 8) {
                        b.TypeText += "管理员, ";
                    }

                    self.users.push(b);
                });
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