var itemsDisabled = {};
var servicesDisabled = {};
var isinsert = false;
$(function () {
   
   $.contextMenu({
        selector: "#btnServiceClass",
        trigger: 'left',
       items: {
           jqgAdd: {
               name: localization.Add, icon: "add", callback: function (key, opt) { fnAddServiceClass() }, disabled: function (key, opt) {
                   return !!itemsDisabled[key];
               } },
           jqgEdit: {
               name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditServiceClass('edit') }, disabled: function (key, opt) {
                   return !!itemsDisabled[key];
               } },
           jqgView: {
               name: localization.View, icon: "view", callback: function (key, opt) { fnEditServiceClass('view') }, disabled: function (key, opt) {
                   return !!itemsDisabled[key];
               }
},
           jqgDelete: {
               name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditServiceClass('delete') }, disabled: function (key, opt) {
                   return !!itemsDisabled[key];
               }
},
        }
     });
    $(".context-menu-icon-add").html("<span class='icon-contextMenu'><i class='fa fa-plus'></i>" + localization.Add + " </span>");
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");


    $.contextMenu({
        selector: "#btnServices",
        trigger: 'left',
        items: {
            jqgAddS: {
                name: localization.Add, icon: "add", callback: function (key, opt) { fnAddServices() }, disabled: function (key, opt) {
                    return !!servicesDisabled[key];
                } },
            jqgEditS: {
                name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditServices('edit') }, disabled: function (key, opt) {
                    return !!servicesDisabled[key];
                } },
            jqgViewS: {
                name: localization.View, icon: "view", callback: function (key, opt) { fnEditServices('view') }, disabled: function (key, opt) {
                    return !!servicesDisabled[key];
                } },
            jqgDeleteS: {
                name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditServices('delete') }, disabled: function (key, opt) {
                    return !!servicesDisabled[key];
                } },
        }
    });
    $(".context-menu-icon-add").html("<span class='icon-contextMenu'><i class='fa fa-plus'></i>" + localization.Add + " </span>");
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});
function fnChangeBusinessLocation() {
    
    $("#cboPatientCategory").empty();
    $.ajax({
        url: getBaseURL() + '/Discount/GetActivePatientCategoriesbyBusinessKey?businesskey=' + $("#cboBusinessLocation").val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", xhr.StatusCode, xhr.statusText);
        },
        success: function (response) {
            if (response != null) {
               
                //refresh each time
                $("#cboPatientCategory").empty();

                $("#cboPatientCategory").append($("<option value='0'> Select </option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboPatientCategory").append($("<option></option>").val(response[i]["PatientCategoryId"]).html(response[i]["PatientCategoryDesc"]));
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
function fnChangeDiscountat() {


    //if ($("#cboBusinessLocation").val() === "0" || $("#cboBusinessLocation").val() === "") {
    //    fnAlert("w", "EPM_07_00", "UI0064", errorMsg.BusinessLocation_E1);
    //    return false;
    //}
    //if ($("#cboPatientCategory").val() === "0" || $("#cboPatientCategory").val() === "") {
    //    fnAlert("w", "EPM_07_00", "UI0355", errorMsg.PatientCategory_E2);
    //    return false;
    //}
    //if ($("#cboDiscountFor").val() === "0" || $("#cboDiscountFor").val() === "") {
    //    fnAlert("w", "EPM_07_00", "UI0356", errorMsg.DiscountFor_E3);
    //    return false;
    //}
    //if ($("#cboDiscountAt").val() === "0" || $("#cboDiscountAt").val() === "") {
    //    fnAlert("w", "EPM_07_00", "UI0357", errorMsg.DiscountAt_E4);
    //    return false;
    //}

    var _discountAt = $("#cboDiscountAt").val();
   
    if (_discountAt == "650001") {
        $("#secServiceClass").show().slideDown();
        $("#secServices").hide();
        fnGridLoadServiceClass();
    }
    if (_discountAt == "650002") {
        $("#secServiceClass").hide();
        $("#secServices").show();
        fnGridLoadServices();
    }
    if (_discountAt == "0" ||_discountAt == null || _discountAt == undefined) {
        $("#secServices").hide();
        $("#secServiceClass").hide();
    }
   
}
function fnGridLoadServiceClass() {
    $("#jqgServiceClass").jqGrid('GridUnload');
   
    $("#jqgServiceClass").jqGrid({
        url: getBaseURL() + '/Discount/GetPatientCategoryDiscountbyDiscountAt?businesskey=' + $("#cboBusinessLocation").val() + '&patientcategoryId=' + $("#cboPatientCategory").val()
            + '&discountfor=' + $("#cboDiscountFor").val() + '&discountAt=' + $("#cboDiscountAt").val(),
       
        mtype: 'GET',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.BusinessKey, localization.PatientCategoryID,"", localization.ServiceClass, localization.DiscountRule, localization.DiscountPercentage, localization.ServiceChargePercentage, localization.Active, localization.Actions],
        colModel: [
            { name: "BusinessKey", width: 50, editable: true, align: 'left', hidden: true },
            { name: "PatientCategoryId", width: 50, editable: true, align: 'left', hidden: true },
            { name: "ServiceClassId", width: 50, editable: true, align: 'left', hidden: true },
            { name: "ServiceClassDesc", width: 170, editable: false, hidden: false, align: 'left', resizable: true, cellattr: function () { return ' title="eSya Tool Tip!"'; } },
            {
                name: "DiscountRule", width: 40, editable: true, align: 'left', resizable: false, hidden: true
                
            },
            { name: "DiscountPerc", width: 40, editable: true, align: 'left', resizable: false },
            { name: "ServiceChargePerc", editable: true, width: 50, align: 'left', resizable: false },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline btn-sm" style="" id="btnServiceClass"><i class="fa fa-ellipsis-v"></i> </button>'
                }
            },
        ],
        pager: "#jqpServiceClass",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: '55',
        loadonce: true,
        scroll: false,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        scrollOffset: 0,
        caption: localization.ServiceClass,
        loadComplete: function (data) {
            fnJqgridSmallScreen("jqgServiceClass");
            $('.ui-jqgrid-view,.ui-jqgrid,.ui-jqgrid-hdiv,.ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-bdiv,.ui-jqgrid-pager').css('width', 100 + '%');
        },
        onSelectRow: function (rowid, status, e) {
            var data = jQuery('#jqgServiceClass').getRowData(rowid); 
            (data.DiscountRule == 0 || data.DiscountRule == '0') ? fnToggleControl(1) : fnToggleControl(2)
           
        },
    }).jqGrid('navGrid', '#jqpServiceClass', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpServiceClass', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first"
    });
    fnAddGridSerialNoHeading();
}
function fnGridLoadServices() {
    $("#jqgServices").jqGrid('GridUnload');
    $("#jqgServices").jqGrid({
        url: getBaseURL() + '/Discount/GetPatientCategoryDiscountbyDiscountAt?businesskey=' + $("#cboBusinessLocation").val() + '&patientcategoryId=' + $("#cboPatientCategory").val()
            + '&discountfor=' + $("#cboDiscountFor").val() + '&discountAt=' + $("#cboDiscountAt").val(),
        mtype: 'GET',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.BusinessKey, localization.PatientCategoryID, "", localization.Services, localization.DiscountRule, localization.DiscountPercentage, localization.ServiceChargePercentage, localization.Active, localization.Actions],
        colModel: [
            { name: "BusinessKey", width: 50, editable: true, align: 'left', hidden: true },
            { name: "PatientCategoryId", width: 50, editable: true, align: 'left', hidden: true },
            { name: "ServiceId", width: 50, editable: true, align: 'left', hidden: true },
            { name: "ServiceDesc", width: 170, editable: false, hidden: false, align: 'left', resizable: true, cellattr: function () { return ' title="Here is my tooltip!"'; } },
            { name: "DiscountRule", width: 40, editable: true, align: 'left', resizable: false, hidden: false },
            { name: "DiscountPerc", width: 40, editable: true, align: 'left', resizable: false },
            { name: "ServiceChargePerc", editable: true, width: 50, align: 'left', resizable: false },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline btn-sm" style="" id="btnServices"><i class="fa fa-ellipsis-v"></i> </button>'
                }
            },
        ],
        pager: "#jqpServices",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: '55',
        loadonce: true,
        scroll: false,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        scrollOffset: 0,
        caption: localization.Services,
        loadComplete: function (data) {

            fnJqgridSmallScreen("jqgServices");
            $('.ui-jqgrid-view,.ui-jqgrid,.ui-jqgrid-hdiv,.ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-bdiv,.ui-jqgrid-pager').css('width', 100 + '%');
        },
        onSelectRow: function (rowid, status, e) {
            var datas = jQuery('#jqgServices').getRowData(rowid);
            (datas.DiscountRule == 0 || datas.DiscountRule == '0') ? fnToggleControlS(1) : fnToggleControlS(2)

        },
        
    }).jqGrid('navGrid', '#jqpServices', { add: false, edit: false, search: false, del: false, refresh: false });
    fnAddGridSerialNoHeading();
}
function fnToggleControl(value) {
   
    if (value == 1) {
        itemsDisabled["jqgAdd"] = false;
        itemsDisabled["jqgEdit"] = true;
        itemsDisabled["jqgView"] = true;
        itemsDisabled["jqgDelete"] = true;
    }
    if (value == 2) {
        itemsDisabled["jqgAdd"] = true;
        itemsDisabled["jqgEdit"] = false;
        itemsDisabled["jqgView"] = false;
        itemsDisabled["jqgDelete"] = false;
      }
}
function fnToggleControlS(value) {
    debugger;
    if (value == 1) {
        servicesDisabled["jqgAddS"] = false;
        servicesDisabled["jqgEditS"] = true;
        servicesDisabled["jqgViewS"] = true;
        servicesDisabled["jqgDeleteS"] = true;
    }
    if (value == 2) {
        servicesDisabled["jqgAddS"] = true;
        servicesDisabled["jqgEditS"] = false;
        servicesDisabled["jqgViewS"] = false;
        servicesDisabled["jqgDeleteS"] = false;
    }
}
function fnAddServiceClass() {
    var rowid = $("#jqgServiceClass").jqGrid('getGridParam', 'selrow');
    var rowData = $("#jqgServiceClass").jqGrid('getRowData', rowid);
    $("#txtServiceClass").val(rowData.ServiceClassDesc);
    $("#txtServiceClassId").val(rowData.ServiceClassId); 
    $("#cboDiscountRule").val('0').selectpicker('refresh');

    $("#divServiceClass").show(); 
    $("#divServices").hide(); 
    $("#txtServiceId").val(''); 
    $("#txtServices").val(''); 
    $("#txtDiscountPercentage").val('');
    $("#txtServiceChargePercentage").val('');

    if (rowData.ActiveStatus === "true") {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    eSyaParams.ClearValue();
    $('#PopupServiceClass').modal('show');
    isinsert = true;
    //$("#chkActiveStatus").parent().addClass("is-checked");
    //$("#chkActiveStatus").prop('disabled', true);
    $('#PopupServiceClass').find('.modal-title').text(localization.AddServiceClass);
    $("#btnSaveServiceClass").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#btnSaveServiceClass").show();
    $("#btndeactiveServiceClass").hide();
}
function fnAddServices() {
    var rowid = $("#jqgServices").jqGrid('getGridParam', 'selrow');
    var rowData = $("#jqgServices").jqGrid('getRowData', rowid);
    $("#txtServiceClass").val('');
    $("#txtServiceClassId").val('');
    $("#cboDiscountRule").val('0').selectpicker('refresh');

    $("#divServiceClass").hide();
    $("#divServices").show();
    $("#txtServiceId").val(rowData.ServiceId);
    $("#txtServices").val(rowData.ServiceDesc); 
    $("#txtDiscountPercentage").val('');
    $("#txtServiceChargePercentage").val('');

    if (rowData.ActiveStatus === "true") {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    eSyaParams.ClearValue();
    $('#PopupServiceClass').modal('show');
    isinsert = true;
    //$("#chkActiveStatus").parent().addClass("is-checked");
    //$("#chkActiveStatus").prop('disabled', true);
    $('#PopupServiceClass').find('.modal-title').text(localization.AddServiceClass);
    $("#btnSaveServiceClass").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#btnSaveServiceClass").show();
    $("#btndeactiveServiceClass").hide();
}
function fnEditServiceClass(actiontype) {
    var rowid = $("#jqgServiceClass").jqGrid('getGridParam', 'selrow');
    var rowData = $("#jqgServiceClass").jqGrid('getRowData', rowid);
    $("#txtServiceClassId").val(rowData.ServiceClassId);
    $("#txtServiceClass").val(rowData.ServiceClassDesc);
    $("#txtServiceId").val('');

    $("#cboDiscountRule").val(rowData.DiscountRule).selectpicker('refresh');
    $("#txtDiscountPercentage").val(rowData.DiscountPerc);
    $("#txtServiceChargePercentage").val(rowData.ServiceChargePerc);

    //$("#cboBusinessLocation").val(rowData.BusinessKey).selectpicker('refresh');
    //$("#cboPatientCategory").val(rowData.PatientCategoryId).selectpicker('refresh');
    //$("#cboDiscountFor").val(rowData.DiscountFor).selectpicker('refresh');
    //$("#cboDiscountAt").val(rowData.DiscountAt).selectpicker('refresh');
    
    $("#divServiceClass").show();
    $("#divServices").hide(); 

    if (rowData.ActiveStatus === "true") {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
   
    isinsert = false;

    fnFillPatientCategoryDiscountdetails(true);

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EPM_07_00", "UIC02", errorMsg.editauth_E2);
            return;
        }

        $('#PopupServiceClass').modal('show');
        $('#PopupServiceClass').find('.modal-title').text(localization.UpdateServiceClass);
        $("#btnSaveServiceClass").html('<i class="fa fa-sync mr-1"></i>' + localization.Update);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btndeactiveServiceClass").hide();
        $("input,textarea").attr('readonly', false);
        $("#cboDiscountRule").next().attr('disabled', false);
        $("#btnSaveServiceClass").show();
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "EPM_07_00", "UIC03", errorMsg.vieweauth_E3);
            return;
        }
        $('#PopupServiceClass').modal('show');
        $('#PopupServiceClass').find('.modal-title').text(localization.ViewServiceClass);
        $("#btnSaveServiceClass").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("#cboDiscountRule").next().attr('disabled', true);
        $("#btnSaveServiceClass").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btndeactiveServiceClass").hide();
    }

    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            fnAlert("w", "EPM_07_00", "UIC04", errorMsg.deleteauth_E4);
            return;
        }
        $('#PopupServiceClass').modal('show');
        $('#PopupServiceClass').find('.modal-title').text(localization.ActiveOrDeactive);
        if (rowData.ActiveStatus == 'true') {
            $("#btndeactiveServiceClass").html(localization.Deactivate);
        }
        else {
            $("#btndeactiveServiceClass").html(localization.Activate);
        }
        $("#btnSaveServiceClass").hide();
        $("#btndeactiveServiceClass").show();
        $("#chkActiveStatus").prop('disabled', true);
        
        $("input,textarea").attr('readonly', true);
        $("#cboDiscountRule").next().attr('disabled', true);
    }
}

