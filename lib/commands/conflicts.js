(function () {
    "use strict";

    var Utils = require('./utils'),
        Queries = require('./queries');

    class ConflictsCommand {
        constructor(db) {
            this.db = db;
            this.prefix = '.conflicts';
            this.usage = '.conflicts';
            this.description = 'Lists all the conflicts';
        }

        run(messages, writer) {
            return Utils.runQuery(messages, writer, this.db.queryConflicts.bind(this.db, Queries.listSysObjectsSql()));
        }
    }

    module.exports = exports = ConflictsCommand;

} ());