const q = require('q');
const dialog = require('electron').remote.dialog
const xlsx = require("xlsx");
const errors = require("../config/errors").default;
const fs = require('fs')
const path = require("path");
const filePath = path.join(__dirname, "..", "/template/template.json");

import keys from '../config/LocalForageKeys'
import localFileManager from '../utilities/localFileManager'

function getTemplateData () {
  let data = localFileManager.get(window.localStorage, keys.TEMPLATE);
  return data
}

function generateExcelReport (reports) {
  var deferred = q.defer();
  let headerOrder = [
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
  for(var i = 0; i < 100; i++) {
    headerOrder.push('datum_'+i.toString().padStart(2,0))
    headerOrder.push('spende_'+i.toString().padStart(2,0))
    headerOrder.push('artderzuwendung_'+i.toString().padStart(2,0))
    headerOrder.push('verzichtauferstattung_'+i.toString().padStart(2,0))
  }

  let ws1 = xlsx.utils.json_to_sheet(reports, { header: headerOrder })
  let wb = xlsx.utils.book_new()
  xlsx.utils.book_append_sheet(wb, ws1, "Spender")

  let templateData = getTemplateData();

  dialog.showSaveDialog({
    filters: [{
      name: 'Excel',
      extensions: ['xlsx']
    }],
    defaultPath: '~/Spendenbescheinigung-' + templateData.year + '.xlsx'
  }, function(file_path) {
    if (file_path) {       
      var wopts = { bookType:'xlsx', bookSST:false, type:'buffer' }     
      xlsx.writeFileAsync( file_path, wb, wopts, function(error, result) {
        if(error) {
          deferred.reject({message: error })
        }
        else {
          deferred.resolve(file_path);
        }
      })
    }
    else {
      deferred.reject({message: errors.E002});
    }
  });  
  return deferred.promise;
};

module.exports = {
  generateExcelReport: generateExcelReport
}