function fnEditServices(actiontype) {
    var rowid = $("#jqgServices").jqGrid('getGridParam', 'selrow');
    var rowData = $("#jqgServices").jqGrid('getRowData', rowid);
    $("#txtServiceClassId").val('');
    $("#txtServices").val(rowData.ServiceDesc);
    $("#txtServiceId").val(rowData.ServiceId);

    $("#cboDiscountRule").val(rowData.DiscountRule).selectpicker('refresh');
    $("#txtDiscountPercentage").val(rowData.DiscountPerc);
    $("#txtServiceChargePercentage").val(rowData.ServiceChargePerc);

    //$("#cboBusinessLocation").val(rowData.BusinessKey).selectpicker('refresh');
    //$("#cboPatientCategory").val(rowData.PatientCategoryId).selectpicker('refresh');
    //$("#cboDiscountFor").val(rowData.DiscountFor).selectpicker('refresh');
    //$("#cboDiscountAt").val(rowData.DiscountAt).selectpicker('refresh');

    $("#divServiceClass").hide();
    $("#divServices").show();

    if (rowData.ActiveStatus === "true") {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    
    fnFillPatientCategoryDiscountdetails(false);
    isinsert = false;
    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EPM_07_00", "UIC02", errorMsg.editauth_E2);
            return;
        }

        $('#PopupServiceClass').modal('show');
        $('#PopupServiceClass').find('.modal-title').text(localization.UpdateServiceClass);
        $("#btnSaveServiceClass").html('<i class="fa fa-sync mr-1"></i>' + localization.Update);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btndeactiveServiceClass").hide();
        $("input,textarea").attr('readonly', false);
        $("#cboDiscountRule").next().attr('disabled', false);
        $("#btnSaveServiceClass").show();
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "EPM_07_00", "UIC03", errorMsg.vieweauth_E3);
            return;
        }
        $('#PopupServiceClass').modal('show');
        $('#PopupServiceClass').find('.modal-title').text(localization.ViewServiceClass);
        $("#btnSaveServiceClass").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("#cboDiscountRule").next().attr('disabled', true);
        $("#btnSaveServiceClass").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btndeactiveServiceClass").hide();
    }

    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            fnAlert("w", "EPM_07_00", "UIC04", errorMsg.deleteauth_E4);
            return;
        }
        $('#PopupServiceClass').modal('show');
        $('#PopupServiceClass').find('.modal-title').text(localization.ActiveOrDeactive);
        if (rowData.ActiveStatus == 'true') {
            $("#btndeactiveServiceClass").html(localization.Deactivate);
        }
        else {
            $("#btndeactiveServiceClass").html(localization.Activate);
        }
        $("#btnSaveServiceClass").hide();
        $("#btndeactiveServiceClass").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#cboDiscountRule").next().attr('disabled', true);
        $("input,textarea").attr('readonly', true);
       
    }
}
function fnGridRefreshServiceClass(gridtoload) {
    if (gridtoload == "650001") {
        $("#jqgServiceClass").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
    }
    else {
        $("#jqgServices").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
    }
}

