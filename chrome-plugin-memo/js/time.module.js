(function(){
    let $dateNode = $('#time > span:first-child');
    let $timeNode = $('#time > span:nth-child(2)');
    let $secondsNode = $('#time > i:last-child');
    let timeLine = {
        ctx: $('#time-line > canvas').getContext('2d'),
        initTimeLine: function(){
            this.ctx.fillStyle = '#7ec8ee';
            this.ctx.fillRect(10, 24, 750, 2);

            for(let i = 0; i < 25; i++){
                this.ctx.fillStyle = '#7ec8ee';
                if(i % 2){
                    // fillRect(x, y, w, h)
                    this.ctx.fillRect(10 + (i * 30), 14, 2, 10);
                }else {
                    this.ctx.fillRect(10 + (i * 30), 8, 2, 16);
                }

                this.ctx.fillStyle = '#555';
                this.ctx.font = '12px';
                // fillText(text, x, y)
                this.ctx.fillText(i, 10 + (i * 30) - 3, 40);
            }
        },
        redraw: function(date){
            this.ctx.clearRect(10, 0, 750, 50);
            this.initTimeLine();
            this.renderTimePoint('2016-12-21 14:00');
            this.pastTime(date);
            this.renderTimePoint(date, '#00ff15');
        },
        renderTimePoint: function(date, color){
            let stepTime = this.timeToLength(date);
            this.ctx.beginPath();
            this.ctx.lineWidth = 5;
            this.ctx.strokeStyle = color || 'red';
            // arc()
            this.ctx.arc(10 + stepTime / (24 * 60) * 722, 24, 3, 0, 2 * Math.PI);
            this.ctx.stroke();
            this.ctx.closePath();
        },
        timeToLength: function(date){
            let zeroTime = + new Date(date.substr(0, 10) + ' 00:00:00');
            let stepTime = + new Date(date + ':00') - zeroTime;
            return stepTime / 1000 / 60;
        },
        pastTime: function(date){
            let stepTime = this.timeToLength(date);
            this.ctx.beginPath();
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            this.ctx.fillRect(5, 0, 10 + stepTime / (24 * 60) * 722, 50);
            this.ctx.closePath();
        }
    };

    timeLine.initTimeLine();
    timeLine.renderTimePoint('2016-12-21 14:00');

    setInterval(function(){
        let currentDate = new Date();
        let time = currentDate.getTime();
        let year = currentDate.getFullYear();
        let month = currentDate.getMonth() + 1;
        let day = currentDate.getDate();
        let h = currentDate.getHours();
        let m = currentDate.getMinutes();
        let s = currentDate.getSeconds();
        h = h > 9 ? h : '0' + h;
        m = m > 9 ? m : '0' + m;
        s = s > 9 ? s : '0' + s;

        $dateNode.text(year + ' -' + month + ' -' + day);
        $timeNode.text(h + ':' + m);
        $secondsNode.text(s);
        timeLine.redraw(year + '-' + month + '-' + day + ' ' + h + ':' + s)
    }, 1000);



}());
