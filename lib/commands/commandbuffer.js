(function () {
    "use strict";

    var Utils = require('./utils');

    const EventEmitter = require('events');

    class CommandBuffer extends EventEmitter {
        constructor() {
            super();
            
            this.buffer = '';
        }

        addLine(line) {
            if (Utils.isContinued(line)) {
                line = Utils.trimSlash(line);
                this.buffer = Utils.appendLine(this.buffer, line);
            }
            else {
                this.buffer = Utils.appendLine(this.buffer, line);
                this.flush();    
            }
        }

        flush() {
            this.emit('command', this.buffer);
            this.buffer = '';
        }
    }

    module.exports = exports = CommandBuffer;

} ()); 