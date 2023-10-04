var _isInsert = true;
var actiontype = "";
$(document).ready(function () {
    fnLoadLocalizationTableMappingGrid();

    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnLocalizationTable",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditLocalizationTable(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditLocalizationTable(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditLocalizationTable(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i> " + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i> " + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i> " + localization.Delete + " </span>")
});

function fnLoadLocalizationTableMappingGrid() {

    $("#jqgLocalizationTable").GridUnload();

    $("#jqgLocalizationTable").jqGrid({
        url: getBaseURL() + '/Master/GetLocalizationTableMaster',
        mtype: 'Post',
        datatype: 'json',
        caption: 'Localization Table',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.TableCode, localization.SchemaName, localization.TableDescription, localization.Active, localization.Actions],
        colModel: [
            { name: "TableCode", width: 30, editable: true, align: 'left', hidden: false },
            { name: "SchemaName", editable: true, width: 95, align: 'left', resizable: false },
            { name: "TableName", editable: true, width: 95, align: 'left', resizable: false },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnLocalizationTable"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        rowNum: 10,
        rownumWidth: 55,
        loadonce: true,
        pager: "#jqpLocalizationTable",
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
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqgLocalizationTable");
        },

        onSelectRow: function (rowid, status, e) {
            },

    }).jqGrid('navGrid', '#jqpLocalizationTable', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpLocalizationTable', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefresh
    }).jqGrid('navButtonAdd', '#jqpLocalizationTable', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddLocalizationTable
    });
    fnAddGridSerialNoHeading();
}

function fnAddLocalizationTable() {
    fnClearFields();

    _isInsert = true;
    $(".modal-title").text(localization.AddLocalizationTableMapping);
    $("#txtTableCode").attr('disabled', false);
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#chkActiveStatus").attr('disabled', true);
    $("#PopupLocalizationTable").modal('show');
    $("#btnSave").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#btnSave").show();
    $("#btnDeactivateLocalizationTableMapping").hide();
    var columnNames = $("#jqgLocalizationTable").jqGrid('getGridParam', 'colNames');
    var c = $("#jqgLocalizationTable").getGridParam("reccount");
    console.log("Count:" + $("#jqgLocalizationTable").getGridParam("reccount"));
    console.log(columnNames);
    var allRowsInGrid = $('#jqgLocalizationTable').jqGrid('getGridParam', 'data');
    console.log(allRowsInGrid);
    console.log($('#jqgLocalizationTable').jqGrid('getGridParam'));
    var a = [];
    var trow = '';
    var res = $('#jqgLocalizationTable').jqGrid('getGridParam');
    for (var i = 0; i < c; i++) {
        console.log(columnNames.length);
        if (columnNames[0] == "") {
            columnNames[0] = "S.no";
        }
        a.push(columnNames[i]);


    }
    for (var i = 0; i < c; i++) {
        trow += "<table class='table table-bordered'><tr>";
        for (var j = 0; j < c; j++) {
            trow += "<td>" + a[j] + "</td><td>" + JSON.stringify(allRowsInGrid[j]) + "</td ></tr> ";
        }
        trow += "</table>";
    }
    console.log(a);
    $("#mobGrid").append(trow);
}

