
$(document).ready(function () {

    $('[name="rdoSegmentLinkAccount"]').change(function () {
        if ($('#rdoIsBookofAccounts').prop('checked')) {
            $("#divsegment").hide();
            $("#cboBusinessSegment").empty();
            $("#cboBusinessSegment").append($("<option value='0'> Select </option>"));
            $("#cboBusinessSegment").selectpicker('refresh');
        }
        else if ($('#rdoIsCostCenter').prop('checked')) {
            $("#divsegment").show();
            fnBindExistingLocationsasSegments();
        }
    });

    fnGridLoadBusinessLocation();

    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnLocation",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditBusinessLocation(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditBusinessLocation(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditBusinessLocation(event, 'delete') } },

        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
   
    $("#divTaxIdentification").css('display', 'none');
    $("#divChkActiveStatus").css('display', 'none');
});
var actiontype = "";
function fnGridLoadBusinessLocation() {

    $("#jqgBusienssLocation").GridUnload();

    $("#jqgBusienssLocation").jqGrid({
        url: getBaseURL() + '/Location/GetBusinessLocationByBusinessId?BusinessId=' + $("#cboBusinessEntity").val(),
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.BusinessId, localization.LocationId, localization.BusinessKey, localization.LocationDescription, localization.BusinessName, localization.ShortDesc, localization.ISDCode, localization.CityCode, localization.StateCode, localization.CurrencyCode, localization.CurrencyName, "Licenses status" ,localization.Active, localization.Actions],
        colModel: [
            { name: "BusinessId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "LocationId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "BusinessKey", width: 50, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "LocationDescription", width: 120, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "BusinessName", width: 120, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "ShortDesc", width: 100, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "Isdcode", width: 50, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "CityCode", width: 50, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "StateCode", width: 50, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "CurrencyCode", width: 50, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "CurrencyName", width: 80, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "Lstatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, hidden: true },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },

            {
                name: 'edit', search: false, align: 'center', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnLocation"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],

        pager: "#jqpBusienssLocation",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: '55',
        loadonce: true,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        scroll: false,
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        caption: localization.BusinessLocation,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgBusienssLocation");
        },
        loadBeforeSend: function () {
            $("[id*='_edit']").css('text-align', 'center');
        },
        onSelectRow: function (rowid, status, e) {
        },
    }).jqGrid('navGrid', '#jqpBusienssLocation', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpBusienssLocation', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshBusinessLocation
    }).jqGrid('navButtonAdd', '#jqpBusienssLocation', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddBusinessLocation
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgBusienssLocation"),
            newWidth = $grid.closest(".Locationcontainer").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddBusinessLocation() {

    fnClearFields();
    var id = $("#cboBusinessEntity").val();
    if (id === 0 || id === "0" || IsStringNullorEmpty($("#cboBusinessEntity").val())) {
        fnAlert("w", "ECB_02_00", "UI0051", errorMsg.SelectBusinessEntity_E6);
    }
    else {
        _isInsert = true;
        fnClearFields();
        eSyaParams.ClearValue();
        BindCities();
        BindTaxIdentification();
        BindCurrrencies();
        $('#PopupBusienssLocation').modal('show');
        fnRdoSegmentLinkEmpty();
        $('#rdoIsBookofAccounts').prop('checked', true);
        $('#chkToRealCurrency').parent().removeClass("is-checked");
        LoadCurrencybyBusinessKey();
        $('#PopupBusienssLocation').find('.modal-title').text(localization.AddBusinessLocation);
        $("#btnSaveLocationInfo").show();
        $("#btnSaveLocationInfo").html('<i class="fa fa-save"></i> ' + localization.Save);
        $("#btnSaveLocationInfo").attr("disabled", false);
        $("#chkLocinfoActiveStatus").parent().addClass("is-checked");
        $("#chkLocinfoActiveStatus").prop('disabled', true);
        $("#btnSaveFinancialInfo").show();
        $("#btnSaveFinancialInfo").html('<i class="fa fa-save"></i> ' + localization.Save);
        $("#btnSaveFinancialInfo").attr("disabled", false);
        $("#chkFininfoActiveStatus").parent().addClass("is-checked");
        $("#chkFininfoActiveStatus").prop('disabled', true);
        $("#chkLicinfoActiveStatus").parent().addClass("is-checked");
        $("#chkLicinfoActiveStatus").prop('disabled', true);
        $("#btnSaveTaxInfo").show();
        $("#btnSaveTaxInfo").html('<i class="fa fa-save"></i> ' + localization.Save);
        $("#btnSaveTaxInfo").attr("disabled", false);
        $("#chktaxinfoActiveStatus").parent().addClass("is-checked");
        $("#chktaxinfoActiveStatus").prop('disabled', true);
        $("#btnDeactivateBusinessLocation").hide();
        fnGetBusinessUnitType();
        fnLoadGridPreferredLanguage();
        fnGridLoadPaymentMethodInfo();
    }
}

function fnEditBusinessLocation(e, actiontype) {
    var rowid = $("#jqgBusienssLocation").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgBusienssLocation').jqGrid('getRowData', rowid);
    $("#divChkActiveStatus").css('display', 'none');
    $('#cboBusinessEntity').val(rowData.BusinessId).selectpicker('refresh');
    $('#txtLocationDescription').val(rowData.LocationDescription);
    $('#txtBusinessName').val(rowData.BusinessName);
    $('#txtShortDescription').val(rowData.ShortDesc);
    $('#txtBusinesskey').val(rowData.BusinessKey);
    $("#txtlocationId").val(rowData.LocationId)
    $('#cbolocISD').val(rowData.Isdcode).selectpicker('refresh');
    BindCities();
    BindTaxIdentification();
    BindCurrrencies();
    fnGridLoadPaymentMethodInfo();
    $('#cboCityCode').val(rowData.CityCode).selectpicker('refresh');
    $('#cboCurrrencyCode').val(rowData.CurrencyCode).selectpicker('refresh');

    fnLoadGridPreferredLanguage();
    LoadCurrencybyBusinessKey();
    if (rowData.ActiveStatus == 'true') {
        $("#chkLocinfoActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkLocinfoActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveLocationInfo").attr("disabled", false);
    _isInsert = false;



    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "ECB_02_00", "UIC02", errorMsg.editauth_E2);
            return;
        }

        $('#PopupBusienssLocation').modal('show');
        $('#PopupBusienssLocation').find('.modal-title').text(localization.UpdateBusinessLocation);
        $("#btnDeactivateBusinessLocation").hide();


        $("#btnSaveLocationInfo").html('<i class="fa fa-sync mr-1"></i> ' + localization.Update);
        $("#btnSaveLocationInfo").attr("disabled", false);
        $("#btnSaveLocationInfo").show();
        $("#chkLocinfoActiveStatus").prop('disabled', true);

        $("#btnSaveFinancialInfo").html('<i class="fa fa-sync mr-1"></i> ' + localization.Update);
        $("#btnSaveFinancialInfo").attr("disabled", false);
        $("#btnSaveFinancialInfo").show();
        $("#chkFininfoActiveStatus").prop('disabled', true);

        //$("#btnSaveLicenseInfo").html('<i class="fa fa-sync mr-1"></i> ' + localization.Update);
        //$("#btnSaveLicenseInfo").attr("disabled", false);
        //$("#btnSaveLicenseInfo").show();
        $("#chkLicinfoActiveStatus").prop('disabled', true);

        $("#btnSaveTaxInfo").html('<i class="fa fa-sync mr-1"></i> ' + localization.Update);
        $("#btnSaveTaxInfo").attr("disabled", false);
        $("#btnSaveTaxInfo").show();
        $("#chktaxinfoActiveStatus").prop('disabled', true);


    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "ECB_02_00", "UIC03", errorMsg.vieweauth_E3);
            return;
        }
        $("#divChkActiveStatus").css('display', 'flex');
        $('#PopupBusienssLocation').modal('show');
        $('#PopupBusienssLocation').find('.modal-title').text(localization.ViewBusienssLocation);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnDeactivateBusinessLocation").hide();
        $("#btnSaveLocationInfo").attr("disabled", false);
        $("#btnSaveLocationInfo").hide();
        $("#btnSaveFinancialInfo").attr("disabled", false);
        $("#btnSaveFinancialInfo").hide();
        //$("#btnSaveLicenseInfo").attr("disabled", false);
        //$("#btnSaveLicenseInfo").hide();
        $("#btnSaveTaxInfo").attr("disabled", false);
        $("#btnSaveTaxInfo").hide();
        $("#chkLocinfoActiveStatus").prop('disabled', true);
        $("#chkFininfoActiveStatus").prop('disabled', true);
        $("#chkLicinfoActiveStatus").prop('disabled', true);
        $("#chktaxinfoActiveStatus").prop('disabled', true);



        $("#PopupBusienssLocation").on('hidden.bs.modal', function () {

            $("#btnSaveLocationInfo").attr("disabled", false);
            $("#btnSaveLocationInfo").show();
            $("#btnSaveFinancialInfo").attr("disabled", false);
            $("#btnSaveFinancialInfo").show();
            //$("#btnSaveLicenseInfo").attr("disabled", false);
            //$("#btnSaveLicenseInfo").show();
            $("#btnSaveTaxInfo").attr("disabled", false);
            $("#btnSaveTaxInfo").show();

            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }

    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "ECB_02_00", "UIC03", errorMsg.deleteauth_E4);
            return;
        }
        $("#divChkActiveStatus").css('display', 'flex');
        $('#PopupBusienssLocation').modal('show');
        $('#PopupBusienssLocation').find('.modal-title').text(localization.ActiveBusienssLocation);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnDeactivateBusinessLocation").show();
        $("#btnSaveLocationInfo").attr("disabled", false);
        $("#btnSaveLocationInfo").hide();
        $("#btnSaveFinancialInfo").attr("disabled", false);
        $("#btnSaveFinancialInfo").hide();
        //$("#btnSaveLicenseInfo").attr("disabled", false);
        //$("#btnSaveLicenseInfo").hide();
        $("#btnSaveTaxInfo").attr("disabled", false);
        $("#btnSaveTaxInfo").hide();
        $("#chkLocinfoActiveStatus").prop('disabled', true);
        $("#chkFininfoActiveStatus").prop('disabled', true);
        $("#chkLicinfoActiveStatus").prop('disabled', true);
        $("#chktaxinfoActiveStatus").prop('disabled', true);

        $("#btnDeactivateBusinessLocation").attr("disabled", false);

        if (rowData.ActiveStatus == 'true') {
            $("#btnDeactivateBusinessLocation").html(localization.Deactivate);
        }
        else {
            $("#btnDeactivateBusinessLocation").html(localization.Activate);
        }
        $("#PopupBusienssLocation").on('hidden.bs.modal', function () {

            $("#btnSaveLocationInfo").attr("disabled", false);
            $("#btnSaveLocationInfo").show();
            $("#btnSaveFinancialInfo").attr("disabled", false);
            $("#btnSaveFinancialInfo").show();
            //$("#btnSaveLicenseInfo").attr("disabled", false);
            //$("#btnSaveLicenseInfo").show();
            $("#btnSaveTaxInfo").attr("disabled", false);
            $("#btnSaveTaxInfo").show();

            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
            $("#btnDeactivateBusinessLocation").hide();
        });
    }

    eSyaParams.ClearValue();

    $.ajax({
        async: false,
        url: getBaseURL() + "/Location/GetLocationParametersbyBusinessKey?BusinessKey=" + $('#txtBusinesskey').val(),
        type: 'POST',
        datatype: 'json',
        success: function (result) {
            if (result != null) {
                eSyaParams.SetJSONValue(result);
            }
        },
        error: function (error) {
            fnAlert("e", "", response.StatusCode, response.Message);

        }
    });
}

