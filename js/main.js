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

    var userDataWrapper = '<div><img src="{{photoUrl}}">{{firstName}} {{lastName}}</div>';
    var html = Mustache.to_html(userDataWrapper, data);
    $('#user-account-wrapper').html(html);

    /* /retrieving data from url and load user information */
});
