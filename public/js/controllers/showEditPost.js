Main.prototype.showEditPost = function(post, callback){
  var setPostId = function(id){
    var postIdHidden = document.getElementById('postId-hidden');
    postIdHidden.value = id;
  };
  setPostId(post.id);
  var updateForm = function(post){
    // var articleInput = document.getElementById('article-input');
    var articleObj = tinyMCE.get('article-input');
    articleObj.setContent(post.article);

    var titleInput = document.getElementById('title-input');
    titleInput.value = post.title;

    var tagsInput = document.getElementById('tags-input');
    tagsInput.value = post.tags;

    var postFile = document.getElementById('postFile');
    var url = '';
    if(post.file){
      postFile.style.display = 'block';
      this.setImageUrl(post.file.urls.original, postFile, false, null);
      // postFile.src = post.file.url;
    } else {
      postFile.style.display = 'none';
    }

    var gradeInput = document.getElementById('grade-input');
    gradeInput.value = post.grade;

    var subjectInput = document.getElementById('subject-input');
    subjectInput.value = post.subject;

    var dateInput = document.getElementById('date-input');
    dateInput.value = post.date;

    var movieInput = document.getElementById('movie-input');
    movieInput.value = post.movie || '';

    this.openSection([this.newPostSection.id], true);
    callback(post);
  }.bind(this);

  var ref = main.postsDbRef.child(post.id);
  ref.once('value').then(function(snapshot){
    var post = snapshot.val();
    updateForm.bind(this)(post);
  }.bind(this));
};
