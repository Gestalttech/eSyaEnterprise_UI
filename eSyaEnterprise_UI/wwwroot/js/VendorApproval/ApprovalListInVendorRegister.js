var businesslocation = false;
var activeTabName = "";
var IsEdit = '';
$(function () {
    $("#lblDisplayNames").val('');
    
    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnVendorMaster",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditVendor(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditVendor(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnDeActivateVendor(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");


    $(".dot").click(function () {
        $('.dot').removeClass('active');
        var alphabet = $(this).text();
        fnloadVendorGrid(alphabet);
        $(this).addClass('active');
    });
    $("#lblFormName").text("Vendor Codes");
    $("#accordion").hide();

    $("#jqgVendorRegister").jqGrid({


        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.VendorId, localization.VendorName, "", "", localization.CreditType, localization.CreditPeriodindays, localization.VendorStatus, localization.IsBlackListed, localization.ScoreCard, localization.Active, localization.Actions],
        colModel: [
            { name: "VendorId", width: 70, editable: true, align: 'left', hidden: true },
            { name: "VendorName", width: 170, editable: true, align: 'left', hidden: false },
            { name: "PreferredPaymentMode", width: 10, editable: true, align: 'left', hidden: true },
            { name: "VendorClass", width: 10, editable: true, align: 'left', hidden: true },
            { name: "CreditType", width: 50, editable: true, align: 'center' },
            { name: "CreditPeriod", width: 100, editable: true, align: 'left', resizable: true },
            { name: "ApprovalStatus", width: 70, editable: true, align: 'left' },
            { name: "IsBlackListed", width: 70, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 50 } },
            { name: "SupplierScore", editable: true, width: 90, align: 'left', },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return "<a href='javascript:fnDelete_TaxStructure()' class='ui-icon ui-icon-closethick'></a>";
                }
            },
        ],
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: 55,
        loadonce: true,
        pager: "#jqpVendorRegister",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        caption: localization.VendorRegister,
        loadComplete: function () {
          
        },
    }).jqGrid('navGrid', '#jqpVendorRegister', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpVendorRegister', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshVendorGrid
    }).jqGrid('navButtonAdd', '#jqpVendorRegister', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddVendor
    });
    fnAddGridSerialNoHeading();
    $('#jqgAdd').addClass('ui-state-disabled');
});
//$(document).on('click',function () { //When you left-click
//    var menu = $('.context-menu-root');
//    menu.css({ display: 'none' });//Hide the menu
//});
function fnloadVendorGrid(alphabet) {

    $("#jqgVendorRegister").GridUnload();

    $("#jqgVendorRegister").jqGrid({

        url: getBaseURL() + '/CreateVendor/GetVendors?Alphabet=' + alphabet,
        mtype: 'POST',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["", localization.VendorName, "", "", localization.CreditType, localization.CreditPeriodindays, localization.VendorStatus, localization.IsBlackListed, localization.ScoreCard, localization.Active, localization.Actions],
        colModel: [
            { name: "VendorId", width: 70, editable: true, align: 'left', hidden: true },
            { name: "VendorName", width: 170, editable: true, align: 'left', hidden: false },
            { name: "PreferredPaymentMode", width: 10, editable: true, align: 'left', hidden: true },
            { name: "VendorClass", width: 10, editable: true, align: 'left', hidden: true },
            { name: "CreditType", width: 50, editable: true, align: 'center' },
            { name: "CreditPeriod", width: 100, editable: true, align: 'left', resizable: true },
            { name: "ApprovalStatus", editable: true, width: 70, align: 'left', resizable: false, edittype: "select", formatter: 'select', editoptions: { value: "true: Approved;false: UnApproved" } },
            { name: "IsBlackListed", editable: true, width: 70, align: 'left', resizable: false, edittype: "select", formatter: 'select', editoptions: { value: "true: Yes;false: NO" } },
            { name: "SupplierScore", editable: true, width: 90, align: 'left', },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },

            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnVendorMaster"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: 55,
        loadonce: true,
        pager: "#jqpVendorRegister",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        scrollOffset: 0,
        caption: localization.VendorRegister,
        loadComplete: function (data) {
            /* SetGridControlByAction();*/
            $('#jqgAdd').addClass('ui-state-disabled');
            fnJqgridSmallScreen("jqgVendorRegister");
        },
        onSelectRow: function (rowid, status, e) {
           },

    }).jqGrid('navGrid', '#jqpVendorRegister', { add: false, edit: false, search: false, del: false, refresh: false })
        .jqGrid('navButtonAdd', '#jqpVendorRegister', {
            caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshVendorGrid
        }).jqGrid('navButtonAdd', '#jqpVendorRegister', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddVendor
        });
    fnAddGridSerialNoHeading();
}
$('#v-pills-tab button').on('click', function (e) {

    e.preventDefault()
    $(".tab-pane").removeClass('show active');
    activeTabName = $(this).attr("data-bs-target");
    $(activeTabName).addClass("show active");
    //if (activeTabName == "#statutorydetails") {
    //    fnGridLoadCustomerLocation();
    //}

    $("#lblDisplayNames").text('');
    $("#lblDisplayNames").text(e.currentTarget.innerHTML);
})

