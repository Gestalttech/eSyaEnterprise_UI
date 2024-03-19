$(function () {
    fnLoadGridBusinessCalendar();
    $.contextMenu({
        selector: "#btnBusinessCalendar",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditBusinessCalendar(event, 'edit') } },
            jqgView: { name: localization.Edit, icon: "view", callback: function (key, opt) { fnEditBusinessCalendar(event, 'view') } },
        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    var todaydt = new Date();
    $("#txtEffectiveFrom").datepicker({
        autoclose: true,
        dateFormat: _cnfDateFormat,

        onSelect: function (date) {


        }
    });

});

function fnBusinessKeyOnchange() {
    fnLoadGridBusinessCalendar();
}

function fnLoadGridBusinessCalendar() {
    $("#jqgBusinessCalendar").jqGrid('GridUnload');

    $("#jqgBusinessCalendar").jqGrid({

        url: getBaseURL() + '/BusinessCalendar/GetBusinessCalendarBYBusinessKey?businessKey=' + $("#cboBusinessKey").val(),
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.BusinessKey, localization.CalenderKey, localization.DocumentId, localization.DocumentDesc, localization.GeneNoYearOrMonth,localization.Active, localization.Actions],
        colModel: [
            { name: "BusinessKey", width: 50, editable: true, align: 'left', hidden: true },
            { name: "CalenderKey", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "DocumentId", width: 40, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "DocumentDesc", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "GeneNoYearOrMonth", width: 40, editable: false, hidden: false, align: 'left', resizable: true, formatter: 'select', editoptions: { value: "Y: Year;M: Month;C:Calendar" } },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline btn-sm" style="" id="btnBusinessCalendar"><i class="fa fa-ellipsis-v"></i> </button>'
                }
            }
        ],
        pager: "#jqpBusinessCalendar",
        rowNum: 10000,
        rownumWidth: '55',
        pgtext: null,
        pgbuttons: null,
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
        caption: localization.BusinessCalendar,
        loadComplete: function (data) {
            // SetGridControlByAction();
            fnJqgridSmallScreen("jqgBusinessCalendar");
        },
    }).jqGrid('navGrid', '#jqpBusinessCalendar', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpBusinessCalendar', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshBusinessCalendar
    }).jqGrid('navButtonAdd', '#jqpBusinessCalendar', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddBusinessCalendar
    });
    fnAddGridSerialNoHeading();
}

function fnAddBusinessCalendar() {
    if (IsStringNullorEmpty($("#cboBusinessKey").val()) || $("#cboBusinessKey").val() == "0") {
        fnAlert("w", "ECB_05_00", "UI0052", errorMsg.BusinessEntity_E1);
        return;
    }
    else {
        $('#PopupBusinessCalendar').modal('show');
        $('#PopupBusinessCalendar').find('.modal-title').text(localization.AddBusinessCalendar);
        $("#btnSaveBusinessCalendar").html('<i class="fa fa-save mr-1"></i>' + localization.Save);
   }
}
function fnEditBusinessCalendar(e, actiontype) {
    var rowid = $("#jqgBusinessCalendar").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgBusinessCalendar').jqGrid('getRowData', rowid);
    var _selectedRow = $("#" + rowid).offset();
    var firstRow = $("tr.ui-widget-content:first").offset();
    $(".ui-jqgrid-bdiv").animate({ scrollTop: _selectedRow.top - firstRow.top }, 700);

    $("#txtDocumentId").val(rowData.DocumentId);
    $("#txtDocumentDesc").val(rowData.DocumentDesc);

     if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "ECB_05_00", "UIC02", errorMsg.editauth_E2);
            return;
        }
        $('#PopupBusinessCalendar').modal('show').css({ top: firstRow.top + 31 });

        $('#PopupBusinessCalendar').find('.modal-title').text(localization.UpdateBusinessCalendar);
      
        $("#chkActiveStatus").prop('disabled', false);
       
        $("#btnSaveBusinessCalendar").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("#btnDeactivateApplicationCode").hide();
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);
        $("#btnSaveApplicationCode").show();
    }
    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "ECB_05_00", "UIC03", errorMsg.vieweauth_E3);
            return;
        }
        $('#PopupBusinessCalendar').modal('show');
        $('#PopupBusinessCalendar').find('.modal-title').text(localization.ViewBusinessCalendar);
        $("#chkActiveStatus").prop('disabled', true);
        
        $("#btnSaveBusinessCalendar").hide();
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
    }
}


function fnGridRefreshBusinessCalendar() {
    $("#jqgBusinessCalendar").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {
    $("#cboCalendarType").val('0').selectpicker('refresh');
    $('#txtDocumentId').val('');
    $('#txtDocumentDesc').val('');
    $('#txtEffectiveFrom').val('');
}
function fnSaveBusinessCalendar() {

    if ($("#cboBusinessKey ").val() === "0" || $("#cboBusinessKey ").val() === "" || $("#cboBusinessKey ").val() === '' || $("#cboBusinessKey ").val() == null) {
        fnAlert("w", "ECB_05_00", "UI0175", errorMsg.BusinessKey_E4);
        return;
    }
    if (IsStringNullorEmpty($("#txtDocumentId").val())) {
        fnAlert("w", "ECB_05_00", "UI0017", errorMsg.DocumentId_E5);
        return;
    }
    if (IsStringNullorEmpty($("#txtEffectiveFrom").val())) {
        fnAlert("w", "ECB_05_00", "UI0235", errorMsg.EffectiveFrom_E6);
        return;
    }
    if ($("#cboCalendarType ").val() === "0" || $("#cboCalendarType ").val() === "" || $("#cboCalendarType ").val() === '' || $("#cboCalendarType ").val() == null) {
        fnAlert("w", "ECB_05_00", "UI0214", errorMsg.CalendarType_E7);
        return;
    }
    obj = {
        BusinessKey: $("#cboBusinessKey").val(),
        DocumentId: $("#txtDocumentId").val(),
        CalendarType: $("#cboCalendarType").val(),
        EffectiveFrom: getDate($("#txtEffectiveFrom")),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSaveBusinessCalendar").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/BusinessCalendar/InsertOrUpdateBusinessCalendar',
        type: 'POST',
        datatype: 'json',
        data: { obj: obj },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#PopupBusinessCalendar").modal('hide');
                fnClearFields();
                fnGridRefreshBusinessCalendar();
                $("#btnSaveBusinessCalendar").attr("disabled", false);

            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveBusinessCalendar").attr("disabled", false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveBusinessCalendar").attr("disabled", false);
        }
    });
}