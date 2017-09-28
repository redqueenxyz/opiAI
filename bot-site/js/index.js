"use strict";

var config = {
  apiKey: "AIzaSyCOgdm4V0n8H9ZOcMu315jGDiecnG9a76k",
  authDomain: "opiai-883ff.firebaseapp.com",
  databaseURL: "https://opiai-883ff.firebaseio.com",
  projectId: "opiai-883ff",
  storageBucket: "opiai-883ff.appspot.com",
  messagingSenderId: "1005832299550"
};
firebase.initializeApp(config);

var maxq = 100; //idk the max number of questions permissible, but change this.
var qnum = 0; //initial question number
var qdat = new Array(maxq); //for creating new div tags for cards (see createsurvey())
var qnom = new Array(maxq);
var user = "test_client";
var counter1 = 0;
var counter2 = 0;
var qname_send = 0;
var option_value = "";

var mainpage_buttons = React.createElement(
  "div",
  { className: "side-options" },
  React.createElement(
    "a",
    { className: "btn-floating btn-large red", "data-activates": "slide-out" },
    React.createElement(
      "i",
      { className: "material-icons" },
      "menu"
    )
  )
);

var mainpage_sidenav = React.createElement(
  "ul",
  { id: "slide-out", className: "side-nav" },
  React.createElement(
    "li",
    null,
    React.createElement(
      "a",
      { className: "subheader" },
      "Active Surveys"
    )
  ),
  React.createElement(
    "li",
    null,
    React.createElement(
      "a",
      { href: "#!" },
      "Survey 2"
    )
  ),
  React.createElement(
    "li",
    null,
    React.createElement(
      "a",
      { href: "#!" },
      "Survey 3"
    )
  ),
  React.createElement(
    "li",
    null,
    React.createElement("div", { className: "divider" })
  ),
  React.createElement(
    "li",
    null,
    React.createElement(
      "a",
      { className: "subheader" },
      "Inacitve Surveys"
    )
  ),
  React.createElement(
    "li",
    null,
    React.createElement(
      "a",
      { href: "#!" },
      "Survey 1"
    )
  ),
  React.createElement(
    "li",
    null,
    React.createElement("div", { className: "divider" })
  ),
  React.createElement(
    "li",
    null,
    React.createElement(
      "a",
      { className: "waves-effect", href: "javascript:makeSurvey()" },
      React.createElement(
        "i",
        { className: "material-icons" },
        "add"
      ),
      "Create new survey"
    )
  ),
  React.createElement(
    "li",
    null,
    React.createElement(
      "a",
      { className: "waves-effect", href: "#!" },
      React.createElement(
        "i",
        { className: "material-icons" },
        "settings"
      ),
      "Options"
    )
  ),
  React.createElement(
    "li",
    null,
    React.createElement(
      "a",
      { className: "waves-effect", href: "#!" },
      React.createElement(
        "i",
        { className: "material-icons" },
        "chat"
      ),
      "Support"
    )
  )
);

var homepage = React.createElement(
  "p",
  null,
  "TODO"
);

//const testcontent = (<p>HelloWorld!</p>); //for debugging purposes.

var newsurveymain = React.createElement(
  "div",
  { id: "addnewsurvey" },
  React.createElement(
    "h4",
    null,
    "Create a new Survey:"
  ),
  React.createElement("br", null),
  React.createElement(
    "div",
    { className: "input-field col s6" },
    React.createElement(
      "i",
      { className: "material-icons prefix" },
      "toc"
    ),
    React.createElement("input", { id: "surveyname", type: "text", className: "validate" }),
    React.createElement(
      "label",
      { htmlFor: "surveyname" },
      "Survey Name"
    )
  ),
  React.createElement("br", null),
  React.createElement(
    "h5",
    null,
    "Add questions:"
  ),
  React.createElement("br", null),
  React.createElement(
    "a",
    { className: "waves-effect waves-light btn", href: "javascript:makeQuestion()" },
    React.createElement(
      "i",
      { className: "material-icons left" },
      "add"
    ),
    "Add question"
  ),
  React.createElement("br", null),
  React.createElement("br", null),
  React.createElement("div", { className: "row", id: "questions" }),
  React.createElement(
    "div",
    { id: "sumbitsurvey" },
    React.createElement("br", null),
    React.createElement(
      "a",
      { className: "waves-effect waves-light btn", href: "javascript:finishSurvey()" },
      React.createElement(
        "i",
        { className: "material-icons left" },
        "done"
      ),
      "Sumbit Survey"
    ),
    React.createElement("br", null)
  )
);

React.render(mainpage_sidenav, document.getElementById('sidebar'));

var loginform = React.createElement(
  "div",
  { id: "loginform" },
  React.createElement(
    "div",
    { className: "row" },
    React.createElement(
      "div",
      { className: "input-field col s6 offset-s3" },
      React.createElement(
        "i",
        { className: "material-icons prefix" },
        "account_circle"
      ),
      React.createElement("input", { id: "username", type: "text", className: "validate" }),
      React.createElement(
        "label",
        { htmlFor: "username" },
        "Username/Email"
      )
    )
  ),
  React.createElement(
    "div",
    { className: "row" },
    React.createElement(
      "div",
      { className: "input-field col s6 offset-s3" },
      React.createElement(
        "i",
        { className: "material-icons prefix" },
        "lock"
      ),
      React.createElement("input", { id: "password", type: "password", className: "validate" }),
      React.createElement(
        "label",
        { htmlFor: "password" },
        "Password"
      )
    )
  ),
  React.createElement(
    "div",
    { className: "row" },
    React.createElement(
      "center",
      null,
      React.createElement(
        "a",
        { href: "javascript:verifylogin()", className: "waves-effect waves-light btn", id: "login" },
        "Login"
      )
    )
  )
);

