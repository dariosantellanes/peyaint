var fs = require('fs');
var path = require('path');

module.exports = function (filePath) {
    return new Promise((resolve, reject) => {
        return fs.readdir(path.join(__dirname, filePath), function (err, files) {
            var list = [];
            if (err) {
                reject(err);
            }
            files.forEach(function (file, index) {
                list.push(file);
            });
            resolve(list);
        })
    });
}
