/* Callback for the signUp button */
function signUp() {
    username = $("#usernameInput").val(); // get the value of the username input field
    password1 = $("#passwordInput").val(); // get the value of the password input field
    password2 = $("#passwordInputConfirm").val(); // get the value of the confirm password input field

    if (username.localeCompare("") === 0) // if the user didn't enter a username, reload the page with the appropriate error message
        window.location = "http://localhost:3000/sign-up/Please enter a username";
    else if (password1.localeCompare("") === 0) // if the user didn't enter a password, reload the page with the appropriate error message
        window.location = "http://localhost:3000/sign-up/Please enter a password";
    else if (!checkPasswords(password1, password2)) // if the confirm password doesn't match the password, reload the page with the appropriate error message
        window.location = "http://localhost:3000/sign-up/Passwords don't match";
    else {
        parameters = {username: username, password: password1}; // create the parameters to send through an Ajax request

        $.ajax({
            url: '/register',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(parameters), // convert the parameters to the JSON format
            success: function(response) {
                if (response && response.localeCompare("success") === 0) // if the signUp api send Success, redirect the user to the signIn page
                    window.location = "http://localhost:3000/sign-in";
                else // else reload the page with the page with the error sent by the signUp api
                    window.location = "http://localhost:3000/sign-up/"+response;
            },
            error: function(jqXHR, textStatus, errorThrown) {
                window.location = "http://localhost:3000/sign-up/"+textStatus+ " " + errorThrown; // reload the page with the error sent
            }
        });
    }
}

/* Callback for the signIn button */
function signIn() {
    username = $("#usernameInput").val(); // get the value from the username input field
    password1 = $("#passwordInput").val(); // get the value from the password input field

    if (username.localeCompare("") === 0) // if the user didn't enter a username, reload the page with the appropriate error message
        window.location = "http://localhost:3000/sign-in/Please enter a username";
    else if (password1.localeCompare("") === 0) // if the user didn't enter a password, reload the page with the appropriate error message
        window.location = "http://localhost:3000/sign-in/Please enter a password";
    else {
        parameter = {username: username, password: password1}; // create the parameters to send through an Ajax request

        $.ajax({
            url: '/login',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(parameter), // convert the parameters to the JSON format
            success: function (response) {
                console.log(response);
                if (response && response.localeCompare("success") === 0) // if the signUp api send Success, redirect the user to the home page
                    window.location = "http://localhost:3000/";
                else
                    window.location = "http://localhost:3000/sign-in/" + response; // else reload the page with the page with the error sent by the signIn api
            },
            error: function (jqXHR, textStatus, errorThrown) {
                window.location = "http://localhost:3000/sign-in/"+textStatus+ " " + errorThrown;  // reload the page with the error sent
            }
        });
    }
}

/* Check if passwords match */
function checkPasswords(password1, password2) {
    if (password1.localeCompare(password2) === 0)
        return (true);
    return (false);
}