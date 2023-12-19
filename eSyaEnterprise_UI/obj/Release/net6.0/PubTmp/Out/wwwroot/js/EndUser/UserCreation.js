

/*Tab -1 Start----------------------------------*/
$(document).ready(function () {
    fnGridLoadUserCreation();
    
    //fnGridBusinessLocation();
    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnEndUserCreation",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditUserCreation(event) } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
});

function fnGridLoadUserCreation() {
    
    $("#jqgUserCreation").jqGrid('GridUnload');

    $("#jqgUserCreation").jqGrid({

        url: getBaseURL() + '/UserCreation/GetUserMaster',
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: ["User ID", localization.LoginID, localization.LoginDescription, localization.EMailId, localization.IsSignInBlocked, localization.IsUserAuthenticated, localization.IsDeActivated,localization.Active, localization.Actions],
        colModel: [
            { name: "UserID", width: 120, editable: true, align: 'left', hidden: true },
            { name: "LoginID", width: 120, editable: true, align: 'left', hidden: false },
            { name: "LoginDesc", width: 300, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "EMailId", width: 150, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "BlockSignIn", editable: false, width: 55, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "IsUserAuthenticated", editable: false, width: 50, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "IsUserDeactivated", editable: false, width: 50, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },

            { name: "ActiveStatus", editable: false, width: 40, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },

            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnEndUserCreation"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpUserCreation",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: '55',
        loadonce: true,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        scroll: false,
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        caption: 'User Master',
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqgUserCreation");
        },

        onSelectRow: function (rowid, status, e) {
        },

    }).jqGrid('navGrid', '#jqpUserCreation', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpUserCreation', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshUserCreation
    }).jqGrid('navButtonAdd', '#jqpUserCreation', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnGridAddUserCreation
    });

    
    fnAddGridSerialNoHeading();
}

function SetGridControlByAction() {
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
    
}

function fnGridRefreshUserCreation() {
    $("#jqgUserCreation").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnGridAddUserCreation() {
    $('#txtUserId').val(''); 
    $('#txtLoginId').val('');
    $("#txtLoginId").attr('disabled', false);
    $('#txtLoginDescription').val('');
    $('#txtemailid').val('');
    $('#Photoimage').val('');
    $('#imgPhotoimageblah').removeAttr('src');
    $('#btnSaveUserMaster').attr('disabled', false);
    $('#btnSaveUserMaster').html('Save');
    $("#PopupUserCreation").modal('show');
    eSyaParams.ClearValue();
} 

function fnEditUserCreation(e) {
   
    var rowid = $("#jqgUserCreation").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgUserCreation').jqGrid('getRowData', rowid);
    var _selectedRow = $("#" + rowid).offset();
    var firstRow = $("tr.ui-widget-content:first").offset();
    $(".ui-jqgrid-bdiv").animate({ scrollTop: _selectedRow.top - firstRow.top }, 700);
    $("#PopupUserCreation").modal('show');
    $('#btnSaveUserMaster').html('Update');
    $("#txtUserId").val(rowData.UserID);
    $("#txtLoginId").attr('disabled', true);

    if (_userFormRole.IsEdit === false) {
        fnAlert("w", "EEU_03_00", "UIC02", errorMsg.editauth_E2);
        return;
    }
    
    fnFillUserCreationValues();
    //fnFillUserParameters();
    
}

function fnFillUserCreationValues() {
  
    if ($("#txtUserId").val() !== '' && $("#txtUserId").val() !== undefined) {
        $.ajax({
            async: false,
            url: getBaseURL() + "/UserCreation/GetUserDetails?UserID=" + $("#txtUserId").val(),
            type: 'post',
            datatype: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
               
                $('#txtLoginId').val(result.LoginID);
                $('#txtLoginDescription').val(result.LoginDesc);
                $('#txtemailid').val(result.EMailId);

                if (result.userimage !== null && result.userimage !== "") {
                    document.getElementById('imgPhoto').innerHTML = '<img id="imgPhotoimageblah" src=" ' + result.userimage + '"  alt=" &nbsp; User Image"   /> <input class="fileInput" id="FileUpload1" type="file" name="file" onchange="readPhotoimage(this);" accept="image/*" enctype="multipart/form-data" />';
                }
               fnFillUserParameters();
            }
        });
    }

}
function fnFillUserParameters() {
  
    if ($("#txtUserId").val() !== '' && $("#txtUserId").val() !== undefined) {
        $.ajax({
            async: false,
            url: getBaseURL() + "/UserCreation/GetUserParameters?UserID=" + $("#txtUserId").val(),
            type: 'post',
            datatype: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                eSyaParams.ClearValue();
                eSyaParams.SetJSONValue(result);
            }
        });
    }

}

