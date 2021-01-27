let competitions = {
    show: false,
    title: "所有竞赛",
    matches:[],
    init: function () {
        let self = this;
        self.getMatch();
    },
    cleanup: function () { },
    getMatch: function () {
        let self = this;
        $.ajax({
            url: "/tables/Matches",
            method: "get",
            success: function (data) {
                self.matches.splice(0, self.matches.length);
                $.each(data.value, function (a, b) {
                    b.FullImage = azStore.blobUrl + "/" + b.Image + azStore.sas;
                    b.Description = b.Description.replace(/<.*?>/g,'');
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
    azStore:azStore
};