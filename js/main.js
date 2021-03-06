$(document).ready(function () {
    var token = 'Bearer ' + localStorage.getItem("token");
    var startingInterview = 1;
    var countInterviews;
    var ajaxData;
    /*on click to new interview*/
    $('#menu-new-interview , #new-interview-r').on('click', function () {
        /*changing main content to new interview form and getting from server positons, locations and rooms*/
        $('#main-content').load('templates/new-interview.html', function () {
            $("#new-int-time").timepicker();
            $("#new-int-date").datepicker({
                format: "yyyy-mm-dd"
            });
            /*call server to receive locations*/
            ajaxRequest('/api/locations', 'GET').done(function () {
                getLocations().done(function () {
                    /*changing format of data form server and creating new options to select tag in locations*/
                    //if is location choosen/changed
                    $("#new-int-location").on('change', function () {
                        getRoom();
                    });
                });
            });
            getPositions();
            getAssPerson();
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
        ajaxRequest('/api/auth/logout', 'POST').done(function () {
            window.location.href = 'index.html';
        });
    });

    function getPositions() {
        var dfd = $.Deferred();
        ajaxRequest('/api/positions', 'GET').done(function () {
            /*cleaning position options*/
            var to = ($("#new-int-position").children().length) - 1;
            for (var g = 1; g <= to; g++) {
                $("#new-int-position").children().eq(1).remove();
            }
            /*creating new positon options*/
            for (var i = 0; i < ajaxData.length; i++) {
                var text = ajaxData[i].toLowerCase().replace(/\b[a-z]/g, function (letter) {
                    return letter.toUpperCase();
                });
                $('<option />').text(text).appendTo("#new-int-position").val(text.toLowerCase().slice(0, 4));
            }
            dfd.resolve();
        });
        return dfd.promise();
    }

    function getLocations() {
        var dfd = $.Deferred();
        ajaxRequest('/api/locations/', 'GET').done(function () {
            /*cleaning location options*/
            var to = ($("#new-int-location").children().length) - 1;
            for (var g = 1; g <= to; g++) {
                $("#new-int-location").children().eq(1).remove();
            }
            /*changing format of data form server and creating new options to select tag in locations*/
            for (var i = 0; i < ajaxData.length; i++) {
                var text = ajaxData[i].toLowerCase().replace(/\b[a-z]/g, function (letter) {
                    return letter.toUpperCase();
                });
                $('<option />', {
                    "class": 'locations'
                }).text(text).appendTo("#new-int-location").val(text.toLowerCase().slice(0, 4));
            }
            dfd.resolve();
        });
        return dfd.promise();
    }

    function getRoom() {
        var dfd = $.Deferred();
        var option = $("#new-int-location option:selected").text().toUpperCase();
        //getting from server rooms which are in selected location
        ajaxRequest('/api/locations/' + option + '/rooms', 'GET').done(function () {
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
                $('<option />').text(text).appendTo("#new-int-room").val(text.toLowerCase().slice(0, 3));
                /*creating new room options and changing text format END*/
            }
            dfd.resolve();
        });
        return dfd.promise();
    }

    function getAssPerson() {
        var dfd = $.Deferred();
        ajaxRequest('/api/users', 'GET').done(function () {
            /*cleaning position options*/
            var to = ($("#new-int-assperson").children().length) - 1;
            for (var g = 1; g <= to; g++) {
                $("#new-int-assperson").children().eq(1).remove();
            }
            /*creating new positon options*/
            for (var i in ajaxData) {
                var firstName = ajaxData[i].firstName.toLowerCase().replace(/\b[a-z]/g, function (letter) {
                    return letter.toUpperCase();
                });
                var lastName = ajaxData[i].lastName.toLowerCase().replace(/\b[a-z]/g, function (letter) {
                    return letter.toUpperCase();
                });
                var text = firstName + " " + lastName;
                $('<option />').text(text).appendTo("#new-int-assperson").val(++i);
            }
            /*creating new assigned person options END*/
            dfd.resolve();
        });
        return dfd.promise();
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
    $(document).on('keypress', "#new-int-firstName", function (event) {
        $('#new-int-firstName + div.wrong-input').hide();
    });
    $(document).on('keypress', "#new-int-lastName", function (event) {
        $('#new-int-lastName + div.wrong-input').hide();
    });
    $(document).on('keypress', "#new-int-phone", function (event) {
        $('#new-int-phone + div.wrong-input').hide();
    });
    $(document).on('keypress', "#new-int-email", function (event) {
        $('#new-int-email + div.wrong-input').hide();
    });
    $(document).on('change', "#new-int-date", function (event) {
        $('#new-int-date + div.wrong-input').hide();
    });
    $(document).on('change', "#new-int-time", function (event) {
        $('#new-int-time + div.wrong-input').hide();
    });
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
    /*Forbidden keys - date*/
    $(document).on('keypress', "#new-int-date", function (event) {
        event.preventDefault();
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
    /*Input validation - Time*/
    $(document).on('blur', "#new-int-time", function () {
        var time = $(this).val();
        var regex = /^([0-2][1-9]):[0-5][0-9]$/;
        $('#new-int-time + div.wrong-input').remove();
        if ( !regex.test(time) && time.length!=0) {
            fieldWrongInput("#new-int-time", "Incorrect time format");
            $('#new-int-time + div.wrong-input').show();
        }
    });
    /*Forbidden keys - Time*/
    $(document).on('keypress', "#new-int-time", function (event) {
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        var regex = /^[0-9:]$/;
        if (!regex.test(key)) {
            event.preventDefault();
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
            $('#new-int-room + div.wrong-input').hide();
        } else $("#new-int-room").removeClass('selected-option');
        if ($("#new-int-location :selected").text() != "Enter Location") {
            $("#new-int-location").addClass('selected-option');
            $('#new-int-location + div.wrong-input').hide();
        } else $("#new-int-location").removeClass('selected-option');
        if ($("#new-int-position :selected").text() != "Choose position") {
            $("#new-int-position").addClass('selected-option');
            $('#new-int-position + div.wrong-input').hide();
        } else $("#new-int-position").removeClass('selected-option');
        if ($("#new-int-assperson :selected").text() != "Choose person") {
            $("#new-int-assperson").addClass('selected-option');
        } else $("#new-int-assperson").removeClass('selected-option');
    });
    /*NEW INTERVIEW INPUTS VALIDATIONS END**/
    /**NEW INTERVIEW DATA*/
    function areInputsFill() {
        var emptyInput = false;
        //FIRSTNAME
        if ($.trim($('#new-int-firstName').val()).length == 0) {
            if (!$('#new-int-firstName + div.wrong-input').length) fieldWrongInput("#new-int-firstName", "Name cannot be empty");
            emptyInput = true;
            $('#new-int-firstName + div.wrong-input').show();
        } else $('#new-int-firstName + div.wrong-input').hide();
        //LASTNAME
        if ($.trim($('#new-int-lastName').val()).length == 0) {
            if (!$('#new-int-lastName + div.wrong-input').length) fieldWrongInput("#new-int-lastName", "Surname cannot be empty");
            emptyInput = true;
            $('#new-int-lastName + div.wrong-input').show();
        } else $('#new-int-lastName + div.wrong-input').hide();
        //PHONE
        if (!$('#new-int-phone + div.wrong-input').length) {
            if ($('#new-int-phone').val().length == 0) {
                fieldWrongInput("#new-int-phone", "Phone cannot be empty");
                emptyInput = true;
            } else {
                $('#new-int-phone + div.wrong-input').remove();
            }
        } else emptyInput = true;
        //EMAIL
        if (!$('#new-int-email + div.wrong-input').length) {
            if ($('#new-int-email').val().length == 0) {
                fieldWrongInput("#new-int-email", "Email cannot be empty");
                emptyInput = true;
            } else {
                $('#new-int-email + div.wrong-input').remove();
            }
        } else emptyInput = true;
        //DATE
        if ($('#new-int-date').val().length == 0) {
            if (!$('#new-int-date + div.wrong-input').length) fieldWrongInput("#new-int-date", "Date must be set");
            emptyInput = true;
            $('#new-int-date + div.wrong-input').show();
        } else $('#new-int-date + div.wrong-input').hide();
        //TIME
        if (!$('#new-int-time + div.wrong-input').length) {
            if ($('#new-int-time').val().length == 0) {
                fieldWrongInput("#new-int-time", "Time must be set");
                emptyInput = true;
            } else {
                $('#new-int-time + div.wrong-input').remove();
            }
        } else emptyInput = true;
        //POSITION
        if ($("#new-int-position option:selected").text() == "Choose position") {
            if (!$('#new-int-position + div.wrong-input').length) fieldWrongInput("#new-int-position", "Please choose position");
            emptyInput = true;
            $('#new-int-position + div.wrong-input').show();
        } else $('#new-int-position + div.wrong-input').hide();
        //LOCATION
        if ($("#new-int-location option:selected").text() == "Enter Location") {
            if (!$('#new-int-location + div.wrong-input').length) fieldWrongInput("#new-int-location", "Please choose location");
            emptyInput = true;
            $('#new-int-location + div.wrong-input').show();
        } else $('#new-int-location + div.wrong-input').hide();
        //ROOM
        if ($("#new-int-room option:selected").text() == "Choose Room") {
            if (!$('#new-int-room + div.wrong-input').length) fieldWrongInput("#new-int-room", "Please choose room");
            emptyInput = true;
            $('#new-int-room + div.wrong-input').show();
        } else $('#new-int-room + div.wrong-input').hide();
        if (emptyInput == true) return false;
        else return true;
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
        var time = convertDatetimeToISOFormat();
        var assPersonId = $("#new-int-assperson option:selected").val();
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
        ajaxRequest('/api/interviews', 'POST', jData).done(function () {
            updateMyInterviews();
        });
    }
    /*PUT UPDATE interview*/
    function sendEditInterviewToServer(showMyInt) {
        var time = convertDatetimeToISOFormat();
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
            userId: $("#new-int-assperson option:selected").val(),
            note: $("#new-int-note").val()
        }
        var jData = JSON.stringify({
            "candidate": candidate,
            "interview": interview
        });
        ajaxRequest('/api/interviews/' + idRow, 'PUT', jData).done(function () {
            if (showMyInt == true) updateMyInterviews();
        });
    }
    /*PUT CLOSE interview*/
    function closeInterview() {
        ajaxRequest('/api/interviews/' + idRow + '/closed', 'PUT').done(function () {
            updateMyInterviews();
        });
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
    var interviewStatus = "";
    var idRow;

    function getIntervievDataById(actModal) {
        var dfd = $.Deferred();
        ajaxRequest('/api/interviews/' + idRow, 'GET').done(function () {
            candicateName = (ajaxData.candidate.firstName) + " " + (ajaxData.candidate.lastName);
            candidateFirstName = ajaxData.candidate.firstName;
            candidateLastName = ajaxData.candidate.lastName;
            workPosition = ajaxData.candidate.position;
            candicateTelephone = ajaxData.candidate.phone;
            candicateEmail = ajaxData.candidate.email;
            candicateSkype = ajaxData.candidate.skype;
            interviewDate = convertDateFromISO(ajaxData.interview.dateTime);
            interviewTime = convertTimeFromISO(ajaxData.interview.dateTime);
            interviewLocation = ajaxData.interview.location;
            interviewRoom = ajaxData.interview.room;
            interviewStatus = ajaxData.interview.status;
            if ('user' in ajaxData.interview) {
                interviewAssignedPerson = (ajaxData.interview.user.firstName) + " " + (ajaxData.interview.user.lastName);
                interviewAssignedPersonID = ajaxData.interview.user.id
            } else {
                interviewAssignedPerson = "";
                interviewAssignedPersonID = "";
            };
            interviewNotes = ajaxData.interview.note;
            if (actModal) {
                activateModal();
            }
            dfd.resolve();
        });
        return dfd.promise();
    }
    /*CLICK on EDIT pic in my int*/
    $('#main-content').on('click', '.edit-icon', function (event) {
        event.preventDefault();
        idRow = $(this).parent().parent().attr('data-id');
        getIntervievDataById().done(function () {;
            showEditInterviewTab();
        });
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
            $("#new-int-time").timepicker();
            $("#new-int-date").datepicker({
                format: "yyyy-mm-dd"
            });
            $("#page-title, #title-r").html("Edit Interviews");
            $("#menu-new-interview").removeClass("selected");
            $("#menu-interviews").removeClass("selected");
            getIntervievDataById(false);
            $('#new-int-firstName').val(candidateFirstName);
            $('#new-int-lastName').val(candidateLastName);
            $('#new-int-phone').val(candicateTelephone);
            $('#new-int-email').val(candicateEmail);
            $('#new-int-skype').val(candicateSkype);
            $('#new-int-date').val(interviewDate);
            $('#new-int-time').val(interviewTime);
            $('#new-int-note').val(interviewNotes);
            getPositions().done(function () {
                $('#new-int-position').val(workPosition.toLowerCase().slice(0, 4));
            });
            getLocations().done(function () {
                $('#new-int-location').val(interviewLocation.toLowerCase().slice(0, 4));
                getRoom().done(function () {
                    $('#new-int-room').val(interviewRoom.toLowerCase().slice(0, 3));
                });
            });
            $('#new-int-location').on('change', function () {
                getRoom();
            });
            getAssPerson().done(function () {
                $('#new-int-assperson').val(interviewAssignedPersonID);
            });
            $("#new-int-date").addClass('selected-option');
            $("#new-int-time").addClass('selected-option');
            $("#new-int-position").addClass('selected-option');
            $("#new-int-room").addClass('selected-option');
            $("#new-int-location").addClass('selected-option');
            $("#new-int-assperson").addClass('selected-option');
        });
    }
    /*Save Edited Interview*/
    $(document).on('click', '#btn-edit-int-save,#btn-edit-int-save-r', function (event) {
        event.preventDefault();
        if (areInputsFill()) {
            sendEditInterviewToServer(true)
        }
    });
    /*Close Interview*/
    $(document).on('click', '#btn-edit-int-close,#btn-edit-int-close-r', function (event) {
        event.preventDefault();
        var emptyNote = false;
        if ($.trim($("#new-int-note").val()).length == 0) {
            if (!$('#new-int-note + div.wrong-input').length) fieldWrongInput("#new-int-note", "Note field cannot be empty");
            emptyNote = true;
            $('#new-int-note + div.wrong-input').show();
        } else $('#new-int-note + div.wrong-input').hide();
        if (emptyNote == false) {
            if (areInputsFill()) {
                sendEditInterviewToServer(false)
                closeInterview();
            }
        }
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
            "class": 'material-icons edit-modal',
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
        if (interviewStatus == "CLOSED") {
            $("#edit").remove('.edit-modal');
        }
        /*CLICK on EDIT pic in modal*/
        $(document).on('click', '.edit-modal', function (event) {
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
            getNumberOfInterviews().done(function () {
                if (countInterviews > 0) {
                    getInterviews(1, 5);
                }
                setPaginationText();
                setPaginationButtons();
            });
            $("#page-title, #title-r").html("My Interviews");
            $("#menu-new-interview").removeClass("selected");
            $("#menu-interviews").addClass("selected");
        });
    }

    function getInterviews(start, limit) {
        ajaxRequest('/api/interviews?limit=' + limit + '&start=' + start, 'GET').done(function () {
            $('#main-content').load('templates/my-interviews.html', function () {
                generateInterviewRows(ajaxData);
                setPaginationText();
                setPaginationButtons();
            });
        });
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
            if (interviews[i].interview.status == "CREATED") {
                var td6 = $('<td />', {
                    'class': 'td-my-interviews'
                }).html('<i class="material-icons delete-icon basic-icon">&#xE872;</i><i class="material-icons edit-icon basic-icon">&#xE150;</i>').appendTo(tr);
            } else {
                var td6 = $('<td />', {
                    'class': 'td-my-interviews'
                }).html('<i class="material-icons delete-icon basic-icon">&#xE872;</i>').appendTo(tr);
            }
        }
    }
    /*END MY INTERVIEWS*/
    /* PAGINATION */
    function getNumberOfInterviews() {
        var dfd = $.Deferred();
        ajaxRequest('/api/interviews/count', 'GET').done(function () {
            countInterviews = ajaxData.count;
            dfd.resolve();
        });
        return dfd.promise();
    }

    function setPaginationButtons() {
        if (countInterviews - startingInterview >= 5) {
            $('#next-page').prop('disabled', false);
        } else {
            $('#next-page').prop('disabled', true);
        }
        if (startingInterview >= 6) {
            $('#prev-page').prop('disabled', false);
        } else {
            $('#prev-page').prop('disabled', true);
        }
    }

    function setPaginationText() {
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
        setPaginationText();
        setPaginationButtons();
    });
    $('#main-content').on('click', '#next-page', function () {
        startingInterview += 5;
        getInterviews(startingInterview, 5);
        setPaginationText();
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
        $('<div />', {
            "class": 'delete-btn-cont'
        }).appendTo('.delete-int-box');
        $('<div />', {
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
            ajaxRequest('/api/interviews/' + id, 'DELETE').done(function () {
                updateMyInterviews();
            });
        });
    }
    /** END DELETE 1 INTERVIEW*/
    /*AJAX REQUEST*/
    function ajaxRequest(ajaxUrl, typeOfRequest, dataToSend) {
        var dfd = $.Deferred();
        $.ajax({
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', token);
            },
            url: 'http://localhost:8081' + ajaxUrl,
            type: typeOfRequest,
            data: dataToSend,
            contentType: 'application/json',
            success: function (data) {
                if (data != null) ajaxData = data;
                dfd.resolve();
            },
            error: function () {
                dfd.reject();
                console.log("Error");
            }
        });
        return dfd.promise();
    }
    /*END AJAX REQUEST*/
    /** Convert datetime TO ISO Format */
    function convertDatetimeToISOFormat() {
        var dateVal = $("#new-int-date").val();
        var timeVal = $("#new-int-time").val();
        return (dateVal + 'T' + timeVal + 'Z');
    }
    /** Convert datetime FROM ISO Format */
    function convertTimeFromISO(dateTime) {
        return dateTime.slice(dateTime.indexOf('T') + 1);
    }

    function convertDateFromISO(dateTime) {
        return dateTime.slice(0, dateTime.indexOf('T'));
    }
    /** END Convert datetime TO/FROM ISO Format */
});
