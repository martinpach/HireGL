$(document).ready(function () {
    var token = 'Bearer ' + localStorage.getItem("token");
    var startingInterview = 1;
    var countInterviews;
    var ajaxData;
    /*on click to new interview*/
    $('#menu-new-interview , #new-interview-r').on('click', function () {
        /*changing main content to new interview form and getting from server positons, locations and rooms*/
        $('#main-content').load('templates/new-interview.html', function () {

            /*call server to receive locations*/
            if (ajaxRequest('/api/locations', 'GET')) {
                /*changing format of data form server and creating new options to select tag in locations*/
                for (var i = 0; i < ajaxData.length; i++) {
                    var text = ajaxData[i].toLowerCase().replace(/\b[a-z]/g, function (letter) {
                        return letter.toUpperCase();
                    });
                    $('<option />', {
                        "class": 'locations',
                        "value": 'loc_' + ajaxData[i].toLowerCase().replace(/ /g, "_")
                    }).text(text).appendTo("#new-int-location");
                }
                /*changing format of data form server and creating new options to select tag in locations END*/
                //if is location choosen/changed
                $("#new-int-location").on('change', function () {
                    var option = $("#new-int-location option:selected").text().toUpperCase();
                    //getting from server rooms which are in selected location
                    if (ajaxRequest('/api/locations/' + option + '/rooms', 'GET')) {
                        /*cleaning room options*/
                        var to = ($("#new-int-room").children().length) - 1;
                        for (var g = 1; g <= to; g++) {
                            $("#new-int-room").children().eq(1).remove();
                        }
                        /*cleaning room options*/
                        for (var j = 0; j < ajaxData.length; j++) {
                            var text = ajaxData[j].toLowerCase().replace(/\b[a-z]/g, function (letter) {
                                return letter.toUpperCase();
                            });
                            /*creating new room options and changing text format*/
                            $('<option />', {
                                "value": 'room_' + ajaxData[j].toLowerCase().replace(/ /g, "_")
                            }).text(text).appendTo("#new-int-room");
                            /*creating new room options and changing text format END*/
                        }
                    }

                });
            }

            /*call server and receive locations END*/
            /*call server and receive positions*/
            if (ajaxRequest('/api/positions', 'GET')) {
                /*creating new positon options*/
                for (var i = 0; i < ajaxData.length; i++) {
                    var text = ajaxData[i].toLowerCase().replace(/\b[a-z]/g, function (letter) {
                        return letter.toUpperCase();
                    });
                    $('<option />').text(text).appendTo("#new-int-position");
                }
                /*creating new positon options END*/
            }

            /*call server and receive positions END*/
            /*call server and receive users*/
            if (ajaxRequest('/api/users', 'GET')) {
                /*creating new positon options*/
                for (var i in ajaxData) {
                    var firstName = ajaxData[i].firstName.toLowerCase().replace(/\b[a-z]/g, function (letter) {
                        return letter.toUpperCase();
                    });
                    var lastName = ajaxData[i].lastName.toLowerCase().replace(/\b[a-z]/g, function (letter) {
                        return letter.toUpperCase();
                    });
                    var text = firstName + " " + lastName;
                    $('<option />', {
                        "id": (Number(i) + 1)
                    }).text(text).appendTo("#new-int-assperson");
                }
                /*creating new assigned person options END*/
            }

            /*call server and receive users END*/
        });
        $("#page-title, #title-r").html("New Interview");
        $("#menu-interviews").removeClass("selected");
        $("#menu-new-interview").addClass("selected");
    });
    /*on click to new interview*/
    $("#new-interview-r").on("click", function () {
        $("#new-interview-r").addClass("selected-r");
        $("#my-interviews-r").removeClass("selected-r");
    });
    $('#menu-interviews, #my-interviews-r').on('click', function () {
        updateMyInterviews();
        $("#page-title, #title-r").html("My Interviews");
        $("#menu-new-interview").removeClass("selected");
        $("#menu-interviews").addClass("selected");
    });
    $("#menu-interviews").trigger("click");
    /* retrieving data from local storage and load user information */
    var data = {
        firstName: localStorage.getItem("firstName"),
        lastName: localStorage.getItem("lastName"),
        photoUrl: localStorage.getItem("photoUrl")
    };
    var userDataWrapper = '<div id="userData"><span id="v-align"><img src="{{photoUrl}}" id="user-icon">{{firstName}} {{lastName}}</span><i class="material-icons basic-icon" id="logout">arrow_forward</i></div>';
    var html = Mustache.to_html(userDataWrapper, data);
    var userDataWrapperResponsive = '<div id="userData-r"><img src="{{photoUrl}}" id="user-icon-r"><i class="material-icons basic-icon" id="logout-r">arrow_forward</i></div>';
    var htmlResponsive = Mustache.to_html(userDataWrapperResponsive, data);
    $('#user-account-wrapper').html(html);
    $('#user-account-wrapper-r').html(htmlResponsive);
    /* END of retrieving data from local storage and load user information */
    /* event handlers */
    /* logout after clicking arrow button */
    $('#user-account-wrapper, #user-account-wrapper-r').on('click', 'i', function () {

        if (ajaxRequest('/api/auth/logout', 'POST')) window.location.href = 'index.html';

    });

    function getPositions() {
        if (ajaxRequest('/api/positions', 'GET')) {
            /*creating new positon options*/
            for (var i = 0; i < ajaxData.length; i++) {
                var text = ajaxData[i].toLowerCase().replace(/\b[a-z]/g, function (letter) {
                    return letter.toUpperCase();
                });
                $('<option />').text(text).appendTo("#new-int-position").val(text.toLowerCase().slice(0, 4));
            }
        }
    }

    function getLocations() {
        if (ajaxRequest('/api/locations/', 'GET')) {
            /*changing format of data form server and creating new options to select tag in locations*/
            for (var i = 0; i < ajaxData.length; i++) {
                var text = ajaxData[i].toLowerCase().replace(/\b[a-z]/g, function (letter) {
                    return letter.toUpperCase();
                });
                $('<option />', {
                    "class": 'locations',
                    "value": 'loc_' + ajaxData[i].toLowerCase().replace(/ /g, "_")
                }).text(text).appendTo("#new-int-location").val(text.toLowerCase().slice(0, 4));
            }
        }
    }

    function getRoom() {
        var option = $("#new-int-location option:selected").text().toUpperCase();
        //getting from server rooms which are in selected location
        if (ajaxRequest('/api/locations/' + option + '/rooms', 'GET')) {
            /*cleaning room options*/
            var to = ($("#new-int-room").children().length) - 1;
            for (var g = 1; g <= to; g++) {
                $("#new-int-room").children().eq(1).remove();
            }
            /*cleaning room options*/
            for (var j = 0; j < ajaxData.length; j++) {
                var text = ajaxData[j].toLowerCase().replace(/\b[a-z]/g, function (letter) {
                    return letter.toUpperCase();
                });
                /*creating new room options and changing text format*/
                $('<option />', {
                    "value": 'room_' + ajaxData[j].toLowerCase().replace(/ /g, "_")
                }).text(text).appendTo("#new-int-room").val(text.toLowerCase().slice(0, 3));
                /*creating new room options and changing text format END*/
            }

        }

    }
    function getAssPerson () {
        if (ajaxRequest('/api/users', 'GET')) {
            /*creating new positon options*/
            for (var i in ajaxData) {
                var firstName = ajaxData[i].firstName.toLowerCase().replace(/\b[a-z]/g, function (letter) {
                    return letter.toUpperCase();
                });
                var lastName = ajaxData[i].lastName.toLowerCase().replace(/\b[a-z]/g, function (letter) {
                    return letter.toUpperCase();
                });
                var text = firstName + " " + lastName;
                $('<option />', {
                    "id": (Number(i) + 1)
                }).text(text).appendTo("#new-int-assperson").val(i);
            }
            /*creating new assigned person options END*/
        }
    }
    /**NEW INTERVIEW FORM VALIDATION*/
    /*Function for Wrong input text*/
    function fieldWrongInput(inpfield, fieldMessage) {
        var input = $(inpfield);
        var pos = input.position();
        $('<div class="wrong-input" />').html(fieldMessage).css({
            top: pos.top + input.height() + 5,
        }).insertAfter(input);
    }
    // /*Forbidden keys - firstName, lastName*/
    // $(document).on('keypress', "#new-int-firstName, #new-int-lastName", function (event) {
    //     var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    //     var regex = /^[^\x00-\x7F]+$/;
    //     var regexx = /^[a-z]+$/i;
    //     if (!regex.test(key) && !regexx.test(key)) {
    //         event.preventDefault();
    //     }
    // });
    /*Input format validation - Phone number*/
    $(document).on('blur', "#new-int-phone", function () {
        var phone = $(this).val();
        var regex = /^[\s()+-]*([0-9][\s)]*){6,20}$/;
        $('#new-int-phone + div.wrong-input').remove();
        if (!regex.test(phone) && phone.length != 0) {
            fieldWrongInput("#new-int-phone", "Incorrect format");
            $('#new-int-phone + div.wrong-input').show();
        }
    });
    /*Forbidden keys - phone*/
    $(document).on('keypress', "#new-int-phone", function (event) {
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        var regex = /^[0-9\s()+-]$/;
        if (!regex.test(key)) {
            event.preventDefault();
        }
    });
    /*Input format validation - Email*/
    $(document).on('blur', "#new-int-email", function () {
        var email = $(this).val();
        var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        $('#new-int-email + div.wrong-input').remove();
        if (!regex.test(email) && email.length != 0) {
            fieldWrongInput("#new-int-email", "Incorrect format");
            $('#new-int-email + div.wrong-input').show();
        }
    });
    /*inputs on change - add/remove class*/
    $(document).on('change', "#new-int-date", function () {
        $("#new-int-date").addClass('selected-option');
    });
    $(document).on('change', "#new-int-time", function () {
        $("#new-int-time").addClass('selected-option');
    });
    $(document).on('blur', "select", function () {
        if ($("#new-int-room :selected").text() != "Choose Room") {
            $("#new-int-room").addClass('selected-option');
        } else $("#new-int-room").removeClass('selected-option');
        if ($("#new-int-location :selected").text() != "Enter Location") {
            $("#new-int-location").addClass('selected-option');
        } else $("#new-int-location").removeClass('selected-option');
        if ($("#new-int-position :selected").text() != "Choose position") {
            $("#new-int-position").addClass('selected-option');
        } else $("#new-int-position").removeClass('selected-option');
        if ($("#new-int-assperson :selected").text() != "Choose person") {
            $("#new-int-assperson").addClass('selected-option');
        } else $("#new-int-assperson").removeClass('selected-option');
    });
    /*NEW INTERVIEW INPUTS VALIDATIONS END**/
    /**NEW INTERVIEW DATA*/
    function areInputsFill() {
        var notEmpty = 1;
        //FIRSTNAME
        if ($('#new-int-firstName').val().length == 0) {
            if (!$('#new-int-firstName + div.wrong-input').length) fieldWrongInput("#new-int-firstName", "Name cannot be empty");
            notEmpty = 0;
            $('#new-int-firstName + div.wrong-input').show();
        } else $('#new-int-firstName + div.wrong-input').hide();
        //LASTNAME
        if ($('#new-int-lastName').val().length == 0) {
            if (!$('#new-int-lastName + div.wrong-input').length) fieldWrongInput("#new-int-lastName", "Surname cannot be empty");
            notEmpty = 0;
            $('#new-int-lastName + div.wrong-input').show();
        } else $('#new-int-lastName + div.wrong-input').hide();
        //PHONE
        if (!$('#new-int-phone + div.wrong-input').length) {
            if ($('#new-int-phone').val().length == 0) {
                fieldWrongInput("#new-int-phone", "Phone cannot be empty");
                notEmpty = 0;
            } else {
                $('#new-int-phone + div.wrong-input').remove();
            }
        } else notEmpty = 0;
        //EMAIL
        if (!$('#new-int-email + div.wrong-input').length) {
            if ($('#new-int-email').val().length == 0) {
                fieldWrongInput("#new-int-email", "Email cannot be empty");
                notEmpty = 0;
            } else {
                $('#new-int-email + div.wrong-input').remove();
            }
        } else notEmpty = 0;
        //DATE
        if ($('#new-int-date').val().length == 0) {
            if (!$('#new-int-date + div.wrong-input').length) fieldWrongInput("#new-int-date", "Date must be set");
            notEmpty = 0;
            $('#new-int-date + div.wrong-input').show();
        } else $('#new-int-date + div.wrong-input').hide();
        //TIME
        if ($('#new-int-time').val().length == 0) {
            if (!$('#new-int-time + div.wrong-input').length) fieldWrongInput("#new-int-time", "Time must be set");
            notEmpty = 0;
            $('#new-int-time + div.wrong-input').show();
        } else $('#new-int-time + div.wrong-input').hide();
        //POSITION
        if ($("#new-int-position option:selected").text() == "Choose position") {
            if (!$('#new-int-position + div.wrong-input').length) fieldWrongInput("#new-int-position", "Please choose one option");
            notEmpty = 0;
            $('#new-int-position + div.wrong-input').show();
        } else $('#new-int-position + div.wrong-input').hide();
        //LOCATION
        if ($("#new-int-location option:selected").text() == "Enter Location") {
            if (!$('#new-int-location + div.wrong-input').length) fieldWrongInput("#new-int-location", "Please choose one option");
            notEmpty = 0;
            $('#new-int-location + div.wrong-input').show();
        } else $('#new-int-location + div.wrong-input').hide();
        //ROOM
        if ($("#new-int-room option:selected").text() == "Choose Room") {
            if (!$('#new-int-room + div.wrong-input').length) fieldWrongInput("#new-int-room", "Please choose one option");
            notEmpty = 0;
            $('#new-int-room + div.wrong-input').show();
        } else $('#new-int-room + div.wrong-input').hide();
        if (notEmpty == 0) {
            return false;
        } else {
            return true;
        }
    }
    /*Assigned Person - string to number*/
    function getNumberOfAssignedPerson () {
        var assPerson = $("#new-int-assperson option:selected").text().toLowerCase();
        switch (assPerson) {
            case "first user":
                return 1;
                break;
            case "second user":
                return 2;
                break;
            case "third user":
                return 3;
                break;
            case "fourth user":
                return 4;
                break;
            default:
                return 0;
                break;
        }
    }

    /*New interview save button*/
    $(document).on('click', '#btn-my-int-save', function (event) {
        event.preventDefault();
        if (areInputsFill()) {
            sendNewInterviewToServer();
        }
    });
    /*POST NEW interview*/
    function sendNewInterviewToServer() {
        var dateVal = $("#new-int-date").val();
        var timeVal = $("#new-int-time").val();
        /*expected date format: "2016-12-13T09:34Z"*/
        var time = dateVal + "T" + timeVal + "Z";
        var assPersonId = getNumberOfAssignedPerson ();

        var candidate = {
            firstName: $("#new-int-firstName").val(),
            lastName: $("#new-int-lastName").val(),
            phone: $("#new-int-phone").val(),
            skype: $("#new-int-skype").val(),
            email: $("#new-int-email").val(),
            position: $("#new-int-position option:selected").text().toUpperCase(),
        };
        var interview = {
            location: $("#new-int-location option:selected").text().toUpperCase(),
            room: $("#new-int-room option:selected").text().toUpperCase(),
            dateTime: time,
            userId: assPersonId,
        }
        var jData = JSON.stringify({
            "candidate": candidate,
            "interview": interview
        });
        console.log(jData);
        if (ajaxRequest('/api/interviews', 'POST', jData)) updateMyInterviews();

    }
    /*PUT UPDATE interview*/
    function sendEditInterviewToServer() {
        var dateVal = $("#new-int-date").val();
        var timeVal = $("#new-int-time").val();
        var time = dateVal + "T" + timeVal + "Z";
        var candidate = {
            firstName: $("#new-int-firstName").val(),
            lastName: $("#new-int-lastName").val(),
            phone: $("#new-int-phone").val(),
            skype: $("#new-int-skype").val(),
            email: $("#new-int-email").val(),
            position: $("#new-int-position option:selected").text().toUpperCase(),
        };
        var interview = {
            location: $("#new-int-location option:selected").text().toUpperCase(),
            room: $("#new-int-room option:selected").text().toUpperCase(),
            dateTime: time,
            userId: 1,
            //note: $("#new-int-note").val(),
        }
        var jData = JSON.stringify({
            "candidate": candidate,
            "interview": interview
        });

        if (ajaxRequest('/api/interviews/' + idRow, 'PUT', jData)) updateMyInterviews();


    }
    /*PUT CLOSE interview*/
    function closeInterview() {
        if (ajaxRequest('/api/interviews/' + idRow + '/closed', 'PUT')) {
            updateMyInterviews();
        }
    }
    var candicateName = "";
    var candidateFirstName = "";
    var candidateLastName = "";
    var workPosition = "";
    var candicateTelephone = "";
    var candicateEmail = "";
    var candicateSkype = "";
    var interviewDate = "";
    var interviewTime = "";
    var interviewLocation = "";
    var interviewRoom = "";
    var interviewAssignedPerson = "";
    var interviewAssignedPersonID = "";
    var interviewNotes = "";
    var idRow;

    function getIntervievDataById(actModal) {

        if (ajaxRequest('/api/interviews/' + idRow, 'GET')) {
            candicateName = (ajaxData.candidate.firstName) + " " + (ajaxData.candidate.lastName);
            candidateFirstName = ajaxData.candidate.firstName;
            candidateLastName = ajaxData.candidate.lastName;
            workPosition = ajaxData.candidate.position;
            candicateTelephone = ajaxData.candidate.phone;
            candicateEmail = ajaxData.candidate.email;
            candicateSkype = ajaxData.candidate.skype;
            interviewDate = (ajaxData.interview.dateTime).slice(0, (ajaxData.interview.dateTime).indexOf('T'));
            interviewTime = (ajaxData.interview.dateTime).slice((ajaxData.interview.dateTime).indexOf('T') + 1);
            interviewLocation = ajaxData.interview.location;
            interviewRoom = ajaxData.interview.room;
            interviewAssignedPerson = (ajaxData.interview.user.firstName)+" "+(ajaxData.interview.user.lastName);
            interviewAssignedPersonID = ajaxData.interview.user.id;
            interviewNotes = ajaxData.interview.note;
            if (actModal) {
                activateModal();
            }
        }

    }
    /*CLICK on EDIT pic in my int*/
    $('#main-content').on('click', '.edit-icon', function (event) {
        event.preventDefault();
        var idRow = $(this).parent().parent().attr('data-id');
        showEditInterviewTab();
    });

    function upperCaseFirstLetter(str) {
        var pieces = str.split(" ");
        for (var i = 0; i < pieces.length; i++) {
            var j = pieces[i].charAt(0).toUpperCase();
            pieces[i] = j + pieces[i].substr(1);
        }
        return pieces.join(" ");
    }
    /**EDIT-INTERVIEW*/
    /*Lead Edit-interview tab*/
    function showEditInterviewTab() {
        $('#main-content').load('templates/edit-interview.html', function () {
            $("#page-title, #title-r").html("Edit Interviews");
            $("#menu-new-interview").removeClass("selected");
            $("#menu-interviews").removeClass("selected");
            getIntervievDataById(false);
            $('#new-int-firstName').val(candidateFirstName);
            $('#new-int-lastName').val(candidateFirstName);
            $('#new-int-phone').val(candicateTelephone);
            $('#new-int-email').val(candicateEmail);
            $('#new-int-skype').val(candicateSkype);
            $('#new-int-date').val(interviewDate);
            $('#new-int-time').val(interviewTime);
            $('#new-int-note').val(interviewNotes);
            getPositions();
            $('#new-int-position').val(workPosition.toLowerCase().slice(0, 4));
            getLocations();
            $('#new-int-location').val(interviewLocation.toLowerCase().slice(0, 4));
            getRoom();
            $('#new-int-room').val(interviewRoom.toLowerCase().slice(0, 3));
            getAssPerson();
            $('#new-int-assperson').val(--interviewAssignedPersonID);
            $("#new-int-date").addClass('selected-option');
            $("#new-int-time").addClass('selected-option');
            $("#new-int-room").addClass('selected-option');
            $("#new-int-location").addClass('selected-option');
            $("#new-int-assperson").addClass('selected-option');
        });
    }
    /*$(document).on('change', '#new-int-location', function () {
        while ($('#new-int-room option:last').text() != "Choose Room") {
            $('#new-int-room option:last').remove();
        }
        var option = $("#new-int-location option:selected").text().toUpperCase();
        //getting from server rooms which are in selected location
        $.ajax({
            url: 'http://localhost:8081/api/locations/' + option + '/rooms'
            , type: 'GET'
            , async: false
            , beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            }
            , success: function (data) {
                var to = ($("#new-int-room").children().length) - 1;
                for (var g = 1; g <= to; g++) {
                    $("#new-int-room").children().eq(1).remove();
                }
                for (var j = 0; j < data.length; j++) {
                    var text = data[j].toLowerCase().replace(/\b[a-z]/g, function (letter) {
                        return letter.toUpperCase();
                    });
                    $('<option />', {
                        "value": 'room_' + data[j].toLowerCase().replace(/ /g, "_")
                    }).text(text).appendTo("#new-int-room");
                }
            }
            , error: function () {
                activateErrorModal();
            }
        , });
    });*/
    /*Save Edited Interview*/
    $(document).on('click', '#btn-edit-int-save,#btn-edit-int-save-r', function (event) {
        event.preventDefault();
        if (areInputsFill()) {
            sendEditInterviewToServer()
        }
    });
    /*Close Interview*/
    $(document).on('click', '#btn-edit-int-close,#btn-edit-int-close-r', function (event) {
        event.preventDefault();
        closeInterview();
    });
    /*Cancel Edit Interview*/
    $(document).on('click', '#btn-edit-int-cancel,#btn-my-int-cancel,#btn-edit-int-cancel-r', function (event) {
        event.preventDefault();
        updateMyInterviews();
    });
    /*EDIT-INTERVIEW**/
    /*MODAL*/
    var picture = "pictures/default-user.png";
    $(".content").on('click', '.td-display-modal', function () {
        idRow = $(this).parent().attr('data-id');
        getIntervievDataById(true);
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
            "class": 'material-icons icoDisable',
            "id": 'icoDisableLeft'
        }).text("clear").appendTo(".left");
        $('<h1 />', {
            "class": 'heading',
            "id": 'hCandidate'
        }).appendTo(".left");
        $("#hCandidate").text("Candidate");
        //adding candicate image
        $('<div />', {
            "class": 'flex',
            "id": 'cMain'
        }).appendTo(".left");
        $('<img />', {
            "class": 'candidateImage',
            "src": picture
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
            "class": 'flex',
            "id": 'cTelephone'
        }).appendTo(".left");
        $('<i />', {
            "class": 'material-icons candidateInfoLeft'
        }).text("call").appendTo("#cTelephone");
        $('<h5 />', {
            "class": 'candidateInfoRight'
        }).text(candicateTelephone).appendTo("#cTelephone");
        //email
        $('<div />', {
            "class": 'flex',
            "id": 'cEmail'
        }).appendTo(".left");
        $('<i />', {
            "class": 'material-icons candidateInfoLeft'
        }).text("email").appendTo("#cEmail");
        $('<h5 />', {
            "class": 'candidateInfoRight'
        }).text(candicateEmail).appendTo("#cEmail");
        //skype
        $('<div />', {
            "class": 'flex',
            "id": 'cSkype'
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
            "class": 'material-icons icoDisable',
            "id": 'icoDisableRight'
        }).text("clear").appendTo(".right");
        $('<h1 />', {
            "class": 'heading',
            "id": 'hInterview'
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
            "class": 'material-icons',
            "id": 'edit'
        }).text("create").appendTo("#editInterview");
        $('<i />', {
            "class": 'material-icons',
            "id": 'delete'
        }).text("delete").appendTo("#editInterview");
        $("#icoDisableRight").on('click', function () {
            mui.overlay('off');
        });
        $("#icoDisableLeft").on('click', function () {
            mui.overlay('off');
        });
        /*CLICK on EDIT pic in modal*/
        $(document).on('click', '#edit', function (event) {
            event.preventDefault();
            mui.overlay('off');
            showEditInterviewTab();
        });
        $(document).on('click', '#delete', function (event) {
            // if (ajaxRequest('/api/interviews/' + idRow, 'DELETE')) updateMyInterviews();
            // mui.overlay('off');
            deleteModalPopUp(idRow);
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
            "class": 'material-icons icoDisable',
            "id": 'icoDisableRight'
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
    function updateMyInterviews() {
        $('#main-content').load('templates/my-interviews.html', function () {
            startingInterview = 1;
            getNumberOfInterviews();
            if (countInterviews > 0) {
                getInterviews(1, 5);
            }
            setText();
            setPaginationButtons();
            $("#page-title, #title-r").html("My Interviews");
            $("#menu-new-interview").removeClass("selected");
            $("#menu-interviews").addClass("selected");
        });
    }

    function getInterviews(start, limit) {
        if (ajaxRequest('/api/interviews?limit=' + limit + '&start=' + start, 'GET')) {
            $('#main-content').load('templates/my-interviews.html', function () {
                generateInterviewRows(ajaxData);
                setText();
                setPaginationButtons();
            });
        }

    }

    function generateInterviewRows(interviews) {
        for (var i = 0; i < interviews.length; i++) {
            var tr = $('<tr />', {
                'class': 'tr-content',
                'data-id': interviews[i].id
            }).appendTo("tbody");
            var td1 = $('<td />', {
                'class': 'td-display-modal'
            }).html('<i class="material-icons mui--no-user-select basic-icon">&#xE7FF;</i>').appendTo(tr);
            var td2 = $('<td />', {
                'class': 'td-my-interviews td-display-modal'
            }).appendTo(tr);
            var div_name = $('<div />', {
                "class": 'name-of-applicant'
            }).text(interviews[i].candidate.firstName + " " + interviews[i].candidate.lastName).appendTo(td2);
            var div_position = $('<div />', {
                "class": 'job-type'
            }).text(interviews[i].candidate.position).appendTo(td2);
            div_name.appendTo(td2);
            div_position.appendTo(td2);
            var td3 = $('<td />', {
                'class': 'td-my-interviews td-display-modal'
            }).text(interviews[i].candidate.phone).appendTo(tr);
            var td4 = $('<td />', {
                'class': 'td-my-interviews td-display-modal'
            }).text(interviews[i].candidate.email).appendTo(tr);
            var td5 = $('<td />', {
                'class': 'td-my-interviews td-display-modal'
            }).text(interviews[i].interview.status).appendTo(tr);
            var td6 = $('<td />', {
                'class': 'td-my-interviews'
            }).html('<i class="material-icons delete-icon basic-icon">&#xE872;</i><i class="material-icons edit-icon basic-icon">&#xE150;</i>').appendTo(tr);
        }
    }
    /*END MY INTERVIEWS*/


    /* PAGINATION */
    function getNumberOfInterviews() {
        if (ajaxRequest('/api/interviews/count', 'GET')) countInterviews = ajaxData.count;

    }

    function setPaginationButtons() {
        if (countInterviews - startingInterview >= 5 && startingInterview == 1) {
            $('#next-page').prop('disabled', false);
            $('#prev-page').prop('disabled', true);
        } else if (countInterviews - startingInterview >= 5 && startingInterview != 1) {
            $('#next-page').prop('disabled', false);
            $('#prev-page').prop('disabled', false);
        } else if (countInterviews - startingInterview <= 5 && startingInterview >= 6) {
            $('#next-page').prop('disabled', true);
            $('#prev-page').prop('disabled', false);
        } else {
            $('#next-page').prop('disabled', true);
            $('#prev-page').prop('disabled', true);
        }
    }

    function setText() {
        if (countInterviews < 1) {
            $('#showed-pages').hide();
        } else {
            var to = (startingInterview + 4 > countInterviews) ? countInterviews : startingInterview + 4;
            var data = {
                from: startingInterview,
                to: to,
                total: countInterviews
            }
            var text = 'SHOWING {{from}} - {{to}} FROM {{total}}';
            var html = Mustache.to_html(text, data);
            $('#showed-pages').html(html);
            $('#showed-pages').show();
        }
    }
    $('#main-content').on('click', '#prev-page', function () {
        startingInterview -= 5;
        getInterviews(startingInterview, 5);
        setText();
        setPaginationButtons();
    });
    $('#main-content').on('click', '#next-page', function () {
        startingInterview += 5;
        getInterviews(startingInterview, 5);
        setText();
        setPaginationButtons();
    });
    /* END PAGINATION */
    /** DELETE 1 INTERVIEW*/
    $('#main-content').on('click', '.delete-icon', function () {
        var interviewID = ($(this).parent().parent().attr('data-id'));
        deleteModalPopUp(interviewID);
    });

    function deleteModalPopUp(id) {
        var modalDelete = document.createElement('div');
        modalDelete.className = "mui-col-md-6 mui-col-sm-12 mui--z5 delete-int-box ";
        modalDelete.style.margin = '100px auto';
        mui.overlay('on', modalDelete);
        $('<h2 />', {
            "class": 'delete-header-h2'
        }).text("Are you sure you want to delete this interview?").appendTo(".delete-int-box");
        $('<div />',{
            "class": 'delete-btn-cont'
        }).appendTo('.delete-int-box');

        $('<div />',{
            "class": 'delete-btn-cont-cont'
        }).appendTo('.delete-btn-cont');

        $('<button />', {
            "class": 'mui-btn mui-btn--raised',
            "id": 'delete-confirmation-ok'
        }).text(' DELETE ').appendTo('.delete-btn-cont-cont');
        $('<button />', {
            "class": 'mui-btn mui-btn--raised',
            "id": 'delete-confirmation-cancel'
        }).text(' CANCEL ').appendTo('.delete-btn-cont-cont');

        $("#delete-confirmation-cancel").on('click', function () {
            mui.overlay('off');
        });
        $("#delete-confirmation-ok").on('click', function () {
            mui.overlay('off');
            if (ajaxRequest('/api/interviews/' + id, 'DELETE')){
                updateMyInterviews();
            }
        });
    }

    /** END DELETE 1 INTERVIEW*/
    /*AJAX REQUEST*/
    function ajaxRequest(ajaxUrl, typeOfRequest, dataToSend) {
        var ajaxSuccess = false;

        $.ajax({
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', token);
            },
            async: false,
            url: 'http://localhost:8081' + ajaxUrl,
            type: typeOfRequest,
            data: dataToSend,
            contentType: 'application/json',
            success: function (data) {
                if (data != null) ajaxData = data;
                ajaxSuccess = true
            },
            error: function () {
                console.log("Error");
            }
        });

        return ajaxSuccess;
    }
    /*END AJAX REQUEST*/
});
