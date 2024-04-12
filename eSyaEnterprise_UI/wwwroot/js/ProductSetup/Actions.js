
$(document).ready(function () {
    fnLoadGridActions();

    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnActions",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditActions(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditActions(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditActions(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});
var actiontype = "";
var _isInsert = true;

function fnLoadGridActions() {

    $("#jqgActions").GridUnload();

    $("#jqgActions").jqGrid({
        url: getBaseURL() + '/Actions/GetAllActions',
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.ActionId, localization.ActionDesc,localization.DisplaySequence, localization.Active, localization.Actions],
        colModel: [
            { name: "ActionId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "ActionDesc", width: 180, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false },
            { name: "DisplaySequence", width: 80, align: 'left', editable: true, editoptions: { maxlength: 150 },hidden:true, resizable: false },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },

            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnActions"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],

        pager: "#jqpActions",
        rowNum: 10,
        sortable:false,
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
        forceFit: true, caption: localization.Actions,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgActions");
        },
        onSelectRow: function (rowid, status, e) {
            var $self = $(this), $target = $(e.target),
                p = $self.jqGrid("getGridParam"),
                rowData = $self.jqGrid("getLocalRow", rowid),
                $td = $target.closest("tr.jqgrow>td"),
                iCol = $td.length > 0 ? $td[0].cellIndex : -1,
                cmName = iCol >= 0 ? p.colModel[iCol].name : "";

            switch (cmName) {
                case "id":
                    if ($target.hasClass("myedit")) {
                        alert("edit icon is clicked in the row with rowid=" + rowid);
                    } else if ($target.hasClass("mydelete")) {
                        alert("delete icon is clicked in the row with rowid=" + rowid);
                    }
                    break;
                case "serial":
                    if ($target.hasClass("mylink")) {
                        alert("link icon is clicked in the row with rowid=" + rowid);
                    }
                    break;
                default:
                    break;
            }

        },
    }).jqGrid('navGrid', '#jqpActions', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpActions', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshActions
    }).jqGrid('navButtonAdd', '#jqpActions', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddActions
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgActions"),
            newWidth = $grid.closest(".Activitiescontainer").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddActions() {
    _isInsert = true;
    fnClearFields();
    $('#PopupActions').modal('show');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $('#PopupActions').find('.modal-title').text(localization.AddActions);
    $("#btnSaveActions").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveActions").show();
    $("#btndeActiveActions").hide();
    $('#txtActionId').val('');
}

function fnEditActions(e, actiontype) {
    var rowid = $("#jqgActions").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgActions').jqGrid('getRowData', rowid);
    $('#txtActionId').val(rowData.ActionId);
    $('#txtActionDesc').val(rowData.ActionDesc);
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveActions").attr("disabled", false);

    _isInsert = false;

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EPS_01_00", "UIC02", errorMsg.UnAuthorised_edit_E1);
            return;
        }
        $('#PopupActions').modal('show');
        $('#PopupActions').find('.modal-title').text(localization.UpdateActions);
        $("#btnSaveActions").html('<i class="fa fa-sync"></i>' + localization.Update);
        $("#btndeActiveActions").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveActions").attr("disabled", false);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "EPS_01_00", "UIC03", errorMsg.UnAuthorised_view_E2);
            return;
        }
        $('#PopupActions').modal('show');
        $('#PopupActions').find('.modal-title').text(localization.ViewActions);
        $("#btnSaveActions").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveActions").hide();
        $("#btndeActiveActions").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupActions").on('hidden.bs.modal', function () {
            $("#btnSaveActions").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            fnAlert("w", "EPS_01_00", "UIC04", errorMsg.UnAuthorised_delete_E3);
            return;
        }
        $('#PopupActions').modal('show');
        $('#PopupActions').find('.modal-title').text(localization.ActivateDeactivateActions);
        $("#btnSaveActions").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveActions").hide();

        if (rowData.ActiveStatus == 'true') {
            $("#btndeActiveActions").html(localization.Deactivate);
        }
        else {
            $("#btndeActiveActions").html(localization.Activate);
        }

        $("#btndeActiveActions").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupActions").on('hidden.bs.modal', function () {
            $("#btnSaveActions").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

function fnSaveActions() {

    if (IsStringNullorEmpty($("#txtActionDesc").val())) {
        fnAlert("w", "EPS_22_00", "UI0201", errorMsg.ActionDesc_E4);
        return;
    }
    
    obj_action = {
        ActionId: $("#txtActionId").val() === '' ? 0 : $("#txtActionId").val(),
        ActionDesc: $("#txtActionDesc").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSaveActions").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/Actions/InsertOrUpdateActions',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: obj_action },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveActions").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupActions").modal('hide');
                fnClearFields();
                fnGridRefreshActions();
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveActions").attr("disabled", false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveActions").attr("disabled", false);
        }
    });
}

function fnGridRefreshActions() {
    $("#jqgActions").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {
    $("#txtActionId").val('');
    $("#txtActionDesc").val('');
    $("#chkActiveStatus").prop('disabled', false);
    $("#btnSaveActions").attr("disabled", false);
    $("#btndeActiveActions").attr("disabled", false);
    $("input,textarea").attr('readonly', false);
}

$("#btnCancelActions").click(function () {
    $("#jqgActions").jqGrid('resetSelection');
    $('#PopupActions').modal('hide');
    fnClearFields();
});

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}

function fnDeleteActions() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btndeActiveActions").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Actions/ActiveOrDeActiveActions?status=' + a_status + '&actionId=' + $("#txtActionId").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btndeActiveActions").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupActions").modal('hide');
                fnClearFields();
                fnGridRefreshActions();
                $("#btndeActiveActions").attr("disabled", false);
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btndeActiveActions").attr("disabled", false);
                $("#btndeActiveActions").html('De Activate');
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btndeActiveActions").attr("disabled", false);
            $("#btndeActiveActions").html('De Activate');
        }
    });
}