$(document).ready(function () {
    var token = localStorage.getItem("token");
    var startingInterview = 1;
    var countInterviews;
    /*on click to new interview*/
    $('#menu-new-interview , #new-interview-r').on('click', function () {
        /*changing main content to new interview form and getting from server positons, locations and rooms*/
        $('#main-content').load('templates/new-interview.html', function () {
            /*call server to receive locations*/
            $.ajax({
                url: 'http://localhost:8081/api/locations'
                , type: 'GET'
                , beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                }
                , success: function (data) {
                    /*changing format of data form server and creating new options to select tag in locations*/
                    for (var i = 0; i < data.length; i++) {
                        var text = data[i].toLowerCase().replace(/\b[a-z]/g, function (letter) {
                            return letter.toUpperCase();
                        });
                        $('<option />', {
                            "class": 'locations'
                            , "value": 'loc_' + data[i].toLowerCase().replace(/ /g, "_")
                        }).text(text).appendTo("#new-int-location");
                    }
                    /*changing format of data form server and creating new options to select tag in locations END*/
                    //if is location choosen/changed
                    $("#new-int-location").on('change', function () {
                        var option = $("#new-int-location option:selected").text().toUpperCase();
                        //getting from server rooms which are in selected location
                        $.ajax({
                            url: 'http://localhost:8081/api/locations/' + option + '/rooms'
                            , type: 'GET'
                            , beforeSend: function (xhr) {
                                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                            }
                            , success: function (data) {
                                /*cleaning room options*/
                                var to = ($("#new-int-room").children().length) - 1;
                                for (var g = 1; g <= to; g++) {
                                    $("#new-int-room").children().eq(1).remove();
                                }
                                /*cleaning room options*/
                                for (var j = 0; j < data.length; j++) {
                                    var text = data[j].toLowerCase().replace(/\b[a-z]/g, function (letter) {
                                        return letter.toUpperCase();
                                    });
                                    /*creating new room options and changing text format*/
                                    $('<option />', {
                                        "value": 'room_' + data[j].toLowerCase().replace(/ /g, "_")
                                    }).text(text).appendTo("#new-int-room");
                                    /*creating new room options and changing text format END*/
                                }
                            }
                            , error: function () {
                                activateErrorModal();
                            }
                        , });
                    });
                }
                , error: function () {
                    activateErrorModal();
                }
            , });
            /*call server and receive locations END*/
            /*call server and receive positions*/
            $.ajax({
                url: 'http://localhost:8081/api/positions'
                , type: 'GET'
                , beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                }
                , success: function (data) {
                    /*creating new positon options*/
                    for (var i = 0; i < data.length; i++) {
                        var text = data[i].toLowerCase().replace(/\b[a-z]/g, function (letter) {
                            return letter.toUpperCase();
                        });
                        $('<option />').text(text).appendTo("#new-int-position");
                    }
                    /*creating new positon options END*/
                }
                , error: function () {
                    activateErrorModal();
                }
            , });
            /*call server and receive positions END*/
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
        firstName: localStorage.getItem("firstName")
        , lastName: localStorage.getItem("lastName")
        , photoUrl: localStorage.getItem("photoUrl")
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
    /**NEW INTERVIEW FORM VALIDATION*/
    /*Function for Wrong input text*/
    function fieldWrongInput(inpfield, fieldMessage) {
        var input = $(inpfield);
        var pos = input.position();
        $('<div class="wrong-input" />').html(fieldMessage).css({
            top: pos.top + input.height() + 5
        , }).insertAfter(input);
    }
    /*Forbidden keys - firstName, lastName*/
    $(document).on('keypress', "#new-int-firstName, #new-int-lastName", function (event) {
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        var regex = /[^a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð']+$/;
        if (regex.test(key)) {
            event.preventDefault();
        }
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
        var regex = /[^0-9\s()+-]+$/;
        if (regex.test(key)) {
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
    /*NEW INTERVIEW INPUTS VALIDATIONS END**/
    /**NEW INTERVIEW DATA*/
    function areInputsFill() {
        var notEmpty = 1;
        //FIRSTNAME
        if ($('#new-int-firstName').val().length == 0) {
            if (!$('#new-int-firstName + div.wrong-input').length)
                fieldWrongInput("#new-int-firstName", "Name cannot be empty");
            notEmpty = 0;
            $('#new-int-firstName + div.wrong-input').show();
        } else $('#new-int-firstName + div.wrong-input').hide();
        //LASTNAME
        if ($('#new-int-lastName').val().length == 0) {
            if (!$('#new-int-lastName + div.wrong-input').length)
                fieldWrongInput("#new-int-lastName", "Surname cannot be empty");
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
            if (!$('#new-int-date + div.wrong-input').length)
                fieldWrongInput("#new-int-date", "Date must be set");
            notEmpty = 0;
            $('#new-int-date + div.wrong-input').show();
        } else $('#new-int-date + div.wrong-input').hide();
        //TIME
        if ($('#new-int-time').val().length == 0) {
            if (!$('#new-int-time + div.wrong-input').length)
                fieldWrongInput("#new-int-time", "Time must be set");
            notEmpty = 0;
            $('#new-int-time + div.wrong-input').show();
        } else $('#new-int-time + div.wrong-input').hide();
        //POSITION
        if ($("#new-int-position option:selected").text() == "Choose position") {
            if (!$('#new-int-position + div.wrong-input').length)
                fieldWrongInput("#new-int-position", "Please choose one option");
            notEmpty = 0;
            $('#new-int-position + div.wrong-input').show();
        } else $('#new-int-position + div.wrong-input').hide();
        //LOCATION
        if ($("#new-int-location option:selected").text() == "Enter Location") {
            if (!$('#new-int-location + div.wrong-input').length)
                fieldWrongInput("#new-int-location", "Please choose one option");
            notEmpty = 0;
            $('#new-int-location + div.wrong-input').show();
        } else $('#new-int-location + div.wrong-input').hide();
        //ROOM
        if ($("#new-int-room option:selected").text() == "Choose Room") {
            if (!$('#new-int-room + div.wrong-input').length)
                fieldWrongInput("#new-int-room", "Please choose one option");
            notEmpty = 0;
            $('#new-int-room + div.wrong-input').show();
        } else $('#new-int-room + div.wrong-input').hide();
        if (notEmpty == 0) {
            return false;
        }
        else {
            return true;
        }
    }
    /*New interview save button*/
    $(document).on('click', '#btn-my-int-save', function (event) {
        event.preventDefault();
        if (areInputsFill()) {
            sendNewInterviewToServer();
        }
    });

    function sendNewInterviewToServer() {
        var dateVal = $("#new-int-date").val();
        var timeVal = $("#new-int-time").val();
        /*expected date format: "2016-12-13T09:34Z"*/
        var time = dateVal+"T"+timeVal+"Z";

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
            , userId: 1
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
                updateMyInterviews();
            }
        });
    }
    /*Lead Edit-interview tab*/
    function showEditInterviewTab() {
        $('#main-content').load('templates/edit-interview.html', function () {
            $("#page-title, #title-r").html("Edit Interviews");
            $("#menu-new-interview").removeClass("selected");
            $("#menu-interviews").removeClass("selected");
        });
    }
    /*Edit interview save button*/
/*    $(document).on('click', '#btn-edit-int-save', function (event) {
        event.preventDefault();
        if (areInputsFill()) {
            sendEditInterviewToServer();
        }
    });*/
/*
    function sendEditInterviewToServer() {
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
            , userId: 1
            , note: $("#new-int-note").text()
        , }
        console.log(JSON.stringify({
            "candidate": candidate
            , "interview": interview
        }));
        $.ajax({
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            }
            , url: 'http://localhost:8081/api/interviews/' + idRow
            , type: 'PUT'
            , contentType: 'application/json'
            , data: JSON.stringify({
                "candidate": candidate
                , "interview": interview
            })
            , success: function () {
                updateMyInterviews();
            }
        });
    }*/
    /*Edit interview close button*/
/*    $(document).on('click', '#btn-my-int-save', function (event) {
        event.preventDefault();
        sendEditInterviewToServer();
    });*/
/*
    function closeInterview() {
        $.ajax({
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            }
            , url: 'http://localhost:8081/api/interviews/' + idRow + '/closed'
            , type: 'PUT'
            , contentType: 'application/json'
            , success: function () {
                updateMyInterviews();
            }
        });
    }*/

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
        idRow = $(this).attr('data-id');
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
        $("#icoDisableRight").on('click', function () {
            mui.overlay('off');
        });
        $("#icoDisableLeft").on('click', function () {
            mui.overlay('off');
        });
        $(document).on('click', '#edit', function (event) {
            event.preventDefault();
            mui.overlay('off');
            showEditInterviewTab();
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
    function updateMyInterviews() {
        $('#main-content').load('templates/my-interviews.html', function () {
            startingInterview = 1;
            getNumberOfInterviews();
            getInterviews(1, 5);
            setText();
            setPaginationButtons();
            $("#page-title, #title-r").html("My Interviews");
            $("#menu-new-interview").removeClass("selected");
            $("#menu-interviews").addClass("selected");
        });
    }

    function getInterviews(start, limit) {
        $.ajax({
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            }
            , url: 'http://localhost:8081/api/interviews?limit=' + limit + '&start=' + start
            , type: 'GET'
            , success: function (data) {
                $('#main-content').load('templates/my-interviews.html', function () {
                    generateInterviewRows(data);
                    setText();
                    setPaginationButtons();
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
                'class': 'tr-content',
                'data-id': interviews[i].id
            }).appendTo("tbody");
            var td1 = $('<td />', {}).html('<i class="material-icons mui--no-user-select basic-icon">&#xE7FF;</i>').appendTo(tr);
            var td2 = $('<td />', {
                'class': 'td-my-interviews'
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
                'class': 'td-my-interviews'
            }).text(interviews[i].candidate.phone).appendTo(tr);
            var td4 = $('<td />', {
                'class': 'td-my-interviews'
            }).text(interviews[i].candidate.email).appendTo(tr);
            var td5 = $('<td />', {
                'class': 'td-my-interviews'
            }).text(interviews[i].interview.status).appendTo(tr);
            var td6 = $('<td />', {
                'class': 'td-my-interviews'
            }).html('<i class="material-icons delete-icon basic-icon">&#xE872;</i><i class="material-icons edit-icon basic-icon">&#xE150;</i>').appendTo(tr);
        }
    }
    /*END MY INTERVIEWS*/
    /* PAGINATION */
    function getNumberOfInterviews() {
        $.ajax({
            url: 'http://localhost:8081/api/interviews/count'
            , type: 'GET'
            , beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            }
            , success: function (data) {
                countInterviews = data.count;
            }
            , error: function () {
                activateErrorModal();
                return null;
            }
        });
    }

    function setPaginationButtons() {
        if (countInterviews - startingInterview >= 5 && startingInterview == 1) {
            $('#next-page').prop('disabled', false);
            $('#prev-page').prop('disabled', true);
        }
        else if (countInterviews - startingInterview >= 5 && startingInterview != 1) {
            $('#next-page').prop('disabled', false);
            $('#prev-page').prop('disabled', false);
        }
        else if (countInterviews - startingInterview <= 5 && startingInterview >= 6) {
            $('#next-page').prop('disabled', true);
            $('#prev-page').prop('disabled', false);
        }
        else {
            $('#next-page').prop('disabled', true);
            $('#prev-page').prop('disabled', true);
        }
    }

    function setText() {
        console.log(countInterviews);
        var to = (startingInterview + 4 > countInterviews) ? countInterviews : startingInterview + 4;
        var data = {
            from: startingInterview
            , to: to
            , total: countInterviews
        }
        var text = 'SHOWING {{from}} - {{to}} FROM {{total}}';
        var html = Mustache.to_html(text, data);
        $('#showed-pages').html(html);
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
        $.ajax({
            url: 'http://localhost:8081/api/interviews/' + interviewID
            , type: 'DELETE'
            , beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            }
            , success: function () {
                updateMyInterviews();
            }
            , error: function () {
                console.log("Error deleting interview!");
            }
        });
    });
    /** END DELETE 1 INTERVIEW*/
});