var _isInsert = true;


function fnGridRefreshBusinessLocation() {
    $("#jqgBusienssLocation").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}
$("#btnCancelLocationInfo").click(function () {
    fnClearFields();
    $("#txtBusinesskey").val('');
    //$("#jqgSMSConnect").jqGrid('resetSelection');
    //$('#PopupSMSConnect').modal('hide');
    //$("#cboBusinessEntity").next().attr('disabled', false);
});
function fnClearFields() {
    $("#cboBusinessSegment").val('0').selectpicker('refresh');
    $("#txtBusinesskey").val('');
    $("#txtlocationId").val('');
    //$("#txtLocationcode").val('');
    $("#txtLocationDescription").val('');
    $("#txtBusinessName").val('');
    $('#txtShortDescription').val('');
    $("#cbolocISD").val('0').selectpicker('refresh');
    $("#cboCityCode").selectpicker('refresh');
    $("#cboCurrrencyCode").selectpicker('refresh');
    $("#cboTaxIdentification").selectpicker('refresh');
    $("#txtTin").val('');
    $("#txtStateCode").val('');
    $("#cboLicenseType").val('0').selectpicker('refresh');
    $("#txtUserLicenses").val('0');
    $("#txtNoOfBeds").val('0');
    $("#chkToLocalCurrency").prop('disabled', false);
    $("#chkToLocalCurrency").parent().removeClass("is-checked");
    $("#chkToCurrCurrency").prop('disabled', false);
    $("#chkToCurrCurrency").parent().removeClass("is-checked");
    $("#chkToRealCurrency").prop('disabled', false);
    $("#chkToRealCurrency").parent().removeClass("is-checked");
    $("#chkLocinfoActiveStatus").parent().addClass("is-checked");
    $("#btnSaveLocationInfo").attr("disabled", false);
    $("#btnDeactivateBusinessLocation").attr("disabled", false);
    fnRdoSegmentLinkEmpty();
    $("#divChkActiveStatus").css('display', 'none');
    //eSyaParams.ClearValue();
    $(".nav-link").removeClass("active");
    $("#locationInfo-tab").addClass('active');
    $('[role = "tabpanel"]').removeClass('show active');
    $("#locationInfo").addClass('show active');
}

