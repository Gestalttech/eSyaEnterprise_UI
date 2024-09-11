var businesslocation = false;
var activeTabName = "";
$(function () {
    
    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnAPVendorMaster",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditAPVendor('edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditAPVendor('view') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    fnloadAPVendorGrid();

    //$(".dot").click(function () {
    //    $('.dot').removeClass('active');
    //    var alphabet = $(this).text();

    //    $(this).addClass('active');
    //});
    //$("#lblAPFormName").text("Vendor Codes");
    //$("#accordion").hide();
});
     

function fnloadAPVendorGrid() {

    $("#jqgAPVendorRegister").GridUnload();

    $("#jqgAPVendorRegister").jqGrid({
      
        url: getBaseURL() + '/Approve/GetVendorsForApprovals',
        mtype: 'POST',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.VendorId, localization.VendorName, localization.PreferredPaymentMode, localization.VendorClass, localization.CreditType, localization.CreditPeriodindays, localization.VendorStatus, localization.IsBlackListed, localization.ScoreCard, localization.Active, localization.Actions],
        colModel: [
            { name: "VendorId", width: 70, editable: true, align: 'left', hidden: true }, 
            { name: "VendorName", width: 170, editable: true, align: 'left', hidden: false },
            { name: "PreferredPaymentMode", width: 10, editable: true, align: 'left', hidden: true },
            { name: "VendorClass", width: 10, editable: true, align: 'left', hidden: true },
            { name: "CreditType", width: 50, editable: true, align: 'center' },
            { name: "CreditPeriod", width: 100, editable: true,  align: 'left', resizable: true },
            { name: "ApprovalStatus", editable: true, width: 70, align: 'left', resizable: false, edittype: "select", formatter: 'select', editoptions: { value: "true: Approved;false: UnApproved" } },
            { name: "IsBlackListed", editable: true, width: 70, align: 'left', resizable: false, edittype: "select", formatter: 'select', editoptions: { value: "true: Yes;false: NO" } },
            { name: "SupplierScore", editable: true, width: 90, align: 'left',  },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnAPVendorMaster"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: 55,
        loadonce: true,
        pager: "#jqpAPVendorRegister",
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
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgAPVendorRegister");
        },
  }).jqGrid('navGrid', '#jqpAPVendorRegister', { add: false, edit: false, search: false, del: false, refresh: false })
        .jqGrid('navButtonAdd', '#jqpAPVendorRegister', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshAPVendorGrid
        })
        //.jqGrid('navButtonAdd', '#jqpAPVendorRegister', {
        //caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddAPVendor
        //});
    fnAddGridSerialNoHeading();
}
$('#approveVendor-pills-tab button').on('click', function (e) {
    
    e.preventDefault()
    $(".tab-pane").removeClass('show active');
    activeTabName = $(this).attr("data-bs-target");
    $(activeTabName).addClass("show active");
    //if (activeTabName == "#statutorydetails") {
    //    fnGridLoadCustomerLocation();
    //}
   
    $("#lblAPDisplayNames").text('');
    $("#lblAPDisplayNames").text(e.currentTarget.innerHTML);
})

function fnAddAPVendor() {
    fnEnableVendorRegister(false);
    $('#txtAPVendorCode').val('');
    $('.selectpicker').selectpicker('refresh');
    $("#divAPForm").css("display", "block");
    $("#divAPGrid").hide();
    $("#chkAPActiveStatus").parent().addClass("is-checked");
    businesslocation = false;
    fnSetSidebar();
    $("#lblAPDisplayNames").text("VendorDetails");
}

