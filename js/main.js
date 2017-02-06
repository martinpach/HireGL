$(document).ready(function() {

	/* retrieving data from local storage and load user information */

    var data = {
        firstName : localStorage.getItem("firstName"),
        lastName : localStorage.getItem("lastName"),
        photoUrl : localStorage.getItem("photoUrl")  
    };

    var userDataWrapper = '<div id="userData"><span id="v-align"><img src="{{photoUrl}}" id="user-icon">{{firstName}} {{lastName}}</span><i class="material-icons" id="logout">arrow_forward</i></div>';
    var html = Mustache.to_html(userDataWrapper, data);
    var userDataWrapperResponsive = '<div id="userData-r"><img src="{{photoUrl}}" id="user-icon-r"><i class="material-icons" id="logout-r">arrow_forward</i></div>';
    var htmlResponsive = Mustache.to_html(userDataWrapperResponsive, data);
    $('#user-account-wrapper').html(html);
    $('#user-account-wrapper-r').html(htmlResponsive);

    /* END of retrieving data from local storage and load user information */
});
