$(function () {
    fnGridLoadPaymentMethod();
    $.contextMenu({
        selector: "#btnPayment",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditPaymentMethod(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditPaymentMethod(event, 'view') } },
        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
 

})
function fnISDCountryCode_onChange() {
    fnGridLoadPaymentMethod();
}
function fnGridLoadPaymentMethod() {

    var ISDcountry = $("#cboPaymentMethodCountry").val();

    $("#jqgPaymentMethod").jqGrid('GridUnload');

    $("#jqgPaymentMethod").jqGrid({
        url: getBaseURL() + '/PaymentMethod/GetPaymentMethodbyISDCode?ISDCode=' + ISDcountry,
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.ISDCode, localization.PaymentMethod, localization.InstrumentType, localization.PaymentMethodDesc, localization.InstrumentTypeDesc,  localization.Active,localization.Actions],
        colModel: [
            { name: "Isdcode", width: 50, editable: false, align: 'left', hidden: true },
            { name: "PaymentMethod", width: 80, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "InstrumentType", width: 80, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "PaymentMethodDesc", width: 150, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "InstrumentTypeDesc", width: 150, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false", defaultValue: 'true' }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnPayment"><i class="fa fa-ellipsis-v"></i></button>'
                }
            }
        ],

        pager: "#jqpPaymentMethod",
        rowNum: 10000,
        rowList: [],
        pgtext: null,
        pgbuttons: false,
        rownumWidth: '55',
        loadonce: true,
        viewrecords: false,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        cellEdit: true,
        scrollOffset: 0,
        caption: localization.PaymentMethod,
        editurl: 'url',
        cellsubmit: 'clientArray',
        onSelectRow: function (id) {
            if (id) { $('#jqgPaymentMethod').jqGrid('editRow', id, true); }
        },
        ondblClickRow: function (rowid) {
            $("#jqgPaymentMethod_iledit").trigger('click');
        },
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgPaymentMethod");
            fnGridRefreshPaymentMethod();
        },
    }).jqGrid('navGrid', '#jqpPaymentMethod', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpPaymentMethod', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshPaymentMethod
    }).jqGrid('navButtonAdd', '#jqpPaymentMethod', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddPaymentMethod
    });

    fnAddGridSerialNoHeading();

}
function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}
function fnGridRefreshPaymentMethod() {
    $("#jqgPaymentMethod").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnAddPaymentMethod() {
   
    if ($("#cboPaymentMethodCountry").val() === 0 || $("#cboPaymentMethodCountry").val() === "0" || IsStringNullorEmpty($("#cboPaymentMethodCountry").val())) {
        fnAlert("w", "EPS_17_00", "UI0042", errorMsg.PaymentMethodCountry_E1);
        return;
    }

    $('#PopupPaymentMethod').modal('show');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $('#PopupPaymentMethod').find('.modal-title').text(localization.AddPaymentMethod);
    $("#btnSavePaymentMethod").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSavePaymentMethod").show();
    $("#cboInstrumentType").val('').selectpicker('refresh');
    $("#cboPaymentMethod").val('0').selectpicker('refresh');
    $("select").next().attr('disabled', false);
}
function fnEditPaymentMethod(e, actiontype) {
    var rowid = $("#jqgPaymentMethod").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgPaymentMethod').jqGrid('getRowData', rowid);
    var _selectedRow = $("#" + rowid).offset();
    var firstRow = $("tr.ui-widget-content:first").offset();
    $(".ui-jqgrid-bdiv").animate({ scrollTop: _selectedRow.top - firstRow.top }, 700);

    $("#cboPaymentMethod").val(rowData.PaymentMethod).selectpicker('refresh');
    $("#cboInstrumentType").val(rowData.InstrumentType).selectpicker('refresh');
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
       
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
       
    }
    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EPS_17_00", "UIC02", errorMsg.UnAuthorised_edit_E1);
            return;
        }
        $('#PopupPaymentMethod').modal('show');
        $('#PopupPaymentMethod').find('.modal-title').text(localization.EditPaymentMethod);
        $("#btnSavePaymentMethod").html('<i class="fa fa-sync"></i>' + localization.Update);
        $("#chkActiveStatus").prop('disabled', false);
        $("#btnSavePaymentMethod").attr("disabled", false);
        $("#btnSavePaymentMethod").show();
        $("select").next().attr('disabled', true);
        $("#PopupPaymentMethod").on('hidden.bs.modal', function () {
            $("#btnSavePaymentMethod").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "EPS_17_00", "UIC03", errorMsg.UnAuthorised_view_E2);
            return;
        }
        $('#PopupPaymentMethod').modal('show');
        $('#PopupPaymentMethod').find('.modal-title').text(localization.ViewPaymentMethod);
        $("#btnSavePaymentMethod").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSavePaymentMethod").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("select").next().attr('disabled', true);
        $("#PopupPaymentMethod").on('hidden.bs.modal', function () {
            $("#btnSavePaymentMethod").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }

}
function fnSavePaymentMethod() {
    if ($("#cboPaymentMethodCountry").val() == '' || $("#cboPaymentMethodCountry").val() == "0" || IsStringNullorEmpty($("#cboPaymentMethodCountry").val())) {
        fnAlert("w", "EPS_17_00", "UI0042", errorMsg.PaymentMethodCountry_E1);
        return;
    }
    if ($("#cboPaymentMethod").val() == '' || $("#cboPaymentMethod").val() == "0" || IsStringNullorEmpty($("#cboPaymentMethod").val())) {
        fnAlert("w", "EPS_17_00", "UI0244", errorMsg.PaymentMethod_E1);
        return;
    }

    if ($("#cboInstrumentType").val() == '' || $("#cboInstrumentType").val() === "0" || IsStringNullorEmpty($("#cboInstrumentType").val())) {
        fnAlert("w", "EPS_17_00", "UI0245", errorMsg.InstrumentType_E1);
        return;
    }
        
   

    obj = {
        Isdcode: $("#cboPaymentMethodCountry").val(),
        InstrumentType: $("#cboInstrumentType").val(),
        PaymentMethod: $("#cboPaymentMethod").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    

    $("#btnSavePaymentMethod").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/PaymentMethod/InsertOrUpdatePaymentMethod',
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response.Status === true) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#PopupPaymentMethod").modal('hide');
                fnGridRefreshPaymentMethod();
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
            }
            $("#btnSavePaymentMethod").attr("disabled", false);
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSavePaymentMethod").attr("disabled", false);
        }
    });

}