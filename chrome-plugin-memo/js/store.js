function Store(storeName, db){
    this.store = storeName;
    this.db = db;
}

/**
 * [promise description]
 * @param  {[type]} method
 * @param  {[type]} data   {key: key, data: data}
 * @return {[type]}
 */
// Store.prototype.promise = function(method, data){
//     var that = this;
//     return new Promise(function(resolve, reject){
//         var methodRequest = that.transaction()[method];
//         var methodData, returnData = {};
//         if(methodRequest && typeof methodRequest === 'function'){
//             methodData = methodRequest();

//             methodData.onsuccess = function(success){
//                 var successData = success.target.result;
//                 returnData.success = success.type === 'success';

//                 if(typeof data === 'object'){
//                     data.data && (returnData.data = data.data);

//                     if(data.key){
//                         returnData.data = returnData.data || {};
//                         returnData.data.key = data.key
//                     }
//                 }

//                 if(typeof successData === 'object'){
//                     if(typeof returnData.data === 'object'){
//                         Object.keys(successData).forEach(function(key){
//                             returnData.data[key] = successData[key];
//                         });
//                     }else {
//                         returnData.data = successData;
//                     }
//                 }

//                 resolve(returnData);
//             };

//             methodData.onerror = function(error){
//                 reject(error);
//             };
//         }else {
//             console.error(method + ' is not method!!!');
//         }
//     });
// };

Store.prototype.transaction = function(mode){
    return this.db.transaction(this.store, mode || 'readonly').objectStore(this.store);
};

Store.prototype.getAll = function(){
    var that = this;
    return new Promise(function(resolve, reject){
        var getAllData = that.transaction().getAll();

        getAllData.onsuccess = function(success){
            resolve({
                data: success.target.result,
                success: success.type === 'success'
            });
        };

        getAllData.onerror = function(error){
            reject(error);
        };
    });
};

Store.prototype.getLoopAll = function(callback){
    var getAllDetailedData = this.transaction().openCursor();

    getAllDetailedData.onsuccess = function(e){
        var cursor = e.target.result;
        if(cursor && callback && typeof callback === 'function'){
            cursor.value.key = cursor.key;
            callback(cursor.value);
            cursor.continue();
        }
    };

    getAllDetailedData.onerror = function(error){
        console.error('getLoopAll Error: ', error);
    };
};

Store.prototype.get = function(key){
    var that = this;
    return new Promise(function(resolve, reject){
        var getData = that.transaction().get(key);

        getData.onsuccess = function(success){
            var data = success.target.result;
            data && (data.key = key);

            resolve({
                data: data,
                success: success.type === 'success'
            });
        };

        getData.onerror = function(error){
            reject(error);
        };
    });
};

Store.prototype.add = function(data){
    var that = this;
    return new Promise(function(resolve, reject){
        var addData = that.transaction('readwrite').add(data);

        addData.onsuccess = function(success){
            var key = success.target.result;
            data.key = key;
            resolve({
                data: data,
                success: success.type === 'success'
            });
        };

        addData.onerror = function(error){
            reject(error);
        };
    });
};

Store.prototype.put = function(key, data){
    var that = this;
    return new Promise(function(resolve, reject){
        var putData = that.transaction('readwrite').put(data, key);

        putData.onsuccess = function(success){
            data.key = key;
            resolve({
                data: data,
                success: success.type === 'success'
            });
        };

        putData.onerror = function(error){
            reject(error);
        };
    });
};

Store.prototype.count = function(){
    var that = this;
    return new Promise(function(resolve, reject){
        var countData = that.transaction().count();

        countData.onsuccess = function(success){
            resolve({
                data: success.target.result,
                success: success.type === 'success'
            });
        };

        countData.onerror = function(error){
            reject(error);
        };
    });
};

Store.prototype.delete = function(key){
    var that = this;
    return new Promise(function(resolve, reject){
        var deleteData = that.transaction('readwrite').delete(key);

        deleteData.onsuccess = function(success){
            resolve({
                data: key,
                success: success.type === 'success'
            });
        };

        deleteData.onerror = function(error){
            reject(error);
        };
    });
};

Store.prototype.clear = function(){
    var that = this;
    return new Promise(function(resolve, reject){
        var clearData = that.transaction('readwrite').clear();

        clearData.onsuccess = function(success){
            resolve({
                success: success.type === 'success'
            });
        };

        clearData.onerror = function(error){
            reject(error);
        }
    });
};
