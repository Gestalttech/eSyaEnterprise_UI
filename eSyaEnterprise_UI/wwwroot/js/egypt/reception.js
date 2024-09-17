var l_visits = {
    'N': 'First Visit',
    'R': 'FollowUp',
    'I': 'In-Patient FollowUp',
    'S': 'Op Service'
};

$(function () {
    $('#lblCurrentlyServingToken').text(0);
    clearInterval(myTimer);
    document.querySelector('#lblTokenTimer').textContent = "00:00";
    fnGridLoadReceptionDetail();
    fnGridLatePatients();
});
function fnDeskNumber_Onchange() {
    fnGridLoadReceptionDetail();
    fnGridLatePatients();
    fnClearToken();
}
function fnLoungeNumber_Onchange() {
    $('#cboDeskNumber').empty();
    $.ajax({
        url: getBaseURL() + '/Reception/GetDeskNumbers?loungnumber=' + $("#cboLoungeNumber").val(),
        type: 'get',
        success: function (result) {
            $('#lblCurrentlyServingToken').text(0);
            clearInterval(myTimer);
            document.querySelector('#lblTokenTimer').textContent = "00:00";
            $("#cboDeskNumber").empty();
            $("#cboDeskNumber").append($("<option value='0'> Select Desk Number </option>"));
            
            $.each(result, function (i, item) {
                $("#cboDeskNumber").append($("<option></option>").val(item.CodeDesc).html(item.CodeDesc));
            });
            $('#cboDeskNumber').selectpicker('refresh');
        },
        error: function () {
            $("#cboDeskNumber").empty();
            $("#cboDeskNumber").append($("<option value='0'> Select Desk Number</option>"));
            $('#cboDeskNumber').selectpicker('refresh');
        }
        
    });

    fnGridLoadReceptionDetail();
    fnGridLatePatients();
}



window.setTimeout(refreshGrid, 10000);
function refreshGrid() {
    jQuery("#jqgReception").jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid');
    jQuery("#jqgLatePatients").jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid');
    window.setTimeout(refreshGrid, 10000);
}