function fnEditAPVendor(actiontype) {
    
    var rowid = $("#jqgAPVendorRegister").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgAPVendorRegister').jqGrid('getRowData', rowid);
    
    $("#txtAPVendorCode").val(rowData.VendorId);
    $("#txtAPVendorName").val(rowData.VendorName);
    $('#cboAPCreditType').val(rowData.CreditType);
    $('#cboAPCreditType').selectpicker('refresh');
    $("#txtAPCreditPeriod").val(rowData.CreditPeriod);
    $('#cboAPPayMode').val(rowData.PreferredPaymentMode);
    $('#cboAPPayMode').selectpicker('refresh');
    $('#cboAPVendorClass').val(rowData.VendorClass);
    $('#cboAPVendorClass').selectpicker('refresh'); $("#lblAPDisplayNames").text("VendorDetails");
    if (rowData.ActiveStatus == 'true') {
        $("#chkAPActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkAPActiveStatus").parent().removeClass("is-checked");
    }

    if (rowData.IsBlackListed == 'true') {
        $("#chkAPIsBlockList").parent().addClass("is-checked");
    }
    else {
        $("#chkAPIsBlockList").parent().removeClass("is-checked");
    }
    $("#divAPForm").css("display", "block");
    $("#divAPGrid").hide();
    $("#vendorDetailsAP-tab").addClass("active");
    $("#vendorDetails").addClass("show active");
    
    if ($("#txtAPVendorCode").val() > 0) {
        $("#divAPForm").css("display", "block");
        $("#divAPGrid").hide();

        $("#vendorDetailsAP-tab").addClass("active");
        $("#vendorDetailsAP").addClass("show active");
    }
    fnSetSidebar();  //Setting the sidebar - UI
    
    eSyaParams.ClearValue();

    $.ajax({
        async: false,
        url: getBaseURL() + '/Approve/GetVendorParameterList?vendorID=' + $("#txtAPVendorCode").val() ,
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
            fnAlert("w", "EVN_02_00", "UIC02", errorMsg.UnAuthorised_edit_E1);
            return;
        }
        $("#btnSaveUnitofMeasure").show();
        fnEnableVendorRegister(false);
        businesslocation = false;
    }
    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "EVN_02_00", "UIC03", errorMsg.UnAuthorised_view_E2);
            return;
        }
        fnEnableVendorRegister(true);
        businesslocation = true;
    }
    $("#PopupUnitofMeasure").on('hidden.bs.modal', function () {
        $("#btnSaveUnitofMeasure").show();
        fnEnableVendorRegister(false);
    });
}

