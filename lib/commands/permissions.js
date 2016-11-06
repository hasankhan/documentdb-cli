(function () {
    "use strict";

    var Utils = require('./utils'),
        Queries = require('./queries');

    class PermisisonsCommand {
        constructor(db) {
            this.db = db;
            this.prefix = '.permissions';
            this.usage = '.permissions USER';
            this.description = 'Lists all the permissions';
        }

        run(messages, writer, args) {
            if (!Utils.validateArgs(args, 1)) {
                return Q.reject('User id must be specified');
            }

            return Utils.runQuery(messages, writer, this.db.queryPermissions.bind(this.db, args[0], Queries.listSysObjectsSql()));
        }
    }

    module.exports = exports = PermisisonsCommand;

} ());