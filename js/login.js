 $(document).ready(function() {

     /* login request */
     $('#login-btn').on('click', function(event) {
         var userName = $('#user-name').val();
         var password = $('#password').val();
         var errorField = $('#error-field');
         var link = $(this).children();

         $.ajax({
             url: 'http://localhost:8081/api/auth/login',
             type: 'POST',
             contentType: 'application/json',
             data: JSON.stringify({ "userName": userName, "password": password }),
             success: function(data) {
                 var user = data.user;
                 console.log(data.token);
                 window.location.href = 'index.html?firstName=' + user.firstName + '&lastName=' + user.lastName + '&photoUrl=' + user.photoUrl; //redirect to index
             },
             error: function() {
                 errorField.show();
             }
         });
     });
     /* /login request */
 });
