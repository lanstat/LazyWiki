window.wikiDataBase = {
    bd: null,
    _prepare: function(callback){
        window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

        window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
        window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

        if (!window.indexedDB) {
            window.alert('Su navegador no soporta una version estable de indexedDB.')
        }

        var _this = this;
        var request = window.indexedDB.open('LazyWikiDB', 1);

        request.onerror = function() {
            callback(-1);
        };

        request.onsuccess = function() {
            _this.db = request.result;
            callback(0);
        };

        request.onupgradeneeded = function(event) {
            _this.db = event.target.result;
            var objectStore = _this.db.createObjectStore('article', {keyPath: 'hash'});

            objectStore.add({hash: 'Primer_articulo', title: 'Primer articulo', content: 'Mi primer articulo'});
        }

    },
    read: function(hash, callback){
        var _this = this;

        if (this.db){
            this._get(hash, callback);
        } else {
            this._prepare(function(){
                _this._get(hash, callback);
            });
        }
    },
    write: function(article, callback){
        var _this = this;

        if (this.db){
            this._store(article, callback);
        } else {
            this._prepare(function(){
                _this._store(article, callback);
            });
        }
    },
    _get: function(hash, callback){
        var transaction = this.db.transaction(['article']);
        var objectStore = transaction.objectStore('article');
        var request = objectStore.get(hash);

        request.onerror = function() {
            alert("Unable to retrieve daa from database!");
        };

        request.onsuccess = function() {
            if(request.result) {
                callback(0, request.result);
            }
            else {
                callback(-1);
            }
        };
    },
    _store: function(article, callback){
        var request = this.db.transaction(['article'], 'readwrite')
            .objectStore('article')
            .put(article);

        request.onsuccess = function(event) {
            callback(0);
        };

        request.onerror = function(event) {
            callback(-1);
        }
    }
};
