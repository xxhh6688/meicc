let manageCert = {
    show: false,
    title: "管理证书",
    cert: {
        Id: 0,
        Name: "",
        CertId: "",
        CreateTime:null
    },
    init: function () {
        let self = this;
        main.common.checkAdmin();
        if (getHashValue("id")) {
            self.cert.Id = getHashValue("id");
            self.getCert();
        }

        Vue.nextTick(function () {
            CKEDITOR.replace('cert-content', {
                height: 400
            });
        });

        $("#main-nav").hide();
        $("#foot-nav").hide();
    },
    cleanup: function () {
        let self = this;
        self.cert.Id = 0;
        self.cert.Name = "";
        self.cert.CertId = "";
        self.cert.CreateTime = null;

        $("#main-nav").show();
        $("#foot-nav").show();
    },
    getCert: function () {
        let self = this;
        $.ajax({
            url: "/tables/Certs({0})".format(self.cert.Id),
            method: "get",
            success: function (data) {
                self.cert.Name = data.Name;
                self.cert.CertId = data.CertId;
                self.cert.CreateTime = getFormatedDate(data.CreateTime);
                self.cert.Content = data.Content;
            },
            error: function (error) {
            },
            complete: function () {
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    },
    addCert: function () {
        let self = this;
        let inputData = {
            Name: self.cert.Name,
            CertId: self.cert.CertId,
            Content: CKEDITOR.instances['cert-content'].getData(),
            CreateTime:new Date().toISOString()
        };
        $.ajax({
            url: "/tables/Certs",
            method: "post",
            data:JSON.stringify(inputData),
            success: function (data) {
                alert("创建证书成功");
                window.location.href = "/#blade/manage/cert?id="+data.Id;
            },
            error: function (error) {
            },
            complete: function () {
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    },
    updateCert: function () {
        let self = this;
        let inputData = {
            Name: self.cert.Name,
            CertId: self.cert.CertId,
            Content: CKEDITOR.instances['cert-content'].getData(),
            CreateTime: new Date().toISOString()
        };
        $.ajax({
            url: "/tables/Certs({0})".format(self.cert.Id),
            method: "patch",
            data:JSON.stringify(inputData),
            success: function (data) {
                alert("证书已经更新");
            },
            error: function (error) {
            },
            complete: function () {
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    },
    deleteCert: function () {
        let self = this;
        if (!confirm("确认删除证书?")) {
            return;
        }

        $.ajax({
            url: "/tables/Certs({0})".format(self.cert.Id),
            method: "delete",
            success: function (data) {
                alert("证书已经删除");
                window.location.href = "/#blade/manage/certs";
            },
            error: function (error) {
            },
            complete: function () {
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    },
    newCertId: function () {
        let self = this;
        let d = new Date();
        let dateStr = "{0}{1}{2}".format(d.getFullYear(), ("0" + (d.getMonth() + 1)).substr(-2, 2), ("0" + d.getDate()).substr(-2, 2));
        self.cert.CertId = dateStr + getRandString(8);
    }
};