
function fnLoadGrid() {
    if ($('#cboBusinessKey').val() != '' && $('#cboRateType').val() != '' && $('#cboCurrencyCode').val() != '') {
        fnLoadServiceBaseRate();
    }
}
function fnLoadServiceBaseRate() {
    $("#jqgServiceBaseRate").jqGrid('GridUnload');
    $("#jqgServiceBaseRate").jqGrid({
        url: getBaseURL() + '/ServiceRates/GetServiceBaseRateByBKeyRateTypeCurrCode?businessKey=' + $('#cboBusinessKey').val() + '&ratetype=' + $('#cboRateType').val() + '&currencycode=' + $('#cboCurrencyCode').val(),
        datatype: 'json',
        mtype: 'GET',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        // jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.ServiceId, localization.ServiceType, localization.ServiceGroup, localization.ServiceClass, localization.ServiceDescription, localization.EffectiveDate, localization.ServiceRule, localization.OPBaseRate, localization.IPBaseRate, localization.IsIprateWardwise, localization.Active],

        colModel: [

            { name: "ServiceId", width: 10, editable: false, align: 'left', hidden: true },
            { name: "ServiceTypeDesc", width: 100, editable: false, align: 'left', hidden: true },
            { name: "ServiceGroupDesc", width: 100, editable: false, align: 'left' },
            { name: "ServiceClassDesc", width: 100, editable: false, align: 'left' },
            { name: "ServiceDesc", width: 100, editable: false, align: 'left' },
            {
                name: 'EffectiveDate', index: 'EffectiveDate', width: 45, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat },
                editable: true, editoptions: {
                    size: 20,
                    dataInit: function (el) {
                        
                        $(el).datepicker({ dateFormat: _cnfDateFormat });
                    }
                }
            },
            { name: "ServiceRule", editable: true, width: 50, align: 'left', resizable: false, edittype: "select", formatter: 'select', editoptions: { value: "F: Fixed;V: Variable;E: Entry" } },
            { name: "OpbaseRate", width: 45, editable: true, align: 'left', edittype: 'text' },
            { name: "IpbaseRate", width: 45, editable: true, align: 'left', edittype: 'text' },
            { name: "IsIprateWardwise", editable: true, width: 50, align: 'center', resizable: false, edittype: 'checkbox', formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "ActiveStatus", editable: true, width: 30, align: 'center', resizable: false, edittype: 'checkbox', formatter: 'checkbox', editoptions: { value: "true:false" } },

        ],
        rowNum: 100000,
        //rowList: [10, 20, 30, 50],
        rownumWidth: '55',
        emptyrecords: "No records to Veiw",
        pager: "#jqpServiceBaseRate",
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
        cellsubmit: 'clientArray',
        caption: localization.ServiceBaseRate,
        onSelectRow: function (rowid) {
            alert();
            debugger;
            date = $("#jqgServiceBaseRate").jqGrid('getCell', rowid, "EffectiveDate");
            strdate = date;
             date = moment(date, 'DD-MM-YYYY').toDate();
            $("#dtServiceRateDate").datepicker().datepicker("setDate", date);
            var row = $("#jqgServiceBaseRate").closest('tr.jqgrow');
            $("#" + rowid + "_EffectiveDate", row[0]).val(date);
            Selectedrowid = rowid;

            
        },
        //ondblClickRow: function (rowid) {
        //    $('#jqgServiceBaseRate').jqGrid('editRow', rowid, true); 
        //},
        loadComplete: function (data) {
            $(this).find(">tbody>tr.jqgrow:odd").addClass("myAltRowClassEven");
            $(this).find(">tbody>tr.jqgrow:even").addClass("myAltRowClassOdd");
            $("#jqgServiceBaseRate").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
            SetGridControlByAction(); fnJqgridSmallScreen('jqgServiceBaseRate');
        }
    }).jqGrid('navGrid', '#jqpServiceBaseRate', { add: false, edit: false, search: false, del: false, refresh: true, refreshstate: "current" });
    $("#btnSave").show();
}

function SetGridControlByAction() {
    $("#btnSave").attr("disabled", false);
    //if (_userFormRole.IsEdit === false) {
    //    $("#btnSave").attr("disabled", true);
    //}
}

function fnSaveServiceBaseRate() {
   
    if (IsStringNullorEmpty($("#cboBusinessKey").val())) {
        fnAlert("w", "EMR_01_00", "UI0064", errorMsg.SelectLocation_E1);
        return;
    }
    if (IsStringNullorEmpty($("#cboRateType").val())) {
        fnAlert("w", "EMR_01_00", "UI0198", errorMsg.SelectRateType_E2);
        return;
    }
    if (IsStringNullorEmpty($("#cboCurrencyCode").val())) {
        fnAlert("w", "EMR_01_00", "UI0199", errorMsg.CurrencyCode_E3);
        return;
    }
    $("#jqgServiceBaseRate").jqGrid('editCell', 0, 0, false);
    var Service_BR = [];
    var id_list = jQuery("#jqgServiceBaseRate").jqGrid('getDataIDs');
    //var id_list = jQuery("#jqgServiceBaseRate").getGridParam('data');

    for (var i = 0; i < id_list.length; i++) {
        var rowId = id_list[i];
        var rowData = jQuery('#jqgServiceBaseRate').jqGrid('getRowData', rowId);

        
        Service_BR.push({
            BusinessKey: $("#cboBusinessKey").val(),
            RateType: $("#cboRateType").val(),
            CurrencyCode: $("#cboCurrencyCode").val(),
            ServiceId: rowData.ServiceId,
            EffectiveDate: GetGridDate(rowData.EffectiveDate),
            ServiceRule: rowData.ServiceRule,
            OpbaseRate: rowData.OpbaseRate,
            IpbaseRate: rowData.IpbaseRate,
            IsIprateWardwise: rowData.IsIprateWardwise,
            ActiveStatus: rowData.ActiveStatus
        });

    }

    $("#btnSave").attr("disabled", true);
    debugger;
    $.ajax({
        url: getBaseURL() + '/ServiceRates/AddOrUpdateServiceBaseRate',
        type: 'POST',
        datatype: 'json',
        //contentType: 'application/json; charset=utf-8',
        data: { obj: Service_BR },
        success: function (response) {
            if (response.Status === true) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#jqgServiceBaseRate").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
            }
            $("#btnSave").attr("disabled", false);
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSave").attr("disabled", false);
        }
    });

}

//$(document).on('focusout', '[role="gridcell"] *', function () {
//    $("#jqgServiceBaseRate").jqGrid('editCell', 0, 0, false);

//});
