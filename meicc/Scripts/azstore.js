let azStoreFactory = {
    create: function () {
        return azStore = {
            sas: '?sv=2019-10-10&ss=bfqt&srt=sco&sp=rwacpx&se=2021-05-30T11:15:23Z&st=2020-05-30T03:15:23Z&spr=https,http&sig=oU76qKfcwOBKp%2B2C1%2B5xBDLWnmqaaOSEhHzi5NEEIc8%3D',
            container: 'image',
            blobUrl: 'https://meicc.blob.core.windows.net',
            uploadBase64: function (rawdata, callback) {
                let self = this;
                var blobService = AzureStorage.Blob.createBlobServiceWithSas(self.blobUrl, self.sas);
                var matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                var buffer = getArrayBuffer(decode64(matches[2]));
                var sum = blobService.createBlockBlobFromText(azStore.container, $.md5(rawdata), buffer, function (error, result, response) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(result);
                        var fileName = result.name;
                        callback(fileName);
                    }
                });
            },
            uploadFile: function (file) {
                let self = this;
                var blobService = AzureStorage.Blob.createBlobServiceWithSas(self.blobUrl, self.sas);
                var customBlockSize = file.size > 1024 * 1024 * 32 ? 1024 * 1024 * 4 : 1024 * 512;
                blobService.singleBlobPutThresholdInBytes = customBlockSize;

                var finishedOrError = false;
                let successCallback = self.successCallback;
                let failCallback = self.failCallback;
                let progressCallback = self.progressCallback;
                self.successCallback = null;
                self.failCallback = null;
                self.progressCallback = null;
                let name = new Date().toISOString() + getRandString(16) + file.name.substr(file.name.lastIndexOf("."), file.name.length);
                var properties = {};
                properties.cacheControl = 'max-age=2592000';

                var speedSummary = blobService.createBlockBlobFromBrowserFile(self.container, name, file, {
                    blockSize: customBlockSize
                }, function (error, result, response) {
                    finishedOrError = true;
                    if (error) {
                        if (failCallback) {
                            failCallback(error, file.name);
                        }
                    } else {
                        if (successCallback) {
                            console.log(result);
                            console.log(response);
                            blobService.setBlobProperties(self.container, name, properties, function (error, result, response) {});
                            successCallback(result, file.name, name);
                            $("#fileToUploadBlob").val('');
                        }
                    }
                });
                speedSummary.on('progress', function () {
                    let percent = speedSummary.getCompletePercent();
                    if (progressCallback) {
                        progressCallback(percent);
                    }
                });
                return speedSummary;
            },
            successCallback: null,
            failCallback: null
        };
    }
};