function fnGridLoadReceptionDetail() {
    $("#jqgReception").jqGrid('GridUnload');

    $("#jqgReception").jqGrid(
        {
            url: getBaseURL() + '/Reception/GetTokenDetailForReceptionDesk?tokenarea=' + $("#cboLoungeNumber").val(),
            datatype: "json",
            contentType: "application/json; charset-utf-8",
            mtype: 'GET',
            postData: {
                specialtyId: function () { return $('#cboSpecialty').val(); },
                doctorId: function () { return $('#cboDoctor').val(); },
                //patientType: patientType,
            },
            colNames: ["Call Token", "Token Number", "S.No", "", "", "", "", "", ""],
            colModel: [
                {
                    name: "Button", width: 50, editable: true, align: 'center', hidden: false, formatter: function (cellValue, options, rowObject) {
                        var i = options.rowId;
                        return "<button id=btnCall_" + i + " type='button' class='btn btn-success w-100' onclick=fnCallingToken('" + rowObject.QueueTokenKey + "')><i class='fa fa-phone' aria-hidden='true'></i> Call</button>"
                    }
                },
                { name: "QueueTokenKey", width: 60, editable: true, align: 'left' },
                { name: "SequeueNumber", width: 20, editable: true, align: 'left', hidden: true },
                { name: "TokenHold", width: 120, editable: true, align: 'left', hidden: true },
                {
                    name: "VisitType", width: 80, editable: true, formatter: 'select', hidden: true,
                    edittype: 'select', editoptions: {
                        value: l_visits
                    }
                },
                {
                    name: "Button", width: 30, editable: true, align: 'center', hidden: false, formatter: function (cellValue, options, rowObject) {
                        return "<button type='button' class='btn btn-primary w-100' onclick=fnUpdateTokenStatusToNurseAssessment('" + rowObject.QueueTokenKey + "')><i class='fas fa-external-link-alt c-white'></i> Completed</button>"
                    }
                },
                {
                    name: "Button", width: 30, editable: true, align: 'center', hidden: false, formatter: function (cellValue, option, rowObject) {
                        var i = option.rowId;
                        return "<button id=btnHold_" + i + "  type='button' class='btn btn-danger mr-3 w-100' onclick=fnUpdateTokenToHold('" + rowObject.QueueTokenKey + "')><i class='fas fa-pause c-white'></i> Hold</button> <button id=btnRelease_" + i + " type='button' class='btn btn-success w-100' onclick=fnUpdateTokenToRelease('" + rowObject.QueueTokenKey + "')><i class='fas fa-play c-white'></i> Release</button>"
                    }
                },
                {
                    name: "Button", width: 100, editable: true, align: 'center', hidden: true, formatter: function (cellValue, options, rowObject) {
                        return "<button type='button' class='btn btn-primary' onclick=fnUpdateTokenStatusToCancel('" + rowObject.QueueTokenKey + "')><i class='fas fa-external-link-alt c-white'></i> Not Reported</button>"
                    }
                },
                { name: "TokenCalling", width: 120, editable: true, align: 'left', hidden: true },
            ],
            rowNum: 10000,
            rownumWidth: '55',
            viewrecords: true,
            gridview: true,
            rownumbers: true,
            scroll: false,
            loadonce: true,
            width: 'auto',
            height: 'auto',
            autowidth: true,
            shrinkToFit: true,
            forceFit: false,
            loadComplete: function () {
                var rowIds = $('#jqgReception').jqGrid('getDataIDs');
                for (i = 0; i < rowIds.length; i++) {
                    rowData = $('#jqgReception').jqGrid('getRowData', rowIds[i]);
                    if (rowData['QueueTokenKey'].startsWith('B')) {
                        if (rowData["TokenHold"] == "true" || rowData["TokenHold"] == true) {
                            $("#btnHold_" + rowIds[i]).hide();
                        }
                        else {
                            $("#btnRelease_" + rowIds[i]).hide();
                        }
                        $('#jqgReception').jqGrid('setRowData', rowIds[i], false, "bg_ca");
                    }
                    else if (rowData['QueueTokenKey'].startsWith('C')) {
                        if (rowData["TokenHold"] == "true" ||rowData["TokenHold"] == true)
                            $("#btnHold_" + rowIds[i]).hide();
                        else
                            $("#btnRelease_" + rowIds[i]).hide();
                        $('#jqgReception').jqGrid('setRowData', rowIds[i], false, "bg_cw");
                    }
                    else if (rowData['QueueTokenKey'].startsWith('S')) {
                        if (rowData["TokenHold"] == "true" || rowData["TokenHold"] == true)
                            $("#btnHold_" + rowIds[i]).hide();
                        else
                            $("#btnRelease_" + rowIds[i]).hide();
                        $('#jqgReception').jqGrid('setRowData', rowIds[i], false, "bg_sw");
                    }
                    else if (rowData['QueueTokenKey'].startsWith('L')) {
                        if (rowData["TokenHold"] == "true" || rowData["TokenHold"] == true)
                            $("#btnHold_" + rowIds[i]).hide();
                        else
                            $("#btnRelease_" + rowIds[i]).hide();
                        $('#jqgReception').jqGrid('setRowData', rowIds[i], false, "bg_sw");
                    }

                    if (rowData["TokenCalling"] === "true") {
                        $("#btnCall_" + rowIds[i]).removeClass("btn-success");
                        $("#btnCall_" + rowIds[i]).addClass("btn-danger");
                    }

                }

            },
        });
    fnAddGridSerialNoHeading();
    fnSetHeightForGrid("#gview_jqgReception .ui-jqgrid-bdiv");
}

