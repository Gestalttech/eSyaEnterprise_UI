
$(document).ready(function () {
    fnGridLoadGateWayRules();
    $.contextMenu({
        selector: "#btnGateWayRules",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditGateWayRules(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditGateWayRules(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditGateWayRules(event, 'delete') } },
        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");

});
var actiontype = "";
function fnGridLoadGateWayRules() {

    $("#jqgGateWayRules").GridUnload();

    $("#jqgGateWayRules").jqGrid({
        //url: getBaseURL() + '/GWayRules/GetGateWayRules',
        url:'',
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.GwruleId, localization.Gwdesc, localization.RuleValue, localization.Active, localization.Actions],
        colModel: [
            { name: "GwruleId", width: 50, align: 'left', editable: false,resizable: false, hidden: true },
            { name: "Gwdesc", width: 180, align: 'left', editable: false, editoptions: { maxlength: 50 }, resizable: false },
            { name: "RuleValue", editable: false, align: 'left', width: 120, edittype: "select", resizable: false, formatter: 'select'},
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', formatoptions: { disabled: true }, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnGateWayRules"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],

        pager: "#jqpGateWayRules",
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
        caption: localization.GateWayRules,
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqgGateWayRules");
        },
        loadBeforeSend: function () {
            $("[id*='_edit']").css('text-align', 'center');
        },
        onSelectRow: function (rowid, status, e) {
           },
    }).jqGrid('navGrid', '#jqpGateWayRules', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpGateWayRules', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshGateWayRules
    }).jqGrid('navButtonAdd', '#jqpGateWayRules', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddGateWayRules
    });
    fnAddGridSerialNoHeading();
}

function fnAddGateWayRules() {
    _isInsert = true;
    fnClearFields();
    $('#PopupGateWayRules').modal('show');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $('#PopupGateWayRules').find('.modal-title').text(localization.AddGateWayRules);
    $("#btnSaveGateWayRules").html('<i class="fa fa-save"></i>' + localization.Save);
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveGateWayRules").show();
    $("#btndeactiveGateWayRules").hide();
}

function fnEditGateWayRules(e, actiontype) {
    var rowid = $("#jqgGateWayRules").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgGateWayRules').jqGrid('getRowData', rowid);
    var _selectedRow = $("#" + rowid).offset();
    var firstRow = $("tr.ui-widget-content:first").offset();
    $(".ui-jqgrid-bdiv").animate({ scrollTop: _selectedRow.top - firstRow.top }, 700);
    $('#txtGwruleId').val(rowData.GwruleId);
    $('#txtGwDescription').val(rowData.Gwdesc);
    $('#txtRuleValue').val(rowData.RuleValue);
   
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveGateWayRules").attr("disabled", false);
    
    _isInsert = false;

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EPS_20_00", "UIC02", errorMsg.editauth_E3);
            return;
        }
        $('#PopupGateWayRules').modal('show');
        $('#PopupGateWayRules').find('.modal-title').text(localization.UpdateGateWayRules);
        $("#btnSaveGateWayRules").html('<i class="fa fa-sync mr-1"></i>' + localization.Update);
        $("#btndeactiveGateWayRules").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveGateWayRules").attr("disabled", false);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "EPS_20_00", "UIC03", errorMsg.vieweauth_E4);
            return;
        }
        $('#PopupGateWayRules').modal('show');
        $('#PopupGateWayRules').find('.modal-title').text(localization.ViewGateWayRules);
        $("#btnSaveGateWayRules").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveGateWayRules").hide();
        $("#btndeactiveGateWayRules").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupGateWayRules").on('hidden.bs.modal', function () {
            $("#btnSaveGateWayRules").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            fnAlert("w", "EPS_20_00", "UIC04", errorMsg.deleteauth_E5);
            return;
        }
        $('#PopupGateWayRules').modal('show');
        $('#PopupGateWayRules').find('.modal-title').text(localization.DeleteGateWayRules);
        $("#btnSaveGateWayRules").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveGateWayRules").hide();

        if (rowData.ActiveStatus == 'true') {
            $("#btndeactiveGateWayRules").html(localization.DeActivate);
        }
        else {
            $("#btndeactiveGateWayRules").html(localization.Activate);
        }

        $("#btndeactiveGateWayRules").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupGateWayRules").on('hidden.bs.modal', function () {
            $("#btnSaveGateWayRules").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

var _isInsert = true;
function fnSaveGateWayRules() {
    if (IsStringNullorEmpty($("#txtGwDescription").val())) {
        fnAlert("w", "EPS_20_00", "UI0359", errorMsg.GateWayRulesDesc_E1);
        document.getElementById("txtGwDescription").focus();
        return;
    }
    if (IsStringNullorEmpty($("#txtRuleValue").val())) {
        fnAlert("w", "EPS_20_00", "UI0360", errorMsg.RuleValueId_E2);
        document.getElementById("txtRuleValue").focus();
        return;
    }
    gw_rules = {
        GwruleId: $("#txtGwruleId").val(),
        Gwdesc: $("#txtGwDescription").val(),
        RuleValue: $("#txtRuleValue").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSaveGateWayRules").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/ApplicationCodes/InsertOrUpdateCodeTypes',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, gw_rules: gw_rules },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveGateWayRules").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupGateWayRules").modal('hide');
                fnClearFields();
                fnGridRefreshGateWayRules();
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveGateWayRules").attr("disabled", false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveGateWayRules").attr("disabled", false);
        }
    });
}

function fnGridRefreshGateWayRules() {
    $("#jqgGateWayRules").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {
    $("#txtGwDescription").val('')
    $("#txtRuleValue").val(''),
    $("#chkActiveStatus").prop('disabled', false);
    $("#btnSaveGateWayRules").attr("disabled", false);
    $("#btndeactiveGateWayRules").attr("disabled", false);
}

$("#btnCancelGateWayRules").click(function () {
    $("#jqgGateWayRules").jqGrid('resetSelection');
    $('#PopupGateWayRules').modal('hide');
    fnClearFields();
});

function SetGridControlByAction() {

    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }

}

function fnDeleteGateWayRules() {

    var a_status;
   if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btndeactiveGateWayRules").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/ApplicationCodes/ActiveOrDeActiveGateWayRules?status=' + a_status + '&code_type=' + $("#txtGateWayRules").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btndeactiveGateWayRules").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupGateWayRules").modal('hide');
                fnClearFields();
                fnGridRefreshGateWayRules();
                $("#btndeactiveGateWayRules").attr("disabled", false);
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btndeactiveGateWayRules").attr("disabled", false);
                $("#btndeactiveGateWayRules").html('Deactivate');
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btndeactiveGateWayRules").attr("disabled", false);
            $("#btndeactiveGateWayRules").html('Deactivate');
        }
    });
}