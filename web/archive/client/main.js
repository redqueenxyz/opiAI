// Initialize Firebase

var config = {
  apiKey: "AIzaSyCtEcVnsA9QU-PJfIhipBgIV4ii2LLTza8",
  authDomain: "redqueen-1912e.firebaseapp.com",
  databaseURL: "https://redqueen-1912e.firebaseio.com",
  storageBucket: "redqueen-1912e.appspot.com",
  messagingSenderId: "554508156764"
};
firebase.initializeApp(config);

//will be the same for client, so this will serve as an explanation for login_client() nad login_user()
function login_user() { //from login_user.html
  user = document.getElementById("username").value; //get username
  pass = document.getElementById("password").value; //get password
  var usersRef = firebase.database().ref('user'); //user directory

  usersRef.orderByChild('username').equalTo(user).once('value', function (snap) { //find a child (username) in user equal to the username you've provided
    if (snap.exists()) { //if the username exists

      return firebase.database().ref('/user/' + user).once('value').then(function (snapshot) { //move to the user's directory
        var password_login_user = snapshot.val().password; //get the password from db
        if (password_login_user == pass) { //if provided password matches the password from db
          alert("Success!"); //yay
          document.cookie = "username=" + user + ";"; //adds cookies. Enjoy, cookie monster!
          user = "user";
          document.cookie = "acctype=" + user + ";";
          document.location.href = 'user.html';

          // # TODO: ca
        }
        else { //db password doesn't match given password
          alert("Invalid Password!"); //lala
          document.location.href = 'user_login.html'; //redirect
        }
      });

    }
    else { //username is invalid
      alert("Invalid Username!"); //lala
      document.location.href = 'user_login.html'; //redirect
    }
  });

}

function login_client() {
  user = document.getElementById("username").value;
  pass = document.getElementById("password").value;
  var clientRef = firebase.database().ref('client');

  clientRef.orderByChild('username').equalTo(user).once('value', function (snap) {
    if (snap.exists()) {

      return firebase.database().ref('/client/' + user).once('value').then(function (snapshot) {
        var password_login_client = snapshot.val().password;
        if (password_login_client == pass) {
          alert("Success!");
          document.cookie = "username=" + user + ";";
          user = "client";
          document.cookie = "acctype=" + user + ";";
          document.location.href = 'client.html';
        }
        else {
          alert("Invalid Password!");
          document.location.href = 'client_login.html';
        }
      });

    }
    else {
      alert("Invalid Username!");
      document.location.href = 'client_login.html';
    }
  });

}


function finish_client() { //function for client, will repeat for user, so won't comment for both. However, there is one difference, see finish_user
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
  user = "client";
  document.cookie = "acctype=" + user + ";";
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

function addUser(username, password, city, state, country, email) {
  firebase.database().ref('user/' + username).set({
    username: username,
    city: city,
    password: password,
    state: state,
    country: country,
    email: email,
    coins: 0,
    surveyscompleted: 0
  });
}

function addUserInterests(user, a, b, c, d, e, f) { //intersts for user
  firebase.database().ref('user/' + user + '/interests').set({
    1: a,
    2: b,
    3: c,
    4: d,
    5: e,
    6: f
  });
}

function finish_user() {
  username = document.getElementById("username").value;
  password = document.getElementById("password").value;
  city = document.getElementById("city").value;
  state = document.getElementById("state").value;
  country = document.getElementById("country").value;
  email = document.getElementById("email").value;
  addUser(username, password, city, state, country, email);
  addUserInterests(username, "interest1", "interest2", "interest3", "interest4", "interest5", "interest6"); //temporary, with Facebook intergration, we'll have proper interesta
  document.cookie = "username=" + user + ";";
  user = "user";
  document.cookie = "acctype=" + user + ";";
  document.body.innerHTML = 'Registration Successful. Visit user.html to view options, settings, and profile.';
}

function getCookie(cname) { //function to return value of the cookie
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
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
