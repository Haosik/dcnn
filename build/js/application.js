'use strict';

;
$(document).ready(function () {

  // Magnific popup
  $('.with-img .float-link').magnificPopup({
    type: 'image',
    closeOnContentClick: true,
    mainClass: 'mfp-img-mobile',
    image: {
      verticalFit: true
    }

  });

  // Scroll to comments
  $('.article-info__comments').on('click', function (e) {
    var commentsOffTop = $('.comments-wrap').offset().top;
    e.preventDefault();
    $('html, body').stop().animate({ scrollTop: commentsOffTop }, 400);
  });

  var myAuthorId = 1;

  //ES2015 String Literal for avoiding some mess
  function renderOneComment(commentObj) {
    var name = commentObj.author.name;
    var commentText = commentObj.content;
    var avatar = commentObj.author.avatar;
    var commentId = commentObj.id;
    var authorId = commentObj.author.id;

    var answersString = '';
    if (commentObj.children.length) {
      for (var i = 0; i < commentObj.children.length; i++) {
        var answerName = commentObj.children[i].author.name;
        var answerCommentText = commentObj.children[i].content;
        var answerAvatar = commentObj.children[i].author.avatar;
        answersString += '\n\t\t\t<div class="one-answer__wrap clearfix">\n\t\t\t    <div class="one-answer__avatar-wrap">\n\t\t\t        <div class="comments-avatar">\n\t\t\t            <img src="' + answerAvatar + '" alt="Avatar of author">\n\t\t\t        </div>\n\t\t\t    </div>\n\t\t\t    <div class="one-answer__right-wrap">\n\t\t\t        <div class="one-answer__info">\n\t\t\t            <div class="one-answer__info-top">\n\t\t\t                <div class="answer-top__item one-answer__author bolder">' + answerName + '</div>\n\t\t\t                <div class="answer-top__item one-answer__whom">\n\t\t\t                    <i class="fa fa-reply"></i>\n\t\t\t                    <span>Kurk Thompson</span>\n\t\t\t                </div>\n\t\t\t                <div class="answer-top__item one-answer__date-wrap">\n\t\t\t                    <i class="fa fa-clock-o"></i>\n\t\t\t                    <span class="bolder">2015-07-06</span>\n\t\t\t                    <span> at </span>\n\t\t\t                    <span class="bolder article-info__date">13:57</span>\n\t\t\t                </div>\n\t\t\t            </div>\n\t\t\t            <div class="one-answer__info-middle">\n\t\t\t                <div class="one-answer__text">' + answerCommentText + '</div>\n\t\t\t            </div>\n\t\t\t        </div>\n\t\t\t    </div>\n\t\t\t</div>\n    \t\t';
      }
    }

    var renderString = '\n    <div class="one-comment__wrap">\n\t    <div class="one-comment__box clearfix">\n\t        <div class="one-comment__avatar-wrap">\n\t            <div class="comments-avatar avatar--big my-avatar">\n\t                <img src=" ' + avatar + ' " alt="Avatar of author">\n\t            </div>\n\t        </div>\n\t        <div class="one-comment__right-wrap">\n\t        \t<input type="hidden" name="commentId" value="' + commentId + '">\n\t            <div class="one-comment__info">\n\t                <div class="one-comment__info-top">\n\t                    <div class="comment-top__item one-comment__author bolder">' + name + '</div>\n\t                    <div class="comment-top__item one-comment__date-wrap">\n\t                        <i class="fa fa-clock-o"></i>\n\t                        <span class="bolder">2015-07-06</span>\n\t                        <span> at</span>\n\t                        <span class="bolder article-info__date">13:59</span>\n\t                    </div>\n\t                </div>\n\t                <div class="one-comment__info-middle">\n\t                    <div class="one-comment__text">' + commentText + '</div>\n\t                    <textarea class="one-comment__textarea hidden">' + commentText + '</textarea>\n                            <div class="one-comment__edit-items hidden">\n                                <button class="one-comment__edit-cancel">&#10005; Cancel</button>\n                                <button class="one-comment__edit-confirm accent-btn">Save</button>\n                            </div>\n\t                </div>\n\t                <div class="one-comment__info-bottom">\n\t                \t' + (authorId === myAuthorId ? '<button class="one-comment__edit-wrap one-comment__info-item">\n                                                    <i class="fa fa-pencil-square-o"></i>Edit</button>\n                                                <button class="one-comment__delete-wrap one-comment__info-item">\n                                                    <i class="fa fa-times"></i>Delete</button>' : '') + '\n\t                    <button class="one-comment__reply-wrap one-comment__info-item">\n\t                        <i class="fa fa-reply"></i>Reply</button>\n\t                </div>\n\t            </div>\n\t            <div class="answers-wrap"> ' + answersString + ' </div>\n\t        </div>\n\t    </div>\n\t</div>';

    $('.all-comments__wrap').append(renderString);
  }

  // Ajax Handler
  var ajaxRequest = function ajaxRequest(options) {
    var url = options.url || '/';
    var method = options.method || 'GET';
    var callback = options.callback || function () {};
    var data = options.data || {};
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.open(method, url, true);
    xmlHttp.setRequestHeader('Content-Type', 'application/json');
    xmlHttp.send(JSON.stringify(data));

    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.status === 200 && xmlHttp.readyState === 4) {
        callback(xmlHttp.responseText);
      }
    };
  };

  var commentsBlock = $('.all-comments__wrap');
  var currentOffset = 0;
  var currentComments = 0;
  var ajaxUrl = 'http://frontend-test.pingbull.com/pages/noobbaster@gmail.com/comments/';

  //Load 5 more - behavior and button
  var getFiveComments = function getFiveComments() {
    ajaxRequest({
      url: ajaxUrl + '?count=5&offset=' + currentOffset,
      callback: function callback(respData) {
        console.log(JSON.parse(respData));
        JSON.parse(respData).forEach(function (item, ind) {
          renderOneComment(item);
        });
      }
    });
    currentOffset += 5;
    currentComments += 5;
  };

  var loadMoreBtn = $('.load-more__btn');
  loadMoreBtn.on('click', function () {
    getFiveComments();
  });

  //Get comments to rerender
  var getComments = function getComments(amount) {
    ajaxRequest({
      url: ajaxUrl + '?count=' + amount + '&offset=0',
      callback: function callback(respData) {
        console.log(JSON.parse(respData));
        JSON.parse(respData).forEach(function (item, ind) {
          renderOneComment(item);
        });
      }
    });
  };

  //Get last comment
  var getLastComment = function getLastComment() {
    ajaxRequest({
      url: ajaxUrl + '?count=1',
      callback: function callback(respData) {
        console.log(JSON.parse(respData));
      }
    });
  };

  //JQuery junction for 'post', to have a callback
  $(".leave-comment__form").on('submit', function (e) {
    e.preventDefault();
    var leaveCommentText = $('.leave-comment__textarea').val();
    if (leaveCommentText != '') {
      $.post(ajaxUrl, {
        content: leaveCommentText
      }, function (data, status) {
        console.log("Data: " + data + "Status: " + status);
        getLastComment();
      });
    }
    $('.leave-comment__textarea').val('');
  });

  // Delete comment
  var deleteComment = function deleteComment(id) {
    ajaxRequest({
      url: ajaxUrl + id,
      method: 'POST',
      data: {
        _method: 'DELETE'
      },
      callback: function callback(respData) {
        console.log(JSON.parse(respData));
      }
    });
  };

  $('body').on('click', '.one-comment__delete-wrap', function (e) {
    e.preventDefault();
    var commentId = $(this).closest('.one-comment__right-wrap').find('input[name="commentId"]').val();
    console.log(commentId);

    deleteComment(commentId);
  });

  //Edit comment
  var editComment = function editComment(id, text) {
    console.log(id);
    console.log(text);
    ajaxRequest({
      url: ajaxUrl + id,
      method: 'PUT',
      data: {
        content: text
      },
      callback: function callback(respData) {
        console.log(JSON.parse(respData));
        getComments(currentComments);
      }
    });
  };

  $('body').on('click', '.one-comment__edit-wrap, .one-comment__edit-cancel', function (e) {
    e.preventDefault();
    var textBlock = $(this).closest('.one-comment__info').find('.one-comment__text');
    var textareaBlock = $(this).closest('.one-comment__info').find('.one-comment__textarea');
    var btnsBlock = $(this).closest('.one-comment__info').find('.one-comment__edit-items');

    $.each([textBlock, textareaBlock, btnsBlock], function (index, value) {
      value.toggleClass('hidden');
    });
  });

  $('body').on('click', '.one-comment__edit-confirm', function (e) {
    e.preventDefault();
    var commentId = $(this).closest('.one-comment__right-wrap').find('input[name="commentId"]').val();
    var text = $(this).closest('.one-comment__info').find('.one-comment__textarea').val();

    editComment(commentId, text);
    $('.all-comments__wrap').html("");
  });

  if (document.body.classList.contains('only-ajax-comments')) {
    getFiveComments();
  }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcGxpY2F0aW9uLmpzIl0sIm5hbWVzIjpbIiQiLCJkb2N1bWVudCIsInJlYWR5IiwibWFnbmlmaWNQb3B1cCIsInR5cGUiLCJjbG9zZU9uQ29udGVudENsaWNrIiwibWFpbkNsYXNzIiwiaW1hZ2UiLCJ2ZXJ0aWNhbEZpdCIsIm9uIiwiZSIsImNvbW1lbnRzT2ZmVG9wIiwib2Zmc2V0IiwidG9wIiwicHJldmVudERlZmF1bHQiLCJzdG9wIiwiYW5pbWF0ZSIsInNjcm9sbFRvcCIsIm15QXV0aG9ySWQiLCJyZW5kZXJPbmVDb21tZW50IiwiY29tbWVudE9iaiIsIm5hbWUiLCJhdXRob3IiLCJjb21tZW50VGV4dCIsImNvbnRlbnQiLCJhdmF0YXIiLCJjb21tZW50SWQiLCJpZCIsImF1dGhvcklkIiwiYW5zd2Vyc1N0cmluZyIsImNoaWxkcmVuIiwibGVuZ3RoIiwiaSIsImFuc3dlck5hbWUiLCJhbnN3ZXJDb21tZW50VGV4dCIsImFuc3dlckF2YXRhciIsInJlbmRlclN0cmluZyIsImFwcGVuZCIsImFqYXhSZXF1ZXN0Iiwib3B0aW9ucyIsInVybCIsIm1ldGhvZCIsImNhbGxiYWNrIiwiZGF0YSIsInhtbEh0dHAiLCJYTUxIdHRwUmVxdWVzdCIsIm9wZW4iLCJzZXRSZXF1ZXN0SGVhZGVyIiwic2VuZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJzdGF0dXMiLCJyZWFkeVN0YXRlIiwicmVzcG9uc2VUZXh0IiwiY29tbWVudHNCbG9jayIsImN1cnJlbnRPZmZzZXQiLCJjdXJyZW50Q29tbWVudHMiLCJhamF4VXJsIiwiZ2V0Rml2ZUNvbW1lbnRzIiwicmVzcERhdGEiLCJjb25zb2xlIiwibG9nIiwicGFyc2UiLCJmb3JFYWNoIiwiaXRlbSIsImluZCIsImxvYWRNb3JlQnRuIiwiZ2V0Q29tbWVudHMiLCJhbW91bnQiLCJnZXRMYXN0Q29tbWVudCIsImxlYXZlQ29tbWVudFRleHQiLCJ2YWwiLCJwb3N0IiwiZGVsZXRlQ29tbWVudCIsIl9tZXRob2QiLCJjbG9zZXN0IiwiZmluZCIsImVkaXRDb21tZW50IiwidGV4dCIsInRleHRCbG9jayIsInRleHRhcmVhQmxvY2siLCJidG5zQmxvY2siLCJlYWNoIiwiaW5kZXgiLCJ2YWx1ZSIsInRvZ2dsZUNsYXNzIiwiaHRtbCIsImJvZHkiLCJjbGFzc0xpc3QiLCJjb250YWlucyJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBQSxFQUFFQyxRQUFGLEVBQVlDLEtBQVosQ0FBa0IsWUFBVzs7QUFFM0I7QUFDQUYsSUFBRSx1QkFBRixFQUEyQkcsYUFBM0IsQ0FBeUM7QUFDdkNDLFVBQU0sT0FEaUM7QUFFdkNDLHlCQUFxQixJQUZrQjtBQUd2Q0MsZUFBVyxnQkFINEI7QUFJdkNDLFdBQU87QUFDTEMsbUJBQWE7QUFEUjs7QUFKZ0MsR0FBekM7O0FBVUE7QUFDQVIsSUFBRSx5QkFBRixFQUE2QlMsRUFBN0IsQ0FBZ0MsT0FBaEMsRUFBeUMsVUFBU0MsQ0FBVCxFQUFZO0FBQ25ELFFBQUlDLGlCQUFpQlgsRUFBRSxnQkFBRixFQUFvQlksTUFBcEIsR0FBNkJDLEdBQWxEO0FBQ0FILE1BQUVJLGNBQUY7QUFDQWQsTUFBRSxZQUFGLEVBQWdCZSxJQUFoQixHQUF1QkMsT0FBdkIsQ0FBK0IsRUFBRUMsV0FBV04sY0FBYixFQUEvQixFQUE4RCxHQUE5RDtBQUNELEdBSkQ7O0FBTUEsTUFBSU8sYUFBYSxDQUFqQjs7QUFFQTtBQUNBLFdBQVNDLGdCQUFULENBQTBCQyxVQUExQixFQUFzQztBQUNwQyxRQUFJQyxPQUFPRCxXQUFXRSxNQUFYLENBQWtCRCxJQUE3QjtBQUNBLFFBQUlFLGNBQWNILFdBQVdJLE9BQTdCO0FBQ0EsUUFBSUMsU0FBU0wsV0FBV0UsTUFBWCxDQUFrQkcsTUFBL0I7QUFDQSxRQUFJQyxZQUFZTixXQUFXTyxFQUEzQjtBQUNBLFFBQUlDLFdBQVdSLFdBQVdFLE1BQVgsQ0FBa0JLLEVBQWpDOztBQUVBLFFBQUlFLGdCQUFnQixFQUFwQjtBQUNBLFFBQUlULFdBQVdVLFFBQVgs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LGdCQUFnQmpGLEVBQUUsSUFBRixFQUFRNEUsT0FBUixDQUFnQixvQkFBaEIsRUFBc0NDLElBQXRDLENBQTJDLHdCQUEzQyxDQUFwQjtBQUNBLFFBQUlLLFlBQVlsRixFQUFFLElBQUYsRUFBUTRFLE9BQVIsQ0FBZ0Isb0JBQWhCLEVBQXNDQyxJQUF0QyxDQUEyQywwQkFBM0MsQ0FBaEI7O0FBRUE3RSxNQUFFbUYsSUFBRixDQUFPLENBQUNILFNBQUQsRUFBWUMsYUFBWixFQUEyQkMsU0FBM0IsQ0FBUCxFQUE4QyxVQUFTRSxLQUFULEVBQWdCQyxLQUFoQixFQUF1QjtBQUNuRUEsWUFBTUMsV0FBTixDQUFrQixRQUFsQjtBQUNELEtBRkQ7QUFHRCxHQVREOztBQVdBdEYsSUFBRSxNQUFGLEVBQVVTLEVBQVYsQ0FBYSxPQUFiLEVBQXNCLDRCQUF0QixFQUFvRCxVQUFTQyxDQUFULEVBQVk7QUFDOURBLE1BQUVJLGNBQUY7QUFDQSxRQUFJWSxZQUFZMUIsRUFBRSxJQUFGLEVBQVE0RSxPQUFSLENBQWdCLDBCQUFoQixFQUE0Q0MsSUFBNUMsQ0FBaUQseUJBQWpELEVBQTRFTCxHQUE1RSxFQUFoQjtBQUNBLFFBQUlPLE9BQU8vRSxFQUFFLElBQUYsRUFBUTRFLE9BQVIsQ0FBZ0Isb0JBQWhCLEVBQXNDQyxJQUF0QyxDQUEyQyx3QkFBM0MsRUFBcUVMLEdBQXJFLEVBQVg7O0FBRUFNLGdCQUFZcEQsU0FBWixFQUF1QnFELElBQXZCO0FBQ0EvRSxNQUFFLHFCQUFGLEVBQXlCdUYsSUFBekIsQ0FBOEIsRUFBOUI7QUFDRCxHQVBEOztBQVNBLE1BQUl0RixTQUFTdUYsSUFBVCxDQUFjQyxTQUFkLENBQXdCQyxRQUF4QixDQUFpQyxvQkFBakMsQ0FBSixFQUE0RDtBQUMxRC9CO0FBQ0Q7QUFDRixDQXJRRCIsImZpbGUiOiJhcHBsaWNhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIjtcclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XHJcblxyXG4gIC8vIE1hZ25pZmljIHBvcHVwXHJcbiAgJCgnLndpdGgtaW1nIC5mbG9hdC1saW5rJykubWFnbmlmaWNQb3B1cCh7XHJcbiAgICB0eXBlOiAnaW1hZ2UnLFxyXG4gICAgY2xvc2VPbkNvbnRlbnRDbGljazogdHJ1ZSxcclxuICAgIG1haW5DbGFzczogJ21mcC1pbWctbW9iaWxlJyxcclxuICAgIGltYWdlOiB7XHJcbiAgICAgIHZlcnRpY2FsRml0OiB0cnVlXHJcbiAgICB9XHJcblxyXG4gIH0pO1xyXG5cclxuICAvLyBTY3JvbGwgdG8gY29tbWVudHNcclxuICAkKCcuYXJ0aWNsZS1pbmZvX19jb21tZW50cycpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgIHZhciBjb21tZW50c09mZlRvcCA9ICQoJy5jb21tZW50cy13cmFwJykub2Zmc2V0KCkudG9wO1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgJCgnaHRtbCwgYm9keScpLnN0b3AoKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiBjb21tZW50c09mZlRvcCB9LCA0MDApXHJcbiAgfSlcclxuXHJcbiAgdmFyIG15QXV0aG9ySWQgPSAxO1xyXG5cclxuICAvL0VTMjAxNSBTdHJpbmcgTGl0ZXJhbCBmb3IgYXZvaWRpbmcgc29tZSBtZXNzXHJcbiAgZnVuY3Rpb24gcmVuZGVyT25lQ29tbWVudChjb21tZW50T2JqKSB7XHJcbiAgICB2YXIgbmFtZSA9IGNvbW1lbnRPYmouYXV0aG9yLm5hbWU7XHJcbiAgICB2YXIgY29tbWVudFRleHQgPSBjb21tZW50T2JqLmNvbnRlbnQ7XHJcbiAgICB2YXIgYXZhdGFyID0gY29tbWVudE9iai5hdXRob3IuYXZhdGFyO1xyXG4gICAgdmFyIGNvbW1lbnRJZCA9IGNvbW1lbnRPYmouaWQ7XHJcbiAgICB2YXIgYXV0aG9ySWQgPSBjb21tZW50T2JqLmF1dGhvci5pZDtcclxuXHJcbiAgICB2YXIgYW5zd2Vyc1N0cmluZyA9ICcnO1xyXG4gICAgaWYgKGNvbW1lbnRPYmouY2hpbGRyZW4ubGVuZ3RoKSB7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29tbWVudE9iai5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBhbnN3ZXJOYW1lID0gY29tbWVudE9iai5jaGlsZHJlbltpXS5hdXRob3IubmFtZTtcclxuICAgICAgICB2YXIgYW5zd2VyQ29tbWVudFRleHQgPSBjb21tZW50T2JqLmNoaWxkcmVuW2ldLmNvbnRlbnQ7XHJcbiAgICAgICAgdmFyIGFuc3dlckF2YXRhciA9IGNvbW1lbnRPYmouY2hpbGRyZW5baV0uYXV0aG9yLmF2YXRhcjtcclxuICAgICAgICBhbnN3ZXJzU3RyaW5nICs9IGBcclxuXHRcdFx0PGRpdiBjbGFzcz1cIm9uZS1hbnN3ZXJfX3dyYXAgY2xlYXJmaXhcIj5cclxuXHRcdFx0ICAgIDxkaXYgY2xhc3M9XCJvbmUtYW5zd2VyX19hdmF0YXItd3JhcFwiPlxyXG5cdFx0XHQgICAgICAgIDxkaXYgY2xhc3M9XCJjb21tZW50cy1hdmF0YXJcIj5cclxuXHRcdFx0ICAgICAgICAgICAgPGltZyBzcmM9XCIke2Fuc3dlckF2YXRhcn1cIiBhbHQ9XCJBdmF0YXIgb2YgYXV0aG9yXCI+XHJcblx0XHRcdCAgICAgICAgPC9kaXY+XHJcblx0XHRcdCAgICA8L2Rpdj5cclxuXHRcdFx0ICAgIDxkaXYgY2xhc3M9XCJvbmUtYW5zd2VyX19yaWdodC13cmFwXCI+XHJcblx0XHRcdCAgICAgICAgPGRpdiBjbGFzcz1cIm9uZS1hbnN3ZXJfX2luZm9cIj5cclxuXHRcdFx0ICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm9uZS1hbnN3ZXJfX2luZm8tdG9wXCI+XHJcblx0XHRcdCAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYW5zd2VyLXRvcF9faXRlbSBvbmUtYW5zd2VyX19hdXRob3IgYm9sZGVyXCI+JHthbnN3ZXJOYW1lfTwvZGl2PlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFuc3dlci10b3BfX2l0ZW0gb25lLWFuc3dlcl9fd2hvbVwiPlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtcmVwbHlcIj48L2k+XHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgPHNwYW4+S3VyayBUaG9tcHNvbjwvc3Bhbj5cclxuXHRcdFx0ICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFuc3dlci10b3BfX2l0ZW0gb25lLWFuc3dlcl9fZGF0ZS13cmFwXCI+XHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1jbG9jay1vXCI+PC9pPlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYm9sZGVyXCI+MjAxNS0wNy0wNjwvc3Bhbj5cclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICA8c3Bhbj4gYXQgPC9zcGFuPlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYm9sZGVyIGFydGljbGUtaW5mb19fZGF0ZVwiPjEzOjU3PC9zcGFuPlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgPC9kaXY+XHJcblx0XHRcdCAgICAgICAgICAgIDwvZGl2PlxyXG5cdFx0XHQgICAgICAgICAgICA8ZGl2IGNsYXNzPVwib25lLWFuc3dlcl9faW5mby1taWRkbGVcIj5cclxuXHRcdFx0ICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJvbmUtYW5zd2VyX190ZXh0XCI+JHthbnN3ZXJDb21tZW50VGV4dH08L2Rpdj5cclxuXHRcdFx0ICAgICAgICAgICAgPC9kaXY+XHJcblx0XHRcdCAgICAgICAgPC9kaXY+XHJcblx0XHRcdCAgICA8L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcbiAgICBcdFx0YDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZhciByZW5kZXJTdHJpbmcgPSBgXHJcbiAgICA8ZGl2IGNsYXNzPVwib25lLWNvbW1lbnRfX3dyYXBcIj5cclxuXHQgICAgPGRpdiBjbGFzcz1cIm9uZS1jb21tZW50X19ib3ggY2xlYXJmaXhcIj5cclxuXHQgICAgICAgIDxkaXYgY2xhc3M9XCJvbmUtY29tbWVudF9fYXZhdGFyLXdyYXBcIj5cclxuXHQgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29tbWVudHMtYXZhdGFyIGF2YXRhci0tYmlnIG15LWF2YXRhclwiPlxyXG5cdCAgICAgICAgICAgICAgICA8aW1nIHNyYz1cIiAke2F2YXRhcn0gXCIgYWx0PVwiQXZhdGFyIG9mIGF1dGhvclwiPlxyXG5cdCAgICAgICAgICAgIDwvZGl2PlxyXG5cdCAgICAgICAgPC9kaXY+XHJcblx0ICAgICAgICA8ZGl2IGNsYXNzPVwib25lLWNvbW1lbnRfX3JpZ2h0LXdyYXBcIj5cclxuXHQgICAgICAgIFx0PGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwiY29tbWVudElkXCIgdmFsdWU9XCIke2NvbW1lbnRJZH1cIj5cclxuXHQgICAgICAgICAgICA8ZGl2IGNsYXNzPVwib25lLWNvbW1lbnRfX2luZm9cIj5cclxuXHQgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm9uZS1jb21tZW50X19pbmZvLXRvcFwiPlxyXG5cdCAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbW1lbnQtdG9wX19pdGVtIG9uZS1jb21tZW50X19hdXRob3IgYm9sZGVyXCI+JHtuYW1lfTwvZGl2PlxyXG5cdCAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbW1lbnQtdG9wX19pdGVtIG9uZS1jb21tZW50X19kYXRlLXdyYXBcIj5cclxuXHQgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWNsb2NrLW9cIj48L2k+XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJib2xkZXJcIj4yMDE1LTA3LTA2PC9zcGFuPlxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPiBhdDwvc3Bhbj5cclxuXHQgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImJvbGRlciBhcnRpY2xlLWluZm9fX2RhdGVcIj4xMzo1OTwvc3Bhbj5cclxuXHQgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cdCAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHQgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm9uZS1jb21tZW50X19pbmZvLW1pZGRsZVwiPlxyXG5cdCAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm9uZS1jb21tZW50X190ZXh0XCI+JHtjb21tZW50VGV4dH08L2Rpdj5cclxuXHQgICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBjbGFzcz1cIm9uZS1jb21tZW50X190ZXh0YXJlYSBoaWRkZW5cIj4ke2NvbW1lbnRUZXh0fTwvdGV4dGFyZWE+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwib25lLWNvbW1lbnRfX2VkaXQtaXRlbXMgaGlkZGVuXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cIm9uZS1jb21tZW50X19lZGl0LWNhbmNlbFwiPiYjMTAwMDU7IENhbmNlbDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJvbmUtY29tbWVudF9fZWRpdC1jb25maXJtIGFjY2VudC1idG5cIj5TYXZlPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHQgICAgICAgICAgICAgICAgPC9kaXY+XHJcblx0ICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJvbmUtY29tbWVudF9faW5mby1ib3R0b21cIj5cclxuXHQgICAgICAgICAgICAgICAgXHQkeyBhdXRob3JJZCA9PT0gbXlBdXRob3JJZCA/IGA8YnV0dG9uIGNsYXNzPVwib25lLWNvbW1lbnRfX2VkaXQtd3JhcCBvbmUtY29tbWVudF9faW5mby1pdGVtXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXBlbmNpbC1zcXVhcmUtb1wiPjwvaT5FZGl0PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJvbmUtY29tbWVudF9fZGVsZXRlLXdyYXAgb25lLWNvbW1lbnRfX2luZm8taXRlbVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS10aW1lc1wiPjwvaT5EZWxldGU8L2J1dHRvbj5gOiBgYCB9XHJcblx0ICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwib25lLWNvbW1lbnRfX3JlcGx5LXdyYXAgb25lLWNvbW1lbnRfX2luZm8taXRlbVwiPlxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtcmVwbHlcIj48L2k+UmVwbHk8L2J1dHRvbj5cclxuXHQgICAgICAgICAgICAgICAgPC9kaXY+XHJcblx0ICAgICAgICAgICAgPC9kaXY+XHJcblx0ICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFuc3dlcnMtd3JhcFwiPiAke2Fuc3dlcnNTdHJpbmd9IDwvZGl2PlxyXG5cdCAgICAgICAgPC9kaXY+XHJcblx0ICAgIDwvZGl2PlxyXG5cdDwvZGl2PmA7XHJcblxyXG4gICAgJCgnLmFsbC1jb21tZW50c19fd3JhcCcpLmFwcGVuZChyZW5kZXJTdHJpbmcpO1xyXG4gIH1cclxuXHJcbiAgLy8gQWpheCBIYW5kbGVyXHJcbiAgdmFyIGFqYXhSZXF1ZXN0ID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG4gICAgdmFyIHVybCA9IG9wdGlvbnMudXJsIHx8ICcvJztcclxuICAgIHZhciBtZXRob2QgPSBvcHRpb25zLm1ldGhvZCB8fCAnR0VUJztcclxuICAgIHZhciBjYWxsYmFjayA9IG9wdGlvbnMuY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcclxuICAgIHZhciBkYXRhID0gb3B0aW9ucy5kYXRhIHx8IHt9O1xyXG4gICAgdmFyIHhtbEh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHJcbiAgICB4bWxIdHRwLm9wZW4obWV0aG9kLCB1cmwsIHRydWUpO1xyXG4gICAgeG1sSHR0cC5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xyXG4gICAgeG1sSHR0cC5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxuXHJcbiAgICB4bWxIdHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICBpZiAoeG1sSHR0cC5zdGF0dXMgPT09IDIwMCAmJiB4bWxIdHRwLnJlYWR5U3RhdGUgPT09IDQpIHtcclxuICAgICAgICBjYWxsYmFjayh4bWxIdHRwLnJlc3BvbnNlVGV4dCk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfTtcclxuXHJcblxyXG4gIHZhciBjb21tZW50c0Jsb2NrID0gJCgnLmFsbC1jb21tZW50c19fd3JhcCcpO1xyXG4gIHZhciBjdXJyZW50T2Zmc2V0ID0gMDtcclxuICB2YXIgY3VycmVudENvbW1lbnRzID0gMDtcclxuICB2YXIgYWpheFVybCA9ICdodHRwOi8vZnJvbnRlbmQtdGVzdC5waW5nYnVsbC5jb20vcGFnZXMvbm9vYmJhc3RlckBnbWFpbC5jb20vY29tbWVudHMvJztcclxuXHJcbiAgLy9Mb2FkIDUgbW9yZSAtIGJlaGF2aW9yIGFuZCBidXR0b25cclxuICB2YXIgZ2V0Rml2ZUNvbW1lbnRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICBhamF4UmVxdWVzdCh7XHJcbiAgICAgIHVybDogYWpheFVybCArICc/Y291bnQ9NSZvZmZzZXQ9JyArIGN1cnJlbnRPZmZzZXQsXHJcbiAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbihyZXNwRGF0YSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKEpTT04ucGFyc2UocmVzcERhdGEpKTtcclxuICAgICAgICBKU09OLnBhcnNlKHJlc3BEYXRhKS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0sIGluZCkge1xyXG4gICAgICAgICAgcmVuZGVyT25lQ29tbWVudChpdGVtKTtcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgY3VycmVudE9mZnNldCArPSA1O1xyXG4gICAgY3VycmVudENvbW1lbnRzICs9IDU7XHJcbiAgfTtcclxuXHJcbiAgdmFyIGxvYWRNb3JlQnRuID0gJCgnLmxvYWQtbW9yZV9fYnRuJyk7XHJcbiAgbG9hZE1vcmVCdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICBnZXRGaXZlQ29tbWVudHMoKTtcclxuICB9KTtcclxuXHJcbiAgLy9HZXQgY29tbWVudHMgdG8gcmVyZW5kZXJcclxuICB2YXIgZ2V0Q29tbWVudHMgPSBmdW5jdGlvbihhbW91bnQpIHtcclxuICAgIGFqYXhSZXF1ZXN0KHtcclxuICAgICAgdXJsOiBhamF4VXJsICsgJz9jb3VudD0nICsgYW1vdW50ICsgJyZvZmZzZXQ9MCcsXHJcbiAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbihyZXNwRGF0YSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKEpTT04ucGFyc2UocmVzcERhdGEpKTtcclxuICAgICAgICBKU09OLnBhcnNlKHJlc3BEYXRhKS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0sIGluZCkge1xyXG4gICAgICAgICAgcmVuZGVyT25lQ29tbWVudChpdGVtKTtcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH07XHJcblxyXG4gIC8vR2V0IGxhc3QgY29tbWVudFxyXG4gIHZhciBnZXRMYXN0Q29tbWVudCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgYWpheFJlcXVlc3Qoe1xyXG4gICAgICB1cmw6IGFqYXhVcmwgKyAnP2NvdW50PTEnLFxyXG4gICAgICBjYWxsYmFjazogZnVuY3Rpb24ocmVzcERhdGEpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhKU09OLnBhcnNlKHJlc3BEYXRhKSk7XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfTtcclxuXHJcbiAgLy9KUXVlcnkganVuY3Rpb24gZm9yICdwb3N0JywgdG8gaGF2ZSBhIGNhbGxiYWNrXHJcbiAgJChcIi5sZWF2ZS1jb21tZW50X19mb3JtXCIpLm9uKCdzdWJtaXQnLCBmdW5jdGlvbihlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB2YXIgbGVhdmVDb21tZW50VGV4dCA9ICQoJy5sZWF2ZS1jb21tZW50X190ZXh0YXJlYScpLnZhbCgpO1xyXG4gICAgaWYgKGxlYXZlQ29tbWVudFRleHQgIT0gJycpIHtcclxuICAgICAgJC5wb3N0KGFqYXhVcmwsIHtcclxuICAgICAgICAgIGNvbnRlbnQ6IGxlYXZlQ29tbWVudFRleHRcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZ1bmN0aW9uKGRhdGEsIHN0YXR1cykge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coXCJEYXRhOiBcIiArIGRhdGEgKyBcIlN0YXR1czogXCIgKyBzdGF0dXMpO1xyXG4gICAgICAgICAgZ2V0TGFzdENvbW1lbnQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgICQoJy5sZWF2ZS1jb21tZW50X190ZXh0YXJlYScpLnZhbCgnJyk7XHJcbiAgfSk7XHJcblxyXG5cclxuICAvLyBEZWxldGUgY29tbWVudFxyXG4gIHZhciBkZWxldGVDb21tZW50ID0gZnVuY3Rpb24oaWQpIHtcclxuICAgIGFqYXhSZXF1ZXN0KHtcclxuICAgICAgdXJsOiBhamF4VXJsICsgaWQsXHJcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgX21ldGhvZDogJ0RFTEVURSdcclxuICAgICAgfSxcclxuICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKHJlc3BEYXRhKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coSlNPTi5wYXJzZShyZXNwRGF0YSkpO1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH07XHJcblxyXG4gICQoJ2JvZHknKS5vbignY2xpY2snLCAnLm9uZS1jb21tZW50X19kZWxldGUtd3JhcCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIHZhciBjb21tZW50SWQgPSAkKHRoaXMpLmNsb3Nlc3QoJy5vbmUtY29tbWVudF9fcmlnaHQtd3JhcCcpLmZpbmQoJ2lucHV0W25hbWU9XCJjb21tZW50SWRcIl0nKS52YWwoKTtcclxuICAgIGNvbnNvbGUubG9nKGNvbW1lbnRJZCk7XHJcblxyXG4gICAgZGVsZXRlQ29tbWVudChjb21tZW50SWQpO1xyXG4gIH0pXHJcblxyXG4gIC8vRWRpdCBjb21tZW50XHJcbiAgdmFyIGVkaXRDb21tZW50ID0gZnVuY3Rpb24oaWQsIHRleHQpIHtcclxuICAgIGNvbnNvbGUubG9nKGlkKTtcclxuICAgIGNvbnNvbGUubG9nKHRleHQpO1xyXG4gICAgYWpheFJlcXVlc3Qoe1xyXG4gICAgICB1cmw6IGFqYXhVcmwgKyBpZCxcclxuICAgICAgbWV0aG9kOiAnUFVUJyxcclxuICAgICAgZGF0YToge1xyXG4gICAgICAgIGNvbnRlbnQ6IHRleHQsXHJcbiAgICAgIH0sXHJcbiAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbihyZXNwRGF0YSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKEpTT04ucGFyc2UocmVzcERhdGEpKTtcclxuICAgICAgICBnZXRDb21tZW50cyhjdXJyZW50Q29tbWVudHMpO1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH07XHJcblxyXG5cclxuICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5vbmUtY29tbWVudF9fZWRpdC13cmFwLCAub25lLWNvbW1lbnRfX2VkaXQtY2FuY2VsJywgZnVuY3Rpb24oZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgdmFyIHRleHRCbG9jayA9ICQodGhpcykuY2xvc2VzdCgnLm9uZS1jb21tZW50X19pbmZvJykuZmluZCgnLm9uZS1jb21tZW50X190ZXh0Jyk7XHJcbiAgICB2YXIgdGV4dGFyZWFCbG9jayA9ICQodGhpcykuY2xvc2VzdCgnLm9uZS1jb21tZW50X19pbmZvJykuZmluZCgnLm9uZS1jb21tZW50X190ZXh0YXJlYScpO1xyXG4gICAgdmFyIGJ0bnNCbG9jayA9ICQodGhpcykuY2xvc2VzdCgnLm9uZS1jb21tZW50X19pbmZvJykuZmluZCgnLm9uZS1jb21tZW50X19lZGl0LWl0ZW1zJyk7XHJcblxyXG4gICAgJC5lYWNoKFt0ZXh0QmxvY2ssIHRleHRhcmVhQmxvY2ssIGJ0bnNCbG9ja10sIGZ1bmN0aW9uKGluZGV4LCB2YWx1ZSkge1xyXG4gICAgICB2YWx1ZS50b2dnbGVDbGFzcygnaGlkZGVuJyk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgJCgnYm9keScpLm9uKCdjbGljaycsICcub25lLWNvbW1lbnRfX2VkaXQtY29uZmlybScsIGZ1bmN0aW9uKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIHZhciBjb21tZW50SWQgPSAkKHRoaXMpLmNsb3Nlc3QoJy5vbmUtY29tbWVudF9fcmlnaHQtd3JhcCcpLmZpbmQoJ2lucHV0W25hbWU9XCJjb21tZW50SWRcIl0nKS52YWwoKTtcclxuICAgIHZhciB0ZXh0ID0gJCh0aGlzKS5jbG9zZXN0KCcub25lLWNvbW1lbnRfX2luZm8nKS5maW5kKCcub25lLWNvbW1lbnRfX3RleHRhcmVhJykudmFsKCk7XHJcblxyXG4gICAgZWRpdENvbW1lbnQoY29tbWVudElkLCB0ZXh0KTtcclxuICAgICQoJy5hbGwtY29tbWVudHNfX3dyYXAnKS5odG1sKFwiXCIpO1xyXG4gIH0pO1xyXG5cclxuICBpZiAoZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ29ubHktYWpheC1jb21tZW50cycpKSB7XHJcbiAgICBnZXRGaXZlQ29tbWVudHMoKTtcclxuICB9XHJcbn0pOyJdfQ==
