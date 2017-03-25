var Qnum = 1;
var surveyname = "Untitled_survey";
var country = "";
var int1 = "";
var int2 = "";
var int3 = "";
var int4 = "";
var int5 = "";
var types = new Array(1000);

// Initialize Firebase

var config = {
  apiKey: "AIzaSyCtEcVnsA9QU-PJfIhipBgIV4ii2LLTza8",
  authDomain: "redqueen-1912e.firebaseapp.com",
  databaseURL: "https://redqueen-1912e.firebaseio.com",
  storageBucket: "redqueen-1912e.appspot.com",
  messagingSenderId: "554508156764"
};
firebase.initializeApp(config);

var username = getCookie("username"); //get username
if (username == "") { //check if username is empty/does not exist
alert("Please login"); //login request
window.location = "client_options.html"; //redirect
}

//Prepare... for... BADLY WRITTEN CODE:

function stp2() { //step 2
  surveyname = document.getElementById("surveyname").value; //recieve data from the surveyname
  element(`
    <p><font face = "Helvetica">
    Awesome! Your new survey is ` + name + `.<br><br>
    Let's see what's next...<br><br>

    <br><br>
    <div class="row">
    <div class="input-field col s3">
      <input id="location" type="text" class="validate">
      <label class="active" for="location">Enter Location (country) (Leave blank if you would like to target the whole world):</label>
    </div>
    </div>

   <br>

   <p><font face = "Helvetica">
   Add interests (Leave everything blank if you don't want to target with interests):
   </font></p>

   <div class="row">
   <div class="input-field col s3">
     <input id="int1" type="text" class="validate">
     <label class="active" for="int1">Interest1</label>
   </div>
   </div>
   <div class="row">
   <div class="input-field col s3">
     <input id="int2" type="text" class="validate">
     <label class="active" for="int2">Interest2</label>
   </div>
   </div>
   <div class="row">
   <div class="input-field col s3">
     <input id="int3" type="text" class="validate">
     <label class="active" for="int3">Interest3</label>
   </div>
   </div>
   <div class="row">
   <div class="input-field col s3">
     <input id="int4" type="text" class="validate">
     <label class="active" for="int4">Interest4</label>
   </div>
   </div>
   <div class="row">
   <div class="input-field col s3">
     <input id="int5" type="text" class="validate">
     <label class="active" for="int5">Interest5</label>
   </div>
   </div>

   <center>
   <div class="btn" onclick="stp3()">
     <span>Add Questions!</span>
   </div>
   </center>

    `);
}

function stp3() { //step 3

  //get data from stp1
  country = document.getElementById("location").value;
  int1 = document.getElementById("int1").value;
  int2 = document.getElementById("int2").value;
  int3 = document.getElementById("int3").value;
  int4 = document.getElementById("int4").value;
  int5 = document.getElementById("int5").value;

  //step 3
  element(`

    <p>Alrighty! Sounds cool!</p>
    <p>Let's add survey pages now:</p>

    <div id = "questions">

    <div id = "question1">
      <select style = "all: initial;all: unset;" onchange="qtype(1)" id="q1s">
        <option value="1">Yes/No</option>
        <option value="2">Text</option>
        <option value="3">Options</option>
      </select>
    </div>

    </div>
    <center>
    <div class="btn" onclick="newQuestion()">
      <span>New Question</span>
    </div>
    <br>
    <br>
    <div class="btn" onclick="finish()">
      <span>Done</span>
    </div>
   </center>

    `);
}

function stp4() {}

function qtype(num) {
  var e = document.getElementById("q" + num + "s");
  var option = e.options[e.selectedIndex].value;
  if (option == "1") {
    types[Qnum] = 1;
    element = document.getElementById("question"+num);
    element.innerHTML = element.innerHTML + `
    <div class="row">
    <div class="input-field col s3">
      <input id="q`+num.toString()+`" type="text" class="validate" val>
      <label class="active" for="q`+num.toString()+`">Question `+num.toString()+`</label>
    </div>
    </div>
    `;
  }
  if (option == "2") {
    types[Qnum] = 2;
    element = document.getElementById("question"+num.toString());
    element.innerHTML = element.innerHTML + `
    <div class="row">
    <div class="input-field col s3">
      <input id="q`+num.toString()+`" type="text" class="validate" val>
      <label class="active" for="q`+num.toString()+`">Question `+num.toString()+`</label>
    </div>
    </div>
    `;
  }
  if (option == "3") {
    types[Qnum] = 3;
    element = document.getElementById("question"+num.toString());
    element.innerHTML = element.innerHTML + `
    <div class="row">
    <div class="input-field col s3">
      <input id="q`+num.toString()+`" type="text" class="validate" val>
      <label class="active" for="q`+num.toString()+`">Question `+num.toString()+`</label>
    </div>
    </div>
    `;
  }
}


function finish() {

  for (i = 1; i <= Qnum; i++) {
    firebase.database().ref('client/' + getCookie("username") + '/' + surveyname + '/section_' + i).set({
      question: document.getElementById("q"+i).value,
      type: types[Qnum]
    });
    firebase.database().ref('client/' + getCookie("username") + '/' + surveyname + '/section_' + i + '/result').set({
      data: "TODO"
    });
  }

  firebase.database().ref('client/' + getCookie("username") + '/' + surveyname + '/audience').set({ //sets parameters
    country: country
  });

  firebase.database().ref('client/' + getCookie("username") + '/' + surveyname + '/audience/interests').set({ //sets parameters
    1: int1,
    2: int2,
    3: int3,
    4: int4,
    5: int5
  });

  alert("successfully completed!");
}

function newQuestion() {
  Qnum = Qnum + 1;
  element = document.getElementById("questions");
  element.innerHTML = element.innerHTML + `
  <div id = "question`+Qnum+`">
    <select style = "all: initial;all: unset;" onchange="qtype(`+Qnum+`)" id="q`+Qnum+`s">
      <option value="" disabled selected>Choose question type</option>
      <option value="1">Yes/No</option>
      <option value="2">Text</option>
      <option value="3">Options</option>
    </select>
  </div>
  `;
}

function element(ele) { //function to generate html elements
  main = document.getElementById("main");
  main.innerHTML = ele;
}
