
var UserID;
var prevSelectedID;
var formID;
var BusinessKey;
var UserGroup;
var UserType;
var UserAuth;

$(document).ready(function () {
    fnGridLoadUserCreation();
    fnFillUserCreationValues();

    $("#dtEffectiveFrom").datepicker({
        dateFormat: _cnfDateFormat,
        onSelect: function (date) {
            var dpToDate = $('#dtEffectiveTill');
            var startDate = $(this).datepicker('getDate');
            var minDate = $(this).datepicker('getDate');
            dpToDate.datepicker('setDate', minDate);
            startDate.setDate(startDate.getDate() + 30);
            dpToDate.datepicker('option', 'minDate', minDate);
        }
    });

    $("#dtEffectiveTill").datepicker({
        dateFormat: _cnfDateFormat,
    });

    $('#txtSearch').keyup(function () {
        var searchString = $(this).val();
        $('#jstUserGroup').jstree('search', searchString);
    });

    $("#dvForm").hide();
    $("#divUserCreationForm").css('display', 'none');
    $("#divUserCreationGrid").show();

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
    if ($("#txtUserAuthetication").val() == 0)
        var URL = getBaseURL() + '/UserCreation/GetUserMaster';
    else
        var URL = getBaseURL() + '/UserCreation/GetUserMasterForUserAuthentication';

    $("#jqgUserCreation").jqGrid('GridUnload');
    $("#jqgUserCreation").jqGrid({
        url: URL,
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["User ID", localization.LoginID, localization.LoginDescription, localization.MobileNumber, localization.LastActivityDate, localization.Active, localization.Actions],
        colModel: [
            { name: "UserID", width: 120, editable: true, align: 'left', hidden: true },
            { name: "LoginID", width: 120, editable: true, align: 'left', hidden: false },
            { name: "LoginDesc", width: 300, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "MobileNumber", width: 100, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 50 } },
            {
                name: 'LastActivityDate', index: 'LastActivityDate', width: 80, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            { name: "ActiveStatus", editable: false, width: 40, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            //{
            //    name: 'Edit', search: false, align: 'left', width: 170, sortable: false, resizable: false,
            //    formatter: function (cellValue, options, rowdata, action) {
            //        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditUserCreation(event)"><i class="fas fa-pen"></i> ' + localization.Edit + ' </button>'

            //    }
            //}
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
        loadonce: true,
        rownumWidth:55,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        forceFit: true,
        width: 'auto',
        autowidth: true, caption:'User Creation',
        //onSelectRow: function (rowid) {
        //    UserID = $("#jqgUserCreation").jqGrid('getCell', rowid, 'UserID');

        //},
        loadComplete: function (data) {
            SetGridControlByAction();
            fnAddGridSerialNoHeading();
            fnJqgridSmallScreen("jqgUserCreation");
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

        shrinkToFit: true,
        scrollOffset: 0
    }).
        jqGrid('navGrid', '#jqpUserCreation', { add: false, edit: false, search: true, searchtext: 'Search', del: false, refresh: false }, {}, {}, {}, {
            closeOnEscape: true,
            caption: "Search...",
            multipleSearch: true,
            Find: "Find",
            Reset: "Reset",
            odata: [{ oper: 'eq', text: 'Match' }, { oper: 'cn', text: 'Contains' }, { oper: 'bw', text: 'Begins With' }, { oper: 'ew', text: 'Ends With' }],
        }).jqGrid('navButtonAdd', '#jqpUserCreation', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnGridAddUserCreation
        }).
        jqGrid('navButtonAdd', '#jqpUserCreation', {
            caption: '<span class="fa fa-sync" data-toggle="modal"></span> Refresh', buttonicon: 'none', id: 'btnGridRefresh', position: 'last', onClickButton: fnGridRefreshUserCreation
        });

        //jqGrid('navGrid', '#jqpUserCreation', { add: false, edit: false, search: true, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpUserCreation', {
        //caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshUserCreation
        //}).jqGrid('navButtonAdd', '#jqpUserCreation', {
        //    caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnGridAddUserCreation
        //});
    fnAddGridSerialNoHeading();
}

function SetGridControlByAction() {
    if ($("#txtUserAuthetication").val() == 1)
        $('#jqgAdd').addClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
    if (_userFormRole.IsEdit === false) {
        var eleDisable = document.querySelectorAll('#jqgEdit');
        for (var i = 0; i < eleDisable.length; i++) {
            eleDisable[i].disabled = true;
            eleDisable[i].className = "ui-state-disabled";
        }
    }
}

function fnGridRefreshUserCreation() {
    $("#jqgUserCreation").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnGridAddUserCreation() {
    $('#txtUserId').val(''); 
    $('#txtLoginId').val('');
    $('#txtLoginDescription').val('');
    $('#txtPassword').val('');
    $('#cboMobileNo').val("0");
    $('#cboMobileNo').selectpicker('refresh');
    $('#txtMobileNo').val('');
    $('#txtemailid').val('');
    $("#chkAllowMobileLogin").parent().removeClass("is-checked");
    $("#chkIsApprover").parent().removeClass("is-checked");
    $('#Photoimage').val('');
    $('#DSimage').val('');
    $('#imgPhotoimageblah').removeAttr('src');
    $('#imgDSimageblah').removeAttr('src');

    fnGridUserSegment();
    $("#jqgUserBusinessSegment").trigger('reloadGrid');
    UserID = 0;
    
    //location.href = getBaseURL() + "/eSyaUser/UserCreation/_UserCreation?UserID=" + UserID;
    $("#divUserCreationForm").css('display', 'block');
    $("#divUserCreationGrid").hide();
    $("#txtPassword").attr('disabled', false);
    $("#txtLoginId").attr('disabled', false);
    $("#jqBusinessSegmentDiv").hide();
    $('#cboDoctor').val("0");
    $('#cboDoctor').selectpicker('refresh');
    $("#chkIsDoctor").parent().removeClass("is-checked"); 
    $("#divcboDoctors").hide();
} 

function fnEditUserCreation(e) {
    var rowid = $("#jqgUserCreation").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgUserCreation').jqGrid('getRowData', rowid);
    UserID = rowData.UserID;
        
    $("#txtUserId").val(UserID);
    if (UserID !== '' && UserID !== undefined) {
        $("#divUserCreationForm").css('display', 'block');
        $("#divUserCreationGrid").hide();
        $("#txtPassword").attr('disabled', true);
        $("#txtLoginId").attr('disabled', true);
        $("#jqBusinessSegmentDiv").show();
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EEU_03_00", "UIC02", errorMsg.editauth_E2);
            fnCancelUserMaster();
            return;
        }

        fnFillUserCreationValues();
        //location.href = getBaseURL() + "/eSyaUser/UserCreation/_UserCreation?UserID=" + UserID;
    }
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
                $('#txtPassword').val(result.Password);
                $("#cboMobileNo").val(result.ISDCode);
                $("#cboMobileNo").selectpicker('refresh');
                $("#cboMobileNo").trigger("change");
                $('#txtMobileNo').val(result.MobileNumber);
                $('#txtemailid').val(result.eMailID);
                
                if (result.AllowMobileLogin === true) {
                    
                    $("#chkAllowMobileLogin").parent().addClass("is-checked");
                }
                else {
                    $("#chkAllowMobileLogin").parent().removeClass("is-checked");
                }
                if (result.IsApprover === true) {

                    $("#chkIsApprover").parent().addClass("is-checked");
                }
                else {
                    $("#chkIsApprover").parent().removeClass("is-checked");
                }
                if (result.IsDoctor === true) {

                    $("#chkIsDoctor").parent().addClass("is-checked");
                    $("#cboDoctor").val(result.DoctorId);
                    $("#cboDoctor").selectpicker('refresh');
                    $("#divcboDoctors").show();
                }
                else {
                    $("#chkIsDoctor").parent().removeClass("is-checked");
                    $("#divcboDoctors").hide();
                    $('#cboDoctor').val("0");
                    $('#cboDoctor').selectpicker('refresh');
                }
                //$("#cboDoctor").val(result.DoctorId);
                //$("#cboDoctor").selectpicker('refresh');
                if (result.userimage !== null && result.userimage !== "") {
                    document.getElementById('imgPhoto').innerHTML = '<img id="imgPhotoimageblah" src=" ' + result.userimage + '"  alt=" &nbsp; User Image"   /> <input class="fileInput" id="FileUpload1" type="file" name="file" onchange="readPhotoimage(this);" accept="image/*" enctype="multipart/form-data" />';
                }


                if (result.DSimage !== null && result.DSimage !== "") {
                    document.getElementById('imgDS').innerHTML = '<img id="imgDSimageblah" src=" ' + result.DSimage + '"  alt="User Signature"  /> <input class="fileInput" id="DSimage" type="file" name="file" onchange="readDSimage(this);" accept="image/*" enctype="multipart/form-data" />';
                }
            }
        });
    }

    fnGridUserSegment();
}

