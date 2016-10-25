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
            return this.queryDatabases(Queries.connectSql());
        }

        queryDatabases(sql) {
            var self = this,
                deferred = Q.defer();

            this.client.queryDatabases(sql)
                .toArray(function(err, result){
                    err ? deferred.reject(err) : deferred.resolve(result);
                });
            return deferred.promise;
        }

    }

    module.exports = exports = DocumentDBService;
} ());