let article = {
    show: false,
    title: "文章详情",
    article: {
        Id: 0,
        Title: "",
        Content: "",
        CreateTime: null,
        m:null
    },
    init: function () {
        let self = this;
        self.article.Id = getHashValue("id");
        self.article.m = getHashValue("m");
        if (self.article.Id) {
            self.getArticle();
        }
    },
    cleanup: function () {
        let self = this;
        self.article.Id = 0;
        self.article.Title = "";
        self.article.Content = "";
        self.article.CreateTime = null;
        self.article.m = null;
    },
    getArticle: function () {
        let self = this;
        $.ajax({
            url: "/tables/Articles({0})".format(self.article.Id),
            method: "get",
            success: function (data) {
                self.article.Title = data.Title;
                self.article.Content = data.Content;
                self.article.CreateTime = getFormatedDateShort(data.CreateTime);
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