React.render(loginform, document.getElementById('loginform'));

//verifylogin();
//makeSurvey();

function verifylogin() {

  //var user = document.getElementById("username").value; //get given username
  //var pass = document.getElementById("password").value; //get given password
  //TODO: Use user and pass to actually login
  React.render(mainpage_buttons, document.getElementById('menu'));

  //Query for NavBar
  $('.btn-floating').sideNav({
    menuWidth: 300, // Default is 240
    edge: 'left', // Choose the horizontal origin
    closeOnClick: true
  });

  React.render(React.createElement("p", null), document.getElementById('loginform'));
}

function makeSurvey() {
  qnum = 0;
  React.render( //renders element
  newsurveymain, document.getElementById('primarycontent'));
  makeQuestion();
}

function makeQuestion() {
  qdat[qnum] = document.createElement('div');
  qdat[qnum].id = 'questionholder' + (qnum + 1).toString();
  document.getElementById('questions').appendChild(qdat[qnum]);
  console.log(qnum + 1);
  React.render( //renders element
  React.createElement(
    "div",
    { className: "col s4" },
    React.createElement(
      "div",
      { className: "card light-red" },
      React.createElement(
        "div",
        { className: "card-content blue-text" },
        React.createElement(
          "span",
          { className: "card-title" },
          React.createElement(
            "div",
            { className: "row" },
            React.createElement(
              "div",
              { className: "input-field col s12" },
              React.createElement("input", { id: 'question' + (qnum + 1).toString(), type: "text", className: "validate" }),
              React.createElement(
                "label",
                { htmlFor: 'question' + (qnum + 1).toString() },
                "Question ",
                (qnum + 1).toString()
              )
            )
          )
        ),
        React.createElement(
          "p",
          null,
          React.createElement(
            "div",
            { className: "row" },
            React.createElement(
              "div",
              { className: "input-field col s6" },
              React.createElement("input", { id: 'question' + (qnum + 1) + '_option1', type: "text", className: "validate" }),
              React.createElement(
                "label",
                { htmlFor: 'question' + (qnum + 1) + '_option1' },
                "Option 1"
              )
            ),
            React.createElement(
              "div",
              { className: "input-field col s6" },
              React.createElement("input", { id: 'question' + (qnum + 1) + '_option2', type: "text", className: "validate" }),
              React.createElement(
                "label",
                { htmlFor: 'question' + (qnum + 1) + '_option2' },
                "Option 2"
              )
            ),
            React.createElement(
              "div",
              { className: "input-field col s6" },
              React.createElement("input", { id: 'question' + (qnum + 1) + '_option3', type: "text", className: "validate" }),
              React.createElement(
                "label",
                { htmlFor: 'question' + (qnum + 1) + '_option3' },
                "Option 3"
              )
            ),
            React.createElement(
              "div",
              { className: "input-field col s6" },
              React.createElement("input", { id: 'question' + (qnum + 1) + '_option4', type: "text", className: "validate" }),
              React.createElement(
                "label",
                { htmlFor: 'question' + (qnum + 1) + '_option4' },
                "Option 4"
              )
            )
          )
        )
      )
    )
  ), //summons the question card
  document.getElementById('questionholder' + (qnum + 1).toString()) //accesses the new div
  );
  qnum++;
}

function finishSurvey() {
  var surveyname = document.getElementById("surveyname").value;

  firebase.database().ref('client/' + user + '/surveys/' + surveyname).set({ //sets parameters
    postback: surveyname
  });

  counter1 = 0;
  counter2 = 0;

  while (counter1 >= qnum) {
    qname_send = document.getElementById('question' + (counter1 + 1).toString()).value;
    firebase.database().ref('client/' + user + '/surveys/' + surveyname + '/questions/' + counter1.toString()).set({ //sets parameters
      text: qname_send
    });
    option_value = document.getElementById('question' + (counter1 + 1) + '_option1').value;
    firebase.database().ref('client/' + user + '/surveys/' + surveyname + '/questions/' + counter1.toString() + '/quick_replies/0').set({ //sets parameters
      content_type: "text",
      image_url: "",
      payload: counter1,
      title: option_value
    });
    option_value = document.getElementById('question' + (counter1 + 2) + '_option1').value;
    firebase.database().ref('client/' + user + '/surveys/' + surveyname + '/questions/' + counter1.toString() + '/quick_replies/1').set({ //sets parameters
      content_type: "text",
      image_url: "",
      payload: counter1,
      title: option_value
    });
    option_value = document.getElementById('question' + (counter1 + 3) + '_option1').value;
    firebase.database().ref('client/' + user + '/surveys/' + surveyname + '/questions/' + counter1.toString() + '/quick_replies/2').set({ //sets parameters
      content_type: "text",
      image_url: "",
      payload: counter1,
      title: option_value
    });
    option_value = document.getElementById('question' + (counter1 + 4) + '_option1').value;
    firebase.database().ref('client/' + user + '/surveys/' + surveyname + '/questions/' + counter1.toString() + '/quick_replies/3').set({ //sets parameters
      content_type: "text",
      image_url: "",
      payload: counter1,
      title: option_value
    });
    counter1++;
  }
}