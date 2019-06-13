(function(window, undefined){
    function $(selector){
        return document.querySelector(selector);
    }

    /**
     * $('form').form({
     *     fields: {
     *        title: {
     *              rules: [{
     *                  regex: //,
     *                  text: ''
     *              }]
     *          }
     *     },
           success: function(){}
     * });
     */

    function form(parameter){
        let elements = this.elements;
        let changeEvent = {};
        let closeBtn = this.previousElementSibling;

        this.previousElementSibling.addEventListener('click', clearForm);

        function clearForm(){
            let ignoreType = ['color'];
            let clearNodeName = ['INPUT', 'TEXTAREA'];

            [...elements].forEach(function(val){
                if(clearNodeName.indexOf(val.nodeName) !== -1 && ignoreType.indexOf(val.type) === -1){
                    val.value = '';
                }

                if(val.type === 'color'){
                    val.value = '#555555';
                }
            });
        }

        parameter.clearForm = clearForm;

        // if(typeof parameter.cancel === 'function'){
        //     parameter.cancel();
        //     clearForm();
        // }

        [...elements].forEach(function(dom){
            if(dom.nodeName === 'BUTTON'){
                if(dom.className.indexOf('ok') !== -1){
                    dom.addEventListener('click', function(){
                        let isValidation = true;

                        // 遍历表单验证字段
                        Object.keys(parameter.fields).forEach(function(key){
                            let value = elements[key].value;
                            let rules = parameter.fields[key];

                            // 遍历每个字段段验证规则
                            rules.forEach(function(ruleVal){
                                if(!ruleVal.regex.test(value)){
                                    isValidation = false;
                                    elements[key].addClassName('error');

                                    // 给每个验证不通过的字段添加 change 监听
                                    changeEvent[key] = function(){
                                        if(ruleVal.regex.test(elements[key].value)){
                                            elements[key].removeClassName('error');
                                            elements[key].removeEventListener('change', changeEvent[key]);
                                        }
                                    };

                                    elements[key].addEventListener('change', changeEvent[key]);
                                    return false;
                                }else {
                                    elements[key].removeClassName('error');
                                }
                            });
                        });

                        if(isValidation && typeof parameter.success === 'function'){
                            parameter.success(elements);
                            clearForm();
                        }
                    });
                }else if(dom.className.indexOf('cancel') !== -1){
                    dom.addEventListener('click', clearForm);
                }
            }
        });

        Object.prototype.addClassName = function(className){
            this.className += ' ' + className;
            this.className = this.className.trim();
            return this;
        };

        Object.prototype.removeClassName = function(className){
            this.className = this.className.replace(className, ' ');
            this.className.trim();
            return this;
        };

        Object.prototype.removeChildAll = function(){
            let that = this;
            let childrens = that.children;
            [...childrens].forEach(function(node){
                that.removeChild(node);
            });
        };

        Object.prototype.text = function(text){
            this.innerText = text;
        };

        Object.prototype.html = function(html){
            this.innerHTML = html;
        };
    }

    Object.prototype.form = form;
    window.$ = $;

}(window, undefined));
