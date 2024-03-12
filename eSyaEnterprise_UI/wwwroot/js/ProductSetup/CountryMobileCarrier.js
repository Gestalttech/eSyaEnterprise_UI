$(document).ready(function () {
    fnLoadGridCountryMobileCarrier();

    $.contextMenu({
        selector: "#btnCountryMobileCarrier",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditCountryMobileCarrier(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditCountryMobileCarrier(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditCountryMobileCarrier(event, 'delete') } },
        }
     });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});
var actiontype = "";
var _isInsert = true;

function fnLoadGridCountryMobileCarrier() {

    $("#jqgCountryMobileCarrier").GridUnload();

    $("#jqgCountryMobileCarrier").jqGrid({
        url: getBaseURL() + '/Country/GetMobileCarriers',
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.ISDCode, localization.MobilePrefix, localization.MobileNoDigit, localization.Active, localization.Actions],
        colModel: [
            { name: "Isdcode", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "MobilePrefix", width:80, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false },
            { name: "MobileNoDigit", width:80, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },

            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnCountryMobileCarrier"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],

        pager: "#jqpCountryMobileCarrier",
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
        forceFit: true, caption: localization.CountryMobileCarrier,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgCountryMobileCarrier");
        },
        onSelectRow: function (rowid, status, e) {
        },
    }).jqGrid('navGrid', '#jqpCountryMobileCarrier', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpCountryMobileCarrier', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshCountryMobileCarrier
    }).jqGrid('navButtonAdd', '#jqpCountryMobileCarrier', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddCountryMobileCarrier
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgCountryMobileCarrier"),
            newWidth = $grid.closest(".Activitiescontainer").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}
function fnAddCountryMobileCarrier() {
    _isInsert = true;
    fnClearFields();
    $('#PopupCountryMobileCarrier').modal('show');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $('#PopupCountryMobileCarrier').find('.modal-title').text(localization.AddCountryMobileCarrier);
    $("#btnSaveCountryMobileCarrier").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveCountryMobileCarrier").show();
    $("#btndeActiveCountryMobileCarrier").hide();
}
function fnEditCountryMobileCarrier(e, actiontype) {
    var rowid = $("#jqgCountryMobileCarrier").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgCountryMobileCarrier').jqGrid('getRowData', rowid);

    $("#cboCountryMobileCarrier").val(rowData.Isdcode).selectpicker('refresh');; 
    $("#cboCountryMobileCarrier").next().attr('disabled', true).selectpicker('refresh');;
    $("#txtMobilePrefix").val(rowData.MobilePrefix);
    $("#txtMobilePrefix").attr('readonly', true);
    $("#txtMobileNoDigit").val(rowData.MobileNoDigit); 
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveCountryMobileCarrier").attr("disabled", false);

    _isInsert = false;

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EPS_02_00", "UIC02", errorMsg.UnAuthorised_edit_E1);
            return;
        }
        $('#PopupCountryMobileCarrier').modal('show');
        $('#PopupCountryMobileCarrier').find('.modal-title').text(localization.UpdateCountryMobileCarrier);
        $("#btnSaveCountryMobileCarrier").html('<i class="fa fa-sync"></i>' + localization.Update);
        $("#btndeActiveCountryMobileCarrier").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveCountryMobileCarrier").attr("disabled", false);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "EPS_02_00", "UIC03", errorMsg.UnAuthorised_view_E2);
            return;
        }
        $('#PopupCountryMobileCarrier').modal('show');
        $('#PopupCountryMobileCarrier').find('.modal-title').text(localization.ViewCountryMobileCarrier);
        $("#btnSaveCountryMobileCarrier").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveCountryMobileCarrier").hide();
        $("#btndeActiveCountryMobileCarrier").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupCountryMobileCarrier").on('hidden.bs.modal', function () {
            $("#btnSaveCountryMobileCarrier").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            fnAlert("w", "EPS_02_00", "UIC04", errorMsg.UnAuthorised_delete_E3);
            return;
        }
        $('#PopupCountryMobileCarrier').modal('show');
        $('#PopupCountryMobileCarrier').find('.modal-title').text("Activate/De Activate CountryMobileCarrier");
        $("#btnSaveCountryMobileCarrier").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveCountryMobileCarrier").hide();

        if (rowData.ActiveStatus == 'true') {
            $("#btndeActiveCountryMobileCarrier").html(localization.Deactivate);
        }
        else {
            $("#btndeActiveCountryMobileCarrier").html(localization.Activate);
        }

        $("#btndeActiveCountryMobileCarrier").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupCountryMobileCarrier").on('hidden.bs.modal', function () {
            $("#btnSaveCountryMobileCarrier").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}
