var appUrl = window.location.origin;

var ajaxFunctions = {

  ready: function ready(fn) {
    if (typeof fn !== 'function') return;
    if (document.readyState === 'complete') return fn();

    document.addEventListener('DOMContentLoaded', fn, false);

  },/*
  ajaxRequest: function ajaxRequest(method, url, callback) {

    fetch(url, { method: method })
      .then(function(res) {
        if (res.status !== 200) {
          console.log("ajaxRequest problem... status: ", res.status, res.statusText);
        }
        return res.text();
      })
      .then(function(data) {
        callback(data);
      })
      .catch(function(err) {
        throw err;
      });

  }
  */
  ajaxRequest: function ajaxRequest (method, url, callback) {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        callback(xmlhttp.response);
      }
    };

    xmlhttp.open(method, url, true);
    xmlhttp.send();
  }

}
