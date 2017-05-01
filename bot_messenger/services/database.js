// Manages Firebase DB retrieval and return

// var firebase_admin = require("firebase-admin");
var admin = require("firebase-admin");

// Admin
// Necessary for the Firebase SDK, and gives everyone with this .json the read/write TODO: Fix Bolt rules for Firebase later

var serviceAccount = require("@bot_messenger/config/firebase_admin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://feedbackio-ddb4e.firebaseio.com"
});   

// Real-time Database
// Accessed through the Firebase Admin endpoint
var db = admin.database();

// Database Sending Helpers
// Further documentation available at: https://firebase.google.com/docs/database/web/read-and-write

var ref = db.ref("clients/client_one");

ref.once("value", function(snapshot) {
  console.log(snapshot.val());
});


// Database Retrieval Helpers

/// Listening
/// To read data at a path and listen for changes, use the on() oronce() methods of firebase.database.Reference to observe events.
/// You can use the value event to read a static snapshot of the contents at a given path, as they existed at the time of the event. This method is triggered once when the listener is attached and again every time the data, including children, changes. The event callback is passed a snapshot containing all data at that location, including child data. If there is no data, the snapshot returned is null.

// var starCountRef = firebase.database().ref('posts/' + postId + '/starCount');
// starCountRef.on('value', function(snapshot) {
//   updateStarCount(postElement, snapshot.val());
// });

/// In some cases you may want a snapshot of your data without listening for changes, such as when initializing a UI element that you don't expect to change. You can use the once() method to simplify this scenario: it triggers once and then does not trigger again.

// var userId = firebase.auth().currentUser.uid;
// return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
//   var username = snapshot.val().username;
//   // ...
// });

/// Setting
/// For basic write operations, you can use set() to save data to a specified reference, replacing any existing data at that path. For example a social blogging application might add a user with set() as follows:

// function writeUserData(userId, name, email, imageUrl) {
//   firebase.database().ref('users/' + userId).set({
//     username: name,
//     email: email,
//     profile_picture : imageUrl
//   });
// }

/// Updating
/// To simultaneously write to specific children of a node without overwriting other child nodes, use the update() method.


/// Retrieving
var database = module.exports = {};
