
$(function () {
    fnLoadGridPatientCategoryDependent();

    $.contextMenu({
         selector: "#btnPatientCategoryDependent",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditPatientCategoryDependent('edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditPatientCategoryDependent('view') } }
        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");

});
var actiontype = "";
var _isInsert = true;

function fnLoadGridPatientCategoryDependent() {

    $("#jqgPatientCategoryDependent").GridUnload();

    $("#jqgPatientCategoryDependent").jqGrid({
        // url: getBaseURL() + '/Actions/GetAllActions',
       url:'',
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.BusinessKey, localization.PatientTypeId, localization.PatientCategoryId, localization.Relationship, localization.RelationshipDescription, localization.Active, localization.Actions],
        colModel: [
            { name: "BusinessKey", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "PatientTypeId", width: 180, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false, hidden: true },
            { name: "PatientCategoryId", width: 180, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false, hidden: true },
            { name: "Relationship", width: 80, align: 'left', editable: true, editoptions: { maxlength: 150 }, hidden: true, resizable: false },
            { name: "RelationshipDesc", width: 80, align: 'left', editable: true, editoptions: { maxlength: 150 }, hidden: false, resizable: false },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },

            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnPatientCategoryDependent"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],

        pager: "#jqpPatientCategoryDependent",
        rowNum: 10,
        sortable: false,
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
        forceFit: true, caption: localization.PatientCategoryDependent,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgPatientCategoryDependent");
        },
        onSelectRow: function (rowid, status, e) {
            },
    }).jqGrid('navGrid', '#jqpPatientCategoryDependent', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpPatientCategoryDependent', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshPatientCategoryDependent
    }).jqGrid('navButtonAdd', '#jqpPatientCategoryDependent', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddPatientCategoryDependent
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgPatientCategoryDependent"),
            newWidth = $grid.closest(".Activitiescontainer").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddPatientCategoryDependent() {
    _isInsert = true;
    fnClearPatientCategoryDependent();
    $('#PopupPatientCategoryDependent').modal('show');
    $("#chkDPActiveStatus").parent().addClass("is-checked");
    $('#PopupPatientCategoryDependent').find('.modal-title').text(localization.AddPatientCategoryDependent);
    $("#btnSavePatientCategoryDependent").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#chkDPActiveStatus").prop('disabled', true);
    $("#btnSavePatientCategoryDependent").show();
    $('#txtRelationshipDescription').val('');
}

function fnEditPatientCategoryDependent(actiontype) {
    var rowid = $("#jqgPatientCategoryDependent").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgPatientCategoryDependent').jqGrid('getRowData', rowid);
    $('#txtRelationshipDescription').val(rowData.ActionId);
    $("#txtRelationship").val(rowData.Relationship);
     if (rowData.ActiveStatus == 'true') {
        $("#chkDPActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkDPActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSavePatientCategoryDependent").attr("disabled", false);

    _isInsert = false;

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EPS_01_00", "UIC02", errorMsg.UnAuthorised_edit_E1);
            return;
        }
        $('#PopupPatientCategoryDependent').modal('show');
        $('#PopupPatientCategoryDependent').find('.modal-title').text(localization.UpdatePatientCategoryDependent);
        $("#btnSavePatientCategoryDependent").html('<i class="fa fa-sync"></i>' + localization.Update);
         
        $("#chkDPActiveStatus").prop('disabled', true);
        $("#btnSavePatientCategoryDependent").attr("disabled", false);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "EPS_01_00", "UIC03", errorMsg.UnAuthorised_view_E2);
            return;
        }
        $('#PopupPatientCategoryDependent').modal('show');
        $('#PopupPatientCategoryDependent').find('.modal-title').text(localization.ViewPatientCategoryDependent);
        $("#btnSavePatientCategoryDependent").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSavePatientCategoryDependent").hide();
         
        $("#chkDPActiveStatus").prop('disabled', true);
        $("#PopupPatientCategoryDependent").on('hidden.bs.modal', function () {
            $("#btnSavePatientCategoryDependent").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    
}

function fnSavePatientCategoryDependent() {

    if (IsStringNullorEmpty($("#txtRelationshipDescription").val())) {
        fnAlert("w", "EPM_08_00", "", 'Please enter the relationship description');
        return;
    }
    
    obj_dependent = {
        BusinessKey: $("#cboDPBusinessKey").val(),
        PatientTypeId: $("#cboDPPatientTypes").val(),
        PatientCategoryId: $("#cboDPPatientCategory").val(),
        Relationship: $("#txtRelationship").val(),
        RelationshipDesc: $("#txtRelationshipDescription").val(),
        ActiveStatus: $("#chkDPActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSavePatientCategoryDependent").attr("disabled", true);

    $.ajax({
        // url: getBaseURL() + '/Actions/InsertOrUpdateActions',
       url:'',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: obj_action },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSavePatientCategoryDependent").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupPatientCategoryDependent").modal('hide');
                fnClearPatientCategoryDependent();
                fnGridRefreshPatientCategoryDependent();
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSavePatientCategoryDependent").attr("disabled", false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSavePatientCategoryDependent").attr("disabled", false);
        }
    });
}

function fnGridRefreshPatientCategoryDependent() {
    $("#jqgPatientCategoryDependent").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearPatientCategoryDependent() {
    $("#txtRelationship").val('');
    $("#txtRelationshipDescription").val('');
    $("#chkDPActiveStatus").prop('disabled', false);
    $("#btnSavePatientCategoryDependent").attr("disabled", false);
    $("input,textarea").attr('readonly', false);
}

$("#btnCancelPatientCategoryDependent").click(function () {
    $("#jqgPatientCategoryDependent").jqGrid('resetSelection');
    $('#PopupPatientCategoryDependent').modal('hide');
    fnClearPatientCategoryDependent();
});

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}

 