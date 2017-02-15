Main.prototype.showNewPost = function(callback){
  this.openSection([this.newPostSection.id], true);
  callback();
};
