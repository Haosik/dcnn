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
    getComments(currentComments);
  });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcGxpY2F0aW9uLmpzIl0sIm5hbWVzIjpbIiQiLCJkb2N1bWVudCIsInJlYWR5IiwiY29tbWVudHNPZmZUb3AiLCJvZmZzZXQiLCJ0b3AiLCJvbiIsImUiLCJwcmV2ZW50RGVmYXVsdCIsInN0b3AiLCJhbmltYXRlIiwic2Nyb2xsVG9wIiwibXlBdXRob3JJZCIsInJlbmRlck9uZUNvbW1lbnQiLCJjb21tZW50T2JqIiwibmFtZSIsImF1dGhvciIsImNvbW1lbnRUZXh0IiwiY29udGVudCIsImF2YXRhciIsImNvbW1lbnRJZCIsImlkIiwiYXV0aG9ySWQiLCJhbnN3ZXJzU3RyaW5nIiwiY2hpbGRyZW4iLCJsZW5ndGgiLCJpIiwiYW5zd2VyTmFtZSIsImFuc3dlckNvbW1lbnRUZXh0IiwiYW5zd2VyQXZhdGFyIiwicmVuZGVyU3RyaW5nIiwiYXBwZW5kIiwiYWpheFJlcXVlc3QiLCJvcHRpb25zIiwidXJsIiwibWV0aG9kIiwiY2FsbGJhY2siLCJkYXRhIiwieG1sSHR0cCIsIlhNTEh0dHBSZXF1ZXN0Iiwib3BlbiIsInNldFJlcXVlc3RIZWFkZXIiLCJzZW5kIiwiSlNPTiIsInN0cmluZ2lmeSIsIm9ucmVhZHlzdGF0ZWNoYW5nZSIsInN0YXR1cyIsInJlYWR5U3RhdGUiLCJyZXNwb25zZVRleHQiLCJjb21tZW50c0Jsb2NrIiwiY3VycmVudE9mZnNldCIsImN1cnJlbnRDb21tZW50cyIsImFqYXhVcmwiLCJnZXRGaXZlQ29tbWVudHMiLCJyZXNwRGF0YSIsImNvbnNvbGUiLCJsb2ciLCJwYXJzZSIsImZvckVhY2giLCJpdGVtIiwiaW5kIiwibG9hZE1vcmVCdG4iLCJnZXRDb21tZW50cyIsImFtb3VudCIsImdldExhc3RDb21tZW50IiwibGVhdmVDb21tZW50VGV4dCIsInZhbCIsInBvc3QiLCJkZWxldGVDb21tZW50IiwiX21ldGhvZCIsImNsb3Nlc3QiLCJmaW5kIiwiZWRpdENvbW1lbnQiLCJ0ZXh0IiwidGV4dEJsb2NrIiwidGV4dGFyZWFCbG9jayIsImJ0bnNCbG9jayIsImVhY2giLCJpbmRleCIsInZhbHVlIiwidG9nZ2xlQ2xhc3MiLCJodG1sIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0FBLEVBQUVDLFFBQUYsRUFBWUMsS0FBWixDQUFrQixZQUFXOztBQUUzQjtBQUNBLE1BQUlDLGlCQUFpQkgsRUFBRSxnQkFBRixFQUFvQkksTUFBcEIsR0FBNkJDLEdBQWxEO0FBQ0FMLElBQUUseUJBQUYsRUFBNkJNLEVBQTdCLENBQWdDLE9BQWhDLEVBQXlDLFVBQVNDLENBQVQsRUFBWTtBQUNuREEsTUFBRUMsY0FBRjtBQUNBUixNQUFFLFlBQUYsRUFBZ0JTLElBQWhCLEdBQXVCQyxPQUF2QixDQUErQixFQUFFQyxXQUFXUixjQUFiLEVBQS9CLEVBQThELEdBQTlEO0FBQ0QsR0FIRDs7QUFLQSxNQUFJUyxhQUFhLENBQWpCOztBQUVBO0FBQ0EsV0FBU0MsZ0JBQVQsQ0FBMEJDLFVBQTFCLEVBQXNDO0FBQ3BDLFFBQUlDLE9BQU9ELFdBQVdFLE1BQVgsQ0FBa0JELElBQTdCO0FBQ0EsUUFBSUUsY0FBY0gsV0FBV0ksT0FBN0I7QUFDQSxRQUFJQyxTQUFTTCxXQUFXRSxNQUFYLENBQWtCRyxNQUEvQjtBQUNBLFFBQUlDLFlBQVlOLFdBQVdPLEVBQTNCO0FBQ0EsUUFBSUMsV0FBV1IsV0FBV0UsTUFBWCxDQUFrQkssRUFBakM7O0FBRUEsUUFBSUUsZ0JBQWdCLEVBQXBCO0FBQ0EsUUFBSVQsV0FBV1UsUUFBWCxDQUFvQkMsTUFBeEIsRUFBZ0M7QUFDOUIsV0FBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUlaLFdBQVdVLFFBQVgsQ0FBb0JDLE1BQXhDLEVBQWdEQyxHQUFoRCxFQUFxRDtBQUNuRCxZQUFJQyxhQUFhYixXQUFXVSxRQUFYLENBQW9CRSxDQUFwQixFQUF1QlYsTUFBdkIsQ0FBOEJELElBQS9DO0FBQ0EsWUFBSWEsb0JBQW9CZCxXQUFXVSxRQUFYLENBQW9CRSxDQUFwQixFQUF1QlIsT0FBL0M7QUFDQSxZQUFJVyxlQUFlZixXQUFXVSxRQUFYLENBQW9CRSxDQUFwQixFQUF1QlYsTUFBdkIsQ0FBOEJHLE1BQWpEO0FBQ0FJLHlNQUltQk0sWUFKbkIsNlNBVXFFRixVQVZyRSwyc0JBdUIyQ0MsaUJBdkIzQztBQTZCRDtBQUNGOztBQUVELFFBQUlFLDRQQUtzQlgsTUFMdEIsc0xBU2lEQyxTQVRqRCxrTUFZeUVMLElBWnpFLDRmQXFCOENFLFdBckI5QyxxRkFzQjhEQSxXQXRCOUQsbWJBNkJhSyxhQUFhVixVQUFiLGtZQTdCYixnUUFxQ2tDVyxhQXJDbEMsc0RBQUo7O0FBMENBdkIsTUFBRSxxQkFBRixFQUF5QitCLE1BQXpCLENBQWdDRCxZQUFoQztBQUNEOztBQUVEO0FBQ0EsTUFBSUUsY0FBYyxTQUFkQSxXQUFjLENBQVNDLE9BQVQsRUFBa0I7QUFDbEMsUUFBSUMsTUFBTUQsUUFBUUMsR0FBUixJQUFlLEdBQXpCO0FBQ0EsUUFBSUMsU0FBU0YsUUFBUUUsTUFBUixJQUFrQixLQUEvQjtBQUNBLFFBQUlDLFdBQVdILFFBQVFHLFFBQVIsSUFBb0IsWUFBVyxDQUFFLENBQWhEO0FBQ0EsUUFBSUMsT0FBT0osUUFBUUksSUFBUixJQUFnQixFQUEzQjtBQUNBLFFBQUlDLFVBQVUsSUFBSUMsY0FBSixFQUFkOztBQUVBRCxZQUFRRSxJQUFSLENBQWFMLE1BQWIsRUFBcUJELEdBQXJCLEVBQTBCLElBQTFCO0FBQ0FJLFlBQVFHLGdCQUFSLENBQXlCLGNBQXpCLEVBQXlDLGtCQUF6QztBQUNBSCxZQUFRSSxJQUFSLENBQWFDLEtBQUtDLFNBQUwsQ0FBZVAsSUFBZixDQUFiOztBQUVBQyxZQUFRTyxrQkFBUixHQUE2QixZQUFXO0FBQ3RDLFVBQUlQLFFBQVFRLE1BQVIsS0FBbUIsR0FBbkIsSUFBMEJSLFFBQVFTLFVBQVIsS0FBdUIsQ0FBckQsRUFBd0Q7QUFDdERYLGlCQUFTRSxRQUFRVSxZQUFqQjtBQUNEO0FBQ0YsS0FKRDtBQUtELEdBaEJEOztBQW1CQSxNQUFJQyxnQkFBZ0JqRCxFQUFFLHFCQUFGLENBQXBCO0FBQ0EsTUFBSWtELGdCQUFnQixDQUFwQjtBQUNBLE1BQUlDLGtCQUFrQixDQUF0QjtBQUNBLE1BQUlDLFVBQVUsd0VBQWQ7O0FBRUE7QUFDQSxNQUFJQyxrQkFBa0IsU0FBbEJBLGVBQWtCLEdBQVc7QUFDL0JyQixnQkFBWTtBQUNWRSxXQUFLa0IsVUFBVSxrQkFBVixHQUErQkYsYUFEMUI7QUFFVmQsZ0JBQVUsa0JBQVNrQixRQUFULEVBQW1CO0FBQzNCQyxnQkFBUUMsR0FBUixDQUFZYixLQUFLYyxLQUFMLENBQVdILFFBQVgsQ0FBWjtBQUNBWCxhQUFLYyxLQUFMLENBQVdILFFBQVgsRUFBcUJJLE9BQXJCLENBQTZCLFVBQVNDLElBQVQsRUFBZUMsR0FBZixFQUFvQjtBQUMvQy9DLDJCQUFpQjhDLElBQWpCO0FBQ0QsU0FGRDtBQUdEO0FBUFMsS0FBWjtBQVNBVCxxQkFBaUIsQ0FBakI7QUFDQUMsdUJBQW1CLENBQW5CO0FBQ0QsR0FaRDs7QUFjQSxNQUFJVSxjQUFjN0QsRUFBRSxpQkFBRixDQUFsQjtBQUNBNkQsY0FBWXZELEVBQVosQ0FBZSxPQUFmLEVBQXdCLFlBQVc7QUFDakMrQztBQUNELEdBRkQ7O0FBSUE7QUFDQSxNQUFJUyxjQUFjLFNBQWRBLFdBQWMsQ0FBU0MsTUFBVCxFQUFpQjtBQUNqQy9CLGdCQUFZO0FBQ1ZFLFdBQUtrQixVQUFVLFNBQVYsR0FBc0JXLE1BQXRCLEdBQStCLFdBRDFCO0FBRVYzQixnQkFBVSxrQkFBU2tCLFFBQVQsRUFBbUI7QUFDM0JDLGdCQUFRQyxHQUFSLENBQVliLEtBQUtjLEtBQUwsQ0FBV0gsUUFBWCxDQUFaO0FBQ0FYLGFBQUtjLEtBQUwsQ0FBV0gsUUFBWCxFQUFxQkksT0FBckIsQ0FBNkIsVUFBU0MsSUFBVCxFQUFlQyxHQUFmLEVBQW9CO0FBQy9DL0MsMkJBQWlCOEMsSUFBakI7QUFDRCxTQUZEO0FBR0Q7QUFQUyxLQUFaO0FBU0QsR0FWRDs7QUFZQTtBQUNBLE1BQUlLLGlCQUFpQixTQUFqQkEsY0FBaUIsR0FBVztBQUM5QmhDLGdCQUFZO0FBQ1ZFLFdBQUtrQixVQUFVLFVBREw7QUFFVmhCLGdCQUFVLGtCQUFTa0IsUUFBVCxFQUFtQjtBQUMzQkMsZ0JBQVFDLEdBQVIsQ0FBWWIsS0FBS2MsS0FBTCxDQUFXSCxRQUFYLENBQVo7QUFDRDtBQUpTLEtBQVo7QUFNRCxHQVBEOztBQVNBO0FBQ0F0RCxJQUFFLHNCQUFGLEVBQTBCTSxFQUExQixDQUE2QixRQUE3QixFQUF1QyxVQUFTQyxDQUFULEVBQVk7QUFDakRBLE1BQUVDLGNBQUY7QUFDQSxRQUFJeUQsbUJBQW1CakUsRUFBRSwwQkFBRixFQUE4QmtFLEdBQTlCLEVBQXZCO0FBQ0FsRSxNQUFFbUUsSUFBRixDQUFPZixPQUFQLEVBQWdCO0FBQ1psQyxlQUFTK0M7QUFERyxLQUFoQixFQUdFLFVBQVM1QixJQUFULEVBQWVTLE1BQWYsRUFBdUI7QUFDckJTLGNBQVFDLEdBQVIsQ0FBWSxXQUFXbkIsSUFBWCxHQUFrQixVQUFsQixHQUErQlMsTUFBM0M7QUFDQWtCO0FBQ0QsS0FOSDtBQU9ELEdBVkQ7O0FBYUE7QUFDQSxNQUFJSSxnQkFBZ0IsU0FBaEJBLGFBQWdCLENBQVMvQyxFQUFULEVBQWE7QUFDL0JXLGdCQUFZO0FBQ1ZFLFdBQUtrQixVQUFVL0IsRUFETDtBQUVWYyxjQUFRLE1BRkU7QUFHVkUsWUFBTTtBQUNKZ0MsaUJBQVM7QUFETCxPQUhJO0FBTVZqQyxnQkFBVSxrQkFBU2tCLFFBQVQsRUFBbUI7QUFDM0JDLGdCQUFRQyxHQUFSLENBQVliLEtBQUtjLEtBQUwsQ0FBV0gsUUFBWCxDQUFaO0FBQ0Q7QUFSUyxLQUFaO0FBVUQsR0FYRDs7QUFhQXRELElBQUUsTUFBRixFQUFVTSxFQUFWLENBQWEsT0FBYixFQUFzQiwyQkFBdEIsRUFBbUQsVUFBU0MsQ0FBVCxFQUFZO0FBQzdEQSxNQUFFQyxjQUFGO0FBQ0EsUUFBSVksWUFBWXBCLEVBQUUsSUFBRixFQUFRc0UsT0FBUixDQUFnQiwwQkFBaEIsRUFBNENDLElBQTVDLENBQWlELHlCQUFqRCxFQUE0RUwsR0FBNUUsRUFBaEI7QUFDQVgsWUFBUUMsR0FBUixDQUFZcEMsU0FBWjs7QUFFQWdELGtCQUFjaEQsU0FBZDtBQUNELEdBTkQ7O0FBUUE7QUFDQSxNQUFJb0QsY0FBYyxTQUFkQSxXQUFjLENBQVNuRCxFQUFULEVBQWFvRCxJQUFiLEVBQW1CO0FBQ25DbEIsWUFBUUMsR0FBUixDQUFZbkMsRUFBWjtBQUNBa0MsWUFBUUMsR0FBUixDQUFZaUIsSUFBWjtBQUNBekMsZ0JBQVk7QUFDVkUsV0FBS2tCLFVBQVUvQixFQURMO0FBRVZjLGNBQVEsS0FGRTtBQUdWRSxZQUFNO0FBQ0puQixpQkFBU3VEO0FBREwsT0FISTtBQU1WckMsZ0JBQVUsa0JBQVNrQixRQUFULEVBQW1CO0FBQzNCQyxnQkFBUUMsR0FBUixDQUFZYixLQUFLYyxLQUFMLENBQVdILFFBQVgsQ0FBWjtBQUNEO0FBUlMsS0FBWjtBQVVELEdBYkQ7O0FBZ0JBdEQsSUFBRSxNQUFGLEVBQVVNLEVBQVYsQ0FBYSxPQUFiLEVBQXNCLG9EQUF0QixFQUE0RSxVQUFTQyxDQUFULEVBQVk7QUFDdEZBLE1BQUVDLGNBQUY7QUFDQSxRQUFJa0UsWUFBWTFFLEVBQUUsSUFBRixFQUFRc0UsT0FBUixDQUFnQixvQkFBaEIsRUFBc0NDLElBQXRDLENBQTJDLG9CQUEzQyxDQUFoQjtBQUNBLFFBQUlJLGdCQUFnQjNFLEVBQUUsSUFBRixFQUFRc0UsT0FBUixDQUFnQixvQkFBaEIsRUFBc0NDLElBQXRDLENBQTJDLHdCQUEzQyxDQUFwQjtBQUNBLFFBQUlLLFlBQVk1RSxFQUFFLElBQUYsRUFBUXNFLE9BQVIsQ0FBZ0Isb0JBQWhCLEVBQXNDQyxJQUF0QyxDQUEyQywwQkFBM0MsQ0FBaEI7O0FBRUF2RSxNQUFFNkUsSUFBRixDQUFPLENBQUNILFNBQUQsRUFBWUMsYUFBWixFQUEyQkMsU0FBM0IsQ0FBUCxFQUE4QyxVQUFTRSxLQUFULEVBQWdCQyxLQUFoQixFQUF1QjtBQUNuRUEsWUFBTUMsV0FBTixDQUFrQixRQUFsQjtBQUNELEtBRkQ7QUFHRCxHQVREOztBQVdBaEYsSUFBRSxNQUFGLEVBQVVNLEVBQVYsQ0FBYSxPQUFiLEVBQXNCLDRCQUF0QixFQUFvRCxVQUFTQyxDQUFULEVBQVk7QUFDOURBLE1BQUVDLGNBQUY7QUFDQSxRQUFJWSxZQUFZcEIsRUFBRSxJQUFGLEVBQVFzRSxPQUFSLENBQWdCLDBCQUFoQixFQUE0Q0MsSUFBNUMsQ0FBaUQseUJBQWpELEVBQTRFTCxHQUE1RSxFQUFoQjtBQUNBLFFBQUlPLE9BQU96RSxFQUFFLElBQUYsRUFBUXNFLE9BQVIsQ0FBZ0Isb0JBQWhCLEVBQXNDQyxJQUF0QyxDQUEyQyx3QkFBM0MsRUFBcUVMLEdBQXJFLEVBQVg7O0FBRUFNLGdCQUFZcEQsU0FBWixFQUF1QnFELElBQXZCO0FBQ0F6RSxNQUFFLHFCQUFGLEVBQXlCaUYsSUFBekIsQ0FBOEIsRUFBOUI7QUFDQW5CLGdCQUFZWCxlQUFaO0FBQ0QsR0FSRDtBQVdELENBclBEIiwiZmlsZSI6ImFwcGxpY2F0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiO1xyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcclxuXHJcbiAgLy8gU2Nyb2xsIHRvIGNvbW1lbnRzXHJcbiAgdmFyIGNvbW1lbnRzT2ZmVG9wID0gJCgnLmNvbW1lbnRzLXdyYXAnKS5vZmZzZXQoKS50b3A7XHJcbiAgJCgnLmFydGljbGUtaW5mb19fY29tbWVudHMnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAkKCdodG1sLCBib2R5Jykuc3RvcCgpLmFuaW1hdGUoeyBzY3JvbGxUb3A6IGNvbW1lbnRzT2ZmVG9wIH0sIDQwMClcclxuICB9KVxyXG5cclxuICB2YXIgbXlBdXRob3JJZCA9IDE7XHJcblxyXG4gIC8vRVMyMDE1IFN0cmluZyBMaXRlcmFsIGZvciBhdm9pZGluZyBzb21lIG1lc3NcclxuICBmdW5jdGlvbiByZW5kZXJPbmVDb21tZW50KGNvbW1lbnRPYmopIHtcclxuICAgIHZhciBuYW1lID0gY29tbWVudE9iai5hdXRob3IubmFtZTtcclxuICAgIHZhciBjb21tZW50VGV4dCA9IGNvbW1lbnRPYmouY29udGVudDtcclxuICAgIHZhciBhdmF0YXIgPSBjb21tZW50T2JqLmF1dGhvci5hdmF0YXI7XHJcbiAgICB2YXIgY29tbWVudElkID0gY29tbWVudE9iai5pZDtcclxuICAgIHZhciBhdXRob3JJZCA9IGNvbW1lbnRPYmouYXV0aG9yLmlkO1xyXG5cclxuICAgIHZhciBhbnN3ZXJzU3RyaW5nID0gJyc7XHJcbiAgICBpZiAoY29tbWVudE9iai5jaGlsZHJlbi5sZW5ndGgpIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb21tZW50T2JqLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIGFuc3dlck5hbWUgPSBjb21tZW50T2JqLmNoaWxkcmVuW2ldLmF1dGhvci5uYW1lO1xyXG4gICAgICAgIHZhciBhbnN3ZXJDb21tZW50VGV4dCA9IGNvbW1lbnRPYmouY2hpbGRyZW5baV0uY29udGVudDtcclxuICAgICAgICB2YXIgYW5zd2VyQXZhdGFyID0gY29tbWVudE9iai5jaGlsZHJlbltpXS5hdXRob3IuYXZhdGFyO1xyXG4gICAgICAgIGFuc3dlcnNTdHJpbmcgKz0gYFxyXG5cdFx0XHQ8ZGl2IGNsYXNzPVwib25lLWFuc3dlcl9fd3JhcCBjbGVhcmZpeFwiPlxyXG5cdFx0XHQgICAgPGRpdiBjbGFzcz1cIm9uZS1hbnN3ZXJfX2F2YXRhci13cmFwXCI+XHJcblx0XHRcdCAgICAgICAgPGRpdiBjbGFzcz1cImNvbW1lbnRzLWF2YXRhclwiPlxyXG5cdFx0XHQgICAgICAgICAgICA8aW1nIHNyYz1cIiR7YW5zd2VyQXZhdGFyfVwiIGFsdD1cIkF2YXRhciBvZiBhdXRob3JcIj5cclxuXHRcdFx0ICAgICAgICA8L2Rpdj5cclxuXHRcdFx0ICAgIDwvZGl2PlxyXG5cdFx0XHQgICAgPGRpdiBjbGFzcz1cIm9uZS1hbnN3ZXJfX3JpZ2h0LXdyYXBcIj5cclxuXHRcdFx0ICAgICAgICA8ZGl2IGNsYXNzPVwib25lLWFuc3dlcl9faW5mb1wiPlxyXG5cdFx0XHQgICAgICAgICAgICA8ZGl2IGNsYXNzPVwib25lLWFuc3dlcl9faW5mby10b3BcIj5cclxuXHRcdFx0ICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhbnN3ZXItdG9wX19pdGVtIG9uZS1hbnN3ZXJfX2F1dGhvciBib2xkZXJcIj4ke2Fuc3dlck5hbWV9PC9kaXY+XHJcblx0XHRcdCAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYW5zd2VyLXRvcF9faXRlbSBvbmUtYW5zd2VyX193aG9tXCI+XHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1yZXBseVwiPjwvaT5cclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICA8c3Bhbj5LdXJrIFRob21wc29uPC9zcGFuPlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgPC9kaXY+XHJcblx0XHRcdCAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYW5zd2VyLXRvcF9faXRlbSBvbmUtYW5zd2VyX19kYXRlLXdyYXBcIj5cclxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLWNsb2NrLW9cIj48L2k+XHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJib2xkZXJcIj4yMDE1LTA3LTA2PC9zcGFuPlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgIDxzcGFuPiBhdCA8L3NwYW4+XHJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJib2xkZXIgYXJ0aWNsZS1pbmZvX19kYXRlXCI+MTM6NTc8L3NwYW4+XHJcblx0XHRcdCAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHRcdFx0ICAgICAgICAgICAgPC9kaXY+XHJcblx0XHRcdCAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJvbmUtYW5zd2VyX19pbmZvLW1pZGRsZVwiPlxyXG5cdFx0XHQgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm9uZS1hbnN3ZXJfX3RleHRcIj4ke2Fuc3dlckNvbW1lbnRUZXh0fTwvZGl2PlxyXG5cdFx0XHQgICAgICAgICAgICA8L2Rpdj5cclxuXHRcdFx0ICAgICAgICA8L2Rpdj5cclxuXHRcdFx0ICAgIDwvZGl2PlxyXG5cdFx0XHQ8L2Rpdj5cclxuICAgIFx0XHRgO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHJlbmRlclN0cmluZyA9IGBcclxuICAgIDxkaXYgY2xhc3M9XCJvbmUtY29tbWVudF9fd3JhcFwiPlxyXG5cdCAgICA8ZGl2IGNsYXNzPVwib25lLWNvbW1lbnRfX2JveCBjbGVhcmZpeFwiPlxyXG5cdCAgICAgICAgPGRpdiBjbGFzcz1cIm9uZS1jb21tZW50X19hdmF0YXItd3JhcFwiPlxyXG5cdCAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb21tZW50cy1hdmF0YXIgYXZhdGFyLS1iaWcgbXktYXZhdGFyXCI+XHJcblx0ICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiICR7YXZhdGFyfSBcIiBhbHQ9XCJBdmF0YXIgb2YgYXV0aG9yXCI+XHJcblx0ICAgICAgICAgICAgPC9kaXY+XHJcblx0ICAgICAgICA8L2Rpdj5cclxuXHQgICAgICAgIDxkaXYgY2xhc3M9XCJvbmUtY29tbWVudF9fcmlnaHQtd3JhcFwiPlxyXG5cdCAgICAgICAgXHQ8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJjb21tZW50SWRcIiB2YWx1ZT1cIiR7Y29tbWVudElkfVwiPlxyXG5cdCAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJvbmUtY29tbWVudF9faW5mb1wiPlxyXG5cdCAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwib25lLWNvbW1lbnRfX2luZm8tdG9wXCI+XHJcblx0ICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29tbWVudC10b3BfX2l0ZW0gb25lLWNvbW1lbnRfX2F1dGhvciBib2xkZXJcIj4ke25hbWV9PC9kaXY+XHJcblx0ICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29tbWVudC10b3BfX2l0ZW0gb25lLWNvbW1lbnRfX2RhdGUtd3JhcFwiPlxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtY2xvY2stb1wiPjwvaT5cclxuXHQgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImJvbGRlclwiPjIwMTUtMDctMDY8L3NwYW4+XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+IGF0PC9zcGFuPlxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYm9sZGVyIGFydGljbGUtaW5mb19fZGF0ZVwiPjEzOjU5PC9zcGFuPlxyXG5cdCAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblx0ICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cdCAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwib25lLWNvbW1lbnRfX2luZm8tbWlkZGxlXCI+XHJcblx0ICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwib25lLWNvbW1lbnRfX3RleHRcIj4ke2NvbW1lbnRUZXh0fTwvZGl2PlxyXG5cdCAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIGNsYXNzPVwib25lLWNvbW1lbnRfX3RleHRhcmVhIGhpZGRlblwiPiR7Y29tbWVudFRleHR9PC90ZXh0YXJlYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJvbmUtY29tbWVudF9fZWRpdC1pdGVtcyBoaWRkZW5cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwib25lLWNvbW1lbnRfX2VkaXQtY2FuY2VsXCI+JiMxMDAwNTsgQ2FuY2VsPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cIm9uZS1jb21tZW50X19lZGl0LWNvbmZpcm0gYWNjZW50LWJ0blwiPlNhdmU8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cdCAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHQgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm9uZS1jb21tZW50X19pbmZvLWJvdHRvbVwiPlxyXG5cdCAgICAgICAgICAgICAgICBcdCR7IGF1dGhvcklkID09PSBteUF1dGhvcklkID8gYDxidXR0b24gY2xhc3M9XCJvbmUtY29tbWVudF9fZWRpdC13cmFwIG9uZS1jb21tZW50X19pbmZvLWl0ZW1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmEgZmEtcGVuY2lsLXNxdWFyZS1vXCI+PC9pPkVkaXQ8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cIm9uZS1jb21tZW50X19kZWxldGUtd3JhcCBvbmUtY29tbWVudF9faW5mby1pdGVtXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhIGZhLXRpbWVzXCI+PC9pPkRlbGV0ZTwvYnV0dG9uPmA6IGBgIH1cclxuXHQgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJvbmUtY29tbWVudF9fcmVwbHktd3JhcCBvbmUtY29tbWVudF9faW5mby1pdGVtXCI+XHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYSBmYS1yZXBseVwiPjwvaT5SZXBseTwvYnV0dG9uPlxyXG5cdCAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHQgICAgICAgICAgICA8L2Rpdj5cclxuXHQgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYW5zd2Vycy13cmFwXCI+ICR7YW5zd2Vyc1N0cmluZ30gPC9kaXY+XHJcblx0ICAgICAgICA8L2Rpdj5cclxuXHQgICAgPC9kaXY+XHJcblx0PC9kaXY+YDtcclxuXHJcbiAgICAkKCcuYWxsLWNvbW1lbnRzX193cmFwJykuYXBwZW5kKHJlbmRlclN0cmluZyk7XHJcbiAgfVxyXG5cclxuICAvLyBBamF4IEhhbmRsZXJcclxuICB2YXIgYWpheFJlcXVlc3QgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcbiAgICB2YXIgdXJsID0gb3B0aW9ucy51cmwgfHwgJy8nO1xyXG4gICAgdmFyIG1ldGhvZCA9IG9wdGlvbnMubWV0aG9kIHx8ICdHRVQnO1xyXG4gICAgdmFyIGNhbGxiYWNrID0gb3B0aW9ucy5jYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xyXG4gICAgdmFyIGRhdGEgPSBvcHRpb25zLmRhdGEgfHwge307XHJcbiAgICB2YXIgeG1sSHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cclxuICAgIHhtbEh0dHAub3BlbihtZXRob2QsIHVybCwgdHJ1ZSk7XHJcbiAgICB4bWxIdHRwLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XHJcbiAgICB4bWxIdHRwLnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG5cclxuICAgIHhtbEh0dHAub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIGlmICh4bWxIdHRwLnN0YXR1cyA9PT0gMjAwICYmIHhtbEh0dHAucmVhZHlTdGF0ZSA9PT0gNCkge1xyXG4gICAgICAgIGNhbGxiYWNrKHhtbEh0dHAucmVzcG9uc2VUZXh0KTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9O1xyXG5cclxuXHJcbiAgdmFyIGNvbW1lbnRzQmxvY2sgPSAkKCcuYWxsLWNvbW1lbnRzX193cmFwJyk7XHJcbiAgdmFyIGN1cnJlbnRPZmZzZXQgPSAwO1xyXG4gIHZhciBjdXJyZW50Q29tbWVudHMgPSAwO1xyXG4gIHZhciBhamF4VXJsID0gJ2h0dHA6Ly9mcm9udGVuZC10ZXN0LnBpbmdidWxsLmNvbS9wYWdlcy9ub29iYmFzdGVyQGdtYWlsLmNvbS9jb21tZW50cy8nO1xyXG5cclxuICAvL0xvYWQgNSBtb3JlIC0gYmVoYXZpb3IgYW5kIGJ1dHRvblxyXG4gIHZhciBnZXRGaXZlQ29tbWVudHMgPSBmdW5jdGlvbigpIHtcclxuICAgIGFqYXhSZXF1ZXN0KHtcclxuICAgICAgdXJsOiBhamF4VXJsICsgJz9jb3VudD01Jm9mZnNldD0nICsgY3VycmVudE9mZnNldCxcclxuICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKHJlc3BEYXRhKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coSlNPTi5wYXJzZShyZXNwRGF0YSkpO1xyXG4gICAgICAgIEpTT04ucGFyc2UocmVzcERhdGEpLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaW5kKSB7XHJcbiAgICAgICAgICByZW5kZXJPbmVDb21tZW50KGl0ZW0pO1xyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICBjdXJyZW50T2Zmc2V0ICs9IDU7XHJcbiAgICBjdXJyZW50Q29tbWVudHMgKz0gNTtcclxuICB9O1xyXG5cclxuICB2YXIgbG9hZE1vcmVCdG4gPSAkKCcubG9hZC1tb3JlX19idG4nKTtcclxuICBsb2FkTW9yZUJ0bi5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgIGdldEZpdmVDb21tZW50cygpO1xyXG4gIH0pO1xyXG5cclxuICAvL0dldCBjb21tZW50cyB0byByZXJlbmRlclxyXG4gIHZhciBnZXRDb21tZW50cyA9IGZ1bmN0aW9uKGFtb3VudCkge1xyXG4gICAgYWpheFJlcXVlc3Qoe1xyXG4gICAgICB1cmw6IGFqYXhVcmwgKyAnP2NvdW50PScgKyBhbW91bnQgKyAnJm9mZnNldD0wJyxcclxuICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKHJlc3BEYXRhKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coSlNPTi5wYXJzZShyZXNwRGF0YSkpO1xyXG4gICAgICAgIEpTT04ucGFyc2UocmVzcERhdGEpLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaW5kKSB7XHJcbiAgICAgICAgICByZW5kZXJPbmVDb21tZW50KGl0ZW0pO1xyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfTtcclxuXHJcbiAgLy9HZXQgbGFzdCBjb21tZW50XHJcbiAgdmFyIGdldExhc3RDb21tZW50ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBhamF4UmVxdWVzdCh7XHJcbiAgICAgIHVybDogYWpheFVybCArICc/Y291bnQ9MScsXHJcbiAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbihyZXNwRGF0YSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKEpTT04ucGFyc2UocmVzcERhdGEpKTtcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9O1xyXG5cclxuICAvL0pRdWVyeSBqdW5jdGlvbiBmb3IgJ3Bvc3QnLCB0byBoYXZlIGEgY2FsbGJhY2tcclxuICAkKFwiLmxlYXZlLWNvbW1lbnRfX2Zvcm1cIikub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uKGUpIHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIHZhciBsZWF2ZUNvbW1lbnRUZXh0ID0gJCgnLmxlYXZlLWNvbW1lbnRfX3RleHRhcmVhJykudmFsKCk7XHJcbiAgICAkLnBvc3QoYWpheFVybCwge1xyXG4gICAgICAgIGNvbnRlbnQ6IGxlYXZlQ29tbWVudFRleHRcclxuICAgICAgfSxcclxuICAgICAgZnVuY3Rpb24oZGF0YSwgc3RhdHVzKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJEYXRhOiBcIiArIGRhdGEgKyBcIlN0YXR1czogXCIgKyBzdGF0dXMpO1xyXG4gICAgICAgIGdldExhc3RDb21tZW50KCk7XHJcbiAgICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuXHJcbiAgLy8gRGVsZXRlIGNvbW1lbnRcclxuICB2YXIgZGVsZXRlQ29tbWVudCA9IGZ1bmN0aW9uKGlkKSB7XHJcbiAgICBhamF4UmVxdWVzdCh7XHJcbiAgICAgIHVybDogYWpheFVybCArIGlkLFxyXG4gICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgZGF0YToge1xyXG4gICAgICAgIF9tZXRob2Q6ICdERUxFVEUnXHJcbiAgICAgIH0sXHJcbiAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbihyZXNwRGF0YSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKEpTT04ucGFyc2UocmVzcERhdGEpKTtcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9O1xyXG5cclxuICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5vbmUtY29tbWVudF9fZGVsZXRlLXdyYXAnLCBmdW5jdGlvbihlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB2YXIgY29tbWVudElkID0gJCh0aGlzKS5jbG9zZXN0KCcub25lLWNvbW1lbnRfX3JpZ2h0LXdyYXAnKS5maW5kKCdpbnB1dFtuYW1lPVwiY29tbWVudElkXCJdJykudmFsKCk7XHJcbiAgICBjb25zb2xlLmxvZyhjb21tZW50SWQpO1xyXG5cclxuICAgIGRlbGV0ZUNvbW1lbnQoY29tbWVudElkKTtcclxuICB9KVxyXG5cclxuICAvL0VkaXQgY29tbWVudFxyXG4gIHZhciBlZGl0Q29tbWVudCA9IGZ1bmN0aW9uKGlkLCB0ZXh0KSB7XHJcbiAgICBjb25zb2xlLmxvZyhpZCk7XHJcbiAgICBjb25zb2xlLmxvZyh0ZXh0KTtcclxuICAgIGFqYXhSZXF1ZXN0KHtcclxuICAgICAgdXJsOiBhamF4VXJsICsgaWQsXHJcbiAgICAgIG1ldGhvZDogJ1BVVCcsXHJcbiAgICAgIGRhdGE6IHtcclxuICAgICAgICBjb250ZW50OiB0ZXh0LFxyXG4gICAgICB9LFxyXG4gICAgICBjYWxsYmFjazogZnVuY3Rpb24ocmVzcERhdGEpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhKU09OLnBhcnNlKHJlc3BEYXRhKSk7XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfTtcclxuXHJcblxyXG4gICQoJ2JvZHknKS5vbignY2xpY2snLCAnLm9uZS1jb21tZW50X19lZGl0LXdyYXAsIC5vbmUtY29tbWVudF9fZWRpdC1jYW5jZWwnLCBmdW5jdGlvbihlKSB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB2YXIgdGV4dEJsb2NrID0gJCh0aGlzKS5jbG9zZXN0KCcub25lLWNvbW1lbnRfX2luZm8nKS5maW5kKCcub25lLWNvbW1lbnRfX3RleHQnKTtcclxuICAgIHZhciB0ZXh0YXJlYUJsb2NrID0gJCh0aGlzKS5jbG9zZXN0KCcub25lLWNvbW1lbnRfX2luZm8nKS5maW5kKCcub25lLWNvbW1lbnRfX3RleHRhcmVhJyk7XHJcbiAgICB2YXIgYnRuc0Jsb2NrID0gJCh0aGlzKS5jbG9zZXN0KCcub25lLWNvbW1lbnRfX2luZm8nKS5maW5kKCcub25lLWNvbW1lbnRfX2VkaXQtaXRlbXMnKTtcclxuXHJcbiAgICAkLmVhY2goW3RleHRCbG9jaywgdGV4dGFyZWFCbG9jaywgYnRuc0Jsb2NrXSwgZnVuY3Rpb24oaW5kZXgsIHZhbHVlKSB7XHJcbiAgICAgIHZhbHVlLnRvZ2dsZUNsYXNzKCdoaWRkZW4nKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5vbmUtY29tbWVudF9fZWRpdC1jb25maXJtJywgZnVuY3Rpb24oZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgdmFyIGNvbW1lbnRJZCA9ICQodGhpcykuY2xvc2VzdCgnLm9uZS1jb21tZW50X19yaWdodC13cmFwJykuZmluZCgnaW5wdXRbbmFtZT1cImNvbW1lbnRJZFwiXScpLnZhbCgpO1xyXG4gICAgdmFyIHRleHQgPSAkKHRoaXMpLmNsb3Nlc3QoJy5vbmUtY29tbWVudF9faW5mbycpLmZpbmQoJy5vbmUtY29tbWVudF9fdGV4dGFyZWEnKS52YWwoKTtcclxuXHJcbiAgICBlZGl0Q29tbWVudChjb21tZW50SWQsIHRleHQpO1xyXG4gICAgJCgnLmFsbC1jb21tZW50c19fd3JhcCcpLmh0bWwoXCJcIik7XHJcbiAgICBnZXRDb21tZW50cyhjdXJyZW50Q29tbWVudHMpO1xyXG4gIH0pO1xyXG5cclxuXHJcbn0pOyJdfQ==
