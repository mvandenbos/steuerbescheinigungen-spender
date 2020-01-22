
const path = require("path");
const fs = require('fs')
const Store = require('electron-store');
const store = new Store();
const settingsFilePath = path.join(__dirname, "", "../settings/settings.json");
const templateFilePath = path.join(__dirname, "", "../template/template.json");
const dialog = require('electron').remote.dialog
const keys = require('../config/LocalForageKeys').default

const recurse = function(o, p, fn) {
  for (var i in o) {
    fn.apply(this,[i,o[i],o, p]);  
    if (o[i] !== null && typeof(o[i])=="object") {
      recurse(o[i], i, fn);
    }
  }
}

const updateFromImport = function (toUpdateJSON, fromImportJSON) {
  recurse(toUpdateJSON, null, function(k, v, o, p) {
    recurse(fromImportJSON, k, function(k2, v2, o2, p2) {
      if (k2 == k && typeof(v2)!="object" && p==p2) {
        o[k] = v2
      }
    });
  });
}

const isDataDoesNotExists = function (data) {
  if (data == undefined || data == null || data == "" || data == "null" ) {
    return true
  }
  return false
}

const getDefaultItem = function (key) {
  let _filePath
  let _data
  if (key == keys.SETTINGS) {
    _filePath = settingsFilePath
  }
  else if (key == keys.TEMPLATE) {
    _filePath = templateFilePath
  }
  _data = fs.readFileSync(_filePath);

  return _data
}

const saveToUserDataAndLocalStorage = function (localStore, key, data) {
  try {
    //Save to localStorage
    let _data = JSON.stringify(data)
    localStore.setItem(key, _data)    
    //Save to UserData
    store.set(key, _data);
  }
  catch(err) {
    console.log(err)
  }
}

const readFromUserDataAndLocalStorage = function (localStore, key) {
  try {
    let _data
    //Get from LocalStorage
    _data = localStore.getItem(key)
    if (isDataDoesNotExists(_data)) {
      //get from UserData if LocalStorage is empty
      _data = store.get(key)
    }
    if (isDataDoesNotExists(_data)) {
      //Get from default template
      _data = getDefaultItem(key)
    }
    let parsedData = JSON.parse(_data) 
    saveToUserDataAndLocalStorage(localStore, key, parsedData)
    return parsedData
  }
  catch(err) {
    console.log(err)
  }
}

const resetAll = function (localStore, vStore) {  
  store.clear()
  localStore.clear()
  keys.forEach(key => {
    let parsedData = JSON.parse(getDefaultItem(key)) 
    saveToUserDataAndLocalStorage(localStore, key, parsedData)
    vStore.dispatch('UPDATE_' + key, parsedData)
  });  
}

const resetItem = function (localStore, key, vStore = null, command = null) {
  store.delete(key)
  localStore.removeItem(key)  
  let parsedData = JSON.parse(getDefaultItem(key))  
  saveToUserDataAndLocalStorage(localStore, key, parsedData)  
  if (vStore != null && command != null) {
    vStore.dispatch(command, parsedData)
  }
}

const importLocalJSONFile = function (localStore, key, vStore = null, command = null) {
  dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{
      name: 'JSON',
      extensions: ['json']
    }]
  }, function (files) {
      if (files !== undefined) {             
        let data = JSON.parse(fs.readFileSync(files[0], 'utf8'));
        //get default JSON data
        let defaultJSON = readFromUserDataAndLocalStorage(localStore, key)
        //compare and update default JSON from Import
        updateFromImport(defaultJSON, data)
        //save changes
        saveToUserDataAndLocalStorage(localStore, key, defaultJSON)
        if (vStore != null && command != null) {
          vStore.dispatch(command, defaultJSON)
        }
      }
  });
}

const exportLocalJSONFile = function (localStore, key) {
  dialog.showSaveDialog(
    {
      defaultPath: "~/" + key + "_EXPORT.json",
      filters: [{
        name: 'JSON',
        extensions: ['json']
      }]
    }, function(file_path) {
      if (file_path) {
        let content = readFromUserDataAndLocalStorage(localStore, key)
        fs.writeFileSync(file_path, JSON.stringify(content), 'utf-8');
      }
      else {
        console.error(errors.E002);
      }
    });
  }

module.exports = {
  save: saveToUserDataAndLocalStorage,
  get: readFromUserDataAndLocalStorage,
  resetAll: resetAll,
  resetItem: resetItem,
  exportJSONFile: exportLocalJSONFile,
  importJSONFile: importLocalJSONFile,
}