$("#btnCancelLocationInfo").click(function () {
    $("#jqgBusienssLocation").jqGrid('resetSelection');
    $('#PopupBusienssLocation').modal('hide');
    fnClearFields();
});

function SetGridControlByAction() {

    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }

}

function fnSaveLocationInfo() {
    /*var isbookofaccount = true;*/

    if ($("#cboBusinessEntity").val() === '0' || $("#cboBusinessEntity").val() === "0" || IsStringNullorEmpty($("#cboBusinessEntity").val())) {
        fnAlert("w", "ECB_02_00", "UI0052", errorMsg.SelectBusinessEntity_E7);
        return;
    }

    if (IsStringNullorEmpty($("#txtShortDescription").val())) {
        fnAlert("w", "ECB_02_00", "UI0206", errorMsg.ShortDesc_E16);
        return;
    }
    if (IsStringNullorEmpty($("#txtLocationDescription").val())) {
        fnAlert("w", "ECB_02_00", "UI0053", errorMsg.LocationDesc_E8);
        return;
    }
    if (IsStringNullorEmpty($("#txtBusinessName").val())) {
        fnAlert("w", "ECB_02_00", "UI0054", errorMsg.BusinessName_E9);
        return;
    }
    if ($("#cbolocISD").val() === '0' || $("#cbolocISD").val() === "0" || IsStringNullorEmpty($("#cbolocISD").val())) {
        fnAlert("w", "ECB_02_00", "UI0056", errorMsg.ISDCode_E11);
        return;
    }
    if ($("#cboCityCode").val() === '0' || $("#cboCityCode").val() === "0" || IsStringNullorEmpty($("#cboCityCode").val())) {
        fnAlert("w", "ECB_02_00", "UI0057", errorMsg.CitySelect_E12);
        return;
    }
    if ($("#cboCurrrencyCode").val() === '0' || $("#cboCurrrencyCode").val() === "0" || IsStringNullorEmpty($("#cboCurrrencyCode").val())) {
        fnAlert("w", "ECB_02_00", "UI0058", errorMsg.CurrencyCode_E13);
        return;
    }

    objloc = {
        BusinessId: $("#cboBusinessEntity").val(),
        LocationId: $("#txtlocationId").val() === '' ? 0 : $("#txtlocationId").val(),
        BusinessKey: $("#txtBusinesskey").val() === '' ? 0 : $("#txtBusinesskey").val(),
        LocationDescription: $("#txtLocationDescription").val(),
        BusinessName: $("#txtBusinessName").val(),
        ShortDesc: $('#txtShortDescription').val(),
        Isdcode: $("#cbolocISD").val(),
        CityCode: $("#cboCityCode").val(),
        StateCode: $("#txtStateCode").val(),
        CurrencyCode: $("#cboCurrrencyCode").val(),
        TolocalCurrency: $("#chkToLocalCurrency").parent().hasClass("is-checked"),
        TocurrConversion: $("#chkToCurrCurrency").parent().hasClass("is-checked"),
        TorealCurrency: $("#chkToRealCurrency").parent().hasClass("is-checked"),
        ActiveStatus: $("#chkLocinfoActiveStatus").parent().hasClass("is-checked")
    };

    //
    var bsCurrency = [];
    var jqgBSCurrency = jQuery("#jqgBSCurrency").jqGrid('getRowData');

    for (var i = 0; i < jqgBSCurrency.length; ++i) {
        if (parseFloat(jqgBSCurrency[i]["CurrencyCode"]) != '') {
            bsCurrency.push({
                CurrencyCode: jqgBSCurrency[i]["CurrencyCode"],
                IsTransacting: jqgBSCurrency[i]["IsTransacting"],
                IsReal: jqgBSCurrency[i]["IsReal"],
               
            });
        }
    }

    objloc.l_BSCurrency = bsCurrency;
    //

    var preferredlanguage = [];
    var jqgPreferredLanguage = jQuery("#jqgPreferredLanguage").jqGrid('getRowData');

    for (var i = 0; i < jqgPreferredLanguage.length; ++i) {

        preferredlanguage.push({
            BusinessKey: $("#txtBusinesskey").val() === '' ? 0 : $("#txtBusinesskey").val(),
            PreferredLanguage: jqgPreferredLanguage[i]["PreferredLanguage"],
            ActiveStatus: jqgPreferredLanguage[i]["ActiveStatus"]
        });

    }

    //$("#jqgPreferredLanguage").jqGrid('editCell', 0, 0, false).attr("value");

    objloc.l_Preferredlanguage = preferredlanguage;

    //
    var locParams = eSyaParams.GetJSONValue();
    objloc.l_FormParameter = locParams;

    $("#btnSaveLocationInfo").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/Location/InsertOrUpdateBusinessLocation',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: objloc },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#txtBusinesskey").val(response.Key);
                $("#btnSaveLocationInfo").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupBusienssLocation").modal('hide');
                fnClearFields();
                fnGridRefreshBusinessLocation();
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveLocationInfo").attr("disabled", false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveLocationInfo").attr("disabled", false);
        }
    });
}