function fnClearUserMaster() {
    $('#txtUserId').val('')
    $('#txtLoginId').val('');
    $('#txtLoginDescription').val('');
    $('#txtemailid').val('');
    $('#Photoimage').val('');
    $('#imgPhotoimageblah').removeAttr('src');
}

function fnValidateUserMaster() {

    var EmailPattern = /^\w+([-+.'][^\s]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

    if (IsStringNullorEmpty($("#txtLoginId").val())) {
        fnAlert("w", "EEU_03_00", "UI0133", errorMsg.LoginID_E1);
        return false;
    }
    if (IsStringNullorEmpty($("#txtLoginDescription").val())) {
        fnAlert("w", "EEU_03_00", "UI0134", errorMsg.LoginDesc_E3);
        return false;
    }
  
    if (IsStringNullorEmpty($("#txtemailid").val())) {
        fnAlert("w", "EEU_03_00", "UI0139", errorMsg.EmailID_E7);
        return false;
    }
    if (!EmailPattern.test($("#txtemailid").val())) {
        fnAlert("w", "EEU_03_00", "UI0140", errorMsg.ValidEmailID_E8);
        return false;
    }    
}

function fnSaveUserMaster() {
    var file = '';
    var DSfile = '';

    if (fnValidateUserMaster() === false) {
        return;
    }
    
    $("#btnSaveUserMaster").attr('disabled', true);
    if ($('#imgPhoto img').attr('src') !== undefined) {

        file = ($('#imgPhoto img').attr('src').indexOf('TakePicture.jpg') > 0) ? null : $('#imgPhoto img').attr('src');// Data URI
    }
   
    $("#btnSaveUserMaster").attr('disabled', true);

    var userpar = eSyaParams.GetJSONValue();

        objuser = {
            UserID: $("#txtUserId").val() === '' ? 0 : $("#txtUserId").val(),
            LoginID: $("#txtLoginId").val(),
            LoginDesc: $("#txtLoginDescription").val(),
            EMailId: $("#txtemailid").val(),
            l_userparameter: userpar
        };
    $.ajax({
        async: false,
        url: getBaseURL() + '/UserCreation/InsertOrUpdateUserMaster',
        type: 'POST',
        data: {
            obj: objuser,
            file: file,
        },
        datatype: 'json',
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveUserMaster").attr('disabled', false);
                $("#txtUserId").val(response.ID);
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
            }
            $("#btnSaveUserMaster").attr('disabled', false);
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveUserMaster").attr("disabled", false);
        }
    });
}

$("#PopupUserCreation").on('hide.bs.modal', function () {
    $("#video,#canvas").show();
    $('.nav-link').removeClass('active');
    $('[role="tabpanel"]').removeClass('active show');
    $("#userprofile-tab").addClass('active');
    $("#userprofile").addClass('active show');
    $("#imgPhotoimageblah").attr('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==');
});

$("#PopupUserCreation").on('show.bs.modal', function () {
    $("#video,#canvas").show();
    $("#imgPhotoimageblah").attr('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==');
});

