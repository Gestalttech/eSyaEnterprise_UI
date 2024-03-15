
$(document).ready(function () {
    fnLoadGrideSyaCultures();

    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btneSyaCultures",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditeSyaCulture(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditeSyaCulture(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditeSyaCulture(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});
var actiontype = "";

function fnLoadGrideSyaCultures() {

    $("#jqgeSyaCulture").GridUnload();

    $("#jqgeSyaCulture").jqGrid({
        url: getBaseURL() + '/eSyaCulture/GetAlleSyaCultures',
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.CultureCode, localization.CultureDesc, localization.Active, localization.Actions],
        colModel: [
            { name: "CultureCode", width: 180, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false },
            { name: "CultureDesc", width: 180, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },

            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btneSyaCultures"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],

        pager: "#jqpeSyaCulture",
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
        forceFit: true, caption: localization.eSyaCulture,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgeSyaCulture");
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
    }).jqGrid('navGrid', '#jqpeSyaCulture', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpeSyaCulture', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefresheSyaCultures
    }).jqGrid('navButtonAdd', '#jqpeSyaCulture', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddeSyaCulture
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgeSyaCulture"),
            newWidth = $grid.closest(".Activitiescontainer").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddeSyaCulture() {
    fnClearFields();
    $('#PopupeSyaCulture').modal('show');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $('#PopupeSyaCulture').find('.modal-title').text(localization.AddeSyaCulture);
    $("#btnSaveeSyaCulture").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveeSyaCulture").show();
    $("#btndeActiveeSyaCulture").hide();
    $('#txtCultureCode').val('');
    $("#txtCultureCode").attr('readonly', false);
}

function fnEditeSyaCulture(e, actiontype) {
    var rowid = $("#jqgeSyaCulture").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgeSyaCulture').jqGrid('getRowData', rowid);
    $('#txtCultureCode').val(rowData.CultureCode);
    $("#txtCultureCode").attr('readonly', true);
    $('#txtCultureDesc').val(rowData.CultureDesc);
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveeSyaCulture").attr("disabled", false);


    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EPS_09_00", "UIC02", errorMsg.UnAuthorised_edit_E1);
            return;
        }
        $('#PopupeSyaCulture').modal('show');
        $('#PopupeSyaCulture').find('.modal-title').text(localization.UpdateSyaCulture);
        $("#btnSaveeSyaCulture").html('<i class="fa fa-sync"></i>' + localization.Update);
        $("#btndeActiveeSyaCulture").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveeSyaCulture").attr("disabled", false);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "EPS_09_00", "UIC03", errorMsg.UnAuthorised_view_E2);
            return;
        }
        $('#PopupeSyaCulture').modal('show');
        $('#PopupeSyaCulture').find('.modal-title').text(localization.ViewSyaCulture);
        $("#btnSaveeSyaCulture").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveeSyaCulture").hide();
        $("#btndeActiveeSyaCulture").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupeSyaCulture").on('hidden.bs.modal', function () {
            $("#btnSaveeSyaCulture").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            fnAlert("w", "EPS_09_00", "UIC04", errorMsg.UnAuthorised_delete_E3);
            return;
        }
        $('#PopupeSyaCulture').modal('show');
        $('#PopupeSyaCulture').find('.modal-title').text("Activate/De Activate eSya Culture");
        $("#btnSaveeSyaCulture").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveeSyaCulture").hide();

        if (rowData.ActiveStatus == 'true') {
            $("#btndeActiveeSyaCulture").html(localization.Deactivate);
        }
        else {
            $("#btndeActiveeSyaCulture").html(localization.Activate);
        }

        $("#btndeActiveeSyaCulture").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupeSyaCulture").on('hidden.bs.modal', function () {
            $("#btnSaveeSyaCulture").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

function fnSaveeSyaCulture() {

    if (IsStringNullorEmpty($("#txtCultureCode").val())) {
        fnAlert("w", "EPS_09_00", "UI0204", errorMsg.CultureCode_E4);
        return;
    }
    if (IsStringNullorEmpty($("#txtCultureDesc").val())) {
        fnAlert("w", "EPS_09_00", "UI0205", errorMsg.CultureDesc_E5);
        return;
    }
    obj_cul = {
        CultureCode: $("#txtCultureCode").val(),
        CultureDesc: $("#txtCultureDesc").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSaveeSyaCulture").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/eSyaCulture/InsertOrUpdateIntoeSyaCultures',
        type: 'POST',
        datatype: 'json',
        data: { obj: obj_cul },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveeSyaCulture").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupeSyaCulture").modal('hide');
                fnClearFields();
                fnGridRefresheSyaCultures();
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveeSyaCulture").attr("disabled", false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveeSyaCulture").attr("disabled", false);
        }
    });
}

function fnGridRefresheSyaCultures() {
    $("#jqgeSyaCulture").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {
    $("#txtCultureCode").val('');
    $("#txtCultureCode").attr('readonly', false); 
    $("#txtCultureDesc").val('');
    $("#chkActiveStatus").prop('disabled', false);
    $("#btnSaveeSyaCulture").attr("disabled", false);
    $("#btndeActiveeSyaCulture").attr("disabled", false);
    $("input,textarea").attr('readonly', false);
}

$("#btnCanceleSyaCulture").click(function () {
    $("#jqgeSyaCulture").jqGrid('resetSelection');
    $('#PopupeSyaCulture').modal('hide');
    fnClearFields();
});

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}

function fnDeleteeSyaCulture() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btndeActiveeSyaCulture").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/eSyaCulture/ActiveOrDeActiveeSyaCultures?status=' + a_status + '&esyaculture=' + $("#txtCultureCode").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btndeActiveeSyaCulture").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupeSyaCulture").modal('hide');
                fnClearFields();
                fnGridRefresheSyaCultures();
                $("#btndeActiveeSyaCulture").attr("disabled", false);
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btndeActiveeSyaCulture").attr("disabled", false);
                $("#btndeActiveeSyaCulture").html('De Activate');
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btndeActiveeSyaCulture").attr("disabled", false);
            $("#btndeActiveeSyaCulture").html('De Activate');
        }
    });
}