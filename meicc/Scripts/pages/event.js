let event = {
    show: false,
    title: "竞赛日程",
    event: {
        Id: 0,
        Name: "",
        CreateTime: null,
        StartTime: null,
        EndTime: null,
        BannerImage: "",
        FullBannerImage:"",
        Location: "",
        MatchId: 0,
        Match: {
            Id: 0,
            Image: "",
            FullImage: "",

        },
        Article1: {
            Id: 0,
            Content: ""
        },
        Article2: {
            Id: 0,
            Content: ""
        },
        Article3: {
            Id: 0,
            Content: ""
        },
        Article4: {
            Id: 0,
            Content: ""
        },
        Article5: {
            Id: 0,
            Content: ""
        },
        Article6: {
            Id: 0,
            Content: ""
        },
        ArticleUpdateCount: 0
    },
    switch: {
        index: 1
    },
    init: function () {
        let self = this;
        self.event.Id = getHashValue("id");
        if (self.event.Id) {
            self.getRelatedArticles();
            self.getEvent();
        }
    },
    cleanup: function () {
        let self = this;
        self.event.Id = 0;
        self.event.Name = "";
        self.event.StartTime = null;
        self.event.EndTime = null;
        self.event.CreateTime = null;
        self.event.Location = "";
        self.event.MatchId = 0;
        self.event.BannerImage = "";
        self.event.FullBannerImage = "";
        self.event.Article1.Id = 0;
        self.event.Article1.Content = "";
        self.event.Article2.Id = 0;
        self.event.Article2.Content = "";
        self.event.Article3.Id = 0;
        self.event.Article3.Content = "";
        self.event.Article4.Id = 0;
        self.event.Article4.Content = "";
        self.event.Article5.Id = 0;
        self.event.Article5.Content = "";
        self.event.Article6.Id = 0;
        self.event.Article6.Content = "";
        self.event.Match.Id = 0;
        self.event.Match.Name = "";
        self.event.Match.Image = "";
        self.event.Match.FullImage = "";
    },
    getEvent: function () {
        let self = this;
        $.ajax({
            url: "/tables/Events({0})?$expand=Match".format(self.event.Id),
            method: "get",
            success: function (data) {
                self.event.Name = data.Name;
                self.event.StartTime = getFormatedDateShort(data.StartTime);
                self.event.EndTime = getFormatedDateShort(data.EndTime);
                self.event.CreateTime = getFormatedDateShort(data.CreateTime);
                self.event.Location = data.Location;
                self.event.Match.Id = data.Match.Id;
                self.event.Match.LogoImage = data.Match.LogoImage;
                self.event.Match.FullLogoImage = azStore.blobUrl + "/" + self.event.Match.LogoImage + azStore.sas;
                self.event.Match.Name = data.Match.Name;
                self.event.BannerImage = data.BannerImage;
                self.event.FullBannerImage = azStore.blobUrl + "/" + self.event.BannerImage + azStore.sas;
            },
            error: function (error) {
            },
            complete: function () {
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    },
    getRelatedArticles: function () {
        let self = this;
        $.ajax({
            url: "/tables/Articles?$filter=EventId eq {0}".format(self.event.Id),
            method: "get",
            success: function (data) {
                $.each(data.value, function (a, b) {
                    self.event["Article" + b.TypeInEvent].Id = b.Id;
                    self.event["Article" + b.TypeInEvent].Content = b.Content;
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