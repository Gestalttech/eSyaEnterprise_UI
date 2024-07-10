$(function () {
   $.contextMenu({
        selector: "#btnServiceClass",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditServiceClass('edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditServiceClass('view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditServiceClass('delete') } },
        }
     });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");


    $.contextMenu({
        selector: "#btnServices",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditServices('edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditServices('view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditServices('delete') } },
        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});


function fnChangeDiscountat() {
    var _discountAt = $("#cboDiscountAt").val();
    if (_discountAt == "c") {
        $("#secServiceClass").show().slideDown();
        $("#secServices").hide();
        fnGridLoadServiceClass();
    }
    if (_discountAt == "s") {
        $("#secServiceClass").hide();
        $("#secServices").show();
        fnGridLoadServices();
    }
    if (_discountAt == "0" || _discountAt == null || _discountAt == undefined) {
        $("#secServices").hide();
        $("#secServiceClass").hide();
    }
   
}
function fnGridLoadServiceClass() {
    $("#jqgServiceClass").jqGrid('GridUnload');
    $("#jqgServiceClass").jqGrid({
        //url: getBaseURL() + '/Discount/GetServiceClassByCodeType?codeType=' + codeType,
        url:'',
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.BusinessKey, localization.PatientCategoryID, localization.ServiceClass, localization.DiscountRule, localization.DiscountPercentage, localization.ServicePercentage, localization.Active, localization.Actions],
        colModel: [
            { name: "BusinessKey", width: 50, editable: true, align: 'left', hidden: true },
            { name: "PatientCategoryID", width: 50, editable: true, align: 'left', hidden: true },
            { name: "ServiceDesc", width: 70, editable: false, hidden: false, align: 'left', resizable: true, cellattr: function () { return ' title="Here is my tooltip!"'; } },
            { name: "DiscountRule", width: 120, editable: true, align: 'left', resizable: false},
            { name: "DiscountPercentage", width: 50, editable: true, align: 'left', resizable: false},
            { name: "ServicePercentage", editable: true, width: 70, align: 'left', resizable: false},
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
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgServiceClass");
            $('.ui-jqgrid-view,.ui-jqgrid,.ui-jqgrid-hdiv,.ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-bdiv,.ui-jqgrid-pager').css('width', 100 + '%');
        },
         onSelectRow: function (rowid, status, e) { },
    }).jqGrid('navGrid', '#jqpServiceClass', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpServiceClass', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshServiceClass
    }).jqGrid('navButtonAdd', '#jqpServiceClass', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddServiceClass
    });
    fnAddGridSerialNoHeading();
}
function fnAddServiceClass() {
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
    $('#PopupServiceClass').modal('show');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $('#PopupServiceClass').find('.modal-title').text(localization.AddServiceClass);
    $("#btnSaveServiceClass").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveServiceClass").show();
    $("#btndeActiveServiceClass").hide();
}

function fnEditServiceClass(actiontype) {
    var rowid = $("#jqgServiceClass").jqGrid('getGridParam', 'selrow');
    var rowData = $("#jqgServiceClass").jqGrid('getRowData', rowid);
    $("#txtServiceClass").val(rowData.ServiceClass);

    $("#cboServiceClass").val(rowData.DiscountRule).selecpicker('refresh');
    $("#txtDiscountPercentage").val(rowData.DiscountPercentage);
    $("#txtServiceChargePercentage").val(rowData.ServicePercentage);
    if (rowData.ActiveStatus === "true") {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EPM_07_00", "UIC02", errorMsg.editauth_E2);
            return;
        }
        $('#PopupServiceClass').find('.modal-title').text(localization.UpdateServiceClass);
        $("#btnSaveServiceClass").html('<i class="fa fa-sync mr-1"></i>' + localization.Update);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btndeactiveServiceClass").hide();
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);
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
        $("select").next().attr('disabled', true);
        $("#btnSaveServiceClass").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btndeactiveServiceClass").hide();
    }
}
function fnGridRefreshServiceClass() {
    $("#jqgServiceClass").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

$('#PopupServiceClass').on('hidden.bs.modal', function () {
    fnClearFields_SClass();
});
function SetGridControlByAction() {
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}
function fnClearFields_SClass() {
    $("#cboBusinessLocation").val(0).selectpicker('refresh');
    $("#cboPatientCategory").val(0).selectpicker('refresh');
    $("#cboDiscountFor").val(0).selectpicker('refresh');
    $("#cboDiscountAt").val(0).selectpicker('refresh');
    $("#txtServiceClass").val('');
    $("#txtDiscountRule").val('');
    $("#txtDiscountPercentage").val('');
    $("#txtServiceChargePercentage").val('');
}


function fnGridLoadServices() {
    $("#jqgServices").jqGrid('GridUnload');
    $("#jqgServices").jqGrid({
        //url: getBaseURL() + '/Discount/GetServiceClassByCodeType?codeType=' + codeType,
        url:'',
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.BusinessKey, localization.PatientCategoryID, localization.Services, localization.DiscountRule, localization.DiscountPercentage, localization.ServicePercentage, localization.Active, localization.Actions],
        colModel: [
            { name: "BusinessKey", width: 50, editable: true, align: 'left', hidden: true },
            { name: "PatientCategoryID", width: 50, editable: true, align: 'left', hidden: true },
            { name: "ServiceDesc", width: 70, editable: false, hidden: false, align: 'left', resizable: true, cellattr: function () { return ' title="Here is my tooltip!"'; } },
            { name: "DiscountRule", width: 120, editable: true, align: 'left', resizable: false },
            { name: "DiscountPercentage", width: 50, editable: true, align: 'left', resizable: false },
            { name: "ServicePercentage", editable: true, width:70, align: 'left', resizable: false },
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
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgServices");
            $('.ui-jqgrid-view,.ui-jqgrid,.ui-jqgrid-hdiv,.ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-bdiv,.ui-jqgrid-pager').css('width', 100 + '%');
        },
        onSelectRow: function (rowid, status, e) { },
    }).jqGrid('navGrid', '#jqpServices', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpServices', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshServices
    }).jqGrid('navButtonAdd', '#jqpServices', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddServices
    });
    fnAddGridSerialNoHeading();
}
function fnGridRefreshServices() {
    $("#jqgServices").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnAddServices() {
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
    $('#PopupServices').modal('show');
    $("#chkActiveStatus_s").parent().addClass("is-checked");
    $('#PopupServices').find('.modal-title').text(localization.AddServices);
    $("#btnSaveServices").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#chkActiveStatus_s").prop('disabled', true);
    $("#btnSaveServices").show();
    $("#btndeactiveServices").hide();
}

function fnEditServices(actiontype) {
    var rowid = $("#jqgServices").jqGrid('getGridParam', 'selrow');
    var rowData = $("#jqgServices").jqGrid('getRowData', rowid);
}
function fnGridRefreshServices() {
    $("#jqgServices").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}
function SetGridControlByAction() {
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}
$('#PopupServices').on('hidden.bs.modal', function () {
    fnClearFields_s();
});
function fnClearFields_s() {
    $("#cboBusinessLocation_s").val(0).selectpicker('refresh');
    $("#cboPatientCategory_s").val(0).selectpicker('refresh');
    $("#cboDiscountFor_s").val(0).selectpicker('refresh');
    $("#cboDiscountAt_s").val(0).selectpicker('refresh');
    $("#txtServiceClass_s").val('');
    $("#txtDiscountRule_s").val('');
    $("#txtDiscountPercentage_s").val('');
    $("#txtServiceChargePercentage_s").val('');
    }

    function fnSaveServices() {

    }