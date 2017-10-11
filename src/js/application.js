;
$(document).ready(function() {

  // Scroll to comments
  var commentsOffTop = $('.comments-wrap').offset().top;
  $('.article-info__comments').on('click', function(e) {
    e.preventDefault();
    $('html, body').stop().animate({ scrollTop: commentsOffTop }, 400)
  })

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
        answersString += `
			<div class="one-answer__wrap clearfix">
			    <div class="one-answer__avatar-wrap">
			        <div class="comments-avatar">
			            <img src="${answerAvatar}" alt="Avatar of author">
			        </div>
			    </div>
			    <div class="one-answer__right-wrap">
			        <div class="one-answer__info">
			            <div class="one-answer__info-top">
			                <div class="answer-top__item one-answer__author bolder">${answerName}</div>
			                <div class="answer-top__item one-answer__whom">
			                    <i class="fa fa-reply"></i>
			                    <span>Kurk Thompson</span>
			                </div>
			                <div class="answer-top__item one-answer__date-wrap">
			                    <i class="fa fa-clock-o"></i>
			                    <span class="bolder">2015-07-06</span>
			                    <span> at </span>
			                    <span class="bolder article-info__date">13:57</span>
			                </div>
			            </div>
			            <div class="one-answer__info-middle">
			                <div class="one-answer__text">${answerCommentText}</div>
			            </div>
			        </div>
			    </div>
			</div>
    		`;
      }
    }

    var renderString = `
    <div class="one-comment__wrap">
	    <div class="one-comment__box clearfix">
	        <div class="one-comment__avatar-wrap">
	            <div class="comments-avatar avatar--big my-avatar">
	                <img src=" ${avatar} " alt="Avatar of author">
	            </div>
	        </div>
	        <div class="one-comment__right-wrap">
	        	<input type="hidden" name="commentId" value="${commentId}">
	            <div class="one-comment__info">
	                <div class="one-comment__info-top">
	                    <div class="comment-top__item one-comment__author bolder">${name}</div>
	                    <div class="comment-top__item one-comment__date-wrap">
	                        <i class="fa fa-clock-o"></i>
	                        <span class="bolder">2015-07-06</span>
	                        <span> at</span>
	                        <span class="bolder article-info__date">13:59</span>
	                    </div>
	                </div>
	                <div class="one-comment__info-middle">
	                    <div class="one-comment__text">${commentText}</div>
	                    <textarea class="one-comment__textarea hidden">${commentText}</textarea>
                            <div class="one-comment__edit-items hidden">
                                <button class="one-comment__edit-cancel">&#10005; Cancel</button>
                                <button class="one-comment__edit-confirm accent-btn">Save</button>
                            </div>
	                </div>
	                <div class="one-comment__info-bottom">
	                	${ authorId === myAuthorId ? `<button class="one-comment__edit-wrap one-comment__info-item">
                                                    <i class="fa fa-pencil-square-o"></i>Edit</button>
                                                <button class="one-comment__delete-wrap one-comment__info-item">
                                                    <i class="fa fa-times"></i>Delete</button>`: `` }
	                    <button class="one-comment__reply-wrap one-comment__info-item">
	                        <i class="fa fa-reply"></i>Reply</button>
	                </div>
	            </div>
	            <div class="answers-wrap"> ${answersString} </div>
	        </div>
	    </div>
	</div>`;

    $('.all-comments__wrap').append(renderString);
  }

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


  var commentsBlock = $('.all-comments__wrap');
  var currentOffset = 0;
  var currentComments = 0;
  var ajaxUrl = 'http://frontend-test.pingbull.com/pages/noobbaster@gmail.com/comments/';

  //Load 5 more - behavior and button
  var getFiveComments = function() {
    ajaxRequest({
      url: ajaxUrl + '?count=5&offset=' + currentOffset,
      callback: function(respData) {
        console.log(JSON.parse(respData));
        JSON.parse(respData).forEach(function(item, ind) {
          renderOneComment(item);
        })
      }
    })
    currentOffset += 5;
    currentComments += 5;
  };

  var loadMoreBtn = $('.load-more__btn');
  loadMoreBtn.on('click', function() {
    getFiveComments();
  });

  //Get comments to rerender
  var getComments = function(amount) {
    ajaxRequest({
      url: ajaxUrl + '?count=' + amount + '&offset=0',
      callback: function(respData) {
        console.log(JSON.parse(respData));
        JSON.parse(respData).forEach(function(item, ind) {
          renderOneComment(item);
        })
      }
    })
  };

  //Get last comment
  var getLastComment = function() {
    ajaxRequest({
      url: ajaxUrl + '?count=1',
      callback: function(respData) {
        console.log(JSON.parse(respData));
      }
    })
  };

  //JQuery junction for 'post', to have a callback
  $(".leave-comment__form").on('submit', function(e) {
    e.preventDefault();
    var leaveCommentText = $('.leave-comment__textarea').val();
    $.post(ajaxUrl, {
        content: leaveCommentText
      },
      function(data, status) {
        console.log("Data: " + data + "Status: " + status);
        getLastComment();
      });
  });


  // Delete comment
  var deleteComment = function(id) {
    ajaxRequest({
      url: ajaxUrl + id,
      method: 'POST',
      data: {
        _method: 'DELETE'
      },
      callback: function(respData) {
        console.log(JSON.parse(respData));
      }
    })
  };

  $('body').on('click', '.one-comment__delete-wrap', function(e) {
    e.preventDefault();
    var commentId = $(this).closest('.one-comment__right-wrap').find('input[name="commentId"]').val();
    console.log(commentId);

    deleteComment(commentId);
  })

  //Edit comment
  var editComment = function(id, text) {
    console.log(id);
    console.log(text);
    ajaxRequest({
      url: ajaxUrl + id,
      method: 'PUT',
      data: {
        content: text,
      },
      callback: function(respData) {
        console.log(JSON.parse(respData));
      }
    })
  };


  $('body').on('click', '.one-comment__edit-wrap, .one-comment__edit-cancel', function(e) {
    e.preventDefault();
    var textBlock = $(this).closest('.one-comment__info').find('.one-comment__text');
    var textareaBlock = $(this).closest('.one-comment__info').find('.one-comment__textarea');
    var btnsBlock = $(this).closest('.one-comment__info').find('.one-comment__edit-items');

    $.each([textBlock, textareaBlock, btnsBlock], function(index, value) {
      value.toggleClass('hidden');
    });
  });

  $('body').on('click', '.one-comment__edit-confirm', function(e) {
    e.preventDefault();
    var commentId = $(this).closest('.one-comment__right-wrap').find('input[name="commentId"]').val();
    var text = $(this).closest('.one-comment__info').find('.one-comment__textarea').val();

    editComment(commentId, text);
    $('.all-comments__wrap').html("");
    getComments(currentComments);
  });


});