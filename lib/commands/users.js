(function () {
    "use strict";

    var Utils = require('./utils'),
        Queries = require('./queries');

    class UsersCommand {
        constructor(db) {
            this.db = db;
            this.prefix = '.users';
            this.usage = '.users';
            this.description = 'Lists all the users';
        }

        run(messages, writer) {
            return Utils.runQuery(messages, writer, this.db.queryUsers.bind(this.db, Queries.listSysObjectsSql()));
        }
    }

    module.exports = exports = UsersCommand;

} ());