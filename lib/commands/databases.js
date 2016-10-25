(function () {
    "use strict";

    var Utils = require('./utils'),
        Queries = require('./queries');

    class ListDatabasesCommand {
        constructor(db) {
            this.db = db;
            this.prefix = '.databases';
            this.usage = '.databases';
            this.description = 'Lists all the databases';
        }

        run(messages, writer) {
            return Utils.runQuery(messages, writer, this.db.queryDatabases.bind(this.db, Queries.listObjectsSql()));
        }
    }

    module.exports = exports = ListDatabasesCommand;

} ());