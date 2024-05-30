var _formEdit = true;
var _formDelete = true;

$(document).ready(function () {

    fnGridLoadDoctorProfile("0");

    $(".dot").click(function () {
        $('.dot').removeClass('active');
        var doctorNamePrefix = $(this).text();
        if (doctorNamePrefix === "All")
            doctorNamePrefix = "";
        fnGridLoadDoctorProfile(doctorNamePrefix);
        $(this).addClass('active');
    });
    $(window).on('resize', function () {
        if ($(window).width() < 1025) {
            fnJqgridSmallScreen('jqgDoctorProfile');
        }
    });
    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnDoctorProfile",
        trigger: 'left',
        // define the elements of the menu 
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditDoctorProfile(event) } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnViewDoctorProfile(event) } },
            //jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnDeActivateDoctorProfile(event) } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    //$(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});
function fnSetSidebar() {
    var _renderBodycontent = $(".renderBody").offset();
    var _fullH = $(window).innerHeight();
    var _newTabH = (_fullH - _renderBodycontent.top);
    var windW = $(window).width();
    
    if (windW > 1099) {
        $("#v-pills-tab").css({ "min-height": _newTabH, "overflow-y": "auto" });
        $(".tab-content").css({ "height": _newTabH, "overflow-y": "auto" });
        $(".tab-content-inner").css({ "height": _newTabH });
        $(".mainbarSmall").scrollTop(0);

    }
    else {
        $(".tab-content-inner").css({ "height": _newTabH, "overflow-y": "auto" });
    }
}
function fnGridLoadDoctorProfile(doctorPrefix) {
    $("#jqgDoctorProfile").jqGrid('GridUnload');
    $("#jqgDoctorProfile").jqGrid({
        url: getBaseURL() + '/Doctor/GetDoctorMasterListForPrefix?doctorNamePrefix=' + doctorPrefix,
        datatype: 'json',
        mtype: 'Get',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        ignoreCase: true,
        colNames: [localization_dp.DoctorId, localization_dp.DoctorShortName, localization_dp.DoctorName, localization_dp.DoctorRegistrationNo,"", localization_dp.Gender, localization_dp.DoctorClassCode, localization_dp.DoctorClass, localization_dp.DoctorCategoryCode, localization_dp.DoctorCategory, localization_dp.SeniorityLvl, localization_dp.SeniorityLevelD, localization_dp.EmailID,"", localization_dp.TariffFrom, localization_dp.IsdCode, localization_dp.MobileNumber, localization_dp.Password, localization_dp.Active, localization_dp.Actions],
        colModel: [
            { name: "DoctorId", width: 40, editable: true, align: 'left', hidden: true },
            { name: "DoctorShortName", width: 35, editable: true, align: 'left', hidden: true },
            { name: "DoctorName", width: 70, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "DoctorRegnNo", width: 70, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "Gender", width: 25, editable: true, align: 'left', hidden: true },
            { name: "GenderDesc", width: 25, editable: true, align: 'left', hidden: false },
            { name: "DoctorClass", width: 40, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "DoctorClassDesc", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "DoctorCategory", width: 60, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "DoctorCategoryDesc", width: 60, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "SeniorityLevel", width: 35, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "SeniorityLevelDesc", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "EmailId", width: 40, editable: true, align: 'left', hidden: true },
            { name: "TraiffFrom", width: 10, editable: true, align: 'left', hidden: true },
            { name: "TraiffFromDesc", width: 40, editable: true, align: 'left', hidden: false },
            { name: "Isdcode", width: 70, editable: true, align: 'left', hidden: true },
            { name: "MobileNumber", width: 70, editable: true, align: 'left', hidden: true },
            { name: "Password", width: 70, editable: true, align: 'left', hidden: true },
            { name: "ActiveStatus", editable: true, width: 20, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnDoctorProfile"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },

        ],
        pager: "#jqpDoctorProfile",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: 55,
        loadonce: true,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        scrollOffset: 0,
        loadComplete: function (data) {
            SetDoctorProfileGridControlByAction();
            fnJqgridSmallScreen('jqgDoctorProfile');
        },

        onSelectRow: function (rowid, status, e) {
            var $self = $(this), $target = $(e.target),
                p = $self.jqGrid("getGridParam"),
                rowData = $self.jqGrid("getLocalRow", rowid),
                $td = $target.closest("tr.jqgrow>td"),
                iCol = $td.length > 0 ? $td[0].cellIndex : -1,
                cmName = iCol >= 0 ? p.colModel[iCol].name : "";

            switch (cmName) {
                case "id":
                    if ($target.hasClass("myedit")) {
                        alert("edit icon is clicked in the row with rowid=" + rowid);
                    } else if ($target.hasClass("mydelete")) {
                        alert("delete icon is clicked in the row with rowid=" + rowid);
                    }
                    break;
                case "serial":
                    if ($target.hasClass("mylink")) {
                        alert("link icon is clicked in the row with rowid=" + rowid);
                    }
                    break;
                default:
                    break;
            }

        },

    }).jqGrid('navGrid', '#jqpDoctorProfile', { add: false, edit: false, search: false, del: false, refresh: false }, {}, {}, {}, {
        closeOnEscape: true,
        caption: "Search...",
        multipleSearch: true,
        Find: "Find",
        Reset: "Reset",
        odata: [{ oper: 'eq', text: 'Match' }, { oper: 'cn', text: 'Contains' }, { oper: 'bw', text: 'Begins With' }, { oper: 'ew', text: 'Ends With' }]
    }).jqGrid('navButtonAdd', '#jqpDoctorProfile', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshDoctorProfile
    }).jqGrid('navButtonAdd', '#jqpDoctorProfile', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgDMAdd', position: 'first', onClickButton: fnGridAddDoctorProfile
    });

    fnAddGridSerialNoHeading();
    fnProcessLoading(false);
}

