
Main.prototype.showCommentList = function(post){
  if(!post || !post.id) return;
  var postId = post.id;

  var createComment = function(comment){
    return [
      '<article class="media">',
        '<figure class="media-left">',
          '<p class="icon is-large">',
            '<i class="fa fa-user-circle-o"></i>',
          '</p>',
        '</figure>',
        '<div class="media-content">',
          '<div class="content">',
            '<p>',
              '<strong>' + comment.uid + '</strong>',
              '<br>',
              comment.message,
            '</p>',
          '</div>',
        '</div>',
      '</article>'
    ].join('');
  };

  var drawComments = function(comments){
    var html = [];
    comments.forEach(function(item, idx){
      html.push(createComment(item));
    }.bind(this));
    var commentsBlock = document.getElementById('comments');
    commentsBlock.innerHTML = html;
  };

  var ref = this.commentsDbRef.child(postId).orderByChild('created_at');
  ref.once('value').then(function(snapshot) {
    console.log(snapshot);
    var val = snapshot.val();
    var items = [];
    for(var key in val){
      var item = val[key];
      items.push(item);
    }
    drawComments(items);
  }.bind(this));
};
