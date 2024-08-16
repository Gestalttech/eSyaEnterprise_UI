var actiontype = "";
var isUpdate = 0;
$(function () {
    $("#txtDateOfExchangeRate").datepicker({
        minDate: 0,
        dateFormat: _cnfDateFormat,
    });
    $("#txtEffectiveTill").datepicker({
        minDate: 0,
        dateFormat: _cnfDateFormat,
    });
    $("#txtSellingLastVoucherDate").datepicker({
        minDate: 0,
        dateFormat: _cnfDateFormat,
    });
    $("#txtBuyingLastVoucherDate").datepicker({
        minDate: 0,
        dateFormat: _cnfDateFormat,
    });
    fnGridLoadExRates();

    $.contextMenu({
        selector: "#btnExRates",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditExRates('edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditExRates('view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditExRates('delete') } },
        }

    });

    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});


function fnGridLoadExRates() {
    $('#jqgExRates').jqGrid('GridUnload');
    $("#jqgExRates").jqGrid({
        //url: getBaseURL() + '',
        datatype: 'json',
        mtype: 'Get',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        ignoreCase: true,
        colNames: [localization.CurrencyCode, localization.Description, localization.DateOfExchange, localization.StandardRate, localization.Date, localization.Rate, localization.Date, localization.Rate, localization.ActiveStatus, localization.Actions],
        colModel: [
            { name: "CurrencyCode", width: 50, editable: true, key: true, hidden: true },
            { name: "CurrencyDesc", width: 50, editable: true },
            {
                name: "DateOfExchangeRate", width: 50, editable: true, align: 'right', formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat },
            },
            { name: "StandardRate", width: 50, editable: true, align: 'right' },
            {
                name: "SellingLastVoucherDate", editable: true, width: 70, align: "right", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat },
            },
            { name: "SellingRate", width: 70, editable: true, align: 'right' },
            {
                name: "BuyingLastVoucherDate", width: 70, editable: true, align: 'right', formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat },
            },
            { name: "BuyingRate", width: 70, editable: true, align: 'right' },
            { name: "ActiveStatus", editable: true, width: 80, edittype: "select", formatter: 'select', editoptions: { value: "true: Active;false: InActive" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnExRates"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpExRates",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: 55,
        loadonce: true,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        sortable: false,
        forceFit: true,
        scrollOffset: 0, caption: localization.ExchangeRates,
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqgExRates");
        },
    }).
        jqGrid('navGrid', '#jqpExRates', { add: false, edit: false, search: false, searchtext: 'Search', del: false, refresh: false })
        .jqGrid('navButtonAdd', '#jqpExRates', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddExRates
        }).
        jqGrid('navButtonAdd', '#jqpExRates', {
            caption: '<span class="fa fa-sync" data-toggle="modal"></span> Refresh', buttonicon: 'none', id: 'btnGridRefresh', position: 'last', onClickButton: fnRefreshGridExRates
        });
    fnAddGridSerialNoHeading();
    $("#jqgExRates").jqGrid('setGroupHeaders', {
        useColSpanStyle: true,
        groupHeaders: [
            { startColumnName: 'SellingLastVoucherDate', numberOfColumns: 2, titleText: '<div class="custH">Selling</div>' },
            { startColumnName: 'BuyingLastVoucherDate', numberOfColumns: 2, titleText: '<div class="custH">Buying</div>' }
        ]
    });
    $('.jqg-first-row-header').css('display', 'none');
}

function fnAddExRates() {
    $("#PopupExRates").modal('show');
    $('#PopupExRates').find('.modal-title').text(localization.AddExchangeRates);
    $("#btnSaveExRates").html("<i class='fa fa-save'></i> " + localization.Save);
    $("#chkExRatesActiveStatus").parent().addClass("is-checked");
    $("#chkExRatesActiveStatus").prop('disabled', true);
    $("#btnDeactivateExRates").hide();
}


function fnEditExRates(actiontype) {
    var rowid = $("#jqgExRates").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgExRates').jqGrid('getRowData', rowid);

    $("#chkExRatesActiveStatus").parent().addClass("is-checked");
    $("#chkExRatesActiveStatus").prop('disabled', true);

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EFA_02_00", "UIC02", errorMsg.editauth_E2);
            return;
        }
        $('#PopupExRates').modal('show');
        $('#PopupExRates').find('.modal-title').text(localization.UpdateExchangeRates);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveExRates").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("#btnDeactivateExRates").hide();
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);
        $("#btnSaveExRates").show();
    }


    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "EFA_02_00", "UIC03", errorMsg.vieweauth_E3);
            return;
        }
        $('#PopupExRates').modal('show');
        $('#PopupExRates').find('.modal-title').text(localization.ViewExchangeRates);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveExRates,#btnDeactivateExRates").hide();
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
    }


    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            fnAlert("w", "EFA_02_00", "UIC04", errorMsg.deleteauth_E4);
            return;
        }
        $('#PopupExRates').modal('show');
        $('#PopupExRates').find('.modal-title').text(localization.ActiveOrDeactiveExchangeRates);
        if (rowData.ActiveStatus == 'true') {
            $("#btnDeactivateExRates").html(localization.Deactivate);
        }
        else {
            $("#btnDeactivateExRates").html(localization.Activate);
        }
        $("#btnSaveExRates").hide();
        $("#btnDeactivateExRates").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
    }
}
function fnRefreshGridExRates() {
    $("#jqgExRates").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearExRates() {
    $("#cboExRatesCurrencyCode").val('0');
    $("#txtExRatesDescription").val('');
    $("#txtDateOfExchangeRate").val('');
    $("#txtStandardRate").val('');
    $("#txtSellingLastVoucherDate").val('');
    $("#txtSellingRate").val('');
    $("#txtBuyingLastVoucherDate").val('');
    $("#txtBuyingRate").val('');
    $("#chkExRatesActiveStatus").parent().addClass("is-checked");
    $("#chkExRatesActiveStatus").prop('disabled', true);
}