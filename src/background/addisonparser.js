const q = require('q');
const xlsx = require("xlsx");
import errors from '../config/errors'

function parseDate(input) {
  var parts = input.match(/(\d+)/g);
  return new Date(parts[2], parts[1]-1, parts[0]).toLocaleDateString('de-DE', {month: '2-digit', day: '2-digit', year: 'numeric', hour12: false});
}

function returnDoubleDigitCents(val, separator) {
  let cents = val.split(separator)
  cents[1] = cents[1].padEnd(2,0)
  return cents.join("").replace(/(\d{2})$/, '.$1');
}

function parsePotentiallyGroupedFloat(stringValue) {
  stringValue = stringValue.trim();
  var result = stringValue.replace(/[^0-9]/g, '');
  if (/[,]\d{1,2}$/.test(stringValue)) {
    result = returnDoubleDigitCents(stringValue, ",")
  }
  else if (/[\.]\d{1,2}$/.test(stringValue)) {
    result = returnDoubleDigitCents(stringValue, ".")
  }
  return Math.abs(parseFloat(result));
}

let getDonorsFromAddisonExport = function(filepath) {
  let addisonData = [];
  var deferred = q.defer();
  if (filepath != null) {
    
    var extensionType = filepath.toString().split('.')[filepath.toString().split('.').length-1];
    if (extensionType == "xlsx" || extensionType == "csv") {
      try {
        var workbook = xlsx.readFile(filepath, {type: "string", raw: true})
        var worksheet = workbook.SheetNames[0]
        var jsonObject = xlsx.utils.sheet_to_json(workbook.Sheets[worksheet])

        jsonObject.sort(function (a, b) {
          var x = a["Buchungsdatum"].toLowerCase();
          var y = b["Buchungsdatum"].toLowerCase();
          if (x < y) {return -1;}
          if (x > y) {return 1;}
          return 0;
        });
        
        addisonData = jsonObject.filter(record=> {
            if ( 
                ( record["Gegenkonto"] == '8110' || 
                  record["Gegenkonto"] == '8111' || 
                  record["Gegenkonto"] == '8112' ||
                  record["Gegenkonto"] == '8113' ||
                  record["Gegenkonto"] == '8114' ||
                  record["Gegenkonto"] == '8115' ||
                  record["Gegenkonto"] == '8116' ||
                  record["Gegenkonto"] == '8117' ||
                  record["Gegenkonto"] == '8118' ||
                  record["Gegenkonto"] == '8119' 
                ) ||
                ( record["Kontonummer"] == '8110' || 
                  record["Kontonummer"] == '8111' || 
                  record["Kontonummer"] == '8112' ||
                  record["Kontonummer"] == '8113' ||
                  record["Kontonummer"] == '8114' ||
                  record["Kontonummer"] == '8115' ||
                  record["Kontonummer"] == '8116' ||
                  record["Kontonummer"] == '8117' ||
                  record["Kontonummer"] == '8118' ||
                  record["Kontonummer"] == '8119'
                ) &&
                record["Belegnummer 2"] != undefined ) {
                return true
            }
            else {return false}
        }).map(rec => {
          let _rec = {          
            "Belegnummer 2": rec["Belegnummer 2"],
            "Buchungstext": rec["Buchungstext"],
            "Betrag": parsePotentiallyGroupedFloat(rec["Betrag"]),
            "Datum": (rec["Datum"] == undefined) ? parseDate(rec["Belegdatum"]) : parseDate(rec["Datum"]),
            "Konto": (rec["Konto"] == undefined) ? rec["Gegenkonto"] : rec["Konto"],
            "Gegenkonto": (rec["Konto"] == undefined) ? rec["Kontonummer"] : rec["Gegenkonto"],
            "Kostenstelle 1": (rec["Kostenstelle 1"] == undefined) ? rec["Kost 1"] : rec["Kostenstelle 1"] 
          }
          return _rec
        });

        if (addisonData.length > 0) {
          deferred.resolve(addisonData);
        }
        else {
          deferred.reject({message: errors.E003})
        }
      } catch (e){
        deferred.reject({message: String(e)})
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
  getDonorsFromAddisonExport: getDonorsFromAddisonExport
}