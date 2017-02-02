$(document).ready(function() {

	var user;

    /* event handlers */

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
                user = data.user;
                window.location.href = 'my-interviews.html';                                   
            },
            error: function () {
            	errorField.show();            	
            }
        });
    });
    /* /login request */
});
