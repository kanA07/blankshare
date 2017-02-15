Main.prototype.openGroup = function(post, group){
  if(!post || !group) return;
  this.changeState('groupDetail', {post: post, group: group}, true);
};
