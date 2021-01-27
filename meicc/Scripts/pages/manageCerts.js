let manageCerts = {
    show: false,
    title: "",
    searchText: "",
    certs: [],
    init: function () {
        let self = this;
        main.common.checkAdmin();
        self.getCerts();

        $("#main-nav").hide();
        $("#foot-nav").hide();
    },
    cleanup: function () {
        let self = this;
        self.certs.length = 0;

        $("#main-nav").show();
        $("#foot-nav").show();
    },
    getCerts: function () {
        let self = this;
        $.ajax({
            url: "/tables/Certs",
            method: "get",
            success: function (data) {
                self.certs.length = 0;
                $.each(data.value, function (a, b) {
                    b.CreateTime = getFormatedDateShort(b.CreateTime);
                    self.certs.push(b);
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
    searchCert: function () {
        let self = this;
        $.ajax({
            url: "/tables/Certs?$filter=contains(CertId,'{0}')".format(self.searchText),
            method: "get",
            success: function (data) {
                self.certs.length = 0;
                $.each(data.value, function (a, b) {
                    b.CreateTime = getFormatedDateShort(b.CreateTime);
                    self.certs.push(b);
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