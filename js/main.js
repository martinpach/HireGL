$(document).ready(function () {
    /* loading templates */
    $('#main-content').load('../templates/my-interviews.html', function () {
        getInterviews(1, 5);
    });
    $('#menu-new-interview , #new-interview-r').on('click', function () {
        $('#main-content').load('templates/new-interview.html');
        $("#page-title, #title-r").html("New Interview");
        $("#menu-interviews").removeClass("selected");
        $("#menu-new-interview").addClass("selected");
    });
    $("#new-interview-r").on("click", function () {
        $("#new-interview-r").addClass("selected-r");
        $("#my-interviews-r").removeClass("selected-r");
    });
    $('#menu-interviews, #my-interviews-r').on('click', function () {
        $('#main-content').load('templates/my-interviews.html');
        $("#page-title, #title-r").html("My Interviews");
        $("#menu-new-interview").removeClass("selected");
        $("#menu-interviews").addClass("selected");
        getInterviews(1, 5);
    });
    $("#my-interviews-r").on("click", function () {
        $("#my-interviews-r").addClass("selected-r");
        $("#new-interview-r").removeClass("selected-r");
    });
    $("#menu-interviews").trigger("click");
    /* retrieving data from local storage and load user information */
    var data = {
        firstName: localStorage.getItem("firstName")
        , lastName: localStorage.getItem("lastName")
        , photoUrl: localStorage.getItem("photoUrl")
    };
    var token = localStorage.getItem("token");
    var userDataWrapper = '<div id="userData"><span id="v-align"><img src="{{photoUrl}}" id="user-icon">{{firstName}} {{lastName}}</span><i class="material-icons" id="logout">arrow_forward</i></div>';
    var html = Mustache.to_html(userDataWrapper, data);
    var userDataWrapperResponsive = '<div id="userData-r"><img src="{{photoUrl}}" id="user-icon-r"><i class="material-icons" id="logout-r">arrow_forward</i></div>';
    var htmlResponsive = Mustache.to_html(userDataWrapperResponsive, data);
    $('#user-account-wrapper').html(html);
    $('#user-account-wrapper-r').html(htmlResponsive);
    /* END of retrieving data from local storage and load user information */
    /* event handlers */
    /* logout after clicking arrow button */
    $('#user-account-wrapper, #user-account-wrapper-r').on('click', 'i', function () {
        $.ajax({
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            }
            , url: 'http://localhost:8081/api/auth/logout'
            , type: 'POST'
            , success: function () {
                window.location.href = 'index.html';
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
    function fieldWrongInput(inpfield) {
        var input = $(inpfield);
        var pos = input.position();
        $('<div class="wrong-input" />').html("Incorrect format").css({
            top: pos.top + input.height() + 5
        , }).insertAfter(input);
    }
    /*Input validation - firstName*/
    $("#new-int-firstName").blur(function () {
        var firstName = $(this).val();
        var regex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð']+$/;
        if (!regex.test(firstName) && firstName.length != 0) {
            fieldWrongInput("#new-int-firstName");
        }
        if (regex.test(firstName) && firstName.length != 0) {
            $('#new-int-firstName + div.wrong-input').hide();
        }
    });
    /*Input validation - lastName*/
    $("#new-int-lastName").blur(function () {
        var lastName = $(this).val();
        var regex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð']+$/;
        if (!regex.test(lastName) && lastName.length != 0) {
            fieldWrongInput("#new-int-lastName");
        }
        if (regex.test(lastName) && lastName.length != 0) {
            $('#new-int-lastName + div.wrong-input').hide();
        }
    });
    /*Input validation - Phone number*/
    $("#new-int-phone").blur(function () {
        var phone = $(this).val();
        var regex = /^[\s()+-]*([0-9][\s()+-]*){6,20}$/;
        if (!regex.test(phone) && phone.length != 0) {
            fieldWrongInput("#new-int-phone");
        }
        if (regex.test(phone) && phone.length != 0) {
            $('#new-int-phone + div.wrong-input').hide();
        }
    });
    /*Input validation - Email*/
    $("#new-int-email").blur(function () {
        var email = $(this).val();
        var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regex.test(email) && email.length != 0) {
            fieldWrongInput("#new-int-email");
        }
        if (regex.test(email) && email.length != 0) {
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
    $(document).on('click', '#btn-my-int-save', function (event) {
        event.preventDefault();
        //if (validData == 5) {
        sendNewInterviewToServer();
        $('#main-content').load('../templates/my-interviews.html', function () {
            getInterviews(1, 5);
            $("#page-title, #title-r").html("My Interviews");
            $("#menu-new-interview").removeClass("selected");
            $("#menu-interviews").addClass("selected");
        });
        //}
    });

    function sendNewInterviewToServer() {
        var time = "2016-12-13T09:34Z";
        var candidate = {
            firstName: $("#new-int-firstName").val()
            , lastName: $("#new-int-lastName").val()
            , phone: $("#new-int-phone").val()
            , skype: $("#new-int-skype").val()
            , email: $("#new-int-email").val()
            , position: $("#new-int-position option:selected").text().toUpperCase()
        , };
        var interview = {
            location: $("#new-int-location option:selected").text().toUpperCase()
            , room: $("#new-int-room option:selected").text().toUpperCase()
            , dateTime: time
            , userId: $("#new-int-assperson option:selected").text()
        , }
        console.log(JSON.stringify({
            "candidate": candidate
            , "interview": interview
        }));
        $.ajax({
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            }
            , url: 'http://localhost:8081/api/interviews'
            , type: 'POST'
            , contentType: 'application/json'
            , data: JSON.stringify({
                "candidate": candidate
                , "interview": interview
            })
            , success: function () {
                $('#main-content').load('templates/my-interviews.html');
            }
        });
    }
    /*MODAL*/
    var picture = "pictures/default-user.png";
    var candicateName = "";
    var workPosition = "";
    var candicateTelephone = "";
    var candicateEmail = "";
    var candicateSkype = "";
    var interviewDate = "";
    var interviewTime = "";
    var interviewLocation = "";
    var interviewRoom = "";
    var interviewAssignedPerson = "";
    var interviewNotes = "";
    var idRow;
    $(".content").on('click', 'tr', function () {
        idRow = ($(this).index()) + 1;
        $.ajax({
            url: 'http://localhost:8081/api/interviews/' + idRow
            , type: 'GET'
            , beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            }
            , success: function (data) {
                console.log(data);
                candicateName = (data.candidate.firstName) + " " + (data.candidate.lastName);
                workPosition = data.candidate.position;
                candicateTelephone = data.candidate.phone;
                candicateEmail = data.candidate.email;
                candicateSkype = data.candidate.skype;
                interviewDate = (data.interview.dateTime).slice(0, (data.interview.dateTime).indexOf('T'));
                interviewTime = (data.interview.dateTime).slice((data.interview.dateTime).indexOf('T') + 1);
                interviewLocation = data.interview.location;
                interviewRoom = data.interview.room;
                interviewNotes = data.interview.note;
                activateModal();
            }
            , error: function () {
                console.log("error");
            }
        , });
    });

    function activateModal() {
        // initialize modal element
        var modalEl = document.createElement('div');
        modalEl.className = "mui-col-md-8 mui-col-sm-12 mui--z5 center";
        modalEl.style.margin = '100px auto';
        mui.overlay('on', modalEl);
        // left
        $('<div />', {
            "class": 'left mui-col-md-6'
        }).appendTo(".center");
        $('<i />', {
            "class": 'material-icons icoDisable'
            , "id": 'icoDisableLeft'
        }).text("clear").appendTo(".left");
        $('<h1 />', {
            "class": 'heading'
            , "id": 'hCandidate'
        }).appendTo(".left");
        $("#hCandidate").text("Candidate");
        //adding candicate image
        $('<div />', {
            "class": 'flex'
            , "id": 'cMain'
        }).appendTo(".left");
        $('<img />', {
            "class": 'candidateImage'
            , "src": picture
        }).appendTo("#cMain");
        //candidate name
        $('<div />', {
            "id": 'cDetails'
        }).appendTo("#cMain");
        $('<h3 />', {
            "class": 'candidateName'
        }).appendTo("#cDetails");
        $(".candidateName").text(candicateName);
        //candidate position
        $('<h5 />', {
            "class": 'workPosition'
        }).appendTo("#cDetails");
        $(".workPosition").text(workPosition);
        //telephone
        $('<div />', {
            "class": 'flex'
            , "id": 'cTelephone'
        }).appendTo(".left");
        $('<i />', {
            "class": 'material-icons candidateInfoLeft'
        }).text("call").appendTo("#cTelephone");
        $('<h5 />', {
            "class": 'candidateInfoRight'
        }).text(candicateTelephone).appendTo("#cTelephone");
        //email
        $('<div />', {
            "class": 'flex'
            , "id": 'cEmail'
        }).appendTo(".left");
        $('<i />', {
            "class": 'material-icons candidateInfoLeft'
        }).text("email").appendTo("#cEmail");
        $('<h5 />', {
            "class": 'candidateInfoRight'
        }).text(candicateEmail).appendTo("#cEmail");
        //skype
        $('<div />', {
            "class": 'flex'
            , "id": 'cSkype'
        }).appendTo(".left");
        $('<i />', {
            "class": 'zmdi zmdi-skype zmdi-hc-2x candidateInfoLeft'
        }).appendTo("#cSkype");
        $('<h5 />', {
            "class": 'candidateInfoRight'
        }).text(candicateSkype).appendTo("#cSkype");
        //right
        $('<div />', {
            "class": 'right mui-col-md-6'
        }).appendTo(".center");
        $('<i />', {
            "class": 'material-icons icoDisable'
            , "id": 'icoDisableRight'
        }).text("clear").appendTo(".right");
        $('<h1 />', {
            "class": 'heading'
            , "id": 'hInterview'
        }).appendTo(".right");
        $("#hInterview").text("Interview");
        $('<label />', {
            "class": 'mui--text-dark-secondary infoLeft'
        }).text("Date").appendTo(".right");
        $('<h5 />', {
            "class": 'infoLeft'
        }).text(interviewDate).appendTo(".right");
        $('<label />', {
            "class": 'mui--text-dark-secondary infoLeft'
        }).text("Time").appendTo(".right");
        $('<h5 />', {
            "class": 'infoLeft'
        }).text(interviewTime).appendTo(".right");
        $('<label />', {
            "class": 'mui--text-dark-secondary infoLeft'
        }).text("Location").appendTo(".right");
        $('<h5 />', {
            "class": 'infoLeft'
        }).text(interviewLocation).appendTo(".right");
        $('<label />', {
            "class": 'mui--text-dark-secondary infoLeft'
        }).text("Room").appendTo(".right");
        $('<h5 />', {
            "class": 'infoLeft'
        }).text(interviewRoom).appendTo(".right");
        $('<label />', {
            "class": 'mui--text-dark-secondary infoLeft'
        }).text("Assigned Person").appendTo(".right");
        $('<h5 />', {
            "class": 'infoLeft'
        }).text(interviewAssignedPerson).appendTo(".right");
        $('<label />', {
            "class": 'mui--text-dark-secondary infoLeft'
        }).text("Notes").appendTo(".right");
        $('<h5 />', {
            "class": 'infoLeft'
        }).text(interviewNotes).appendTo(".right");
        $('<div />', {
            "id": 'editInterview'
        }).appendTo(".right");
        $('<i />', {
            "class": 'material-icons'
            , "id": 'edit'
        }).text("create").appendTo("#editInterview");
        $('<i />', {
            "class": 'material-icons'
            , "id": 'delete'
        }).text("delete").appendTo("#editInterview");
        $("#delete").on('mouseenter', function () {
            $(this).text("delete_forever");
        });
        $("#delete").on('mouseleave', function () {
            $(this).text("delete");
        });
        $("#icoDisableRight").on('click', function () {
            mui.overlay('off');
        });
        $("#icoDisableLeft").on('click', function () {
            mui.overlay('off');
        });
    }
    /*MODAL END*/
    /*ERROR MODAL*/
    function activateErrorModal() {
        // initialize modal element
        var modalEl = document.createElement('div');
        modalEl.className = "mui-col-md-6 mui-col-sm-12 mui--z5 center ";
        modalEl.style.margin = '100px auto';
        mui.overlay('on', modalEl);
        $('<i />', {
            "class": 'material-icons icoDisable'
            , "id": 'icoDisableRight'
        }).text("clear").appendTo(".center");
        $('<h1 />', {
            "class": 'mui--text-danger mui--text-center textCenter'
        }).text("Application error has occurred.").appendTo(".center");
        $("#icoDisableRight").on('click', function () {
            mui.overlay('off');
        });
    }
    /*ERROR MODAL*/
    /*NEW INTERVIEW DATA**/
    /*MY INTERVIEWS*/
    function getInterviews(start, limit) {
        $.ajax({
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            }
            , url: 'http://localhost:8081/api/interviews?limit=' + limit + '&start=' + start
            , type: 'GET'
            , success: function (data) {
                $('#main-content').load('../templates/my-interviews.html', function () {
                    generateInterviewRows(data);
                });
            }
            , error: function () {
                console.log("Error pulling interviews!");
            }
        });
    }

    function generateInterviewRows(interviews) {
        for (var i = 0; i < interviews.length; i++) {
            var tr = $('<tr />', {
                "class": 'table-content'
            }).appendTo("tbody");
            var td1 = $('<td />', {}).html('<i class="material-icons mui--no-user-select">&#xE7FF;</i>').appendTo(tr);
            var td2 = $('<td />', {}).appendTo(tr);
            var div_name = $('<div />', {
                "class": 'name-of-applicant'
            }).text(interviews[i].candidate.firstName + " " + interviews[i].candidate.lastName).appendTo(td2);
            var div_position = $('<div />', {
                "class": 'job-type'
            }).text(interviews[i].candidate.position).appendTo(td2);
            div_name.appendTo(td2);
            div_position.appendTo(td2);
            var td3 = $('<td />', {}).text(interviews[i].candidate.phone).appendTo(tr);
            var td4 = $('<td />', {}).text(interviews[i].candidate.email).appendTo(tr);
            var td5 = $('<td />', {}).text(interviews[i].interview.status).appendTo(tr);
            var td6 = $('<td />', {}).html('<i class="material-icons delete-icon">&#xE872;</i><i class="material-icons edit-icon">&#xE150;</i>').appendTo(tr);
        }
    }
    /*END MY INTERVIEWS*/
});