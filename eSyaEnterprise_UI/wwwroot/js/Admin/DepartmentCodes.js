
$(document).ready(function () {
    fnGridLoadDepartmentCodes();
    $.contextMenu({
      
        selector: "#btnDepartmentCodes",
        trigger: 'left',
       
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditDepartmentCodes(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditDepartmentCodes(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditDepartmentCodes(event, 'delete') } },
        }
        
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");

});
var actiontype = "";
function fnGridLoadDepartmentCodes() {

    var departmentCategory = $("#cboDepartmentCategory").val();
    $("#jqgDepartmentCodes").jqGrid('GridUnload');
    $("#jqgDepartmentCodes").jqGrid({
        url: getBaseURL() + '/Admin/Department/GetApplicationCodesByCodeType?codeType=' + departmentCategory,
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.DepartmentCategory, localization.DepartmentID, localization.DepartmentDesc, localization.Active, localization.Actions],
        colModel: [
            { name: "DeptCategory", width: 50, editable: true, align: 'left', hidden: false },
            { name: "DeptId", width: 50, editable: true, align: 'left', hidden: true },
            { name: "DeptDesc", width: 120, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 50 } },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline btn-sm" style="" id="btnDepartmentCodes"><i class="fa fa-ellipsis-v"></i> </button>'
                }
            },
        ],
        pager: "#jpgDepartmentCodes",
        rowNum: 10000,
        rownumWidth: '55',
        pgtext: null,
        pgbuttons: null,
        loadonce: true,
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
        caption: localization.DepartmentCode,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgDepartmentCodes");

        },

        onSelectRow: function (rowid, status, e) {
        },

    }).jqGrid('navGrid', '#jpgDepartmentCodes', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jpgDepartmentCodes', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshDepartmentCodes
    }).jqGrid('navButtonAdd', '#jpgDepartmentCodes', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddDepartmentCodes
    });
    fnAddGridSerialNoHeading();
}

function fnAddDepartmentCodes() {
    fnClearFields();
    var id = $("#cboDepartmentCategory").val();
    if (id === 0 || id === "0" || IsStringNullorEmpty($("#cboDepartmentCategory").val())) {
        fnAlert("w", "EAD_07_00", "UI0178", errorMsg.selectCodeType_E6);
    }
    else {
        $('#PopupDepartmentCodes').modal('show');
        $('#PopupDepartmentCodes').modal({ backdrop: 'static', keyboard: false });
        $('#PopupDepartmentCodes').find('.modal-title').text(localization.AddDepartmentCode);
        $("#chkActiveStatus").parent().addClass("is-checked");
        fnClearFields();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveDepartmentCode").html('<i class="fa fa-save"></i>  ' + localization.Save);
        $("#btnSaveDepartmentCode").show();
        $("#btnDeactivateDepartmentCode").hide();
    }
}

function fnEditDepartmentCodes(e, actiontype) {

    var rowid = $("#jqgDepartmentCodes").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDepartmentCodes').jqGrid('getRowData', rowid);
    var _selectedRow = $("#" + rowid).offset();
    var firstRow = $("tr.ui-widget-content:first").offset();
    $(".ui-jqgrid-bdiv").animate({ scrollTop: _selectedRow.top - firstRow.top }, 700);

    $('#txtDepartmentCode').val(rowData.DepartmentCode);
    $('#cboDepartmentCategory').val(rowData.CodeType).selectpicker('refresh');
    $("#txtDepartmentCodeDescription").val(rowData.CodeDesc);
    $("#txtShortCode").val(rowData.ShortCode);
    if (rowData.DefaultStatus === "true") {
        $("#chkDepartmentDefaultStatus").parent().addClass("is-checked");
    }
    else { $("#chkDepartmentDefaultStatus").parent().removeClass("is-checked"); }
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");

    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");

    }
    $("#btnSaveDepartmentCode").attr('disabled', false);
    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EAD_07_00", "UIC02", errorMsg.editauth_E2);
            return;
        }
        $('#PopupDepartmentCodes').modal('show').css({ top: firstRow.top + 31 });

        $('#PopupDepartmentCodes').find('.modal-title').text(localization.UpdateDepartmentCode);
        //$("#chkActiveStatus").prop('disabled', false);
        $("#chkActiveStatus").prop('disabled', true);
        $("#chkDepartmentDefaultStatus").prop('disabled', false);
        $("#btnSaveDepartmentCode").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("#btnDeactivateDepartmentCode").hide();
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);
        $("#btnSaveDepartmentCode").show();
    }
    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "EAD_07_00", "UIC03", errorMsg.vieweauth_E3);
            return;
        }
        $('#PopupDepartmentCodes').modal('show');
        $('#PopupDepartmentCodes').find('.modal-title').text(localization.ViewDepartmentCode);
        $("#chkActiveStatus").prop('disabled', true);
        $("#chkDepartmentDefaultStatus").prop('disabled', true);
        $("#btnSaveDepartmentCode,#btnDeactivateDepartmentCode").hide();
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            fnAlert("w", "EAD_07_00", "UIC04", errorMsg.deleteauth_E4);
            return;
        }
        $('#PopupDepartmentCodes').modal('show');
        $('#PopupDepartmentCodes').find('.modal-title').text("Active/De Active Department Codes");
        if (rowData.ActiveStatus == 'true') {
            $("#btnDeactivateDepartmentCode").html(localization.Deactivate);
        }
        else {
            $("#btnDeactivateDepartmentCode").html('Activate');
            $("#btnDeactivateDepartmentCode").html(localization.Activate);
        }
        $("#btnSaveDepartmentCode").hide();
        $("#btnDeactivateDepartmentCode").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#chkDepartmentDefaultStatus").prop('disabled', true);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
    }

}



