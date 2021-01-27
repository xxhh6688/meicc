let manageCompetition = {
    show: false,
    title: "管理赛事",
    match: {
        Id: 0,
        Name: "",
        Description: "",
        Image: "image/defaultsectionimage.jpg",
        FullImage: azStore.blobUrl + "/image/defaultsectionimage.jpg" + azStore.sas,
        LogoImage: "image/defaultsectionimage.jpg",
        FullLogoImage: azStore.blobUrl + "/image/defaultsectionimage.jpg" + azStore.sas
    },
    init: function () {
        let self = this;
        main.common.checkAdmin();
        $("#main-nav").hide();
        $("#foot-nav").hide();

        if (getHashValue("id")) {
            self.match.Id = getHashValue("id");
            self.getMatch();
        }
        else {
            Vue.nextTick(function () {
                CKEDITOR.replace('manage-match-text', {
                    height: 400
                });
            });
        }
    },
    cleanup: function () {
        let self = this;
        $("#main-nav").show();
        $("#foot-nav").show();
        self.match.Id = 0;
        self.match.Name = "";
        self.match.Description = "";
        self.match.Image = "image/defaultsectionimage.jpg";
        self.match.FullImage = azStore.blobUrl + "/" + self.match.Image + azStore.sas;
        self.match.LogoImage = "image/defaultsectionimage.jpg";
        self.match.FullLogoImage = azStore.blobUrl + "/" + self.match.LogoImage + azStore.sas;
    },
    getMatch: function () {
        let self = this;
        $.ajax({
            url: "/tables/Matches({0})".format(self.match.Id),
            method: "get",
            success: function (data) {
                self.match.Name = data.Name;
                self.match.Image = data.Image;
                self.match.FullImage = azStore.blobUrl + "/" + self.match.Image + azStore.sas;
                self.match.LogoImage = data.LogoImage;
                self.match.FullLogoImage = azStore.blobUrl + "/" + self.match.LogoImage + azStore.sas;
                self.match.Description = data.Description;
                Vue.nextTick(function () {
                    CKEDITOR.replace('manage-match-text', {
                        height: 400
                    });
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
    addOrUpdate: function () {
        let self = this;
        if (self.match.Id) {
            self.updateMatch();
        }
        else {
            self.addMatch();
        }
    },
    addMatch: function () {
        let self = this;
        let inputData = {
            Name: self.match.Name,
            Description: CKEDITOR.instances['manage-match-text'].getData(),
            Image: self.match.Image,
            LogoImage:self.match.LogoImage
        };
        $.ajax({
            url: "/tables/Matches",
            method: "post",
            data:JSON.stringify(inputData),
            success: function (data) {
                window.location.href = "/#blade/manage/competition?id=" + data.Id;
            },
            error: function (error) {
            },
            complete: function () {
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    },
    updateMatch: function () {
        let self = this;
        let inputData = {
            Name: self.match.Name,
            Description: CKEDITOR.instances['manage-match-text'].getData(),
            Image: self.match.Image,
            LogoImage: self.match.LogoImage
        };
        $.ajax({
            url: "/tables/Matches({0})".format(self.match.Id),
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
    updateImage: function () {
        let self = this;
        azStore.container = "image";
        azStore.successCallback = function (result, fileName, newName) {
            self.match.Image = azStore.container + "/" + newName;
            self.match.FullImage = azStore.blobUrl + "/" + self.match.Image + azStore.sas;
        };
        azStore.failCallback = function (result, name) {
            console.error(result);
        };
        azStore.progressCallback = function (progress) {
            if (progress < 100) {
                $("#uploadImageProgress").show();
            }

            $("#uploadImageProgress").find(".progress_text").text(progress);
            if (progress == 100) {
                setTimeout(function () {
                    $("#uploadImageProgress").hide();
                }, 500);
            }
        };
        uploadfileBlob();
    },
    updateLogoImage: function () {
        let self = this;
        azStore.container = "image";
        azStore.successCallback = function (result, fileName, newName) {
            self.match.LogoImage = azStore.container + "/" + newName;
            self.match.FullLogoImage = azStore.blobUrl + "/" + self.match.LogoImage + azStore.sas;
        };
        azStore.failCallback = function (result, name) {
            console.error(result);
        };
        azStore.progressCallback = function (progress) {
            if (progress < 100) {
                $("#uploadLogoImageProgress").show();
            }

            $("#uploadLogoImageProgress").find(".progress_text").text(progress);
            if (progress == 100) {
                setTimeout(function () {
                    $("#uploadLogoImageProgress").hide();
                }, 500);
            }
        };
        uploadfileBlob();
    },
    azStore: azStoreFactory.create()
}