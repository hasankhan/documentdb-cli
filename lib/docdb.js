(function () {
    "use strict";

    var _ = require('underscore'),
        Q = require('q'),
        Queries = require('./commands/queries'),
        _str = require('underscore.string'),
        DocumentClient = require('documentdb').DocumentClient;

    class DocumentDBService {

        constructor() {
        }

        connect(config) {
            this.client = new DocumentClient(config.host, { masterKey: config.masterKey });
            this.database = config.database;
            this.collection = config.collection;
            return this.queryDatabases(Queries.connectSql());
        }

        get dbLink() {
            if (!this.database) {
                throw new Error('database not selected');
            }
            return 'dbs/' + this.database;
        }

        get collLink() {
            if (!this.collection) {
                throw new Error('collection not selected');
            }
            return this.dbLink + '/colls/' + this.collection;
        }

        queryDatabases(sql) {
            return this._exec(function(c) { 
                return c.queryDatabases(sql);
            });
        }

        queryStoredProcedures(sql) {
            return this._exec(function(c) { 
                return c.queryStoredProcedures(this.collLink, sql);
            });
        }

        queryCollections(sql) {
            return this._exec(function(c) { 
                return c.queryCollections(this.dbLink, sql); 
            });
        }

        query(sql) {
            return this._exec(function(c) { 
                return c.queryDocuments(this.collLink, sql); 
            });            
        }

        _exec(action) {
            var deferred = Q.defer();

            try {
                action.call(this, this.client)
                    .toArray(function (err, result) {
                        if (err) {
                            deferred.reject(err);
                        }
                        else {
                            deferred.resolve(result);
                        }
                    });
            }
            catch (e) {
                deferred.reject(e);
            }

            return deferred.promise;
        }
    }

    module.exports = exports = DocumentDBService;
} ());