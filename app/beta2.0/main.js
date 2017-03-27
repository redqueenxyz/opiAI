// Initialize Firebase

var config = {
  apiKey: "AIzaSyCtEcVnsA9QU-PJfIhipBgIV4ii2LLTza8",
  authDomain: "redqueen-1912e.firebaseapp.com",
  databaseURL: "https://redqueen-1912e.firebaseio.com",
  storageBucket: "redqueen-1912e.appspot.com",
  messagingSenderId: "554508156764"
};
firebase.initializeApp(config);

function login_client() { //from client_login.html
  user = document.getElementById("username").value; //get given username
  pass = document.getElementById("password").value; //get given password
  var clientRef = firebase.database().ref('client'); //move to client directory

  clientRef.orderByChild('username').equalTo(user).once('value', function(snap){ //if given username is equal to username child
      if(snap.exists()){ //if true

        return firebase.database().ref('/client/' + user).once('value').then(function(snapshot) { //move to that client's directory
          var password_login_client = snapshot.val().password; //password_login_client gets the value from the db
          if (password_login_client == pass) { //if given password = password from db
            alert("Success!"); //yay!
            document.cookie = "username=" + user + ";"; //cookies
            document.location.href='client.html'; //redirect to main page
          }
          else { //else
            alert("Invalid Password!"); //warning
            document.location.href='client_login.html'; //resets page (to be changed to make the fields empty)
          }
        });

      }
      else { //else for username
        alert("Invalid Username!"); //warning
        document.location.href='client_login.html'; //resets page (to be changed to make the fields empty)
    }
  });

}


function finish_client() { //function for client registration
  //get aaalllll the values
  user = document.getElementById("username").value;
  name = document.getElementById("fullname").value;
  pass = document.getElementById("password").value;
  email = document.getElementById("email").value;
  country = document.getElementById("country").value;
  city = document.getElementById("city").value;
  address = document.getElementById("address").value;
  business = document.getElementById("business").value;
  addClient(user, pass, name, country, city, business, address, email);
  //COOKIES!! CHOCOLATE CHIP COOKIES!!!!!
  document.cookie = "username=" + user + ";";
  document.body.innerHTML = 'Registration Successful. Visit client.html to view options, settings, and profile.'; //Welcome!
}

function addClient(user, pass, name, country, city, business, address, email) { //uploads client data to server, same for addUser
  firebase.database().ref('client/' + user).set({ //sets parameters
    username: user,
    name: name,
    password: pass,
    Address: address,
    business: business,
    email: email,
    country: country,
    City: city,
    budget: 0
  });
}

function getCookie(cname) { //function to return value of the cookie
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
