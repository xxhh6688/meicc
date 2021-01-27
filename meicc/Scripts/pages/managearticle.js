let manageArticle = {
    show: false,
    title: "编辑文章",
    article: {
        Id: 0,
        Title: "",
        Content: "",
        SetTop:false,
        SetHot: false,
        CreateTime:null,
        CreateBy:null,
        EventId:null,
        TypeInEvent:null,
        SetStory:false,
        StoryImage: "",
        FullStoryImage:"",
        StoryLink:"",
        Thumbnail: "",
        FullThumbnail:""
    },
    init: function () {
        let self = this;
        main.common.checkAdmin();
        $("#main-nav").hide();
        $("#foot-nav").hide();

        if (self.article.Thumbnail == "") {
            self.article.Thumbnail = "image/defaultsectionimage.jpg";
            self.article.FullThumbnail = azStore.blobUrl + "/image/defaultsectionimage.jpg" + azStore.sas;
        }

        if (getHashValue("id")) {
            self.article.Id = getHashValue("id");
            self.getArticle();
        }
        else {
            Vue.nextTick(function () {
                CKEDITOR.replace('article-content-text', {
                    height: 400
                });
            });
        }

    },
    cleanup: function () {
        let self = this;
        $("#main-nav").show();
        $("#foot-nav").show();
        self.article.Id = 0;
        self.article.Title = "";
        self.article.Content = "";
        self.article.SetTop = false;
        self.article.CreateTime = null;
        self.article.CreateBy = null;
        self.article.EventId = null;
        self.article.TypeInEvent = null;
        self.article.SetStory = false;
        self.article.StoryImage = "";
        self.article.FullStoryImage = "";
        self.article.StoryLink = "";
        self.article.Thumbnail = "";
    },
    addArticle: function () {
        let self = this;
        let inputData = {
            Title : self.article.Title,
            Content: CKEDITOR.instances['article-content-text'].getData(),
            SetTop : self.article.SetTop,
            SetHot : self.article.SetHot,
            SetStory : self.article.SetStory,
            StoryImage : self.article.StoryImage,
            StoryLink : self.article.StoryLink,
            Thumbnail: self.article.Thumbnail,
            CreateTime:new Date().toISOString()
        };

        $.ajax({
            url: "/tables/Articles",
            method: "post",
            data:JSON.stringify(inputData),
            success: function (data) {
                window.location.href = "/#blade/manage/article?id={0}".format(data.Id);
            },
            error: function (error) {
            },
            complete: function () {
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    },
    getArticle: function () {
        let self = this;
        $.ajax({
            url: "/tables/Articles({0})".format(self.article.Id),
            method: "get",
            success: function (data) {
                self.article.Title = data.Title;
                self.article.Content = data.Content;
                self.article.SetTop = data.SetTop;
                self.article.SetHot = data.SetHot;
                self.article.SetStory = data.SetStory;
                self.article.StoryImage = data.StoryImage;
                self.article.StoryLink = data.StoryLink;
                self.article.Thumbnail = data.Thumbnail;
                self.article.FullThumbnail = azStore.blobUrl + "/" + self.article.Thumbnail + azStore.sas;
                self.article.FullStoryImage = azStore.blobUrl + "/" + self.article.StoryImage + azStore.sas;

                Vue.nextTick(function () {
                    CKEDITOR.replace('article-content-text', {
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
    updateArticle: function () {
        let self = this;
        let inputData = {
            Title: self.article.Title,
            Content: CKEDITOR.instances['article-content-text'].getData(),
            SetTop: self.article.SetTop,
            SetHot: self.article.SetHot,
            SetStory: self.article.SetStory,
            StoryImage: self.article.StoryImage,
            StoryLink: self.article.StoryLink,
            Thumbnail: self.article.Thumbnail
        };
        $.ajax({
            url: "/tables/Articles({0})".format(self.article.Id),
            method: "patch",
            data: JSON.stringify(inputData),
            success: function (data) {
                alert("文章已经更新");
            },
            error: function (error) {
            },
            complete: function () {
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    },
    updateThumbnail: function () {
        let self = this;
        azStore.container = "image";
        azStore.successCallback = function (result, fileName, newName) {
            self.article.Thumbnail = azStore.container + "/" + newName;
            self.article.FullThumbnail = azStore.blobUrl + "/" + self.article.Thumbnail + azStore.sas;
        };
        azStore.failCallback = function (result, name) {
            console.error(result);
        };
        azStore.progressCallback = function (progress) {
            if (progress < 100) {
                $("#uploadThumbnailProgress").show();
            }

            $("#uploadThumbnailProgress").find(".progress_text").text(progress);
            if (progress == 100) {
                setTimeout(function () {
                    $("#uploadThumbnailProgress").hide();
                }, 500);
            }
        };
        uploadfileBlob();
    },
    updateStoryImage: function () {
        let self = this;
        azStore.container = "image";
        azStore.successCallback = function (result, fileName, newName) {
            self.article.StoryImage = azStore.container + "/" + newName;
            self.article.FullStoryImage = azStore.blobUrl + "/" + self.article.StoryImage + azStore.sas;
        };
        azStore.failCallback = function (result, name) {
            console.error(result);
        };
        azStore.progressCallback = function (progress) {
            if (progress < 100) {
                $("#uploadStoryImageProgress").show();
            }

            $("#uploadStoryImageProgress").find(".progress_text").text(progress);
            if (progress == 100) {
                setTimeout(function () {
                    $("#uploadStoryImageProgress").hide();
                }, 500);
            }
        };
        uploadfileBlob();
    },
    azStore: azStoreFactory.create(),
    addOrUpdate: function () {
        let self = this;
        if (self.article.Id) {
            self.updateArticle();
        }
        else {
            self.addArticle();
        }
    },
    deleteArticle: function () {
        let self = this;
        if (!confirm("确认删除该文章?")) {
            return;
        }

        $.ajax({
            url: "/tables/Articles({0})".format(self.article.Id),
            method: "delete",
            success: function (data) {
                window.location.href = "/#blade/manage/articles";
            },
            error: function (error) {
                console.log(error);
            },
            complete: function () {
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        });
    }
};