function fnAddVendor() {
    fnEnableVendorRegister(false);
    $('#txtVendorCode').val('');

    $("#divForm").css("display", "block");
    $("#divGrid").hide();
    $("#chkActiveStatus").parent().addClass("is-checked");
    businesslocation = false;
    $("#btnSaveVendorDetails").html('<i class="fa fa-save"></i> ' + localization.Save);
    fnSetSidebar();
    $("#lblDisplayNames").text("VendorDetails");
}

function fnEditVendor(e, actiontype) {
    debugger;
    var rowid = $("#jqgVendorRegister").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgVendorRegister').jqGrid('getRowData', rowid);

    $("#txtVendorCode").val(rowData.VendorId);
    $("#txtVendorName").val(rowData.VendorName);
    $('#cboCreditType').val(rowData.CreditType);
    $('#cboCreditType').selectpicker('refresh');
    $("#txtCreditPeriod").val(rowData.CreditPeriod);
    $('#cboPayMode').val(rowData.PreferredPaymentMode);
    $('#cboPayMode').selectpicker('refresh');
    $('#cboVendorClass').val(rowData.VendorClass);
    $('#cboVendorClass').selectpicker('refresh'); $("#lblDisplayNames").text("VendorDetails");
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }

    if (rowData.IsBlackListed == 'true') {
        $("#chkIsBlockList").parent().addClass("is-checked");
    }
    else {
        $("#chkIsBlockList").parent().removeClass("is-checked");
    }
    $("#divForm").css("display", "block");
    $("#divGrid").hide();
    $("#vendorDetails-tab").addClass("active");
    $("#vendorDetails").addClass("show active");

    if ($("#txtVendorCode").val() > 0) {
        $("#divForm").css("display", "block");
        $("#divGrid").hide();

        $("#vendorDetails-tab").addClass("active");
        $("#vendorDetails").addClass("show active");
    }
    fnSetSidebar();  //Setting the sidebar - UI

    eSyaParams.ClearValue();

    $.ajax({
        async: false,
        url: getBaseURL() + '/CreateVendor/GetVendorParameterList?vendorID=' + $("#txtVendorCode").val(),
        type: 'POST',
        datatype: 'json',
        success: function (result) {

            if (result != null) {
                eSyaParams.SetJSONValue(result);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);

        }
    });


    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EVN_02_00", "UIC02", errorMsg.editauth_E2);
            return;
        }
        $("#btnSaveUnitofMeasure").show();
        fnEnableVendorRegister(false);
        $("#btnSaveVendorDetails").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("#btnSaveSMSInformation").html('<i class="fa fa-sync"></i> Update');
        $("#btnSaveBankDetails,#btnPartNumberDisabled,#btnsavestatutory,#btnSaveBusinessLink,#btnSaveVendorDetails,#btnlocationsave,#btnSaveSupplyGroup").show();
        businesslocation = false;
    }
    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "EVN_02_00", "UIC03", errorMsg.vieweauth_E3);
            return;
        }
        $("#btnSaveUnitofMeasure").hide();
        fnEnableVendorRegister(true);
        $("#btnSaveBankDetails,#btnPartNumberDisabled,#btnsavestatutory,#btnSaveBusinessLink,#btnSaveVendorDetails,#btnlocationsave,#btnSaveSupplyGroup").hide();
        businesslocation = true;
    }
    $("#PopupUnitofMeasure").on('hidden.bs.modal', function () {
        $("#btnSaveUnitofMeasure").show();
        fnEnableVendorRegister(false);
    });
}

