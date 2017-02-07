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

    // $(function() {
    //     $('#datetimepicker1').datetimepicker({
    //         language: 'pt-BR',
    //         pickTime: false,
    //     });
    // });
    /*$(function() {
        $('#date-picker').datetimepicker({
            pickDate: false,
            pickSeconds: false,
        });
        $('#time-picker').datetimepicker({
            pickDate: false,
            pickSeconds: false,
        });
    });*/

    /**NEW INTERVIEW FORM VALIDATION*/
    /*Function for Wrong input text*/
    function fieldWrongInput (inpfield) {
        var input = $(inpfield);
        var pos = input.position();
        $('<div class="wrong-input" />')
        .html("Incorrect format")
        .css({
            top: pos.top + input.height()  + 5,
        }).insertAfter(input);
    }

    /*Input validation - firstName*/
    $("#new-int-firstName").blur(function () {
        var firstName = $(this).val();
        var regex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð']+$/;
        if ( !regex.test(firstName) && firstName.length!=0) {
            fieldWrongInput("#new-int-firstName");
        }
        if ( regex.test(firstName) && firstName.length!=0) {
            $('#new-int-firstName + div.wrong-input').hide();
        }
    });

    /*Input validation - lastName*/
    $("#new-int-lastName").blur(function () {
        var lastName = $(this).val();
        var regex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð']+$/;
        if ( !regex.test(lastName) && lastName.length!=0) {
            fieldWrongInput("#new-int-lastName");
        }
        if ( regex.test(lastName) && lastName.length!=0) {
            $('#new-int-lastName + div.wrong-input').hide();
        }
    });

    /*Input validation - Phone number*/
    $("#new-int-phone").blur(function () {
        var phone = $(this).val();
        var regex = /^[\s()+-]*([0-9][\s()+-]*){6,20}$/;
        if ( !regex.test(phone) && phone.length!=0) {
            fieldWrongInput("#new-int-phone");
        }
        if ( regex.test(phone) && phone.length!=0) {
            $('#new-int-phone + div.wrong-input').hide();
        }
    });

    /*Input validation - Email*/
    $("#new-int-email").blur(function () {
        var email = $(this).val();
        var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if ( !regex.test(email) && email.length!=0) {
            fieldWrongInput("#new-int-email");
        }
        if ( regex.test(email) && email.length!=0) {
            $('#new-int-email + div.wrong-input').hide();
        }
    });

    /*Input validation - Date*/
    // $("#new-int-date").blur(function () {
    //     var date = $(this).val();
    //     var regex = /^(?:(?:(?:0?[13578]|1[02])(\/|-|\.)31)\1|(?:(?:0?[1,3-9]|1[0-2])(\/|-|\.)(?:29|30)\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:0?2(\/|-|\.)29\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:(?:0?[1-9])|(?:1[0-2]))(\/|-|\.)(?:0?[1-9]|1\d|2[0-8])\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
    //     if ( !regex.test(date) && date.length!=0) {
    //         fieldWrongInput("#new-int-date");
    //     }
    //     if ( regex.test(date) && date.length!=0) {
    //         $('#new-int-date + div.wrong-input').hide();
    //     }
    // });

    /*Input validation - Time*/
    // $("#new-int-time").blur(function () {
    //     var time = $(this).val();
    //     var regex = /^([0-2][1-9]):[0-5][0-9]$/;
    //     if ( !regex.test(time) && time.length!=0) {
    //         fieldWrongInput("#new-int-time");
    //     }
    //     if ( regex.test(time) && time.length!=0) {
    //         $('#new-int-time + div.wrong-input').hide();
    //     }
    // });
    /*NEW INTERVIEW FORM VALIDATION**/

    /**NEW INTERVIEW DATA*/

    $("#btn-my-int-save").on('click', function(event) {
        event.preventDefault();
        //if (validData == 5) {
            sendNewInterviewToServer();
        //}
    });

    function sendNewInterviewToServer () {

        var time = "2016-12-13T09:34Z";

        var candidate = {
            firstName: $("#new-int-firstName").val(),
            lastName: $("#new-int-lastName").val(),
            phone: $("#new-int-phone").val(),
            skype: $("#new-int-skype").val(),
            email: $("#new-int-email").val(),
            position: $( "#new-int-position option:selected" ).text().toUpperCase(),
        };
        var interview = {
            location: $("#new-int-location option:selected").text().toUpperCase(),
            room: $("#new-int-room option:selected").text().toUpperCase(),
            dateTime: time,
            userId: $("#new-int-assperson option:selected").text(),
        }
        console.log(JSON.stringify({"candidate":candidate, "interview":interview}));
        $.ajax({
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            },
            url: 'http://localhost:8081/api/interviews',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({"candidate":candidate, "interview":interview}),
            success: function () {
                window.location.href = 'index.html';    
            }
        });
    }
    
    /*NEW INTERVIEW DATA**/
});
