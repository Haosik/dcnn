'use strict';

;
$(document).ready(function () {

  // Scroll to comments
  var commentsOffTop = $('.comments-wrap').offset().top;
  $('.article-info__comments').on('click', function (e) {
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
    $.post(ajaxUrl, {
      content: leaveCommentText
    }, function (data, status) {
      console.log("Data: " + data + "Status: " + status);
      getLastComment();
    });
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
    ajaxRequest({
      url: ajaxUrl + id,
      method: 'POST',
      data: {
        content: text,
        _method: 'PUT'
      },
      callback: function callback(respData) {
        console.log(JSON.parse(respData));
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
    var text = $(this).closest('.one-comment__info').find('.one-comment__textarea').text;

    editComment(commentId, text);
    $('.all-comments__wrap').html("");
    getComments(currentComments);
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcGxpY2F0aW9uLmpzIl0sIm5hbWVzIjpbIiQiLCJkb2N1bWVudCIsInJlYWR5IiwiY29tbWVudHNPZmZUb3AiLCJvZmZzZXQiLCJ0b3AiLCJvbiIsImUiLCJwcmV2ZW50RGVmYXVsdCIsInN0b3AiLCJhbmltYXRlIiwic2Nyb2xsVG9wIiwibXlBdXRob3JJZCIsInJlbmRlck9uZUNvbW1lbnQiLCJjb21tZW50T2JqIiwibmFtZSIsImF1dGhvciIsImNvbW1lbnRUZXh0IiwiY29udGVudCIsImF2YXRhciIsImNvbW1lbnRJZCIsImlkIiwiYXV0aG9ySWQiLCJhbnN3ZXJzU3RyaW5nIiwiY2hpbGRyZW4iLCJsZW5ndGgiLCJpIiwiYW5zd2VyTmFtZSIsImFuc3dlckNvbW1lbnRUZXh0IiwiYW5zd2VyQXZhdGFyIiwicmVuZGVyU3RyaW5nIiwiYXBwZW5kIiwiYWpheFJlcXVlc3QiLCJvcHRpb25zIiwidXJsIiwibWV0aG9kIiwiY2FsbGJhY2siLCJkYXRhIiwieG1sSHR0cCIsIlhNTEh0dHBSZXF1ZXN0Iiwib3BlbiIsInNldFJlcXVlc3RIZWFkZXIiLCJzZW5kIiwiSlNPTiIsInN0cmluZ2lmeSIsIm9ucmVhZHlzdGF0ZWNoYW5nZSIsInN0YXR1cyIsInJlYWR5U3RhdGUiLCJyZXNwb25zZVRleHQiLCJjb21tZW50c0Jsb2NrIiwiY3VycmVudE9mZnNldCIsImN1cnJlbnRDb21tZW50cyIsImFqYXhVcmwiLCJnZXRGaXZlQ29tbWVudHMiLCJyZXNwRGF0YSIsImNvbnNvbGUiLCJsb2ciLCJwYXJzZSIsImZvckVhY2giLCJpdGVtIiwiaW5kIiwibG9hZE1vcmVCdG4iLCJnZXRDb21tZW50cyIsImFtb3VudCIsImdldExhc3RDb21tZW50IiwibGVhdmVDb21tZW50VGV4dCIsInZhbCIsInBvc3QiLCJkZWxldGVDb21tZW50IiwiX21ldGhvZCIsImNsb3Nlc3QiLCJmaW5kIiwiZWRpdENvbW1lbnQiLCJ0ZXh0IiwidGV4dEJsb2NrIiwidGV4dGFyZWFCbG9j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QUFFQyxjQUFGO0FBQ0EsUUFBSVksWUFBWXBCLEVBQUUsSUFBRixFQUFRc0UsT0FBUixDQUFnQiwwQkFBaEIsRUFBNENDLElBQTVDLENBQWlELHlCQUFqRCxFQUE0RUwsR0FBNUUsRUFBaEI7QUFDQSxRQUFJTyxPQUFPekUsRUFBRSxJQUFGLEVBQVFzRSxPQUFSLENBQWdCLG9CQUFoQixFQUFzQ0MsSUFBdEMsQ0FBMkMsd0JBQTNDLEVBQXFFRSxJQUFoRjs7QUFFQUQsZ0JBQVlwRCxTQUFaLEVBQXVCcUQsSUFBdkI7QUFDQXpFLE1BQUUscUJBQUYsRUFBeUJpRixJQUF6QixDQUE4QixFQUE5QjtBQUNBbkIsZ0JBQVlYLGVBQVo7QUFDRCxHQVJEO0FBV0QsQ0FwUEQiLCJmaWxlIjoiYXBwbGljYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyI7XHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xyXG5cclxuICAvLyBTY3JvbGwgdG8gY29tbWVudHNcclxuICB2YXIgY29tbWVudHNPZmZUb3AgPSAkKCcuY29tbWVudHMtd3JhcCcpLm9mZnNldCgpLnRvcDtcclxuICAkKCcuYXJ0aWNsZS1pbmZvX19jb21tZW50cycpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICQoJ2h0bWwsIGJvZHknKS5zdG9wKCkuYW5pbWF0ZSh7IHNjcm9sbFRvcDogY29tbWVudHNPZmZUb3AgfSwgNDAwKVxyXG4gIH0pXHJcblxyXG4gIHZhciBteUF1dGhvcklkID0gMTtcclxuXHJcbiAgLy9FUzIwMTUgU3RyaW5nIExpdGVyYWwgZm9yIGF2b2lkaW5nIHNvbWUgbWVzc1xyXG4gIGZ1bmN0aW9uIHJlbmRlck9uZUNvbW1lbnQoY29tbWVudE9iaikge1xyXG4gICAgdmFyIG5hbWUgPSBjb21tZW50T2JqLmF1dGhvci5uYW1lO1xyXG4gICAgdmFyIGNvbW1lbnRUZXh0ID0gY29tbWVudE9iai5jb250ZW50O1xyXG4gICAgdmFyIGF2YXRhciA9IGNvbW1lbnRPYmouYXV0aG9yLmF2YXRhcjtcclxuICAgIHZhciBjb21tZW50SWQgPSBjb21tZW50T2JqLmlkO1xyXG4gICAgdmFyIGF1dGhvcklkID0gY29tbWVudE9iai5hdXRob3IuaWQ7XHJcblxyXG4gICAgdmFyIGFuc3dlcnNTdHJpbmcgPSAnJztcclxuICAgIGlmIChjb21tZW50T2JqLmNoaWxkcmVuLmxlbmd0aCkge1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbW1lbnRPYmouY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgYW5zd2VyTmFtZSA9IGNvbW1lbnRPYmouY2hpbGRyZW5baV0uYXV0aG9yLm5hbWU7XHJcbiAgICAgICAgdmFyIGFuc3dlckNvbW1lbnRUZXh0ID0gY29tbWVudE9iai5jaGlsZHJlbltpXS5jb250ZW50O1xyXG4gICAgICAgIHZhciBhbnN3ZXJBdmF0YXIgPSBjb21tZW50T2JqLmNoaWxkcmVuW2ldLmF1dGhvci5hdmF0YXI7XHJcbiAgICAgICAgYW5zd2Vyc1N0cmluZyArPSBgXHJcblx0XHRcdDxkaXYgY2xhc3M9XCJvbmUtYW5zd2VyX193cmFwIGNsZWFyZml4XCI+XHJcblx0XHRcdCAgICA8ZGl2IGNsYXNzPVwib25lLWFuc3dlcl9fYXZhdGFyLXdyYXBcIj5cclxuXHRcdFx0ICAgICAgICA8ZGl2IGNsYXNzPVwiY29tbWVudHMtYXZhdGFyXCI+XHJcblx0XHRcdCAgICAgICAgICAgIDxpbWcgc3JjPVwiJHthbnN3ZXJBdmF0YXJ9XCIgYWx0PVwiQXZhdGFyIG9mIGF1dGhvclwiPlxyXG5cdFx0XHQgICAgICAgIDwvZGl2PlxyXG5cdFx0XHQgICAgPC9kaXY+XHJcblx0XHRcdCAgICA8ZGl2IGNsYXNzPVwib25lLWFuc3dlcl9fcmlnaHQtd3JhcFwiPlxyXG5cdFx0XHQgICAgICAgIDxkaXYgY2xhc3M9XCJvbmUtYW5zd2VyX19pbmZvXCI+XHJcblx0XHRcdCAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJvbmUtYW5zd2VyX19pbmZvLXRvcFwiPlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFuc3dlci10b3BfX2l0ZW0gb25lLWFuc3dlcl9fYXV0aG9yIGJvbGRlclwiPiR7YW5zd2VyTmFtZX08L2Rpdj5cclxuXHRcdFx0ICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhbnN3ZXItdG9wX19pdGVtIG9uZS1hbnN3ZXJfX3dob21cIj5cclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXJlcGx5XCI+PC9pPlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgIDxzcGFuPkt1cmsgVGhvbXBzb248L3NwYW4+XHJcblx0XHRcdCAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHRcdFx0ICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhbnN3ZXItdG9wX19pdGVtIG9uZS1hbnN3ZXJfX2RhdGUtd3JhcFwiPlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtY2xvY2stb1wiPjwvaT5cclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImJvbGRlclwiPjIwMTUtMDctMDY8L3NwYW4+XHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgPHNwYW4+IGF0IDwvc3Bhbj5cclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImJvbGRlciBhcnRpY2xlLWluZm9fX2RhdGVcIj4xMzo1Nzwvc3Bhbj5cclxuXHRcdFx0ICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cdFx0XHQgICAgICAgICAgICA8L2Rpdj5cclxuXHRcdFx0ICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm9uZS1hbnN3ZXJfX2luZm8tbWlkZGxlXCI+XHJcblx0XHRcdCAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwib25lLWFuc3dlcl9fdGV4dFwiPiR7YW5zd2VyQ29tbWVudFRleHR9PC9kaXY+XHJcblx0XHRcdCAgICAgICAgICAgIDwvZGl2PlxyXG5cdFx0XHQgICAgICAgIDwvZGl2PlxyXG5cdFx0XHQgICAgPC9kaXY+XHJcblx0XHRcdDwvZGl2PlxyXG4gICAgXHRcdGA7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2YXIgcmVuZGVyU3RyaW5nID0gYFxyXG4gICAgPGRpdiBjbGFzcz1cIm9uZS1jb21tZW50X193cmFwXCI+XHJcblx0ICAgIDxkaXYgY2xhc3M9XCJvbmUtY29tbWVudF9fYm94IGNsZWFyZml4XCI+XHJcblx0ICAgICAgICA8ZGl2IGNsYXNzPVwib25lLWNvbW1lbnRfX2F2YXRhci13cmFwXCI+XHJcblx0ICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbW1lbnRzLWF2YXRhciBhdmF0YXItLWJpZyBteS1hdmF0YXJcIj5cclxuXHQgICAgICAgICAgICAgICAgPGltZyBzcmM9XCIgJHthdmF0YXJ9IFwiIGFsdD1cIkF2YXRhciBvZiBhdXRob3JcIj5cclxuXHQgICAgICAgICAgICA8L2Rpdj5cclxuXHQgICAgICAgIDwvZGl2PlxyXG5cdCAgICAgICAgPGRpdiBjbGFzcz1cIm9uZS1jb21tZW50X19yaWdodC13cmFwXCI+XHJcblx0ICAgICAgICBcdDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImNvbW1lbnRJZFwiIHZhbHVlPVwiJHtjb21tZW50SWR9XCI+XHJcblx0ICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm9uZS1jb21tZW50X19pbmZvXCI+XHJcblx0ICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJvbmUtY29tbWVudF9faW5mby10b3BcIj5cclxuXHQgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb21tZW50LXRvcF9faXRlbSBvbmUtY29tbWVudF9fYXV0aG9yIGJvbGRlclwiPiR7bmFtZX08L2Rpdj5cclxuXHQgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb21tZW50LXRvcF9faXRlbSBvbmUtY29tbWVudF9fZGF0ZS13cmFwXCI+XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1jbG9jay1vXCI+PC9pPlxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYm9sZGVyXCI+MjAxNS0wNy0wNjwvc3Bhbj5cclxuXHQgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj4gYXQ8L3NwYW4+XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJib2xkZXIgYXJ0aWNsZS1pbmZvX19kYXRlXCI+MTM6NTk8L3NwYW4+XHJcblx0ICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHQgICAgICAgICAgICAgICAgPC9kaXY+XHJcblx0ICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJvbmUtY29tbWVudF9faW5mby1taWRkbGVcIj5cclxuXHQgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJvbmUtY29tbWVudF9fdGV4dFwiPiR7Y29tbWVudFRleHR9PC9kaXY+XHJcblx0ICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgY2xhc3M9XCJvbmUtY29tbWVudF9fdGV4dGFyZWEgaGlkZGVuXCI+JHtjb21tZW50VGV4dH08L3RleHRhcmVhPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm9uZS1jb21tZW50X19lZGl0LWl0ZW1zIGhpZGRlblwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJvbmUtY29tbWVudF9fZWRpdC1jYW5jZWxcIj4mIzEwMDA1OyBDYW5jZWw8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwib25lLWNvbW1lbnRfX2VkaXQtY29uZmlybSBhY2NlbnQtYnRuXCI+U2F2ZTwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblx0ICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cdCAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwib25lLWNvbW1lbnRfX2luZm8tYm90dG9tXCI+XHJcblx0ICAgICAgICAgICAgICAgIFx0JHsgYXV0aG9ySWQgPT09IG15QXV0aG9ySWQgPyBgPGJ1dHRvbiBjbGFzcz1cIm9uZS1jb21tZW50X19lZGl0LXdyYXAgb25lLWNvbW1lbnRfX2luZm8taXRlbVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1wZW5jaWwtc3F1YXJlLW9cIj48L2k+RWRpdDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwib25lLWNvbW1lbnRfX2RlbGV0ZS13cmFwIG9uZS1jb21tZW50X19pbmZvLWl0ZW1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtdGltZXNcIj48L2k+RGVsZXRlPC9idXR0b24+YDogYGAgfVxyXG5cdCAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cIm9uZS1jb21tZW50X19yZXBseS13cmFwIG9uZS1jb21tZW50X19pbmZvLWl0ZW1cIj5cclxuXHQgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXJlcGx5XCI+PC9pPlJlcGx5PC9idXR0b24+XHJcblx0ICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cdCAgICAgICAgICAgIDwvZGl2PlxyXG5cdCAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhbnN3ZXJzLXdyYXBcIj4gJHthbnN3ZXJzU3RyaW5nfSA8L2Rpdj5cclxuXHQgICAgICAgIDwvZGl2PlxyXG5cdCAgICA8L2Rpdj5cclxuXHQ8L2Rpdj5gO1xyXG5cclxuICAgICQoJy5hbGwtY29tbWVudHNfX3dyYXAnKS5hcHBlbmQocmVuZGVyU3RyaW5nKTtcclxuICB9XHJcblxyXG4gIC8vIEFqYXggSGFuZGxlclxyXG4gIHZhciBhamF4UmVxdWVzdCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuICAgIHZhciB1cmwgPSBvcHRpb25zLnVybCB8fCAnLyc7XHJcbiAgICB2YXIgbWV0aG9kID0gb3B0aW9ucy5tZXRob2QgfHwgJ0dFVCc7XHJcbiAgICB2YXIgY2FsbGJhY2sgPSBvcHRpb25zLmNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XHJcbiAgICB2YXIgZGF0YSA9IG9wdGlvbnMuZGF0YSB8fCB7fTtcclxuICAgIHZhciB4bWxIdHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblxyXG4gICAgeG1sSHR0cC5vcGVuKG1ldGhvZCwgdXJsLCB0cnVlKTtcclxuICAgIHhtbEh0dHAuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcclxuICAgIHhtbEh0dHAuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcblxyXG4gICAgeG1sSHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuICAgICAgaWYgKHhtbEh0dHAuc3RhdHVzID09PSAyMDAgJiYgeG1sSHR0cC5yZWFkeVN0YXRlID09PSA0KSB7XHJcbiAgICAgICAgY2FsbGJhY2soeG1sSHR0cC5yZXNwb25zZVRleHQpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH07XHJcblxyXG5cclxuICB2YXIgY29tbWVudHNCbG9jayA9ICQoJy5hbGwtY29tbWVudHNfX3dyYXAnKTtcclxuICB2YXIgY3VycmVudE9mZnNldCA9IDA7XHJcbiAgdmFyIGN1cnJlbnRDb21tZW50cyA9IDA7XHJcbiAgdmFyIGFqYXhVcmwgPSAnaHR0cDovL2Zyb250ZW5kLXRlc3QucGluZ2J1bGwuY29tL3BhZ2VzL25vb2JiYXN0ZXJAZ21haWwuY29tL2NvbW1lbnRzLyc7XHJcblxyXG4gIC8vTG9hZCA1IG1vcmUgLSBiZWhhdmlvciBhbmQgYnV0dG9uXHJcbiAgdmFyIGdldEZpdmVDb21tZW50cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgYWpheFJlcXVlc3Qoe1xyXG4gICAgICB1cmw6IGFqYXhVcmwgKyAnP2NvdW50PTUmb2Zmc2V0PScgKyBjdXJyZW50T2Zmc2V0LFxyXG4gICAgICBjYWxsYmFjazogZnVuY3Rpb24ocmVzcERhdGEpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhKU09OLnBhcnNlKHJlc3BEYXRhKSk7XHJcbiAgICAgICAgSlNPTi5wYXJzZShyZXNwRGF0YSkuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpbmQpIHtcclxuICAgICAgICAgIHJlbmRlck9uZUNvbW1lbnQoaXRlbSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIGN1cnJlbnRPZmZzZXQgKz0gNTtcclxuICAgIGN1cnJlbnRDb21tZW50cyArPSA1O1xyXG4gIH07XHJcblxyXG4gIHZhciBsb2FkTW9yZUJ0biA9ICQoJy5sb2FkLW1vcmVfX2J0bicpO1xyXG4gIGxvYWRNb3JlQnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICAgZ2V0Rml2ZUNvbW1lbnRzKCk7XHJcbiAgfSk7XHJcblxyXG4gIC8vR2V0IGNvbW1lbnRzIHRvIHJlcmVuZGVyXHJcbiAgdmFyIGdldENvbW1lbnRzID0gZnVuY3Rpb24oYW1vdW50KSB7XHJcbiAgICBhamF4UmVxdWVzdCh7XHJcbiAgICAgIHVybDogYWpheFVybCArICc/Y291bnQ9JyArIGFtb3VudCArICcmb2Zmc2V0PTAnLFxyXG4gICAgICBjYWxsYmFjazogZnVuY3Rpb24ocmVzcERhdGEpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhKU09OLnBhcnNlKHJlc3BEYXRhKSk7XHJcbiAgICAgICAgSlNPTi5wYXJzZShyZXNwRGF0YSkuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpbmQpIHtcclxuICAgICAgICAgIHJlbmRlck9uZUNvbW1lbnQoaXRlbSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9O1xyXG5cclxuICAvL0dldCBsYXN0IGNvbW1lbnRcclxuICB2YXIgZ2V0TGFzdENvbW1lbnQgPSBmdW5jdGlvbigpIHtcclxuICAgIGFqYXhSZXF1ZXN0KHtcclxuICAgICAgdXJsOiBhamF4VXJsICsgJz9jb3VudD0xJyxcclxuICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKHJlc3BEYXRhKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coSlNPTi5wYXJzZShyZXNwRGF0YSkpO1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH07XHJcblxyXG4gIC8vSlF1ZXJ5IGp1bmN0aW9uIGZvciAncG9zdCcsIHRvIGhhdmUgYSBjYWxsYmFja1xyXG4gICQoXCIubGVhdmUtY29tbWVudF9fZm9ybVwiKS5vbignc3VibWl0JywgZnVuY3Rpb24oZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgdmFyIGxlYXZlQ29tbWVudFRleHQgPSAkKCcubGVhdmUtY29tbWVudF9fdGV4dGFyZWEnKS52YWwoKTtcclxuICAgICQucG9zdChhamF4VXJsLCB7XHJcbiAgICAgICAgY29udGVudDogbGVhdmVDb21tZW50VGV4dFxyXG4gICAgICB9LFxyXG4gICAgICBmdW5jdGlvbihkYXRhLCBzdGF0dXMpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkRhdGE6IFwiICsgZGF0YSArIFwiU3RhdHVzOiBcIiArIHN0YXR1cyk7XHJcbiAgICAgICAgZ2V0TGFzdENvbW1lbnQoKTtcclxuICAgICAgfSk7XHJcbiAgfSk7XHJcblxyXG5cclxuICAvLyBEZWxldGUgY29tbWVudFxyXG4gIHZhciBkZWxldGVDb21tZW50ID0gZnVuY3Rpb24oaWQpIHtcclxuICAgIGFqYXhSZXF1ZXN0KHtcclxuICAgICAgdXJsOiBhamF4VXJsICsgaWQsXHJcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgX21ldGhvZDogJ0RFTEVURSdcclxuICAgICAgfSxcclxuICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKHJlc3BEYXRhKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coSlNPTi5wYXJzZShyZXNwRGF0YSkpO1xyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH07XHJcblxyXG4gICQoJ2JvZHknKS5vbignY2xpY2snLCAnLm9uZS1jb21tZW50X19kZWxldGUtd3JhcCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIHZhciBjb21tZW50SWQgPSAkKHRoaXMpLmNsb3Nlc3QoJy5vbmUtY29tbWVudF9fcmlnaHQtd3JhcCcpLmZpbmQoJ2lucHV0W25hbWU9XCJjb21tZW50SWRcIl0nKS52YWwoKTtcclxuICAgIGNvbnNvbGUubG9nKGNvbW1lbnRJZCk7XHJcblxyXG4gICAgZGVsZXRlQ29tbWVudChjb21tZW50SWQpO1xyXG4gIH0pXHJcblxyXG4gIC8vRWRpdCBjb21tZW50XHJcbiAgdmFyIGVkaXRDb21tZW50ID0gZnVuY3Rpb24oaWQsIHRleHQpIHtcclxuICAgIGFqYXhSZXF1ZXN0KHtcclxuICAgICAgdXJsOiBhamF4VXJsICsgaWQsXHJcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgY29udGVudDogdGV4dCxcclxuICAgICAgICBfbWV0aG9kOiAnUFVUJ1xyXG4gICAgICB9LFxyXG4gICAgICBjYWxsYmFjazogZnVuY3Rpb24ocmVzcERhdGEpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhKU09OLnBhcnNlKHJlc3BEYXRhKSk7XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfTtcclxuXHJcblxyXG4gICQoJ2JvZHknKS5vbignY2xpY2snLCAnLm9uZS1jb21tZW50X19lZGl0LXdyYXAsIC5vbmUtY29tbWVudF9fZWRpdC1jYW5jZWwnLCBmdW5jdGlvbihlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB2YXIgdGV4dEJsb2NrID0gJCh0aGlzKS5jbG9zZXN0KCcub25lLWNvbW1lbnRfX2luZm8nKS5maW5kKCcub25lLWNvbW1lbnRfX3RleHQnKTtcclxuICAgIHZhciB0ZXh0YXJlYUJsb2NrID0gJCh0aGlzKS5jbG9zZXN0KCcub25lLWNvbW1lbnRfX2luZm8nKS5maW5kKCcub25lLWNvbW1lbnRfX3RleHRhcmVhJyk7XHJcbiAgICB2YXIgYnRuc0Jsb2NrID0gJCh0aGlzKS5jbG9zZXN0KCcub25lLWNvbW1lbnRfX2luZm8nKS5maW5kKCcub25lLWNvbW1lbnRfX2VkaXQtaXRlbXMnKTtcclxuXHJcbiAgICAkLmVhY2goW3RleHRCbG9jaywgdGV4dGFyZWFCbG9jaywgYnRuc0Jsb2NrXSwgZnVuY3Rpb24oaW5kZXgsIHZhbHVlKSB7XHJcbiAgICAgIHZhbHVlLnRvZ2dsZUNsYXNzKCdoaWRkZW4nKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5vbmUtY29tbWVudF9fZWRpdC1jb25maXJtJywgZnVuY3Rpb24oZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgdmFyIGNvbW1lbnRJZCA9ICQodGhpcykuY2xvc2VzdCgnLm9uZS1jb21tZW50X19yaWdodC13cmFwJykuZmluZCgnaW5wdXRbbmFtZT1cImNvbW1lbnRJZFwiXScpLnZhbCgpO1xyXG4gICAgdmFyIHRleHQgPSAkKHRoaXMpLmNsb3Nlc3QoJy5vbmUtY29tbWVudF9faW5mbycpLmZpbmQoJy5vbmUtY29tbWVudF9fdGV4dGFyZWEnKS50ZXh0O1xyXG5cclxuICAgIGVkaXRDb21tZW50KGNvbW1lbnRJZCwgdGV4dCk7XHJcbiAgICAkKCcuYWxsLWNvbW1lbnRzX193cmFwJykuaHRtbChcIlwiKTtcclxuICAgIGdldENvbW1lbnRzKGN1cnJlbnRDb21tZW50cyk7XHJcbiAgfSk7XHJcblxyXG5cclxufSk7Il19
