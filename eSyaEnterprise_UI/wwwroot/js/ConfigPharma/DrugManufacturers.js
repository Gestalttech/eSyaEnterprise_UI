﻿var mnfcnamePrefix = "";

$(document).ready(function () {
    $(".dot").click(function () {
        $('.dot').removeClass('active');
        mnfcnamePrefix = $(this).text();
        fnGridLoadManufacturers(mnfcnamePrefix);
        $(this).addClass('active');
    });
    fnGridLoadManufacturers(mnfcnamePrefix);

    $.contextMenu({
        selector: "#btnManufacturers",
        trigger: 'left',
       items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditManufacturers(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditManufacturers(event, 'view') } },
            jqgDelete: { name: localization.View, icon: "delete", callback: function (key, opt) { fnEditManufacturers(event, 'delete') } },
        }
     });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});


function fnGridLoadManufacturers(mnfcnamePrefix) {
    $("#jqgManufacturers").jqGrid('GridUnload');
    $("#jqgManufacturers").jqGrid({
        url: getBaseURL() + '/Manufacturer/GetManufacturerListByNamePrefix?manufacturerNamePrefix=' + mnfcnamePrefix,
        datatype: 'json',
        mtype: 'POST',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.ManufacturerID, localization.ManufacturerName, localization.ManfShortName,localization.Active, localization.Actions],
        colModel: [
            { name: "ManufacturerId", width: 10, editable: true, align: 'left', hidden: true },
            { name: "ManufacturerName", width: 135, editable: true, align: 'left', hidden: false },
            { name: "ManfShortName", width: 10, editable: true, align: 'left', hidden: true },
            { name: "ActiveStatus", editable: false, width: 30, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnManufacturers"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpManufacturers",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: 55,
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
        caption: localization.DrugManufacturers,
        loadComplete: function (data) {
            SetGridControlByAction();
        },
        onSelectRow: function (rowid, status, e) {
           },
    }).
        jqGrid('navGrid', '#jqpManufacturers', { add: false, edit: false, search: false, searchtext: 'Search', del: false, refresh: false }, {}, {}, {}, {
            closeOnEscape: true,
            caption: "Search...",
            multipleSearch: true,
            Find: "Find",
            Reset: "Reset",
            odata: [{ oper: 'eq', text: 'Match' }, { oper: 'cn', text: 'Contains' }, { oper: 'bw', text: 'Begins With' }, { oper: 'ew', text: 'Ends With' }],
        }).jqGrid('navButtonAdd', '#jqpManufacturers', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnGridAddManufacturers
        }).
        jqGrid('navButtonAdd', '#jqpManufacturers', {
            caption: '<span class="fa fa-sync" data-toggle="modal"></span> Refresh', buttonicon: 'none', id: 'btnGridRefresh', position: 'last', onClickButton: fnGridRefreshManufacturers
        });

    fnAddGridSerialNoHeading();
}

function SetGridControlByAction() {
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }

}

function fnGridAddManufacturers() {
    $("#divGridDrugManufacturers").hide();
    $("#divManufacturersForm").css('display', 'block');
    $("#btndeActiveManufacturer").hide();
    fnEnableControl(false);
    fnClearManufacturer();
}

