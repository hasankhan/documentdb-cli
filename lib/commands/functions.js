(function () {
    "use strict";

    var Utils = require('./utils'),
        Queries = require('./queries');

    class FunctionsCommand {
        constructor(db) {
            this.db = db;
            this.prefix = '.functions';
            this.usage = '.functions';
            this.description = 'Lists all the user defined functions';
        }

        run(messages, writer) {
            return Utils.runQuery(messages, writer, this.db.queryUserDefinedFunctions.bind(this.db, Queries.listSysObjectsSql()));
        }
    }

    module.exports = exports = FunctionsCommand;

} ());