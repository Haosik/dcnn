;
$(document).ready(function() {

  // Scroll to comments
  var commentsOffTop = $('.comments-wrap').offset().top;
  $('.article-info__comments').on('click', function(e) {
    e.preventDefault();
    $('html, body').stop().animate({ scrollTop: commentsOffTop }, 400)
  })

});