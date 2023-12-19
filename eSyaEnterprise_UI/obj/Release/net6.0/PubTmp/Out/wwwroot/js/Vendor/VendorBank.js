
var isEdit = 0;
function fnLoadBankDetails() {

    fnClearBankDetails();

    $("#jqgVendorBankDetails").GridUnload();

    $("#jqgVendorBankDetails").jqGrid({
        url: getBaseURL() + '/CreateVendor/GetVendorBankdetailsByVendorcode?VendorId=' + $("#txtVendorCode").val(),
        mtype: 'POST',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        serializeGridData: function (postdata) {
            postdata.VendorId = $("#txtVendorCode").val();
            return JSON.stringify(postdata.VendorId);
        },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["", localization.BeneficiaryName, localization.BankName, localization.BankAcNo, localization.SwiftCode, localization.IFSCCode, localization.Active, localization.Actions],
        colModel: [
        { name: 'VendorId', width: '40', resizable: false, hidden: true },
        { name: 'BenificiaryName', width: '170', resizable: false },
        { name: 'BenificiaryBankName', width: '170', resizable: false },
        { name: 'BenificiaryBankAccountNo', width: '150', resizable: false },
        { name: 'BankSwiftcode', width: '80', resizable: false },
        { name: 'BankIfsccode', width: '80', resizable: false },
        { name: "ActiveStatus", width: '50', editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
        {
            name: 'edit', width: '100', resizable: false, align: 'left',
            formatter: function (cellValue, options, rowObject) {
                var ret = '<button class="btn-xs ui-button ui- widget ui-corner-all btn-jqgrid" title="Edit" onclick="fnEditBankDetails(event)\"><i class="fas fa-pen"></i>' + localization.Edit+' </button>'
                return ret;
            },
            }
        ],
        rowNum: 10,
        rowList: [10, 20, 40],
        rownumWidth:55,
        loadonce: true,
        pager: "#jqpVendorBankDetails",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        scroll: false,
        loadonce: true,
        width: 'auto',
        height: 'auto',
        autowidth: 'auto',
        shrinkToFit: true,
        forceFit: true,
        caption: localization.VendorBank,
     }).jqGrid('navGrid', '#jqpVendorBankDetails', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpVendorBankDetails', {
        caption: '<span class="fa fa-sync" data-toggle="modal"></span> Refresh', buttonicon: 'none', id: 'custReload', position: 'first', onClickButton: fnRefreshBankGrid
    });
    fnAddGridSerialNoHeading();
}
 
function fnEditBankDetails(e) {
    isEdit = 1;
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgVendorBankDetails').jqGrid('getRowData', rowid);
    
    $("#txtbeneficiaryname").val(rowData.BenificiaryName);
    $("#txtbankname").val(rowData.BenificiaryBankName);
    $("#txtbankacno").val(rowData.BenificiaryBankAccountNo);
    $("#txtbankacno").attr('readonly', true);
    $("#txtswiftcode").val(rowData.BankSwiftcode);
    $("#txtifsccode").val(rowData.BankIfsccode);
    if (rowData.ActiveStatus == 'true') {
        $("#chkbanktatus").parent().addClass("is-checked");
    }
    else {
        $("#chkbanktatus").parent().removeClass("is-checked");
    }
    $("#btnSaveBankDetails").html("<i class='fa fa-sync'></i> " +localization.Update);
}

function fnSaveBankDetails() {
    if (IsValidBankDetails() == false) {
        return;
    }
   
    
    var bankdetails = {
        VendorId: $("#txtVendorCode").val(),
        BenificiaryBankAccountNo: $("#txtbankacno").val(),
        BenificiaryName: $("#txtbeneficiaryname").val(),
        BenificiaryBankName: $("#txtbankname").val(),
        BankIfsccode: $("#txtifsccode").val(),
        BankSwiftcode: $("#txtswiftcode").val(),
        ActiveStatus: $("#chkbanktatus").parent().hasClass("is-checked"),
        IsEdit: isEdit
        };
  
   
    $.ajax({

        url: getBaseURL() + '/CreateVendor/InsertOrUpdateVendorBankdetails',
        type: 'POST',
        datatype: 'json',
        data: { bankdetails },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                fnRefreshBankGrid();
                fnClearBankDetails();
                return true;
            }
            else{
                fnAlert("e", "", response.StatusCode, response.Message);
                return false;

            }
            
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });
}
function IsValidBankDetails() {
    if (IsStringNullorEmpty($("#txtVendorCode").val())) {
        fnAlert("w", "EVN_01_00", "UI0217", errorMsg.CreateVendordetails_E5);
        return false;
    }
    if (IsStringNullorEmpty($("#txtbeneficiaryname").val())) {
        fnAlert("w", "EVN_01_00", "UI0218", errorMsg.BeneficiaryName_E6);
        return false;
    }
    if (IsStringNullorEmpty($("#txtbankname").val())) {
        fnAlert("w", "EVN_01_00", "UI0219", errorMsg.BankName_E7);
        return false;
    }
    if (IsStringNullorEmpty($("#txtbankacno").val())) {
        fnAlert("w", "EVN_01_00", "UI0220", errorMsg.AccountName_E8);
        return false;
    }
    if (IsStringNullorEmpty($("#txtswiftcode").val())) {
        fnAlert("w", "EVN_01_00", "UI0221", errorMsg.SwiftCode_E9);
        return false;
    }

    if (IsStringNullorEmpty($("#txtifsccode").val())) {
        fnAlert("w", "EVN_01_00", "UI0222", errorMsg.IFSCCode_E10);
        return false;
    }
}

function fnRefreshBankGrid() {
    $("#jqgVendorBankDetails").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearBankDetails() {
    isEdit = 0;
    $("#txtbeneficiaryname").val('');
    $("#txtbankname").val('');
    $("#txtbankacno").val('');
    $("#txtbankacno").attr('readonly', false);
    $("#txtswiftcode").val('');
    $("#txtifsccode").val('');
    $("#chkbanktatus").parent().addClass("is-checked");
    $("#btnSaveBankDetails").html("<i class='fa fa-save'></i> " +localization.Save);
    
}
