let manageArticles = {
    show: false,
    title: "管理文章",
    articles: [],
    searchText:"",
    totalCount:0,
    init: function () {
        let self = this;
        main.common.checkAdmin();
        $("#main-nav").hide();
        $("#foot-nav").hide();
        self.pages.init();
        self.pages.showCount = 4;
        self.getArticles();

    },
    cleanup: function () {
        let self = this;
        $("#main-nav").show();
        $("#foot-nav").show();
    },
    getArticles: function () {
        let self = this;
        $.ajax({
            url: "/tables/Articles?$filter=EventId eq null&$orderby=Id desc&$top={0}&$skip={1}".format(self.pages.showCount,self.pages.showCount * (self.pages.currentPage - 1)),
            method: "get",
            success: function (data) {
                self.articles.splice(0, self.articles.length);
                $.each(data.value, function (a, b) {
                    b.CreateTime = getFormatedDateShort(b.CreateTime);
                    b.FullThumbnail = azStore.blobUrl + "/" + b.Thumbnail + azStore.sas;
                    b.Content = b.Content.replace(/<.*?>/g, '').substr(0,100);
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
        $.ajax({
            url: "/tables/Articles?$filter=EventId eq null&$select=Id",
            method: "get",
            success: function (data) {
                self.totalCount = data.value.length;
                self.pages.count = Math.floor(data.value.length / self.pages.showCount);
                if (data.value.length % self.pages.showCount > 0) {
                    self.pages.count += 1;
                }

                self.pages.url = "javascript:void(0);";
                self.pages.clickCallback = function (n) {
                    self.pages.currentPage = n;
                    self.getArticles();
                };
                self.pages.calc();
            },
            error: function (error) {
            },
            complete: function () {
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    },
    azStore: azStoreFactory.create(),
    pages: common.pages.getInstance(),
    search: function () {
        let self = this;
        $.ajax({
            url: "/tables/Articles?$filter=EventId eq null and contains(Title,'{2}')&$orderby=Id desc&$top={0}&$skip={1}".format(self.pages.showCount, self.pages.showCount * (self.pages.currentPage - 1), self.searchText),
            method: "get",
            success: function (data) {
                self.articles.splice(0, self.articles.length);
                $.each(data.value, function (a, b) {
                    b.CreateTime = getFormatedDateShort(b.CreateTime);
                    b.FullThumbnail = azStore.blobUrl + "/" + b.Thumbnail + azStore.sas;
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
        $.ajax({
            url: "/tables/Articles?$filter=EventId eq null and contains(Title, '{0}')&$select=Id".format(self.searchText),
            method: "get",
            success: function (data) {
                self.totalCount = data.value.length;
                self.pages.count = Math.floor(data.value.length / self.pages.showCount);
                if (data.value.length % self.pages.showCount > 0) {
                    self.pages.count += 1;
                }

                self.pages.url = "javascript:void(0);";
                self.pages.clickCallback = function (n) {
                    self.pages.currentPage = n;
                    self.getArticles();
                };
                self.pages.calc();
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