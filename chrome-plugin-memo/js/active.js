(function(){
    var buttons = document.getElementsByTagName('button');
    var clicks = document.querySelectorAll('[click]');
    var modals = document.querySelectorAll('div[id$="-modal"]');
    var showGLinkBtn = document.getElementById('show-g-link');
    var clearGLink = document.getElementById('g-link-contant');

    [...buttons].forEach(function(val){
        val.addEventListener('click', function(e){
            e.preventDefault();
            // e.stopPropagation();
        });
    });

    [...clicks].forEach(function(val){
        val.addEventListener('click', function(){
            document.getElementById(val.getAttribute('click')).style.display = 'block';
        });
    });

    [...modals].forEach(function(val){
        val.addEventListener('click', function(e){
            var target = e.target;
            var className = target.getAttribute('class');
            if(className === 'close' || className === 'cancel'){
                val.style.display = 'none';
            }
        });
    });

    showGLinkBtn.addEventListener('click', function(){
        if(clearGLink.style.display === 'block'){
            clearGLink.style.display = 'none';
        }else {
            clearGLink.style.display = 'block';
        }
    });

}());
