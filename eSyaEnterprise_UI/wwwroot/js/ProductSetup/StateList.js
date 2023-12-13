$(function () {
    fnGridLoadStateList();
    $.contextMenu({
        selector: "#btnStateList",
        trigger: 'left',
         items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditStateCodes(event, 'edit') } },
             jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditStateCodes(event, 'view') } },
            //jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditStateCodes(event, 'delete') } },
        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
});

function fnISDCountryCode_onChange()
{
    fnGridLoadStateList();
}

var actiontype = "";

function fnGridLoadStateList() {
    var IsdsCountry = $("#cboStateCountry").val();

    $("#jqgStateCodes").jqGrid('GridUnload');
    $("#jqgStateCodes").jqGrid({
        url: getBaseURL() + '/Address/GetStatesbyISDCode?isdCode=' + IsdsCountry,
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.ISDCode, localization.StateCode, localization.StateDesc, localization.Active, localization.Actions],
        colModel: [
            { name: "Isdcode", width: 50, editable: true, align: 'left', hidden: true },
            { name: "StateCode", width: 70, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "StateDesc", width: 120, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 50 } },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnStateList"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpStateCodes",
        rowNum: 10,
        rowList:[10,20,50],
        rownumWidth: '55',
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
        caption: localization.StateList,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgStateCodes");
        },
    }).jqGrid('navGrid', '#jqpStateCodes', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpStateCodes', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshStateCodes
        }).jqGrid('navButtonAdd', '#jqpStateCodes', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddStateCodes
    });
    fnAddGridSerialNoHeading();
}

function fnAddStateCodes() {
  
    var id = $("#cboStateCountry").val();
    if (id === 0 || id === "0" || IsStringNullorEmpty($("#cboStateCountry").val())) {
        fnAlert("w", "EPS_14_00", "UI0041", errorMsg.SelectAnyCountry_E6)
    }
    else
    {
        fnClearFields();
        $('#PopupStateCode').modal('show');
        $('#PopupStateCode').modal({ backdrop: 'static', keyboard: false });
        $('#PopupStateCode').find('.modal-title').text(localization.AddStateCode);
        $("#chkActiveStatus").parent().addClass("is-checked");
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveStateCode").html('<i class="fa fa-save"></i>  ' + localization.Save);
        $("#btnSaveStateCode").show();
    }
}

function fnEditStateCodes(e, actiontype) {
   
    var rowid = $("#jqgStateCodes").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgStateCodes').jqGrid('getRowData', rowid);

    $("#txtStateCode").val(rowData.StateCode);
    $("#txtStateDescription").val(rowData.StateDesc);
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveStateCode").attr('disabled', false);

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "", "UIC02", errorMsg.editauth_E2);
            return;
        }
        $('#PopupStateCode').modal('show');
        $('#PopupStateCode').find('.modal-title').text(localization.UpdateStateCode);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveStateCode").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);
        $("#btnSaveStateCode").show();
    }
    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "", "UIC03", errorMsg.vieweauth_E3);
            return;
        }
        $('#PopupStateCode').modal('show');
        $('#PopupStateCode').find('.modal-title').text(localization.ViewStateCode);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveStateCode").hide();
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
    }
}

function fnGridRefreshStateCodes() {
    $("#jqgStateCodes").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {
    $("#txtStateCode").val("");
    $("#txtStateDescription").val("");
    $("#btnSaveStateCode").attr('disabled', false);
    $("input,textarea").attr('readonly', false);
    $("select").next().attr('disabled', false);
}

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}

$("#btnCancelStateCode").click(function () {
    fnClearFields();
    $("#jqgStateCodes").jqGrid('resetSelection');
    $('#PopupStateCode').modal('hide');
});

function fnSaveStateCodes() {
    
    if ($("#cboStateCountry").val() === 0 || $("#cboStateCountry").val() === "0" || IsStringNullorEmpty($("#cboStateCountry").val())) {
        fnAlert("w", "EPS_14_00", "UI0042", errorMsg.CountryCode_E7);
        return;
    }

    if (IsStringNullorEmpty($("#txtStateDescription").val())) {
        fnAlert("w", "EPS_14_00", "UI0043", errorMsg.StateDesc_E8);
        return;
    }

    $("#btnSaveStateCode").attr('disabled', true);
    obj = {
        StateCode: $("#txtStateCode").val() === '' ? 0 : $("#txtStateCode").val(),
        Isdcode: $("#cboStateCountry").val(),
        StateDesc: $("#txtStateDescription").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    }
    $("#btnSaveStateCode").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/Address/InsertOrUpdateIntoStates',
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveStateCode").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#btnSaveStateCode").attr('disabled', false);
                fnGridRefreshStateCodes();
                $('#PopupStateCode').modal('hide');
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveStateCode").attr('disabled', false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveStateCode").attr("disabled", false);
        }
    });
}