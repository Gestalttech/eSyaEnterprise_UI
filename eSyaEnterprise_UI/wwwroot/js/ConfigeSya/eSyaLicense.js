
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
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditeSyaLicense(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});
var actiontype = "";
var _isInsert = true;

function fnLoadGrideSyaLicense() {

    $("#jqgeSyaLicense").GridUnload();

    $("#jqgeSyaLicense").jqGrid({
        //url: getBaseURL() + '/eSyaLicense/GetAlleSyaLicense',
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.BusinessKey, localization.eBusinessKey, localization.eSyaLicenseType, localization.eUserLicenses, localization.eActiveUsers, localization.eNoOfBeds, localization.Active, localization.Actions],
        colModel: [
            { name: "BusinessKey", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "eBusinessKey", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "eSyaLicenseType", width: 80, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false },
            { name: "eUserLicenses", width: 80, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false },
            { name: "eActiveUsers", width: 80, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false },
            { name: "eNoOfBeds", width: 80, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false },
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
    }).jqGrid('navButtonAdd', '#jqpeSyaLicense', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddeSyaLicense
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgeSyaLicense"),
            newWidth = $grid.closest(".Activitiescontainer").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddeSyaLicense() {
    _isInsert = true;
    if ($("#cboBusinessEntity").val() == 0 || $("#cboBusinessEntity").val() == '0' || IsStringNullorEmpty($("#cboBusinessEntity").val())) {
        fnAlert("w", "ECE_01_00", "UI0052", errorMsg.BusinessEntity_E1);
        return;
    }
    else {
    fnClearFields();
    $('#PopupeSyaLicense').modal('show');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $('#PopupeSyaLicense').find('.modal-title').text(localization.AddeSyaLicense);
    $("#btnSaveeSyaLicense").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveeSyaLicense").show();
    $("#btndeActiveeSyaLicense").hide();
    }
}

function fnEditeSyaLicense(e, actiontype) {
    var rowid = $("#jqgeSyaLicense").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgeSyaLicense').jqGrid('getRowData', rowid);
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveeSyaLicense").attr("disabled", false);

    _isInsert = false;

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "ECE_01_00", "UIC02", errorMsg.UnAuthorised_edit_E1);
            return;
        }
        $('#PopupeSyaLicense').modal('show');
        $('#PopupeSyaLicense').find('.modal-title').text(localization.UpdateeSyaLicense);
        $("#btnSaveeSyaLicense").html('<i class="fa fa-sync"></i>' + localization.Update);
        $("#btndeActiveeSyaLicense").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveeSyaLicense").attr("disabled", false);
        $("#cboLicenseType").val(rowData.eSyaLicenseType).selectpicker('refresh');
        $("#txteUserLicenses").val(rowData.eUserLicenses);
        $("#txteUserLicenses").val(rowData.eActiveUsers);
        $("#txteNoofBeds").val(rowData.eNoOfBeds);
        
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
        $("#btndeActiveeSyaLicense").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#cboLicenseType").val(rowData.eSyaLicenseType).selectpicker('refresh');
        $("#txteUserLicenses").val(rowData.eUserLicenses);
        $("#txteUserLicenses").val(rowData.eActiveUsers);
        $("#txteNoofBeds").val(rowData.eNoOfBeds);
        
        $("#PopupeSyaLicense").on('hidden.bs.modal', function () {
            $("#btnSaveeSyaLicense").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            fnAlert("w", "ECE_01_00", "UIC04", errorMsg.UnAuthorised_delete_E3);
            return;
        }
        $('#PopupeSyaLicense').modal('show');
        $('#PopupeSyaLicense').find('.modal-title').text(localization.ActivateDeactivateeSyaLicense);
        $("#btnSaveeSyaLicense").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveeSyaLicense").hide();

        if (rowData.ActiveStatus == 'true') {
            $("#btndeActiveeSyaLicense").html(localization.Deactivate);
        }
        else {
            $("#btndeActiveeSyaLicense").html(localization.Activate);
        }

        $("#btndeActiveeSyaLicense").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupeSyaLicense").on('hidden.bs.modal', function () {
            $("#btnSaveeSyaLicense").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

function fnSaveeSyaLicense() {

    if ($("#cboBusinessEntity").val() == 0 || $("#cboBusinessEntity").val() == '0' || IsStringNullorEmpty($("#cboBusinessEntity").val())) {
        fnAlert("w", "ECE_01_00", "UI0052", errorMsg.BusinessEntity_E1);
        return;
    }

    obj_esyaLicense = {
        BusinessKey: $("#cboBusinessEntity").val(),
        eBusinessKey:'',
        eSyaLicenseType: $("#cboLicenseType").val(),
        eUserLicenses: $("#txteUserLicenses").val(),
        eActiveUsers: $("#txteActiveUsers").val(),
        eNoOfBeds: $("#txteNoofBeds").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSaveeSyaLicense").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/eSyaLicense/InsertOrUpdateeSyaLicense',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: obj_esyaLicense },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveeSyaLicense").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupeSyaLicense").modal('hide');
                fnClearFields();
                fnGridRefresheSyaLicense();
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

function fnDeleteeSyaLicense() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btndeActiveeSyaLicense").attr("disabled", true);
    $.ajax({
       // url: getBaseURL() + '/eSyaLicense/ActiveOrDeActiveeSyaLicense?',
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btndeActiveeSyaLicense").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupeSyaLicense").modal('hide');
                fnClearFields();
                fnGridRefresheSyaLicense();
                $("#btndeActiveeSyaLicense").attr("disabled", false);
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btndeActiveeSyaLicense").attr("disabled", false);
                $("#btndeActiveeSyaLicense").html('De Activate');
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btndeActiveeSyaLicense").attr("disabled", false);
            $("#btndeActiveeSyaLicense").html('De Activate');
        }
    });
}