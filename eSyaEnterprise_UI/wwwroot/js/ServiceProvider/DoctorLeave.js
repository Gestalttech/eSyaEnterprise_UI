
$(function () {
     fnGridLoadDoctorLeave();

    $.contextMenu({
        selector: "#btnDoctorLeave",
        trigger: "left",
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditDoctorLeave(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditDoctorLeave(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditDoctorLeave(event, 'delete') } },

        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");

});


var _isInsert = true;


function fnDoctorNameChange() {

     fnGridLoadDoctorLeave();
}

function  fnGridLoadDoctorLeave() {

    $("#jqgDoctorLeave").GridUnload();
    var codeType = $("#cboDoctorName").val();

    $("#jqgDoctorLeave").jqGrid({

        url: '',
        datatype: 'local',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },

        colNames: [localization.DoctorId, localization.DoctorName, localization.LeaveFrom, localization.LeaveTo, localization.Active, localization.Actions],

                colModel: [
                    { name: "DoctorId", width: 50, editable: true, align: 'left', hidden:true },
                    { name: "DoctorName", width: 70, editable: false, hidden: false, align: 'left', resizable: true },
                    {
                        name: 'LeaveFrom', index: 'FromDate', width: 60, sorttype: "date", formatter: "date", formatoptions:
                            { newformat: _cnfjqgDateFormat }
                    },
                    {
                        name: 'LeaveTo', index: 'FromDate', width: 60, sorttype: "date", formatter: "date", formatoptions:
                            { newformat: _cnfjqgDateFormat }
                    },
                      { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },

                    {
                        name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                        formatter: function (cellValue, options, rowdata, action) {
                            return '<button class="mr-1 btn btn-outline btn-sm" style="" id="btnDoctorLeave"><i class="fa fa-ellipsis-v"></i> </button>'
                        }
                    },
                ],
 
        pager: "#jqpDoctorLeave",
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
        forceFit: true,
        caption: localization.DoctorLeave,
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqpDoctorLeave");
        },

        onSelectRow: function (rowid, status, e) {
        },

    }).jqGrid('navGrid', '#jqpDoctorLeave', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpDoctorLeave', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshDoctorLeave
    }).jqGrid('navButtonAdd', '#jqpDoctorLeave', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddDoctorLeave
    });
    fnAddGridSerialNoHeading();
}

function fnAddDoctorLeave() {

    if (IsStringNullorEmpty($("#cboDoctorName").val()) || $("#cboDoctorName").val() === "0")  {
        fnAlert("w", "ESP_02_00", ".."," Please select the Docter Name ");
        return;
    }
    else
    {

     $('#PopupDoctorLeave').modal('show');
     $('#PopupDoctorLeave').modal({ backdrop: 'static', keyboard: false });
     $('#PopupDoctorLeave').find('.modal-title').text(localization.AddLeave);
     $("#chkActiveStatus").parent().addClass("is-checked");
     $("#btnSaveDoctorLeave").show();
     $("#btndeActiveDoctorLeave").hide();
     $('#PopupDoctorLeave').on('hidden.bs.modal', fnClearFields());
     $('#PopupDoctorLeave').modal('show');
     
    }
}

function fnEditDoctorLeave(e, actiontype) {
  
 

}

function fnGridRefreshDoctorLeave() {

    $("#jqgDoctorLeave").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function SetGridControlByAction() {

    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}

function fnClearFields() {

        $('#txtLeaveFrom').val('');
        $('#txtLeaveTo').val('');
        $('#txtNoOfDays').val('');
        $('#chkActiveStatus').prop('checked', false);
        $("#btnSaveDoctorLeave").attr("disabled", false);

}

function fnSaveDoctorLeave() {
   
    if (IsStringNullorEmpty($("#cboDoctorName").val()) ) {
        fnAlert("w", "ESP_02_00", " ", " Please select Docter Name ");
        return;
    }
    if (IsStringNullorEmpty($("#txtLeaveFrom").val()) ) {
        fnAlert("w", "ESP_02_00", " ", "Please select LeaveFrom ");
        return;
    }
   
    if (IsStringNullorEmpty($("#txtLeaveTo").val()) ) {
        fnAlert("w", "ESP_02_00", " ", "Please select LeaveTo ");
        return;
    }

}

function fnDeleteDoctorLeave() {

  
}


