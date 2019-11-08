// ctaccessor.js
// helper function to access ChurchTools API
//
// (c) 2017 ChurchTools

import { churchtools } from './credentials';
import { post } from 'restler';
import Q, { defer } from 'q';
import { map, each } from 'underscore';

var cookieStore = {};
let retryCount = 0;

var PostQ = function (q, data, contentType, multipart, retry) {
  // FIXME: check here, if we should abort

  var deferred = defer();

  var cookies = map(cookieStore, function(val, key) {
    return key + "=" + encodeURIComponent(val);
  }).join("; ");

  var url = churchtools.host + '/?q='+q;
  post(url, {
    multipart: multipart,
    headers: {
      Cookie: cookies,
      'Content-Type': contentType
    },
    data: data
  }).on("complete", function(result, res) {
    data.password = undefined;

    if (!res) {
      // no response, e.g. due to ENOTFOUND error in getaddrinfo system call
      var thenable = Q(true)
        .delay(1000) // wait one second, then try again
        .then(function () {
          if (retryCount >= 4) {
            retryCount= 0
            return result
          }
          else {
            // FIXME: check here, if we should abort instead of trying again
            retryCount++
            return PostQ(q, data, contentType, multipart, true);
          }
        });
      deferred.resolve(thenable);
      return;
    }

    if (res.headers && res.headers["set-cookie"]) {
      var newcookies = res.headers["set-cookie"];
      each(newcookies, function (newcookie) {
        var keyvalue = newcookie.split(";")[0].split("=");
        var key = keyvalue[0];
        var value = keyvalue[1];
        if (value.indexOf('deleted') === 0) {
          cookieStore[key] = undefined;
        } else {
          if (cookieStore[key] != value) {
            cookieStore[key] = value;
          }
        }
      });
    }

    if (result && ((result.status == 'success') ||
      ((typeof result == 'string') && (result.substr(0,8) == '{"files"')))) {
      if ((result.status == 'success') && result.data) {
        deferred.resolve(result);
      }
    } else {

      deferred.reject({message: result.data});
    }
  }).on('timeout', function () {
    var thenable = Q(true)
      .delay(1000) // wait one second, then try again
      .then(function () {
        if (retryCount >= 4) {
          retryCount= 0
          return result
        }
        else {
          // FIXME: check here, if we should abort instead of trying again
          retryCount++
          return PostQ(q, data, contentType, multipart, true);
        }
      });
    deferred.resolve(thenable);
  });

  return deferred.promise;
};

function remove_encoding(obj, recurse) {
  for (var i in obj) {
    if (typeof obj[i] === 'string') {
      obj[i] = obj[i].split('&quot;').join('"');
    } else if (recurse && typeof obj[i] === 'object') {
      remove_encoding(obj[i], recurse);
    }
  }
}

var PostMultipartQ = function (q, data, contentType) {
  return PostQ(q, data, contentType, true);
};

export const postQ = PostQ;
export const postMultipartQ = PostMultipartQ;
