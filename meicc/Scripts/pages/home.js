let home = {
    show: false,
    title: "中国大学生机械工程创新创意大赛",
    banner: {
        index: 0,
        timer:null
    },
    stories: [],
    articles: [],
    matches: [],
    events:[],
    init: function () {
        let self = this;
        self.getStories();
        self.getArticles();
        self.getMatch();
        self.getEvent();
    },
    cleanup: function () { },
    getStories: function () {
        let self = this;
        $.ajax({
            url: "/tables/Articles?$filter=SetStory eq true&$orderby=CreateTime desc",
            method: "get",
            success: function (data) {
                self.stories.splice(0, self.stories.length);
                $.each(data.value, function (a, b) {
                    b.FullStoryImage = azStore.blobUrl + "/" + b.StoryImage + azStore.sas;
                    self.stories.push(b);
                });
                if (!self.banner.timer) {
                    self.banner.timer = setInterval(function () {
                        self.banner.index++;
                        if (self.banner.index == self.stories.length) {
                            self.banner.index = 0;
                        }
                    }, 5000);
                }
            },
            error: function (error) {
            },
            complete: function () {
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    },
    getArticles: function () {
        let self = this;
        $.ajax({
            url: "/tables/Articles?$filter=(SetTop eq true and EventId eq null)&$orderby=CreateTime desc&$top=3",
            method: "get",
            success: function (data) {
                self.articles.splice(0, self.articles.length);
                $.each(data.value, function (a, b) {
                    b.FullThumbnail = azStore.blobUrl + "/" + b.Thumbnail + azStore.sas;
                    b.CreateTime = getFormatedDateShort(b.CreateTime);
                    self.articles.push(b);
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
    getMatch: function () {
        let self = this;
        $.ajax({
            url: "/tables/Matches?$$top=8",
            method: "get",
            success: function (data) {
                self.matches.splice(0, self.matches.length);
                $.each(data.value, function (a, b) {
                    b.FullImage = azStore.blobUrl + "/" + b.Image + azStore.sas;
                    b.Description = b.Description.replace(/<.*?>/g, '');
                    self.matches.push(b);
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
    getEvent: function () {
        let self = this;
        $.ajax({
            url: "/tables/Events?$$top=10",
            method: "get",
            success: function (data) {
                self.events.splice(0, self.events.length);
                $.each(data.value, function (a, b) {
                    b.StartTime = getFormatedDateShort(b.StartTime);
                    self.events.push(b);
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