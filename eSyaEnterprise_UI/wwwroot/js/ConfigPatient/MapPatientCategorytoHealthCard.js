
$(function () {

    $("#txtOfferStartDate").datepicker({

        dateFormat: _cnfDateFormat,
    });
    $("#txtOfferEndDate").datepicker({
        minDate: $("#txtOfferStartDate").val(),
        dateFormat: _cnfDateFormat,
    });

    $("#txtHCREffectiveFrom").datepicker({

        dateFormat: _cnfDateFormat,
    });
    $("#txtHCREffectiveTill").datepicker({
        minDate: $("#txtHCREffectiveFrom").val(),
        dateFormat: _cnfDateFormat,
    });

    $.contextMenu({
       selector: "#btnHealthCardDetails",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditHealthCardDetails('edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditHealthCardDetails('view') } }
        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");

    $.contextMenu({
        selector: "#btnHealthCardRates",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditHealthCardRates('edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditHealthCardRates('view') } }
        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
});


function fnBusinessKey_OnChange() {
    fnBindPatientTypes();
    fnLoadGridHealthCardDetails();
}
function fnPatientType_OnChange() {
    fnBindPatientCategories();
    fnLoadGridHealthCardDetails();
}
function fnPatientCategory_OnChange() {
    fnLoadGridHealthCardDetails();
}

//function fnPatientType_OnChange() {
//    fnBindPatientCategories();
//    fnLoadGridHealthCardDetails();
//}
function fnHealthCard_OnChange() {
    {
        fnLoadGridHealthCardDetails();
     
    }
    
}
function fnBindPatientTypes() {
    var bkkeys = $("#cboBusinessKey").val();
    $("#cboPatientTypes").empty();
    $.ajax({
        url: getBaseURL() + '/HealthCard/GetPatientTypesbyBusinessKey?businesskey=' + bkkeys,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", xhr.StatusCode, xhr.statusText);
        },
        success: function (response, data) {
            if (response != null) {
                //refresh each time
                $("#cboPatientTypes").empty();

                $("#cboPatientTypes").append($("<option value='0'> Select </option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboPatientTypes").append($("<option></option>").val(response[i]["PatientTypeId"]).html(response[i]["Description"]));
                }
                $('#cboPatientTypes').selectpicker('refresh');
            }
            else {
                $("#cboPatientTypes").empty();
                $("#cboPatientTypes").append($("<option value='0'> Select </option>"));
                $('#cboPatientTypes').selectpicker('refresh');
            }
        },
       
        async: false,
        processData: false,
        
    });

    fnBindPatientCategories();
}

function fnBindPatientCategories() {
    var bkey = $("#cboBusinessKey").val();
    var ptype = $("#cboPatientTypes").val();
    $("#cboPatientCategory").empty();
    $.ajax({
        url: getBaseURL() + '/HealthCard/GetPatientCategoriesbyPatientType?businesskey=' + bkey + '&patienttypeID=' + ptype,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", xhr.StatusCode, xhr.statusText);
        },
        success: function (response, data) {
            if (response != null) {
                //refresh each time
                $("#cboPatientCategory").empty();

                $("#cboPatientCategory").append($("<option value='0'> Select </option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboPatientCategory").append($("<option></option>").val(response[i]["PatientCategoryId"]).html(response[i]["Description"]));
                }
                $('#cboPatientCategory').selectpicker('refresh');
            }
            else {
                $("#cboPatientCategory").empty();
                $("#cboPatientCategory").append($("<option value='0'> Select </option>"));
                $('#cboPatientCategory').selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });


}
function fnLoadGridHealthCardDetails() {

    $("#jqgHealthCardDetails").GridUnload();

    $("#jqgHealthCardDetails").jqGrid({
        url: getBaseURL() + '/HealthCard/GetHealthCareCards?businesskey=' + $("#cboBusinessKey").val() + '&patienttypeID=' + $("#cboPatientTypes").val()
            + '&patientcategoryID=' + $("#cboPatientCategory").val() + '&healthcardID=' + $("#cboHealthCard").val(),
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.BusinessKey, localization.PatientTypeId, localization.PatientCategoryId, localization.HealthCardId, localization.OfferStartDate, localization.OfferEndDate, localization.CardValidityInMonths, localization.CareCardNoPattern, localization.IsSpecialtySpecific, localization.Active, localization.Actions],
        colModel: [
            { name: "BusinessKey", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "PatientTypeId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "PatientCategoryId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "HealthCardId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            {
                name: "OfferStartDate", width: 40, hidden: false, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            {
                name: "OfferEndDate", width: 40, hidden: false, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },

            { name: "CardValidityInMonths", width: 40, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false },
            { name: "CareCardNoPattern", width: 40, align: 'left', editable: true, editoptions: { maxlength: 150 }, hidden: false, resizable: false },
            { name: "IsSpecialtySpecific", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },

            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnHealthCardDetails"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],

        pager: "#jqpHealthCardDetails",
        rowNum: 10,
        sortable: false,
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
        forceFit: true, caption: localization.HealthCardDetails,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgHealthCardDetails");

        },
        onSelectRow: function (rowid, status, e) {
            
        },
    }).jqGrid('navGrid', '#jqpHealthCardDetails', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpHealthCardDetails', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshHealthCardDetails
    }).jqGrid('navButtonAdd', '#jqpHealthCardDetails', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddHealthCardDetails
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgHealthCardDetails"),
            newWidth = $grid.closest(".Activitiescontainer").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}
function fnGridRefreshHealthCardDetails() {
    $("#jqgHealthCardDetails").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnAddHealthCardDetails() {
    if ($("#cboBusinessKey").val() == "0") {
        fnAlert("w", "EPM_06_00", "UI0064", errorMsg.BusinessLocation_E11);
        return;
    }
    if ($("#cboPatientTypes").val() == "0") {
        fnAlert("w", "EPM_06_00", "UI0274", errorMsg.PatientType_E12);
        return;
    }
    if ($("#cboPatientCategory").val() == "0") {
        fnAlert("w", "EPM_06_00", "UI0275", errorMsg.PatientCategory_E13);
        return;
    }
    if ($("#cboHealthCard").val() == "0") {
        fnAlert("w", "EPM_06_00", "UI0444", errorMsg.HealthCard_E14);
        return;
    }
    fnClearHealthCardDetails();
    $("#divGridHealthCard").hide();
    $("#divFormHealthCard").show();
    fnSetSidebar();
    $("#HealthCardDetails-tab").addClass("active");
    $("#HealthCardDetails").addClass("show active");
    $("#chkHCActiveStatus").parent().addClass("is-checked");
    fnLoadGridSpecialtyLink();
    $("#chkIsSpecialtySpecific").parent().removeClass("is-checked");
    $("#divSpecialtyLink").hide();
    $("#txtOfferStartDate").attr('disabled', false);
    $("#btnSaveHealthCardDetails").show();
    $("#lblHCDisplayNames").text($("#cboHealthCard option:selected").text());
}


function fnEditHealthCardDetails(actiontype) {
    var rowid = $("#jqgHealthCardDetails").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgHealthCardDetails').jqGrid('getRowData', rowid);
    $("#lblHCDisplayNames").text($("#cboHealthCard option:selected").text());
     $("#txtCardValidityInMonths").val(rowData.CardValidityInMonths);
    $("#txtCareCardNoInPatterns").val(rowData.CareCardNoPattern);
    if (rowData.ActiveStatus == 'true') {
        $("#chkHCActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkHCActiveStatus").parent().removeClass("is-checked");
    }

    document.getElementById("txtOfferStartDate").disabled = true;
    if (rowData.OfferStartDate !== null) {
        setDate($('#txtOfferStartDate'), fnGetDateFormat(rowData.OfferStartDate));
        $("#txtOfferStartDate").attr('disabled', true);
    }
    else {
        $('#txtOfferStartDate').val('');
    }

    
    if (rowData.OfferEndDate !== null) {
        setDate($('#txtOfferEndDate'), fnGetDateFormat(rowData.OfferEndDate));
        
    }
    else {
        $('#txtOfferEndDate').val('');
    }

    $("#btnSaveHealthCardDetails").attr('disabled', false);
    fnSetSidebar();
    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EPM_06_00", "UIC02", errorMsg.editauth_E2);
            return;
        }
        
        $("#divGridHealthCard").hide();
        $("#divFormHealthCard").show();
        $("#HealthCardDetails-tab").addClass("active");
        $("#HealthCardDetails").addClass("show active");
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveHealthCardDetails").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("input,textarea").attr('disabled', false);
        $("select").next().attr('disabled', false);
        $("#btnSaveHealthCardDetails").show();
    }
    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "EPM_06_00", "UIC03", errorMsg.vieweauth_E3);
            return;
        }
        $("#divGridHealthCard").hide();
        $("#divFormHealthCard").show();
        $("#HealthCardDetails-tab").addClass("active");
        $("#HealthCardDetails").addClass("show active");
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveHealthCardDetails").hide();
        $("input,textarea").attr('disabled', true);
        $("select").next().attr('disabled', true);
    }
 
    if (rowData.IsSpecialtySpecific == 'true') {
        $("#chkIsSpecialtySpecific").parent().addClass("is-checked");
        fnLoadGridSpecialtyLink();
        $("#divSpecialtyLink").show();
    }
    else {
        $("#chkIsSpecialtySpecific").parent().removeClass("is-checked");
        fnLoadGridSpecialtyLink();
        $("#divSpecialtyLink").hide();
    }
   
}


function fnClearHealthCardDetails() {
    $("input,textarea").attr('disabled', false);
    $("select").next().attr('disabled', false);
    $("#txtOfferStartDate").val('');
    $("#txtOfferEndDate").val('');
    $("#txtCardValidityInMonths").val('');
    $("#txtCareCardNoInPatterns").val('');
    $("#chkIsSpecialtySpecific").parent().removeClass("is-checked");
    fnLoadGridSpecialtyLink();
    $("#divSpecialtyLink").hide();
    $("#lblHCDisplayNames").text('');
}
function fnIsSpecialtySpecific() {
    
    var _lblIsSpecialtySpecific = $("#lblIsSpecialtySpecific");
    if (!_lblIsSpecialtySpecific.hasClass('is-checked')) {
        fnLoadGridSpecialtyLink();
        $("#divSpecialtyLink").show();
    }
    else {
        $("#divSpecialtyLink").hide();
        fnLoadGridSpecialtyLink();
    }
}

function fnLoadGridSpecialtyLink() {

    $("#jqgSpecialtyLink").GridUnload();

    $("#jqgSpecialtyLink").jqGrid({
        url: getBaseURL() + '/HealthCard/GetSpecialtiesLinkedHealthCareCard?businesskey=' + $("#cboBusinessKey").val() + '&healthcardID=' + $("#cboHealthCard").val(),
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.BusinessKey, localization.HealthCardId, localization.SpecialtyId,localization.SpecialtyDesc,localization.Active],
        colModel: [
            { name: "BusinessKey", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "HealthCardId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "SpecialtyId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "SpecialtyDesc", width: 250, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: false },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false } },
        ],

        pager: "#jqpSpecialtyLink",
        rowNum: 10,
        sortable: false,
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
        forceFit: true, caption: localization.SpecialtyLink,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgSpecialtyLink");
        },
        onSelectRow: function (rowid, status, e) {

        },
    }).jqGrid('navGrid', '#jqpSpecialtyLink', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpSpecialtyLink', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshSpecialtyLink
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgSpecialtyLink"),
            newWidth = $grid.closest(".Activitiescontainer").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnGridRefreshSpecialtyLink() {
    $("#jqgSpecialtyLink").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}


function fnSaveHealthCardDetails() {


    if (IsStringNullorEmpty($("#txtOfferStartDate").val())) {
        fnAlert("w", "EPM_06_00", "UI0445", errorMsg.Offerstartdate_E15);
        return false;
    }
    if (IsStringNullorEmpty($("#txtCardValidityInMonths").val())) {
        fnAlert("w", "EPM_06_00", "UI0446", errorMsg.CardValidityinMonths_E16);
        return false;
    }
    if (IsStringNullorEmpty($("#txtCareCardNoInPatterns").val())) {
        fnAlert("w", "EPM_06_00", "UI0447", errorMsg.CardCardRates_E17);
        return false;
    }
    $("#jqgSpecialtyLink").jqGrid('editCell', 0, 0, false);

    obj_healthCardDetails = {
        BusinessKey: $("#cboBusinessKey").val(),
        PatientTypeId: $("#cboPatientTypes").val(),
        PatientCategoryId: $("#cboPatientCategory").val(),
        HealthCardId: $("#cboHealthCard").val(),
        OfferStartDate: getDate($("#txtOfferStartDate")),
        OfferEndDate: getDate($("#txtOfferEndDate")),
        CardValidityInMonths: $('#txtCardValidityInMonths').val(),
        CareCardNoPattern: $("#txtCareCardNoInPatterns").val(),
        IsSpecialtySpecific: $("#chkIsSpecialtySpecific").parent().hasClass("is-checked"),
        ActiveStatus: $("#chkHCActiveStatus").parent().hasClass("is-checked"),
       
    }

    var specialty = [];
    var gvT = $('#jqgSpecialtyLink').jqGrid('getRowData');
    for (var i = 0; i < gvT.length; ++i) {

        var _spec = {
            BusinessKey: $("#cboBusinessKey").val(),
            HealthCardId: $("#cboHealthCard").val(),
            SpecialtyId: gvT[i]['SpecialtyId'],
            ActiveStatus: gvT[i]['ActiveStatus']
        };
        specialty.push(_spec);

    }
    obj_healthCardDetails.lstspecialty = specialty;
    
    $("#btnSaveHealthCardDetails").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/HealthCard/InsertOrUpdateHealthCareCard',
        type: 'POST',
        datatype: 'json',
        data: { obj: obj_healthCardDetails },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveHealthCardDetails").attr('disabled', false);
  
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveHealthCardDetails").attr('disabled', false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveHealthCardDetails").attr("disabled", false);
        }
    });
}

