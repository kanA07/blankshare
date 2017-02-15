function Main() {
  this.setup();
  this.init();
  Main.setupFunctions.forEach(function(func, index){
    func();
  });
}
Main.setupFunctions = [];

Main.prototype.init = function() {
  // code someting here
  this.logoButton = document.getElementById('logo-button');
  this.logoButton.addEventListener('click', function(){
    this.changeState('postList', {renew: false}, true);
  }.bind(this));


  this.newPostButton = document.getElementById('newPost-button');
  this.newPostButton.addEventListener('click', function(){
    this.changeState('newPost', {}, true);
  }.bind(this));
  // this.organizationSelect = document.getElementById('organization-select');

  this.newPostSection = document.getElementById('newPost-section');
  this.postButton = document.getElementById('post-button');
  this.postButton.addEventListener('click', this.postNew.bind(this));
  this.postsBlock = document.getElementById('posts-block');
  this.detailHeaderSection = document.getElementById('detail-header-section');
  this.detailBodySection = document.getElementById('detail-body-section');
  this.articleBlock = document.getElementById('article-block');
  this.groupsBlock = document.getElementById('groups-block');

  this.postCommentButton = document.getElementById('postComment-button');
  this.postCommentButton.addEventListener('click', this.postComment.bind(this));

  this.newGroupSection = document.getElementById('newGroup-section');
  this.groupPostButton = document.getElementById('group-post-button');
  this.groupPostButton.addEventListener('click', this.postNewGroup.bind(this));

  this.db = firebase.database();
  this.postsDbRef = this.db.ref('/posts/');
  this.groupsDbRef = this.db.ref('/groups/');
  this.settingsDbRef = this.db.ref('/settings/');
  this.commentsDbRef = this.db.ref('/comments/');
  this.fs = firebase.storage();
  this.postFsRef = this.fs.ref();

  this.posts = [];
  this.postId = null;
  this.initTinyMCE();
  this.watchState();

};

Main.prototype.watchState = function(){
  window.addEventListener('popstate', function(event){
    if(!event || !event.state) return;
    var stateCd = event.state.stateCd;
    this.changeState(stateCd, event.state, false);
  }.bind(this));
};

Main.prototype.initState = function(){
  if(!currentUser) return;
  var pathname = location.pathname;
  var ret, stateCd, StateData;

  // /posts/POSTID/groups/LESSONID
  ret = pathname.match(/^\/posts\/(.+)\/groups\/(.+)\/edit$/);
  if(ret && ret.length == 3){
    stateCd = 'groupEdit';
    this.postId = ret[1];
    this.groupId = ret[2];
    stateData = {
      stateCd: stateCd,
      post: {id: this.postId},
      group: {id: this.groupId}
    };
    this.changeState(stateCd, stateData, false);
    return;
  }

  // /posts/POSTID/groups/LESSONID
  ret = pathname.match(/^\/posts\/(.+)\/groups\/(.+)$/);
  if(ret && ret.length == 3){
    stateCd = 'groupDetail';
    this.postId = ret[1];
    this.groupId = ret[2];
    stateData = {
      stateCd: stateCd,
      post: {id: this.postId},
      group: {id: this.groupId}
    };
    this.changeState(stateCd, stateData, false);
    return;
  }

  // /posts/POSTID/edit
  ret = pathname.match(/^\/posts\/(.+)\/new$/);
  if(ret && ret.length == 2){
    stateCd = 'newGroup';
    this.postId = ret[1];
    stateData = {
      stateCd: stateCd,
      post: {id: this.postId}
    };
    this.changeState(stateCd, stateData, false);
    return;
  }

  // /posts/POSTID/edit
  ret = pathname.match(/^\/posts\/(.+)\/edit$/);
  if(ret && ret.length == 2){
    stateCd = 'editPost';
    this.postId = ret[1];
    stateData = {
      stateCd: stateCd,
      post: {id: this.postId}
    };
    this.changeState(stateCd, stateData, false);
    return;
  }

  // /posts/POSTID
  ret = pathname.match(/^\/posts\/(.+)$/);
  if(ret && ret.length == 2){
    stateCd = 'postDetail';
    this.postId = ret[1];
    stateData = {
      stateCd: stateCd,
      post: {id: this.postId}
    };
    this.changeState(stateCd, stateData, false);
    return;
  }

  // /new
  ret = pathname.match(/^\/new$/);
  if(ret){
    stateCd = 'newPost';
    stateData = {
      stateCd: stateCd
    };
    this.changeState(stateCd, stateData, false);
    return;
  }
  // /
  ret = pathname.match(/^\/$/);
  if(ret){
    stateCd = 'postList';
    stateData = {
      stateCd: stateCd,
      renew: true
    };
    this.changeState(stateCd, stateData);
    return;
  }

};