function fnSaveDepartmentCode() {
    if (IsStringNullorEmpty($("#txtDepartmentCodeDescription").val())) {

        fnAlert("w", "EAD_07_00", "UI0179", errorMsg.DepartmentCodeDesc_E7);
        return;
    }
    if ($("#cboDepartmentCategory").val() === 0 || $("#cboDepartmentCategory").val() === "0") {
        fnAlert("w", "EAD_07_00", "UI0178", errorMsg.selectCodeType_E6);
        return;
    }

    $("#btnSaveDepartmentCode").attr('disabled', true);
    app_codes = {
        DepartmentCode: $("#txtDepartmentCode").val() === '' ? 0 : $("#txtDepartmentCode").val(),
        CodeType: $("#cboDepartmentCategory").val(),
        CodeDesc: $("#txtDepartmentCodeDescription").val(),
        ShortCode: $("#txtShortCode").val(),
        DefaultStatus: $('#chkDepartmentDefaultStatus').parent().hasClass("is-checked"),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    }
    $("#btnSaveDepartmentCode").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/Admin/Department/InsertOrAudateApplicationCodes',
        type: 'POST',
        datatype: 'json',
        data: { app_codes },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveDepartmentCode").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#btnSaveDepartmentCode").attr('disabled', false);
                fnGridRefreshDepartmentCodes();
                $('#PopupDepartmentCodes').modal('hide');
            }
            else {
                fnAlert("w", "", response.StatusCode, response.Message);
                $("#btnSaveDepartmentCode").attr('disabled', false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveDepartmentCode").attr("disabled", false);
        }
    });
}

function fnGridRefreshDepartmentCodes() {
    $("#jqgDepartmentCodes").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

$("#btnCancelDepartmentCode").click(function () {
    fnClearFields();
    $("#jqgDepartmentCodes").jqGrid('resetSelection');
    $('#PopupDepartmentCodes').modal('hide');
});

function fnClearFields() {
    $("#txtDepartmentCodeDescription").val("");
    $('#chkDepartmentDefaultStatus').prop('checked', true);
    $('#chkDepartmentDefaultStatus').parent().removeClass('is-checked');
    $('#chkDepartmentDefaultStatus').prop('checked', false);
    $("#chkActiveStatus").prop('disabled', false);
    $("#chkDepartmentDefaultStatus").prop('disabled', false);
    $("#txtShortCode").val("");
    $("#txtDepartmentCode").val("");
    $("#btnSaveDepartmentCode").attr('disabled', false);
    $("input,textarea").attr('readonly', false);
    $("select").next().attr('disabled', false);
}

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}


function fnDeleteDepartmentCodes() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btnDeactivateDepartmentCode").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Admin/DepartmentCodes/ActiveOrDeActiveDepartmentCode?status=' + a_status + '&app_code=' + $("#txtDepartmentCode").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnDeactivateDepartmentCode").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $('#PopupDepartmentCodes').modal('hide');
                fnClearFields();
                fnGridRefreshDepartmentCodes();
                $("#btnDeactivateDepartmentCode").attr("disabled", false);
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnDeactivateDepartmentCode").attr("disabled", false);
                $("#btnDeactivateDepartmentCode").html('De Activate');
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnDeactivateDepartmentCode").attr("disabled", false);
            $("#btnDeactivateDepartmentCode").html('De Activate');
        }
    });
}


function fnExportToExcel() {
    //JSONToCSVConvertor(JSON.stringify($('#jqgDepartmentCodes').jqGrid('getRowData')), 'Department Codes', true);
    JSONToCSVConvertor(JSON.stringify($('#jqgDepartmentCodes').getGridParam('data')), 'Department Codes', true);

}

function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {

    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;


    var CSV = '';
    //Set Report title in first row or line

    CSV += ReportTitle + '\r\n\n';

    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";
        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            //specific Columns headings are Removed
            if (index !== "CodeType" && index !== "edit" && index !== "_id_") {
                //Now convert each value to string and comma-seprated
                if (index == "DepartmentCode") {
                    index = "Department Code";
                }
                if (index == "CodeDesc") {
                    index = "Description";
                }
                if (index == "ShortCode") {
                    index = "Short Code";
                }
                if (index == "DefaultStatus") {
                    index = "Default Status";
                }
                if (index == "ActiveStatus") {
                    index = "Active Status";
                }


                row += index + ',';
            }
        }

        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + '\r\n';
    }

    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            //specific Columns data are Removed
            if (index !== "CodeType" && index !== "edit" && index !== "_id_") {

                row += '"' + arrData[i][index] + '",';
            }
        }

        row.slice(0, row.length - 1);

        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {

        fnAlert("w", "EAD_07_00", "UI093", errorMsg.InValidData_E8);
        return;
    }

    //Generate a file name
    var fileName = ReportTitle;
    //var fileName = "ApplicationCodes";

    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g, "_");

    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";

    //this part will append the anchor tag and remove it after automatic click
    console.log(document.body);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}