var actiontype = "";
 
$(function () {
   $.contextMenu({
       selector: "#btnSwipeMachine",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditSwipeMachine('edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditSwipeMachine('view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditSwipeMachine('delete') } },
        }
     });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});

function fnOnchangeBusinessKey() {
    var _cboSWBusinessKey = $("#cboSWBusinessKey").val();
    if (_cboSWBusinessKey != 0) {
        fnLoadGridSwipeMachine();
    }
}

function fnLoadGridSwipeMachine() {
    

        $("#jqgSwipeMachine").GridUnload();
        $("#jqgSwipeMachine").jqGrid({
            url: getBaseURL() + '/Swipe/GetSwipMachinesbyBusinessKey?businessKey=' + $("#cboSWBusinessKey").val(),
            datatype: 'json',
            mtype: 'GET',
            contentType: 'application/json; charset=utf-8',
            ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
            colNames: [localization.BusinessKey, localization.SwipingMachineId, localization.ControlAccountCode, localization.SwipingMachineName, localization.Active, localization.Actions],
            colModel: [
                { name: "BusinessKey", width: 50, align: 'left', editable: true, resizable: false, hidden: true },
                { name: "SwipingMachineId", width: 30, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
                { name: "ControlAccountCode", width: 30, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: false },
                { name: "SwipingMachineName", width: 180, align: 'left', editable: true, editoptions: { maxlength: 50 }, resizable: false },
                { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },

                {
                    name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                    formatter: function (cellValue, options, rowdata, action) {
                        return '<button class="mr-1 btn btn-outline" id="btnSwipeMachine"><i class="fa fa-ellipsis-v"></i></button>'
                    }
                },
            ],

            pager: "#jqpSwipeMachine",
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
            forceFit: true, caption: localization.SwipeMachine,
            loadComplete: function (data) {
                SetGridControlByAction();
                fnJqgridSmallScreen("jqgSwipeMachine");
            },

        }).jqGrid('navGrid', '#jqpSwipeMachine', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpSwipeMachine', {
            caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshSwipeMachine
        }).jqGrid('navButtonAdd', '#jqpSwipeMachine', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddSwipeMachine
        });

        fnAddGridSerialNoHeading();
    
}

function fnAddSwipeMachine() {
    fnClearSwipeMachine();
    $('#PopupSwipeMachine').modal('show');
    $("#chkSWActiveStatus").parent().addClass("is-checked");
    $('#PopupSwipeMachine').find('.modal-title').text(localization.AddSwipeMachine);
    $("#btnSaveSwipeMachine").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#btnSaveSwipeMachine").show();
    $("#chkSWActiveStatus").prop('disabled', true);
    $("#btnDeactiveSwipeMachine").hide();
    $('#txtActionId').val('');
}