function fnGridLatePatients() {
    $("#jqgLatePatients").jqGrid('GridUnload');

    $("#jqgLatePatients").jqGrid(
        {
            url: getBaseURL() + '/Reception/GetLongWaitingPatients?tokenarea=' + $("#cboLoungeNumber").val(),
            datatype: "json",
            contentType: "application/json; charset-utf-8",
            mtype: 'GET',
            colNames: ["Queue No.", "Token Generation", "", ""],
            colModel: [
                { name: "QueueTokenKey", width: 30, editable: true, align: 'left' },
                { name: "TokenDate", width: 70, editable: true, align: 'left', formatter: 'date', formatoptions: { srcformat: 'Y/m/d H:i:s', newformat: 'd/m/y h:i A' } },
                {
                    name: "Button", width: 50, editable: true, align: 'center', hidden: false, formatter: function (cellValue, options, rowObject) {
                        var i = options.rowId;
                        return "<button id=btnLWCall_" + i + " type='button' class='btn btn-success w-100' onclick=fnCallingToken('" + rowObject.QueueTokenKey + "')><i class='fa fa-phone' aria-hidden='true'></i> Call</button>"
                    }
                },
                { name: "TokenCalling", width: 120, editable: true, align: 'left', hidden: true },
            ],
            rownumWidth: '55',
            rowNum: 10000,
            viewrecords: true,
            gridview: true,
            rownumbers: true,
            scroll: false,
            loadonce: true,
            width: 'auto',
            height: 'auto',
            autowidth: true,
            shrinkToFit: true,
            forceFit: false,
            loadComplete: function () {
                var rowIds = $('#jqgLatePatients').jqGrid('getDataIDs');
                for (i = 0; i < rowIds.length; i++) {
                    rowData = $('#jqgLatePatients').jqGrid('getRowData', rowIds[i]);
                    if (rowData["TokenCalling"] === "true") {
                        $("#btnLWCall_" + rowIds[i]).removeClass("btn-success");
                        $("#btnLWCall_" + rowIds[i]).addClass("btn-danger");
                    }

                }

            },
        });
    fnAddGridSerialNoHeading(); fnSetHeightForGrid("#gview_jqgLatePatients .ui-jqgrid-bdiv");
}

function fnCallingToken(QueueTokenKey) {
     
    $('#lblCurrentlyServingToken').text(QueueTokenKey);

    fnRecallToken();
    fnGridLoadReceptionDetail();
}

function fnNextToken() {

    
    if ($("#cboDeskNumber").val() == "0") {
        //fnAlert("Please select a Desk Number", "e");
        fnAlert("e", "", "", "Please select a Desk Number");
        fnClearToken();
        return;
    }
    var currentlyServingToken = $('#lblCurrentlyServingToken').text();

    var obj = {
        QueueTokenKey: currentlyServingToken,
        CallingRoomNumber: $('#cboDeskNumber').val(),
        LoungeNumber: $('#cboLoungeNumber').val(),
    };

    $.ajax({
       url: getBaseURL() + '/Reception/UpdateReceptionToCallingNextToken',
       type: 'POST',
        datatype: 'json',
        contenttype: 'application/json; charset=utf-8',
        data: obj,
        async: false,
        success: function (result) {
           
            if (result.Status) {
                if (!IsStringNullorEmpty(result.Key)) {
                    //fnAlert("Calling the Token : " + result.QTokenKey, "s");
                    fnAlert("s", "", "", "Calling the Token : " + result.Key);
                    $('#lblCurrentlyServingToken').text(result.Key);
                    var waitMinutes = 60 * 3;
                    display = document.querySelector('#lblTokenTimer');
                    startTimer(waitMinutes, display);
                    return true;
                }
                else {
                    //fnAlert("No Token", "e");
                    fnAlert("e", "", "", "No Token");
                    $('#lblCurrentlyServingToken').text(0);
                    clearInterval(myTimer);
                    document.querySelector('#lblTokenTimer').textContent = "00:00";
                    return false;
                }
            }
            else {
                //fnAlert(result.Message, "e");
                fnAlert("e", "", "", result.Message);
                return false;
            }
        },
        error: function (error) {
            // fnAlert(error.statusText, "e");
            fnAlert("e", "", "", error.statusText);
            return false;
        }
    });

}

function fnRecallToken() {

    if ($("#cboDeskNumber").val() == "0") {
        //fnAlert("Please select a Desk Number", "e");
        fnAlert("e", "", "", "Please select a Desk Number");
        fnClearToken();
        return;
    }
    var currentlyServingToken = $('#lblCurrentlyServingToken').text();

    var obj = {
        QueueTokenKey: currentlyServingToken,
        CallingRoomNumber: $('#cboDeskNumber').val()
    };

    if (currentlyServingToken.length > 1) {
        $.ajax({
            url: getBaseURL() + '/Reception/UpdateReceptionCallingToken',
            type: 'POST',
            datatype: 'json',
            contenttype: 'application/json; charset=utf-8',
            data: obj,
            async: false,
            success: function (result) {

                if (result.Status) {
                    fnAlert("s", "", "", "Calling the Token : " + result.Key);

                    var waitMinutes = 60 * 3;
                    var display = document.querySelector('#lblTokenTimer');
                    startTimer(waitMinutes, display);
                    return true;
                }
                else {
                    fnAlert("w", "", "", result.Message);
                    $('#lblCurrentlyServingToken').text(0);
                    clearInterval(myTimer);
                    document.querySelector('#lblTokenTimer').textContent = "00:00";
                    return false;
                }

            },
            error: function (error) {
                fnAlert("e", "", "", error.statusText);
                return false;
            }
        });
    }

}

