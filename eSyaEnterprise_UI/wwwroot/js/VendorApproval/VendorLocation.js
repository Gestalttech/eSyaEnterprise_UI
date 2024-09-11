$(function () {
    $.contextMenu({
        selector: "#btnAPVendorLocation",
        trigger: 'left',
         items: {
             jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditAPLocation(event,'edit') } },
             jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditAPLocation(event,'view') } },
             jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnDeActivateVendor(event,'delete') } },
        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
})


function fnloadAPvendorLocationGrid() {
   
    fnClearAPLocationfields();
    BindAPStatesCodes();

    $("#jqgAPVendorLocation").GridUnload();

    $("#jqgAPVendorLocation").jqGrid({

        url: getBaseURL() + '/Approve/GetVendorLocationsByVendorcode?vendorID=' + $("#txtAPVendorCode").val(),
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
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" onclick="return fnEditAPLocation(event)"><i class="fas fa-pen"></i> ' +localization.Edit+' </button>'
                }
            },
        ],
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth:55,
        loadonce: true,
        pager: "#jqpAPVendorLocation",
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
            fnJqgridSmallScreen("jqgAPVendorLocation");
        },
    }).jqGrid('navGrid', '#jqpAPVendorLocation', { add: false, edit: false, search: false, del: false, refresh: false })
        .jqGrid('navButtonAdd', '#jqpAPVendorLocation', {
            caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshAPlocationGrid
        });
    fnAddGridSerialNoHeading();
    
}