function fnEditManufacturers(e, actiontype) {
    fnClearManufacturer();
    var rowid = $("#jqgManufacturers").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgManufacturers').jqGrid('getRowData', rowid);
    $('#txtManufacturerId').val(rowData.ManufacturerId);
    $("#txtMnfcShortName").val(rowData.ManfShortName);
    $("#txtManufacturer").val(rowData.ManufacturerName);
    if (rowData.ActiveStatus === "true") {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else { $("#chkActiveStatus").parent().removeClass("is-checked"); }

    $("#btnSaveDrugManufacturer").attr('disabled', false);
    
    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EPH_01_00", "UIC02", errorMsg.editauth_E2);
            return;
        }
        $("#divGridDrugManufacturers").hide();
        $("#divManufacturersForm").css('display', 'block');

        $("#btnSaveDrugManufacturer").html("<i class='fa fa-sync'></i> " + localization.Update);
        $("#btndeActiveManufacturer").hide();
        fnEnableControl(false);
        $("#chkActiveStatus").attr('disabled', true);
    }
    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "EPH_01_00", "UIC03", errorMsg.vieweauth_E3);
            return;
        }
        $("#divGridDrugManufacturers").hide();
        $("#divManufacturersForm").css('display', 'block');

        $("#btnSaveDrugManufacturer").hide();
        $("#btndeActiveManufacturer").hide();
        fnEnableControl(true);
        
    }


    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            fnAlert("w", "EPH_01_00", "UIC04", errorMsg.UnAuthorised_delete_E3);
            return;
        }
        $("#divGridDrugManufacturers").hide();
        $("#divManufacturersForm").css('display', 'block');
        $("#btnSaveDrugManufacturer").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveDrugManufacturer").hide();

        if (rowData.ActiveStatus == 'true') {
            $("#btndeActiveManufacturer").html("<i class='fa fa-trash'></i> "+localization.Deactivate);
        }
        else {
            $("#btndeActiveManufacturer").html("<i class='fa fa-check'></i> " +localization.Activate);
        }

        $("#btndeActiveManufacturer").show();
        $("#chkActiveStatus").prop('disabled', true);
        
    }
}

function fnEnableControl(val) {
    $("input,textarea").attr('readonly', val);
    $("#chkActiveStatus").attr('disabled', val);
    $("select").next().attr('disabled', val);
}
function fnSaveDrugManufacturer() {
    if (validateManufacturer() === false) {
        return;
    }

    $("#btnSaveDrugManufacturer").attr('disabled', true);
   
    var obj;
    if (IsStringNullorEmpty($("#txtManufacturerId").val())) {
        obj = {
            ManufacturerName: $("#txtManufacturer").val(),
            ManufacturerId: 0,
            ManfShortName: $("#txtMnfcShortName").val(),
            ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
        };
    }
    else {
        obj = {
            ManufacturerName: $("#txtManufacturer").val(),
            ManufacturerId: $("#txtManufacturerId").val(),
            ManfShortName: $("#txtMnfcShortName").val(),
            ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
        };
    }

    $.ajax({
        url: getBaseURL() + '/Manufacturer/InsertOrUpdateManufacturer',
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                fnGridRefreshManufacturers();
                $("#btnSaveDrugManufacturer").attr('disabled', false);
                fnBackToGrid();
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveDrugManufacturer").attr('disabled', false);
            }

        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveDrugManufacturer").attr("disabled", false);
        }
    });
}

function validateManufacturer() {
    if (IsStringNullorEmpty($("#txtMnfcShortName").val())) {
        fnAlert("w", "EHP_01_00", "UI0272", errorMsg.ManufacturerShortName_E8);
        return false;
    }
    if (IsStringNullorEmpty($("#txtManufacturer").val())) {
        fnAlert("w", "EHP_01_00", "UI0271", errorMsg.Manufacturer_E7);
        return false;
    }
    
  
}

function fnClearManufacturer() {
    $('#txtManufacturerId').val('');
    $('#txtMnfcShortName').val('');
    $('#txtManufacturer').val('');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#btnSaveDrugManufacturer").html("<i class='fa fa-save'></i> " + localization.Save);
    $("#btnSaveDrugManufacturer").show();
    $("input,textarea").attr('readonly', false);
    $("select").next().attr('disabled', false);
}

function fnGridRefreshManufacturers() {
    $("#jqgManufacturers").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}

function fnBackToGrid() {
    $("#divGridDrugManufacturers").show();
    $("#divManufacturersForm").css('display', 'none');
}

function fnDeleteManufacturer() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btndeActiveManufacturer").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Manufacturer/ActiveOrDeActiveManufacturer?status=' + a_status + '&manufId=' + $("#txtManufacturerId").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                fnGridRefreshManufacturers();
                $("#btndeActiveManufacturer").attr("disabled", false);
                fnBackToGrid();

            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btndeActiveManufacturer").attr("disabled", false);
                $("#btndeActiveManufacturer").html('De Activate');
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btndeActiveManufacturer").attr("disabled", false);
            $("#btndeActiveManufacturer").html('De activate');
        }
    });
}