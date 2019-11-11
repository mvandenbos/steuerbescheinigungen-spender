
const path = require("path");
const fs = require('fs')
const Store = require('electron-store');
const store = new Store();
const settingsFilePath = path.join(__dirname, "", "../settings/settings.json");
const templateFilePath = path.join(__dirname, "", "../template/template.json");
const keys = require('../config/LocalForageKeys').default

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
    let _rawdata
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
    vStore.dispatch('UPDTAE_' + key, parsedData)
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

module.exports = {
  save: saveToUserDataAndLocalStorage,
  get: readFromUserDataAndLocalStorage,
  resetAll: resetAll,
  resetItem: resetItem
}