function fnDeleteLocationInfo() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkLocinfoActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btnDeactivateBusinessLocation").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Location/ActiveOrDeActiveBusinessLocation?status=' + a_status + '&BusinessId=' + $("#cboBusinessEntity").val()
            + '&LocationId=' + $("#txtlocationId").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnDeactivateBusinessLocation").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupBusienssLocation").modal('hide');
                fnClearFields();
                fnGridRefreshBusinessLocation();
                $("#btnDeactivateBusinessLocation").attr("disabled", false);
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnDeactivateBusinessLocation").attr("disabled", false);
                $("#btnDeactivateBusinessLocation").html('De Activate');
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnDeactivateBusinessLocation").attr("disabled", false);
            $("#btnDeactivateBusinessLocation").html('De Activate');
        }
    });
}

function BindCities() {

    $("#cboCityCode").empty();
    $.ajax({
        url: getBaseURL() + '/Location/GetCityListbyISDCode?isdCode=' + $("#cbolocISD").val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", xhr.StatusCode, xhr.statusText);
        },
        success: function (response, data) {
            if (response != null) {
                //refresh each time
                $("#cboCityCode").empty();

                $("#cboCityCode").append($("<option value='0'>" + localization.Select +"</option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboCityCode").append($("<option></option>").val(response[i]["CityCode"]).html(response[i]["CityDesc"]));
                }
                $('#cboCityCode').selectpicker('refresh');
            }
            else {
                $("#cboCityCode").empty();
                $("#cboCityCode").append($("<option value='0'>" + localization.Select +"</option>"));
                $('#cboCityCode').selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });


}

function BindTaxIdentification() {

    $("#cboTaxIdentification").empty();
    $.ajax({
        url: getBaseURL() + '/Location/GetTaxIdentificationListByIsdCode?isdCode=' + $("#cbolocISD").val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", xhr.StatusCode, xhr.statusText);
        },
        success: function (response, data) {
            if (response != null) {
                //refresh each time
                $("#cboTaxIdentification").empty();

                $("#cboTaxIdentification").append($("<option value='0'>" + localization.Select +"</option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboTaxIdentification").append($("<option></option>").val(response[i]["TaxIdentificationId"]).html(response[i]["TaxIdentificationDesc"]));
                }
                $('#cboTaxIdentification').selectpicker('refresh');
            }
            else {
                $("#cboTaxIdentification").empty();
                $("#cboTaxIdentification").append($("<option value='0'>" + localization.Select +"</option>"));
                $('#cboTaxIdentification').selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });


}

function BindCurrrencies() {

    $("#cboCurrrencyCode").empty();
    $.ajax({
        url: getBaseURL() + '/Location/GetCurrencyListbyIsdCode?isdCode=' + $("#cbolocISD").val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", xhr.StatusCode, xhr.statusText);
        },
        success: function (response, data) {
            if (response != null) {
                //refresh each time
                $("#cboCurrrencyCode").empty();

                $("#cboCurrrencyCode").append($("<option value='0'>" + localization.Select +"</option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboCurrrencyCode").append($("<option></option>").val(response[i]["CurrencyCode"]).html(response[i]["CurrencyName"]));
                }
                $('#cboCurrrencyCode').selectpicker('refresh');
            }
            else {
                $("#cboCurrrencyCode").empty();
                $("#cboCurrrencyCode").append($("<option value='0'>" + localization.Select +"</option>"));
                $('#cboCurrrencyCode').selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });


}

function fnBindExistingLocationsasSegments() {

    $("#cboBusinessSegment").empty();
    $.ajax({
        url: getBaseURL() + '/Location/GetActiveLocationsAsSegments',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", xhr.StatusCode, xhr.statusText);
        },
        success: function (response, data) {
            if (response != null) {
                //refresh each time
                $("#cboBusinessSegment").empty();

                $("#cboBusinessSegment").append($("<option value='0'>"+ localization.Select +"</option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboBusinessSegment").append($("<option></option>").val(response[i]["SegmentId"]).html(response[i]["BusinessName"]));
                }
                $('#cboBusinessSegment').selectpicker('refresh');
            }
            else {
                $("#cboBusinessSegment").empty();
                $("#cboBusinessSegment").append($("<option value='0'>" + localization.Select +"</option>"));
                $('#cboBusinessSegment').selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });


}

function fnRdoSegmentLinkEmpty() {
    $('#rdoIsBookofAccounts').attr('checked', 'checked');
    $('#rdoIsCostCenter').prop('checked', false);
    $("#divsegment").hide();
    $("#cboBusinessSegment").empty();
    $("#cboBusinessSegment").append($("<option value='0'> Select </option>"));
    $("#cboBusinessSegment").selectpicker('refresh');

}

function fnGetStateNamebyTaxCode() {

    $.ajax({
        type: 'POST',
        url: getBaseURL() + '/Location/GetStateCodeByISDCode?isdCode=' + $("#cbolocISD").val() + '&TaxIdentificationId=' + $("#cboTaxIdentification").val(),
        success: function (response) {
            if (response !== null) {
                $("#txtTin").val('');
                $("#txtStateCode").val('');
                $("#txtTin").val(response.TaxIdentificationId);
                $("#txtStateCode").val(response.StateCode);
            }
            else {
                $("#txtTin").val('');
                $("#txtStateCode").val('');
            }
        },
        error: function (response) {
        }
    });
}


function LoadCurrencybyBusinessKey() {
    var URL = getBaseURL() + "/Location/GetCurrencybyBusinessKey?Businesskey=" + $("#txtBusinesskey").val();

    $("#jqgBSCurrency").jqGrid('GridUnload');
    $("#jqgBSCurrency").jqGrid({
        url: URL,
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.CurrencyCode, localization.Currency, localization.TransactingCurrency, localization.Real, localization.ActiveStatus],
        colModel: [
            { name: "CurrencyCode", width: 120, editable: false, align: 'left', hidden: true },
            { name: "CurrencyName", editable: false, width: 60, align: 'left', resizable: false },
            { name: "IsTransacting", editable: true, width: 30, align: 'left', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "IsReal", editable: true, width: 25, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "ActiveStatus", editable: true, width: 30, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" },hidden: true }

        ],

        caption: "Currency",
        height: 'auto',
        width: 'auto',
        rowNum: 100,
        viewrecords: true,
        gridview: true,
        loadonce: true,
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        cellEdit: true,
        rowattr: function (item) {
            var _selectedCurrencies = "";
            _selectedCurrencies = document.getElementById('cboCurrrencyCode').value;
            if (_selectedCurrencies != 0) {
                if (_selectedCurrencies == item.CurrencyCode) {

                    return { "class": "ui-state-disabled bg-light" };

                }
            }
            
        },
        onSelectRow: function (id) {
            if (id) { $('#jqgBSCurrency').jqGrid('editRow', id, true); }
        },
        loadComplete: function () {
            var ids = $('#jqgBSCurrency').jqGrid('getDataIDs');
            var i = 0;
            for (i = 0; i < ids.length; i++) {
                if (ids[i])
                    $('#jqgBSCurrency').jqGrid('editRow', ids[i]);
            }
            $(".ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-hdiv,.ui-jqgrid-bdiv,.ui-jqgrid-view,.ui-jqgrid,.ui-jqgrid-pager").css('width', '100%');
        }
    });
}


function fnGetBusinessUnitType() {

    $.ajax({
        type: 'POST',
        url: getBaseURL() + '/Location/GetBusinessUnitType?businessId=' + $("#cboBusinessEntity").val(),
        success: function (response) {
            if (response !== null) {
                if (response.BusinessUnitType == "M") {
                    $('#rdoIsBookofAccounts').attr('checked', 'checked');
                    $('#lblRdoSegmentLinkAccount').show();
                    $('#rdoIsCostCenter').prop('checked', false);
                    $("#divsegment").hide();
                    $("#cboBusinessSegment").empty();
                    $("#cboBusinessSegment").append($("<option value='0'>" + localization.Select +"</option>"));
                    $("#cboBusinessSegment").selectpicker('refresh');
                }
                else if (response.BusinessUnitType == "S") {
                    $('#rdoIsBookofAccounts').attr('checked', 'checked');
                    $('#rdoIsCostCenter').prop('checked', false);
                    $('#lblRdoSegmentLinkAccount').hide();
                    $("#divsegment").hide();
                    $("#cboBusinessSegment").empty();
                    $("#cboBusinessSegment").append($("<option value='0'>" + localization.Select +"</option>"));
                    $("#cboBusinessSegment").selectpicker('refresh');
                }

            }

        },
        error: function (response) {
        }
    });
}



function fnLoadGridPreferredLanguage() {


    $("#jqgPreferredLanguage").jqGrid('GridUnload');

    $("#jqgPreferredLanguage").jqGrid({
        url: getBaseURL() + '/Location/GetLocationPreferredLanguagebyBusinessKey?BusinessID=' + $("#cboBusinessEntity").val() + '&BusinessKey=' + $("#txtBusinesskey").val(),
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.BusinessKey, localization.CultureCode, localization.CultureDesc, localization.PreferredLanguage, localization.ActiveStatus],
        colModel: [
            { name: "BusinessKey", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "PreferredLanguage", width: 100, editable: false, editoptions: { disabled: true }, align: 'left' },
            { name: "CultureDesc", width: 130, editable: false, editoptions: { disabled: true }, align: 'left' },
            { name: "Pldescription", width: 130, editable: false, editoptions: { disabled: false }, align: 'left' },
            { name: "ActiveStatus", editable: true, width: 100, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false } },

        ],
        pager: "#jqpPreferredLanguage",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: '55',
        loadonce: true,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        scroll: false,
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        caption: localization.BusinessLocation,
        loadComplete: function (data) {
            SetGridControlByAction();
            $('.ui-jqgrid-view,.ui-jqgrid,.ui-jqgrid-hdiv,.ui-jqgrid-htable,.ui-jqgrid-bdiv,.ui-jqgrid-pager').css('width', 100 + '%');
            fnJqgridSmallScreen("jqgPreferredLanguage");
        },
        loadBeforeSend: function () {
            $("[id*='_edit']").css('text-align', 'center');
        },
        onSelectRow: function (id) {
            if (id) { $('#jqgPreferredLanguage').jqGrid('editRow', id, true); }
        },
        //onSelectRow: function (rowid, status, e) {
        //},
    }).jqGrid('navGrid', '#jqpPreferredLanguage', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' });
}

function fnISDCountryCode_onChange() {
    var _cboISDCode = $("#cbolocISD").val();
    if (_cboISDCode == 91) {
        $("#divTaxIdentification").css('display', 'flex');
    }
    else {
        $("#divTaxIdentification").css('display', 'none');
    }
    BindCities();
    BindTaxIdentification();
    BindCurrrencies();
    fnGridLoadPaymentMethodInfo();
}


/* Save Finance Info*/

function fnGetFinancialInfoDetails() {
    fnFinanceInfo();
}
function fnSaveFinancialInfo() {
    var isbookofaccount = true;

    if ($("#txtBusinesskey").val() === '0' || $("#txtBusinesskey").val() === "0" || IsStringNullorEmpty($("#txtBusinesskey").val())) {
        fnAlert("w", "ECB_02_00", "UI0052", errorMsg.SelectBusinessEntity_E7);
        return;
    }


    if ($('input[name="rdoSegmentLinkAccount"]:checked').val() == 'RCC') {

        if ($("#cboBusinessSegment").val() === '0' || $("#cboBusinessSegment").val() === "0" || IsStringNullorEmpty($("#cboBusinessSegment").val())) {
            fnAlert("w", "ECB_02_00", "UI0055", errorMsg.BusinessSegmentcostCenter_E10);
            return;
        }
        isbookofaccount = false;
    }
    if ($('input[name="rdoSegmentLinkAccount"]:checked').val() == 'RBA') {

        isbookofaccount = true;
        $("#cboBusinessSegment").val('0').selectpicker('refresh');
    }
    $("#jqgPreferredLanguage").jqGrid('editCell', 0, 0, false);

    objfin = {
        BusinessKey: $("#txtBusinesskey").val(),
        IsBookOfAccounts: $("#chkIsBookofAccounts").parent().hasClass("is-checked"),
        IsBookOfAccounts: isbookofaccount,
        BusinessSegmentId: $("#cboBusinessSegment").val(),
        ActiveStatus: $("#chkFininfoActiveStatus").parent().hasClass("is-checked")
        //IsBookOfAccounts: isbookofaccount,
        //BusinessSegmentId: $("#cboBusinessSegment").val(),

    };


    $("#btnSaveFinancialInfo").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/Location/InsertOrUpdateLocationFinancialInfo',
        type: 'POST',
        datatype: 'json',
        data: { obj: objfin },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                //    $("#btnSaveFinancialInfo").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#btnSaveFinancialInfo").attr("disabled", false);
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveFinancialInfo").attr("disabled", false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveFinancialInfo").attr("disabled", false);
        }
    });
}

