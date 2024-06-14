$(document).ready(function () {
    $.contextMenu({
        selector: "#btnVendorLocation",
        trigger: 'left',
         items: {
             jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditLocation(event, 'edit') } },
             jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditLocation(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnDeActivateVendor(event, 'delete') } },
        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
})


function fnloadvendorLocationGrid() {
   
    fnClearLocationfields();
    BindStatesCodes();

    $("#jqgVendorLocation").GridUnload();

    $("#jqgVendorLocation").jqGrid({

        url: getBaseURL() + '/CreateVendor/GetVendorLocationsByVendorcode?vendorID=' + $("#txtVendorCode").val(),
        mtype: 'POST',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.VendorId, localization.VendorLocationId, localization.Isdcode, localization.StateCode, localization.VendorLocation, localization.VendorAddress, localization.ContactPerson, localization.MobileNumber, localization.ISDCodeWhatsAppNumber, localization.WhatsAppNumber, localization.EmailID, localization.DefaultLocation, localization.Active, localization.Actions],
        colModel: [
            { name: "VendorId", width: 70, editable: true, align: 'left', hidden: true },
            { name: "VendorLocationId", width: 70, editable: true, align: 'left', hidden: true },
            { name: "Isdcode", width: 70, editable: true, align: 'left', hidden: true },
            { name: "StateCode", width: 70, editable: true, align: 'left', hidden: true },
            { name: "VendorLocation", width: 120, editable: true, align: 'left', hidden: false },
            { name: "VendorAddress", width: 150, editable: true, align: 'left', hidden: false },
            { name: "ContactPerson", width: 110, editable: true, align: 'left', },
            { name: "MobileNumber", width: 120, editable: true, align: 'left' },
            { name: "WIsdcode", width: 70, editable: true, align: 'left', hidden: true },
            { name: "WhatsappNumber", width: 120, editable: true, align: 'left', resizable: true },
            { name: "EMailId", width: 170, editable: true, align: 'left' },
            { name: "IsLocationDefault", width: 100, editable: true, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "ActiveStatus", width: 60, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 80, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" onclick="return fnEditLocation(event)"><i class="fas fa-pen"></i> ' +localization.Edit+' </button>'
                }
            },
        ],
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth:55,
        loadonce: true,
        pager: "#jqpVendorLocation",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        caption: localization.VendorLocation,
        loadComplete: function () {
            fnJqgridSmallScreen("jqgVendorLocation");
        },
    }).jqGrid('navGrid', '#jqpVendorLocation', { add: false, edit: false, search: false, del: false, refresh: false })
        .jqGrid('navButtonAdd', '#jqpVendorLocation', {
            caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshlocationGrid
        });
    fnAddGridSerialNoHeading();
    
}

function fnSaveLocation() {
   
    if (IsValidLocation() == false) {
        return;
    }
        var vendorloc = {
            VendorId: $("#txtVendorCode").val(),
            VendorLocationId: $("#txtlocationId").val() === '' ? 0 : $("#txtlocationId").val(),
            IsLocationDefault: $("#chkDefaulultloc").parent().hasClass("is-checked"),
            VendorLocation: $("#txtvendorlocation").val(),
            VendorAddress: $("#txtaddress").val(),
            Isdcode: $("#cboVendorMobile").val(),
            ContactPerson: $("#txtcontactperson").val(),
            MobileNumber: $("#txtVendorMobile").val(),
            WIsdcode: $("#cboVendorWhatsAppNumber").val(),
            WhatsappNumber: $("#txtVendorWhatsAppNumber").val(),
            StateCode: $("#cboStateCode").val(),
            EMailId: $("#txtvendoremailid").val(),
            ActiveStatus: $("#chklocationstatus").parent().hasClass("is-checked")

        };
    $.ajax({
        url: getBaseURL() + '/CreateVendor/InsertOrUpdateVendorLocation',
        type: 'POST',
        datatype: 'json',
        data: { vendorloc },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                fnRefreshlocationGrid();
                $("#btnlocationsave").html("<i class='fa fa-save'></i> Save");
                fnClearLocationfields();
                return true;
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                return false;
            }
            
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });

}

function fnEditLocation(e) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgVendorLocation').jqGrid('getRowData', rowid);
    $("#txtlocationId").val(rowData.VendorLocationId);
    $('#cboVendorMobile').val(rowData.Isdcode);
    $('#cboVendorMobile').selectpicker('refresh');
    BindStatesCodes();
    $('#cboStateCode').val(rowData.StateCode).selectpicker('refresh');
    $("#txtcontactperson").val(rowData.ContactPerson);
    $('#txtVendorMobile').val(rowData.MobileNumber);
    
    $('#cboVendorWhatsAppNumber').val(rowData.WIsdcode);
    $('#cboVendorWhatsAppNumber').selectpicker('refresh');

    $('#txtVendorWhatsAppNumber').val(rowData.WhatsappNumber);
    $('#txtaddress').val(rowData.VendorAddress);
    $('#txtvendorlocation').val(rowData.VendorLocation);
    $('#txtvendoremailid').val(rowData.EMailId);
    if (rowData.ActiveStatus == 'true') {
        $("#chklocationstatus").parent().addClass("is-checked");
    }
    else {
        $("#chklocationstatus").parent().removeClass("is-checked");
    }

    if (rowData.IsLocationDefault == 'true') {
        $("#chkDefaulultloc").parent().addClass("is-checked");
    }
    else {
        $("#chkDefaulultloc").parent().removeClass("is-checked");
    }

    $("#btnlocationsave").html("<i class='fa fa-sync'></i> "+localization.Update);
}

