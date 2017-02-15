Main.prototype.setImageUrl = function(imageUri, imgElement, isBackground, size, callback) {
  // If the image is a Firebase Storage URI we fetch the URL.
  var setIt = function(url){
    if(isBackground){
      url = url.replace(/([\(\)])/g, "\\$1");
      url = "url(" + url + ")";
      imgElement.style.backgroundImage = url;
    } else {
      imgElement.src = url;
    }
  };

  var setOriginal = function(url){
    imgElement.setAttribute('data-original-url', url);
  };

  var targetUri = function(uri, size){
    if(!size) return uri;
    var arr = uri.split(/\./);
    arr.splice(arr.length-1, 0, size);
    return arr.join('.');
  };

  // if (imageUri.startsWith('gs://')) {
  if(imageUri.match(/^gs:\/\//)){
    setIt(Main.LOADING_IMAGE_URL);
    this.fs.refFromURL(targetUri(imageUri, size)).getMetadata().then(function(metadata) {
      var url = metadata.downloadURLs[0];
      setIt(url);
      this.fs.refFromURL(imageUri).getMetadata().then(function(metadata) {
        var url = metadata.downloadURLs[0];
        setOriginal(url);
      });
      if(callback) callback(url);
    }.bind(this), function(reason){
      console.log(reason);
      this.fs.refFromURL(imageUri).getMetadata().then(function(metadata) {
        var url = metadata.downloadURLs[0];
        setIt(url);
        setOriginal(url);
        if(callback) callback(url);
      });
    }.bind(this));
  } else {
    setIt(imageUri);
    if(callback) callback();
  }
};

Main.setupFunctions.push(function(){
  var modalBlock = document.getElementById('imgmodal-block');
  if(!modalBlock) return;
  var modalCloses = modalBlock.getElementsByTagName('button');
  var closeModalFunc = function(){
    var m = document.getElementById('imgmodal-block');
    m.classList.remove('is-active');
  };
  for(var i = 0, len = modalCloses.length; i < len; i++){
    var m = modalCloses[i];
    m.addEventListener('click', closeModalFunc);
  }
  document.getElementById('imgmodal-bg').addEventListener('click', closeModalFunc);
});

Main.prototype.openImageModal = function(url){
  var img = document.getElementById('imgmodal-image');
  img.setAttribute('src', Main.LOADING_IMAGE_URL);
  var modalBlock = document.getElementById('imgmodal-block');
  modalBlock.classList.add('is-active');
  setTimeout(function(){
    img.setAttribute('src', url);
  },1);

};

Main.prototype.getPostId = function(){
  var postIdHidden = document.getElementById('postId-hidden');
  var id = postIdHidden.value;
  if(!id) return null;
  if(history){
    if(history.state && history.state.post){
      if(id === history.state.post.id) return id;
    } else {
      return null;
    }
  } else{
    return id;
  }
};

Main.prototype.getPost = function(postId){
  var post = null;
  this.posts.forEach(function(elem, idx){
    if(elem.id === postId){
      post = elem;
      return;
    }
  });
  if(post) return post;
  console.error('invalid post id');
  return null;
};

Main.prototype.postComment = function(){
  var commentText = document.getElementById('comment-text');
  if(commentText.value === '') return;

  var postId = this.getPostId();

  var data = {
    message: commentText.value,
    created_at: firebase.database.ServerValue.TIMESTAMP,
    uid: currentUser.uid
  };

  var setDb = function(data){
    this.commentsDbRef.child(postId).push(data);
    this.postCommentButton.classList.remove('is-loading');
    commentText.value = '';
  };

  this.postCommentButton.classList.add('is-loading');
  setDb.bind(this)(data, this);


};

Main.prototype.setTabAction = function(tabs){
  if(!tabs) return;

  var func = function(){
    var tabs = this.parentNode.children;
    for(var j = 0; j < tabs.length; j++){
      var tab = tabs[j];
      var link = tab.children[0];
      var blockName = link.getAttribute('href').replace(/^#/,'');
      var tabBlock = document.getElementById(blockName);
      if(tab === this){
        tabBlock.style.display = 'block';
        this.classList.add('is-active');
      } else {
        tabBlock.style.display = 'none';
        tab.classList.remove('is-active');
      }
    }
  };

  for(var i = 0, len = tabs.length; i < len; i++){
    tabs[i].addEventListener("click", func);
  }
};

Main.prototype.openSection = function(sectionIds, isSingle){
  if(typeof isSingle === 'undefined') isSingle = true;
  var sections = document.getElementsByTagName('section');
  for(var i = 0; i < sections.length; i++){
    var section = sections[i];
    if(sectionIds.indexOf(section.id) > -1){
      section.style.display = 'block';
    } else if(isSingle) {
      section.style.display = 'none';
    }
  }
};

Main.prototype.initTinyMCE = function(){
  tinymce.init({
    selector: '#article-input',
    theme: 'modern',
    menubar: false,
    plugins: [
      'advlist autolink lists link image charmap print preview hr anchor pagebreak',
      'searchreplace wordcount visualblocks visualchars code fullscreen',
      'emoticons template paste textcolor colorpicker textpattern imagetools codesample toc'
    ],
    toolbar1: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link | preview | forecolor backcolor',
    templates: [
      { title: 'Test template 1', content: 'Test 1' },
      { title: 'Test template 2', content: 'Test 2' }
    ]
  });
  tinymce.init({
    selector: '#group-article-input',
    theme: 'modern',
    menubar: false,
    plugins: [
      'advlist autolink lists link image charmap print preview hr anchor pagebreak',
      'searchreplace wordcount visualblocks visualchars code fullscreen',
      'emoticons template paste textcolor colorpicker textpattern imagetools codesample toc'
    ],
    toolbar1: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link | preview | forecolor backcolor',
    templates: [
      { title: 'Test template 1', content: 'Test 1' },
      { title: 'Test template 2', content: 'Test 2' }
    ]
  });
};