function fnSaveAPLocation() {
   
    if (IsValidAPLocation() == false) {
        return;
    }
        var vendorloc = {
            VendorId: $("#txtAPVendorCode").val(),
            VendorLocationId: $("#txtAPlocationId").val() === '' ? 0 : $("#txtAPlocationId").val(),
            IsLocationDefault: $("#chkAPDefaulultloc").parent().hasClass("is-checked"),
            VendorLocation: $("#txtAPvendorlocation").val(),
            VendorAddress: $("#txtAPaddress").val(),
            Isdcode: $("#cboAPVendorMobile").val(),
            ContactPerson: $("#txtAPcontactperson").val(),
            MobileNumber: $("#txtAPVendorMobile").val(),
            WIsdcode: $("#cboAPVendorWhatsAppNumber").val(),
            WhatsappNumber: $("#txtAPVendorWhatsAppNumber").val(),
            StateCode: $("#cboAPStateCode").val(),
            EMailId: $("#txtAPvendoremailid").val(),
            ActiveStatus: $("#chkAPlocationstatus").parent().hasClass("is-checked")

        };
    $.ajax({
        url: getBaseURL() + '/Approve/InsertOrUpdateVendorLocation',
        type: 'POST',
        datatype: 'json',
        data: { vendorloc },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                fnRefreshAPlocationGrid();
                $("#btnAPlocationsave").html("<i class='fa fa-save'></i> Save");
                fnClearAPLocationfields();
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

function fnEditAPLocation(e) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgAPVendorLocation').jqGrid('getRowData', rowid);
    $("#txtAPlocationId").val(rowData.VendorLocationId);
    $('#cboAPVendorMobile').val(rowData.Isdcode);
    $('#cboAPVendorMobile').selectpicker('refresh');
    BindAPStatesCodes();
    $('#cboAPStateCode').val(rowData.StateCode).selectpicker('refresh');
    $("#txtAPcontactperson").val(rowData.ContactPerson);
    $('#txtAPVendorMobile').val(rowData.MobileNumber);
    
    $('#cboAPVendorWhatsAppNumber').val(rowData.WIsdcode);
    $('#cboAPVendorWhatsAppNumber').selectpicker('refresh');

    $('#txtAPVendorWhatsAppNumber').val(rowData.WhatsappNumber);
    $('#txtAPaddress').val(rowData.VendorAddress);
    $('#txtAPvendorlocation').val(rowData.VendorLocation);
    $('#txtAPvendoremailid').val(rowData.EMailId);
    if (rowData.ActiveStatus == 'true') {
        $("#chkAPlocationstatus").parent().addClass("is-checked");
    }
    else {
        $("#chkAPlocationstatus").parent().removeClass("is-checked");
    }

    if (rowData.IsLocationDefault == 'true') {
        $("#chkAPDefaulultloc").parent().addClass("is-checked");
    }
    else {
        $("#chkAPDefaulultloc").parent().removeClass("is-checked");
    }

    $("#btnAPlocationsave").html("<i class='fa fa-sync'></i> "+localization.Update);
}

function IsValidAPLocation() {
     if (IsStringNullorEmpty($("#txtAPVendorCode").val())) {
         fnAlert("w", "EVN_01_00", "UI0217", errorMsg.CreateVendordetails_E5);
        return false;
    }
    if (IsStringNullorEmpty($("#txtAPcontactperson").val())) {
        fnAlert("w", "EVN_01_00", "UI0228", errorMsg.ContactPerson_E18);
        return false;
    }
    if ($("#cboAPVendorMobile").val() == 0 || $("#cboAPVendorMobile").val() == "0" || IsStringNullorEmpty($("#cboAPVendorMobile").val())) {
        fnAlert("w", "EVN_01_00", "UI0137", errorMsg.ISD_E19);
        return false;
    }
    if (IsStringNullorEmpty($("#txtAPVendorMobile").val())) {
        fnAlert("w", "EVN_01_00", "UI0138", errorMsg.MobileNo_E20);
        return false;
    }
    if ($("#cboAPStateCode").val() == 0 || $("#cboAPStateCode").val() == "0" || IsStringNullorEmpty($("#cboAPStateCode").val())) {
        fnAlert("w", "EVN_01_00", "UI0067", errorMsg.StateCode_E28);
        return false;
    }

    if (IsStringNullorEmpty($("#txtAPvendoremailid").val())) {
        fnAlert("w", "EVN_01_00", "UI0139", errorMsg.EmailID_E12);
        return false;
    }
   
    var validemail = IsValidateEmail($("#txtAPvendoremailid").val());
    if (validemail == false) {
        fnAlert("w", "EVN_01_00", "UI0140", errorMsg.ValidEmailID_E13);
        return false;
    } 
    if ($("#cboAPVendorWhatsAppNumber").val() == 0 || $("#cboAPVendorWhatsAppNumber").val() == "0" || IsStringNullorEmpty($("#cboAPVendorWhatsAppNumber").val())) {
        fnAlert("w", "EVN_01_00", "UI0244", errorMsg.VendorWhatsAppNumber_E29);
        return false;
    }
    if (IsStringNullorEmpty($("#txtAPVendorWhatsAppNumber").val())) {
        fnAlert("w", "EVN_01_00", "UI0245", errorMsg.WhatsAppNumber_E27);
        return false;
    }
    if (IsStringNullorEmpty($("#txtAPaddress").val())) {
        fnAlert("w", "EVN_01_00", "UI0229", errorMsg.Address_E21);
        return false;
    }
    if (IsStringNullorEmpty($("#txtAPvendorlocation").val())) {
        fnAlert("w", "EVN_01_00", "UI0223", errorMsg.VendorLocation_E11);
        return false;
    }
   
}

function fnRefreshAPlocationGrid() {
    $("#jqgAPVendorLocation").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}

function fnClearAPLocationfields () {
    $("#chkAPDefaulultloc").parent().removeClass("is-checked");
    $("#cboAPVendorMobile").val("0");
    $('#cboAPVendorMobile').selectpicker('refresh');
    $("#cboAPStateCode").val("0");
    $('#cboAPStateCode').selectpicker('refresh');
    $("#txtAPlocationId").val('');
    $("#txtAPaddress").val('');
    $("#txtAPvendorlocation").val('');
    $("#txtAPcontactperson").val(''),
    $("#txtAPVendorMobile").val('');
    $("#cboAPVendorWhatsAppNumber").val("0");
    $('#cboAPVendorWhatsAppNumber').selectpicker('refresh');
    $("#txtAPVendorWhatsAppNumber").val('');
    $("#txtAPvendoremailid").val('');
    $("#chkAPlocationstatus").parent().addClass("is-checked");
    $("#btnAPlocationsave").html("<i class='fa fa-save'></i> " +localization.Save);
}


function fnCboISDCodes_onChanged()
{
    BindAPStatesCodes();
}

function BindAPStatesCodes() {
  
    $("#cboAPStateCode").empty();
    $.ajax({
        url: getBaseURL() + '/Approve/GetStatesbyISDCode?isdCode=' + $("#cboAPVendorMobile").val(),
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", xhr.StatusCode, xhr.statusText);
        },
        success: function (response, data) {
            if (response != null) {
                //refresh each time
                $("#cboAPStateCode").empty();

                $("#cboAPStateCode").append($("<option value='0'> Select </option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboAPStateCode").append($("<option></option>").val(response[i]["StateCode"]).html(response[i]["StateDesc"]));
                }
                $('#cboAPStateCode').selectpicker('refresh');
            }
            else {
                $("#cboAPStateCode").empty();
                $("#cboAPStateCode").append($("<option value='0'> Select </option>"));
                $('#cboAPStateCode').selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });


}