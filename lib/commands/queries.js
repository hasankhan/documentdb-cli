(function () {
    "use strict";

    var _ = require('underscore'),
        mstring = require('mstring'),
        sprintf = require("sprintf-js").sprintf;

    class Queries {

        static connectSql() {
            return mstring(function () {/***
                SELECT TOP 0 r.id FROM root r
            ***/});
        }

        static listSysObjectsSql() {
            return mstring(function () {/***
                SELECT r.id, r._rid, r._self, r._ts FROM root r
            ***/});
        }
    }

    module.exports = exports = Queries;

} ());