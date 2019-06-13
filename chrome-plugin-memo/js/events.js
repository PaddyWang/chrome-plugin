(function(){
    var tab = document.querySelector('section header');
    tab.addEventListener('click', function(event){
        var clickDom = event.target;
        var targetId = clickDom.getAttribute('for');
        var targetDom = document.getElementById(targetId);
        // var childrenDom = targetDom.parentNode.children;
        // var itemClassName;

        // for(var i = 0, childrenLen = childrenDom.length; i < childrenLen; i++){
        //     itemClassName = childrenDom[i].className;
        //     childrenDom[i].className = itemClassName.replace('active', ' ');
        // }

        // targetDom.className = targetDom.className.trim() + ' active';
        tabActive(clickDom);
        tabActive(targetDom);
    });

    function tabActive(currentDom){
        var siblings = currentDom.parentNode.children;
        var itemClassName;
        for(var i = 0, len = siblings.length; i < len; i++){
            itemClassName = siblings[i].className;
            siblings[i].className = itemClassName.replace('active', ' ');
        }

        currentDom.className = currentDom.className.trim() + ' active';
    }
}());
