$(document).ready(function() {

	/* retrieving data from url and load user information */
    $.urlParam = function(name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        return results[1] || 0;
    }

    var data = {
    	firstName : $.urlParam('firstName'),
    	lastName : $.urlParam('lastName'),
    	photoUrl : $.urlParam('photoUrl')
    };

    var userDataWrapper = '<div id="userData"><span id="v-align"><img src="{{photoUrl}}" id="user-icon">{{firstName}} {{lastName}}</span><i class="material-icons" id="logout">arrow_forward</i></div>';
    var html = Mustache.to_html(userDataWrapper, data);
    var userDataWrapperResponsive = '<div id="userData-r"><img src="{{photoUrl}}" id="user-icon-r"><i class="material-icons" id="logout-r">arrow_forward</i></div>';
    var htmlResponsive = Mustache.to_html(userDataWrapperResponsive, data);
    $('#user-account-wrapper').html(html);
    $('#user-account-wrapper-r').html(htmlResponsive);

    /* /retrieving data from url and load user information */
});
