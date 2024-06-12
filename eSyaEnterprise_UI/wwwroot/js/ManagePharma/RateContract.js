$(function () {
    fnLoadGridRateContract()
});

function fnLoadManufacturer() {
    if ($('#cboBusinessLocation').val() != '') {
        fnBindManufacturer();
    }
}

function fnBindManufacturer() {

}

function fnLoadGridRateContract() {
    $("#jqgRateContract").jqGrid('GridUnload');
    $("#jqgRateContract").jqGrid({
        //url: getBaseURL() + '/RateContract/GetTradeNameByBusinessKeyAndManufacturer?businessKey=' + $('#cboBusinessLocation').val() + '&cboManufacturer=' + $('#cboManufacturer').val(),
        datatype: 'json',
        mtype: 'GET',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.TradeID, localization.TradeName, localization.EffectiveFrom, localization.PurchaseRate, localization.MRP,localization.LastMRP,localization.Active],
        colModel: [
            { name: "TradeID", width: 170, editable: true, align: 'left', hidden: true },
            { name: "TradeName", width: 170, editable: true, align: 'left', hidden: false },
            {
                name: 'EffectiveFrom', index: 'EffectiveDate', width: 90, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat },
                /*{ dateFormat: "dd/M/yy" },*/
                editable: true, editoptions: {
                    size: 20,
                    dataInit: function (el) {
                        $(el).datepicker({ dateFormat: _cnfDateFormat });
                    }
                    //dataInit: function (el) {
                    //    $(el).datepicker({ dateFormat: "dd/M/yy" });
                    //}
                }
            },
            { name: "PurchaseRate", width: 50, editable: true, align: 'left', edittype: 'text' },
            { name: "MRP", width: 50, editable: true, align: 'left', edittype: 'text' },
            { name: "LastMRP", width: 50, editable: true, align: 'left', edittype: 'text' },
            { name: "ActiveStatus", editable: true, width: 30, align: 'center', resizable: false, edittype: 'checkbox', formatter: 'checkbox', editoptions: { value: "true:false" } },

        ],
        rowNum: 10,
        rowList: [10, 20, 30, 50],
        emptyrecords: "No records to Veiw",
        pager: "#jqpRateContract",
        viewrecords: true,
        gridview: true,
        rownumbers: false,
        height: 'auto',
        width: 'auto',
        scroll: false,
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        loadonce: true,
        cellEdit: true,
        editurl: 'url',
        caption: localization.RateContract,
        cellsubmit: 'clientArray',
        onSelectRow: function (id) {
            if (id) { $('#jqgRateContract').jqGrid('editRow', id, true); }
        },
        loadComplete: function (data) {
            $(this).find(">tbody>tr.jqgrow:odd").addClass("myAltRowClassEven");
            $(this).find(">tbody>tr.jqgrow:even").addClass("myAltRowClassOdd");
            $("#jqgRateContract").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
            fnJqgridSmallScreen('jqgRateContract');
        }
    }).jqGrid('navGrid', '#jqpRateContract', { add: false, edit: false, search: false, del: false, refresh: false });
    $("#btnSave").show();
}

function fnSaveRateContract() {
    if (IsStringNullorEmpty($("#cboDrugComposition").val() == "0" || $("#cboDrugComposition").val() == "")) {
        fnAlert("w", "EMR_03_00", "UI0064", errorMsg.SelectLocation_E1);
        return;
    }
    if (IsStringNullorEmpty($("#cboDrugComposition").val() == "0" || $("#cboDrugComposition").val() == "")) {
        fnAlert("w", "EMR_03_00", "UI0194", errorMsg.ClinicType_E6);
        return;
    }
}

function fnClearRateContract() {

}