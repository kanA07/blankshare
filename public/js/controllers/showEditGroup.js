Main.prototype.showEditGroup = function(post, group, callback){
  var setPostId = function(id){
    var postIdHidden = document.getElementById('postId-hidden');
    postIdHidden.value = id;
  };
  setPostId(post.id);

  var setGroupId = function(id){
    var groupIdHidden = document.getElementById('groupId-hidden');
    groupIdHidden.value = id;
  };
  setGroupId(group.id);

  var updateForm = function(group){
    // var articleInput = document.getElementById('article-input');
    var articleObj = tinyMCE.get('group-article-input');
    articleObj.setContent(group.article);

    var titleInput = document.getElementById('group-title-input');
    titleInput.value = group.title;

    var postFile = document.getElementById('group-postFile');
    var url = '';
    if(group.file){
      postFile.style.display = 'block';
      this.setImageUrl(group.file.urls.original, postFile, false, null);
      // postFile.src = post.file.url;
    } else {
      postFile.style.display = 'none';
    }

    var movieInput = document.getElementById('group-movie-input');
    movieInput.value = group.movie || '';

    this.openSection([this.newGroupSection.id], true);
    if(callback) callback(group);
  };

  var ref = main.groupsDbRef.child(post.id).child(group.id);
  ref.once('value').then(function(snapshot){
    var group = snapshot.val();
    updateForm.bind(this)(group);
  }.bind(this));

};
