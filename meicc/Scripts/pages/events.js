let events = {
    show: false,
    title: "竞赛日程",
    events:[],
    init: function () {
        let self = this;
        self.getEvents();
    },
    cleanup: function () {
        let self = this;
        self.events.splice(0, self.events.length);
    },
    getEvents: function () {
        let self = this;
        $.ajax({
            url: "/tables/Events",
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
    }
};