function fnFillPatientCategoryDiscountdetails(isclass) {
   
    var obj = {
        BusinessKey: $("#cboBusinessLocation").val(),
        PatientCategoryId: $("#cboPatientCategory").val(),
        DiscountFor: $("#cboDiscountFor").val(),
        DiscountAt: $("#cboDiscountAt").val(),
        ServiceId: $("#txtServiceId").val(),
        ServiceClassId: $("#txtServiceClassId").val(), 
        serviceclass: isclass
    };
        $.ajax({
            async: false,
            url: getBaseURL() + "/Discount/GetPatientPatientCategoryDiscountInfo",
            type: 'POST',
            datatype: 'json',
            data: { obj: obj },
            async: false,
            success: function (result) {
               
                eSyaParams.ClearValue();
                if (result != null) {
                    eSyaParams.SetJSONValue(result.l_discountparams);
                }
                
            }
        });
    
}

function fnSaveServiceClass() {

    var gridtoload = $("#cboDiscountAt").val();

    if ($("#cboBusinessLocation").val() === "0" || $("#cboBusinessLocation").val() === "") {
        fnAlert("w", "EPM_07_00", "UI0064", errorMsg.BusinessLocation_E1);
        return ;
    }
    if ($("#cboPatientCategory").val() === "0" || $("#cboPatientCategory").val() === "") {
        fnAlert("w", "EPM_07_00", "UI0355", errorMsg.PatientCategory_E2);
        return ;
    }
    if ($("#cboDiscountFor").val() === "0" || $("#cboDiscountFor").val() === "") {
        fnAlert("w", "EPM_07_00", "UI0356", errorMsg.DiscountFor_E3);
        return ;
    }
    if ($("#cboDiscountAt").val() === "0" || $("#cboDiscountAt").val() === "") {
        fnAlert("w", "EPM_07_00", "UI0357", errorMsg.DiscountAt_E4);
        return ;
    }
    if ($("#cboDiscountRule").val() === "0" || $("#cboDiscountRule").val() === "") {
        fnAlert("w", "EPM_07_00", "UI0357", "Select Discount Rule");
        return;
    }
    if ($("#txtDiscountPercentage").val() == "" || $("#txtDiscountPercentage").val() == null || $("#txtDiscountPercentage").val() == undefined) {
        fnAlert("w", "EPM_07_00", "UI0357", "Please Enter Discount Percentage");
        return;
    }
    if ($("#txtServiceChargePercentage").val() === null || $("#txtServiceChargePercentage").val() === "") {
        fnAlert("w", "EPM_07_00", "UI0357", "Please Enter Service Charge Percentage");
        return;
    }
    $("#btnSaveServiceClass").attr('disabled', true);
    var obj = {
        BusinessKey: $("#cboBusinessLocation").val(),
        PatientCategoryId: $("#cboPatientCategory").val(),
        DiscountFor: $("#cboDiscountFor").val(),
        DiscountAt: $("#cboDiscountAt").val(),
        ServiceId: $("#txtServiceId").val(),
        ServiceClassId: $("#txtServiceClassId").val(),
        ServiceChargePerc: $("#txtServiceChargePercentage").val(),
        DiscountRule: $("#cboDiscountRule").val(),
        DiscountPerc: $("#txtDiscountPercentage").val(), 
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
    };

    var fmParams = eSyaParams.GetJSONValue();
    obj.l_discountparams = fmParams;

    $.ajax({
        url: getBaseURL() + '/Discount/InsertOrUpdatePatientCategoryDiscount',
        type: 'POST',
        datatype: 'json',
        data: { isinsert: isinsert, obj: obj },
        async: false,
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#PopupServiceClass").modal("hide");
                fnGridRefreshServiceClass(gridtoload);
                $("#btnSaveServiceClass").attr("disabled", false);
                return true;
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveServiceClass").attr('disabled', false);
                return false;
            }
        },
        error: function (error) {
            $("#btnSaveServiceClass").attr('disabled', false);
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });
}

