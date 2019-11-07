// churchtools.js
// defines API calls to ChurchTools
//
// (c) 2017 ChurchTools

import { postQ } from './ctaccessor';
import { churchtools } from './credentials';

var _loginQ = function (user, password) {
  return postQ('login/ajax', {
    func: 'login',
    email: churchtools.user,
    password: churchtools.password
  });
};

var _getChurchDBexportSpenderPersonDataQ = function () {
  return postQ('churchdb/ajax', {
    func: 'adminExportOfAllPersonData'
  });
};

var _getChurchDBPersonByIdQ = function (id) {
  return postQ('churchdb/ajax', {
    func: 'getPersonDetails',
    id: id
  });
};

var _getExportSpenderPersonDataQ = function () {
  return loginQ()
    .then(function() {
      return _getChurchDBexportSpenderPersonDataQ();
    });
};

export const getChurchDBPersonByIdQ = _getChurchDBPersonByIdQ;
export const getExportSpenderPersonDataQ = _getExportSpenderPersonDataQ;
export const loginQ = _loginQ;