function fnLoadGridHealthCardRates() {

    $("#jqgHealthCardRates").GridUnload();

    $("#jqgHealthCardRates").jqGrid({
        url: getBaseURL() + '/HealthCard/GetHealthCareCardRates?businesskey=' + $("#cboBusinessKey").val() + '&healthcardID=' + $("#cboHealthCard").val(),
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.BusinessKey, localization.HealthCardId, localization.CurrencyCode, localization.EffectiveFrom, localization.EffectiveTill, localization.CardCharges, localization.Active, localization.Actions],
        colModel: [
            { name: "BusinessKey", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "HealthCardId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "CurrencyCode", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: false },
            {
                name: "EffectiveFrom", width: 40, hidden: false, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            {
                name: "EffectiveTill", width: 40, hidden: false, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            { name: "CardCharges", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: false },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnHealthCardRates"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],

        pager: "#jqpHealthCardRates",
        rowNum: 10,
        sortable: false,
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
        forceFit: true, caption: localization.SpecialtyLink,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgHealthCardRates");
        },
        onSelectRow: function (rowid, status, e) {

        },
    }).jqGrid('navGrid', '#jqpHealthCardRates', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpHealthCardRates', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshHealthCardRates
    }).jqGrid('navButtonAdd', '#jqpHealthCardRates', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddHealthCardRates
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgHealthCardRates"),
            newWidth = $grid.closest(".Activitiescontainer").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddHealthCardRates() {
    $("#txtHCREffectiveFrom").val('');
    $("#txtHCREffectiveTill").val('');
    $("#txtCardCharges").val('');
    $("#cboCurrencyCode").val('0').selectpicker('refresh');
    $("#divHealthCardRates").show('500');
    $("#cboCurrencyCode").attr('disabled', false).selectpicker('refresh');
    $("#chkHCRActiveStatus").parent().addClass("is-checked");
}

$("#HealthCardDetails-tab").on('click', function () {
    $("#divHealthCardRates").hide();
})

function fnEditHealthCardRates(actiontype) {
    var rowid = $("#jqgHealthCardRates").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgHealthCardRates').jqGrid('getRowData', rowid);
    
     
    $("#cboCurrencyCode").val(rowData.CurrencyCode).selectpicker('refresh');
    $("#cboCurrencyCode").attr('disabled', true).selectpicker('refresh');
    $("#txtCardCharges").val(rowData.CardCharges);
    $("#divHealthCardRates").show();
    if (rowData.ActiveStatus == 'true') {
        $("#chkHCRActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkHCRActiveStatus").parent().removeClass("is-checked");
    }

    document.getElementById("txtHCREffectiveFrom").disabled = true;
    if (rowData.EffectiveFrom !== null) {
        setDate($('#txtHCREffectiveFrom'), fnGetDateFormat(rowData.EffectiveFrom));
        $("#txtHCREffectiveFrom").attr('disabled', true);
    }
    else {
        $('#txtHCREffectiveFrom').val('');
    }


    if (rowData.EffectiveTill !== null) {
        setDate($('#txtHCREffectiveTill'), fnGetDateFormat(rowData.EffectiveTill));

    }
    else {
        $('#txtHCREffectiveTill').val('');
    }




    $("#btnSaveHealthCardDetails").attr('disabled', false);
    fnSetSidebar();
    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EPM_06_00", "UIC02", errorMsg.editauth_E2);
            return;
        }

         
        $("#chkHCRActiveStatus").prop('disabled', true);
        $("#btnSaveHealthCardRates").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("input,textarea").attr('disabled', false);
        $("select").next().attr('disabled', false);
        $("#btnSaveHealthCardRates").show();
    }
    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "EPM_06_00", "UIC03", errorMsg.vieweauth_E3);
            return;
        }
        
        $("#chkHCRActiveStatus").prop('disabled', true);
        $("#btnSaveHealthCardRates").hide();
        $("input,textarea").attr('disabled', true);
        $("select").next().attr('disabled', true);
    }

    

}