function fnEditLocalizationTable(e, actiontype) {

    fnClearFields();
    var rowid = $("#jqgLocalizationTable").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgLocalizationTable').jqGrid('getRowData', rowid);
    _isInsert = false;

    $("#txtTableCode").val(rowData.TableCode).attr('disabled', true);
    $("#txtSchemaName").val(rowData.SchemaName);
    $("#txtTableDesc").val(rowData.TableName);
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
        $("#btnDeactivateLocalizationTableMapping").html(localization.DeActivate);
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
        $("#btnDeactivateLocalizationTableMapping").html(localization.Activate);
    }

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "", "UIC02", errorMsg.editauth_E2);
            return;
        }
        $("#PopupLocalizationTable").modal('show');
        $("#chkActiveStatus").prop('disabled', true);
        $(".modal-title").text(localization.EditLocalizationTableMapping);
        $("#btnSave").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("#btnSave").attr('disabled', false);
        $("#btnSave").show();
        $("#btnDeactivateLocalizationTableMapping").hide();
    }
    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "", "UIC03", errorMsg.vieweauth_E3);
            return;
        }
        $("#PopupLocalizationTable").modal('show');
        $("#btnSave,#btnDeactivateLocalizationTableMapping").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("input[id*=chk]").attr('disabled', true);
        $(".modal-title").text(localization.ViewLocalizationTableMapping);
        $("#PopupLocalizationTable").on('hidden.bs.modal', function () {
            $("#btnSave").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
            $("input[id*=chk]").attr('disabled', false);
        })
    }

    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            fnAlert("w", "", "UIC04", errorMsg.deleteauth_E4);
            return;
        }
        $("#PopupLocalizationTable").modal('show');
        $("#btnSave").hide();
        $("#btnDeactivateLocalizationTableMapping").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("input[id*=chk]").attr('disabled', true);
        $(".modal-title").text("Active / De Active Localization Table Mapping");
        $("#PopupLocalizationTable").on('hidden.bs.modal', function () {
            $("#btnSave").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
            $("input[id*=chk]").attr('disabled', false);
        })
    }
}

function fnSaveLocalizationTableMapping() {

    if (!IsValidate()) {
        return;
    }

    var obj = {
        IsInsert: _isInsert,
        TableCode: $('#txtTableCode').val(),
        SchemaName: $("#txtSchemaName").val(),
        TableName: $("#txtTableDesc").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSave").attr('disabled', true);

    $.ajax({
        url: getBaseURL() + '/Master/InsertOrUpdateLocalizationTableMaster',
        type: 'POST',
        datatype: 'json',
        data: obj,
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSave").html('<i class="fa fa-spinner fa-spin"></i> wait');
                fnClosePopUp();
                fnClearFields();
                $("#jqgLocalizationTable").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');

                return true;
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSave").attr('disabled', false);
                return false;
            }
        },
        error: function (request, status, error) {
            $("#btnSave").attr('disabled', false);
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    }).always(function () {
        $("#btnSave").attr('disabled', false);
    });
}

function IsValidate() {

    if (IsStringNullorEmpty($("#txtTableCode").val())) {
        fnAlert("w","ELE_01_00", "UI0077",errorMsg.TableCode_E6);
        return false;
    }
    if (IsStringNullorEmpty($("#txtSchemaName").val())) {
        fnAlert("w", "ELE_01_00", "UI0078", errorMsg.SchemaName_E7);
        return false;
    }
    if (IsStringNullorEmpty($("#txtTableDesc").val())) {
        fnAlert("w", "ELE_01_00", "UI0079",errorMsg.TableDesc_E8);
        return false;
    }
    if (isNaN($("#txtTableCode").val())) {
        fnAlert("w", "ELE_01_00", "UI0080", errorMsg.TableCodeNumeric_E9);
        return false;
    }

    return true;
}

function fnClosePopUp() {
    fnClearFields();
    $("#PopupLocalizationTable").modal('hide');
}

function fnRefresh() {
    $("#jqgLocalizationTable").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {

    $("#txtTableCode").val('');
    $("#txtSchemaName").val('');
    $("#txtTableDesc").val('');
    $("#chkActiveStatus").prop('disabled', false);
    $("#btnSave").attr('disabled', false);
}

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}

function fnDeleteLocalizationTableMapping() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btnDeactivateLocalizationTableMapping").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Master/ActiveOrDeActiveLocalizationTableMaster?status=' + a_status + '&Tablecode=' + $("#txtTableCode").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnDeactivateLocalizationTableMapping").html('<i class="fa fa-spinner fa-spin"></i> wait');
                fnClosePopUp();
                fnClearFields();
                fnRefresh();
                $("#btnDeactivateLocalizationTableMapping").attr("disabled", false);
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnDeactivateLocalizationTableMapping").attr("disabled", false);
                $("#btnDeactivateLocalizationTableMapping").html(localization.DeActivate);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnDeactivateLocalizationTableMapping").attr("disabled", false);
            $("#btnDeactivateLocalizationTableMapping").html(localization.DeActivate);
        }
    });
}
