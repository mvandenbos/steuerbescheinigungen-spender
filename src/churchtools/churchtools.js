// churchtools.js
// defines API calls to ChurchTools
//
// (c) 2017 ChurchTools

import { churchtools } from './credentials';

const { churchtoolsClient, activateLogging } = require('@churchtools/churchtools-client');
const axiosCookieJarSupport = require('axios-cookiejar-support');
const tough = require('tough-cookie');

churchtoolsClient.setCookieJar(axiosCookieJarSupport.default, new tough.CookieJar());
churchtoolsClient.setBaseUrl(churchtools.host);

function handleError(error) {
  if (error.response && error.response.data) {
      console.log(error.response.data.translatedMessage || error.response.data.message);
  } else {
      console.error(error);
  }
}

function _login(username, password) {
  churchtoolsClient.setBaseUrl(churchtools.host);
  return churchtoolsClient.post('/login', {
    username,
    password
  }).then(() => {
    console.log("get persons2");
    return churchtoolsClient.post('/persons');
  }).catch(handleError);
}

var _getChurchDBexportSpenderPersonData = function () {
  //_login(churchtools.user, churchtools.password).then(()=> {
    console.log("get persons");
    return churchtoolsClient.get('/persons');
  //})
};

var _getChurchDBPersonById = function (id) {
  return churchtoolsClient.post('churchdb/ajax', {
    func: 'getPersonDetails',
    id: id
  });
};


export const getChurchDBPersonByIdQ = _getChurchDBPersonById;
export const getExportSpenderPersonDataQ = _getChurchDBexportSpenderPersonData;
export const loginQ = _login;