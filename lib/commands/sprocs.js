(function () {
    "use strict";

    var Utils = require('./utils'),
        Queries = require('./queries');

    class StoredProcsCommand {
        constructor(db) {
            this.db = db;
            this.prefix = '.sprocs';
            this.usage = '.sprocs';
            this.description = 'Lists all the stored procedures';
        }

        run(messages, writer) {
            return Utils.runQuery(messages, writer, this.db.queryStoredProcedures.bind(this.db, Queries.listSysObjectsSql()));
        }
    }

    module.exports = exports = StoredProcsCommand;

} ());