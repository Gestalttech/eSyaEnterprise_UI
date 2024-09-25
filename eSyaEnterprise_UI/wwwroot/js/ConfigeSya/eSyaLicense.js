
$(document).ready(function () {
    fnLoadGrideSyaLicense();

    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btneSyaLicense",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditeSyaLicense(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditeSyaLicense(event, 'view') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.AddEdit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
});
var actiontype = "";

function fnLoadGrideSyaLicense() {

    $("#jqgeSyaLicense").GridUnload();

    $("#jqgeSyaLicense").jqGrid({
        url: getBaseURL() + '/ConfigeSya/License/GetLocationLicenseInfo?BusinessKey=' + $("#cboBusinessLocation").val(),
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.BusinessKey, localization.LocationDescription, localization.eBusinessKey, localization.eSyaLicenseType, localization.eUserLicenses, localization.eActiveUsers, localization.eNoOfBeds, localization.LicenseStatus, localization.Active, localization.Actions],
        colModel: [
            { name: "BusinessKey", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "LocationDescription", width: 80, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false },
            { name: "EBusinessKey", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "ESyaLicenseType", width: 80, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false },
            { name: "EUserLicenses", width: 80, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false },
            { name: "EActiveUsers", width: 80, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false, hidden: true },
            { name: "ENoOfBeds", width: 80, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false },
            { name: "Lstatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },

            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btneSyaLicense"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],

        pager: "#jqpeSyaLicense",
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
        forceFit: true, caption: localization.eSyaLicense,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgeSyaLicense");
        },

    }).jqGrid('navGrid', '#jqpeSyaLicense', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpeSyaLicense', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefresheSyaLicense
    });
    

    $(window).on("resize", function () {
        var $grid = $("#jqgeSyaLicense"),
            newWidth = $grid.closest(".Activitiescontainer").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}


function fnEditeSyaLicense(e, actiontype) {
  
    var rowid = $("#jqgeSyaLicense").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgeSyaLicense').jqGrid('getRowData', rowid);

    $("#txtBusinesskey").val(rowData.BusinessKey); 
    $("#cboLicenseType").val(rowData.ESyaLicenseType).selectpicker('refresh');
    $("#txteUserLicenses").val(rowData.EUserLicenses);
    $("#txteActiveUsers").val(rowData.EActiveUsers);
    $("#txteNoofBeds").val(rowData.ENoOfBeds);
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveeSyaLicense").attr("disabled", false);


    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "ECE_01_00", "UIC02", errorMsg.UnAuthorised_edit_E1);
            return;
        }
        $('#PopupeSyaLicense').modal('show');
        $('#PopupeSyaLicense').find('.modal-title').text(localization.UpdateeSyaLicense);
        $("#btnSaveeSyaLicense").html('<i class="fa fa-sync"></i>' + localization.Save);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveeSyaLicense").attr("disabled", false);        
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "ECE_01_00", "UIC03", errorMsg.UnAuthorised_view_E2);
            return;
        }
        $('#PopupeSyaLicense').modal('show');
        $('#PopupeSyaLicense').find('.modal-title').text(localization.VieweSyaLicense);
        $("#btnSaveeSyaLicense").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveeSyaLicense").hide();
        $("#chkActiveStatus").prop('disabled', true);        
        $("#PopupeSyaLicense").on('hidden.bs.modal', function () {
            $("#btnSaveeSyaLicense").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
  
}

function fnSaveeSyaLicense() {

    if ($("#txtBusinesskey").val() == 0 || $("#txtBusinesskey").val() == '0' || IsStringNullorEmpty($("#txtBusinesskey").val())) {
        fnAlert("w", "ECE_01_00", "UI0175", errorMsg.BusinessKey_E4);
        return;
    }
    if ($("#cboLicenseType").val() == 0 || $("#cboLicenseType").val() == '0' || IsStringNullorEmpty($("#cboLicenseType").val())) {
        fnAlert("w", "ECE_01_00", "UI0060", errorMsg.LicenseType_E5);
        return;
    }
    if ($("#txteUserLicenses").val() == 0 || $("#txteUserLicenses").val() == '0' || IsStringNullorEmpty($("#txteUserLicenses").val())) {
        fnAlert("w", "ECE_01_00", "UI0061", errorMsg.EnterUserLicense_E6);
        return;
    }
    //if ($("#txteActiveUsers").val() == 0 || $("#txteActiveUsers").val() == '0' || IsStringNullorEmpty($("#txteActiveUsers").val())) {
    //    fnAlert("w", "ECE_01_00", "UI0406", errorMSg.ActiveUsersRequired_E8);
    //    return;
    //}
    if ($("#txteNoofBeds").val() == 0 || $("#txteNoofBeds").val() == '0' || IsStringNullorEmpty($("#txteNoofBeds").val())) {
        fnAlert("w", "ECE_01_00", "UI0296", errorMsg.EnterNoofBeds_E7);
        return;
    }
    obj_esyaLicense = {
        BusinessKey: $("#txtBusinesskey").val(),
        EBusinessKey:'',
        ESyaLicenseType: $("#cboLicenseType").val(),
        EUserLicenses: $("#txteUserLicenses").val(),
        EActiveUsers: $("#txteActiveUsers").val(),
        ENoOfBeds: $("#txteNoofBeds").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSaveeSyaLicense").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/ConfigeSya/License/InsertOrUpdateLocationLicenseInfo',
        type: 'POST',
        datatype: 'json',
        data: {obj: obj_esyaLicense },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveeSyaLicense").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupeSyaLicense").modal('hide');
                fnClearFields();
                fnGridRefresheSyaLicense();
                location.reload();
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveeSyaLicense").attr("disabled", false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveeSyaLicense").attr("disabled", false);
        }
    });
}

function fnGridRefresheSyaLicense() {
    $("#jqgeSyaLicense").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {
    $("#chkActiveStatus").prop('disabled', false);
    $("#btnSaveeSyaLicense").attr("disabled", false);
    $("#btndeActiveeSyaLicense").attr("disabled", false);
    $("input,textarea").attr('readonly', false);
    $("#cboLicenseType").val('0').selectpicker('refresh');
    $("#txteUserLicenses").val('');
    $("#txteUserLicenses").val('');
    $("#txteNoofBeds").val('');
}

$("#btnCanceleSyaLicense").click(function () {
    $("#jqgeSyaLicense").jqGrid('resetSelection');
    $('#PopupeSyaLicense').modal('hide');
    fnClearFields();
});

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}
