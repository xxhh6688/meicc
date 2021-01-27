let manageCompetitions = {
    show: false,
    title: "管理赛事",
    matches: [],
    init: function () {
        let self = this;
        main.common.checkAdmin();
        $("#main-nav").hide();
        $("#foot-nav").hide();
        self.getCompetitions();
    },
    cleanup: function () {
        $("#main-nav").show();
        $("#foot-nav").show();
    },
    getCompetitions: function () {
        let self = this;
        $.ajax({
            url: "/tables/Matches",
            method: "get",
            success: function (data) {
                self.matches.splice(0, self.matches.length);
                $.each(data.value, function (a, b) {
                    b.FullImage = azStore.blobUrl + "/" + b.Image + azStore.sas;
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
    azStore: azStoreFactory.create()
};