Main.prototype.postNewGroup = function(){
  var newPostMessageText = document.getElementById('newGroup-message-text');
  var titleInput = document.getElementById('group-title-input');
  if(titleInput.value === ''){
    newPostMessageText.innerHTML = "Title is required.";
    return;
  }
  var movieInput = document.getElementById('group-movie-input');
  var fileInput = document.getElementById('group-file-input');
  var articleObj = tinyMCE.get('group-article-input');
  if(articleObj.getContent() === ''){
    newPostMessageText.innerHTML = "Article is required.";
    return;
  }

  var groupData = {
    title: titleInput.value,
    article: articleObj.getContent(),
    movie: movieInput.value,
    created_at: firebase.database.ServerValue.TIMESTAMP,
    uid: currentUser.uid
  };

  var postId = this.getPostId();

  var isEdit = history.state && history.state.stateCd === 'editGroup';
  var groupId = null;
  if(isEdit){
    groupId = this.getGroupId();
  } else {
    groupId = tool.uid();
  }
  groupData.id = groupId;

  var afterDone = function(groupId){
    this.groupPostButton.classList.remove('is-loading');
    // this.openSection(['main-section', 'main-body-section']);
    titleInput.value = "";
    movieInput.value = "";
    articleObj.setContent('');
    fileInput.value = "";
    var stateData = {
      renew: true
    };
    stateData.post = {id: postId};
    stateData.group = {id: groupId};
    this.changeState('postDetail', stateData);
  };

  var fileObj = null;
  if(fileInput.files.length > 0) fileObj = fileInput.files[0];

  this.groupPostButton.classList.add('is-loading');

  if(!fileObj){
    this.groupsDbRef.child(postId).child(groupId).update(groupData).then(function(){
      afterDone.bind(this)(groupId);
      return;
    }.bind(this));
  } else {
    var path = [currentUser.uid, Date.now(), fileObj.name].join('/');
    var meta = {
      contentType: fileObj.type
    };
    var display = document.getElementById('display-input-cover').checked ? 'cover' : 'contain';
    this.fs.ref(path).put(fileObj, meta).then(function(snapshot){
      var filePath = snapshot.metadata.fullPath;
      groupData.file = {
        urls: {
          original: this.fs.ref(filePath).toString(),
        },
        name: fileObj.name,
        size: snapshot.metadata.size,
        display: display
      };
      this.groupsDbRef.child(postId).child(groupId).update(groupData).then(function(){
        afterDone.bind(this)(groupId);
        return;
      }.bind(this));
    }.bind(this));
  }
};

Main.prototype.getGroupId = function(){
  var groupIdHidden = document.getElementById('groupId-hidden');
  var id = groupIdHidden.value;
  if(!id) return null;
  if(history){
    if(history.state && history.state.group){
      if(id === history.state.group.id) return id;
    } else {
      return null;
    }
  } else{
    return id;
  }
};