function fnFinanceInfo() {

    $.ajax({
        type: 'POST',
        url: getBaseURL() + '/Location/GetLocationFinancialInfo?BusinessKey=' + $("#txtBusinesskey").val(),
        success: function (response) {

            if (response !== null) {
                if (response.IsBookOfAccounts == 'true' || response.IsBookOfAccounts == true) {
                    fnRdoSegmentLinkEmpty();
                    $('#rdoIsBookofAccounts').prop('checked', true);

                    fnGetBusinessUnitType();

                    if (response.ActiveStatus == 'true' || response.ActiveStatus == true) {
                        $("#chkFininfoActiveStatus").parent().addClass("is-checked");
                    }
                    else {
                        $("#chkFininfoActiveStatus").parent().removeClass("is-checked");
                    }


                }
                else {
                    fnBindExistingLocationsasSegments();
                    $('#cboBusinessSegment').val(response.BusinessSegmentId).selectpicker('refresh');
                    $('#rdoIsBookofAccounts').prop('checked', false);
                    $('#rdoIsCostCenter').prop('checked', true);
                    $("#divsegment").show();
                    if (response.ActiveStatus == 'true' || response.ActiveStatus == true) {
                        $("#chkFininfoActiveStatus").parent().addClass("is-checked");
                        $('#chkFininfoActiveStatus').attr('disabled', true);
                    }
                    else {
                        $("#chkFininfoActiveStatus").parent().removeClass("is-checked");
                        $('#chkFininfoActiveStatus').attr('disabled', true);
                    }
                }
            }
            else {
                fnRdoSegmentLinkEmpty();
                $('#rdoIsBookofAccounts').prop('checked', true);
                fnGetBusinessUnitType();
                $('#chkFininfoActiveStatus').parent().addClass("is-checked");
                $('#chkFininfoActiveStatus').attr('disabled', true);
            }
        },
        error: function (response) {
        }
    });
}

