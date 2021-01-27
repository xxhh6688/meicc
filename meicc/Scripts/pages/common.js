let common = {
    currentUser: {
        Id: 0,
        Name: "",
        Cellphone: "",
        Type:1
    },
    showCurrentUserMenu:false,
    azStore: azStoreFactory.create(),
    upload: function (callback, container) {
        let self = this;
        self.azStore.container = container;
        azStore.successCallback = function (result, fileName, newName) {
            let fullLink = azStore.blobUrl + "/" + azStore.container + "/" + newName + azStore.sas;
            callback(fullLink, self.azStore.container + "/" + newName, fileName);
            $("#uploadCKFile").val("");
        };
        azStore.failCallback = function (result, name) {
            console.error(result);
        };
        azStore.progressCallback = function (progress) {
            if (progress < 100) {
                $("#uploadCKFileProgress").show();
            }

            $("#uploadCKFileProgress").find(".progress_text").text(progress);
            if (progress == 100) {
                setTimeout(function () {
                    $("#uploadCKFileProgress").hide();
                }, 500);
            }
        };
        uploadfileBlob();
    },
    getCurrentUser: function (force) {
        var self = this;
        if (!this.currentUser.Id || force) {
            return $.ajax({
                url: "/api/User/GetUserInfo",
                method: "get",
                success: function (data) {
                    self.currentUser = data.Object;
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
        else {
            var d = $.Deferred();
            return d.resolve("Ok");
        }
    },
    init: function () {
        let self = this;
        self.getCurrentUser();
    },
    cleanup: function () {
        let self = this;
        self.showCurrentUserMenu = false;
    },
    pages: {
        getInstance: function () {
            let a = {
                showPages: [],
                count: 0,
                url: "",
                showCount: 8,
                currentPage: 0,
                calc: function () {
                    let self = this;
                    self.showPages.splice(0, self.showPages.length);
                    let step = 1;
                    if (self.count > 9) {
                        let n = -3;
                        while (step < 8 && self.currentPage + n < self.count) {
                            if (self.currentPage + n > 1) {
                                self.showPages.push(self.currentPage + n);
                                step++;
                            }

                            n++;
                        }
                    }
                    else {
                        while (step < self.count - 1) {
                            step++;
                            self.showPages.push(step);
                        }
                    }
                },
                init: function () {
                    let self = this;
                    self.currentPage = parseInt(getHashValue("page"));
                    self.next = self.currentPage + 1;
                    self.clickCallback = function () { };
                    if (!self.currentPage) {
                        self.currentPage = 1;
                        self.next = self.currentPage + 1;
                    }
                }
            };

            return a;
        }
    },
    goSearch: function () {
        if (main.search.show) {
            search.search();
        }
        else {
            window.location.href = "/#blade/search";
        }
    },
    checkAdmin: function () {
        let self = this;
        self.getCurrentUser().then(function () {
            let isAdmin = false;
            if (self.currentUser && (self.currentUser.Type & 8) == 8) {
                isAdmin = true;
            }

            if (!isAdmin) {
                alert("没有授权");
                window.location.href = "/#blade/home";
            }
        });
    }
};