Main.prototype.showPostDetail = function(post, callback){
  var setPostId = function(id){
    var postIdHidden = document.getElementById('postId-hidden');
    postIdHidden.value = id;
  };

  var createDetailBody = function(post){
    var article = post.article;
    if(article) article = article.replace(/\n/, '<br />');
    return article;
  };

  var createTags = function(post){
    var tagSpans = [];
    if(post.tags && post.tags.length > 0){
      post.tags.split(',').forEach(function(tag, idx){
        var tagSpan = [
          '<span class="tag is-success ',
          idx < 2 ? '' : 'is-hidden-mobile',
          '">',
          tag.trim(),
          '</span>'
        ].join('');
        tagSpans.push(tagSpan);
      });
    }
    return tagSpans.join('');
  };

  var createGroupCard = function(post, item){
     if(document.getElementById('group-' + item.id)) return null;
     var card = document.createElement('div');
     // card.classList.add('tile','is-parent', 'is-4');
     card.classList.add('column', 'is-half-mobile', 'is-one-third-tablet');
     card.setAttribute('id', 'group-' + item.id);
     card.addEventListener('click', this.openGroup.bind(this, post, item));
     card.innerHTML = Main.GROUP_CARD_TEMPLATE;
     card.querySelector('p.title').textContent = item.title;

     if(item.file && item.file.urls){
       var imgUri = item.file.urls.original;
       var imgElement = card.querySelector('div.card-image');
       if(item.file.display === 'contain'){
         var n = Math.floor(Math.random()*Main.BG_CLASSES.length) + 1;
         var klass = 'bg' + ('0' + n).slice(-2);
         imgElement.classList.add(klass);
       }
       this.setImageUrl(imgUri, imgElement, true, 'small', function(){
         if(item.file.display === 'cover'){
           imgElement.classList.remove('contain');
           imgElement.classList.add('cover');
         }
       });
     }
     return card;
  };


  var drawDetail = function(post){
    this.articleBlock.innerHTML = createDetailBody(post);
    var postTitle = document.getElementById('postTitle');
    postTitle.innerHTML = post.title;

    var tags = document.getElementById('post-tags');
    tags.innerHTML = createTags(post);

    var postFileImg = document.getElementById('postFileImg');
    var url = '';
    if(post.file && post.file.urls){
      url = post.file.urls.original;
    } else {
      url = this.defaults.imageUrl;
    }
    this.setImageUrl(url, postFileImg, false, 'small');

    var editPostButton = document.getElementById('editPost-button');
    if(currentUser.uid === post.uid){
      editPostButton.style.display = 'block';
      editPostButton.onclick = function(){
        this.changeState('editPost', {post: post}, true);
      }.bind(this);
    } else {
      editPostButton.style.display = 'none';
    }

    var sectionIds = [
      this.detailHeaderSection.id,
      this.detailBodySection.id
    ];
    this.openSection(sectionIds, true);
    callback(post);
  };

  if(post.id) setPostId(post.id);

  if(post.id && (!post.title || !post.article)){
    var ref = main.postsDbRef.child(post.id);
    ref.once('value').then(function(snapshot){
      var post = snapshot.val();
      drawDetail.bind(this)(post);
      // this.showCommentList.bind(this)(post);
    }.bind(this));
  } else {
    drawDetail.bind(this)(post);
    // this.showCommentList.bind(this)(post);
  }
};

// Main.prototype.createCardHeader = function(post){
//   var id = post.id;
//   var url = '';
//   if(post.file){
//     url = post.file.url;
//   } else {
//     url = this.defaults.imageUrl;
//   }
//   return [
//     '<div class="hero-body cardheader">',
//       '<div class="container has-text-centered">',
//         '<a id="editPostButton" class="button is-pulled-right" href="javascript:void(0);" style="display:none;">',
//           '<span class="icon">',
//             '<i class="fa fa-pencil"></i>',
//           '</span>',
//           '<span>Edit</span>',
//         '</a>',
//         '<h1 class="title">',
//           post.title,
//         '</h1>',
//         '<h3 class="subtitle">',
//           (new Date(post.created_at)).toLocaleDateString(),
//         '</h3>',
//         '<div class="columns">',
//           '<div class="column is-half is-offset-one-quarter">',
//             '<figure class="image is-2by1">',
//               '<img src="' + url + '">',
//             '</figure>',
//           '</div>',
//         '</div>',
//       '</div>',
//     '</div>'
//   ].join('');
// };
