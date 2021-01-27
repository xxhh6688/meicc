var resizeCanvas = {
    timer: null,
    width: 0,
    height: 0,
    ratio:1.5,
    start: function () {
        var self = this;
        self.resize();
        self.timer = setTimeout(function () {
            self.start();
        }, 500);
    },
    resize: function () {
        if (self.width != window.innerWidth || self.height != window.innerHeight) {
            $("#canvas-container").css("width", "100%");
            $("canvas").css("width", "100%");
            $("#canvas-container").css("height", window.innerHeight + "px");
            $("canvas").css("height", window.innerHeight + "px");
            self.width = window.innerWidth;
            self.height = window.innerHeight;
        }
    }
}

var verify = {
    v: Object.prototype.toString,
    isNumber: function (value) {
        return this.v.call(value) == '[object Number]';
    },
    isBoolean: function (value) {
        return this.v.call(value) == '[object Boolean]';
    },
    isString: function (value) {
        return this.v.call(value) == '[object String]';
    },
    isArray: function (value) {
        return this.v.call(value) == '[object Array]';
    },
    isFunction: function (value) {
        return this.v.call(value) == '[object Function]';
    },
    isObject: function (value) {
        return this.v.call(value) == '[object Object]';
    },
    isUndefined: function (value) {
        return this.v.call(value) == '[object Undefined]';
    },
    isNull: function (value) {
        return this.v.call(value) == '[object Null]';
    },
};

function setCookie(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
        else {
            return null;
        }
    }
    return null;
}

if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

function getHashValue(key) {
    var matches = location.hash.match(new RegExp(key + '=([^&]*)'));
    return matches ? matches[1] : null;
}

function getRandString(count) {
    var randStr = "";
    var arr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    for (var i = 0; i < count; i++) {
        var r = Math.floor(Math.random() * 36);
        randStr = randStr + arr[r];
    }
    return randStr;
}

function getFormatedDate(date) {
    let d = new Date(date);
    let str = "{0}年{1}月{2}日 {3}:{4}".format(d.getFullYear(), ("0"+(d.getMonth() + 1)).substr(-2,2), ("0"+d.getDate()).substr(-2,2), ("0"+d.getHours()).substr(-2,2), ("0"+d.getMinutes()).substr(-2,2));
    return str;
}

function getFormatedDateShort(date) {
    let d = new Date(date);
    let str = "{0}年{1}月{2}日".format(d.getFullYear(), ("0" + (d.getMonth() + 1)).substr(-2, 2), ("0" + d.getDate()).substr(-2, 2), ("0" + d.getHours()).substr(-2, 2), ("0" + d.getMinutes()).substr(-2, 2));
    return str;
}

function getFormatedDateSample(date) {
    let d = new Date(date);
    let str = "{0}-{1}-{2}".format(d.getFullYear(), ("0" + (d.getMonth() + 1)).substr(-2, 2), ("0" + d.getDate()).substr(-2, 2), ("0" + d.getHours()).substr(-2, 2), ("0" + d.getMinutes()).substr(-2, 2));
    return str;
}

Vue.component('pages', {
    props: ['pages'],
    template:
        '<div class="page-items" v-if="pages.count>1">' +
        '<a v-bind:href="pages.url+\'page=\'+(pages.currentPage-1)" v-on:click="pages.clickCallback(pages.currentPage-1)" v-if="pages.currentPage>1" class="page-item"><span>上一页</span></a>' +
        '<a v-bind:href="pages.url+\'page=1\'" v-on:click="pages.clickCallback(1)" class="page-item" v-bind:class="{selected:pages.currentPage==1}"><span>1</span></a>' +
        '<a href="javascript:void(0)" v-if="pages.currentPage>5&&pages.count>9" class="page-item-dot">...</a>' +
        '<a v-bind:href="pages.url+\'page=\'+p" v-on:click="pages.clickCallback(p)" v-for="p in pages.showPages" class="page-item" v-bind:class="{selected:pages.currentPage==p}">{{p}}</a>' +
        '<a href="javascript:void(0)" v-if="pages.currentPage<=pages.count-5&&pages.count>9" class="page-item-dot">...</a>' +
        '<a v-bind:href="pages.url+\'page=\'+pages.count" v-on:click="pages.clickCallback(pages.count)" class="page-item" v-bind:class="{selected:pages.currentPage==pages.count}">{{pages.count}}</a>' +
        '<a v-bind:href="pages.url+\'page=\'+pages.next" v-on:click="pages.clickCallback(pages.next)" v-if="pages.currentPage<pages.count" class="page-item">下一页</a>' +
        '</div>'
});