function fnCancelUserMaster() {
    $("#jqgUserCreation").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
    $("#divUserCreationForm").css('display', 'none');
    $("#divUserCreationGrid").show();
//    $('#txtUserId').val('');
}

function fnClearUserMaster() {
   /* $('#txtLoginId').val('');*/
    $('#txtLoginDescription').val('');
    $('#txtPassword').val('');
    $('#cboMobileNo').val("0");
    $('#cboMobileNo').selectpicker('refresh');
    $('#txtMobileNo').val('');
    $('#txtemailid').val('');
    $("#chkAllowMobileLogin").parent().removeClass("is-checked");
    $("#chkIsApprover").parent().removeClass("is-checked");
    $("#jqgUserBusinessSegment").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
    $("#jqBusinessSegmentDiv").hide();
    $("#txtPassword").attr('disabled', false);
    $("#chkIsDoctor").parent().removeClass("is-checked");
    $('#cboDoctor').val("0");
    $('#cboDoctor').selectpicker('refresh');
    $("#divcboDoctors").hide();
    $('#Photoimage').val('');
    $('#DSimage').val('');

    $('#imgPhotoimageblah').removeAttr('src');
    $('#imgDSimageblah').removeAttr('src');
}

function fnValidateUserMaster() {
    var PasswordPattern = new RegExp("((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@@#$%!&*]).{8,20})");

    var EmailPattern = /^\w+([-+.'][^\s]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

    if ($("#txtLoginId").val().trim().length <= 0) {
        fnAlert("w", "EEU_03_00", "UI0133", errorMsg.LoginID_E1);
        return false;
    }
    if ($("#txtLoginDescription").val().trim().length <= 0) {
        fnAlert("w", "EEU_03_00", "UI0134", errorMsg.LoginDesc_E3); 
        return false;
    }
    if ($("#txtPassword").val().trim().length <= 0) {
        fnAlert("w", "EEU_03_00", "UI0136", errorMsg.Password_E4);
        return false;
    }
    if ($("#cboMobileNo").val() === "0" || $("#cboMobileNo").val() === "") {
        fnAlert("w", "EEU_03_00", "UI0137", errorMsg.ISD_E5);
        $('#cboMobileNo').focus();
        return false;
    }
    if ($("#txtMobileNo").val().trim().length <= 0) {
        fnAlert("w", "EEU_03_00", "UI0138", errorMsg.MobileNo_E6);
        return false;
    }
    if ($("#txtemailid").val().trim().length <= 0) {
        fnAlert("w", "EEU_03_00", "UI0139", errorMsg.EmailID_E7);
        return false;
    }
    if (!EmailPattern.test($("#txtemailid").val())) {
       fnAlert("w", "EEU_03_00", "UI0140", errorMsg.ValidEmailID_E8);
        return false;
    }
    if (!PasswordPattern.test($("#txtPassword").val())) {
        fnAlert("w", "EEU_03_00", "UI0097", errorMsg.PasswordStatement_E10);
        return false;
    }
    var isdoc = $("#chkIsDoctor").parent().hasClass('is-checked');
    if (isdoc == true)
    {
        if ($("#cboDoctor").val() === "0" || $("#cboDoctor").val() === "") {
            fnAlert("w", "EEU_03_00", "UI0141", errorMsg.SelectDoctor_E9);
            $('#cboDoctor').focus();
            return false;
        }
    }
    if (isdoc == false) {
        $('#cboDoctor').val("0");
        $('#cboDoctor').selectpicker('refresh');

    }
}
 
function fnSaveUserMaster() {
    var file = '';
    var DSfile = '';

    if (fnValidateUserMaster() === false) {
        return;
    }
  
    $("#btnSaveUserMaster").attr('disabled', true);
    if ($('#imgPhoto img').attr('src') !==undefined) {

         file = ($('#imgPhoto img').attr('src').indexOf('TakePicture.jpg') > 0) ? null : $('#imgPhoto img').attr('src');// Data URI
    }
    if ($('#imgDS img').attr('src') !==undefined) {

         DSfile = ($('#imgDS img').attr('src').indexOf('TakePicture.jpg') > 0) ? null : $('#imgDS img').attr('src');// Data URI
    }
    var userId = $("#txtUserId").val();
    var userMaster;
    if (userId === null || userId === "") {
        $("#btnSaveUserMaster").attr('disabled', true);
        userMaster = {
            LoginID: $("#txtLoginId").val(),
            UserID: 0,
            LoginDesc: $("#txtLoginDescription").val(),
            Password: $("#txtPassword").val(),
            ISDCode: $("#cboMobileNo").val(),
            MobileNumber: $("#txtMobileNo").val(),
            AllowMobileLogin: $("#chkAllowMobileLogin").parent().hasClass("is-checked"),
            IsApprover: $("#chkIsApprover").parent().hasClass("is-checked"),
            eMailID: $("#txtemailid").val(),
            Authenticated: $("#txtUserAuthetication").val(),
            IsDoctor: $("#chkIsDoctor").parent().hasClass("is-checked"),
            DoctorId: $("#cboDoctor").val(),
        };
    }
    else {
        userMaster = {
            LoginID: $("#txtLoginId").val(),
            UserID: $("#txtUserId").val(),
            LoginDesc: $("#txtLoginDescription").val(),
            Password: $("#txtPassword").val(),
            ISDCode: $("#cboMobileNo").val(),
            MobileNumber: $("#txtMobileNo").val(),
            AllowMobileLogin: $("#chkAllowMobileLogin").parent().hasClass("is-checked"),
            IsApprover: $("#chkIsApprover").parent().hasClass("is-checked"),
            eMailID: $("#txtemailid").val(),
            Authenticated: $("#txtUserAuthetication").val(),
            IsDoctor: $("#chkIsDoctor").parent().hasClass("is-checked"),
            DoctorId: $("#cboDoctor").val(),
        };
    }

    $.ajax({
        async: false,
        url: getBaseURL() + '/UserCreation/InsertOrUpdateUserMaster',
        type: 'POST',
        data: {
            userMaster: userMaster,
            file: file,
            DSfile: DSfile
        },
        datatype: 'json',
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveUserMaster").attr('disabled', true);
                $("#btnSaveUserMaster").hide();
                $("#txtUserId").val(response.ID);
                UserID = $("#txtUserId").val();
                $("#jqBusinessSegmentDiv").show();
                fnGridUserSegment();
                //$("#jqBusinessSegmentDiv").show();
                $("#txtPassword").attr('disabled', false);
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
            }
            $("#btnSaveUserMaster").attr('disabled', false);
            $("#btnSaveUserMaster").show();
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveUserMaster").attr("disabled", false);
        }
    }); 
}

