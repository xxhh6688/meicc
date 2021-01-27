let search = {
    show: false,
    title: "站内搜索",
    searchText: "",
    switchIndex:1,
    articles: [],
    competitions: [],
    events: [],
    init: function () {
        let self = this;
        if (self.searchText) {
            self.search();
        }
    },
    cleanup: function () {
        let self = this;
        self.articles.length = 0;
        self.events.length = 0;
        self.competitions.length = 0;
        self.searchText = "";
        self.articles.length = 0;
        self.events.length = 0;
        self.competitions.length = 0;
    },
    search: function () {
        let self = this;
        self.articles.length = 0;
        self.events.length = 0;
        self.competitions.length = 0;
        self.getArticles();
        self.getEvents();
        self.getCompetitions();
    },
    getArticles: function () {
        let self = this;
        self.articles.length = 0;
        $.ajax({
            url: "tables/Articles?$filter=EventId eq null and contains(Title,'{0}')&$orderby=Id desc&$select=Id,Title,CreateTime,Content,Thumbnail".format(self.searchText),
            method: "get",
            success: function (data) {
                $.each(data.value, function (a, b) {
                    b.FullThumbnail = azStore.blobUrl + "/" + b.Thumbnail + azStore.sas;
                    b.CreateTime = getFormatedDateShort(b.CreateTime);
                    b.Content = b.Content.replace(/<.*?>/g, '').substr(0, 100);
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
    getCompetitions: function () {
        let self = this;
        $.ajax({
            url: "/tables/Matches?$filter=contains(Name,'{0}')".format(self.searchText),
            method: "get",
            success: function (data) {
                $.each(data.value, function (a, b) {
                    b.FullImage = azStore.blobUrl + "/" + b.Image + azStore.sas;
                    b.Description = b.Description.replace(/<.*?>/g, '');
                    self.competitions.push(b);
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
    getEvents: function () {
        let self = this;
        $.ajax({
            url: "/tables/Events?$filter=contains(Name,'{0}')".format(self.searchText),
            method: "get",
            success: function (data) {
                $.each(data.value, function (a, b) {
                    b.StartTime = getFormatedDateShort(b.StartTime);
                    b.EndTime = getFormatedDateShort(b.EndTime);
                    self.events.push(b);
                });
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
    azStore:azStoreFactory.create()
};