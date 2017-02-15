Main.prototype.showNewGroup = function(post, callback){
  var setPostId = function(id){
    var postIdHidden = document.getElementById('postId-hidden');
    postIdHidden.value = id;
  };
  setPostId(post.id);

  this.openSection([this.newGroupSection.id], true);
  callback();
};
