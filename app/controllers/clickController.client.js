'use strict';

(function () {

  var addButton = document.querySelector('.btn-add'),
      apiUrl = appUrl + '/api/:id/clicks',
      clickNbr = document.querySelector('#click-nbr'),
      deleteButton = document.querySelector('.btn-delete');


  function updateClickCount(data) {
    var json = JSON.parse(data);

    clickNbr.innerHTML = json.clicks;
  };


  ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount));

  addButton.addEventListener('click', function() {
    ajaxFunctions.ajaxRequest('POST', apiUrl, function() {
      ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount);
    });
  }, false);

  deleteButton.addEventListener('click', function() {
    ajaxFunctions.ajaxRequest('DELETE', apiUrl, function() {
      ajaxFunctions.ajaxRequest('GET', apiUrl, updateClickCount);
    });
  }, false);

})();