function fnHoldToken() {
    if ($("#cboDeskNumber").val() == "0") {
        //fnAlert("Please select a Desk Number", "e");
        fnAlert("e", "", "", "Please select a Desk Number");
        fnClearToken();
        return;
    }
    var currentlyServingToken = $('#lblCurrentlyServingToken').text();

    var obj = {
        QueueTokenKey: currentlyServingToken,
        CallingRoomNumber: $('#cboDeskNumber').val()
    };

    if (currentlyServingToken.length > 1) {

        $.ajax({
            url: getBaseURL() + '/Reception/UpdateReceptionTokenToHold',
            type: 'POST',
            datatype: 'json',
            contenttype: 'application/json; charset=utf-8',
            data: obj,
            async: false,
            success: function (result) {

                if (result.Status) {
                    fnAlert("s", "", "", "Hold the Token : " + currentlyServingToken);
                    $('#lblCurrentlyServingToken').text("0");
                    clearInterval(myTimer);
                    document.querySelector('#lblTokenTimer').textContent = "00:00";
                    jQuery("#jqgReception").jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid');
                    return true;
                }
                else {
                    fnAlert("e", "", "", result.Message);
                    return false;
                }
            },
            error: function (error) {
                fnAlert("e", "", "", error.statusText);
                return false;
            }
        });
    }

}

