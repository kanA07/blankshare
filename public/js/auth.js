function FbAuth(callback, opts) {
  this.checkSetup();
  this.setOptions(opts);
  this.setDom();
  this.callback = callback;
  this.authChecked = false;
  this.initAuth();
}

FbAuth.prototype.setDom = function(){
  this.emailInput = document.getElementById(this.emailId);
  this.passwordInput = document.getElementById(this.passwordId);
  this.signOutButton = document.getElementById(this.signOutId);
  this.signInButton = document.getElementById(this.signInId);
  this.signOutButton.addEventListener('click', this.signOut.bind(this));
  this.signInButton.addEventListener('click', this.signIn.bind(this));
};

FbAuth.prototype.setOptions = function(opts){
  this.emailId = 'email';
  this.passwordId = 'password';
  this.signOutId = 'signOut';
  this.signInId = 'signIn';

  if(typeof opts !== 'object') return;
  var chk = function(key, object_type){
    if(key in opts && typeof opts[key] == object_type) return key;
    return false;
  };
  var k = null, t = 'string';
  k = 'email'; if(chk(k, t)) this.emailId = opts[k];
  k = 'password'; if(chk(k, t)) this.passwordId = opts[k];
  k = 'signOut'; if(chk(k, t)) this.signOutId = opts[k];
  k = 'signIn'; if(chk(k, t)) this.signInId = opts[k];

  t = 'function';
  k = 'beforeSignIn'; if(chk(k, t)) this.beforeSignIn = opts[k];
  k = 'beforeSignOut'; if(chk(k, t)) this.beforeSignOut = opts[k];
  k = 'afterSignInSuccess'; if(chk(k, t)) this.afterSignInSuccess = opts[k];
  k = 'afterSignInFailure'; if(chk(k, t)) this.afterSignInFailure = opts[k];
  k = 'afterSignOutSuccess'; if(chk(k, t)) this.afterSignOutSuccess = opts[k];
  k = 'afterSignOutFailure'; if(chk(k, t)) this.afterSignOutFailure = opts[k];
  k = 'afterAuthStateChangedOn'; if(chk(k, t)) this.afterAuthStateChangedOn = opts[k];
  k = 'afterAuthStateChangedOff'; if(chk(k, t)) this.afterAuthStateChangedOff = opts[k];
};

FbAuth.prototype.signIn = function(e){
  if(e) e.preventDefault();
  if(!this.beforeSignIn()) return;
  var email = this.emailInput.value;
  if(!email.match(/@test.com/)) email += "@test.com";
  firebase.auth().signInWithEmailAndPassword(email,  this.passwordInput.value).then(function(value){
    this.afterSignInSuccess(value);
  }, function(error) {
    this.afterSignInFailure(error);
  }, this);
};

FbAuth.prototype.signOut = function(e){
  if(e) e.preventDefault();
  if(!this.beforeSignOut()) return;
  this.auth.signOut().then(function(value){
    this.afterSignOutSuccess();
  }, function(error){
    this.afterSignOutFailure();
  }, this);
};

FbAuth.prototype.beforeSignIn = function(){
  if(this.beforeSignInOR) return this.beforeSignInOR();
  console.log('beforeSignIn');
  return true;
};

FbAuth.prototype.beforeSignOut = function(){
  console.log('beforeSignOut');
  return true;
};

FbAuth.prototype.afterSignInSuccess = function(user){
  console.log('post signIn Success');
};

FbAuth.prototype.afterSignOutSuccess = function(user){
  console.log('post signOut Success');
};

FbAuth.prototype.afterSignInFailure = function(error){
  console.log('post signIn Failure');
  if (error.code === 'auth/wrong-password') {
    alert('Wrong password.');
  } else {
    alert(error.message);
    console.log(error);
  }
};

FbAuth.prototype.afterSignOutFailure = function(error){
  console.log('post signOut Failure');
};

FbAuth.prototype.afterAuthStateChangedOn = function(user){
  console.log('after AuthStateChangedOn', user);
};

FbAuth.prototype.afterAuthStateChangedOff = function(){
  console.log('after AuthStateChangedOff');
};

FbAuth.prototype.onAuthStateChanged = function(user) {
  if(!this.authChecked){
    this.authChecked = true;
    this.callback();
  }
  if (user) {
    this.signOutButton.style.display = 'block';
    this.afterAuthStateChangedOn(user);
  } else {
    this.signOutButton.style.display = 'none';
    this.afterAuthStateChangedOff();
  }
};

FbAuth.prototype.checkSetup = function() {
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

FbAuth.prototype.initAuth = function() {
  this.auth = firebase.auth();
  this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};
