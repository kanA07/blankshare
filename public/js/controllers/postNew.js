Main.prototype.postNew = function(){
  var newPostMessageText = document.getElementById('newPost-message-text');
  var titleInput = document.getElementById('title-input');
  if(titleInput.value === ''){
    newPostMessageText.innerHTML = "Title is required.";
    return;
  }
  var tagsInput = document.getElementById('tags-input');
  var gradeInput = document.getElementById('grade-input');
  var subjectInput = document.getElementById('subject-input');
  var dateInput = document.getElementById('date-input');
  var movieInput = document.getElementById('movie-input');
  var fileInput = document.getElementById('file-input');
  var articleObj = tinyMCE.get('article-input');
  if(articleObj.getContent() === ''){
    newPostMessageText.innerHTML = "Article is required.";
    return;
  }

  var postData = {
    title: titleInput.value,
    tags: tagsInput.value,
    article: articleObj.getContent(),
    subject: subjectInput.value,
    grade: gradeInput.value,
    date: dateInput.value,
    movie: movieInput.value,
    created_at: firebase.database.ServerValue.TIMESTAMP,
    uid: currentUser.uid
  };

  var postId = null;
  var isEdit = history.state && history.state.stateCd === 'editPost';

  if(isEdit){
    postId = this.getPostId();
  } else {
    postId = tool.uid();
  }
  postData.id = postId;

  var afterDone = function(postId){
    this.postButton.classList.remove('is-loading');
    // this.openSection(['main-section', 'main-body-section']);
    titleInput.value = "";
    tagsInput.value = "";
    gradeInput.value = "";
    subjectInput.value = "";
    dateInput.value = "";
    movieInput.value = "";
    articleObj.setContent('');
    fileInput.value = "";
    var stateData = {
      renew: true
    };
    if(isEdit){
      stateData.post = {id: postId};
      this.changeState('postDetail', stateData);
    } else {
      this.changeState('postList', stateData);
    }
  };

  var fileObj = null;
  if(fileInput.files.length > 0) fileObj = fileInput.files[0];

  this.postButton.classList.add('is-loading');

  if(!fileObj){
    this.postsDbRef.child(postId).update(postData).then(function(){
      afterDone.bind(this)(postId);
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
      postData.file = {
        urls: {
          original: this.fs.ref(filePath).toString(),
        },
        name: fileObj.name,
        size: snapshot.metadata.size,
        display: display
      };
      this.postsDbRef.child(postId).update(postData).then(function(){
        afterDone.bind(this)(postId);
        return;
      }.bind(this));
    }.bind(this));
  }
};