function fnGridAddDoctorProfile() {
    
    $("#btnSaveDoctorProfile").html('<i class="far fa-save"></i> ' + localization.Save);
    $("#btnClearDoctor").show();
    $("#divGrid").hide();
    $('#divDoctorProfileForm').css('display', 'block');
    _formEdit = true;
    _formDelete = true;
    fnSetSidebar();
    fnClearFields();
    fnClearDoctorAboutDetails();
    fnGridDoctorProfileBusinessLink();
    fnBindDoctorBusinessLinkList();
    fnGetDoctorAddressbyDoctorId();
    fnBindDoctorStatutoryISDBusinessLink();
    //$('#Photoimage').val('');
    //$('#imgPhotoimageblah').removeAttr('src');

    //fnClearFields();
    ////$('#PopupDoctorMaster').find('.modal-title').text(localization.AddDoctor);
    //$("#btnSaveDoctorProfile").html('<i class="far fa-save"></i> ' + localization.Save);
    //$("#btnClearDoctor").show();
    //$("#divGrid").hide();
    //$('#divDoctorProfileForm').css('display', 'block');

    //$('#Photoimage').val('');
    //$('#imgPhotoimageblah').removeAttr('src');

    //fnLoadDoctorParameters();
    ////fnGridDoctorProfileBusinessLink();
    //fnGridDoctorSpecialtyLink();
    //fnLoadDoctorLeaveGrid();

  
    
    //fnGetDoctorAddressbyDoctorId();


    //fnLoadDoctorSchedulerGrid();
    //fnLoadDoctorScheduleChangeGrid();

    $("#chkActiveStatus").attr('disabled', true);
}
function fnGridRefreshDoctorProfile() {
    $("#jqgDoctorProfile").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnEditDoctorProfile(e) {
    fnSetSidebar();
    if (_userFormRole.IsEdit === false) {
        fnAlert("w", "ESP_01_00", "UIC02", errorMsg.editauth_E2);
        return;
    }
    $("#btnSaveDoctorProfile,#btnSaveAboutDoctor,#btnSaveDoctorProfileImage, #btnSaveDoctorProfileBusinessLink, #btnSaveDoctorProfileAddress, #btnSaveDoctorStatutoryDetails,#btnSaveDoctorConsultationRate").html("<i class='fa fa-sync'></i>  Update");
    $("#divGrid").hide();
    $('#divDoctorProfileForm').css('display', 'block');
    fnClearFields();
    $("#btnSaveDoctorProfile").html('<i class="far fa-sync"></i> ' + localization.Update);
    $("#btnClearDoctor").hide();
    var rowid = $("#jqgDoctorProfile").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDoctorProfile').jqGrid('getRowData', rowid);
    _formEdit = true;
    _formDelete = true;

    fnGetDoctorMasterProfile(rowData);
    $("#btnSaveDoctorProfileBusinessLink").show();
    $("#btnClearDoctorProfileBusinessLink").show();
    $("#btnSaveDoctorProfileImage").show();
    $("#btnSaveDoctorStatutoryDetails").show();
    $("#btnClearDoctor").show();
    $("#divUploadPhoto").css('display', 'block');
    //$("#btnSave").show();
    //$("#btnSaveDoctorSchedule").show();
    //$("#btnClearDoctorSchedule").show();
    //$("#btnSaveDoctorScheduleChange").show();
    //$("#btnSaveDoctorStatutoryDetails").show();
    //$("#btnSaveDoctorLeave").show();
    //$("#btnClearDoctorLeave").show();

    //$("#cboSpecialty").prop("disabled", false);
    //$("#cboDoctorScheduleSpecialty, #cboDoctorClinic, #cboScheduleConsultationType, #cboDoctorScheduleWeekDays").prop("disabled", false);
    //$("#cboDoctorScheduleChangeSpecialty, #cboDoctorScheduleChangeClinic, #cboDoctorScheduleChangeConsultationType").prop("disabled", false);
    //$("#txtOnLeaveFromDoctor, txtOnLeaveTillDoctor").prop("disabled", false);
    //$("#chkActiveStatus").attr('disabled', true);
}

function fnViewDoctorProfile(e) {
    fnSetSidebar();
    if (_userFormRole.IsEdit === false) {
        fnAlert("w", "ESK_02_00", "UIC03", errorMsg.vieweauth_E3);
        return;
    }

    fnClearFields();
    var rowid = $("#jqgDoctorProfile").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDoctorProfile').jqGrid('getRowData', rowid);
    _formEdit = false;
    _formDelete = false;
    fnGetDoctorMasterProfile(rowData);

    $("#divGrid").hide();
    $('#divDoctorProfileForm').css('display', 'block');
    $("#btnSaveDoctorProfile").hide();
    $("#btnClearDoctor").hide();
    $("input,textarea").attr('readonly', true);
    //$("select").next().prop("disabled", true);

    //$("#cboSpecialty").prop("disabled", true);
    //$("#cboDoctorScheduleSpecialty, #cboDoctorClinic, #cboScheduleConsultationType, #cboDoctorScheduleWeekDays").prop("disabled", true);
    //$("#cboDoctorScheduleChangeSpecialty, #cboDoctorScheduleChangeClinic, #cboDoctorScheduleChangeConsultationType").prop("disabled", true);
    //$("#txtOnLeaveFromDoctor, txtOnLeaveTillDoctor").prop("disabled", true);

    $("input[type=checkbox]").attr('disabled', true);
    $("#btnSaveDoctorProfile,#btnClearDoctor,#btnSaveAboutDoctor,#btnClearAboutDoctor, #btnSaveDoctorProfileImage, #btnClearDoctor, #btnSaveDoctorProfileBusinessLink, #btnClearDoctorProfileBusinessLink,#btnSaveDoctorProfileAddress, #btnClearDoctorAddress, #btnSaveDoctorStatutoryDetails, #btnClearDoctor, #btnClearDoctor").css('display', 'none');
    $("#btnSaveDoctorProfileBusinessLink").hide();
    $("#btnClearDoctorProfileBusinessLink").hide();
    //$("#btnDoctorSpecialtySave").hide();
    //$("#btnSave").hide();
    //$("#btnSaveDoctorSchedule").hide();
    //$("#btnClearDoctorSchedule").hide();
    //$("#btnSaveDoctorScheduleChange").hide();
    //$("#btnClearDoctorScheduleChange").hide();
    //$("#btnSaveDoctorLeave").hide();
    //$("#btnClearDoctorLeave").hide();

}

function fnGetDoctorMasterProfile(data) {
  
    if (data != null) {
      
        $.ajax({
            url:'',
            url: getBaseURL() + '/Doctor/GetDoctorMaster?doctorId=' + data.DoctorId,
            type: 'POST',
            datatype: 'json',
            success: function (response) {
                if (response != null) {
                    fnFillDataMasterData(response);
                }
                else {
                    fnClearFields();

                }

            },
            error: function (error) {
                fnAlert("e", "", response.StatusCode, response.Message);;

            }
        });
    }
}
//function fnEditDoctorProfile(e) {
//    $("#divGrid").hide();
//    $('#divDoctorProfileForm').css('display', 'block');
//    $("#btnSaveDoctorProfile").html('<i class="far fa-save"></i> ' + localization.Update);
//    $("#btnClearDoctor").hide();
//}
function fnFillDataMasterData(data) {

    $('#hdvDoctorId').val(data.DoctorId);
    $('#txtDoctorId').val(data.DoctorId);
    $('#hdDoctorName').html(data.DoctorName);
    $('#txtDoctorName').val(data.DoctorName);
    $('#txtDoctorShortName').val(data.DoctorShortName);
    $('#txtDoctorRegnNo').val(data.DoctorRegnNo);
    $('#cboGender').val(data.Gender);
    $('#cboGender').selectpicker('refresh');
    $('#txtEMailId').val(data.EMailId);
    $('#cboDoctorMobile').val(data.ISDCode).selectpicker('refresh');
    $('#txtDoctorMobile').val(data.MobileNumber);
    $('#cboDoctorClass').val(data.DoctorClass);
    $('#cboDoctorClass').selectpicker('refresh');
    $('#cboDoctorCategory').val(data.DoctorCategory);
    $('#cboDoctorCategory').selectpicker('refresh');
    $('#cboSeniorityLevel').val(data.SeniorityLevel);
    $('#cboSeniorityLevel').selectpicker('refresh');
    $('#cboTraiffFrom').val(data.TraiffFrom).selectpicker('refresh');

    fnLoadDoctorParameters();
    fnGetDoctorProfileAboutDetails();
    fnGetDoctorProfileImage();
    fnGridDoctorProfileBusinessLink();
    fnBindDoctorBusinessLinkList();
    fnGetDoctorAddressbyDoctorId();
    fnBindDoctorStatutoryISDBusinessLink();
    //fnGridDoctorSpecialtyLink();
    //fnLoadDoctorLeaveGrid();

    //fnLoadDoctorParameters();
    //fnGridDoctorProfileBusinessLink();
    //fnGridDoctorSpecialtyLink();
    //fnLoadDoctorLeaveGrid();

   

    //fnGridDoctorProfileBusinessLink();

    //fnLoadDoctorSchedulerGrid();
    //fnLoadDoctorScheduleChangeGrid();


    //fnLoadClinicBusinessList();

}

function fnSaveDoctorProfile() {
   
    //var file = '';

    if (IsStringNullorEmpty($('#txtDoctorShortName').val())) {
        fnAlert("w", "ESP_01_00", "UI0315", errorMsg_dp.doctorshortname_E1);
        document.getElementById("txtDoctorShortName").focus();
        return;
    }
    if (IsStringNullorEmpty($('#txtDoctorName').val())) {
        fnAlert("w", "ESP_01_00", "UI0316", errorMsg_dp.doctorName_E2);
        document.getElementById('txtDoctorName').focus();
        return;
    }
    if (IsStringNullorEmpty($('#cboGender').val()) || $('#cboGender').val() == "0" || $('#cboGender').val()=='0') {
        fnAlert("w", "ESP_01_00", "UI0125", errorMsg_dp.Gender_E3);
        document.getElementById("cboGender").focus();
        return;
    }
    if (IsStringNullorEmpty($('#txtDoctorRegnNo').val())) {
        fnAlert("w", "ESP_01_00", "UI0317", errorMsg_dp.DoctorRegisterNo_E4);
        document.getElementById("txtDoctorRegnNo").focus();
        return;
    }

    if (IsStringNullorEmpty($('#cboDoctorMobile').val())) {
        fnAlert("w", "ESP_01_00", "UI0056", errorMsg_dp.ISDCode_E5);
        document.getElementById("cboDoctorMobile").focus();
        return;
    }
    if (IsStringNullorEmpty($('#txtDoctorMobile').val())) {
        fnAlert("w", "ESP_01_00", "UI0111", errorMsg_dp.MobileNo_E6);
        document.getElementById('txtMobileNumber').focus();
        return;
    }
    if (IsStringNullorEmpty($('#cboDoctorClass').val()) || $('#cboDoctorClass').val() == "0" || $('#cboDoctorClass').val() == '0') {
        fnAlert("w", "ESP_01_00", "UI0318", errorMsg_dp.DoctorClass_E7);
        document.getElementById('cboDoctorClass').focus();
        return;
    }
    if (IsStringNullorEmpty($('#cboDoctorCategory').val()) || $('#cboDoctorCategory').val() == "0" || $('#cboDoctorCategory').val() == '0') {
        fnAlert("w", "ESP_01_00", "UI0319", errorMsg_dp.DoctorCategory_E8);
        document.getElementById('cboDoctorCategory').focus();
        return;
    }
   
    if (IsStringNullorEmpty($('#cboTraiffFrom').val()) || $('#cboTraiffFrom').val() == "0" || $('#cboTraiffFrom').val() == '0') {
        fnAlert("w", "ESP_01_00", "UI0320", errorMsg_dp.TariffFrom_E9);
        document.getElementById('cboTraiffFrom').focus();
        return;
    }
    if (IsStringNullorEmpty($('#cboSeniorityLevel').val()) || $('#cboSeniorityLevel').val() == "0" || $('#cboSeniorityLevel').val() == '0') {
        fnAlert("w", "ESP_01_00", "UI0321", errorMsg_dp.SeneiorityLevel_E10);
        document.getElementById('cboSeniorityLevel').focus();
        return;
    }


    if (IsStringNullorEmpty($("#cboDoctorMobile").val()) || $("#cboDoctorMobile").val() <= 0) {
        fnAlert("w", "ESP_01_00", "UI0137", errorMsg_dp.SelectISD_E11);
        document.getElementById('cboDoctorMobile').focus();
        return;
    }


    if ($("#txtDoctorMobile").inputmask("isComplete") === false) {
         fnAlert("w", "ESP_01_00", "UI0111", errorMsg_dp.MobileNo_E6);
        document.getElementById('txtDoctorMobile').focus();
        return;
    }

    if (!IsStringNullorEmpty($('#txtEMailId').val())) {
        if (!IsValidateEmail($('#txtEMailId').val())==true) {
            fnAlert("w", "ESP_01_00", "UI0139", "Invalid Email ID");
            document.getElementById('txtEMailId').focus();
            return;
        }
    }

    //if ($('#imgPhoto img').attr('src') !== undefined) {

    //    file = ($('#imgPhoto img').attr('src').indexOf('TakePicture.jpg') > 0) ? null : $('#imgPhoto img').attr('src');// Data URI
    //}

    $("#btnSaveDoctorProfile").attr("disabled", true);

    var obj = {
        DoctorId: $('#hdvDoctorId').val(),
        DoctorName: $('#txtDoctorName').val(),
        DoctorShortName: $('#txtDoctorShortName').val(),
        DoctorRegnNo: $('#txtDoctorRegnNo').val(),
        Gender: $('#cboGender').val(),
        ISDCode: $('#cboDoctorMobile').val(),
        MobileNumber: $('#txtDoctorMobile').val(),
        EMailId: $('#txtEMailId').val(),
        DoctorClass: $('#cboDoctorClass').val(),
        DoctorCategory: $('#cboDoctorCategory').val(),
        SeniorityLevel: $('#cboSeniorityLevel').val(),
        TraiffFrom: $('#cboTraiffFrom').val(),
        ActiveStatus: $('#chkActiveStatus').parent().hasClass("is-checked"),
        l_DoctorParameter: eSyaParams.GetJSONValue()

    };

    var Url;
    if ($('#hdvDoctorId').val() === null || $('#hdvDoctorId').val() === '')
        Url = getBaseURL() + '/Doctor/InsertDoctorMaster';
    else
        Url = getBaseURL() + '/Doctor/UpdateDoctorMaster';

    $.ajax({
        url: Url,
        type: 'POST',
        datatype: 'json',
        data: { obj: obj },
        success: function (response) {
            if (response !== null) {
                if (response.Status) {
                    fnAlert("s", "", response.StatusCode, response.Message);
                    $('#txtDoctorId').val(response.ID);
                    $('#hdDoctorName').html($('#txtDoctorName').val());
                    $("#btnSaveDoctorProfile").attr('disabled', false);
                }
                else {
                    fnAlert("e", "", response.StatusCode, response.Message);
                    $("#btnSaveDoctorProfile").attr('disabled', false);
                }
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveDoctorProfile").attr('disabled', false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveDoctorProfile").attr("disabled", false);
        }
    });
    $("#btnSaveDoctorProfile").attr('disabled', false);
}

function fnClearFields() {

    $('#hdvDoctorId').val('');
    $('#txtDoctorId').val('');
    $('#txtDoctorName').val('');
    $('#hdDoctorName').val('');
    $('#hdDoctorName').html('');
    $('#txtDoctorShortName').val('');
    $('#txtDoctorRegnNo').val('');
    $('#txtEMailId').val('');
    $('#txtDoctorMobile').val('');
    $('#cboDoctorClass').val('0');
    $('#cboDoctorClass').selectpicker('refresh');
    $('#cboDoctorCategory').val('0');
    $('#cboDoctorCategory').selectpicker('refresh'); 
    $('#cboGender').val('0');
    $('#cboGender').selectpicker('refresh');
    $('#cboSeniorityLevel').val('0');
    $('#cboSeniorityLevel').selectpicker('refresh');
    $("#btnSaveDoctorProfile").html('<i class="far fa-save"></i> ' + localization.Save);
    $('#cboTraiffFrom').val('0').selectpicker('refresh');;
    $('#cboTimeSlotInMintues').val('0').selectpicker('refresh');;
    $('#divCapturePhoto,#divUploadPhoto').css('display', 'none');
    $("#imgPhotoimageblah,#imgSignatureblah").attr('src', '');
    $("button[id^=btnSave],button[id^=btnClear]").css('display', 'inline-block');
    eSyaParams.ClearValue();
    $("#cboLocation").empty();
    $("#cboLocation").append($("<option value='0'> Select </option>")).selectpicker('refresh');
    $("#txtIsdcode").empty();
    $("#txtIsdcode").append($("<option value='0'> Select </option>")).selectpicker('refresh');
    $("#cboState").empty();
    $("#cboState").append($("<option value='0'> Select </option>")).selectpicker('refresh');
    $("#cboCity").empty();
    $("#cboCity").append($("<option value='0'> Select </option>")).selectpicker('refresh');
    $("#cboZipDesc").empty();
    $("#cboZipDesc").append($("<option value='0'> Select </option>")).selectpicker('refresh');
    $("#cboArea").empty();
    $("#cboArea").append($("<option value='0'> Select </option>")).selectpicker('refresh');
    $("#txtZipCode").val('');
    $("#txtAddress").val('');

    $("#cbospecialtyLocation").empty();
    $("#cbospecialtyLocation").append($("<option value='0'> Select </option>")).selectpicker('refresh');

}

function SetDoctorProfileGridControlByAction() {

    if (_userFormRole.IsInsert === false) {
        $('#jqgDMAdd').addClass('ui-state-disabled');
    }

}

function fnCloseDoctorProfile() {
    $("#divGrid").show();
    $('#divDoctorProfileForm').css('display', 'none');
    $('.tab-pane').removeClass('active show');
    $("#doctorprofile").addClass('active show');
    $('#v-pills-tab a').removeClass('active');
    $('#doctorprofile-tab').addClass('active');

    $("#btnSaveDoctorProfile").show();
    $("input,textarea").attr('readonly', false);
    $("select").next().attr('disabled', false);
    $("input[type=checkbox]").attr('disabled', false);
    fnClearFields();
    $("#btnSaveDoctorProfileBusinessLink").show();
    $("#btnClearDoctorProfileBusinessLink").show();
    //$("#btnDoctorSpecialtySave").show();
    //$("#btnSaveDoctorSchedule").show();
    //$("#btnClearDoctorSchedule").show();
    //$("#btnSaveDoctorScheduleChange").show();
    //$("#btnClearDoctorScheduleChange").show();
    //$("#btnSaveDoctorLeave").show();
    //$("#btnClearDoctorLeave").show();
    fnGridRefreshDoctorProfile();
    fnLoadDoctorParameters();
}

//function fnDeActivateDoctorProfile(e) {

//    if (_userFormRole.IsDelete === false) {
//        toastr.warning("your Not Authorized to Delete");
//        return;
//    }
//    var rowid = $("#jqgDoctorProfile").jqGrid('getGridParam', 'selrow');
//    var rowData = $('#jqgDoctorProfile').jqGrid('getRowData', rowid);
//    var doctorId = rowData.DoctorId;
//    var a_status;
//    var msg;
//    var lbl;
//    //Activate or De Activate the status
//    if (rowData.ActiveStatus === "true") {
//        a_status = false;
//        msg = "Are you sure you want to De Activate Doctor?";
//        lbl = localization.DeActivate;
//    }
//    else {
//        a_status = true;
//        msg = "Are you sure you want Activate Doctor?";
//        lbl = localization.Activate;
//    }
//    bootbox.confirm({
//        title: 'Doctor Master',
//        message: msg,
//        buttons: {
//            confirm: {
//                label: lbl,
//                className: 'mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent primary-button'
//            },
//            cancel: {
//                label: 'Cancel',
//                className: 'mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect  cancel-button cancel-button'
//            }
//        },
//        callback: function (result) {
//            if (result) {
//                if (doctorId == null || doctorId == undefined || doctorId == "0" || doctorId == '') {
//                    alert("Could not Delete");
//                    return false;
//                }
//                $.ajax({
//                    url: getBaseURL() + '/Doctors/ActiveOrDeActiveDoctor?status=' + a_status + '&doctorId=' + doctorId,
//                    type: 'POST',
//                    success: function (response) {

//                        if (response.Status) {
//                            fnAlert("s", "", response.StatusCode, response.Message);
//                            fnGridRefreshDoctorProfile();
//                        }
//                        else {
//                            fnAlert("e", "", response.StatusCode, response.Message);
//                        }
//                        fnGridRefreshDoctorProfile();
//                    },
//                    error: function (response) {
//                        toastr.error("Couldn't Delete");
//                    }
//                });
//            }
//        }
//    });
//}

function fnLoadDoctorParameters() {
 
    eSyaParams.ClearValue();
    $.ajax({
        url: getBaseURL() + '/Doctor/GetDoctorParameterList?doctorId=' + $('#hdvDoctorId').val(),
      
        type: 'POST',
        datatype: 'json',
        success: function (response) {
            if (response !== null) {
                eSyaParams.SetJSONValue(response);
            }
        },
        error: function (error) {
            fnAlert("e", "", response.StatusCode, response.Message);;
        }
    });

}