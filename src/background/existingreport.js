const q = require('q');
const xlsx = require("xlsx");
import errors from '../errors'

let hasCorrectHeaders = function(data) {
  let reportHeaders = [
    'optigem_nr',
    'name',
    'vorname',
    'anrede',
    'ort',
    'plz',
    'strasse',
    'zusatz',
    'total',
    'totalText'
  ]

  for(var i = 0; i < reportHeaders.length; i++) {
    if (data[0][reportHeaders[i]] == undefined) return false
  }

  return true
}

let getDatafromExistingReport = function(filepath) {
  var deferred = q.defer();
  if (filepath != null) {
    
    var extensionType = filepath.toString().split('.')[filepath.toString().split('.').length-1];
    if (extensionType == "xlsx") {
      try {
        var workbook = xlsx.readFile(filepath)
        var worksheet = workbook.SheetNames[0]
        var jsonObject = xlsx.utils.sheet_to_json(workbook.Sheets[worksheet])

        if (jsonObject.length > 0 && hasCorrectHeaders(jsonObject)) {
          deferred.resolve(jsonObject);
        }
        else {
          deferred.reject({message: errors.E003})
        }
      } catch (e){
        deferred.reject({message: e})
      }
    }
    else {
      deferred.reject({message: errors.E005})
    }
  } else {
    deferred.reject({message: errors.E006})
  }
  return deferred.promise;
};

module.exports = {
  getDatafromExistingReport: getDatafromExistingReport
}