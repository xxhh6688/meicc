let competition = {
    show: false,
    title: "竞赛",
    match: {
        Id: 0,
        Name: "",
        Description: "",
        Image: "",
        FullImage: "",
        LogoImage: "",
        FullLogoImage:"",
        Events:[]
    },
    init: function () {
        let self = this;
        self.match.Id = getHashValue("id");
        if (self.match.Id) {
            self.getCompetition();
        }
    },
    cleanup: function () {
        let self = this;
        self.match.Id = 0;
        self.match.Name = "";
        self.match.Description = "";
        self.match.Image = "";
        self.match.FullImage = "";
        self.match.LogoImage = "";
        self.match.FullLogoImage = "";
        self.match.Events.splice(0, self.match.Events.length);
    },
    getCompetition: function () {
        let self = this;
        $.ajax({
            url: "/tables/Matches({0})?$expand=Events".format(self.match.Id),
            method: "get",
            success: function (data) {
                self.match.Name = data.Name;
                self.match.Description = data.Description;
                self.match.Image = data.Image;
                self.match.FullImage = azStore.blobUrl + "/" + self.match.Image + azStore.sas;
                self.match.LogoImage = data.LogoImage;
                self.match.FullLogoImage = azStore.blobUrl + "/" + self.match.LogoImage + azStore.sas;
                $.each(data.Events, function (a, b) {
                    b.StartTime = getFormatedDateShort(b.StartTime);
                    b.EndTime = getFormatedDateShort(b.EndTime);
                    self.match.Events.push(b);
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
    azStore: azStoreFactory.create()
};