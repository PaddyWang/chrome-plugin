(function(){
    var notesDB = indexedDB.open('notesDB', 1);
    var db;

    notesDB.onupgradeneeded = function(e){
        db = e.target.result;
        var stores = ['T_user', 'T_links', 'T_notes', 'G_links', 'G_notes'];

        stores.forEach(function(val){
            if(!db.objectStoreNames.contains(val) && val === 'T_user'){
                db.createObjectStore('T_user',{keyPath: 'username'});
            }else if(!db.objectStoreNames.contains(val)){
                db.createObjectStore(val, {autoIncrement: true});
            }
        });
    }

    notesDB.onsuccess = function(e){
        db = e.target.result;

        let tLinks = new Store('T_links', db);
        let linkContent = document.getElementById('link');

        tLinks.getAll().then(function(returnData){
            let none = document.getElementById('none-link');
            let html = '';
            let data = returnData.data;

            if(returnData.success && data.length){
                data.forEach(function(val){
                    html += '<a href="' + val.url + '" style="color: ' + val.color + ';">' +
                            val.title + '</a>';
                });

            if(none){
                linkContent.removeChild(none);
            }

            linkContent.innerHTML = html;
            }
        });
    };
}());