function fnGridRefreshHealthCardRates() {
    $("#jqgHealthCardRates").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}
function fnSaveCareCardRates() {

    if (IsStringNullorEmpty($("#cboCurrencyCode").val()) || $("#cboCurrencyCode").val() == "0") {
        fnAlert("w", "EPM_06_00", "UI0022", errorMsg.CurrencyCode_E18);
        return;
    }
    if (IsStringNullorEmpty($("#txtHCREffectiveFrom").val()) || $("#txtHCREffectiveFrom").val() === "0") {
        fnAlert("w", "EPM_06_00", "UI0033", errorMsg.EffectiveFromDate_E19);
        return;
    }
    
    if (IsStringNullorEmpty($("#txtCardCharges").val())) {
        fnAlert("w", "EPM_06_00", "UI0448", errorMsg.CareCardRates_E20);
        return;
    }
    

    objrates = {
        BusinessKey: $("#cboBusinessKey").val(),
        HealthCardId: $("#cboHealthCard").val(),
        CurrencyCode: $("#cboCurrencyCode").val(),
        EffectiveFrom: getDate($("#txtHCREffectiveFrom")),
        EffectiveTill: getDate($("#txtHCREffectiveTill")),
        CardCharges: $("#txtCardCharges").val(),
        ActiveStatus: $("#chkHCRActiveStatus").parent().hasClass("is-checked"),

    };

    $("#btnSaveCareCardRates").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/HealthCard/InsertOrUpdateHealthCareCardRates',
        type: 'POST',
        datatype: 'json',
        data: { obj: objrates },
        success: function (response) {
            if (response.Status) {

                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveCareCardRates").attr("disabled", false);
                
                fnClearHealthCardRates();
                fnGridRefreshHealthCardRates();
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveCareCardRates").attr("disabled", false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveCareCardRates").attr("disabled", false);
        }
    });
}
function fnClearHealthCardRates() {
    $("#divHealthCardRates").hide();
    $("input,textarea").attr('disabled', false);
    $("select").next().attr('disabled', false);
    $("#txtHCREffectiveFrom").val('');
    $("#txtHCREffectiveTill").val('');
    $("#txtCardCharges").val('');
    $("#cboCurrencyCode").val('0').selectpicker('refresh');
    $("#cboCurrencyCode").attr('disabled', false).selectpicker('refresh');
    fnLoadGridHealthCardRates();
}
function fnSetSidebar() {
    var _tabcontent = $(".tab-content").offset();
    var _fullH = $(window).height();
    var _newTabH = (_fullH - _tabcontent.top - 15);
    var windW = $(window).width();
    if (windW > 1099) {
        $(".tab-content,#HealthCard-pills-tab").css({ "height": _newTabH, "overflow-y": "auto" });
    }
    else {
        $(".tab-content").css({ "height": _newTabH, "overflow-y": "auto" });
    }
}

function fnCloseHealthCardDetails() {
    fnGridRefreshHealthCardDetails();
    $("#divGridHealthCard").show();
    $("#divFormHealthCard").hide();
    $(".tab-pane").removeClass('active show');
    $("#HealthCard-pills-tab button").removeClass("active");

}

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}