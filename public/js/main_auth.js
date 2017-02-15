

Main.prototype.fbAuthCallback = function(){
  console.log('callbacked');
};

// settings for auth
Main.prototype.fbAuthOpts = function(scope){
  return {
    // called just before sending signIn request (after button clicked)
    beforeSignIn: function(){
      console.log('overload beforeSignIn 2');
      // validation
      if(this.emailInput.value.length < 4){
        alert('invalid email address');
        return false;
      }
      if(this.passwordInput.value.length < 2){
        alert('invalid password address');
        return false;
      }
      // change the button state into loading
      this.signInButton.classList.add('is-loading');
      return true;
    },
    beforeSignOut: function(){
      return true;
    },
    // called after signin successfully
    afterSignInSuccess: function(value){
      console.log('overload afterSignInSuccess 2', value);
      // remove loading state from the button
      this.signInButton.classList.remove('is-loading');
    },
    // called after signin fail
    afterSignInFailure: function(error){
      console.log('after signIn Failure 2', error);
      // remove loading state from the button
      this.signInButton.classList.remove('is-loading');
      // show error message
      scope.loginMessageText.innerHTML = error.message;
      scope.loginMessage.style.display = 'block';
    },
    // called after auth state changed into login
    afterAuthStateChangedOn: function(user){
      // hide login section and show main section
      if(window.currentUser && window.currentUser.admin){
        scope.newPostButton.style.display = 'block';
      }
      // scope.organizationSelect.style.display = 'block';
      scope.openSection(['main-section', 'main-body-section'], true);
      console.log('after auth state changed on', user);
      if(user.email === 'allistair@test.com') user.admin = true;
      window.currentUser = user;
      scope.initState();
    },
    // called after auth state changed into logout
    afterAuthStateChangedOff: function(){
      // show login section and hide main section
      if(window.currentUser && window.currentUser.admin){
        scope.newPostButton.style.display = 'none';
      }
      // scope.organizationSelect.style.display = 'none';
      window.currentUser = null;
      scope.openSection(['login-section'], true);
      console.log('after auth state changed off');
    }
  };
};
