const q = require('q');
const fs = require('fs')

function saveTemplate (template) {
  var deferred = q.defer();
  
  let filePath = "../template/template.js"
  const writeStream = fs.writeFile(filePath, template);

  writeStream.on("finish", function() {
    deferred.resolve(filePath);
  });

  writeStream.on("error", function(error) {
    deferred.reject({message: error });
  });
  return deferred.promise;
};

module.exports = {
  saveTemplate: saveTemplate
}