function fnTransferToNurseAssessment() {

    var currentlyServingToken = $('#lblCurrentlyServingToken').text();

    if (currentlyServingToken.length > 1) {
        fnUpdateTokenStatusToNurseAssessment(currentlyServingToken);
    }
}
function fnUpdateTokenStatusToNurseAssessment(QueueTokenKey) {
    if ($("#cboDeskNumber").val() == "0") {
        //fnAlert("Please select a Desk Number", "e");
        fnAlert("e", "", "", "Please select a Desk Number");
        fnClearToken();
        return;
    }
    if (QueueTokenKey != $('#lblCurrentlyServingToken').text()) {
        //fnAlert("Please call the patient first", "e");
        fnAlert("w", "", "", "Please call the patient first");
        return false;
    }


    //var rowIds = $('#jqgReception').jqGrid('getDataIDs');
    //for (i = 0; i < rowIds.length; i++) {
    //    rowData = $('#jqgReception').jqGrid('getRowData', rowIds[i]);
    //    if (rowData['QueueTokenKey'] === QueueTokenKey) {
    //        //console.log(rowData)
    //        $('#txtQNumber').val(QueueTokenKey);
    //        $('#txtUHID').val(rowData['UHID']);
    //        if (rowData['PatientId'] === '0' || rowData['PatientId'] === 'N/A') {
    //            $('#txtPatientID').val('');
    //            $('#txtPatientID').attr("disabled", false);
    //        }
    //        else {
    //            $('#txtPatientID').val(rowData['PatientId']);
    //            $('#txtPatientID').attr("disabled", true);
    //        }
    //        if (rowData['FirstName'] === 'Walk-IN') {
    //            $('#txtDateOfBirth').val(fnFormatDateJsonToInput(new Date()));
    //            $('#txtFirstName').val('');
    //            $('#txtLastName').val('');
    //            $('#cboGender').val('0');
    //            $('#txtMobileNumber').val('');
    //            $('#txtEmailID').val('');
    //        }
    //        else {
    //            $('#txtDateOfBirth').val(fnFormatDateJsonToInput(new Date(rowData['DateOfBirth'])));
    //            $('#txtFirstName').val(rowData['FirstName']);
    //            $('#txtLastName').val(rowData['LastName']);
    //            $('#cboGender').val(rowData['Gender']);
    //            $('#txtMobileNumber').val('0' + rowData['MobileNumber']);
    //            $('#txtEmailID').val(rowData['EmailId']);
    //        }
    //        if (rowData['QueueTokenKey'].startsWith('S')) {
    //            $('#cboCustomer').val('');
    //            $('#cboCustomer').selectpicker('refresh');
    //            $('#divCustomer').show();
    //        }
    //        else {
    //            $('#divCustomer').hide();
    //        }
    //    }
    //}

    //$('#PopupComplete').modal('show');


    bootbox.confirm({
        message: "Do you want to Complete ?",
        buttons: {
            confirm: {
                label: 'Yes',
                className: 'btn-success'
            },
            cancel: {
                label: 'No',
                className: 'btn-danger'
            }
        },
        callback: function (result) {
            if (result) {
                var obj = {
                    QueueTokenKey: QueueTokenKey,
                };

                $.ajax({
                    url: getBaseURL() + '/Reception/UpdateReceptionTokenStatusToCompleted',
                    type: 'POST',
                    datatype: 'json',
                    contenttype: 'application/json; charset=utf-8',
                    data: obj,
                    async: false,
                    success: function (result) {

                        if (result.Status) {
                            //fnAlert("Transfered to Nurse Assessment", "s");
                            fnAlert("s", "", "", "Completed");
                            clearInterval(myTimer);
                            $('#lblCurrentlyServingToken').text(0);
                            document.querySelector('#lblTokenTimer').textContent = "00:00";
                            jQuery("#jqgReception").jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid');
                            return true;
                        }
                        else {
                            //fnAlert(result.Message, "e");
                            fnAlert("e", "", "", result.Message);
                            return false;
                        }
                    },
                    error: function (error) {
                        //fnAlert(error.statusText, "e");
                        fnAlert("e", "", "", error.statusText);
                        return false;
                    }
                });
            }
        }
    });

}
function fnUpdateTokenStatusToNurseAssessment_old(QueueTokenKey) {
    if ($("#cboDeskNumber").val() == "0") {
        //fnAlert("Please select a Desk Number", "e");
        fnAlert("e", "", "", "Please select a Desk Number");
        fnClearToken();
        return;
    }
    if (QueueTokenKey != $('#lblCurrentlyServingToken').text()) {
        //fnAlert("Please call the patient first", "e");
        fnAlert("w", "", "", "Please call the patient first");
        return false;
    }


    var rowIds = $('#jqgReception').jqGrid('getDataIDs');
    for (i = 0; i < rowIds.length; i++) {
        rowData = $('#jqgReception').jqGrid('getRowData', rowIds[i]);
        if (rowData['QueueTokenKey'] === QueueTokenKey) {
            //console.log(rowData)
            $('#txtQNumber').val(QueueTokenKey);
            $('#txtUHID').val(rowData['UHID']);
            if (rowData['PatientId'] === '0' || rowData['PatientId'] === 'N/A') {
                $('#txtPatientID').val('');
                $('#txtPatientID').attr("disabled", false);
            }
            else {
                $('#txtPatientID').val(rowData['PatientId']);
                $('#txtPatientID').attr("disabled", true);
            }
            if (rowData['FirstName'] === 'Walk-IN') {
                $('#txtDateOfBirth').val(fnFormatDateJsonToInput(new Date()));
                $('#txtFirstName').val('');
                $('#txtLastName').val('');
                $('#cboGender').val('0');
                $('#txtMobileNumber').val('');
                $('#txtEmailID').val('');
            }
            else {
                $('#txtDateOfBirth').val(fnFormatDateJsonToInput(new Date(rowData['DateOfBirth'])));
                $('#txtFirstName').val(rowData['FirstName']);
                $('#txtLastName').val(rowData['LastName']);
                $('#cboGender').val(rowData['Gender']);
                $('#txtMobileNumber').val('0' + rowData['MobileNumber']);
                $('#txtEmailID').val(rowData['EmailId']);
            }
            if (rowData['QueueTokenKey'].startsWith('S')) {
                $('#cboCustomer').val('');
                $('#cboCustomer').selectpicker('refresh');
                $('#divCustomer').show();
            }
            else {
                $('#divCustomer').hide();
            }
        }
    }

    $('#PopupComplete').modal('show');


    //bootbox.confirm({
    //    message: "Transfer to Nurse Assessment ?",
    //    buttons: {
    //        confirm: {
    //            label: 'Yes',
    //            className: 'btn-success'
    //        },
    //        cancel: {
    //            label: 'No',
    //            className: 'btn-danger'
    //        }
    //    },
    //    callback: function (result) {
    //        if (result) {
    //            var obj = {
    //                QueueTokenKey: QueueTokenKey,
    //            };

    //            $.ajax({
    //                url: getBaseURL() + '/Reception/UpdateReceptionTokenStatusToNurseAssessment',
    //                type: 'POST',
    //                datatype: 'json',
    //                contenttype: 'application/json; charset=utf-8',
    //                data: obj,
    //                async: false,
    //                success: function (result) {

    //                    if (result.Status) {
    //                        //fnAlert("Transfered to Nurse Assessment", "s");
    //                        fnAlert("s","","","Transfered to Nurse Assessment");
    //                        clearInterval(myTimer);
    //                        document.querySelector('#lblTokenTimer').textContent = "Completed";
    //                        jQuery("#jqgReception").jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid');
    //                        return true;
    //                    }
    //                    else {
    //                        //fnAlert(result.Message, "e");
    //                        fnAlert("e","","",result.Message);
    //                        return false;
    //                    }
    //                },
    //                error: function (error) {
    //                    //fnAlert(error.statusText, "e");
    //                    fnAlert("e","","",error.statusText);
    //                    return false;
    //                }
    //            });
    //        }
    //    }
    //});

}
function fnCompeleteRegistration() {
    if ($('#txtPatientID').val().trim().length <= 0) {
        //fnAlert("Please Enter Patient MRN", "e");
        fnAlert("w", "", "", "Please Enter Patient MRN");
        return;
    }
    else if ($('#txtFirstName').val().trim().length <= 0) {
        //fnAlert("Please Enter First Name", "e");
        fnAlert("w", "", "", "Please Enter First Name");
        return;
    }
    else if ($('#txtLastName').val().trim().length <= 0) {
        //fnAlert("Please Enter Last Name", "e");
        fnAlert("w", "", "", "Please Enter Last Name");
        return;
    }
    else if ($('#cboGender').val() == null || $('#cboGender').val() == '' || $('#cboGender').val() == '0') {
        //fnAlert("Please select the Gender", "e");
        fnAlert("w", "", "", "Please select the Gender");
        return;
    }
    else if ($('#txtDateOfBirth').val() == null || $('#txtDateOfBirth').val() == '') {
        //fnAlert("Please Enter the DateofBirth", "e");
        fnAlert("w", "", "", "Please Enter the DateofBirth");
        return;
    }
    else if ($('#txtMobileNumber').val().trim().length <= 0) {
        //fnAlert("Please Enter Mobile Number", "e");
        fnAlert("w", "", "", "Please Enter Mobile Number");
        return;
    }
    else if ($('#txtMobileNumber').val().trim().length < 11) {
        //fnAlert("Please Enter proper Mobile Number", "e");
        fnAlert("w", "", "", "Please Enter proper Mobile Number");
        return;
    }
    else if (!IsValidateEmail($('#txtEmailID').val().trim())) {
        //fnAlert("Please Enter valid EmailID", "e");
        fnAlert("w", "", "", "Please Enter valid EmailID");
        return;
    }
    else if ($('#txtQNumber').val().startsWith('S')) {
        if ($('#cboCustomer').val() == null || $('#cboCustomer').val() == '') {
            //fnAlert("Please select the insurance", "e");
            fnAlert("w", "", "", "Please select the insurance");
            return;
        }
    }


    var obj = {
        QueueTokenKey: $('#txtQNumber').val(),
        UHID: $('#txtUHID').val(),
        PatientId: $('#txtPatientID').val().trim(),
        FirstName: $('#txtFirstName').val().trim(),
        LastName: $('#txtLastName').val().trim(),
        Gender: $('#cboGender').val(),
        DateOfBirth: $('#txtDateOfBirth').val(),
        MobileNumber: $('#txtMobileNumber').val(),
        EmailId: $('#txtEmailID').val().trim(),
        CustomerId: $('#cboCustomer').val()
    };
    $("#btnSave").attr('disabled', true);

    $.ajax({
        //url: getBaseURL() + '/Reception/UpdateReceptionTokenStatusToNurseAssessment',
        url: '',
        type: 'POST',
        datatype: 'json',
        contenttype: 'application/json; charset=utf-8',
        data: obj,
        async: false,
        success: function (result) {

            if (result.Status) {
                //fnAlert("Transfered to Nurse Assessment", "s");
                fnAlert("s", "", "", "Transfered to Nurse Assessment");
                clearInterval(myTimer);
                document.querySelector('#lblTokenTimer').textContent = "Completed";
                jQuery("#jqgReception").jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid');
                $("#btnSave").attr('disabled', false);
                $('#PopupComplete').modal('hide');
                return true;
            }
            else {
                //fnAlert(result.Message, "e");
                fnAlert("e", "", "", result.Message);
                $("#btnSave").attr('disabled', false);
                return false;
            }
        },
        error: function (error) {
            //fnAlert(error.statusText, "e");
            fnAlert("e", "", "", error.statusText);
            $("#btnSave").attr('disabled', false);
            return false;
        }
    });

}
function fnUpdateTokenStatusToCancel(QueueTokenKey) {
    if ($("#cboDeskNumber").val() === "") {
        //fnAlert("Please select a Desk Number", "e");
        fnAlert("w", "", "", "Please select a Desk Number");
        fnClearToken();
        return;
    }
    if (QueueTokenKey != $('#lblCurrentlyServingToken').text()) {
        //fnAlert("Please call the patient first", "e");
        fnAlert("w", "", "", "Please call the patient first");
        return false;
    }


    bootbox.confirm({
        message: "Patient not reported?",
        buttons: {
            confirm: {
                label: 'Yes',
                className: 'btn-success'
            },
            cancel: {
                label: 'No',
                className: 'btn-danger'
            }
        },
        callback: function (result) {
            if (result) {
                var obj = {
                    QueueTokenKey: QueueTokenKey,
                };

                $.ajax({
                    // url: getBaseURL() + '/Reception/UpdateReceptionTokenStatusToCancel',
                    url: '',
                    type: 'POST',
                    datatype: 'json',
                    contenttype: 'application/json; charset=utf-8',
                    data: obj,
                    async: false,
                    success: function (result) {

                        if (result.Status) {
                            //fnAlert("Token Cancelled", "s");
                            fnAlert("s", "", "", "Token Cancelled");
                            clearInterval(myTimer);
                            document.querySelector('#lblTokenTimer').textContent = "Completed";
                            jQuery("#jqgReception").jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid');
                            return true;
                        }
                        else {
                            //fnAlert(result.Message, "e");
                            fnAlert("e", "", "", result.Message);
                            return false;
                        }
                    },
                    error: function (error) {
                        //fnAlert(error.statusText, "e");
                        fnAlert("e", "", "", error.statusText);
                        return false;
                    }
                });
            }
        }
    });

}

