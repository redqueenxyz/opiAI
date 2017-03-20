acctype = getCookie("acctype"); //get 'accounttype cookie (user/client)'
username = getCookie("username"); //get username
if (username == "") { //check if username is empty/does not exist
  alert("Please login"); //login request
  window.location = "client_options.html"; //redirect
}
else if (acctype != "client") { //if the username is valid/if you are logged in, but you're a user
  alert("This is a client page, for creating surveys."); //informs that this page is for clients only
  window.location = "index.html"; //redirects
}

//Prepare... for... BADLY WRITTEN CODE:

function stp1() { //step 1
  name = document.getElementById("surveyname").value; //recieve data from the surveyname
  element(`
    <p><font face = "Helvetica">
    Awesome! Your new survey is ` + name + `.<br><br>
    Let's see what's next...<br><br>
    Type a location for your survey:<br><br>
    <font></p>

    <form action="#">
      <p>
        <input name="group1" type="radio" id="country" />
        <label for="country">Country</label>
      </p>
      <p>
        <input name="group1" type="radio" id="state" />
        <label for="state">State</label>
      </p>
      <p>
        <input name="group1" type="radio" id="city"  />
        <label for="city">City</label>
      </p>
      <p>
        <input name="group1" type="radio" id="none"  />
        <label for="none">None</label>
      </p>
    </form>

    <br><br>
    <div class="row">
    <div class="input-field col s3">
      <input id="location" type="text" class="validate">
      <label class="active" for="location">Enter Location (Leave blank if 'none' is selected):</label>
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
   <div class="btn" onclick="stp2()">
     <span>Add Questions!</span>
   </div>
   </center>

    `);
}

function stp2() { //step 2

  //get data from stp1
  if (document.getElementById('country').checked) {
    country_checked = true;
  }
  if (document.getElementById('state').checked) {
    state_checked = true;
  }
  if (document.getElementById('city').checked) {
    city_checked = true;
  }
  if (document.getElementById('none').checked) {
    none_loc_checked = true;
  }
  int1 = document.getElementById("int1").value;
  int2 = document.getElementById("int2").value;
  int3 = document.getElementById("int3").value;
  int4 = document.getElementById("int4").value;
  int5 = document.getElementById("int5").value;

  //soon to come ~ Step 3, with survey questions
  element('<p>Step 3</p>');
}

function element(ele) { //function to generate html elements
  main = document.getElementById("main");
  main.innerHTML = ele;
}
