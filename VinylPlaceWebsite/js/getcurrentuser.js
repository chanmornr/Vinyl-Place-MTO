
function lAttribute(){
  var data = {
    UserPoolId: _config.cognito.userPoolId,
    ClientId: _config.cognito.userPoolClientId,
  };
  var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(data);
  var cognitoUser = userPool.getCurrentUser();

  try {
    if (cognitoUser != null) {
      cognitoUser.getSession(function(err, session) {
        if (err) {
          console.log(err);
          return;
        }

        console.log('session validity: ' + session.isValid());
        console.log('session token: ' + session.getIdToken().getJwtToken());
      });


      var userinfo = cognitoUser.getUserAttributes(function(err,result){
        if (err) {
            //alert(err);
            return;
          }
          for (i = 0; i < result.length; i++) {
            console.log('attribute ' + result[i].getName() + ' has value ' + result[i].getValue());
          }

          /* Update navigation */
          document.getElementById("dropdownMenu1").innerHTML = result[5].getValue() + ' ' + result[6].getValue();
          document.getElementById("signout").innerHTML += '<a href="account.html">Account Details</a><br><br>';
          document.getElementById("signout").innerHTML += '<button class="btn btn-primary" onclick="signOutCurrent();">Sign Out</button>';
          document.getElementById("signinForm").style.visibility="hidden";

          if(window.location.href.split("/").slice(-1) == "account.html") {
            /* Update account information page */ 
            document.getElementById("account-info").innerHTML = '';
            document.getElementById("account-info").innerHTML += '<b>First Name: </b>' + result[5].getValue() + '<br>';
            document.getElementById("account-info").innerHTML += '<b>Last Name: </b>' + result[6].getValue() + '<br>';
            document.getElementById("account-info").innerHTML += '<b>Address: </b>' + result[1].getValue() + '<br>';
            document.getElementById("account-info").innerHTML += '<b>Phone Number: </b>' + result[4].getValue() + '<br>';
            document.getElementById("account-info").innerHTML += '<b>Email: </b>' + result[7].getValue() + '<br>';
            document.getElementById("account-info").innerHTML += '<div><br><h4>Change Password</h4><input type="password" id="oldPassword" placeholder="Old Password" required><br><input type="password" id="newPassword" placeholder="New Password" required></div>';
            document.getElementById("account-info").innerHTML += '<input id="changePass" type="button" value="Change Password" onclick="cPassword();">';
            document.getElementById("account-info").innerHTML += '<input id="deleteUser" type="button" value="Delete Account" onclick="deleteUser();">'; 
          }
        });
    } else {
      if(window.location.href.split("/").slice(-1) == "account.html") {
        /* Update account information page */ 
        document.getElementById("account-info").innerHTML = '';
        document.getElementById("account-info").innerHTML += '<p>You are not logged in.</p>';
        return; 
      }
    }
  } catch (e) {
    console.log(e);
    return;
  }
}
function deleteUser(){
	var data = {
   UserPoolId: _config.cognito.userPoolId,
   ClientId: _config.cognito.userPoolClientId,
 };

 var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(data);
 var cognitoUser = userPool.getCurrentUser();

 try {

   if (cognitoUser != null) {
     cognitoUser.getSession(function(err, session) {
       if (err) {
         console.log(err);
         return;
       }

       console.log('session validity: ' + session.isValid());
       console.log('session token: ' + session.getIdToken().getJwtToken());
     });
     cognitoUser.deleteUser(function(err, result) {
       if (err) {
         alert(err);
         return;
       }
       console.log('call result: ' + result);
     });
   } else {
     console.log(err);
     return;
   }
 } catch (e) {
   console.log(e);
   return;
 }

 alert('Your account has been deleted.')
}
function cPassword(){
	var oldPassword =document.getElementById("oldPassword").value;
	var newPassword =document.getElementById("newPassword").value;

	var data = {
   UserPoolId: _config.cognito.userPoolId,
   ClientId: _config.cognito.userPoolClientId,
 };
 var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(data);
 var cognitoUser = userPool.getCurrentUser();
 try {
   if (cognitoUser != null) {
     cognitoUser.getSession(function(err, session) {
       if (err) {
         console.log(err);
         return;
       }

       console.log('session validity: ' + session.isValid());
     });
     cognitoUser.changePassword(oldPassword, newPassword, function(err, result) {
       if (err) {
         alert(err);
         return;
       }
       console.log('call result: ' + result);
     });
   } else {
     console.log(err);
     return;
   }
 } catch (e) {
   console.log(e);
   return;
 }
}

function forgotpasswordbutton() {
 var poolData = {
   UserPoolId: _config.cognito.userPoolId,
   ClientId: _config.cognito.userPoolClientId
 };
 
 var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
 
 var userData = {
   Username : document.getElementById("emailReset").value,
   Pool : userPool,
 };
 
 var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
 
 cognitoUser.forgotPassword({
   onSuccess: function (result) {
     console.log('call result: ' + result);
     window.location.assign("./index.html");
		   //alert("Y")
    },
    onFailure: function(err) {
     alert(err);
     console.log(err);
   },
   inputVerificationCode() {
     window.location.href = "forgot-pass-verify.html";
             /*
             var verificationCode = $('#forgotPassCode').val();
             var newPassword = $('#forgotPass1').val();

             cognitoUser.confirmPassword(verificationCode, newPassword, this); */
             
           }
         });
}

function forgotPasswordUpdate() {
 var poolData = {
   UserPoolId: _config.cognito.userPoolId,
   ClientId: _config.cognito.userPoolClientId
 };
 
 var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
 
 var userData = {
   Username : document.getElementById("forgotUser").value,
   Pool : userPool,
 };
 
 var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);


 var verificationCode = $('#forgotPassCode').val();
 var user = $('#forgotUser').val();
 var newPassword = $('#forgotPass1').val();
 var newPassword2 = $('#forgotPass2').val();

 console.log(document.getElementById("forgotUser").value);

 if(newPassword == newPassword2) {
  cognitoUser.confirmPassword(verificationCode, newPassword, this);
  console.log("here");
} else {
  alert("Passwords do not match.")
} 

/*
var params = {
  ClientId: _config.cognito.userPoolClientId, 
  ConfirmationCode: verificationCode, 
  Password: newPassword, 
  Username: user  
}; 

cognitoidentityserviceprovider.confirmForgotPassword(params, function(err, data) {
  if (err) console.log(err, err.stack); 
  else     console.log(data);           
}); */

}


function signOutCurrent(){
	VinylCutting.signOut();
	window.location.assign("./index.html");
}



window.onload = lAttribute();

/*
*  Event Handlers
*/
//document.getElementById("changePass").onclick = cPassword;