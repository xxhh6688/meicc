let articles = {
    show: false,
    title: "文章列表",
    topArticles: [],
    articles:[],
    init: function () {
        let self = this;
        self.getTopArticles();
        self.getArticles();
    },
    cleanup: function () { },
    getTopArticles: function () {
        let self = this;
        $.ajax({
            url: "tables/Articles?$filter=SetTop eq true&$orderby=Id desc&$top=3&$select=Id,Title,CreateTime,Thumbnail",
            method: "get",
            success: function (data) {
                self.topArticles.splice(0, self.topArticles.length);
                $.each(data.value, function (a, b) {
                    b.FullThumbnail = azStore.blobUrl + "/" + b.Thumbnail + azStore.sas;
                    b.CreateTime = getFormatedDateShort(b.CreateTime);
                    self.topArticles.push(b);
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
    getArticles: function () {
        let self = this;
        $.ajax({
            url: "tables/Articles?$filter=EventId eq null&$orderby=Id desc&$select=Id,Title,CreateTime,Content,Thumbnail",
            method: "get",
            success: function (data) {
                self.articles.splice(0, self.articles.length);
                $.each(data.value, function (a, b) {
                    b.FullThumbnail = azStore.blobUrl + "/" + b.Thumbnail + azStore.sas;
                    b.CreateTime = getFormatedDateShort(b.CreateTime);
                    b.Content = b.Content.replace(/<.*?>/g, '').substr(0, 100);
                    if (b.Id >= 70 && b.Id <= 73) {
                        return;
                    }

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
    }
};