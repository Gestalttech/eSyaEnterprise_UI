$(function () {
    fnGridLoadTokenCounter();
});
$(document).ready(function () {

    $.contextMenu({
        // define which elements trigger this menu
        selector: ".btn-actions",
        trigger: 'left',
        // define the elements of the menu
        items: {
            edit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditTokenCounter(event, 'edit') } },
            view: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditTokenCounter(event, 'view') } },
            delete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditTokenCounter(event, 'delete') } }
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i> " + localization.Edit + "</span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i> " + localization.View + "</span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i> " + localization.Delete + "</span>");


});
var _isInsert = true;

function fnBusinessLocation_onChange() {

    fnGridLoadTokenCounter();
}
function fnGridLoadTokenCounter() {

    $("#jqgTokenCounter").GridUnload();

    $("#jqgTokenCounter").jqGrid({
        url: getBaseURL() + '/CounterMapping/GetTokenCountersbyBusinessKey?businesskey=' + $("#cboBusinessLocation").val(),
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.BusinessKey, localization.FloorId, localization.Floor, localization.CounterNumber, localization.Active, localization.Actions],
        colModel: [
            { name: "BusinessKey", width: 50, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "FloorId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "FloorName", width: 120, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            { name: "CounterNumber", width: 80, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            //{
            //    name: 'edit', search: false, align: 'left', width: 70, sortable: false, resizable: false,
            //    formatter: function (cellValue, options, rowdata, action) {
            //        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditTokenCounter(event,\'edit\');"><i class="fas fa-pen"></i> ' + localization.Edit + '</button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return fnEditTokenCounter(event,\'view\');"><i class="far fa-eye"></i>' + localization.View + '</button>'
            //            + '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Delete" id="jqgDelete" onclick="return fnEditTokenCounter(event,\'delete\');"><i class="fas fa-trash"></i>' + localization.Delete + '</button>'
            //    }
            //},
            {
                name: 'edit', search: false, align: 'left', width: 70, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    var i = options.rowId;
                    return '<button class="mr-1 btn btn-outline btn-actions" id="btnTokenActions' + i + '"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpTokenCounter",
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
        forceFit: true, caption: 'Token Counter',
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqpTokenCounter");
        },
    }).jqGrid('navGrid', '#jqpTokenCounter', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpTokenCounter', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshTokenCounter
    }).jqGrid('navButtonAdd', '#jqpTokenCounter', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddTokenCounter
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgTokenCounter"),
            newWidth = $grid.closest(".ui-jqgrid").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddTokenCounter() {
    if (IsStringNullorEmpty($("#cboBusinessLocation").val()) || $("#cboBusinessLocation").val() === "0") {
         fnAlert("w", "ETM_02_00", "UI0175", errorMsg.Businesskey_E6);
        return;
    }
    else {
        $('#PopupTokenCounter').modal('show');
        $('#PopupTokenCounter').modal({ backdrop: 'static', keyboard: false });
        $('#PopupTokenCounter').find('.modal-title').text(localization.AddTokenCounter);
        $("#chkActiveStatus").parent().addClass("is-checked");
        fnClearFields();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveTokenCounter").html('<i class="fa fa-save"></i>' + localization.Save);
        $("#btnSaveTokenCounter").show();
        $("#btndeActiveTokenCounter").hide();
        _isInsert = true;

    }
}


function fnEditTokenCounter(e, actiontype) {

    //var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowid = $("#jqgTokenCounter").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgTokenCounter').jqGrid('getRowData', rowid);

    _isInsert = false;

    $('#PopupTokenCounter').modal('show');
    $('#cboFloor').val(rowData.FloorId).selectpicker('refresh');
    $('#txtCounterNumber').val(rowData.CounterNumber);
    $("#txtCounterNumber").attr('readonly', true);

    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveTokenCounter").attr("disabled", false);


    if (actiontype.trim() == "edit") {
        $('#PopupTokenCounter').find('.modal-title').text(localization.EditTokenCounter);
        $("#btnSaveTokenCounter").html('<i class="fa fa-sync"></i>' + localization.Update);
        $("#btndeActiveTokenCounter").hide();
        $("#chkActiveStatus").prop('disabled', false);
        $("#btnSaveTokenCounter").attr("disabled", false);
    }

    if (actiontype.trim() == "view") {
        $('#PopupTokenCounter').find('.modal-title').text(localization.ViewTokenCounter);
        $("#btnSaveTokenCounter").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveTokenCounter").hide();
        $("#btndeActiveTokenCounter").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupTokenCounter").on('hidden.bs.modal', function () {
            $("#btnSaveTokenCounter").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        $('#PopupTokenCounter').find('.modal-title').text("Activate/De Activate Token Counter");
        $("#btnSaveTokenCounter").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveTokenCounter").hide();

        if (rowData.ActiveStatus == 'true') {
            $("#btndeActiveTokenCounter").html(localization.DActivate);
        }
        else {
            $("#btndeActiveTokenCounter").html(localization.Activate);
        }

        $("#btndeActiveTokenCounter").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupTokenCounter").on('hidden.bs.modal', function () {
            $("#btnSaveTokenCounter").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

function fnGridRefreshTokenCounter() {
    $("#jqgTokenCounter").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

$("#btnCancelCounterMapping").click(function () {
    $("#jqgCounterMapping").jqGrid('resetSelection');
    $('#PopupTokenCounter').modal('hide');
    fnClearFields();
});

function fnClearFields() {
    $('#cboFloor').val('0').selectpicker('refresh');
    $("#cboFloor").next().attr('disabled', false);
    $("#txtCounterNumber").val('');
    $("#txtCounterNumber").attr('readonly', false);
    $("#chkActiveStatus").prop('disabled', false);
    $("#btnSaveTokenCounter").attr("disabled", false);
}


function fnSaveTokenCounter() {
    if (IsStringNullorEmpty($("#cboBusinessLocation").val()) || $("#cboBusinessLocation").val() === "0") {
        fnAlert("w", "ETM_02_00", "UI0175", errorMsg.Businesskey_E6);
        return;
    }
    if (IsStringNullorEmpty($("#cboFloor").val()) || $("#cboFloor").val() === "0") {
       fnAlert("w", "ETM_02_00", "UI0253", errorMsg.Floor_E9);
        return;
    }
    if (IsStringNullorEmpty($("#txtCounterNumber").val())) {
        fnAlert("w", "ETM_02_00", "UI0252", errorMsg.CounterNumber_E8);
        return;
    }

    obj_counter = {
        BusinessKey: $("#cboBusinessLocation").val(),
        FloorId: $("#cboFloor").val(),
        CounterNumber: $("#txtCounterNumber").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSaveTokenCounter").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/CounterMapping/InsertOrUpdateTokenCounter',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: obj_counter },
        success: function (response) {
            if (response.Status) {

                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveTokenCounter").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupTokenCounter").modal('hide');
                fnClearFields();
                fnGridRefreshTokenCounter();
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveTokenCounter").attr("disabled", false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveTokenCounter").attr("disabled", false);
        }
    });
}

function fnDeleteTokenCounter() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }

    $("#btndeActiveTokenCounter").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/CounterMapping/ActiveOrDeActiveTokenCounter?status=' + a_status + '&businesskey=' + $("#cboBusinessLocation").val() + '&counternumber=' + $("#txtCounterNumber").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btndeActiveTokenCounter").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupTokenCounter").modal('hide');
                fnClearFields();
                fnGridRefreshTokenCounter();
                $("#btndeActiveTokenCounter").attr("disabled", false);
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btndeActiveTokenCounter").attr("disabled", false);
                $("#btndeActiveTokenCounter").html('De Activate');
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btndeActiveTokenCounter").attr("disabled", false);
            $("#btndeActiveTokenCounter").html('De Activate');
        }
    });
}

