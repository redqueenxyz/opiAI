Hello!

Each file has commenting if it has unique code, however, sometimes, the same code is repeated often. These are few of those chunks of code:

Chunk of code #1:
acctype = getCookie("acctype"); //gets account type cookie
username = getCookie("username"); //gets username cookie
if (username == "") { //if the username is blank, it implies that the person hasn't logged in.
  alert("Please login"); //prompts you to login
  window.location = "client_options.html"; //redirects you to client_options, will be different for users
}
else if (acctype != "client") { //check user account
  alert("This is a client page, for creating surveys."); //prompts you to use the correct account type
  window.location = "index.html"; //redirect
}

Chunk of code #2:
username = getCookie("username"); //get username cookie
if (username != "") { //check if you have already logged in
  alert("You have already logged in."); //prompt the user to stop logging in/registering when you're already logged in
  window.location = "index.html"; //redirect
}