function IsValidLocation() {
     if (IsStringNullorEmpty($("#txtVendorCode").val())) {
         fnAlert("w", "EVN_01_00", "UI0217", errorMsg.CreateVendordetails_E5);
        return false;
    }
    if (IsStringNullorEmpty($("#txtcontactperson").val())) {
        fnAlert("w", "EVN_01_00", "UI0228", errorMsg.ContactPerson_E18);
        return false;
    }
    if ($("#cboVendorMobile").val() == 0 || $("#cboVendorMobile").val() == "0" || IsStringNullorEmpty($("#cboVendorMobile").val())) {
        fnAlert("w", "EVN_01_00", "UI0137", errorMsg.ISD_E19);
        return false;
    }
    if (IsStringNullorEmpty($("#txtVendorMobile").val())) {
        fnAlert("w", "EVN_01_00", "UI0138", errorMsg.MobileNo_E20);
        return false;
    }
    if ($("#cboStateCode").val() == 0 || $("#cboStateCode").val() == "0" || IsStringNullorEmpty($("#cboStateCode").val())) {
        fnAlert("w", "EVN_01_00", "UI0067", errorMsg.StateCode_E28);
        return false;
    }

    if (IsStringNullorEmpty($("#txtvendoremailid").val())) {
        fnAlert("w", "EVN_01_00", "UI0139", errorMsg.EmailID_E12);
        return false;
    }
   
    var validemail = IsValidateEmail($("#txtvendoremailid").val());
    if (validemail == false) {
        fnAlert("w", "EVN_01_00", "UI0140", errorMsg.ValidEmailID_E13);
        return false;
    } 
    if ($("#cboVendorWhatsAppNumber").val() == 0 || $("#cboVendorWhatsAppNumber").val() == "0" || IsStringNullorEmpty($("#cboVendorWhatsAppNumber").val())) {
        fnAlert("w", "EVN_01_00", "UI0244", errorMsg.VendorWhatsAppNumber_E29);
        return false;
    }
    if (IsStringNullorEmpty($("#txtVendorWhatsAppNumber").val())) {
        fnAlert("w", "EVN_01_00", "UI0245", errorMsg.WhatsAppNumber_E27);
        return false;
    }
    if (IsStringNullorEmpty($("#txtaddress").val())) {
        fnAlert("w", "EVN_01_00", "UI0229", errorMsg.Address_E21);
        return false;
    }
    if (IsStringNullorEmpty($("#txtvendorlocation").val())) {
        fnAlert("w", "EVN_01_00", "UI0223", errorMsg.VendorLocation_E11);
        return false;
    }
   
}

function fnRefreshlocationGrid() {
    $("#jqgVendorLocation").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}

function fnClearLocationfields () {
    $("#chkDefaulultloc").parent().removeClass("is-checked");
    $("#cboVendorMobile").val("0");
    $('#cboVendorMobile').selectpicker('refresh');
    $("#cboStateCode").val("0");
    $('#cboStateCode').selectpicker('refresh');
    $("#txtlocationId").val('');
    $("#txtaddress").val('');
    $("#txtvendorlocation").val('');
    $("#txtcontactperson").val(''),
    $("#txtVendorMobile").val('');
    $("#cboVendorWhatsAppNumber").val("0");
    $('#cboVendorWhatsAppNumber').selectpicker('refresh');
    $("#txtVendorWhatsAppNumber").val('');
    $("#txtvendoremailid").val('');
    $("#chklocationstatus").parent().addClass("is-checked");
    $("#btnlocationsave").html("<i class='fa fa-save'></i> " +localization.Save);
}


function fnCboISDCodes_onChanged()
{
    BindStatesCodes();
}

function BindStatesCodes() {
  
    $("#cboStateCode").empty();
    $.ajax({
        url: getBaseURL() + '/CreateVendor/GetStatesbyISDCode?isdCode=' + $("#cboVendorMobile").val(),
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", xhr.StatusCode, xhr.statusText);
        },
        success: function (response, data) {
            if (response != null) {
                //refresh each time
                $("#cboStateCode").empty();

                $("#cboStateCode").append($("<option value='0'> Select </option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboStateCode").append($("<option></option>").val(response[i]["StateCode"]).html(response[i]["StateDesc"]));
                }
                $('#cboStateCode').selectpicker('refresh');
            }
            else {
                $("#cboStateCode").empty();
                $("#cboStateCode").append($("<option value='0'> Select </option>"));
                $('#cboStateCode').selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });


}