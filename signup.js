  
 //calls  initialize on pageload
 window.onload = function() {
    initApp();
    }

  //listens for submit button and  then handles signup 
  function initApp() {
        document.getElementById('vendor-signup').addEventListener('submit', function(event)
        {
            event.preventDefault();
            handleSignUp();
        });
    }
  
  /**
     * Handles the sign up button press.
     */
    
    function handleSignUp() {
        
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        if (email.length < 4) {
          alert('Please enter an email address.');
          return;
        }
        if (password.length < 4) {
          alert('Please enter a password.');
          return;
        }
        // Create user with email and pass.
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
          // user signed in
          document.getElementById("signedup-div").classList.remove("reveal-if-active");
          document.getElementById("signedup-div").classList.add("visible");
          document.getElementById("signup-form-container").classList.add("reveal-if-active");
          //since this automatically signs the user in, logout from this page.
          firebase.auth().signOut();
       }).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
          } else {
            alert(errorMessage);
          }
          console.log(error);
        });
      }
  
      // /**
      //  * Sends an email verification to the user.
      //  */
      // function sendEmailVerification() {
      //   // [START sendemailverification]
      //   firebase.auth().currentUser.sendEmailVerification().then(function() {
      //     // Email Verification sent!
      //     // [START_EXCLUDE]
      //     alert('Email Verification Sent!');
      //     // [END_EXCLUDE]
      //   });
      //   // [END sendemailverification]
      // }
  