function fnUpdateTokenToHold(qKey) {
    if ($("#cboDeskNumber").val() == "0") {
        //fnAlert("Please select a Desk Number", "e");
        fnAlert("w", "", "", "Please select a Desk Number");
        fnClearToken();
        return;
    }
    else {
        bootbox.confirm({
            message: "Do you want to hold this Token " + qKey + " ?",
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                if (result) {
                    var obj = {
                        QueueTokenKey: qKey,
                    };

                    $.ajax({
                        url: getBaseURL() + '/Reception/UpdateReceptionTokenToHold',
                        type: 'POST',
                        datatype: 'json',
                        contenttype: 'application/json; charset=utf-8',
                        data: obj,
                        async: false,
                        success: function (result) {

                            if (result.Status) {
                                //fnAlert("Hold the Token", "s");
                                fnAlert("s", "", "", "Hold the Token");
                                jQuery("#jqgReception").jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid');
                                return true;
                            }
                            else {
                                //fnAlert(result.Message, "e");
                                fnAlert("e", "", "", result.Message);
                                return false;
                            }
                        },
                        error: function (error) {
                            // fnAlert(error.statusText, "e");
                            fnAlert("e", "", "", error.statusText);
                            return false;
                        }
                    });
                }
            }
        });
    }
   

}