function fnEditSwipeMachine(actiontype) {
    var rowid = $("#jqgSwipeMachine").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgSwipeMachine').jqGrid('getRowData', rowid);
    $('#txtSwipingMachineId').val(rowData.SwipingMachineId)
    $('#txtSwipingMachineId').attr('disabled',true);
    $('#txtControlAccountCode').val(rowData.ControlAccountCode);
    $('#txtControlAccountCode').attr('disabled', true);
    $('#txtSwipingMachineName').val(rowData.SwipingMachineName);
    if (rowData.ActiveStatus == 'true') {
        $("#chkSWActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkSWActiveStatus").parent().removeClass("is-checked");
    }
    $("#chkSWActiveStatus").prop('disabled', true);
    $("#btnSaveSwipeMachine").attr("disabled", false);
    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EFA_03_00", "UIC02", errorMsg.editauth_E2);
            return;
        }
        $('#PopupSwipeMachine').modal('show');
        $('#PopupSwipeMachine').find('.modal-title').text(localization.EditSwipeMachine);
        $("#btnSaveSwipeMachine").html('<i class="fa fa-sync"></i>' + localization.Update);
        $("#btnDeactiveSwipeMachine").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveSwipeMachine").attr("disabled", false);
        $("#btnSaveSwipeMachine").show();
    }
    if (actiontype.trim() == "view") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EFA_03_00", "UIC03", errorMsg.vieweauth_E3);
            return;
        }
        $('#PopupSwipeMachine').modal('show');
        $('#PopupSwipeMachine').find('.modal-title').text(localization.ViewSwipeMachine);
        $("#btnSaveSwipeMachine").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("#btnDeactiveSwipeMachine").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveSwipeMachine").attr("disabled", false);
        $("#btnSaveSwipeMachine").hide();
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EFA_03_00", "UIC04", errorMsg.deleteauth_E4);
            return;
        }
        $("#btnDeactiveSwipeMachine").show();
        if (rowData.ActiveStatus == 'true') {
            $("#btnDeactiveSwipeMachine").html('<i class="fa fa-ban"></i> ' + localization.Deactivate);
        }
        else {
            $("#btnDeactiveSwipeMachine").html('<i class="fa fa-check"></i> '+localization.Activate);
        }
        $('#PopupSwipeMachine').modal('show');
        $('#PopupSwipeMachine').find('.modal-title').text(localization.ActivateDeactivateSwipeMachine);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveSwipeMachine").hide();
    }
}
function fnClearSwipeMachine() {

    $('#txtSwipingMachineId').val('');
    $('#txtSwipingMachineId').attr('disabled', false);
    $('#txtControlAccountCode').val('');
    $('#txtControlAccountCode').attr('disabled', false);
    $('#txtSwipingMachineName').val('');
    $("#chkSWActiveStatus").prop('disabled', false);
}
function fnGridRefreshSwipeMachine() {
    $("#jqgSwipeMachine").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}
function fnSaveSwipeMachine() {
   
    if ($("#cboSWBusinessKey").val() === 0 || $("#cboSWBusinessKey").val() === "0") {
        fnAlert("w", "EFA_03_00", "UI0064", errorMsg.BusinessLoc_E9);
        return;
    }
    if (IsStringNullorEmpty($("#txtSwipingMachineId").val())) {
        fnAlert("w", "EFA_03_00", "UI0368", errorMsg.SwipingMachine_E6);
        return;
    }
    if (IsStringNullorEmpty($("#txtControlAccountCode").val())) {
        fnAlert("w", "EFA_03_00", "UI0369", errorMsg.ControlAccountCode_E7);
        return;
    }
    if (IsStringNullorEmpty($("#txtSwipingMachineName").val())) {
        fnAlert("w", "EFA_03_00", "UI0370", errorMsg.SwipingMachineName_E8);
        return;
    }
    
    obj_SwipeMachine = {
        BusinessKey: $("#cboSWBusinessKey").val(),
        SwipingMachineId: $("#txtSwipingMachineId").val(),
        ControlAccountCode: $("#txtControlAccountCode").val(),
        SwipingMachineName: $("#txtSwipingMachineName").val(),
        ActiveStatus: $("#chkSWActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSaveSwipeMachine").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/Swipe/InsertOrUpdateSwipMachine',
        type: 'POST',
        datatype: 'json',
        data: { obj: obj_SwipeMachine },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveSwipeMachine").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupSwipeMachine").modal('hide');
                fnGridRefreshSwipeMachine();
                fnClearSwipeMachine();
                
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveSwipeMachine").attr("disabled", false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveSwipeMachine").attr("disabled", false);
        }
    });
}



function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}



function fnDeleteSwipeMachine() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkSWActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }


    obj_SwipeMachine = {
        BusinessKey: $("#cboSWBusinessKey").val(),
        SwipingMachineId: $("#txtSwipingMachineId").val(),
        ControlAccountCode: $("#txtControlAccountCode").val(),
        SwipingMachineName: $("#txtSwipingMachineName").val(),
        ActiveStatus: $("#chkSWActiveStatus").parent().hasClass("is-checked"),
        status: a_status
    };
    $("#btnDeactiveSwipeMachine").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Swipe/DeleteSwipMachine',
        type: 'POST',
        data: { obj:obj_SwipeMachine },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                
                $("#PopupSwipeMachine").modal('hide');
                fnClearSwipeMachine();
                fnGridRefreshSwipeMachine();
                $("#btnDeactiveSwipeMachine").attr("disabled", false);
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnDeactiveSwipeMachine").attr("disabled", false);
               
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnDeactiveSwipeMachine").attr("disabled", false);
            
        }
    });
}