$(document).ready(function() {

    /* retrieving data from local storage and load user information */

    var data = {
        firstName: localStorage.getItem("firstName"),
        lastName: localStorage.getItem("lastName"),
        photoUrl: localStorage.getItem("photoUrl")
    };

    var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE0ODE2MzU2ODksInN1YiI6InVzZXIxIn0.urh7CmQmz4c03dVq5qoFyFwXypTqW_95x9uBtvoKrVY9IVDeMXBjK2nCp_R9hXgPKuR_ggdqUhZPMu7uSZlUeA";

    var userDataWrapper = '<div id="userData"><span id="v-align"><img src="{{photoUrl}}" id="user-icon">{{firstName}} {{lastName}}</span><i class="material-icons" id="logout">arrow_forward</i></div>';
    var html = Mustache.to_html(userDataWrapper, data);
    var userDataWrapperResponsive = '<div id="userData-r"><img src="{{photoUrl}}" id="user-icon-r"><i class="material-icons" id="logout-r">arrow_forward</i></div>';
    var htmlResponsive = Mustache.to_html(userDataWrapperResponsive, data);
    $('#user-account-wrapper').html(html);
    $('#user-account-wrapper-r').html(htmlResponsive);

    /* END of retrieving data from local storage and load user information */


    /* event handlers */

    /* logout after clicking arrow button */
    $('#user-account-wrapper, #user-account-wrapper-r').on('click', 'i', function() {
        $.ajax({
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            },
            url: 'http://localhost:8081/api/auth/logout',
            type: 'POST',
            success : function () {
                window.location.href = 'login.html';
            }
        });
    });
});
