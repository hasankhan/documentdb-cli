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

        queryDatabases(query) {
            return this._exec(c => { 
                return c.queryDatabases(query);
            });
        }

        queryConflicts(query) {
            return this._exec(c => {
                return c.queryConflicts(this.collLink, query);
            });
        }

        queryUsers(query, options) {
            return this._exec(c => {
                return c.queryUsers(this.dbLink, query, options);
            });
        }

        queryPartitionKeyRanges(query, options) {
            return this._exec(c => {
                return c.queryPartitionKeyRanges(this.dbLink, query, options);
            });
        }

        queryTriggers(query, options) {
            return this._exec(c => {
                return c.queryTriggers(this.collLink, query, options);
            });
        }

        queryUserDefinedFunctions(query, options) {
            return this._exec(c => {
                return c.queryUserDefinedFunctions(this.collLink, query, options);
            });
        }

        queryPermissions(user, query, options) {
            return this._exec(c => {
                var userLink = this.dbLink + '/users/' + user;
                return c.queryPermissions(userLink, query, options);
            });
        }

        queryAttachments(doc, query, options) {
            return this._exec(c => {
                var docLink = this.collLink + '/docs/' + doc;
                return c.queryAttachments(docLink, query, options);
            });
        }

        queryStoredProcedures(query) {
            return this._exec(c => { 
                return c.queryStoredProcedures(this.collLink, query);
            });
        }

        queryCollections(query) {
            return this._exec(c => { 
                return c.queryCollections(this.dbLink, query); 
            });
        }

        query(query) {
            return this._exec(c => { 
                return c.queryDocuments(this.collLink, query); 
            });            
        }

        _exec(action) {
            var deferred = Q.defer();

            try {
                action.call(this, this.client)
                    .toArray((err, result) => {
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