$("#btnCancelFinancialInfo").click(function () {
    $("#jqgBusienssLocation").jqGrid('resetSelection');
    $('#PopupBusienssLocation').modal('hide');
    fnClearFields();
});
/* End*/



/* Save Tax Info*/
function fnSaveTaxInfo() {

    if ($("#txtBusinesskey").val() === '0' || $("#txtBusinesskey").val() === "0" || IsStringNullorEmpty($("#txtBusinesskey").val())) {
        fnAlert("w", "ECB_02_00", "UI0064", errorMsg.BusinessLocation_E17);
        return;
    }
    if ($("#cboTaxIdentification").val() === '0' || $("#cboTaxIdentification").val() === "0" || IsStringNullorEmpty($("#cboTaxIdentification").val())) {
        fnAlert("w", "ECB_02_00", "UI0059", errorMsg.TaxIdentification_E14);
        return;
    }




    objtax = {
        BusinessKey: $("#txtBusinesskey").val(),
        TaxIdentificationId: $("#cboTaxIdentification").val(),
        ActiveStatus: $("#chktaxinfoActiveStatus").parent().hasClass("is-checked")
    };


    $("#btnSaveTaxInfo").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/Location/InsertOrUpdateLocationTaxInfo',
        type: 'POST',
        datatype: 'json',
        data: { obj: objtax },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                //    $("#btnSaveTaxInfo").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#btnSaveTaxInfo").attr("disabled", false);

            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveTaxInfo").attr("disabled", false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveTaxInfo").attr("disabled", false);
        }
    });
}
function fnGetTaxInfoDetails() {
    fnISDCountryCode_onChange();
    fnTaxInfo();
}

