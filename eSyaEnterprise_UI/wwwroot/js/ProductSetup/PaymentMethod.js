$(function () {
    fnGridLoadPaymentMethod();
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
        colNames: [localization.ISDCode, localization.InstrumentType, localization.PaymentMethod, localization.Active],
        colModel: [
            { name: "Isdcode", width: 50, editable: false, align: 'left', hidden: true },
            { name: "InstrumentType", width: 80, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "PaymentMethod", width: 150, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false", defaultValue: 'true' }, formatoptions: { disabled: false } },
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
    }).jqGrid('navGrid', '#jqpPaymentMethod', { add: false, edit: false, search: false, del: false, refresh: false });

    fnAddGridSerialNoHeading();

}
function SetGridControlByAction() {
  

    if (_userFormRole.IsInsert === false)
    {
        $("#btnSavePaymentMethod").attr('disabled', true);
    }
    else
    {
        $("#btnSavePaymentMethod").attr('disabled', false);
    }
}
function fnGridRefreshPaymentMethod() {
    $("#jqgPaymentMethod").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnSavePaymentMethod() {

    if ($("#cboPaymentMethodCountry").val() === 0 || $("#cboPaymentMethodCountry").val() === "0" || IsStringNullorEmpty($("#cboPaymentMethodCountry").val())) {
        fnAlert("w", "EPS_34_00", "UI0041", errorMsg.CountrySelect_E1);
        return;
    }
    $("#jqgPaymentMethod").jqGrid('editCell', 0, 0, false);
    var pamentlink = [];
    var id_list = jQuery("#jqgPaymentMethod").jqGrid('getDataIDs');
    for (var i = 0; i < id_list.length; i++) {
        var rowId = id_list[i];
        var rowData = jQuery('#jqgPaymentMethod').jqGrid('getRowData', rowId);

        pamentlink.push({
            Isdcode: $("#cboPaymentMethodCountry").val(),
            InstrumentType: rowData.InstrumentType,
            ActiveStatus: rowData.ActiveStatus
        });

    }

    $("#btnSavePaymentMethod").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/PaymentMethod/InsertOrUpdatePaymentMethod',
        type: 'POST',
        datatype: 'json',
        data: { obj: pamentlink },
        success: function (response) {
            if (response.Status === true) {
                fnAlert("s", "", response.StatusCode, response.Message);
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