/*start Tab-2------------------------------------------------------------*/
function fnOnChangeBusinessLocation() {
    BindPreferredLanguage();
    GetISDCodebyBusinessKey();
}
function BindPreferredLanguage() {
    var businesskey = $("#cboBusinesskey").val();
    $("#cboPreferredLanguage").empty();
    $.ajax({
        url: getBaseURL() + '/UserCreation/GetPreferredLanguagebyBusinessKey?BusinessKey=' + businesskey,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", xhr.StatusCode, xhr.statusText);
        },
        success: function (response, data) {
            if (response != null) {
                //refresh each time
                $("#cboPreferredLanguage").empty();

                $("#cboPreferredLanguage").append($("<option value='0'> Select Preferred Language</option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboPreferredLanguage").append($("<option></option>").val(response[i]["CultureCode"]).html(response[i]["CultureDescription"]));
                }
                $('#cboPreferredLanguage').selectpicker('refresh');
            }
            else {
                $("#cboPreferredLanguage").empty();
                $("#cboPreferredLanguage").append($("<option value='0'> Select Preferred Language </option>"));
                $('#cboPreferredLanguage').selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });


}
function GetISDCodebyBusinessKey() {
    var businesskey = $("#cboBusinesskey").val();
    
    $.ajax({
        url: getBaseURL() + '/UserCreation/GetStateCodebyBusinessKey?BusinessKey=' + businesskey,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", xhr.StatusCode, xhr.statusText);
        },
        success: function (response, data) {
            if (response != null) {
                //refresh each time
                debugger;
                $('#cboUserMobileNumber').val(response).selectpicker('refresh'); 
                $('#cboUserWhatsAppNumber').val(response).selectpicker('refresh');
                
            }
            else {
                $('#cboUserMobileNumber').val('0').selectpicker('refresh'); 
                $('#cboUserWhatsAppNumber').val('0').selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });


}

function fnGridUserBusinessLocation() {

    fnOnChangeBusinessLocation();
    fnAddUserBusinessLocation();
   
    $.contextMenu({
        selector: "#btnUserBusinessLocation",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditUserBusinessLocation(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditUserBusinessLocation(event, 'view') } },
        }
     });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
   
    $("#jqgUserBusinessLocation").jqGrid('GridUnload');
    $("#jqgUserBusinessLocation").jqGrid({
        url: getBaseURL() + '/UserCreation/GetUserBusinessLocationByUserID?UserID=' + $('#txtUserId').val(),
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["UserID", "Business Key","", localization.ISDCode, localization.MobileNumber, localization.ISDCode, localization.WhatsAppNumber, localization.AllowMTFY, localization.Active, localization.Actions],
        colModel: [
            { name: "UserID", width: 20, editable: false, align: 'left', hidden: true },
            { name: "BusinessKey", width: 20, editable: false, align: 'left', hidden: true },
            { name: "PreferredLanguage", width: 20, editable: false, align: 'left', hidden: true }, 
            { name: "Isdcode", width: 100, editable: true, align: 'left', hidden: true },
            { name: "MobileNumber", width: 100, editable: true, align: 'left' },
            { name: "IsdcodeWan", width: 100, editable: true, align: 'left', hidden: true },
            { name: "WhatsappNumber", width: 100, editable: true, align: 'left' },  
            { name: "AllowMtfy", editable: false, width: 50, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "ActiveStatus", editable: false, width: 40, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
           
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnUserBusinessLocation"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        rowNum: 10,
        loadonce: true,
        pager: "#jqpUserBusinessLocation",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        multiselect: false,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true, caption:'User Business Location',
        loadComplete: function () {
            fnJqgridSmallScreen('jqgUserBusinessLocation');
           
        },

        onSelectRow: function (rowid, status, e) {
           
        },

        scrollOffset: 0
    }).jqGrid('navGrid', '#jqpUserBusinessLocation', { add: false, edit: false, search: false, del: false, refresh: false })
        .jqGrid('navButtonAdd', '#jqpUserBusinessLocation', {
            caption: '<span class="fa fa-sync" data-toggle="modal"></span> Refresh', buttonicon: 'none', id: 'btnGridRefreshUserBusinessLocation', position: 'last', onClickButton: fnGridRefreshUserBusinessLocation
        }).jqGrid('navButtonAdd', '#jqpUserBusinessLocation', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'btnAddUserBusinessLocation', position: 'first', onClickButton: fnAddUserBusinessLocation
        });
    fnAddGridSerialNoHeading();
}


function fnAddUserBusinessLocation() {
    fnClearLocationfields();
    $("#chkAllowMTFY").prop('disabled', false);
    $("#chklocationstatus").prop('disabled', false);
    $("input,textarea").attr('readonly', false);
    $("select").next().attr('disabled', false);
    $("#btnUserlocationsave").show();
    $("#btnUserlocationsave").html('Save');
    $("#cboBusinesskey").attr('disabled', false);
    $('#cboBusinesskey').selectpicker('refresh');
    $("#chklocationstatus").parent().addClass("is-checked");
}
function fnEditUserBusinessLocation(e, actiontype) {
   
    var rowid = $("#jqgUserBusinessLocation").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgUserBusinessLocation').jqGrid('getRowData', rowid);
    var _selectedRow = $("#" + rowid).offset();
    var firstRow = $("tr.ui-widget-content:first").offset();
    $(".ui-jqgrid-bdiv").animate({ scrollTop: _selectedRow.top - firstRow.top }, 700);
  
    $("#cboBusinesskey").val(rowData.BusinessKey).selectpicker('refresh');

    fnOnChangeBusinessLocation();
    $("#cboBusinesskey").attr('disabled', true);
    $('#cboBusinesskey').selectpicker('refresh');

    $("#cboPreferredLanguage").val(rowData.PreferredLanguage).selectpicker('refresh');
    $("#cboUserMobileNumber").val(rowData.Isdcode).selectpicker('refresh');
    $("#txtUserMobileNumber").val(rowData.MobileNumber);
    $("#cboUserWhatsAppNumber").val(rowData.IsdcodeWan).selectpicker('refresh');
    $("#txtUserWhatsAppNumber").val(rowData.WhatsappNumber);
    if (rowData.AllowMtfy === "true") {
        $("#chkAllowMTFY").parent().addClass("is-checked");
    }
    else { $("#chkAllowMTFY").parent().removeClass("is-checked"); }

    if (rowData.ActiveStatus === "true") {
        $("#chklocationstatus").parent().addClass("is-checked");
    }
    else { $("#chklocationstatus").parent().removeClass("is-checked"); }
 
    if (actiontype.trim() == "edit") {
        $("#chkAllowMTFY").prop('disabled', false);
        $("#chklocationstatus").prop('disabled', false);
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);
        $("#btnUserlocationsave").show();
        $("#btnUserlocationsave").html('Update');
    }

    if (actiontype.trim() == "view") {
        $("#chkAllowMTFY").prop('disabled', true);
        $("#chklocationstatus").prop('disabled', true);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnUserlocationsave").hide();
    }
}
function fnGridRefreshUserBusinessLocation() {
    $("#jqgUserBusinessLocation").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}
