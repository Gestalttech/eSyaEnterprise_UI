$(function () {
    fnLoadGridVendorLink();
});

//function fnLoadManufacturer() {
//    if ($('#cboBusinessLocation').val() != '') {
//        fnBindVendor();
//    }
//}

function fnBindVendor() {
    $("#cboVendor").empty().selectpicker('refresh');
    $("#cboVendor").empty().selectpicker('refresh');

    var BusinessKey = $("#cboBusinessLocation").val();
    $.ajax({
        type: 'POST',
        url: getBaseURL() + '/VendorLink/GetVendorList?BusinessKey=' + BusinessKey,
        success: function (result) {
            $("#cboVendor").append($("<option value='0'>Select</option>"));
            if (result != null) {
                for (var i = 0; i < result.length; i++) {
                    $('#cboVendor').append('<option value="' + result[i]["VendorID"] + '">' + result[i]["VendorName"] + '</option>');
                }
            }   
            $('#cboVendor').val($("#cboVendor option:first").val());
            $("#cboVendor").selectpicker('refresh');
            fnLoadGridVendorLink();
        }
    });
}

function fnLoadGridVendorLink() {
    var BusinessKey = $("#cboBusinessLocation").val();
    var VendorID = $("#cboVendor").val();
    var URL = getBaseURL() + '/VendorLink/GetDrugVendorLink?BusinessKey=' + BusinessKey + '&VendorID=' + VendorID;

    $("#jqgMapVendorDrugs").jqGrid('GridUnload');
    $("#jqgMapVendorDrugs").jqGrid({
        //url: getBaseURL() + '/RateContract/GetTradeNameByBusinessKeyAndManufacturer?businessKey=' + $('#cboBusinessLocation').val() + '&cboManufacturer=' + $('#cboManufacturer').val(),
        url: URL,
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.TradeID, localization.TradeName, localization.MinimumSupplyQuantity, localization.BusinessSharePercentage, localization.PartNumber, localization.PartDesc, localization.Active],
        colModel: [
            { name: "TradeID", width: 170, editable: true, align: 'left', hidden: true },
            { name: "TradeName", width: 140, editable: true, align: 'left', hidden: false },
            { name: "MinimumSupplyQty", width: 80, editable: true, align: 'left', hidden: false },
            { name: "BusinessSharePerc", width: 80, editable: true, align: 'left', hidden: false },
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
    if (IsStringNullorEmpty($("#cboBusinessLocation").val() == "0" || $("#cboBusinessLocation").val() == "")) {
        fnAlert("w", "EMR_03_00", "UI0064", errorMsg.BusinessLocation_E5);
        return;
    }
    if (IsStringNullorEmpty($("#cboVendor").val() == "0" || $("#cboVendor").val() == "")) {
        fnAlert("w", "EMR_03_00", "UI0342", errorMsg.SelectVendor_E6);
        return;
    }

    $("#jqgMapVendorDrugs").jqGrid('editCell', 0, 0, false);
    var Vendor_lk = [];
    var id_list = jQuery("#jqgMapVendorDrugs").jqGrid('getDataIDs');
    for (var i = 0; i < id_list.length; i++) {
        var rowId = id_list[i];
        var rowData = jQuery('#jqgMapVendorDrugs').jqGrid('getRowData', rowId);

        Vendor_lk.push({
            BusinessKey: $("#cboBusinessLocation").val(),
            VendorID: $("#cboVendor").val(),
            TradeID: rowData.TradeID,
            MinimumSupplyQty: rowData.MinimumSupplyQty,
            BusinessSharePerc: rowData.BusinessSharePerc,
            PartNumber: rowData.PartNumber,
            PartDesc: rowData.PartDesc,
            ActiveStatus: rowData.ActiveStatus
        });
    }

    $("#fnSaveMapVendorDrugs").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/VendorLink/AddOrUpdateDrugVendorLink',
        type: 'POST',
        datatype: 'json',
        data: { obj: Vendor_lk },
        success: function (response) {
            if (response.Status === true) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#jqgMapVendorDrugs").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
            }
            $("#fnSaveMapVendorDrugs").attr("disabled", false);
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#fnSaveMapVendorDrugs").attr("disabled", false);
        }
    });
}

function fnClearMapVendorDrugs() {

}

function fnGridRefreshMapVendorDrugs() {
    $("#jqgMapVendorDrugs").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}