function fnUpdateTokenToRelease(QueueTokenKey) {

    bootbox.confirm({
        message: "Do you want to release this Token " + QueueTokenKey + " ?",
        buttons: {
            confirm: {
                label: 'Yes',
                className: 'btn-success'
            },
            cancel: {
                label: 'No',
                className: 'btn-danger'
            }
        },
        callback: function (result) {
            if (result) {
                var obj = {
                    QueueTokenKey: QueueTokenKey,
                };

                $.ajax({
                    url: getBaseURL() + '/Reception/UpdateReceptionTokenToRelease',
                   
                    type: 'POST',
                    datatype: 'json',
                    contenttype: 'application/json; charset=utf-8',
                    data: obj,
                    async: false,
                    success: function (result) {

                        if (result.Status) {
                            // fnAlert("Release the Token", "s");
                            fnAlert("s", "", "", "Release the Token");
                            jQuery("#jqgReception").jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid');
                            return true;
                        }
                        else {
                            //fnAlert(result.Message, "e");
                            fnAlert("e", "", "", result.Message);
                            return false;
                        }
                    },
                    error: function (error) {
                        //fnAlert(error.statusText, "e");
                        fnAlert("e", "", "", error.statusText);
                        return false;
                    }
                });
            }
        }
    });
}

// TIMER

