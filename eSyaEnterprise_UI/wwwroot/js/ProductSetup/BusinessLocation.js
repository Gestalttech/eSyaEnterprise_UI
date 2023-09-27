
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
    //var _txtLocationcode = $("#txtLocationcode").val();
    //if (_txtLocationcode == 1 || _txtLocationcode == "") {
    //    $("#lblRdoSegmentLinkAccount").css('display', 'none');
    //}
    //else {
    //    $("#lblRdoSegmentLinkAccount").css('display', 'block');
    //}
    $("#divTaxIdentification").css('display', 'none');
    $("#divChkActiveStatus").css('display', 'none');
});
var actiontype = "";
function fnGridLoadBusinessLocation() {
  
    $("#jqgBusienssLocation").GridUnload();

    $("#jqgBusienssLocation").jqGrid({
        url: getBaseURL() + '/License/GetBusinessLocationByBusinessId?BusinessId=' + $("#cboBusinessEntity").val(),
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.BusinessId, localization.LocationId, localization.BusinessKey, localization.LocationDescription, localization.BusinessName, localization.ISDCode, localization.CityCode, localization.StateCode, localization.CurrencyCode, localization.CurrencyName, localization.TaxIdentification, localization.eSyaLicenseType, localization.EUserLicenses, localization.ENoOfBeds, localization.BusinessSegmentId, localization.ToLocalCurrency, localization.ToCurrConversion, localization.ToRealCurrency, localization.ManageBOA,localization.Active, localization.Actions],
        colModel: [
            { name: "BusinessId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "LocationId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "BusinessKey", width: 50, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            //{ name: "LocationId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden:true },
            { name: "LocationDescription", width: 180, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "BusinessName", width:220, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "Isdcode", width: 50, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "CityCode", width: 50, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "StateCode", width: 50, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "CurrencyCode", width: 50, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "CurrencyName", width: 80, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
            { name: "TaxIdentification", width: 50, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "ESyaLicenseType", editable: true, align: 'left', width: 80, edittype: "select", resizable: false, formatter: 'select', editoptions: { value: "P: Perpetual;S: Subscription" }, hidden: false},

            { name: "EUserLicenses", width: 50, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "ENoOfBeds", width: 50, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "BusinessSegmentId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: true },
            { name: "TolocalCurrency", hidden: true, width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "TocurrConversion", hidden: true, width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "TorealCurrency", hidden: true,width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "IsBookOfAccounts", width: 80, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
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
        caption: 'Business Location',
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
        fnAlert("w", "EPS_17_00", "UI0051", errorMsg.SelectBusinessEntity_E6);
    }
    else
    {
        _isInsert = true;
        fnClearFields();
        BindCities();
        BindTaxIdentification();
        BindCurrrencies();
        $('#PopupBusienssLocation').modal('show');
        fnRdoSegmentLinkEmpty();
        $('#rdoIsBookofAccounts').prop('checked', true);
        $('#chkToRealCurrency').parent().removeClass("is-checked");
        $('.BSCurrencyContainer').hide();
        LoadCurrencybyBusinessKey();
        $("#chkActiveStatus").parent().addClass("is-checked");
        $('#PopupBusienssLocation').find('.modal-title').text(localization.AddBusinessLocation);
        $("#btnSaveBusinessLocation").html('<i class="fa fa-save"></i>' + localization.Save);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveBusinessLocation").show();
        $("#btnSaveBusinessLocation").html('Save');
        $("#btnDeactivateBusinessLocation").hide();
        fnGetBusinessUnitType();
    }
}

function fnEditBusinessLocation(e, actiontype) {
    var rowid = $("#jqgBusienssLocation").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgBusienssLocation').jqGrid('getRowData', rowid);
    $("#divChkActiveStatus").css('display', 'none');
    $('#cboBusinessEntity').val(rowData.BusinessId).selectpicker('refresh');
    //$('#txtLocationcode').val(rowData.LocationCode);

    

    $('#txtLocationDescription').val(rowData.LocationDescription);
    $('#txtBusinessName').val(rowData.BusinessName);
    $('#txtBusinesskey').val(rowData.BusinessKey);
    $("#txtlocationId").val(rowData.LocationId)
    if (rowData.IsBookOfAccounts == 'true') {
        fnRdoSegmentLinkEmpty();
        $('#rdoIsBookofAccounts').prop('checked', true);

        fnGetBusinessUnitType();
    }
    else
    {
        fnBindExistingLocationsasSegments();
        $('#cboBusinessSegment').val(rowData.BusinessSegmentId).selectpicker('refresh');
        $('#rdoIsBookofAccounts').prop('checked', false);
        $('#rdoIsCostCenter').prop('checked', true);
        $("#divsegment").show();
    }
    $('#cboISDCode').val(rowData.Isdcode).selectpicker('refresh');
    BindCities();
    BindTaxIdentification();
    BindCurrrencies();
    $('#cboCityCode').val(rowData.CityCode).selectpicker('refresh');
    $('#cboCurrrencyCode').val(rowData.CurrencyCode).selectpicker('refresh');
    $('#cboTaxIdentification').val(rowData.TaxIdentification).selectpicker('refresh');
    fnGetStateNamebyTaxCode();
    //$('#txtTin').val(rowData.TaxIdentification);
    //$('#txtStateCode').val(rowData.StateCode);
    $('#cboLicenseType').val(rowData.ESyaLicenseType).selectpicker('refresh');
    $('#txtUserLicenses').val(rowData.EUserLicenses);
    $('#txtNoOfBeds').val(rowData.ENoOfBeds);
    if (rowData.TolocalCurrency == 'true') {
        $("#chkToLocalCurrency").parent().addClass("is-checked");
    }
    else {
        $("#chkToLocalCurrency").parent().removeClass("is-checked");
    }
    if (rowData.TocurrConversion == 'true') {
        $("#chkToCurrCurrency").parent().addClass("is-checked");
    }
    else {
        $("#chkToCurrCurrency").parent().removeClass("is-checked");
    }
    if (rowData.TorealCurrency == 'true') {
        $("#chkToRealCurrency").parent().addClass("is-checked");
        LoadCurrencybyBusinessKey();
        $('.BSCurrencyContainer').show();
    }
    else {
        $("#chkToRealCurrency").parent().removeClass("is-checked");
        LoadCurrencybyBusinessKey();
        $('.BSCurrencyContainer').hide();
    }
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveBusinessLocation").attr("disabled", false);
    _isInsert = false;

    

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EPS_17_00", "UIC02", errorMsg.editauth_E2);
            return;
        }
        
        $('#PopupBusienssLocation').modal('show');
        $('#PopupBusienssLocation').find('.modal-title').text(localization.UpdateBusinessLocation);
        $("#btnSaveBusinessLocation").html('<i class="fa fa-sync mr-1"></i>' + localization.Update);
        $("#btnDeactivateBusinessLocation").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveBusinessLocation").attr("disabled", false);
    }
  
    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "EPS_17_00", "UIC03", errorMsg.vieweauth_E3);
            return;
        }
        $("#divChkActiveStatus").css('display', 'flex');
        $('#PopupBusienssLocation').modal('show');
        $('#PopupBusienssLocation').find('.modal-title').text(localization.ViewBusienssLocation);
        $("#btnSaveBusinessLocation").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveBusinessLocation").hide();
        $("#btnDeactivateBusinessLocation").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupBusienssLocation").on('hidden.bs.modal', function () {
            $("#btnSaveBusinessLocation").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            fnAlert("w", "EPS_17_00", "UIC04", errorMsg.deleteauth_E4);
            return;
        }
        $("#divChkActiveStatus").css('display', 'none');
        $('#PopupBusienssLocation').modal('show');
        $('#PopupBusienssLocation').find('.modal-title').text("Activate/De Activate Busienss Location");
        $("#btnSaveBusinessLocation").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveBusinessLocation").hide();

        if (rowData.ActiveStatus == 'true') {
            $("#btnDeactivateBusinessLocation").html(localization.DActivate);
        }
        else {
            $("#btnDeactivateBusinessLocation").html(localization.Activate);
        }
        

        $("#btnDeactivateBusinessLocation").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupBusienssLocation").on('hidden.bs.modal', function () {
            $("#btnSaveBusinessLocation").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

var _isInsert = true;


function fnGridRefreshBusinessLocation() {
    $("#jqgBusienssLocation").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {
    $("#cboBusinessSegment").val('0').selectpicker('refresh');
    $("#txtBusinesskey").val('');
    $("#txtlocationId").val('');
    //$("#txtLocationcode").val('');
    $("#txtLocationDescription").val('');
    $("#txtBusinessName").val('');
    $("#cboISDCode").val('0').selectpicker('refresh');
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
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#btnSaveBusinessLocation").attr("disabled", false);
    $("#btnDeactivateBusinessLocation").attr("disabled", false);
    fnRdoSegmentLinkEmpty();
    $("#divChkActiveStatus").css('display', 'none');
}

$("#btnCancelBusinessLocation").click(function () {
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

function fnSaveBusinessLocation()
{
    var isbookofaccount = true;

    if ($("#cboBusinessEntity").val() === '0' || $("#cboBusinessEntity").val() === "0" || IsStringNullorEmpty($("#cboBusinessEntity").val())) {
        fnAlert("w", "EPS_17_00", "UI0052", errorMsg.SelectBusinessEntity_E7);
        return;
    }
    
    if (IsStringNullorEmpty($("#txtLocationDescription").val())) {
        fnAlert("w", "EPS_17_00", "UI0053", errorMsg.LocationDesc_E8);
        return;
    }
    if (IsStringNullorEmpty($("#txtBusinessName").val())) {
        fnAlert("w", "EPS_17_00", "UI0054", errorMsg.BusinessName_E9);
        return;
    }
  
    if ($('input[name="rdoSegmentLinkAccount"]:checked').val() == 'RCC') {

        if ($("#cboBusinessSegment").val() === '0' || $("#cboBusinessSegment").val() === "0" || IsStringNullorEmpty($("#cboBusinessSegment").val())) {
            fnAlert("w", "EPS_17_00", "UI0055", errorMsg.BusinessSegmentcostCenter_E10);
            return;
        }
        isbookofaccount = false;
    }
    if ($('input[name="rdoSegmentLinkAccount"]:checked').val() == 'RBA') {

        isbookofaccount = true;
        $("#cboBusinessSegment").val('0').selectpicker('refresh');
    }
    if ($("#cboISDCode").val() === '0' || $("#cboISDCode").val() === "0" || IsStringNullorEmpty($("#cboISDCode").val())) {
        fnAlert("w", "EPS_17_00", "UI0056",errorMsg.ISDCode_E11);
        return;
    }
    if ($("#cboCityCode").val() === '0' || $("#cboCityCode").val() === "0" || IsStringNullorEmpty($("#cboCityCode").val())) {
        fnAlert("w", "EPS_17_00", "UI0057", errorMsg.CitySelect_E12);
        return;
    }
    if ($("#cboCurrrencyCode").val() === '0' || $("#cboCurrrencyCode").val() === "0" || IsStringNullorEmpty($("#cboCurrrencyCode").val())) {
        fnAlert("w", "EPS_17_00", "UI0058", errorMsg.CurrencyCode_E13);
        return;
    }
    if ($("#cboTaxIdentification").val() === '0' || $("#cboTaxIdentification").val() === "0" || IsStringNullorEmpty($("#cboTaxIdentification").val())) {
        fnAlert("w", "EPS_17_00", "UI0059", errorMsg.TaxIdentification_E14);
        return;
    }
   
    if ($("#cboLicenseType").val() === '0' || $("#cboLicenseType").val() === "0" || IsStringNullorEmpty($("#cboLicenseType").val())) {
        fnAlert("w", "EPS_17_00", "UI0060", errorMsg.LicenseType_E15);
        return;
    }
    if (IsStringNullorEmpty($("#txtUserLicenses").val())) {
        fnAlert("w", "EPS_17_00", "UI0061", errorMsg.UserLicenses_E16);
        return;
    }
    objloc = {
        BusinessId: $("#cboBusinessEntity").val(),
        LocationId: $("#txtlocationId").val() === '' ? 0 : $("#txtlocationId").val(),
        BusinessKey: $("#txtBusinesskey").val() === '' ? 0 : $("#txtBusinesskey").val(),
        //LocationCode: $("#txtLocationcode").val(),
        LocationDescription: $("#txtLocationDescription").val(),
        BusinessName: $("#txtBusinessName").val(),
        Isdcode: $("#cboISDCode").val(),
        CityCode: $("#cboCityCode").val(),
        StateCode: $("#txtStateCode").val(),
        CurrencyCode: $("#cboCurrrencyCode").val(),
        TaxIdentification: $("#cboTaxIdentification").val(),
        ESyaLicenseType: $("#cboLicenseType").val(),
        EUserLicenses: $("#txtUserLicenses").val(),
        //EBusinessKey:,
        //EActiveUsers: ,
        ENoOfBeds: $("#txtNoOfBeds").val(),
        TolocalCurrency: $("#chkToLocalCurrency").parent().hasClass("is-checked"),
        TocurrConversion: $("#chkToCurrCurrency").parent().hasClass("is-checked"),
        TorealCurrency: $("#chkToRealCurrency").parent().hasClass("is-checked"),
        //IsBookOfAccounts: $("#chkIsBookofAccounts").parent().hasClass("is-checked"),
        IsBookOfAccounts: isbookofaccount,
        BusinessSegmentId: $("#cboBusinessSegment").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };
    var bsCurrency = [];
    var jqgBSCurrency = jQuery("#jqgBSCurrency").jqGrid('getRowData');
    
    for (var i = 0; i < jqgBSCurrency.length; ++i) {
        if (parseFloat(jqgBSCurrency[i]["CurrencyCode"]) != '') {
            bsCurrency.push({
                CurrencyCode: jqgBSCurrency[i]["CurrencyCode"],
                ActiveStatus: jqgBSCurrency[i]["ActiveStatus"]
            });
        }
    }

    objloc.l_BSCurrency = bsCurrency;


    $("#btnSaveBusinessLocation").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/License/InsertOrUpdateBusinessLocation',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: objloc },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveBusinessLocation").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupBusienssLocation").modal('hide');
                fnClearFields();
                fnGridRefreshBusinessLocation();
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveBusinessLocation").attr("disabled", false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveBusinessLocation").attr("disabled", false);
        }
    });
}