function fnClearLocationfields() {
    
    $("#cboBusinesskey").val('').selectpicker('refresh');
    $("#cboPreferredLanguage").val('0').selectpicker('refresh');
    $("#cboUserMobileNumber").val('0').selectpicker('refresh');
    $("#txtUserMobileNumber").val('');
    $("#cboUserWhatsAppNumber").val('0').selectpicker('refresh');
    $("#txtUserWhatsAppNumber").val('');
    $("#chklocationstatus").parent().removeClass("is-checked");
    $("#chkAllowMTFY").parent().removeClass("is-checked");
    $("#btnUserlocationsave").attr('disabled', false);
    $("#btnUserlocationsave").html('Save');
}
function fnUserSaveBusinessLocation() {
    
    if (IsStringNullorEmpty($("#txtUserId").val())) {
        fnAlert("w", "EEU_03_00", "UI0208", errorMsg.EnterUserIDFirst_E16);
        return;
    }
    if (IsStringNullorEmpty($("#cboBusinesskey").val()) || $("#cboBusinesskey").val() == '0' || $("#cboBusinesskey").val() == "0") {
        fnAlert("w", "EEU_03_00", "UI0064", errorMsg.BusinessLocation_E12);
        return;
    }
    if (IsStringNullorEmpty($("#cboPreferredLanguage").val()) || $("#cboPreferredLanguage").val() == '0' || $("#cboPreferredLanguage").val() == "0") {
        fnAlert("w", "EEU_03_00", "UI0203", errorMsg.PreferredLang_E23);
        return;
    }
    if (IsStringNullorEmpty($("#cboUserMobileNumber").val()) || $("#cboUserMobileNumber").val() == '0' || $("#cboUserMobileNumber").val() == "0") {
        fnAlert("w", "EEU_03_00", "UI0056", errorMsg.ISDCode_E5);
        return;
    }
    if (IsStringNullorEmpty($("#txtUserMobileNumber").val())) {
        fnAlert("w", "EEU_03_00", "UI0138", errorMsg.MobileNo_E6);
        return;
    }
    if (IsStringNullorEmpty($("#cboUserWhatsAppNumber").val()) || $("#cboUserWhatsAppNumber").val() == '0' || $("#cboUserWhatsAppNumber").val() == "0") {
        fnAlert("w", "EEU_03_00", "UI0244", errorMsg.Whatappisd_E24);
        return;
    }
    if (IsStringNullorEmpty($("#txtUserWhatsAppNumber").val())) {
        fnAlert("w", "EEU_03_00", "UI0245", errorMsg.Whatappisd_E25);
        return;
    }
    $("#btnUserlocationsave").attr('disabled', true);
    

    objloc = {
        UserID: $("#txtUserId").val(),
        BusinessKey: $("#cboBusinesskey").val(),
        PreferredLanguage: $("#cboPreferredLanguage").val(),
        Isdcode: $("#cboUserMobileNumber").val(),
        MobileNumber: $("#txtUserMobileNumber").val(),
        IsdcodeWan: $("#cboUserWhatsAppNumber").val(),
        WhatsappNumber: $("#txtUserWhatsAppNumber").val(),
        AllowMtfy: $("#chkAllowMTFY").parent().hasClass("is-checked"),
        ActiveStatus: $("#chklocationstatus").parent().hasClass("is-checked")
    };
    $.ajax({
        async: false,
        url: getBaseURL() + '/UserCreation/InsertOrUpdateUserBusinessLocation',
        type: 'POST',
        data: {obj: objloc},
        datatype: 'json',
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnUserlocationsave").attr('disabled', false);
                fnGridRefreshUserBusinessLocation();
                fnClearLocationfields();
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
             }
            $("#btnUserlocationsave").attr('disabled', false);
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnUserlocationsave").attr("disabled", false);
        }
    });
}

