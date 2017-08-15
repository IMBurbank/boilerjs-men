'use strict';

(function () {
  var apiUrl = appUrl + '/api/:id',
      displayName = document.querySelector('#display-name'),
      profileId = document.querySelector('#profile-id') || null,
      profileRepos = document.querySelector('#profile-repos') || null,
      profileUsername = document.querySelector('#profile-username') || null;


  function updateHtmlElement(data, element, userProperty) {
    element.innerHTML = data[userProperty];
  }


  ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function(data) {
    var json = JSON.parse(data);

    updateHtmlElement(json.userInfo, displayName, 'displayName');

    if (profileId !== null) updateHtmlElement(json.userInfo, profileId, 'id');
    if (profileUsername !== null) updateHtmlElement(json.userInfo, profileUsername, 'username');
    if (profileRepos !== null) updateHtmlElement(json.userInfo, profileRepos, 'publicRepos');
  }));

})();
