 $(document).ready(function () {
     /* login request */
     function login() {
         var userName = $('#user-name').val();
         var password = $('#password').val();
         var errorField = $('#error-field');
         var link = $(this).children();
         if (userName && password) {
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
         }
         else {
             errorField.show();
         }
     }
     $(document).keydown(function (event) {
         if (event.keyCode == 13) {
             login();
         }
     });
     $('#login-btn').on('click', function (event) {
         login();
     });
     /* END of login request */
 });