Main.prototype.changeState = function(stateCd, data, isPushState){
  if(typeof isPushState === 'undefined') isPushState = true;
  if(typeof data === 'undefined') data = {};
  var post;

  if(stateCd === 'postList'){
    this.showPostList(data.renew, function(posts){
      if(!isPushState) return;
      var stateData = {
        stateCd: stateCd,
        posts: posts
      };
      tool.pushState(stateData, stateCd, '/');
    });
  } else if(stateCd === 'postDetail'){
    if(!data || !data.post) return;
    post = data.post;
    this.showPostDetail(post, function(post){
      if(!isPushState) return;
      var id = post.id;
      var stateData = {
        stateCd: stateCd,
        post: post
      };
      tool.pushState(stateData, stateCd, '/posts/' + id);
    });
  } else if(stateCd === 'groupDetail'){
    if(!data || !data.post || !data.group) return;
    post = data.post;
    group = data.group;
    this.showGroupDetail(post, group, function(post, group){
      var stateData = {
        stateCd: stateCd,
        post: post,
        group: group
      };
      tool.pushState(stateData, stateCd, '/posts/' + post.id + '/groups/' + group.id);
    });

  } else if(stateCd === 'newPost'){
    this.showNewPost(function(){
      var stateData = {
        stateCd: stateCd
      };
      tool.pushState(stateData, stateCd, '/new');
    });
  } else if(stateCd === 'editPost'){
    if(!data || !data.post) return;
    post = data.post;
    this.showEditPost(post, function(post){
      var id = post.id;
      var stateData = {
        stateCd: stateCd,
        post: post
      };
      tool.pushState(stateData, stateCd, '/posts/' + id + '/edit');
    });
  } else if(stateCd === 'newGroup'){
    if(!data || !data.post) return;
    post = data.post;
    this.showNewGroup(post, function(){
      var id = post.id;
      var stateData = {
        stateCd: stateCd,
        post: post
      };
      tool.pushState(stateData, stateCd, '/posts/' + id + '/new');
    });
  } else if(stateCd === 'editGroup'){
    if(!data || !data.post) return;
    post = data.post;
    group = data.group;
    this.showEditGroup(post, group, function(){
      var postId = post.id;
      var groupId = group.id;
      var stateData = {
        stateCd: stateCd,
        post: post,
        group: group
      };
      tool.pushState(stateData, stateCd, '/posts/' + post.id + '/groups/' + group.id + '/edit');
    });
  }
};

Main.prototype.setup = function(){
  this.loginMessage = document.getElementById('login-message');
  this.loginMessageText = document.getElementById('login-message-text');
  this.tabs = document.getElementsByClassName("tab");
  this.setTabAction(this.tabs);
  this.checkFb();
};


Main.prototype.checkFb = function() {
  if (!window.firebase || !(firebase.app instanceof Function) || !window.config) {
    window.alert('You have not configured and imported the Firebase SDK. ' +
      'Make sure you go through the codelab setup instructions.');
  } else if (config.storageBucket === '') {
    window.alert('Your Firebase Storage bucket has not been enabled. Sorry about that. This is ' +
      'actually a Firebase bug that occurs rarely. ' +
      'Please go and re-generate the Firebase initialisation snippet (step 4 of the codelab) ' +
      'and make sure the storageBucket attribute is not empty. ' +
      'You may also need to visit the Storage tab and paste the name of your bucket which is ' +
      'displayed there.');
  }
};
