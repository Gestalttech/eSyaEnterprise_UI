$(function () {
    fnGridLoadToken();
});
$(document).ready(function () {

    $.contextMenu({
        // define which elements trigger this menu
        selector: ".btn-actions",
        trigger: 'left',
        // define the elements of the menu
        items: {
            edit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditToken(event, 'edit') } },
            view: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditToken(event, 'view') } },
            delete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditToken(event, 'delete') } }
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i> " + localization.Edit + "</span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i> " + localization.View + "</span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i> " + localization.Delete + "</span>");


});
var _isInsert = true;

function fnGridLoadToken() {

    $("#jqgToken").GridUnload();

    $("#jqgToken").jqGrid({
        url: getBaseURL() + '/Configure/GetAllConfigureTokens',
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.TokenType, localization.TokenDescription, localization.ConfirmationURL, localization.TokenPrefix, localization.TokenNumber, localization.DisplaySequence, localization.Active, localization.Actions],
        colModel: [
            { name: "TokenType", width: 50, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: false },
            { name: "TokenDesc", width: 80, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: false },
            { name: "ConfirmationUrl", width: 120, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false, hidden: false },
            { name: "TokenPrefix", width: 50, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: false },
            { name: "TokenNumberLength", width: 50, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: false },
            { name: "DisplaySequence", width: 50, align: 'left', editable: true, editoptions: { maxlength: 3 }, resizable: false, hidden: false },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            {
                name: 'edit', search: false, align: 'left', width: 70, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    var i = options.rowId;
                    return '<button class="mr-1 btn btn-outline btn-actions" id="btnTokenActions' + i + '"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpToken",
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
        forceFit: true, caption: 'Token',
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqpToken");
        },
    }).jqGrid('navGrid', '#jqpToken', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpToken', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshToken
    }).jqGrid('navButtonAdd', '#jqpToken', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddToken
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgToken"),
            newWidth = $grid.closest(".ui-jqgrid").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddToken() {
    $('#PopupToken').modal('show');
    $('#PopupToken').modal({ backdrop: 'static', keyboard: false });
    $('#PopupToken').find('.modal-title').text(localization.AddToken);
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#txtTokenType").attr('readonly', false);
    fnClearFields();
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveToken").html('<i class="fa fa-save"></i>' + localization.Save);
    $("#btnSaveToken").show();
    $("#btndeActiveToken").hide();
    _isInsert = true;
}


function fnEditToken(e, actiontype) {
    var rowid = $("#jqgToken").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgToken').jqGrid('getRowData', rowid);

    _isInsert = false;

    $('#PopupToken').modal('show');
    $('#txtTokenType').val(rowData.TokenType);
    $("#txtTokenType").attr('readonly', true);
    $('#txtTokenDescription').val(rowData.TokenDesc);
    $('#txtConfirmationURL').val(rowData.ConfirmationUrl);
    $('#txtTokenPrefix').val(rowData.TokenPrefix);
    $('#txtTokenNumber').val(rowData.TokenNumberLength);
    $('#txtDisplaySequence').val(rowData.DisplaySequence);

    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveToken").attr("disabled", false);

    $("#txtTransMode").attr('readonly', true);

    if (actiontype.trim() == "edit") {
        $('#PopupToken').find('.modal-title').text(localization.EditToken);
        $("#btnSaveToken").html('<i class="fa fa-sync"></i>' + localization.Update);
        $("#btndeActiveToken").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveToken").attr("disabled", false);
    }

    if (actiontype.trim() == "view") {
        $('#PopupToken').find('.modal-title').text(localization.ViewToken);
        $("#btnSaveToken").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveToken").hide();
        $("#btndeActiveToken").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupToken").on('hidden.bs.modal', function () {
            $("#btnSaveToken").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        $('#PopupToken').find('.modal-title').text("Activate/De Activate Token");
        $("#btnSaveToken").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveToken").hide();

        if (rowData.ActiveStatus == 'true') {
            $("#btndeActiveToken").html(localization.DActivate);
        }
        else {
            $("#btndeActiveToken").html(localization.Activate);
        }

        $("#btndeActiveToken").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupToken").on('hidden.bs.modal', function () {
            $("#btnSaveToken").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

function fnGridRefreshToken() {
    $("#jqgToken").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

$("#btnCancelToken").click(function () {
    $("#jqgToken").jqGrid('resetSelection');
    $('#PopupToken').modal('hide');
    fnClearFields();
});

function fnClearFields() {
    $("#txtTokenType").val('');
    $("#txtTokenType").attr('readonly', false);
    $("#txtDisplaySequence").attr('readonly', false);
    $("#txtTokenDescription").val('');
    $("#txtDisplaySequence").val('');
    $("#txtTokenDescription").attr('readonly', false);
    $("#txtConfirmationURL").val('');
    $("#txtConfirmationURL").attr('readonly', false);
    $('#txtTokenPrefix').val('');
    $("#txtTokenPrefix").attr('readonly', false);
    $('#txtTokenNumber').val('');
    $("#txtTokenNumber").attr('readonly', false);
    $("#chkActiveStatus").prop('disabled', false);
    $("#btnSaveToken").attr("disabled", false);
    $("#btndeActiveToken").attr("disabled", false);
}


function fnSaveToken() {

    if (IsStringNullorEmpty($("#txtTokenType").val())) {
        fnAlert("w", "ETM_01_00", "UI0248", errorMsg.TokenType_E6);
        return;
    }
    if (IsStringNullorEmpty($("#txtTokenDescription").val())) {
        fnAlert("w", "ETM_01_00", "UI0249", errorMsg.TokenDesc_E7);
        return;
    }
    if (IsStringNullorEmpty($("#txtTokenPrefix").val())) {
        fnAlert("w", "ETM_01_00", "UI0250", errorMsg.TokenPrefix_E8);
        return;
    }
    if (IsStringNullorEmpty($("#txtTokenNumber").val())) {
        fnAlert("w", "ETM_01_00", "UI0251", errorMsg.TokenNumber_E9);
        return;
    }

    if (IsStringNullorEmpty($("#txtDisplaySequence").val())) {
        fnAlert("w", "ETM_01_00", "UI0265", errorMsg.DisplaySequence_E10);
        return;
    }
    objtoken = {
        TokenType: $("#txtTokenType").val(),
        TokenDesc: $("#txtTokenDescription").val(),
        ConfirmationUrl: $("#txtConfirmationURL").val(),
        TokenPrefix: $("#txtTokenPrefix").val(),
        TokenNumberLength: $("#txtTokenNumber").val(),
        DisplaySequence: $("#txtDisplaySequence").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSaveToken").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/Configure/InsertOrUpdateToken',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: objtoken },
        success: function (response) {
            if (response.Status) {

                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveToken").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupToken").modal('hide');
                fnClearFields();
                fnGridRefreshToken();
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
               $("#btnSaveToken").attr("disabled", false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveToken").attr("disabled", false);
        }
    });
}

function fnDeleteToken() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }

    $("#btndeActiveToken").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Configure/ActiveOrDeActiveToken?status=' + a_status + '&tokentype=' + $("#txtTokenType").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btndeActiveToken").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupToken").modal('hide');
                fnClearFields();
                fnGridRefreshToken();
                $("#btndeActiveToken").attr("disabled", false);
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btndeActiveToken").attr("disabled", false);
                $("#btndeActiveToken").html('De Activate');
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btndeActiveToken").attr("disabled", false);
            $("#btndeActiveToken").html('De Activate');
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

