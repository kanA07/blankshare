function Tool() {
}

Tool.prototype.uid = function(k){
  var base = '0123456789abcdefghijklmnopqrstuvwxyz';
  k = k || 6;
  var ret = [];
  for (var i = 0; i < k; i++) {
    ret.push(base.charAt(Math.floor(Math.random() * base.length)));
  }
  return ret.join('');
};

Tool.prototype.pushState = function(state, title, url){
  if( window.history && window.history.pushState ){
    window.history.pushState(state, title, url);
  }
};

Tool.prototype.loadFile = function(fileName, callbackSuccess, callbackFailure){
  if(!callbackSuccess) return;
  httpObj = new XMLHttpRequest();
  httpObj.open('GET', fileName + "?" + (new Date()).getTime(), true);
  httpObj.send(null);
  httpObj.onreadystatechange = function(){
    if((httpObj.readyState == 4) && (httpObj.status == 200) ){
      // console.log(httpObj.responseText);
      callbackSuccess(httpObj.responseText);
    } else {
      if(callbackFailure) callbackFailure(httpObj);
    }
  };
};

Tool.prototype.getYoutubeId = function(url){
  var yid = '';
  url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  if(url[2] !== undefined) {
    yid = url[2].split(/[^0-9a-z_\-]/i);
    yid = yid[0];
  }
  else {
    yid = url;
  }
  return yid;
};
