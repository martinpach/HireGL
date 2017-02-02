$(document).ready(function() {


    /* event handlers */

    /* login request */
    $('#login-btn').on('click', function() {
        var userName = $('#user-name').val();
        var password = $('#password').val();

        $.ajax({
            url: 'http://localhost:8081/api/auth/login',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ "userName": userName, "password": password }),
            success: function(data) {
                console.log(data);
            },
            error: function() {
                console.log("error");
            },
        });
    });
    /* /login request */
});