function fnDeleteServiceClass() {

    var gridtoload = $("#cboDiscountAt").val();

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    
    $("#btndeactiveServiceClass").attr('disabled', true);
    var obj = {
        BusinessKey: $("#cboBusinessLocation").val(),
        PatientCategoryId: $("#cboPatientCategory").val(),
        DiscountFor: $("#cboDiscountFor").val(),
        DiscountAt: $("#cboDiscountAt").val(),
        ServiceId: $("#txtServiceId").val(),
        ServiceClassId: $("#txtServiceClassId").val(),
        ServiceChargePerc: $("#txtServiceChargePercentage").val(),
        DiscountRule: $("#cboDiscountRule").val(),
        DiscountPerc: $("#txtDiscountPercentage").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
    };

    $.ajax({
        url: getBaseURL() + '/Discount/ActiveOrDeActivePatientCategoryDiscount',
        type: 'POST',
        datatype: 'json',
        data: { status: a_status, obj: obj },
        async: false,
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#PopupServiceClass").modal("hide");
                fnGridRefreshServiceClass(gridtoload);
                $("#btndeactiveServiceClass").attr("disabled", false);
                return true;
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btndeactiveServiceClass").attr('disabled', false);
                return false;
            }
        },
        error: function (error) {
            $("#btndeactiveServiceClass").attr('disabled', false);
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });
}
  