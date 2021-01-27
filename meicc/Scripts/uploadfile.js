var UPLOADFILE = {};
UPLOADFILE.uploaderArray = new Array();
UPLOADFILE.instance = function(fileToken){
    for(var i = 0; i < this.uploaderArray.length; i++){
        if(this.uploaderArray[i].fileToken == fileToken){
            return this.uploaderArray[i];
        }
        return null;
    }
};
var UPLOADFACTORY = {
    create: function () {
        var uploader = {};
        uploader.containerid = "";
        uploader.fileName = "";
        uploader.fileToken = getRandString(16);
        uploader.formData = new FormData();
        uploader.uploadURL = "";
        uploader.onUploadProgressCallbackFunction = null;
        uploader.onUploadCompleteCallbackFunction = null;
        uploader.onUploadComplete = function (evt) {
            var obj = $.parseJSON(evt.target.responseText);
            console.log(obj);
            if (uploader.onUploadCompleteCallbackFunction != null) {
                uploader.onUploadCompleteCallbackFunction(obj);
            }

        };
        uploader.deleteFile = null;
        uploader.onUploadFailed = null;
        uploader.onUploadCanceled = null;
        uploader.onUploadProgress = function (evt) {
            if (evt.lengthComputable) {
                var loaded = evt.loaded;
                var total = evt.total;
                var percent = Math.round(loaded * 100 / total);
                console.log(percent);
                if (uploader.onUploadProgressCallbackFunction != null) {
                    uploader.onUploadProgressCallbackFunction(uploader.fileToken, percent);
                }
            }
        };
        uploader.uploadFile = function () {
            var xhr = new XMLHttpRequest();
            xhr.addEventListener("progress", this.onUploadProgress, false);
            xhr.addEventListener("load", this.onUploadComplete, false);
            xhr.addEventListener("error", this.onUploadFailed, false);
            xhr.addEventListener("abort", this.onUploadCanceled, false);
            xhr.open("POST", this.uploadURL);
            xhr.send(this.formData);
        };

        UPLOADFILE.uploaderArray.push(uploader);
        return uploader;
    }
};

function getRandString(count){
    var randStr = "";
    var arr = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
    for(var i = 0; i<count; i++){
        var r = Math.floor(Math.random() * 36);
        randStr = randStr + arr[r];
    }
    return randStr;
}