function fnTaxInfo() {

    $.ajax({
        type: 'POST',
        url: getBaseURL() + '/Location/GetLocationLocationTaxInfo?BusinessKey=' + $("#txtBusinesskey").val(),
        success: function (response) {
            if (response !== null) {
               
                BindTaxIdentification();
                $('#cboTaxIdentification').val(response.TaxIdentificationId).selectpicker('refresh');
                fnGetStateNamebyTaxCode();
                if (response.ActiveStatus == 'true' || response.ActiveStatus == true) {
                    $("#chktaxinfoActiveStatus").parent().addClass("is-checked");
                    $('#chktaxinfoActiveStatus').attr('disabled', true);
                }
                else {
                    $("#chktaxinfoActiveStatus").parent().removeClass("is-checked");
                    $('#chktaxinfoActiveStatus').attr('disabled', true);
                }
            }
            else {
                $('#cboTaxIdentification').val('0').selectpicker('refresh');
                $('#chktaxinfoActiveStatus').parent().addClass("is-checked");
                $('#chktaxinfoActiveStatus').attr('disabled', true);
            }
        },
        error: function (response) {
        }
    });
}

$("#btnCancelTaxInfo").click(function () {
    $("#jqgBusienssLocation").jqGrid('resetSelection');
    $('#PopupBusienssLocation').modal('hide');
    fnClearFields();
});

