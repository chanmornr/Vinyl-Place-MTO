/*global VinylCutting _config AmazonCognitoIdentity AWSCognito*/

var VinylCutting = window.VinylCutting || {};

(function scopeWrapper($) {
    var signinUrl = 'index.html';

    var poolData = {
        UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.userPoolClientId
    };

    var userPool;

    if (!(_config.cognito.userPoolId &&
          _config.cognito.userPoolClientId &&
          _config.cognito.region)) {
        $('#noCognitoMessage').show();
        return;
    }

    userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    if (typeof AWSCognito !== 'undefined') {
        AWSCognito.config.region = _config.cognito.region;
    }

    VinylCutting.signOut = function signOut() {
        userPool.getCurrentUser().signOut();
    };

    VinylCutting.authToken = new Promise(function fetchCurrentAuthToken(resolve, reject) {
        var cognitoUser = userPool.getCurrentUser();

        if (cognitoUser) {
            cognitoUser.getSession(function sessionCallback(err, session) {
                if (err) {
                    reject(err);
                } else if (!session.isValid()) {
                    resolve(null);
                } else {
                    resolve(session.getIdToken().getJwtToken());
                }
            });
        } else {
            resolve(null);
        }
    });


    /*
     * Cognito User Pool functions
     */

    function register(email, password, onSuccess, onFailure) {
        var attributeList = [];

        var dataEmail = {
            Name: 'email',
            Value: email
        };

        // Attribute list should contain first name, last name, address, email, and phone number
        var dataFirstName = {
            Name : 'given_name',
            Value : $('#firstNameInputRegister').val()
        };

        var dataLastName = {
            Name : 'family_name',
            Value : $('#lastNameInputRegister').val()
        };
        
        var dataAddress = {
            Name : 'address',
            Value : $('#streetAddressInputRegister').val() + "\n" + $('#localityInputRegister').val() +
                "\n" + $('#regionInputRegister').val() + " " + $('#postalCodeInputRegister').val() + 
                "\n" + $('#countryInputRegister').val()

        }; 
        console.log($('#streetAddressInputRegister').val() + "\n" + $('#localityInputRegister').val() +
                "," + $('#regionInputRegister').val() + " " + $('#postalCodeInputRegister').val() + 
                "\n" + $('#countryInputRegister').val());

        var dataEmail = {
            Name : 'email',
            Value : email
        };

        var dataPhone = {
            Name : 'phone_number',
            Value : $('#phoneNumberInputRegister').val()
        };

        var attributeFirstName = new AmazonCognitoIdentity.CognitoUserAttribute(dataFirstName);
        var attributeLastName = new AmazonCognitoIdentity.CognitoUserAttribute(dataLastName);
        var attributeAddress = new AmazonCognitoIdentity.CognitoUserAttribute(dataAddress);
        var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
        var attributePhone = new AmazonCognitoIdentity.CognitoUserAttribute(dataPhone);

        attributeList.push(attributeFirstName);
        attributeList.push(attributeLastName);
        attributeList.push(attributeAddress)
        attributeList.push(attributeEmail);
        attributeList.push(attributePhone);

        userPool.signUp(email, password, attributeList, null,
            function signUpCallback(err, result) {
                if (!err) {
                    onSuccess(result);
                } else {
                    onFailure(err);
                }
            }
        );
    }

    function signin(email, password, onSuccess, onFailure) {
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: toUsername(email),
            Password: password
        });

        var cognitoUser = createCognitoUser(email);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: onSuccess,
            onFailure: onFailure
        });
    }

    function verify(email, code, onSuccess, onFailure) {
        createCognitoUser(email).confirmRegistration(code, true, function confirmCallback(err, result) {
            if (!err) {
                onSuccess(result);
            } else {
                onFailure(err);
            }
        });
    }

    function createCognitoUser(email) {
        return new AmazonCognitoIdentity.CognitoUser({
            Username: email,
            Pool: userPool
        });
    }

    function toUsername(email) {
        return email.replace('@', '-at-');
    }

    /*
     *  Event Handlers
     */

    $(function onDocReady() {
        $('#signinForm').submit(handleSignin);
        $('#registrationForm').submit(handleRegister);
        $('#verifyForm').submit(handleVerify);
    });

    function handleSignin(event) {
        var email = $('#emailInput').val();
        var password = $('#passwordInput').val();
        event.preventDefault();
        signin(email, password,
            function signinSuccess() {
                console.log('Successfully Logged In');
                window.location.href = 'account.html';
            },
            function signinError(err) {
                alert(err);
            }
        );
    }

    function handleRegister(event) {
        var email = $('#emailInputRegister').val();
        var password = $('#passwordInputRegister').val();
        var password2 = $('#password2InputRegister').val();

        var onSuccess = function registerSuccess(result) {
            var cognitoUser = result.user;
            console.log('user name is ' + cognitoUser.getUsername());
            var confirmation = ('Registration successful. Please check your email inbox or spam folder for your verification code.');
            if (confirmation) {
                window.location.href = 'verify.html';
            }
        };
        var onFailure = function registerFailure(err) {
            alert(err);
        };
        event.preventDefault();

        if (password === password2) {
            register(email, password, onSuccess, onFailure);
        } else {
            alert('Passwords do not match');
        }
    }

    function handleVerify(event) {
        var email = $('#emailInputVerify').val();
        var code = $('#codeInputVerify').val();
        event.preventDefault();
        verify(email, code,
            function verifySuccess(result) {
                console.log('call result: ' + result);
                console.log('Successfully verified');
                alert('Verification successful. You will now be redirected to the home page.');
                window.location.href = signinUrl;
            },
            function verifyError(err) {
                alert(err);
            }
        );
    }
}(jQuery));
