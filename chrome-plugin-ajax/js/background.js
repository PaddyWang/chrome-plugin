var p = {
    // data处理函数  将数据处理为 以key1=value1&key2=value2...格式输出
    joint:function(data){
        var d = '';
        // 遍历data数据
        for(var key in data){
            // 拼接为key1=value1&key2=value2...
            d += key + '=' + data[key] + '&';
        }
        // 去除最后一个&
        d = d.slice(0, -1);
        // 返回d
        return d;
    },
    // ajax
    ajax:function(obj){
        // 无数据时默认为get
        var type = obj.type || 'get';
        // 无数据时默认为当前地址
        var url = obj.url || location.pathname;
        // 处理后的数据
        var data = this.joint(obj.data);
        // 实例化
        var xhr = new XMLHttpRequest();
        // 判断为get提交时 改变url结构
        if(type == 'get'){
            // url = url + '?' + data;
            data = null;
        }
        // 发起请求  请求行信息
        xhr.open(type,url);
        // 判断为post提交时
        if(type == 'post'){
            // 为get请求时可以不写
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.setRequestHeader('Content-Type', 'application/json');
        }
        var base64Str = window.btoa('deptjishu' + ':' + 'deptjishu');
        // xhr.setRequestHeader('Authorization', 'Basic ' + base64Str);
        // 发送数据
        xhr.send(data);
        // 监听响应状态并处理
        xhr.onreadystatechange = function(){
            // 处理成功
            // xhr.readyState = 4时  响应完成
            // xhr.status = 200  成功接收请求
            if(xhr.readyState == 4 && xhr.status ==200){
                // 获取响应的数据
                var data = xhr.responseText;
                // 获取响应头文件中的Content-Type信息
                var ct = xhr.getResponseHeader('Content-Type');
                // 转小写
                ct = ct.toLowerCase();
                // 判断为响应的为json格式的数据
                if(ct.indexOf('json') != -1){
                    // 将json格式的数据解析为JS类型的json数据
                    data = JSON.parse(data);
                    // 判断为响应的为XML格式数据
                }else if(ct.indexOf('xml') != -1){
                    // 获取XML数据
                    data = xhr.responseXML;
                }
                // 回调函数返回响应的数据
                obj.callback(data);
            }
        }
    }
};

var chromeMessage = new Event('chromeMessage');
// chromeMessage.initEvent('chromeMessage', true, true);
// 修改installNode的innerText把需要发送的消息内容放在里面
// 发出事件

document.addEventListener('pageMessage', function() {
    var requery = JSON.parse(sessionStorage.getItem('requery'));
    console.log('>>> pageMessage', requery);
    p.ajax({
        type: requery.type,
        url: requery.url,
        callback: function(data){
            sessionStorage.setItem('response', JSON.stringify({
                url: requery.url,
                response: data
            }));
            document.dispatchEvent(chromeMessage);
        }
    });
});
