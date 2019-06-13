function linkModule(db){
    let tLinks = new Store('T_links', db);
    let gLinks = new Store('G_links', db);
    let keyId = undefined;
    let targetNode = undefined;

    /* ================== T_links list start ================== */
    let isUpdateLink = false;
    let linkContent = $('#link');
    let linkModal = $('#link-modal');
    let linkModalChildren = linkModal.children[0].children;

    let linkMethods = {
        getLoopAll: function(store, linkContent, noneLinkId){
            let that = this;
            store.getLoopAll(function(data){
                that.addANode(linkContent, data, noneLinkId);
            });
        },
        removeEvent: function(store, linkContent, gStore){
            let that = this;
            linkContent.addEventListener('click', function(event){
                // event.preventDefault();
                let a = event.target.parentNode;
                let key = a.getAttribute('key');
                if(event.target.nodeName === 'I' && key){
                    event.preventDefault();
                    let data = that.getANodeData(a);

                    that.delete(store, linkContent, key, a, data, gStore);
                }
            });
        },
        delete: function(store, linkContent, key, a, data, gStore){
            let noneLinkHtml = gStore ? '<a id="none-link">暂时没有数据哦～</a>' :
                    '<a id="none-g-link">回收站已空～</a>';

            store.delete(parseInt(key)).then(function(){
                linkContent.removeChild(a);
                store.getAll().then(function(returnData){
                    if(returnData.success && returnData.data.length === 0){
                        linkContent.innerHTML = noneLinkHtml;
                    }
                });
                gStore && gStore.add(data);
            });
        },
        clearAll: function(store, linkContent, gStore){
            let that = this;
            let linkNodes = linkContent.children;

            [...linkNodes].forEach(function(node){
                let key = node.getAttribute('key');
                let data = that.getANodeData(node);
                that.delete(store, linkContent, key, node, data, gStore);
            });
        },
        addANode: function(linkContent, data, noneLinkId){
            let none = $('#' + noneLinkId);
            if(none){
                linkContent.removeChild(none);
            }

            let a = document.createElement('a');
            let i = document.createElement('i');

            i.innerHTML = '×';
            a.href = data.url;
            a.style.color = data.color;
            a.setAttribute('color', data.color);
            a.setAttribute('key', data.key);
            a.innerHTML = data.title;

            a.appendChild(i);
            linkContent.appendChild(a);
        },
        getANodeData: function(aNode){
            return {
                title: aNode.innerText.replace('×', ''),
                url: aNode.getAttribute('href'),
                color: aNode.getAttribute('color')
            };
        }
    };

    linkMethods.getLoopAll(tLinks, linkContent, 'none-link');
    linkMethods.removeEvent(tLinks, linkContent, gLinks);

    $('#link-modal-form').form({
        fields: {
            title: [{
                regex: /\S/,
                text: '不能为空'
            }],
            url: [{
                regex: /\S/,
                text: '不能为空'
            }]
        },
        success: function(elements){
            let that = this;
            let data = {
                title: undefined,
                url: undefined,
                color: undefined
            };

            Object.keys(data).forEach(function(key){
                this[key] = elements[key].value;
            }, data);

            if(isUpdateLink){
                tLinks.put(parseInt(keyId), data).then(function(returnData){
                    if(returnData.success){
                        that.clearForm();
                        linkModal.style.display = 'none';
                        targetNode.href = data.url;
                        targetNode.setAttribute('color', data.color);
                        targetNode.style.color = data.color;
                        targetNode.innerHTML = data.title + '<i>×</i>';
                    }
                });
            }else {
                tLinks.add(data).then(function(returnData){
                    let none = $('#none-link');
                    if(returnData.success){
                        if(none){
                            linkContent.removeChild(none);
                        }

                        let a = document.createElement('a');
                        let i = document.createElement('i');
                        i.innerHTML = '×'
                        a.href = data.url;
                        a.style.color = data.color;
                        a.innerHTML = data.title;
                        a.setAttribute('key', returnData.data.key);
                        a.appendChild(i);
                        linkContent.appendChild(a);
                    }else {
                        //
                    }
                });
            }
        }
    });

    // 点击添加
    $('#add-link-btn').addEventListener('click', function(event){
        event.preventDefault();
        linkModalChildren[0].innerHTML = '添加链接';
        linkModalChildren[2][4].innerHTML = '添加';
        isUpdateLink = false;
    });

    $('#link-menu').addEventListener('click', function(event){
        event.preventDefault();
        let menuTarget = window.menuTarget;
        let type = event.target.getAttribute('type');
        let data = linkMethods.getANodeData(menuTarget);
        keyId = menuTarget.getAttribute('key');
        switch(type){
            case 'update':
                linkModalChildren[0].innerHTML = '修改链接';
                linkModalChildren[2][4].innerHTML = '修改';

                Object.keys(data).forEach(function(key){
                    $('#' + key).value = data[key];
                });

                linkModal.style.display = 'block';
                isUpdateLink = true;
                targetNode = menuTarget;
                break;
            case 'delete':
                linkMethods.delete(tLinks, linkContent, keyId, menuTarget, data, gLinks);
                break;
            case 'copy':
                break;
            case 'open-new-tab':
                window.open(data.url);
                break;
            default:
                break;
        }
    });

    /* ================== T_links list end ================== */
    /* ================== G_links start  ====================== */

    let gLinkContent = $('#g-link');

    $('#show-g-link').addEventListener('click', function(){
        gLinkContent.removeChildAll();
        gLinkContent.innerHTML = '<a id="none-g-link">回收站已空～</a>';
        linkMethods.getLoopAll(gLinks, gLinkContent, 'none-g-link');
    });

    linkMethods.removeEvent(gLinks, gLinkContent);

    function clearGLink(){
        let none = $('#none-g-link');
        none || linkMethods.clearAll(gLinks, gLinkContent);
    }

    $('#clear-g-link').addEventListener('click', clearGLink);

    $('#g-link-menu').addEventListener('click', function(event){
        event.preventDefault();
        let menuTarget = window.menuTarget;
        let type = event.target.getAttribute('type');
        let data = linkMethods.getANodeData(menuTarget);
        keyId = menuTarget.getAttribute('key');
        switch(type){
            case 'restore':
                linkMethods.delete(gLinks, gLinkContent, keyId, menuTarget);

                tLinks.add(data).then(function(returnData){
                    if(returnData.success){
                        linkMethods.addANode(linkContent, returnData.data, 'none-link');
                    }
                });
                break;
            case 'delete':
                linkMethods.delete(gLinks, gLinkContent, keyId, menuTarget);
                break;
            case 'copy':
                break;
            case 'clear':
                clearGLink();
                break;
            case 'open-new-tab':
                window.open(data.url);
                break;
            default:
                break;
        }
    });

    /* ================== G_links end  ====================== */
}