function fnSaveAPVendor() {
    if (IsValidAPVendor() == false) {
        return;
    }
    var vendor = {
        VendorId: $("#txtAPVendorCode").val() === '' ? 0 : $("#txtAPVendorCode").val(),
        VendorName: $("#txtAPVendorName").val(),
        CreditType: $("#cboAPCreditType").val(),
        VendorClass: $("#cboAPVendorClass").val(),
        CreditPeriod: $("#txtAPCreditPeriod").val(),
        PreferredPaymentMode: $("#cboAPPayMode").val(),
        IsBlackListed: $('#chkAPIsBlockList').parent().hasClass("is-checked"),
        ActiveStatus: $("#chkAPActiveStatus").parent().hasClass("is-checked")
    };
    var fmParams = eSyaParams.GetJSONValue();
    vendor.l_FormParameter = fmParams;
    $.ajax({

        url: getBaseURL() + '/Approve/InsertOrUpdateVendor',
        type: 'POST',
        datatype: 'json',
        data: { vendor },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                fnRefreshAPVendorGrid();
                ReadAPVendorCode(response);
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

function IsValidAPVendor() {
    debugger;
    if (IsStringNullorEmpty($("#txtAPVendorName").val())) {
        fnAlert("w", "EVN_02_00", "UI0225", errorMsg.VendorName_E15);
        return false;
    }
    if (IsStringNullorEmpty($("#txtAPCreditPeriod").val())) {
        fnAlert("w", "EVN_02_00", "UI0226", errorMsg.CreditDays_E16);
        return false;
    }
   
    if ($("#txtAPCreditPeriod").val() == 0 || $("#txtAPCreditPeriod").val() == "0") {
        fnAlert("w", "EVN_02_00", "UI0227", errorMsg.CreditPeriod_E17);
        return false;
    }
    if ($("#cboAPPayMode").val() == 0 || $("#cboAPPayMode").val() == "0" || IsStringNullorEmpty($("#cboAPPayMode").val())) {
        fnAlert("w", "EVN_02_00", "UI0289", errorMsg.PaymentPreferredMode_E25);
        return false;
    } 
    
    if ($("#cboAPVendorClass").val() == 0 || $("#cboAPVendorClass").val() == "0" || IsStringNullorEmpty($("#cboAPVendorClass").val())) {
        fnAlert("w", "EVN_02_00", "UI0290", errorMsg.VendorClass_E26);
        return false;
    }

}

function ReadAPVendorCode(res) {
    $("#txtAPVendorCode").val('');
    $("#txtAPVendorCode").val(res.VendorId);
    if ($("#txtAPVendorCode").val() > 0) {
        $("#accordion").show();
    }
}

function fnRefreshAPVendorGrid() {
    $("#jqgAPVendorRegister").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
    $("#vendorDetailsAP-tab").addClass("active");
    $("#vendorDetailsAP").addClass("show active");
}

function fnClearAPVendorReg() {
    $("#txtAPVendorCode").val('');
    $("#txtAPVendorName").val('');
    $('#cboAPCreditType').val("P");
    $('#cboAPCreditType').selectpicker('refresh');
    $("#txtAPCreditPeriod").val('');
    $('#cboAPPayMode').val("0");
    $('#cboAPPayMode').selectpicker('refresh');
    $('#cboAPVendorClass').val("0");
    $('#cboAPVendorClass').selectpicker('refresh');
    $("#chkAPActiveStatus").prop('disabled', false);
    $('#chkAPIsBlockList').prop('checked', true);
    $('#chkAPIsBlockList').parent().removeClass('is-checked');
    $('#chkAPIsBlockList').prop('checked', false);
    $("#VendorLocationsAP").removeClass('show');
    $("#txtAPVendorCode").val('');
    fnRefreshAPVendorGrid();
    //location.reload();
    businesslocation = false;
    $("#lblAPDisplayNames").text("VendorDetails");
    eSyaParams.ClearValue();
}


function fnCloseVendorDetails() {
    $("#divAPGrid").show();
    $("#divAPForm").css("display", "none");
    $(".tab-pane").removeClass('active show');
    $("#approveVendor-pills-tab button").removeClass("active");
    $('#txtAPVendorCode').val("0");
    fnClearAPVendorReg();
    fnClearAPStatutoryDetails();
}



function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}

function fnEnableVendorRegister(val) {
    $("input,textarea").attr('readonly', val);
    $("#chklocationstatus").prop('disabled', val); 
    $("input[id*='chk']").attr('disabled', val);
    $("select").next().attr('disabled', val);
    $("#chkAPActiveStatus").attr('disabled', true);
}

function fnAPDeActivateVendor() {
    fnSetSidebar();
    if (_userFormRole.IsDelete === false) {
        fnAlert("w", "EVN_02_00", "UIC04", errorMsg.UnAuthorised_delete_E3);
        return;
    }

   

    var rowid = $("#jqgAPVendorRegister").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgAPVendorRegister').jqGrid('getRowData', rowid);

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
                if (vcode == null || vcode == undefined || vcode == "0" || vcode == ''){
                    alert("Could not Delete");
                    return false;
                }
                $.ajax({
                    url: getBaseURL() + '/Approve/ActiveOrDeActiveVendor?status=' + a_status + '&vendorID=' + vcode,
                    type: 'POST',
                    success: function (response) {

                        if (response.Status) {
                            fnAlert("s", "", response.StatusCode, response.Message);
                            fnRefreshAPVendorGrid();
                        }
                        else {
                            fnAlert("e", "", response.StatusCode, response.Message);
                        }
                        $("#jqgAPVendorRegister").setGridParam({ datatype: 'json' }).trigger('reloadGrid');
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
        $(".tab-content,#approveVendor-pills-tab").css({ "height": _newTabH, "overflow-y": "auto" });
    }
    else {
        $(".tab-content").css({ "height": _newTabH, "overflow-y": "auto" });
    }
}

$("[id*='ParamValue']").on('click', function () {
    $("[id*='ParamValue']").not(this).prop('checked', false);
});