// Run Timer Control in Label
var myTimer;
function startTimer(duration, display) {

    if (myTimer !== null)
        clearInterval(myTimer);

    var start = Date.now(),
        diff,
        minutes,
        seconds;
    function timer() {
        // get the number of seconds that have elapsed since
        // startTimer() was called
        diff = duration - (((Date.now() - start) / 1000) | 0);

        // does the same job as parseInt truncates the float
        minutes = (diff / 60) | 0;
        seconds = (diff % 60) | 0;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (diff <= 0) {
            // add one second so that the count down starts at the full duration
            // example 03:00 not 02:59 Restart
            //start = Date.now() + 1000;
            clearInterval(myTimer);
            return;
        }
    };
    // we don't want to wait a full second before the timer starts
    timer();
    myTimer = setInterval(timer, 1000);
}

// Voice of the Given text
function fnTextToSpeech(text) {
    //var msg = new SpeechSynthesisUtterance();
    //var voices = window.speechSynthesis.getVoices();
    //msg.voice = voices[2];
    //msg.voiceURI = "native";
    //msg.volume = 20;
    //msg.rate = .7;
    //msg.pitch = 5;
    //msg.text = text;
    //msg.onend = function (e) {
    //    //console.log('Finished in ' + event.elapsedTime + ' seconds.');
    //};
    //speechSynthesis.speak(msg);


     
    beep(1000, 2, function () {
    });
}


var beep = (function () {
    var ctxClass = window.audioContext || window.AudioContext || window.AudioContext || window.webkitAudioContext
    var ctx = new ctxClass();
    return function (duration, type, finishedCallback) {

        duration = +duration;

        // Only 0-4 are valid types.
        type = (type % 5) || 0;

        if (typeof finishedCallback != "function") {
            finishedCallback = function () { };
        }

        var osc = ctx.createOscillator();

        osc.type = type;
        //osc.type = "sine";

        osc.connect(ctx.destination);
        if (osc.noteOn) osc.noteOn(0);
        if (osc.start) osc.start();

        setTimeout(function () {
            if (osc.noteOff) osc.noteOff(0);
            if (osc.stop) osc.stop();
            finishedCallback();
        }, duration);

    };
})();



function fnClearToken() {
    $('#lblCurrentlyServingToken').text(0);
    clearInterval(myTimer);
    document.querySelector('#lblTokenTimer').textContent = "00:00";
}


function fnSetHeightForGrid(id) {
    var _winWidth = $(window).width();
    var _winHeight = $(window).height();
    var _gridID = $(id);
    var offset = _gridID.offset();
    var _gridIDIDTop = offset.top;

    $(id).css({
        'max-height': $(window).innerHeight() - _gridIDIDTop - 30,
        'overflow-y': 'auto',
        'overflow-x': 'hidden'
    });
   
}