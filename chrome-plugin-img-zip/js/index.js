(function(){
    var imagesNode = document.getElementById('images');
    var uploadFile = document.getElementById('file');
    var globalQuality = 1;

    var images = [];

    document.getElementById('input-quality').onchange = function(event){
        globalQuality = event.target.value / 100;
        images.forEach(function(item){
            canvasToBlob(item.originImgNode, {}, function(blob){
                var qualityFileURL = URL.createObjectURL(blob);
                item.qualityImgNode.src = qualityFileURL;
                item.sizeNode.innerHTML = sizeText(blob.size);
                item.qualityFileBlob = blob;

                revokURL(qualityFileURL);
            });
        });
    };

    document.getElementById('download-all').onclick = function(){
        images.forEach(function(item){
            var qualityFileURL = URL.createObjectURL(item.qualityFileBlob);
            downloadFile(item.originFile.name, qualityFileURL);

            revokURL(qualityFileURL);
        });
    };

    document.getElementById('clear-all').onclick = function(){
        images = [];
        imagesNode.innerHTML = '';
    };

    uploadFile.onchange = function(){
        var files = this.files;
        var file;
        for(var i = 0, len = files.length; i < len; i++){
            render(files[i]);
        }

        uploadFile.value = null;
    };

    function render(file){
        var itemNode = document.createElement('div');
        var divNode1 = document.createElement('div');
        var divNode2 = document.createElement('div');
        var divNode3 = document.createElement('div');
        var divNode11 = document.createElement('div');
        var divNode31 = document.createElement('div');
        var pNode1 = document.createElement('p');
        var pNode2 = document.createElement('p');
        var pNode3 = document.createElement('p');
        var originImgNode = document.createElement('img');
        var qualityImgNode = document.createElement('img');
        var rangeNode = document.createElement('input');
        var fileURL = URL.createObjectURL(file);
        var imageItem = {
            originFile: file,
            originImgNode: originImgNode,
            qualityImgNode: qualityImgNode,
            sizeNode: pNode3
        };
        itemNode.className = 'item';
        rangeNode.type = 'range';
        rangeNode.step = '1';
        rangeNode.max = '100';
        rangeNode.min = '1';
        rangeNode.value = '100';
        itemNode.appendChild(divNode1);
        itemNode.appendChild(divNode2);
        itemNode.appendChild(divNode3);
        divNode1.appendChild(divNode11);
        divNode1.appendChild(pNode1);
        divNode3.appendChild(divNode31);
        divNode3.appendChild(pNode3);
        divNode11.appendChild(originImgNode);
        divNode31.appendChild(qualityImgNode);
        divNode2.appendChild(rangeNode);
        originImgNode.src = fileURL;
        pNode1.innerHTML = sizeText(file.size);

        imagesNode.appendChild(itemNode);

        originImgNode.onload = function(event){
            canvasToBlob(this, {}, function(blob){
                var qualityFileURL = URL.createObjectURL(blob);
                qualityImgNode.src = qualityFileURL;
                pNode3.innerHTML = sizeText(blob.size);
                imageItem.qualityFileBlob = blob;
                images.push(imageItem);
               revokURL(qualityFileURL);
            });

            URL.revokeObjectURL(fileURL);
        };

        rangeNode.onchange = function(event){
            canvasToBlob(originImgNode, {}, function(blob){
                var qualityFileURL = URL.createObjectURL(blob);
                qualityImgNode.src = qualityFileURL;
                pNode3.innerHTML = sizeText(blob.size);
                imageItem.qualityFileBlob = blob;
                revokURL(qualityFileURL);
            }, event.target.value / 100);
        };
    }

    function revokURL(url){
        setTimeout(function(){
            URL.revokeObjectURL(url);
        });
    }

    function sizeText(size){
        var unit = 'KB';
        size /= 1024;
        if(size > 1024){
            size /= 1024;
            unit = 'MB';
        }
        return 'Size:' + size.toFixed(2) + unit;
    }

    // 读取文件  文件转BASE64
    function fileRead(file, callback){
        var read = new FileReader();
        read.readAsDataURL(file);
        read.onload = function(){
            callback(this.result);
        }
    }

    // 图片转 Blob 压缩图片
    function canvasToBlob(image, size, callback, quality){
        var w = size.width || image.naturalWidth;
        var h = size.height || image.naturalHeight;
        var canvasNode = document.createElement('canvas');
        var ctx = canvasNode.getContext('2d');
        canvasNode.width = w;
        canvasNode.height = h;
        ctx.drawImage(image, 0, 0, w, h);
        canvasNode.toBlob(callback, 'image/jpeg', quality || globalQuality);
        // callback(canvasNode.toDataURL('image/jpeg', globalQuality));
    }

    function filetoDataURL(file,fn){
        var reader = new FileReader();
        reader.onloadend = function(e){
            fn(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    function imagetoCanvas(image){
        var cvs = document.createElement("canvas");
        var ctx = cvs.getContext('2d');
        cvs.width = image.width;
        cvs.height = image.height;
        ctx.drawImage(image, 0, 0, cvs.width, cvs.height);
        return cvs ;
    }

    function canvasResizetoDataURL(canvas,quality){
        return canvas.toDataURL('image/jpeg', quality);
    }

    function dataURLtoImage(dataurl,fn){
        var img = new Image();
        img.onload = function() {
            fn(img);
        };
        img.src = dataurl;
    }

    function photoCompress(file, w, objDiv){
        var ready = new FileReader();
        ready.readAsDataURL(file);
        ready.onload = function(){
            var re = this.result;
            canvasDataURL(re, w, objDiv)
        }
    }
    function canvasDataURL(path, obj, callback){
        var img = new Image();
        img.src = path;
        img.onload = function(){
            var that = this;
            // 默认按比例压缩
            var w = that.width,
                h = that.height,
                scale = w / h;
            w = obj.width || w;
            h = obj.height || (w / scale);
            var quality = 0.5;
            // 生成canvas
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            // 创建属性节点
            var anw = document.createAttribute("width");
            anw.nodeValue = w;
            var anh = document.createAttribute("height");
            anh.nodeValue = h;
            canvas.setAttributeNode(anw);
            canvas.setAttributeNode(anh);
            ctx.drawImage(that, 0, 0, w, h);
            // 图像质量
            if(obj.quality && obj.quality <= 1 && obj.quality > 0){
                quality = obj.quality;
            }
            // quality值越小，所绘制出的图像越模糊
            var base64 = canvas.toDataURL('image/jpeg', quality);
            // 回调函数返回base64的值
            callback(base64);
        }
    }

    function downloadFile(fileName, content){
        var a = document.createElement('a');
        a.href = content;
        a.download = fileName;
        a.click();
    }

    // TODO 已经 revok 掉了 blob 的 URL 导致图片无法显示
    // var imgPreviewModal = document.getElementById('img-preview-modal');
    // var imgPreview = document.getElementById('img-preview');
    // imagesNode.onclick = function(event){
    //     var target = event.target;
    //     if(target.nodeName === 'IMG'){
    //         imgPreviewModal.style.display = 'block';
    //         imgPreviewModal.children[0].innerHTML = '';
    //         imgPreviewModal.children[0].appendChild(target.cloneNode(true));
    //     }
    // };


    document.getElementById('openfile').onclick = function(){
        console.log('>>>chrome', chrome);
        chrome.fileSystem.chooseEntry({}, function(fileEntry){
            console.log('>>>', fileEntry);
            //do something with fileEntry
        });
    }
}());
