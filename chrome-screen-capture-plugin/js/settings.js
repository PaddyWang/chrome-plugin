;(function(){
    var data =  {
        init: function(){
            var that = this;
            var settings = JSON.parse(localStorage.getItem('settings'));
            if(settings){
                Object.keys(settings).forEach(function(key){
                    that[key] = settings[key];
                });
            }else {
                this['screenCaptureFillName'] =  undefined;
                this['watermark'] = true;
            }
            return this;
        }
    }.init();

    var screenCaptureFillName = document.getElementById('screen-capture-fill-name');
    var watermark = document.getElementById('watermark');
    var watermarkCustomTextNode = document.getElementById('watermark-custom-text');
    var watermarkCustomNode = document.getElementById('watermark-custom');
    var watermarkCurrentNode = document.getElementById('watermark-current');

    screenCaptureFillName.placeholder = '默认值: ' + config.screenCaptureFillName;

    function handleSetValue(){
        screenCaptureFillName.value = data.screenCaptureFillName || '';
        if(data.watermark){
            watermark.click();
            if(data.watermark === true){
                watermarkCurrentNode.click();
            }else {
                watermarkCustomNode.click();
                watermarkCustomTextNode.value = data.watermark;
            }
        }
    }

    function handleGetValue(){
        var params = {};
        if(screenCaptureFillName.value){
            params.screenCaptureFillName = screenCaptureFillName.value;
        }
        if(watermark.checked){
            if(watermarkCurrentNode.checked){
                params.watermark = true;
            }else {
                params.watermark = watermarkCustomTextNode.value;
            }
        }else {
            params.watermark = false;
        }

        localStorage.setItem('settings', JSON.stringify(params));
    }

    document.getElementById('watermark').addEventListener('click', function(event){
        var watermarkBoxNode = document.getElementById('watermark-box');
        if(event.target.checked){
            watermarkBoxNode.className = 'active';
            watermarkCurrentNode.click();
            watermarkCustomTextNode.value = '';
        }else {
            watermarkBoxNode.className = '';
        }
    });

    watermarkCustomTextNode.addEventListener('focus', function(){
        watermarkCustomNode.click();
    });
    watermarkCustomNode.addEventListener('click', function(){
        watermarkCustomTextNode.focus();
    });
    document.getElementById('close-btn').addEventListener('click', function(){
        window.close();
    });
    document.getElementById('save-btn').addEventListener('click', function(){
        console.log('>>>');
        handleGetValue();
    });

    handleSetValue();
}());