function fnGridUserSegment() {

    var UserID = $("#txtUserId").val();
    if (UserID == null || UserID == "") {
        UserID = 0;
    }
    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnUserBusinessSegment",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditBusinessSegment(event) } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnViewBusinessSegment(event) } },
            jqgDelete: { name: localization.UserRole, icon: "delete", callback: function (key, opt) { fnAddMenuLink(event) } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-bars'></i>" + localization.UserRole + " </span>");

    var URL = getBaseURL() + '/UserCreation/GetUserBusinessLocation?UserID=' + UserID;
    $("#jqgUserBusinessSegment").jqGrid('GridUnload');
    $("#jqgUserBusinessSegment").jqGrid({
        url: URL,
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["IU Status", "Business Key", localization.LocationDescription,localization.AllowMFY, localization.Active, localization.Actions],
        colModel: [
            { name: "IUStatus", width: 20, editable: false, align: 'left', hidden: true },
            { name: "BusinessKey", width: 20, editable: false, align: 'left', hidden: true },
            { name: "LocationDescription", width: 100, editable: true, align: 'left' },
            { name: "AllowMTFY", editable: false, width: 40, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "ActiveStatus", editable: false, width: 40, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
           
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnUserBusinessSegment"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        rowNum: 10,
        loadonce: true,
        pager: "#jqpUserBusinessSegment",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        multiselect: false,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true, caption:'User Business Segment',
        loadComplete: function () {
            fnJqgridSmallScreen('jqgUserBusinessSegment');
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

        scrollOffset: 0
    }).jqGrid('navGrid', '#jqpUserBusinessSegment', { add: false, edit: false, search: false, del: false, refresh: false });
    $("#jqgUserBusinessSegment").jqGrid('inlineNav', '#jqpUserBusinessSegment',
        {
            edit: false,
            editicon: " fa fa-pen",
            edittext: "Edit",
            add: false,
            addicon: "fa fa-plus",
            addtext: "Add",
            save: true,
            savetext: "  Save ",
            saveicon: "fa fa-save",
            cancelicon: "fa fa-ban",
            canceltext: "  Cancel ",
            editParams: {
                keys: false,
                oneditfunc: function (formid) {

                    $("#" + formid + "_LanguageCode").prop('disabled', true);
                    $("#" + formid + "_TableCode").prop('disabled', true);
                },
                url: null,

                extraparam: {

                },

                successfunc: function (result) {
                },
                aftersavefunc: null,
                errorfun: null,
                afterrestorefun: null,
                restoreAfterError: true,
                mtype: "POST"
            },
            addParams: {
                useDefValues: true,
                position: "last",
                addRowParams: {
                    keys: true,
                    url: null,
                    extraparam: {

                    },

                    oneditfunc: function (rowid) {

                    },
                    successfunc: function (result) {
                    }
                }
            }
        });
}

function fnGridRefreshUserBL() {
    $("#jqgUserBusinessSegment").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnEditBusinessSegment(e) {
    var rowid = $("#jqgUserBusinessSegment").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgUserBusinessSegment').jqGrid('getRowData', rowid);
    $("#PopupBusinessSegment").modal('show');
    $("#PopupBusinessSegment").find('.modal-title').text(localization.EditBusinessSegment);

    $('#txtIUStatus').val(rowData.IUStatus);
    $('#txtBusinessKey').val(rowData.BusinessKey);
    $('#txtLocationDescription').val(rowData.LocationDescription);
    $("#txtLocationDescription").attr('disabled', true);
    if (rowData.AllowMTFY === "true") {
        $("#chkIsMultiSegmentApplicable").parent().addClass("is-checked");
    }
    else { $("#chkIsMultiSegmentApplicable").parent().removeClass("is-checked"); }
    
    $("#chkActiveStatus").parent().addClass("is-checked");

    $("input[type=checkbox]").attr('disabled', false);

    $("#PopupBusinessSegment").on('hidden.bs.modal', function () {
        $("input[type=checkbox]").attr('disabled', true);
        $("#chkAllowMobileLogin").attr('disabled', false);
    });

    $("#btnSaveBusinessSegment").attr('disabled', false);

}

function fnViewBusinessSegment(e) {
    var rowid = $("#jqgUserBusinessSegment").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgUserBusinessSegment').jqGrid('getRowData', rowid);
    $("#PopupBusinessSegment").modal('show');
    $("#PopupBusinessSegment").find('.modal-title').text(localization.ViewBusinessSegment);

    $('#txtIUStatus').val(rowData.IUStatus);
    $('#txtBusinessKey').val(rowData.BusinessKey);
    $('#txtLocationDescription').val(rowData.LocationDescription);
    if (rowData.AllowMTFY === "true") {
        $("#chkIsMultiSegmentApplicable").parent().addClass("is-checked");
    }
    else { $("#chkIsMultiSegmentApplicable").parent().removeClass("is-checked"); }

    if (rowData.ActiveStatus === "true") {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else { $("#chkActiveStatus").parent().removeClass("is-checked"); }

    $("#btnSaveBusinessSegment").hide();
    $("input,textarea").attr('readonly', true);
    $("select").next().attr('disabled', true);
    $("input[type=checkbox]").attr('disabled', true);
    $("#PopupBusinessSegment").on('hidden.bs.modal', function () {
        $("#btnSaveBusinessSegment").show();
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);
    });
}

function fnValidateBusinessLocation() {
    if ($("#txtUserId").val().trim().length <= 0) {
        fnAlert("w", "EEU_03_00", "UI0133", errorMsg.LoginID_E11);
        return false;
    }
    if ($("#txtBusinessKey").val().trim().length <= 0) {
        fnAlert("w", "EEU_03_00", "UI0064", errorMsg.BusinessLocation_E12);
        return false;
    }
    if ($("#txtLocationDescription").val().trim().length <= 0) {
        fnAlert("w", "EEU_03_00", "UI0053", errorMsg.LocationDesc_E13);
        return false;
    }
}

function fnSaveUserBusinessLocation() {

    if (fnValidateBusinessLocation() === false) {
        return;
    }

    var userBL;
    var IsMltSeg = $("#chkIsMultiSegmentApplicable").parent().hasClass("is-checked");

    $("#btnSaveBusinessSegment").attr('disabled', true);

    userBL = {
        IUStatus: $("#txtIUStatus").val(),
        UserID: $("#txtUserId").val(),
        BusinessKey: $("#txtBusinessKey").val(),
        AllowMTFY: IsMltSeg,
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    }
   

    $.ajax({
        async: false,
        url: getBaseURL() + '/UserCreation/InsertOrUpdateUserBL',
        type: 'POST',
        data: {
            UserBusinessLink: userBL
        },
        datatype: 'json',
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveBusinessSegment").attr('disabled', true);
                $("#btnSaveBusinessSegment").hide();
                $("#PopupBusinessSegment").modal('hide');
                fnGridRefreshUserCreation();
                $("#jqBusinessSegmentDiv").show(200);
                fnGridUserSegment();
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
            }
            $("#btnSaveBusinessSegment").attr('disabled', false);
            $("#btnSaveBusinessSegment").show();
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveBusinessSegment").attr("disabled", false);
        }
    });
}

// User Menu and User Action

$("#PopupMenuLink").on("hidden.bs.modal", function () {
    $("#dvForm").hide();
})

function fnGridRefreshFormAction() {
    $("#jqgFormAction").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnAddMenuLink(e) {
    var rowid = $("#jqgUserBusinessSegment").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgUserBusinessSegment').jqGrid('getRowData', rowid);

    BusinessKey = rowData.BusinessKey;
    UserID = $("#txtUserId").val();

    if (BusinessKey <= 0) {
        fnAlert("w", "EEU_03_00", "UI0142", errorMsg.LinkBusinessLocation_E14);
        return;
    }
   
    $("#PopupUserRoleMenuLink").modal('show');
    fnGridLoadUserRoleMenuLink(UserID, BusinessKey);
    $("#chkUserRoleActiveStatus").parent().addClass("is-checked");
    $("#chkUserRoleActiveStatus").prop('disabled', true);

    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnUserRoleSegmentbusinesskey",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditUserRoleMenuLink(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditUserRoleMenuLink(event, 'view') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
}




//New User Role MenuLink functionality

var _isInsert = true;

function fncboUserGroup_change() {
    BindUserType();
    BindUserRole();
}

function BindUserType() {
    
    $("#cboUserType").empty();
    $("#cboUserRole").empty();
   
    $.ajax({
        url: getBaseURL() + '/UserCreation/GetUserTypesbyUserGroup?usergroup=' + $("#cboUserGroup").val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        },
        success: function (response, data) {

            //refresh each time 
            $("#cboUserType").empty();
            $("#cboUserRole").empty();
            $("#cboUserType").append($("<option value='0'> Select </option>"));
            for (var i = 0; i < response.length; i++) {

                $("#cboUserType").append($("<option></option>").val(response[i]["UserTypeId"]).html(response[i]["UserTypeDesc"]));
            }
            $('#cboUserType').selectpicker('refresh');

        },
        async: false,
        processData: false
    });


}

function fncboUserType_change() {
    BindUserRole();
    
}

function BindUserRole() {

    $("#cboUserRole").empty();
    $.ajax({

        url: getBaseURL() + '/UserCreation/GetUserRolesbyUserType?usergroup=' + $('#cboUserGroup').val() + "&usertype=" + $('#cboUserType').val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        },
        success: function (response, data) {

            //refresh each time 
            $("#cboUserRole").empty();
            $("#cboUserRole").append($("<option value='0'> Select </option>"));
            for (var i = 0; i < response.length; i++) {

                $("#cboUserRole").append($("<option></option>").val(response[i]["UserRoleId"]).html(response[i]["UserRoleDesc"]));
            }
            $('#cboUserRole').selectpicker('refresh');
        },

        async: false,
        processData: false
    });
}

function fnGridLoadUserRoleMenuLink(UserID, BusinessKey) {

    $("#txtUserRoleSegmentbusinesskey").val(BusinessKey);

    $("#jqgUserRoleMenuLink").GridUnload();

    $("#jqgUserRoleMenuLink").jqGrid({
        url: getBaseURL() + '/UserCreation/GetUserRoleMenuLinkbyUserId?UserID=' + UserID + '&BusinessKey=' + BusinessKey,
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.UserID, localization.BusinessKey, localization.UserGroup, localization.UserGroup, localization.UserType, localization.UserType, localization.UserRole, localization.UserRole, localization.EffectiveFrom, localization.EffectiveTill, localization.Active, localization.Actions],
        colModel: [
            { name: "UserId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "BusinessKey", width: 50, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "UserGroup", width: 40, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "UserGroupDesc", width: 120, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: false },
            { name: "UserType", width: 40, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "UserTypeDesc", width: 120, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: false },
            { name: "UserRole", width: 40, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "UserRoleDesc", width: 120, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: false },
            {
                name: 'EffectiveFrom', index: 'FromDate', width: 90, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            {
                name: 'EffectiveTill', index: 'FromDate', width: 90, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            { name: "ActiveStatus", width: 50, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            //{
            //    name: 'edit', search: false, align: 'left', width: 130, sortable: false, resizable: false,
            //    formatter: function (cellValue, options, rowdata, action) {
            //        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditUserRoleMenuLink(event,\'edit\');"><i class="fas fa-pen"></i> ' + localization.Edit + '</button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return fnEditUserRoleMenuLink(event,\'view\');"><i class="far fa-eye"></i>' + localization.View + '</button>'
            //            // + '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Delete" id="jqgDelete" onclick="return fnEditUserRoleMenuLink(event,\'delete\');"><i class="fas fa-trash"></i>' + localization.Delete + '</button>'
            //    }
            //},
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnUserRoleSegmentbusinesskey"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jpgUserRoleMenuLink",
        rowNum: 5,
        rowList: [5, 10, 15, 20],
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
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jpgUserRoleMenuLink");
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

    }).jqGrid('navGrid', '#jpgUserRoleMenuLink', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jpgUserRoleMenuLink', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshUserRoleMenuLink
        }).jqGrid('navButtonAdd', '#jpgUserRoleMenuLink', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddUserRoleMenuLink
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgUserRoleMenuLink"),
            newWidth = $grid.closest(".ui-jqgrid").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnGridRefreshUserRoleMenuLink() {
    $("#jqgUserRoleMenuLink").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {

    $('#cboUserGroup').val('0').selectpicker('refresh');
    $("#cboUserGroup").next().attr('disabled', false);
    $('#cboUserType').val('0').selectpicker('refresh');
    $("#cboUserType").next().attr('disabled', false);
    $('#cboUserRole').val('0').selectpicker('refresh');
    $("#cboUserRole").next().attr('disabled', false);
    $("#dtEffectiveFrom").val('');
    $("#dtEffectiveFrom").prop('disabled', false);
    $("#dtEffectiveTill").val('');
    $("#dtEffectiveTill").prop('disabled', false);
    $("#chkUserRoleActiveStatus").prop('disabled', false);
    $("#btnSaveUserRoleMenuLink").attr("disabled", false);
}

$("#btnCancelUserRoleMenuLink").click(function () {
    $("#jqgUserRoleMenuLink").jqGrid('resetSelection');
    $('#PopupUserRoleMenuLink').modal('hide');
    fnClearFields();
});

function fnAddUserRoleMenuLink() {
  
    if (IsStringNullorEmpty($("#txtUserRoleSegmentbusinesskey").val())) {
        fnAlert("w", "EEU_03_00", "UI0143", errorMsg.LinkBusinessToAdd_E15);
        return;
    }
    else {
        fnClearFields();
        $("#chkUserRoleActiveStatus").parent().addClass("is-checked");
        $("#chkUserRoleActiveStatus").prop('disabled', true);
        $("#btnSaveUserRoleMenuLink").html('<i class="fa fa-save"></i>' + localization.Save);
        _isInsert = true;

    }
}

function fnEditUserRoleMenuLink(e, actiontype) {
    
    _isInsert = false;
    
    var rowid = $("#jqgUserRoleMenuLink").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgUserRoleMenuLink').jqGrid('getRowData', rowid);
    $('#cboUserGroup').val(rowData.UserGroup).selectpicker('refresh');
    $("#cboUserGroup").next().attr('disabled', true);
    BindUserType();
    $('#cboUserType').val(rowData.UserType).selectpicker('refresh');
    $("#cboUserType").next().attr('disabled', true);
    BindUserRole();
    $('#cboUserRole').val(rowData.UserRole).selectpicker('refresh');
    $("#cboUserRole").next().attr('disabled', true);
    //$('#dtEffectiveFrom').val(rowData.EffectiveFrom);
    if (rowData.EffectiveFrom !== null) {
        setDate($('#dtEffectiveFrom'), fnGetDateFormat(rowData.EffectiveFrom));
    }
    else {
        $('#dtEffectiveFrom').val('');
    }
    $("#dtEffectiveFrom").prop('disabled', true);

    if (rowData.EffectiveTill !== null) {
        setDate($('#dtEffectiveTill'), fnGetDateFormat(rowData.EffectiveTill));
    }
    else {
        $('#dtEffectiveTill').val('');
    }
    //$('#dtEffectiveTill').val(rowData.EffectiveTill);
    
    if (rowData.ActiveStatus == 'true') {
        $("#chkUserRoleActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkUserRoleActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveUserRoleMenuLink").attr('disabled', false);
    if (actiontype.trim() == "edit") {
        $("#chkUserRoleActiveStatus").prop('disabled', false);
        $("#dtEffectiveTill").prop('disabled', false);
        $("#btnSaveUserRoleMenuLink").html('Update').show();
    }
    if (actiontype.trim() == "view") {
        $("#btnSaveUserRoleMenuLink").hide();
        $("#chkUserRoleActiveStatus").prop('disabled', true);
        $("#dtEffectiveTill").prop('disabled', true);
    }

}

function fnSaveUserRoleMenuLink() {
    if (IsStringNullorEmpty($("#txtUserId").val()) || $("#txtUserId").val() == '0') {
        fnAlert("w", "EEU_03_00", "UI0144", errorMsg.UserIDNotExists_E16);
        return;
    }
    if (IsStringNullorEmpty($("#txtUserRoleSegmentbusinesskey").val()) || $("#txtUserRoleSegmentbusinesskey").val() == '0') {
        fnAlert("w", "EEU_03_00", "UI0145", errorMsg.SegmentBusinessKeyNotExists_E17);
        return;
    }
    if (IsStringNullorEmpty($("#cboUserGroup").val()) || $("#cboUserGroup").val()=='0') {
        fnAlert("w", "EEU_03_00", "UI0130", errorMsg.SelectUserGroup_E18);
        return ;
    }
    if (IsStringNullorEmpty($("#cboUserType").val()) || $("#cboUserType").val() == '0') {
        fnAlert("w", "EEU_03_00", "UI0131", errorMsg.SelectUserType_E19);
        return;
    }
    if (IsStringNullorEmpty($("#cboUserRole").val()) || $("#cboUserRole").val() == '0') {
        fnAlert("w", "EEU_03_00", "UI0132", errorMsg.SelectUserRole_E20);
        return;
    }
    if (IsStringNullorEmpty($("#dtEffectiveFrom").val())) {
        fnAlert("w", "EEU_03_00", "UI0146", errorMsg.EffectiveFrom_E21);
        return;
    }
    var objrolelink = {
        UserId: $("#txtUserId").val(),
        BusinessKey: $("#txtUserRoleSegmentbusinesskey").val(),
        UserGroup: $("#cboUserGroup").val(),
        UserType: $("#cboUserType").val(),
        UserRole: $("#cboUserRole").val(),
        EffectiveFrom: getDate($("#dtEffectiveFrom")), 
        EffectiveTill: getDate($("#dtEffectiveTill")), 
        ActiveStatus: $("#chkUserRoleActiveStatus").parent().hasClass("is-checked")
    }
    $("#btnSaveUserRoleMenuLink").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/UserCreation/InsertOrUpdateUserRoleMenuLink',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: objrolelink },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveUserRoleMenuLink").attr('disabled', false);
                fnClearFields()
                fnGridRefreshUserRoleMenuLink();
                
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveUserRoleMenuLink").attr('disabled', false);
            }

        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveUserRoleMenuLink").attr("disabled", false);
        }
    });
}   