function fnSaveVendor() {
    if (IsValidVendor() == false) {
        return;
    }
    
    var vendor = {
        VendorId: $("#txtVendorCode").val() === '' ? 0 : $("#txtVendorCode").val(),
        VendorName: $("#txtVendorName").val(),
        CreditType: $("#cboCreditType").val(),
        VendorClass: $("#cboVendorClass").val(),
        CreditPeriod: $("#txtCreditPeriod").val(),
        PreferredPaymentMode: $("#cboPayMode").val(),
        IsBlackListed: $('#chkIsBlockList').parent().hasClass("is-checked"),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };
    var fmParams = eSyaParams.GetJSONValue();
    vendor.l_FormParameter = fmParams;
    $.ajax({

        url: getBaseURL() + '/CreateVendor/InsertOrUpdateVendor',
        type: 'POST',
        datatype: 'json',
        data: { vendor },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                fnRefreshVendorGrid();
                ReadVendorCode(response);
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

function IsValidVendor() {

    if (IsStringNullorEmpty($("#txtVendorName").val())) {
        fnAlert("w", "EVN_02_00", "UI0225", errorMsg.VendorName_E15);
        return false;
    }
    if (IsStringNullorEmpty($("#txtCreditPeriod").val())) {
        fnAlert("w", "EVN_02_00", "UI0226", errorMsg.CreditDays_E16);
        return false;
    }

    if ($("#txtCreditPeriod").val() == 0 || $("#txtCreditPeriod").val() == "0") {
        fnAlert("w", "EVN_02_00", "UI0227", errorMsg.CreditPeriod_E17);
        return false;
    }
    if ($("#cboPayMode").val() == 0 || $("#cboPayMode").val() == "0" || IsStringNullorEmpty($("#cboPayMode").val())) {
        fnAlert("w", "EVN_02_00", "UI0289", errorMsg.PaymentPreferredMode_E25);

        return false;
    }

    if ($("#cboVendorClass").val() == 0 || $("#cboVendorClass").val() == "0" || IsStringNullorEmpty($("#cboVendorClass").val())) {
        fnAlert("w", "EVN_02_00", "UI0290", errorMsg.VendorClass_E26);
        return false;
    }

}

function ReadVendorCode(res) {
    $("#txtVendorCode").val('');
    $("#txtVendorCode").val(res.VendorId);
    if ($("#txtVendorCode").val() > 0) {
        $("#accordion").show();
    }
}

function fnRefreshVendorGrid() {
    $("#jqgVendorRegister").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
    $("#vendorDetails-tab").addClass("active");
    $("#vendorDetails").addClass("show active");
}

function fnClearVendorReg() {
    $("#txtVendorCode").val('');
    $("#txtVendorName").val('');
    $('#cboCreditType').val("P");
    $('#cboCreditType').selectpicker('refresh');
    $("#txtCreditPeriod").val('');
    $('#cboPayMode').val("0");
    $('#cboPayMode').selectpicker('refresh');
    $('#cboVendorClass').val("0");
    $('#cboVendorClass').selectpicker('refresh');
    $("#chkActiveStatus").prop('disabled', false);
    $('#chkIsBlockList').prop('checked', true);
    $('#chkIsBlockList').parent().removeClass('is-checked');
    $('#chkIsBlockList').prop('checked', false);
    $("#VendorLocations").removeClass('show');
    $("#txtVendorCode").val('');
    fnRefreshVendorGrid();
    $("#btnSaveBankDetails,#btnPartNumberDisabled,#btnsavestatutory,#btnSaveBusinessLink,#btnSaveVendorDetails,#btnlocationsave,#btnSaveSupplyGroup").show();
    //location.reload();
    businesslocation = false;
    $("#lblDisplayNames").text("VendorDetails");
    eSyaParams.ClearValue();
}


function fnCloseVendorDetails() {
    $("#divGrid").show();
    $("#divForm").css("display", "none");
    $(".tab-pane").removeClass('active show');
    $("#v-pills-tab button").removeClass("active");
    $('#txtVendorCode').val("0");
    fnClearVendorReg();
    fnClearStatutoryDetails();
}



//function SetGridControlByAction() {
//    $('#jqgAdd').removeClass('ui-state-disabled');

//    if (_userFormRole.IsInsert === false) {
//        $('#jqgAdd').addClass('ui-state-disabled');
//    }
//}

function fnEnableVendorRegister(val) {
    $("input,textarea").attr('readonly', val);
    $("#chklocationstatus").prop('disabled', val);
    $("input[id*='chk']").attr('disabled', val);
    $("select").next().attr('disabled', val);
    $("#chkActiveStatus").attr('disabled', true);
}

function fnDeActivateVendor(e) {
    fnSetSidebar();
    if (_userFormRole.IsDelete === false) {
        fnAlert("w", "EVN_02_00", "UIC04", errorMsg.deleteauth_E4);
        return;
    }



    var rowid = $("#jqgVendorRegister").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgVendorRegister').jqGrid('getRowData', rowid);

    var vcode = rowData.VendorId;
    var a_status;
    var msg;
    var lbl;
    //Activate or De Activate the status
    if (rowData.ActiveStatus === "true") {
        a_status = false;
        msg = "Are you sure you want to De Activate Vendor?";
        lbl = localization.DeActivate;
    }
    else {
        a_status = true;
        msg = "Are you sure you want Activate Vendor?";
        lbl = localization.Activate;
    }
    bootbox.confirm({
        title: 'Vendor',
        message: msg,
        buttons: {
            confirm: {
                label: lbl,
                className: 'mdl-button  primary-button'
            },
            cancel: {
                label: 'Cancel',
                className: 'mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect  cancel-button cancel-button'
            }
        },
        callback: function (result) {
            if (result) {
                if (vcode == null || vcode == undefined || vcode == "0" || vcode == '') {
                    alert("Could not Delete");
                    return false;
                }
                $.ajax({
                    url: getBaseURL() + '/CreateVendor/ActiveOrDeActiveVendor?status=' + a_status + '&vendorID=' + vcode,
                    type: 'POST',
                    success: function (response) {

                        if (response.Status) {
                            fnAlert("s", "", response.StatusCode, response.Message);
                            fnRefreshVendorGrid();
                        }
                        else {
                            fnAlert("e", "", response.StatusCode, response.Message);
                        }
                        $("#jqgVendorRegister").setGridParam({ datatype: 'json' }).trigger('reloadGrid');
                    },
                    error: function (response) {
                        fnAlert("e", "", response.StatusCode, response.statusText);
                    }
                });
            }
        }
    });
}

function fnSetSidebar() {
    var _tabcontent = $(".tab-content").offset();
    var _fullH = $(window).height();
    var _newTabH = (_fullH - _tabcontent.top - 15);
    var windW = $(window).width();
    if (windW > 1099) {
        $(".tab-content,#v-pills-tab").css({ "height": _newTabH, "overflow-y": "auto" });
    }
    else {
        $(".tab-content").css({ "height": _newTabH, "overflow-y": "auto" });
    }
}