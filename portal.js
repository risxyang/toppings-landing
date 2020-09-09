    //hide portal on page load
    window.onload = function()
    {
      document.getElementById("portal").style.display = "none";
    }
    
    //handles login, authentication, page setup
    function login()
    {
      //prevent page auto-refresh
        event.preventDefault();

        var email = document.getElementById("email").value;
        var password = document.getElementById("password").value;


        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            //specify error messages
            if (errorCode === 'auth/wrong-password') {
              alert('Wrong password.');
            } else {
              alert(errorMessage);
            }
            console.log(error);
          });

        
          //checks if there's been a successful sign in
          firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
            // User is signed in.
            var user = firebase.auth().currentUser;
        
            if(user != null){
        
                var uid = user.uid;
                var usernameRef = firebase.database().ref('/users/' + uid + '/username');
                  usernameRef.on('value', function(snapshot) {
                    var displayName = snapshot.val();
                    if(displayName == null)
                    {
                      displayName = "";
                      //add more  handling here for missing user settings. possibly hide div
                    }
                    document.getElementById("user_para").innerHTML = "Welcome " + displayName + "!";
                  });
                
                //ON PORTAL LOAD
                //initializing visible / nonvisible elements 
                document.getElementById("portal").style.display = "block";
                document.getElementById("form").style.display = "none";
                document.getElementById("settings-form").style.display = "none";
                document.getElementById("settings-confirm").style.display = "none";
                document.getElementById("menu-add").style.display = "none";
                document.getElementById("promo-add").style.display = "none";

                //basic setup: show user settings, show user's menu items and promotions
                getSettings();
                displayMenuData();
                displayPromos();
            }
        
             }
        });
          
      
      
      }

      //activated when user presses "add promotion" button (shows form)
      function addPromo()
      {
        //display form
        document.getElementById("promo-add").style.display = "initial";
        document.getElementById("promo-add-button").style.display = "none";
        
      }

      //hides form 
      function cancelAddPromo()
      {
        //redisplay buttons
        document.getElementById("promo-add").style.display = "none";
        document.getElementById("promo-add-button").style.display = "initial";
      }

      //on submission of form
      function addPromoSubmit()
      {
        //prevent refresh of page
        event.preventDefault(); 
        //redisplay buttons
        document.getElementById("promo-add").style.display = "none";
        document.getElementById("promo-add-button").style.display = "initial";

        //submit data to firebase
        var user = firebase.auth().currentUser;
        var uid = user.uid;
        //Get Form Data
        var name = document.getElementById("promo-add").elements[0].value;
        var desc = document.getElementById("promo-add").elements[1].value;
        //Write data to db
        var promoListRef = firebase.database().ref('users/' + uid + '/promos');
        var newPromoListRef = promoListRef.push();
        newPromoListRef.set({
          name: name,
          desc: desc,
        });

        document.getElementById("promoapp").innerHTML = "";
        setTimeout(displayPromos(), 5000);
        //clear the form
        document.getElementById("promo-add").reset();
      }

      //takes info of one menu item and handles display formatting (using templates), is called within displayPromos
      function showPromo(pcontainer, template, name, desc) {        
        pcontainer.append(Mustache.render(template, { name, desc }));
        console.log("appended promo");
      }

      //displays all active promotions
      function displayPromos()
      {
        var user = firebase.auth().currentUser;
        var uid = user.uid;
        //clear current menu
        //get current number of menu items
        var promoListRef = firebase.database().ref('users/' + uid + '/promos');
        promoListRef.once("value").then(function(snapshot) {
          var numPromos = snapshot.numChildren();

          $(document).ready(function(){
        
            $(() => {
              const tmpl = $('#promo_template').html()
              const pcontainer = $('#promoapp');
              
              //for each item  in the menu item list, pass in its price, name, and img file into the add item function
              snapshot.forEach(function(childSnapshot) {
                var name = childSnapshot.child("name").val();
                var desc = childSnapshot.child("desc").val();
                showPromo(pcontainer, tmpl, name, desc); 
              }); 
              pcontainer.on('click', '.del_el', (e) => {
                $(e.target).closest('.promo').remove();
              });
            });
          });

          document.getElementById("promoCount").innerHTML = "There are currently " + numPromos + " active promotions saved for your store.";
        });
      }

      //delete a single promotion
      function deletePromo(promoName)
      {
        var user = firebase.auth().currentUser;
        var uid = user.uid;
        let delRef = firebase.database().ref('users/' + uid + '/promos');
        //delete item that has this item name
        delRef.orderByChild('name').equalTo(promoName).on("value", function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            delRef.child(childSnapshot.key).remove();
          });
      });
      //redisplay count of # of active promotions 
      countPromos();
      }

      function countPromos()
      {
        uid = firebase.auth().currentUser.uid;
        var promoListRef = firebase.database().ref('users/' + uid + '/promos');
        promoListRef.once("value").then(function(snapshot) {
          var numPromos = snapshot.numChildren();
          document.getElementById("promoCount").innerHTML = "There are currently " + numPromos + " active promotions saved for your store.";
        });

      }

      //displays menu add form
      function addMenuItem()
      {
        document.getElementById("menu-add").style.display = "block";
        document.getElementById("menu-add-button").style.display = "none";
        document.getElementById("refresh-menu-button").style.display = "none";
      }

      //hides menu add form
      function cancelAddMenuItem()
      {
        document.getElementById("menu-add").style.display = "none";
        document.getElementById("menu-add-button").style.display = "initial";
        document.getElementById("refresh-menu-button").style.display = "initial";
      }

      //on hitting submit of menu add form
      function addMenuItemSubmit()
      {
        event.preventDefault();
        var user = firebase.auth().currentUser;
        var uid = user.uid;
        //Get Form Data
        var name = document.getElementById("menu-add").elements[0].value;
        var price = document.getElementById("menu-add").elements[1].value;
        var file = document.getElementById("menu-add").elements[2].files[0];
        //Write data to db
        var menuListRef = firebase.database().ref('users/' + uid + '/menu items');
        var newMenuListRef = menuListRef.push();
        newMenuListRef.set({
          name: name,
          price: price,
          img: file.name
        });
        // Create a Storage Ref w/ username
        var storageRef = firebase.storage().ref(user + '/menu/' + file.name);
        // Upload file
        var task = storageRef.put(file);
        //Hide form
        document.getElementById("menu-add").style.display = "none";
        document.getElementById("menu-add-button").style.display = "initial";
        document.getElementById("refresh-menu-button").style.display = "initial";

        document.getElementById("app").innerHTML = "";
        setTimeout(displayMenuData(), 5000);
        
        //clear the form
        document.getElementById("menu-add").reset();
      }

      /*DYNAMICALLLY DISPLAY MENU ITEMS*/

   
      function addItem(mcontainer, template, name, price, img) {        
        mcontainer.append(Mustache.render(template, { name, price, img }));
        console.log("appended");
      }
      

    
      //displays all Menu Items (fetches from DB and handles formatting)
      function displayMenuData()
      {
        var user = firebase.auth().currentUser;
        var uid = user.uid;
        //clear current menu
        //get current number of menu items
        var menuListRef = firebase.database().ref('users/' + uid + '/menu items');
        menuListRef.once("value").then(function(snapshot) {
          var numItems = snapshot.numChildren();

          $(document).ready(function(){
        
            $(() => {
              const tmpl = $('#item_template').html()
              const mcontainer = $('#app');
              
              //for each item  in the menu item list, pass in its price, name, and img file into the add item function
              snapshot.forEach(function(childSnapshot) {
                var name = childSnapshot.child("name").val();
                var price = childSnapshot.child("price").val();
                var imgName = childSnapshot.child("img").val();
                //get img file from storage
                var imgRef = firebase.storage().ref(user + '/menu/').child(imgName);
                // Get the download URL
                imgRef.getDownloadURL().then(function(url) {
                 addItem(mcontainer, tmpl, name, price, url); 
                }).catch(function(error) {
                  switch (error.code) {
                    case 'storage/object-not-found':
                      // File doesn't exist
                      break;
                    case 'storage/unauthorized':
                      // User doesn't have permission to access the object
                      break;
                    case 'storage/canceled':
                      // User canceled the upload
                      break;
                    case 'storage/unknown':
                      // Unknown error occurred, inspect the server response
                      break;
                  }
                });
              }); 
              mcontainer.on('click', '.del_el', (e) => {

                $(e.target).closest('.item-container').remove();
              });
            });
          });

          document.getElementById("menuCount").innerHTML = "There are currently " + numItems + " menu items saved for your store.";
        });
        
      }

      //redisplay menu items 
      function refreshMenu()
      {
        document.getElementById("app").innerHTML = "";
        displayMenuData();
      }

      //delete a  menu item
      function deleteMenuItem(itemName)
      {
        var user = firebase.auth().currentUser;
        var uid = user.uid;
        let delRef = firebase.database().ref('users/' + uid + '/menu items');
        //delete item that has this item name
        delRef.orderByChild('name').equalTo(itemName).on("value", function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            //remove the menu item's image from storage
              //get the img name
              var imgName = childSnapshot.child("img").val();
               //remove the menu item's image from storage
              var imgDelRef = firebase.storage().ref(user + '/menu/' + imgName);
              // Delete the file
              imgDelRef.delete().then(function() {
                // File deleted successfully
              }).catch(function(error) {
                // Uh-oh, an error occurred!
              });
            delRef.child(childSnapshot.key).remove();
          });
      });

      //redisplay menu count
      countMenu();
      }

      function countMenu()
      {
        uid = firebase.auth().currentUser.uid;
        var menuListRef = firebase.database().ref('users/' + uid + '/menu items');
        menuListRef.once("value").then(function(snapshot) {
          var numItems = snapshot.numChildren();
          document.getElementById("menuCount").innerHTML = "There are currently " + numItems + " menu items saved for your store.";
        });

      }

      //write user settings to server
      //called by submitSettings
      function writeUserData() {
        var name = document.getElementById("settings-form").elements[0].value;
        var email = document.getElementById("settings-form").elements[1].value;
        var phone = document.getElementById("settings-form").elements[2].value;
        var vbname = document.getElementById("settings-form").elements[3].value;
        var vbaddress = document.getElementById("settings-form").elements[4].value;
        var user = firebase.auth().currentUser;
        uid = user.uid;

        var updates = {};
        updates['users/' + uid + '/username'] = name;
        updates['users/' + uid + '/email'] = email;
        updates['users/' + uid + '/phone'] = phone;
        updates['users/' + uid + '/vbname'] = vbname;
        updates['users/' + uid + '/vbaddress'] = vbaddress;
        firebase.database().ref().update(updates);

        var user = firebase.auth().currentUser;
        user.updateEmail(email).then(function() {
        // Update successful.
            }).catch(function(error) {
         // An error happened.
        });
      }

      //allow user to  modify settings (also displays the current info in the text entry)
    function modifySettings()
    {
      event.preventDefault();
      document.getElementById("settings-form").style.display = "block";
      document.getElementById("current-settings").style.display = "none";
      document.getElementById("modif-settings-button").style.display = "none";

      var uid = firebase.auth().currentUser.uid;
      //display current username
      var usernameRef = firebase.database().ref('/users/' + uid + '/username');
      usernameRef.on('value', function(snapshot) {
        document.getElementById('user_name').value = snapshot.val();
      });
      //display current phone
      var phoneRef = firebase.database().ref('/users/' + uid + '/phone');
      phoneRef.on('value', function(snapshot) {
        document.getElementById('user_phone').value = snapshot.val();
      });
      //display current email
      var emailRef = firebase.database().ref('/users/' + uid + '/email');
      emailRef.on('value', function(snapshot) {
        document.getElementById('user_email').value = snapshot.val();
      });
      //display current vendor info
      var vbnameRef= firebase.database().ref('/users/' + uid + '/vbname');
      vbnameRef.on('value', function(snapshot) {
        document.getElementById('vendor_name').value = snapshot.val();
      });

      var vbaddressRef= firebase.database().ref('/users/' + uid + '/vbaddress');
      vbaddressRef.on('value', function(snapshot) {
        document.getElementById('vendor_address').value = snapshot.val();
      });
    }

    //hide form
    function cancelModifySettings()
    {
      event.preventDefault();
      document.getElementById("settings-form").style.display = "none";
      document.getElementById("current-settings").style.display = "block";
      document.getElementById("modif-settings-button").style.display = "block";

    }

    //submit  settings
    function submitSettings()
    {
      event.preventDefault();
      writeUserData();
      var user = firebase.auth().currentUser;
      document.getElementById("settings-form").style.display = "none";
      document.getElementById("settings-confirm").style.display = "block";
      document.getElementById("current-settings").style.display = "block";
      document.getElementById("modif-settings-button").style.display = "block";
      //redisplay settings info
      getSettings();

    }

    function getSettings()
    {
      var user = firebase.auth().currentUser;
      if(user != null){
        var uid = firebase.auth().currentUser.uid;

        //display username
        var usernameRef = firebase.database().ref('/users/' + uid + '/username');
        usernameRef.on('value', function(snapshot) {
          document.getElementById("current-name").innerHTML = "Your Name : " + snapshot.val();
        });
        //display email
        var emailRef = firebase.database().ref('/users/' + uid + '/email');
        emailRef.on('value', function(snapshot) {
          document.getElementById("current-email").innerHTML = "Your Email : " + snapshot.val();
        });

        //display phone 
        var phoneRef = firebase.database().ref('/users/' + uid + '/phone');
        phoneRef.on('value', function(snapshot) {
          document.getElementById("current-phone").innerHTML = "Your Phone Number : " + snapshot.val();
        });
      
        //display vbname

        var vbnameRef = firebase.database().ref('/users/' + uid + '/vbname');
        vbnameRef.on('value', function(snapshot) {
          document.getElementById("current-vbname").innerHTML = "Vendor Business Name : " + snapshot.val();
        });

        //display vbaddress

        var vbaddressRef = firebase.database().ref('/users/' + uid + '/vbaddress');
        vbaddressRef.on('value', function(snapshot) {
          document.getElementById("current-vbaddress").innerHTML = "Vendor Business Address : " + snapshot.val();
        });
      }
     
    }

    function logout(){
        event.preventDefault();
        firebase.auth().signOut();
        document.getElementById("portal").style.display = "none";
        document.getElementById("form").style.display = "block";
       
        document.getElementById("loggedin-div").classList.remove("visible");
        document.getElementById("loggedin-div").classList.add("reveal-if-active");
        document.getElementById("loggedout-div").classList.remove("reveal-if-active");
        document.getElementById("loggedout-div").classList.add("visible");
        


      }

  //handles portal tabs
  function show(event, string)
  {
    // Declare all variables
    var i, tabcontent, tablinks;
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(string).style.display = "block";
    event.currentTarget.className += " active";
  }
    
