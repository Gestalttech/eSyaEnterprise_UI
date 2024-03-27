
$(document).ready(function () {
    fnLoadGridPortfolios();

    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnPortfolio",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditPortfolio(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditPortfolio(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditPortfolio(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});
var actiontype = "";
var _isInsert = true;

function fnLoadGridPortfolios() {

    $("#jqgPortfolio").GridUnload();

    $("#jqgPortfolio").jqGrid({
        url: getBaseURL() + '/ConfigStores/GetAllPortfolios',
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.PortfolioId, localization.PortfolioDesc, localization.Active, localization.Actions],
        colModel: [
            { name: "PortfolioId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "PortfolioDesc", width: 180, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },

            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnPortfolio"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],

        pager: "#jqpPortfolio",
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
        forceFit: true, caption: localization.Portfolio,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgPortfolio");
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
    }).jqGrid('navGrid', '#jqpPortfolio', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpPortfolio', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshActions
    }).jqGrid('navButtonAdd', '#jqpPortfolio', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddPortfolio
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgPortfolio"),
            newWidth = $grid.closest(".Activitiescontainer").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddPortfolio() {
    _isInsert = true;
    fnClearFields();
    $('#PopupPortfolio').modal('show');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $('#PopupPortfolio').find('.modal-title').text(localization.AddPortfolio);
    $("#btnSavePortfolio").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSavePortfolio").show();
    $("#btndeActivePortfolio").hide();
    $('#txtPortfolioId').val('');
}

function fnEditPortfolio(e, actiontype) {
    var rowid = $("#jqgPortfolio").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgPortfolio').jqGrid('getRowData', rowid);
    $('#txtPortfolioId').val(rowData.PortfolioId);
    $('#txtPortfolioDesc').val(rowData.PortfolioDesc);
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSavePortfolio").attr("disabled", false);

    _isInsert = false;

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "ECS_03_00", "UIC02", errorMsg.UnAuthorised_edit_E1);
            return;
        }
        $('#PopupPortfolio').modal('show');
        $('#PopupPortfolio').find('.modal-title').text(localization.UpdatePortfolio);
        $("#btnSavePortfolio").html('<i class="fa fa-sync"></i>' + localization.Update);
        $("#btndeActivePortfolio").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSavePortfolio").attr("disabled", false);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "ECS_03_00", "UIC03", errorMsg.UnAuthorised_view_E2);
            return;
        }
        $('#PopupPortfolio').modal('show');
        $('#PopupPortfolio').find('.modal-title').text(localization.ViewPortfolio);
        $("#btnSavePortfolio").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSavePortfolio").hide();
        $("#btndeActivePortfolio").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupPortfolio").on('hidden.bs.modal', function () {
            $("#btnSavePortfolio").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            fnAlert("w", "ECS_03_00", "UIC04", errorMsg.UnAuthorised_delete_E3);
            return;
        }
        $('#PopupPortfolio').modal('show');
        $('#PopupPortfolio').find('.modal-title').text(localization.ActivateDeactivatePortfolio);
        $("#btnSavePortfolio").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSavePortfolio").hide();

        if (rowData.ActiveStatus == 'true') {
            $("#btndeActivePortfolio").html(localization.Deactivate);
        }
        else {
            $("#btndeActivePortfolio").html(localization.Activate);
        }

        $("#btndeActivePortfolio").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupPortfolio").on('hidden.bs.modal', function () {
            $("#btnSavePortfolio").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

function fnSavePortfolio() {

    if (IsStringNullorEmpty($("#txtPortfolioDesc").val())) {
        fnAlert("w", "ECS_03_00", "UI0301", errorMsg.Protfolio_E1);
        return;
    }

    obj_portf = {
        PortfolioId: $("#txtPortfolioId").val() === '' ? 0 : $("#txtPortfolioId").val(),
        PortfolioDesc: $("#txtPortfolioDesc").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSavePortfolio").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/ConfigStores/InsertOrUpdateIntoPortfolio',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: obj_portf },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSavePortfolio").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupPortfolio").modal('hide');
                fnClearFields();
                fnGridRefreshActions();
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSavePortfolio").attr("disabled", false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSavePortfolio").attr("disabled", false);
        }
    });
}

function fnGridRefreshActions() {
    $("#jqgPortfolio").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {
    $("#txtPortfolioId").val('');
    $("#txtPortfolioDesc").val('');
    $("#chkActiveStatus").prop('disabled', false);
    $("#btnSavePortfolio").attr("disabled", false);
    $("#btndeActivePortfolio").attr("disabled", false);
    $("input,textarea").attr('readonly', false);
}

$("#btnCancelPortfolio").click(function () {
    $("#jqgPortfolio").jqGrid('resetSelection');
    $('#PopupPortfolio').modal('hide');
    fnClearFields();
});

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}

function fnDeletePortfolio() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btndeActivePortfolio").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/ConfigStores/ActiveOrDeActivePortfolio?status=' + a_status + '&PortfolioId=' + $("#txtPortfolioId").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btndeActivePortfolio").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupPortfolio").modal('hide');
                fnClearFields();
                fnGridRefreshActions();
                $("#btndeActivePortfolio").attr("disabled", false);
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btndeActivePortfolio").attr("disabled", false);
                $("#btndeActivePortfolio").html('De Activate');
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btndeActivePortfolio").attr("disabled", false);
            $("#btndeActivePortfolio").html('De Activate');
        }
    });
}