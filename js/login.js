 $(document).ready(function () {
     /* login request */
     $('#login-btn').on('click', function (event) {
         var userName = $('#user-name').val();
         var password = $('#password').val();
         var errorField = $('#error-field');
         var link = $(this).children();
         $.ajax({
             url: 'http://localhost:8081/api/auth/login'
             , type: 'POST'
             , contentType: 'application/json'
             , data: JSON.stringify({
                 "userName": userName
                 , "password": password
             })
             , success: function (data) {
                 var user = data.user;
                 // creating local storage items with user data that will be sent to main.js
                 localStorage.setItem("firstName", user.firstName);
                 localStorage.setItem("lastName", user.lastName);
                 localStorage.setItem("photoUrl", user.photoUrl);
                 localStorage.setItem("token", data.token);
                 window.location.href = 'main.html';
             }
             , error: function () {
                 errorField.show();
             }
         });
     });
     /* END of login request */
 });