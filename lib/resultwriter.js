(function () {
    "use strict";

    var _ = require('underscore'),
        _str = require('underscore.string'),
        Table = require('easy-table'),
        csv = require('ya-csv'),
        sprintf = require("sprintf-js").sprintf;

    _.mixin(_str.exports());


    class ResultWriter {

        static create(format) {
            if (!format || format == 't' || format == 'table') {
                return new TableWriter();
            }
            else if (format == 'c' || format == 'csv') {
                return new CsvWriter();
            }
            else if (format == 'x' || format == 'xml') {
                return new XmlWriter();
            }
            else if (format == 'j' || format == 'json') {
                return new JsonWriter();
            }
            else {
                throw new Error(sprintf("Format '%s' is not supported.", format));
            }
        }

        constructor() {
        }

        start() { }
        write() { }
        end() { }

        _formatItem(item) {
            var self = this;
            _.each(item, (value, key) => {
                if (value instanceof Date) {
                    item[key] = value.toISOString();
                } else if (value instanceof Buffer) {
                    item[key] = value.toString('hex');
                } else if (value instanceof Object && !self.objectFormatter) {
                    item[key] = JSON.stringify(value);
                }
            });
        }
    }

    class TableWriter extends ResultWriter {
        constructor() {
            super();

            // avoid printing extra blank line after result
            this.appendsLineToResult = true;

            // can afford extra information between resultsets
            this.freeFormat = true;
        }

        start() {
            this.firstLine = true;
        }

        write(result) {
            if (!result || result.length === 0) {
                console.log();
                return;
            }

            if (!this.firstLine) {
                console.log();
            }

            result.forEach(this._formatItem.bind(this));
            console.log(Table.print(result));

            this.firstLine = false;
        }

        end() {
        }
    }

    class JsonWriter extends ResultWriter {
        constructor() {
            super();

            this.objectFormatter = true;
        }

        start() {
            this.firstLine = true;
        }

        write(result) {
            result = result || [];

            var prefix = !this.firstLine ? ', ' : '';
            console.log(prefix + JSON.stringify(result, null, 4));
            this.firstLine = false;
        }

        end() {

        }
    }

    class XmlWriter extends ResultWriter {
        constructor() {
            super();

            this.objectFormatter = true;
        }

        start() {
            console.log('<?xml version="1.0"?>');
        }

        write(result) {
            result = result || [];
            this._printList(result, 'result', 'item', '');
        }

        _printList(list, listElement, rowElement, indent) {
            var self = this;
            var rowIndent = indent + '  ';
            var colIndent = rowIndent + '  ';
            console.log(sprintf('%s<%s>', indent, listElement));
            var rowBegin = sprintf('%s<%s>', rowIndent, rowElement);
            var rowEnd = sprintf('%s</%s>', rowIndent, rowElement);
            var colFormat = colIndent + '<%s>%s</%1$s>';
            list.forEach(item => {
                console.log(rowBegin);
                self._printItem(item, colIndent, colFormat);
                console.log(rowEnd);
            });

            console.log(sprintf('%s</%s>', indent, listElement));
        }

        _printItem(item, colIndent, colFormat) {
            var self = this;
            this._formatItem(item);
            Object.keys(item)
                .forEach(key => {
                    var value = item[key];
                    if (Array.isArray(value)) {
                        self._printList(value, key, 'item', colIndent);
                    }
                    else if (value instanceof Object) {
                        console.log(sprintf('%s<%s>', colIndent, key));
                        var itemColIndent = colIndent + '  ';
                        self._printItem(value, itemColIndent, itemColIndent + '<%s>%s</%1$s>');
                        console.log(sprintf('%s</%s>', colIndent, key));                        
                    }
                    else {
                        value = self._escape(value);
                        key = self._escape(key);
                        console.log(sprintf(colFormat, key, value));
                    }
                });
        }

        end() {
        }

        _escape(text) {
            if (typeof text !== 'string') {
                return text;
            }

            return text.replace('"', '&quot;')
                .replace("'", '&apos;')
                .replace('<', '&lt;')
                .replace('>', '&gt;')
                .replace('&', '&amp;');
        }
    }

    class CsvWriter extends ResultWriter {
        constructor() {
            super();
            this.writer = csv.createCsvStreamWriter(process.stdout);
        }

        start() {
            this.firstLine = true;
        }

        write(result) {
            var self = this;

            if (!result || result.length === 0) {
                return;
            }

            if (!this.firstLine) {
                console.log();
            }

            result.forEach((item, i) => {
                // if it is first row then write column names
                if (i === 0) {
                    self.writer.writeRecord(_.keys(item));
                }

                self._formatItem(item);

                self.writer.writeRecord(_.values(item));
            });

            this.firstLine = false;
        }

        end() {
        }
    }

    ResultWriter.XmlWriter = XmlWriter;
    ResultWriter.JsonWriter = JsonWriter;
    ResultWriter.TableWriter = TableWriter;
    ResultWriter.CsvWriter = CsvWriter;

    module.exports = exports = ResultWriter;

} ());