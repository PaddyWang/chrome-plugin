(function(){
    document.addEventListener('contextmenu', function(event){
        event.preventDefault();
        let target = event.target;
        let parentNodeId = target.parentNode.id;
        window.menuTarget = target;
        // console.log(event);
        // 备忘链接
        if(parentNodeId === 'link' && target.getAttribute('key')){
            showMune('link-menu', event);
        }
        // 链接回收站
        if(parentNodeId === 'g-link' && target.getAttribute('key')){
            showMune('g-link-menu', event);
        }

    });

    document.addEventListener('click', function(){
        hideMune('link-menu');
        hideMune('g-link-menu');
    });

    function showMune(menuId, event){
        let body = document.body;
        let bodyW = body.offsetWidth;
        let bodyH = body.offsetHeight;
        let menu = $('#' + menuId);
        let menuW = menu.offsetWidth;
        let menuH = menu.offsetHeight;
        let x = event.x;
        let y = event.y;

        menu.style.left = x + 'px';
        menu.style.top = y + 'px';

        if(menuW + x > bodyW){
            menu.style.left = x - menuW + 'px';
        }
        if(menuH + y > bodyH){
            menu.style.top = y - menuH + 'px';
        }

        menu.style.visibility = 'visible';
    }

    function hideMune(menuId){
        $('#' + menuId).style.visibility = 'hidden';
    }
}());
