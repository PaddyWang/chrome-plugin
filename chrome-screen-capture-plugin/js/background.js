;(function(){
    var screenCaptureObj = {
        data: null,
        currentTabURL: '',
        saveScreenCapture : function(){
            var config = window.config;
            var settings = JSON.parse(localStorage.getItem('settings')) || config;
            var that = this;
            var image = new Image();
            image.src = that.data;
            image.onload = function(){
                var canvas = document.createElement('canvas');
                var aNode = document.createElement('a');
                var ctx = canvas.getContext("2d");
                var watermarkText = that.currentTabURL;
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.drawImage(image, 0, 0);
                if(settings.watermark){
                    if(typeof settings.watermark === 'string'){
                        watermarkText = settings.watermark;
                    }
                    ctx.fillStyle = '#aeaeae';
                    ctx.textAlign = 'right';
                    ctx.fillText(watermarkText, image.width - 20, image.height - 6);
                }
                aNode.download = (settings.screenCaptureFillName || config.screenCaptureFillName) + '.png';
                aNode.href = canvas.toDataURL();
                aNode.click();
                that.data = null;
                that.url = '';
            };
        },
        onScreenCapture: function(){
            var that = this;
            chrome.browserAction.onClicked.addListener(function(tab){
                that.captureVisibleTab();
            });
        },
        captureVisibleTab: function(){
            chrome.tabs.captureVisibleTab(null, {
                format : 'png',
                quality : 100
            }, function(data){
                chrome.tabs.query({active: true}, function(tabs){
                    console.log(tabs);
                    chrome.tabs.sendMessage(tabs[0].id, {
                        data: data
                    });
                });

            });
        },
        init: function(){
            this.onScreenCapture();
            return this;
        }
    }.init();

    chrome.runtime.onInstalled.addListener(function(){
        chrome.contextMenus.create({
            'id': 'screen-capture',
            'type': 'normal',
            'title': '截图'
        });
        chrome.contextMenus.onClicked.addListener(function(info){
            console.log(info);
            switch(info.menuItemId){
                case 'screen-capture':
                    screenCaptureObj.captureVisibleTab();
                    break;
                default:
                    break;
            }
        });
    });
}());
