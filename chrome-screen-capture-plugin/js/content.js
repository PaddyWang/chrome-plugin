(function(){
    console.log('>>>');
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
        new ScreenCapture(request.data);
    });

    function ScreenCapture(data){
        var canvasObj = this.canvasObj = {
            w: window.innerWidth,
            h: window.innerHeight
        };
        var windowW = window.innerWidth;
        var windowH = window.innerHeight;
        var screenCaptureBox = this.screenCaptureBox = document.createElement('div');
        var backgroundCanvasNode = this.backgroundCanvasNode = document.createElement('canvas');
        var drewCanvasNode = this.drewCanvasNode = document.createElement('canvas');
        var glassCanvasNode = this.glassCanvasNode = document.createElement('canvas');
        var backgroundCtx = backgroundCanvasNode.getContext('2d');
        var toolsBox = this.toolsBox = document.createElement('div');
        toolsBox.style.display = 'none';
        toolsBox.style.position = 'absolute';
        toolsBox.style.fontSize = '12px';
        toolsBox.style.padding = '8px 12px';
        toolsBox.style.backgroundColor = '#fff';
        toolsBox.style.borderRadius = '6px';
        toolsBox.innerHTML = '<span type="cancel" style="padding: 0 8px;cursor: pointer;">取消</span><span type="download" style="padding: 0 8px;cursor: pointer;">下载</span>';

        screenCaptureBox.style.position = 'fixed';
        screenCaptureBox.style.zIndex = '99999999';
        screenCaptureBox.style.top = 0;
        screenCaptureBox.style.left = 0;
        screenCaptureBox.style.width = windowW + 'px';
        screenCaptureBox.style.height = windowH + 'px';
        backgroundCanvasNode.style.position = 'absolute';
        backgroundCanvasNode.style.top = 0;
        backgroundCanvasNode.style.left = 0;
        backgroundCanvasNode.width = windowW;
        backgroundCanvasNode.height = windowH;
        drewCanvasNode.style.position = 'absolute';
        drewCanvasNode.style.top = 0;
        drewCanvasNode.style.left = 0;
        drewCanvasNode.width = windowW;
        drewCanvasNode.height = windowH;
        glassCanvasNode.style.position = 'absolute';
        glassCanvasNode.style.display = 'none';
        glassCanvasNode.width = 100;
        glassCanvasNode.height = 130;
        screenCaptureBox.appendChild(backgroundCanvasNode);
        screenCaptureBox.appendChild(drewCanvasNode);
        screenCaptureBox.appendChild(glassCanvasNode);
        document.body.appendChild(screenCaptureBox);
        screenCaptureBox.appendChild(toolsBox);

        var drewObj = this.drewObj = {
            ctx: drewCanvasNode.getContext('2d'),
            x: 0,
            y: 0,
            w: 0,
            h: 0,
            dragOffsetX: 0,
            dragOffsetY: 0,
            status: 0,  // 0: 空闲  1: 准备拖拽剪切  2: 拖动  3: 绘画之后空闲
            drew: function(){
                this.clear();
                this.init();
                this.ctx.clearRect(this.x, this.y, this.w, this.h);
            },
            clear: function(){
                this.ctx.clearRect(0, 0, canvasObj.w, canvasObj.h);
            },
            init: function(){
                this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
                this.ctx.fillRect(0, 0, canvasObj.w, canvasObj.h);
            }
        };

        this.glassObj = {
            ctx: glassCanvasNode.getContext('2d'),
            maxW: canvasObj.w,
            maxH: canvasObj.h,
            w: glassCanvasNode.width,
            h: glassCanvasNode.height,
            drewLine: function(x, y){
                this.ctx.strokeStyle = '#000';
                this.ctx.lineWidth = 0.4;
                this.ctx.beginPath();
                this.ctx.moveTo(0, this.w / 2);
                this.ctx.lineTo(this.w, this.w / 2);
                this.ctx.stroke();
                this.ctx.closePath();
                this.ctx.beginPath();
                this.ctx.moveTo(this.w / 2, 0);
                this.ctx.lineTo(this.w / 2, this.w);
                this.ctx.stroke();
                this.ctx.closePath();
                this.ctx.lineWidth = 1;
                this.ctx.strokeStyle = '#fff';
                this.ctx.strokeRect(0, 0, this.w, this.h);
                this.ctx.beginPath();
                this.ctx.moveTo(0, this.w);
                this.ctx.lineTo(this.w, this.w);
                this.ctx.stroke();
                this.ctx.closePath();
                this.ctx.fillStyle = '#fff';
                this.ctx.fillText('坐标(' + x + ',' + y + ')', 8, this.h - 12);
            },
            init: function(){
                this.ctx.clearRect(0, 0, this.w, this.h);
                this.ctx.fillStyle = '#fff';
                this.ctx.fillRect(0, 0, this.w, this.w);
                this.ctx.fillStyle = 'grey';
                this.ctx.fillRect(0, this.w, this.w, this.h - this.w);
                glassCanvasNode.style.display = 'block';
            },
            drew: function(x, y){
                var glassTop = y + 30;
                var glassLeft = x - this.w - 10;

                if(x <= this.w + 20){
                    glassLeft = x + 20;
                }
                if(this.maxH - y <= this.h + 40){
                    glassTop = y - this.h - 10;
                    if(this.maxW - x > this.w + 30){
                        glassLeft = x + 20;
                    }
                }

                glassCanvasNode.style.top = glassTop + 'px';
                glassCanvasNode.style.left = glassLeft + 'px';
                this.init();
                this.ctx.drawImage(backgroundCanvasNode, x - 10, y - 10, 20, 20, 0, 0, this.w, this.w);
                this.drewLine(x - 10, y - 10);
            },
            clear: function(){
                this.ctx.clearRect(0, 0, this.w, this.h);
                glassCanvasNode.style.display = 'none';
            }
        };

        this.toolsObj = {
            show: function(x, y){
                var top = 0;
                var left = 0;
                if(drewObj.w && drewObj.h){
                    toolsBox.style.display = 'block';
                    top = drewObj.y + drewObj.h + 8;
                    left = drewObj.x + drewObj.w - toolsBox.offsetWidth;
                    if(top + toolsBox.offsetHeight >= canvasObj.h){
                        top -= toolsBox.offsetHeight + 16;
                        left -= 8;
                    }
                    toolsBox.style.top = top + 'px';
                    toolsBox.style.left = left + 'px';
                }
            },
            hide: function(){
                toolsBox.style.display = 'none';
            }
        };

        var image = new Image();
        var that = this;
        image.src = data;
        image.onload = function(){
            backgroundCtx.drawImage(image, 0, 0);
            ScreenCapture.init(that);
        };
    }
    ScreenCapture.init = function(that){
        var canvasObj = that.canvasObj;
        var drewObj = that.drewObj;
        var glassObj = that.glassObj;
        var toolsObj = that.toolsObj;
        var events = that.events = [];

        that.drewCanvasNode.addEventListener('mousedown', onDrewCanvasMousedwon);
        events.push({
            nodeName: 'drewCanvasNode',
            type: 'mousedown',
            handle: onDrewCanvasMousedwon
        });
        function onDrewCanvasMousedwon(event){
            var x = event.offsetX;
            var y = event.offsetY;
            drewObj.ctx.beginPath();
            drewObj.ctx.rect(drewObj.x, drewObj.y, drewObj.w, drewObj.h);
            if(drewObj.ctx.isPointInPath(x, y)){
                drewObj.status = 2;
                drewObj.dragOffsetX = x - drewObj.x;
                drewObj.dragOffsetY = y - drewObj.y;
            }else {
                drewObj.w = 0;
                drewObj.h = 0;
                drewObj.clear();
                drewObj.init();
                drewObj.x = x;
                drewObj.y = y;
                drewObj.status = 1;

                toolsObj.hide();
            }
        }

        that.drewCanvasNode.addEventListener('mousemove', onDrewCanvasMousemove);
        events.push({
            nodeName: 'drewCanvasNode',
            type: 'mousemove',
            handle: onDrewCanvasMousemove
        });
        function onDrewCanvasMousemove(event){
            var x = event.offsetX;
            var y = event.offsetY;
            var oX, oY;
            switch(drewObj.status){
                case 0:
                    glassObj.drew(x, y);
                    break;
                case 1:
                    drewObj.w = x - drewObj.x;
                    drewObj.h = y - drewObj.y;
                    drewObj.drew();
                    glassObj.drew(x, y);
                    break;
                case 2:
                    oX = x - drewObj.dragOffsetX;
                    oY = y - drewObj.dragOffsetY;
                    if(oX <= 0){
                        drewObj.x = 0;
                    }else if(oX + drewObj.w >= canvasObj.w){
                        drewObj.x = canvasObj.w - drewObj.w;
                    }else {
                        drewObj.x = oX;
                    }
                    if(oY <= 0){
                        drewObj.y = 0;
                    }else if(oY + drewObj.h >= canvasObj.h){
                        drewObj.y = canvasObj.h - drewObj.h;
                    }else {
                        drewObj.y = oY;
                    }
                    drewObj.drew();
                    toolsObj.show();
                    break;
                default:
                    break;
            }
        }

        that.drewCanvasNode.addEventListener('mouseup', onDrewCanvasMouseup);
        events.push({
            nodeName: 'drewCanvasNode',
            type: 'mouseup',
            handle: onDrewCanvasMouseup
        });
        function onDrewCanvasMouseup(event){
            if([1, 2].indexOf(drewObj.status) >= 0){
                drewObj.status = 3;
                drewObj.dragOffsetX = 0;
                drewObj.dragOffsetY = 0;
                glassObj.clear();

                toolsObj.show();
            }
        }

        that.drewCanvasNode.addEventListener('dblclick', onDrewCanvasDblclick);
        events.push({
            nodeName: 'drewCanvasNode',
            type: 'dblclick',
            handle: onDrewCanvasDblclick
        });
        function onDrewCanvasDblclick(event){
            drewObj.status = 0;
            drewObj.dragOffsetX = 0;
            drewObj.dragOffsetY = 0;
            drewObj.x = 0;
            drewObj.y = 0;
            drewObj.h = 0;
            drewObj.w = 0;
            drewObj.clear();

            toolsObj.hide();
        }

        that.toolsBox.addEventListener('click', onToolsBoxClick);
        events.push({
            nodeName: 'toolsBox',
            type: 'click',
            handle: onToolsBoxClick
        });
        function onToolsBoxClick(event){
            var target = event.target;
            switch(target.getAttribute('type')){
                case 'cancel':
                    that.destroy();
                    break;
                case 'download':
                    that.download();
                    break;
                default:
                    break;
            };
        }
    };

    ScreenCapture.prototype.destroy = function(){
        this.events.forEach(function(item){
            this[item.nodeName].removeEventListener(item.type, item.fn);
        }, this);
        document.body.removeChild(this.screenCaptureBox);
    };

    ScreenCapture.prototype.download = function(){
        var drewObj = this.drewObj;
        var aNode = document.createElement('a');
        var canvasNode = document.createElement('canvas');
        var ctx = canvasNode.getContext('2d');
        canvasNode.width = drewObj.w;
        canvasNode.height = drewObj.h;
        ctx.drawImage(this.backgroundCanvasNode, drewObj.x, drewObj.y, drewObj.w, drewObj.h, 0, 0, drewObj.w, drewObj.h);
        aNode.download = 'screen-capture.png';
        aNode.href = canvasNode.toDataURL();
        aNode.click();

        this.destroy();
    };
}());
