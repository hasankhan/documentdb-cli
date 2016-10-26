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
            this.client = new DocumentClient(config.host, {masterKey: config.masterKey});
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
            return this._exec(this.client.queryDatabases, sql);
        }

        queryCollections(sql) {
            try {
                return this._exec(this.client.queryCollections, this.dbLink, sql);
            }
            catch (e) {
                return Q.reject(e);
            }
        }

        query(sql) {
            try {
                return this._exec(this.client.queryDocuments, this.collLink, sql);
            }
            catch (e) {
                return Q.reject(e);
            }
        }

        _exec(cmd) {
            var deferred = Q.defer();

            try {
                cmd.apply(this.client, Array.prototype.splice.call(arguments, 1))
                    .toArray(function(err, result) {
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