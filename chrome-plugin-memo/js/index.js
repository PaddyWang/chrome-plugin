/*
      =
     ===
   =======
  =========
  =========
 ===========
=============
    =====
     ===
 */

 console.log('%c%s', 'color: #7ec8ee', '      =\n     ===\n   =======\n  =========\n  =========\n ===========\n=============\n    =====\n     ===');
 console.log('%c%s', 'font-size: 24px;color: #7ec8ee;', ' >>>------> ');
 console.log('%c%s', 'color: blue;', 'http://www.baidu.com');

    // 是否开启了消息提示 default denied granted
    if(Notification.permission !== 'granted'){
        Notification.requestPermission();
    }



    var notes;
    document.getElementById('notesBtn').onclick = function(){
        notes = new Notification('新消息', {
            body: '哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈',
            icon: '../imgs/icon_64X64_red.png',
            data: ['sdfs', 'dsafds'],
            vibrate: [200, 100, 200],
            renotify: true,
            tag: '123'
        });

        notes.onclick = function(e){
            console.log(e);
            window.focus();
            notes.close();
        };
    };


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
            linkModule(db);
            memoModule(db);
        };

        notesDB.onerror = function(e){
            console.error(e);
        };
    }());