function SetGridControlByAction() {

    $('#jqgAdd').removeClass('ui-state-disabled');
    var btn_editEnable = document.querySelectorAll('#jqgEdit');
    var btn_viewEnable = document.querySelectorAll('#jqgView');
    var btn_deleteEnable = document.querySelectorAll('#jqgDelete');
    for (var i = 0; i < btn_editEnable.length; i++) {
        btn_editEnable[i].disabled = false;
    }
    for (var j = 0; j < btn_viewEnable.length; j++) {
        btn_viewEnable[j].disabled = false;
    }
    for (var k = 0; k < btn_deleteEnable.length; k++) {
        btn_deleteEnable[k].disabled = false;
    }


    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
    if (_userFormRole.IsEdit === false) {
        var btn_editDisable = document.querySelectorAll('#jqgEdit');
        for (var i = 0; i < btn_editDisable.length; i++) {
            btn_editDisable[i].disabled = true;
            btn_editDisable[i].className = "ui-state-disabled";
        }
    }
    if (_userFormRole.IsView === false) {
        var btn_viewDisable = document.querySelectorAll('#jqgView');
        for (var j = 0; j < btn_viewDisable.length; j++) {
            btn_viewDisable[j].disabled = true;
            btn_viewDisable[j].className = "ui-state-disabled";
        }
    }

    if (_userFormRole.IsDelete === false) {
        var btn_deleteDisable = document.querySelectorAll('#jqgDelete');
        for (var k = 0; k < btn_deleteDisable.length; k++) {
            btn_deleteDisable[k].disabled = true;
            btn_deleteDisable[k].className = "ui-state-disabled";
        }
    }
}

