let manageEvent = {
    show: false,
    title: "管理日程",
    event: {
        Id: 0,
        Name: "",
        CreateTime: null,
        StartTime: null,
        EndTime: null,
        Location: "",
        MatchId: 0,
        Competitions: [],
        Article1: {
            Id: 0,
            Content:""
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
        ArticleUpdateCount: 0,
        BannerImage: "",
        FullBannerImage:""
    },
    switch: {
        index: 1
    },
    switchIndex: function (n) {
        let self = this;
        self.event["Article" + self.switch.index].Content = CKEDITOR.instances['manage-event-text'].getData();
        CKEDITOR.instances['manage-event-text'].setData(self.event["Article" + n].Content);
        self.switch.index = n;
    },
    init: function () {
        let self = this;
        main.common.checkAdmin();
        $("#main-nav").hide();
        $("#foot-nav").hide();

        if (getHashValue("id")) {
            self.event.Id = getHashValue("id");
            self.getCompetitions().then(function () {
                self.getEvent();
            });
            
            self.getEventArticles();
        }
        else {
            self.getCompetitions();
            Vue.nextTick(function () {
                CKEDITOR.replace('manage-event-text', {
                    height: 400
                });
            });
        }
    },
    cleanup: function () {
        let self = this;
        self.event.ArticleUpdateCount = 0;
        self.event.Id = 0;
        self.event.Name = "";
        self.event.StartTime = null;
        self.event.EndTime = null;
        self.event.CreateTime = null;
        self.event.Location = "";
        self.event.MatchId = 0;
        self.event.Competitions.splice(0, self.event.Competitions.length);
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
        self.BannerImage = "";
        self.FullBannerImage = "";

        $("#main-nav").show();
        $("#foot-nav").show();
    },
    addOrUpdate: function () {
        let self = this;
        if (self.event.Id) {
            self.updateEvent();
        }
        else {
            self.addEvent();
        }
    },
    addEvent: function () {
        let self = this;
        let inputData = {
            Name: self.event.Name,
            CreateTime: new Date().toISOString(),
            StartTime: new Date(self.event.StartTime).toISOString(),
            EndTime: new Date(self.event.EndTime).toISOString(),
            Location: self.event.Location,
            MatchId: self.event.MatchId,
            BannerImage:self.event.BannerImage
        };
        self.event["Article" + self.switch.index].Content = CKEDITOR.instances['manage-event-text'].getData();
        $.ajax({
            url: "/tables/Events",
            method: "post",
            data: JSON.stringify(inputData),
            success: function (data) {
                self.event.Id = data.Id;
                for (var i = 1; i <= 6; i++) {
                    self.addEventArticle(i).then(function () {
                        self.event.ArticleUpdateCount++;
                        if (self.event.ArticleUpdateCount >= 6) {
                            window.location.href = "/#blade/manage/event?id={0}".format(data.Id);
                        }
                    });
                }
            },
            error: function (error) {
                console.log(error);
            },
            complete: function () {
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    },
    addEventArticle: function (n) {
        let self = this;
        let inputData = {
            Title: "",
            CreateTime: new Date().toISOString(),
            EventId: self.event.Id,
            Content: self.event["Article" + n].Content,
            TypeInEvent:n+''
        };
        return $.ajax({
            url: "/tables/Articles",
            method: "post",
            data: JSON.stringify(inputData),
            success: function (data) {
                
            },
            error: function (error) {
                console.log(error);
            },
            complete: function () {
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    },
    updateEventArticle: function (n) {
        let self = this;
        let inputData = {
            Content: self.event["Article" + n].Content
        };
        return $.ajax({
            url: "/tables/Articles({0})".format(self.event["Article" + n].Id),
            method: "patch",
            data: JSON.stringify(inputData),
            success: function (data) {

            },
            error: function (error) {
                console.log(error);
            },
            complete: function () {
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    },
    updateEvent: function () {
        let self = this;
        let inputData = {
            Name: self.event.Name,
            CreateTime: new Date().toISOString(),
            StartTime: new Date(self.event.StartTime).toISOString(),
            EndTime: new Date(self.event.EndTime).toISOString(),
            Location: self.event.Location,
            MatchId: self.event.MatchId,
            BannerImage: self.event.BannerImage
        };
        self.event["Article" + self.switch.index].Content = CKEDITOR.instances['manage-event-text'].getData();
        $.ajax({
            url: "/tables/Events({0})".format(self.event.Id),
            method: "patch",
            data: JSON.stringify(inputData),
            success: function (data) {
                for (var i = 1; i <= 6; i++) {
                    self.updateEventArticle(i).then(function () {
                        self.event.ArticleUpdateCount++;
                        if (self.event.ArticleUpdateCount >= 6) {
                            self.event.ArticleUpdateCount = 0;
                            alert("已更新");
                        }
                    });
                }
            },
            error: function (error) {
                console.log(error);
            },
            complete: function () {
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    },
    deleteEvent: function () { },
    getEvent: function () {
        let self = this;
        return $.ajax({
            url: "/tables/Events({0})".format(self.event.Id),
            method: "get",
            success: function (data) {
                self.event.Name = data.Name;
                self.event.CreateTime = getFormatedDateSample(data.CreateTime);
                self.event.StartTime = getFormatedDateSample(data.StartTime);
                self.event.EndTime = getFormatedDateSample(data.EndTime);
                self.event.Location = data.Location;
                self.event.MatchId = data.MatchId;
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
    getCompetitions: function () {
        let self = this;
        return $.ajax({
            url: "/tables/Matches",
            method: "get",
            success: function (data) {
                self.event.Competitions.splice(self.event.Competitions.length);
                $.each(data.value, function (a, b) {
                    self.event.Competitions.push(b);
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
    getEventArticles: function () {
        let self = this;
        $.ajax({
            url: "/tables/Articles?$filter=EventId eq {0}".format(self.event.Id),
            method: "get",
            success: function (data) {
                $.each(data.value, function (a, b) {
                    if (b.TypeInEvent) {
                        self.event["Article" + b.TypeInEvent].Id = b.Id;
                        self.event["Article" + b.TypeInEvent].Content = b.Content;
                    }
                });

                Vue.nextTick(function () {
                    CKEDITOR.replace('manage-event-text', {
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
    updateBannerImage: function () {
        let self = this;
        azStore.container = "image";
        azStore.successCallback = function (result, fileName, newName) {
            self.event.BannerImage = azStore.container + "/" + newName;
            self.event.FullBannerImage = azStore.blobUrl + "/" + self.event.BannerImage + azStore.sas;
        };
        azStore.failCallback = function (result, name) {
            console.error(result);
        };
        azStore.progressCallback = function (progress) {
            if (progress < 100) {
                $("#uploadBannerImageProgress").show();
            }

            $("#uploadBannerImageProgress").find(".progress_text").text(progress);
            if (progress == 100) {
                setTimeout(function () {
                    $("#uploadBannerImageProgress").hide();
                }, 500);
            }
        };
        uploadfileBlob();
    },
    azStore: azStoreFactory.create()
};