/* Payment Method Business Link */
function fnGridLoadPaymentMethodInfo() {

    $("#jqgPaymentInfo").jqGrid('GridUnload');

    $("#jqgPaymentInfo").jqGrid({
        url: getBaseURL() + '/Location/GetPaymentMethodInterfacebyISDCode?ISDCode=' + $("#cbolocISD").val() + '&BusinessKey=' + $("#txtBusinesskey").val(),
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.ISDCode, localization.PaymentMethod, localization.InstrumentType, localization.PaymentMethod, localization.InstrumentType, localization.InterfaceReqd, localization.Active],
        colModel: [
            { name: "Isdcode", width: 50, editable: false, align: 'left', hidden: true },
            { name: "PaymentMethod", width: 80, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "InstrumentType", width: 80, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "PaymentMethodDesc", width: 80, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "InstrumentTypeDesc", width: 80, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "InterfaceReqd", width: 40, editable: false, hidden: false, align: 'center', resizable: true, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false", defaultValue: 'true' }, formatoptions: { disabled: false } },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false", defaultValue: 'true' }, formatoptions: { disabled: false } },
            ],

        pager: "#jqpPaymentInfo",
        rowNum: 10000,
        rowList: [],
        pgtext: null,
        pgbuttons: false,
        rownumWidth: '55',
        loadonce: true,
        viewrecords: false,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        cellEdit: true,
        scrollOffset: 0,
        caption: localization.PaymentMethod,
        editurl: 'url',
        cellsubmit: 'clientArray',
        onSelectRow: function (id) {
            if (id) { $('#jqgPaymentMethod').jqGrid('editRow', id, true); }
        },
        ondblClickRow: function (rowid) {
            $("#jqgPaymentMethod_iledit").trigger('click');
        },
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgPaymentMethod");
            fnGridRefreshPaymentMethod();
        },
    }).jqGrid('navGrid', '#jqpPaymentInfo', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpPaymentInfo', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshPaymentMethod
    });

    fnAddGridSerialNoHeading();

}

function fnSavePaymentIntefaceInfo() {

    if ($("#txtBusinesskey").val() === '0' || $("#txtBusinesskey").val() === "0" || IsStringNullorEmpty($("#txtBusinesskey").val())) {
        fnAlert("w", "ECB_02_00", "UI0064", errorMsg.BusinessLocation_E17);
        return;
    }
    if ($("#cbolocISD").val() === '0' || $("#cbolocISD").val() === "0" || IsStringNullorEmpty($("#cbolocISD").val())) {
        fnAlert("w", "ECB_02_00", "UI0056", errorMsg.ISDCode_E11);
        return;
    }

    var paymentinfo = [];
    var jqgpaymentinfo = jQuery("#jqgPaymentInfo").jqGrid('getRowData');
    
    for (var i = 0; i < jqgpaymentinfo.length; ++i) {
      /*  if (jqgpaymentinfo[i].ActiveStatus == true) {*/
            paymentinfo.push({
                BusinessKey: $("#txtBusinesskey").val(),
                Isdcode: $("#cbolocISD").val(),
                PaymentMethod: jqgpaymentinfo[i]["PaymentMethod"],
                InstrumentType: jqgpaymentinfo[i]["InstrumentType"],
                InterfaceReqd: jqgpaymentinfo[i]["InterfaceReqd"],
                ActiveStatus: jqgpaymentinfo[i]["ActiveStatus"]
            });
        /*}*/
    }

    $("#btnSavePaymentInfo").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/Location/InsertOrUpdatePaymentMethodInterfaceBusinessLink',
        type: 'POST',
        datatype: 'json',
        data: { obj: paymentinfo },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSavePaymentInfo").attr("disabled", false);
                fnGridRefreshPaymentMethod();
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSavePaymentInfo").attr("disabled", false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSavePaymentInfo").attr("disabled", false);
        }
    });
}
function fnGridRefreshPaymentMethod() {
    $("#jqgPaymentInfo").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

$("#btnCancelPaymentInfo").click(function () {
    $("#jqgPaymentInfo").jqGrid('resetSelection');
    $('#PopupBusienssLocation').modal('hide');
    fnClearFields();
});
/* End*/


function fnDisableRealCurrency() {

  

    var _currencycode = $("#cboCurrrencyCode").val();
    var rowDataJqcurrency = $('#jqgBSCurrency').jqGrid('getGridParam').data
    for (var i = 0; i < rowDataJqcurrency.length; ++i) {
        if (_currencycode != 0) {
            $("#jqgBSCurrency").find("tr#" + rowDataJqcurrency[i]._id_).removeClass("ui-state-disabled bg-light");

            if (_currencycode == rowDataJqcurrency[i].CurrencyCode) {

                $("#jqgBSCurrency").find("tr#" + rowDataJqcurrency[i]._id_).addClass("ui-state-disabled bg-light");
                
            }
             
        }
    }
}

