(function () {
    "use strict";

    var Utils = require('./utils'),
        Queries = require('./queries');

    class AttachmentsCommand {
        constructor(db) {
            this.db = db;
            this.prefix = '.attachments';
            this.usage = '.attachments DOC';
            this.description = 'Lists all the attachments';
        }

        run(messages, writer, args) {
            if (!Utils.validateArgs(args, 1)) {
                return Q.reject('Doc id must be specified');
            }

            return Utils.runQuery(messages, writer, this.db.queryAttachments.bind(this.db, args[0], Queries.listSysObjectsSql()));
        }
    }

    module.exports = exports = AttachmentsCommand;

} ());