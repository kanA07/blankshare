Main.prototype.showGroupDetail = function(post, group, callback){

  var methods = this.showGroupDetailMethods(this);
  if(!group.id) return;
  if(group.title){
    methods.setupButton(post, group);
    methods.drawContents(post, group);
    methods.openPage(post, group, callback);
  } else {
    var ref = this.groupsDbRef.child(post.id).child(group.id);
    ref.once('value').then(function(snapshot) {
      console.log(snapshot.val());
      group = snapshot.val();
      var refPost = this.postsDbRef.child(post.id);
      refPost.once('value').then(function(snapshot2){
        post = snapshot2.val();
        methods.setupButton(post, group);
        methods.drawContents(post, group);
        methods.openPage(post, group, callback);
      }.bind(this));
    }.bind(this));
  }
};

Main.prototype.showGroupDetailMethods = function(scope){
  return {
    setupButton: function(post, group){
      if(!currentUser.admin) return;
      var btn = document.getElementById('editGroup-button');
      btn.style.display = 'block';
      btn.addEventListener('click', scope.showEditGroup.bind(scope, post, group, null));
    },
    drawContents: function(post, group){
      var subtitle = document.getElementById('groupSubTitle');
      subtitle.innerHTML = [
        "<a href='", "/posts/", post.id, "'>",
        post.title,
        "</a>"
      ].join('');
      document.getElementById('groupTitle').innerHTML = group.title;

      var groupFileImg = document.getElementById('groupFileImg');
      var url = '';
      if(group.file && group.file.urls){
        url = group.file.urls.original;
      } else {
        url = Main.DEFAULT_IMAGEURL;
      }
      scope.setImageUrl(url, groupFileImg, false, 'small', function(){
        groupFileImg.addEventListener('click', function(){
          var imgurl = groupFileImg.getAttribute('src');
          var originalUrl = groupFileImg.getAttribute('data-original-url');
          if(originalUrl) imgurl = originalUrl;
          scope.openImageModal(imgurl);
        });
      });


      var yid = tool.getYoutubeId(group.movie);
      if(yid){
        var movieIframe = document.getElementById('group-movie');
        var yembedUrl = "https://www.youtube.com/embed/" + yid + "?rel=0&showinfo=0";
        movieIframe.setAttribute('src', yembedUrl);
      }
    },

    openPage: function(post, group, callback){
      var pages = ['group-header-section', 'group-body-section'];
      scope.openSection(pages, true);
      callback(post, group);
    }
  };
};
