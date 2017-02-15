Main.MAIN_SECTION_HEADER = [
  '<div class="container">',
    '<div class="columns">',
      '<div class="column is-8">',
        '<div id="header-img" class="card-image cover" style="background-image: url(/img/notebookcamera.jpg);"></div>',
      '</div>',
      '<div class="column is-4">',
        '<h1 id="header-title" class="title">みんなのノートをシェアしよう</h1>',
      '</div>',
    '</div>',
  '</div>'
].join('');

Main.prototype.showPostList = function(isRenew, callback){

  this.mainSection = document.getElementById('main-section');
  this.mainBodySection = document.getElementById('main-body-section');

  if(!isRenew && this.posts.length > 0){
    this.drawList.bind(this, this.posts, callback)();
    return;
  }

  // draw list
  var ref = this.postsDbRef.orderByChild('created_at').limitToLast(12);
  ref.once('value').then(function(snapshot) {
    var items = [];
    snapshot.forEach(function(cSnapshot){
      var id = cSnapshot.key;
      var item = cSnapshot.val();
      items.unshift(item);
    }.bind(this));
    this.posts = items;
    if(items.length > 0) this.drawList.bind(this, items, callback)();
  }.bind(this));

  // draw header
  // todo: get organization info
  if(true){
    var org = {
      title: ['ノートをシェアしよう', '暗記シートを作ろう'],
      file:{
        display: 'cover',
        urls:{
          original: '/img/notebookcamera.jpg'
        }
      }
    };
    this.drawListHeader(org);
  }
};

Main.prototype.drawList = function(posts, callback){
  var html = [];
  var headerPost = null;
  this.postsBlock.innerHTML = '';

  posts.forEach(function(item, idx){
    var card = this.createListCard(item);
    if(!card) return;
    this.postsBlock.appendChild(card);
  }.bind(this));

  // this.mainSection.appendChild(headerPost);

  var sectionIds = [
    this.mainSection.id,
    this.mainBodySection.id
  ];
  this.openSection(sectionIds, true);
  if(callback) callback(posts);
};

Main.prototype.createListCard = function(item){
  if(document.getElementById('post-' + item.id)) return null;
  var card = document.createElement('div');
  // card.classList.add('tile','is-parent', 'is-4');
  card.classList.add('column', 'is-half-mobile', 'is-one-third-tablet');
  card.setAttribute('id', 'post-' + item.id);
  card.addEventListener('click', this.openPost.bind(this, item.id));
  card.innerHTML = Main.CARD_TEMPLATE;
  if(item.title instanceof Array){
    card.querySelector('p.title').innerHTML = item.title.join('<br>');
  } else {
    card.querySelector('p.title').textContent = title;
  }
  var tagSpans = [];
  if(item.tags && item.tags.length > 0){
    item.tags.split(',').forEach(function(tag, idx){
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
  card.querySelector('div.tags').innerHTML = tagSpans.join('');

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

Main.prototype.drawListHeader = function(org){
  this.mainSection.innerHTML = '';
  var card = this.createListHeader(org);
  if(!card) return;
  this.mainSection.appendChild(card);
};

Main.prototype.createListHeader = function(item){

  if(document.getElementById('organization-catch')) return null;
  var hblock = document.createElement('div');
  hblock.classList.add('hero-body');
  hblock.setAttribute('id', 'organization-catch');
  hblock.addEventListener('click', this.openPost.bind(this, item.id));
  hblock.innerHTML = Main.MAIN_SECTION_HEADER;
  if(item.title instanceof Array){
    hblock.querySelector('h1.title').innerHTML = item.title.join('<br>');
  } else {
    hblock.querySelector('h1.title').textContent = item.title;
  }


  if(item.file && item.file.urls){
    var imgUri = item.file.urls.original;
    var imgElement = hblock.querySelector('div.card-image');

    var n = Math.floor(Math.random()*Main.BG_CLASSES.length) + 1;
    var klass = 'bg' + ('0' + n).slice(-2);
    // imgElement.classList.add(klass);
    hblock.classList.add(klass);

    this.setImageUrl(imgUri, imgElement, true, null, function(){
      if(item.file.display === 'cover'){
        imgElement.classList.remove('contain');
        imgElement.classList.add('cover');
      }
    });

  }

  return hblock;
};

Main.prototype.openPost = function(id){
  console.log(this);
  var post = this.getPost(id);
  if(!post) return;
  this.changeState('postDetail', {post: post}, true);
};
