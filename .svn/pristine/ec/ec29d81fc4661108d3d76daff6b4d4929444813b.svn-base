
$(document).ready(function () {
    fnLoadGridAreaController();

    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnAreaController",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditAreaController(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditAreaController(event,'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditAreaController(event,'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});
var actiontype = "";
var _isInsert = true;

function fnLoadGridAreaController() {

    $("#jqgAreaController").GridUnload();

    $("#jqgAreaController").jqGrid({
        url: getBaseURL() + '/FormNames/GetAllAreaController',
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.ID, localization.AreaName, localization.ControllerName, localization.Active, localization.Actions],
        colModel: [
            { name: "Id", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "Area", width: 180, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false },
            { name: "Controller", width: 180, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnAreaController"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],

        pager: "#jqpAreaController",
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
        forceFit: true, caption:'Area Controller',
        loadComplete: function (data) {
            SetGridControlByAction();
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
    }).jqGrid('navGrid', '#jqpAreaController', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpAreaController', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshAreaController
        }).jqGrid('navButtonAdd', '#jqpAreaController', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddAreaController
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgAreaController"),
            newWidth = $grid.closest(".Activitiescontainer").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddAreaController() {
    _isInsert = true;
    fnClearFields();
    $('#PopupAreaController').modal('show');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $('#PopupAreaController').find('.modal-title').text(localization.AddAreaController);
    $("#btnSaveAreaController").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveAreaController").show();
    $("#btndeActiveAreaController").hide();
    $('#txtId').val('');
}

function fnEditAreaController(e, actiontype) {
    var rowid = $("#jqgAreaController").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgAreaController').jqGrid('getRowData', rowid);
    $('#txtId').val(rowData.Id);
    $('#txtArea').val(rowData.Area);
    $('#txtController').val(rowData.Controller);
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveAreaController").attr("disabled", false);

    _isInsert = false;

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("your Not Authorized to Edit");
            return;
        }
        $('#PopupAreaController').modal('show');
        $('#PopupAreaController').find('.modal-title').text(localization.UpdateAreaController);
        $("#btnSaveAreaController").html('<i class="fa fa-sync"></i>' + localization.Update);
        $("#btndeActiveAreaController").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveAreaController").attr("disabled", false);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("your Not Authorized to View");
            return;
        }
        $('#PopupAreaController').modal('show');
        $('#PopupAreaController').find('.modal-title').text(localization.ViewAreaController);
        $("#btnSaveAreaController").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveAreaController").hide();
        $("#btndeActiveAreaController").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupAreaController").on('hidden.bs.modal', function () {
            $("#btnSaveAreaController").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            toastr.warning("your Not Authorized to Delete");
            return;
        }
        $('#PopupAreaController').modal('show');
        $('#PopupAreaController').find('.modal-title').text("Activate/De Activate Area Controller");
        $("#btnSaveAreaController").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveAreaController").hide();

        if (rowData.ActiveStatus == 'true') {
            $("#btndeActiveAreaController").html(localization.DActivate);
        }
        else {
            $("#btndeActiveAreaController").html(localization.Activate);
        }

        $("#btndeActiveAreaController").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupAreaController").on('hidden.bs.modal', function () {
            $("#btnSaveAreaController").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}


function fnSaveAreaController() {

    if (IsStringNullorEmpty($("#txtArea").val())) {
        toastr.warning("Please Enter Area Name");
        return;
    }
    if (IsStringNullorEmpty($("#txtController").val())) {
        toastr.warning("Please Enter Controller Name");
        return;
    }
    obj_area = {
        Id: $("#txtId").val() === '' ? 0 : $("#txtId").val(),
        Area: $("#txtArea").val(),
        Controller: $("#txtController").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSaveAreaController").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/FormNames/InsertOrUpdateAreaController',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: obj_area },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveAreaController").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupAreaController").modal('hide');
                fnClearFields();
                fnGridRefreshAreaController();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveAreaController").attr("disabled", false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveAreaController").attr("disabled", false);
        }
    });
}

function fnGridRefreshAreaController() {
    $("#jqgAreaController").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {
    $("#txtId").val('');
    $("#txtArea").val('');
    $("#txtController").val('');
    $("#chkActiveStatus").prop('disabled', false);
    $("#btnSaveAreaController").attr("disabled", false);
    $("#btndeActiveAreaController").attr("disabled", false);
    $("input,textarea").attr('readonly', false);
}

$("#btnCancelActivities").click(function () {
    $("#jqgAreaController").jqGrid('resetSelection');
    $('#PopupAreaController').modal('hide');
    fnClearFields();
});

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}

function fnDeleteAreaController() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btndeActiveAreaController").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/FormNames/ActiveOrDeActiveAreaController?status=' + a_status + '&Id=' + $("#txtId").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btndeActiveAreaController").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupAreaController").modal('hide');
                fnClearFields();
                fnGridRefreshAreaController();
                $("#btndeActiveAreaController").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btndeActiveAreaController").attr("disabled", false);
                $("#btndeActiveAreaController").html('De Activate');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btndeActiveAreaController").attr("disabled", false);
            $("#btndeActiveAreaController").html('De Activate');
        }
    });
}