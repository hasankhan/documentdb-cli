(function () {
    "use strict";

    var Utils = require('./utils'),
        Queries = require('./queries');

    class TriggersCommand {
        constructor(db) {
            this.db = db;
            this.prefix = '.triggers';
            this.usage = '.triggers';
            this.description = 'Lists all the triggers';
        }

        run(messages, writer) {
            return Utils.runQuery(messages, writer, this.db.queryTriggers.bind(this.db, Queries.listSysObjectsSql()));
        }
    }

    module.exports = exports = TriggersCommand;

} ());