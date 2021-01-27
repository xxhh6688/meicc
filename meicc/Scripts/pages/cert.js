let cert = {
    show: false,
    title: "证书查询",
    searchText: "",
    cert: {
        Id: 0,
        Name: "",
        CertId: "",
        Content: "",
        CreateTime: null
    },
    init: function () { },
    cleanup: function () {
        let self = this;
        self.cert.Id = 0;
        self.cert.Name = "";
        self.cert.CertId = "";
        self.cert.Content = "";
        self.cert.CreateTime = null;
    },
    searchCert: function () {
        let self = this;
        $.ajax({
            url: "/tables/Certs?$filter=CertId eq '{0}'".format(self.searchText),
            method: "get",
            success: function (data) {
                self.cert.Id = 0;
                self.cert.Name = "";
                self.cert.CertId = "";
                self.cert.Content = "";
                self.cert.CreateTime = null;

                if (data.value.length > 0) {
                    self.cert.Id = data.value[0].Id;
                    self.cert.Name = data.value[0].Name;
                    self.cert.CertId = data.value[0].CertId;
                    self.cert.Content = data.value[0].Content;
                    self.cert.CreateTime = getFormatedDateShort(data.value[0].CreateTime);
                }
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