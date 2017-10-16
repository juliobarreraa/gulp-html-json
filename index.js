var through = require('through2');
var pug = require('pug');
var himalaya = require('himalaya');
var toHTML = require('himalaya/translate').toHTML;
var fs = require('fs');
var path = require('path');
var PLUGIN_NAME = 'gulp-html-json';
var gUtil = require('gulp-util');

module.exports = function(opt) {
    opt = opt || {};
    var jsonObject = {};
    function bufferContents(file, enc, cb) {
        // ignore empty files
        if (file.isNull()) {
            cb();
            return;
        }
        // we don't do streams (yet)
        if (file.isStream()) {
            this.emit('error', new Error(PLUGIN_NAME + ': Streaming not supported'));
            cb();
            return;
        }
        var html = pug.render(file.contents);
        jsonString = himalaya.parse(html);
        keyObject = path.basename(file.path, path.extname(file.path));
        jsonObject[keyObject] = jsonString;
        cb();
    }

    function endStream(cb) {
        fs.writeFile(
            null,
            JSON.stringify(jsonObject)
        );
        cb();
    }        
    return through.obj(bufferContents, endStream);    
};
