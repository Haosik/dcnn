;
$(document).ready(function() {

  // Scroll to comments
  var commentsOffTop = $('.comments-wrap').offset().top;
  $('.article-info__comments').on('click', function(e) {
    e.preventDefault();
    $('html, body').stop().animate({ scrollTop: commentsOffTop }, 400)
  })

  // Ajax Handler
  var ajaxRequest = function(options) {
    var url = options.url || '/';
    var method = options.method || 'GET';
    var callback = options.callback || function() {};
    var data = options.data || {};
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.open(method, url, true);
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    xmlHttp.send(JSON.stringify(data));

    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.status === 200 && xmlHttp.readyState === 4) {
        callback(xmlHttp.responseText);
      }
    };
  };

});