function fnSaveCountryMobileCarrier() {

    if (IsStringNullorEmpty($("#cboCountryMobileCarrier").val()) || $("#cboCountryMobileCarrier").val() == '0' || $("#cboCountryMobileCarrier").val()=="0") {
        fnAlert("w", "EPS_18_00", "UI0201", "Please select ISD Code");
        return;
    }
    if (IsStringNullorEmpty($("#txtMobilePrefix").val())) {
        fnAlert("w", "EPS_18_00", "UI0201", "Please Enter Mobile Prefix");
        return;
    }
    if (IsStringNullorEmpty($("#txtMobileNoDigit").val())) {
        fnAlert("w", "EPS_18_00", "UI0201", "Please Enter Mobile Number Digit");
        return;
    }

    objmob = {
        Isdcode: $("#cboCountryMobileCarrier").val(),
        MobilePrefix: $("#txtMobilePrefix").val(),
        MobileNoDigit: $("#txtMobileNoDigit").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSaveCountryMobileCarrier").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/Country/InsertOrUpdateMobileCarrier',
        type: 'POST',
        datatype: 'json',
        //data: { isInsert: _isInsert, obj: obj_action },
        data: { obj: objmob },

        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveCountryMobileCarrier").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupCountryMobileCarrier").modal('hide');
                fnClearFields();
                fnGridRefreshCountryMobileCarrier();
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveCountryMobileCarrier").attr("disabled", false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveCountryMobileCarrier").attr("disabled", false);
        }
    });
}
function fnGridRefreshCountryMobileCarrier() {
    $("#jqgCountryMobileCarrier").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}
function fnClearFields() {
    $("#cboCountryMobileCarrier").val('0').selectpicker('refresh');
    $("#txtMobilePrefix").val('');
    $("#txtMobileNoDigit").val('');
    $("#chkActiveStatus").prop('disabled', false);
    $("#btnSaveCountryMobileCarrier").attr("disabled", false);
    $("#btndeActiveCountryMobileCarrier").attr("disabled", false);
    $("input,textarea").attr('readonly', false);
    $("#cboCountryMobileCarrier").next().attr('disabled', false).selectpicker('refresh');
}

$("#btnCancelCountryMobileCarrier").click(function () {
    $("#jqgCountryMobileCarrier").jqGrid('resetSelection');
    $('#PopupCountryMobileCarrier').modal('hide');
    fnClearFields();
});
function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}
function fnDeleteCountryMobileCarrier() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btndeActiveCountryMobileCarrier").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Country/ActiveOrDeActiveMobileCarrier?status=' + a_status + '&ISDCode=' + $("#cboCountryMobileCarrier").val() + '&MobilePrefix=' + $("#txtMobilePrefix").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btndeActiveCountryMobileCarrier").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupCountryMobileCarrier").modal('hide');
                fnClearFields();
                fnGridRefreshCountryMobileCarrier();
                $("#btndeActiveCountryMobileCarrier").attr("disabled", false);
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btndeActiveCountryMobileCarrier").attr("disabled", false);
                $("#btndeActiveCountryMobileCarrier").html('De Activate');
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btndeActiveCountryMobileCarrier").attr("disabled", false);
            $("#btndeActiveCountryMobileCarrier").html('De Activate');
        }
    });
}
function fnISDCountryCode_onChange() {
    console.log($("#cboCountryMobileCarrier").val());
}