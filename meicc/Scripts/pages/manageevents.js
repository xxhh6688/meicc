let manageEvents = {
    show: false,
    title: "管理日程",
    events:[],
    init: function () {
        let self = this;
        main.common.checkAdmin();
        $("#main-nav").hide();
        $("#foot-nav").hide();
        self.getEvents();
    },
    cleanup: function () {
        $("#main-nav").show();
        $("#foot-nav").show();
    },
    getEvents: function () {
        let self = this;
        $.ajax({
            url: "/tables/Events?$expand=Match",
            method: "get",
            success: function (data) {
                self.events.splice(0, self.events.length);
                $.each(data.value, function (a, b) {
                    b.CreateTime = getFormatedDateShort(b.CreateTime);
                    b.StartTime = getFormatedDateShort(b.StartTime);
                    b.EndTime = getFormatedDateShort(b.EndTime);
                    b.Match.FullImage = azStore.blobUrl + "/" + b.Match.Image + azStore.sas;
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