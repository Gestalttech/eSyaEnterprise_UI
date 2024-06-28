$(function () {
    fnLoadGridRateContract();
});

 function fnLoadGridRateContract() {
    var BusinessKey = $("#cboBusinessLocation").val();
    var ManufacturerID = $("#cboManufacturer").val();
    var URL = getBaseURL() + '/RateContract/GetDrugManufacturerLink?BusinessKey=' + BusinessKey + '&ManufacturerID=' + ManufacturerID;

    $("#jqgRateContract").jqGrid('GridUnload');
    $("#jqgRateContract").jqGrid({
        //url: getBaseURL() + '/RateContract/GetTradeNameByBusinessKeyAndManufacturer?businessKey=' + $('#cboBusinessLocation').val() + '&cboManufacturer=' + $('#cboManufacturer').val(),
        url: URL,
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.TradeID, localization.TradeName, localization.EffectiveFrom, localization.PurchaseRate, localization.MRP,localization.LastMRPDate,localization.Active],
        colModel: [
            //{ name: "BusinessKey", width: 170, editable: true, align: 'left', hidden: true },
            //{ name: "ManufacturerID", width: 170, editable: true, align: 'left', hidden: true },
            { name: "TradeID", width: 170, editable: true, align: 'left', hidden: true },
            { name: "TradeName", width: 170, editable: false, align: 'left', hidden: false },
            {
                name: 'EffectiveFrom', index: 'EffectiveFrom', width: 90, sorttype: "date", formatter: "date", formatoptions:
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
            { name: "MRP", width: 50, editable: false, align: 'left', edittype: 'text' },

            {
                name: 'LastMRPDate', index: 'LastMRPDate', width: 90, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat },
                /*{ dateFormat: "dd/M/yy" },*/
                editable: false, editoptions: {
                    size: 20,
                    dataInit: function (el) {
                        $(el).datepicker({ dateFormat: _cnfDateFormat });
                    }
                    //dataInit: function (el) {
                    //    $(el).datepicker({ dateFormat: "dd/M/yy" });
                    //}
                }
            },

            //{ name: "LastMRP", width: 50, editable: true, align: 'left', edittype: 'text' },
            { name: "ActiveStatus", editable: true, width: 30, align: 'center', resizable: false, edittype: 'checkbox', formatter: 'checkbox', editoptions: { value: "true:false" } },

        ],
        rowNum: 10,
        rowList: [10, 20, 30, 50],
        emptyrecords: "No records to Veiw",
        pager: "#jqpRateContract",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        rownumWidth:'55',
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
    }).jqGrid('navGrid', '#jqpRateContract', { add: false, edit: false, search: false, del: false, refresh: false })
        .jqGrid('navGrid', '#jqpRateContract', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpRateContract', {
            caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshRateContract
        })
    $("#btnSave").show();
    fnAddGridSerialNoHeading();
}

function fnSaveRateContract() {
    if (IsStringNullorEmpty($("#cboBusinessLocation").val() == "0" || $("#cboBusinessLocation").val() == "")) {
        fnAlert("w", "EMR_03_00", "UI0064", errorMsg.SelectLocation_E1);
        return;
    }
    if (IsStringNullorEmpty($("#cboManufacturer").val() == "0" || $("#cboManufacturer").val() == "")) {
        fnAlert("w", "EMP_01_00", "UI0338", errorMsg.SelectManufacturer_E8);
        return;
    }

    $("#jqgRateContract").jqGrid('editCell', 0, 0, false);
    var Rate_CR = [];
    var id_list = jQuery("#jqgRateContract").jqGrid('getDataIDs');
    for (var i = 0; i < id_list.length; i++) {
        var rowId = id_list[i];
        var rowData = jQuery('#jqgRateContract').jqGrid('getRowData', rowId);

        Rate_CR.push({
            BusinessKey: $("#cboBusinessLocation").val(),
            ManufacturerID: $("#cboManufacturer").val(),
            TradeID: rowData.TradeID,
            EffectiveFrom: GetGridDate(rowData.EffectiveFrom),
            PurchaseRate: rowData.PurchaseRate,
            ActiveStatus: rowData.ActiveStatus
        });
    }

    $("#btnSaveRateContract").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/RateContract/AddOrUpdateDrugManufacturer',
        type: 'POST',
        datatype: 'json',
        data: { obj: Rate_CR },
        success: function (response) {
            if (response.Status === true) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#jqgRateContract").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
            }
            $("#btnSaveRateContract").attr("disabled", false);
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveRateContract").attr("disabled", false);
        }
    });
}

function fnClearRateContract() {

}

function fnGridRefreshRateContract() {
    $("#jqgRateContract").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}