function fnDeleteBusinessLocation() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btnDeactivateBusinessLocation").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/License/ActiveOrDeActiveBusinessLocation?status=' + a_status + '&BusinessId=' + $("#cboBusinessEntity").val()
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


function fnOnChangeIsdCode()
{
    var _cboISDCode = $("#cboISDCode").val();
    if (_cboISDCode == 91) {
        $("#divTaxIdentification").css('display', 'flex');
    }
    else {
        $("#divTaxIdentification").css('display', 'none');
    }
    BindCities();
    BindTaxIdentification();
    BindCurrrencies();
}

function BindCities() {

    $("#cboCityCode").empty();
    $.ajax({
        url: getBaseURL() + '/License/GetCityListbyISDCode?isdCode=' + $("#cboISDCode").val(),
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

                $("#cboCityCode").append($("<option value='0'> Select </option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboCityCode").append($("<option></option>").val(response[i]["CityCode"]).html(response[i]["CityDesc"]));
                }
                $('#cboCityCode').selectpicker('refresh');
            }
            else {
                $("#cboCityCode").empty();
                $("#cboCityCode").append($("<option value='0'> Select </option>"));
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
        url: getBaseURL() + '/License/GetTaxIdentificationListByIsdCode?isdCode=' + $("#cboISDCode").val(),
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

                $("#cboTaxIdentification").append($("<option value='0'> Select </option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboTaxIdentification").append($("<option></option>").val(response[i]["TaxIdentificationId"]).html(response[i]["TaxIdentificationDesc"]));
                }
                $('#cboTaxIdentification').selectpicker('refresh');
            }
            else {
                $("#cboTaxIdentification").empty();
                $("#cboTaxIdentification").append($("<option value='0'> Select </option>"));
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
        url: getBaseURL() + '/License/GetCurrencyListbyIsdCode?isdCode=' + $("#cboISDCode").val(),
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

                $("#cboCurrrencyCode").append($("<option value='0'> Select </option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboCurrrencyCode").append($("<option></option>").val(response[i]["CurrencyCode"]).html(response[i]["CurrencyName"]));
                }
                $('#cboCurrrencyCode').selectpicker('refresh');
            }
            else {
                $("#cboCurrrencyCode").empty();
                $("#cboCurrrencyCode").append($("<option value='0'> Select </option>"));
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
        url: getBaseURL() + '/License/GetActiveLocationsAsSegments',
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

                $("#cboBusinessSegment").append($("<option value='0'> Select </option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboBusinessSegment").append($("<option></option>").val(response[i]["SegmentId"]).html(response[i]["BusinessName"]));
                }
                $('#cboBusinessSegment').selectpicker('refresh');
            }
            else {
                $("#cboBusinessSegment").empty();
                $("#cboBusinessSegment").append($("<option value='0'> Select </option>"));
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
        url: getBaseURL() + '/License/GetStateCodeByISDCode?isdCode=' + $("#cboISDCode").val() + '&TaxIdentificationId=' + $("#cboTaxIdentification").val(),
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


function fnToRealCurrency(elem) {
    
    if (elem.checked) {
        $("#chkToRealCurrency").parent().addClass("is-checked");
        LoadCurrencybyBusinessKey();
        $('.BSCurrencyContainer').show();
    }
    else {
        $('#chkToRealCurrency').parent().removeClass("is-checked");
        $('.BSCurrencyContainer').hide();
    }
}

function LoadCurrencybyBusinessKey() {
    var URL = getBaseURL() + "/License/GetCurrencybyBusinessKey?Businesskey=" + $("#txtBusinesskey").val();

    $("#jqgBSCurrency").jqGrid('GridUnload');
    $("#jqgBSCurrency").jqGrid({
        url: URL,
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: ["Currency Code", "Currency", "Status"],
        colModel: [
            { name: "CurrencyCode", width: 120, editable: false, align: 'left', hidden: true },
            { name: "CurrencyName", editable: false, width: 180, align: 'left', resizable: false },
            { name: "ActiveStatus", editable: true, width: 70, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } }

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
        url: getBaseURL() + '/License/GetBusinessUnitType?businessId=' + $("#cboBusinessEntity").val(),
        success: function (response) {
            if (response !== null)
            {
                if (response.BusinessUnitType=="M")
                {
                    $('#rdoIsBookofAccounts').attr('checked', 'checked');
                    $('#lblRdoSegmentLinkAccount').show();
                    $('#rdoIsCostCenter').prop('checked', false);
                    $("#divsegment").hide();
                    $("#cboBusinessSegment").empty();
                    $("#cboBusinessSegment").append($("<option value='0'> Select </option>"));
                    $("#cboBusinessSegment").selectpicker('refresh');
                }
                else if (response.BusinessUnitType == "S")
                {
                    $('#rdoIsBookofAccounts').attr('checked', 'checked');
                    $('#rdoIsCostCenter').prop('checked', false);
                    $('#lblRdoSegmentLinkAccount').hide();
                    $("#divsegment").hide();
                    $("#cboBusinessSegment").empty();
                    $("#cboBusinessSegment").append($("<option value='0'> Select </option>"));
                    $("#cboBusinessSegment").selectpicker('refresh');
                }
       
            }
           
        },
        error: function (response) {
        }
    });
}