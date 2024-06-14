$(function () {
    fnLoadGridRateContract()
});

function fnLoadManufacturer() {
    if ($('#cboBusinessLocation').val() != '') {
        fnBindVendor();
    }
}

function fnBindVendor() {

}

function fnLoadGridRateContract() {
    $("#jqgMapVendorDrugs").jqGrid('GridUnload');
    $("#jqgMapVendorDrugs").jqGrid({
        //url: getBaseURL() + '/RateContract/GetTradeNameByBusinessKeyAndManufacturer?businessKey=' + $('#cboBusinessLocation').val() + '&cboManufacturer=' + $('#cboManufacturer').val(),
        datatype: 'json',
        mtype: 'GET',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.TradeID, localization.TradeName, localization.MinimumSupplyQuantity, localization.BusinessSharePercentage, localization.PartNumber, localization.PartDesc, localization.Active],
        colModel: [
            { name: "TradeID", width: 170, editable: true, align: 'left', hidden: true },
            { name: "TradeName", width: 140, editable: true, align: 'left', hidden: false },
            { name: "MinimumSupplyQuantity", width: 80, editable: true, align: 'left', hidden: false },
            { name: "BusinessSharePercentage", width: 80, editable: true, align: 'left', hidden: false },
            { name: "PartNumber", width: 40, editable: true, align: 'left', hidden: false },
            { name: "PartDesc", width: 100, editable: true, align: 'left', hidden: false },
            { name: "ActiveStatus", editable: true, width: 40, align: 'center', resizable: false, edittype: 'checkbox', formatter: 'checkbox', editoptions: { value: "true:false" } },

        ],
        rowNum: 10,
        rowList: [10, 20, 30, 50],
        rownumWidth: '55',
        emptyrecords: "No records to Veiw",
        pager: "#jqpMapVendorDrugs",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        width: 'auto',
        scroll: false,
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        loadonce: true,
        cellEdit: true,
        editurl: 'url',
        caption: localization.MapVendorDrugs,
        cellsubmit: 'clientArray',
        onSelectRow: function (id) {
            if (id) { $('#jqgMapVendorDrugs').jqGrid('editRow', id, true); }
        },
        loadComplete: function (data) {
            $("#jqgMapVendorDrugs").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
            fnJqgridSmallScreen('jqgMapVendorDrugs');
        }
    }).jqGrid('navGrid', '#jqpMapVendorDrugs', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpMapVendorDrugs', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshMapVendorDrugs
    });
    $("#btnSaveRateContract").show();
    fnAddGridSerialNoHeading();
}

function fnSaveMapVendorDrugs() {
  
}

function fnClearMapVendorDrugs() {

}

function fnGridRefreshMapVendorDrugs() {
    $("#jqgMapVendorDrugs").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}