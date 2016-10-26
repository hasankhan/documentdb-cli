(function () {
    "use strict";

    var Utils = require('./utils'),
        Queries = require('./queries');

    class CollectionsCommand {
        constructor(db) {
            this.db = db;
            this.prefix = '.collections';
            this.usage = '.collections';
            this.description = 'Lists all the collections';
        }

        run(messages, writer) {
            return Utils.runQuery(messages, writer, this.db.queryCollections.bind(this.db, Queries.listObjectsSql()));
        }
    }

    module.exports = exports = CollectionsCommand;

} ());