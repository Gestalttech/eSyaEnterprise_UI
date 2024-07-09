$(function () {
    $("#txtEffectiveFRM").datepicker({
        dateFormat: _cnfDateFormat,
    });
    $("#txtEffectiveTill").datepicker({
        minDate: 0,
        dateFormat: _cnfDateFormat,
    });
    $.contextMenu({
        selector: "#btnDepreciationMethod",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditDepreciationMethod(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditDepreciationMethod(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditDepreciationMethod(event, 'delete') } },
        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});

function fnLoadGridDepreciationMethod() {
    $("#jqgDepreciationMethod").jqGrid('GridUnload');
    $("#jqgDepreciationMethod").jqGrid({
        url: getBaseURL() + '/Depreciation/GetDepreciationMethodbyISDCode?ISDCode=' + $("#cboISDCode").val(),
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.AssetGroup,localization.AssetGroup, localization.AssetSubGroup,localization.AssetSubGroup, localization.DepreciationMethod, localization.DepreciationMethod, localization.DepreciationPercentage, localization.UsefulYears, localization.EffectiveFrom, localization.EffectiveTill, localization.Active, localization.Actions],
        colModel: [
            { name: "AssetGroup", width: 170, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "AssetGroupDesc", width: 70, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "AssetSubGroup", width: 70, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "AssetSubGroupDesc", width: 70, editable: false, hidden: false, align: 'left', resizable: true },
           
            { name: "DepreciationMethod", width: 40, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "DepreciationMethodDesc", width: 200, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "DepreciationPercentage", width: 40, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "UsefulYears", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            {
                name: "EffectiveFrom", index: 'FromDate', width: 40, hidden: false, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            {
                name: "EffectiveTill", index: 'TillDate', width: 40, hidden: true, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },

            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline btn-sm" style="" id="btnDepreciationMethod"><i class="fa fa-ellipsis-v"></i> </button>'
                }
            }

        ],
        pager: "#jqpDepreciationMethod",
        rowNum: 10000,
        rownumWidth: '55',
        pgtext: null,
        pgbuttons: null,
        loadonce: true,
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
        caption: localization.DepreciationMethod,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgDepreciationMethod");
        },
    }).jqGrid('navGrid', '#jqpDepreciationMethod', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpDepreciationMethod', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshDepreciationMethod
    }).jqGrid('navButtonAdd', '#jqpDepreciationMethod', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddDepreciationMethod
    });
    fnAddGridSerialNoHeading();
}


function fnLoadAssetSubGroup() {
    var assetgroup = $("#cboAssetGroup").val();
    $("#cboAssetSubGroup").empty();
    $.ajax({
        url: getBaseURL() + '/Depreciation/GetActiveFixedAssetSubGroupbyGroupId?groupId=' + assetgroup,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", xhr.StatusCode, xhr.statusText);
        },
        success: function (response, data) {
            if (response != null) {
                //refresh each time
                $("#cboAssetSubGroup").empty();

                $("#cboAssetSubGroup").append($("<option value='0'> Select </option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboAssetSubGroup").append($("<option></option>").val(response[i]["AssetSubGroup"]).html(response[i]["AssetSubGroupDesc"]));
                }
                $('#cboAssetSubGroup').selectpicker('refresh');
            }
            else {
                $("#cboAssetSubGroup").empty();
                $("#cboAssetSubGroup").append($("<option value='0'> Select </option>"));
                $('#cboAssetSubGroup').selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });
}

function fnAddDepreciationMethod() {
    if ($("#cboISDCode").val() === "0" || $("#cboISDCode").val() === "") {
        fnAlert("w", "EFC_01_00", "UI0056", errorMsg.ISDCode_E5);
        return false;
    }
    fnClearFields();
    $('#PopupDepreciationMethod').modal('show');
    $('#PopupDepreciationMethod').modal({ backdrop: 'static', keyboard: false });
    $('#PopupDepreciationMethod').find('.modal-title').text(localization.AddDepreciationMethod);
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#chkActiveStatus").prop('disabled', true);
    $("#cboISDCode").prop('disabled', false);
    $("#btnSaveDepreciationMethod").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#btnSaveDepreciationMethod").show();
    $("#btnDeactiveDepreciationMethod").hide();
    $("input,textarea").attr('readonly', false);
    $("select").next().attr('disabled', false);
    $('#txtEffectiveFRM').attr('disabled', false);
    $("#cboAssetGroup").attr('disabled', false); 
    $("#cboAssetSubGroup").attr('disabled', false);
    $("#cboDepreciationMethod").attr('disabled', false);
}
function fnEditDepreciationMethod(e, actiontype) {
   
    var rowid = $("#jqgDepreciationMethod").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDepreciationMethod').jqGrid('getRowData', rowid);
    $("#cboAssetGroup").val(rowData.AssetGroup).selectpicker("refresh");
    $("#cboAssetGroup").next().attr('disabled', true).selectpicker("refresh");
    fnLoadAssetSubGroup();
    $("#cboAssetSubGroup").val(rowData.AssetSubGroup).selectpicker("refresh");
    $("#cboAssetSubGroup").next().attr('disabled', true).selectpicker("refresh");
    
    $("#cboDepreciationMethod").val(rowData.DepreciationMethod).selectpicker("refresh");
    $("#cboDepreciationMethod").next().attr('disabled', true).selectpicker("refresh");

    $("#txtDepreciationPercentage").val(rowData.DepreciationPercentage);
    $("#txtUsefulYears").val(rowData.UsefulYears);
    
    if (rowData.EffectiveFrom !== null) {
        setDate($('#txtEffectiveFRM'), fnGetDateFormat(rowData.EffectiveFrom));
    }
    else {
        $('#txtEffectiveFRM').val('');
    }
    document.getElementById("txtEffectiveFRM").disabled = true;
    if (rowData.EffectiveTill !== null) {
        setDate($('#txtEffectiveTill'), fnGetDateFormat(rowData.EffectiveTill));
    }
    else {
        $('#txtEffectiveTill').val('');
    }
    if (rowData.ActiveStatus == "true") {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "ECF_03_00", "UIC02", errorMsg.editauth_E2);
            return;
        }
        $('#PopupDepreciationMethod').modal('show');
        $('#PopupDepreciationMethod').find('.modal-title').text(localization.EditDepreciationMethod);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveDepreciationMethod").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("#btnDeactiveDepreciationMethod").hide();
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', true);
        $("#btnSaveDepreciationMethod").show();
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "ECF_03_00", "UIC03", errorMsg.vieweauth_E3);
            return;
        }
        $('#PopupDepreciationMethod').modal('show');
        $('#PopupDepreciationMethod').find('.modal-title').text(localization.ViewDepreciationMethod);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveDepreciationMethod,#btnDeactiveDepreciationMethod").hide();
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
    }

    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            fnAlert("w", "EFC_01_00", "UIC04", errorMsg.deleteauth_E4);
            return;
        }
        $('#PopupDepreciationMethod').modal('show');
        $('#PopupDepreciationMethod').find('.modal-title').text(localization.ActiveORDeactiveDepreciationMethod);
        if (rowData.ActiveStatus == 'true') {
            $("#btnDeactiveDepreciationMethod").html(localization.Deactivate);
        }
        else {
            $("#btnDeactiveDepreciationMethod").html('Activate');
            $("#btnDeactiveDepreciationMethod").html(localization.Activate);
        }
        $("#btnSaveDepreciationMethod").hide();
        $("#btnDeactiveDepreciationMethod").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);


    }
}

$('#PopupDepreciationMethod').on('hidden.bs.modal', function () {
    fnClearFields();
});
function fnSaveDepreciationMethod() {

    if (fnValidateDepreciationMethod() === false) {
        return;
    }
    else {
        obj = {
            Isdcode: $("#cboISDCode").val(),
            AssetGroup: $("#cboAssetGroup").val(),
            AssetSubGroup: $("#cboAssetSubGroup").val(),
            DepreciationMethod: $("#cboDepreciationMethod").val(),
            DepreciationPercentage: $("#txtDepreciationPercentage").val(),
            UsefulYears: $("#txtUsefulYears").val(),
            EffectiveFrom: getDate($("#txtEffectiveFRM")),
            EffectiveTill: getDate($("#txtEffectiveTill")),
            ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
        }
        $("#btnSaveDepreciationMethod").attr('disabled', true);
        $.ajax({
            url: getBaseURL() + '/Depreciation/InsertOrUpdateDepreciationMethod',
            type: 'POST',
            datatype: 'json',
            data: { obj },
            success: function (response) {
                if (response.Status) {
                    fnAlert("s", "", response.StatusCode, response.Message);
                    $("#btnSaveDepreciationMethod").html('<i class="fa fa-spinner fa-spin"></i> wait');
                    $("#btnSaveDepreciationMethod").attr('disabled', false);
                    fnGridRefreshDepreciationMethod();
                    $('#PopupDepreciationMethod').modal('hide');
                }
                else {
                    fnAlert("e", "", response.StatusCode, response.Message);
                    $("#btnSaveDepreciationMethod").attr('disabled', false);
                }
            },
            error: function (error) {
                fnAlert("e", "", error.StatusCode, error.statusText);
                $("#btnSaveDepreciationMethod").attr("disabled", false);
            }
        });
    }
}
function fnGridRefreshDepreciationMethod() {
    $("#jqgDepreciationMethod").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnValidateDepreciationMethod(){
    if ($("#cboISDCode").val() === "0" || $("#cboISDCode").val() === "") {
        fnAlert("w", "EFC_01_00", "UI0056", errorMsg.ISDCode_E5);
        return false;
    }
    if ($("#cboAssetGroup").val() === "0" || $("#cboAssetGroup").val() === "") {
        fnAlert("w", "EFC_01_00", "UI0349", errorMsg.AssetGroup_E6);
        return false;
    }

    if ($("#cboAssetSubGroup").val() === "0" || $("#cboAssetSubGroup").val() === "") {
        fnAlert("w", "EFC_01_00", "UI0350", errorMsg.AssetSubGroup_E7);
        return false;
    }
    

    if (IsStringNullorEmpty($("#txtEffectiveFRM").val())) {
        fnAlert("w", "EFC_01_00", "UI0146", errorMsg.EffectiveFrom_E8);
        return false;
    }
   
    if ($("#cboDepreciationMethod").val() == "0" || $("#cboDepreciationMethod").val() == 0) {
        fnAlert("w", "EFC_01_00", "UI0351", errorMsg.DepreciationMethod_E9);
        return false;
    }
    if (IsStringNullorEmpty($("#txtDepreciationPercentage").val())) {
        fnAlert("w", "EFC_01_00", "UI0352", errorMsg.DepreciationPercentage_E10);
        return false;
    }
    if (IsStringNullorEmpty($("#txtUsefulYears").val())) {
        fnAlert("w", "EFC_01_00", "UI0353", errorMsg.UserfulYears_E11);
        return false;
    }
   
}
function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}
function fnClearFields() {
    $("input,textarea").attr('readonly', false);
    $("select").next().attr('disabled', false);
    $("#cboAssetGroup").val(0).selectpicker('refresh');
    $("#cboAssetSubGroup").val(0).selectpicker('refresh');
    $("#cboDepreciationMethod").val(0).selectpicker('refresh');
    $("#txtEffectiveFRM,#txtDepreciationPercentage,#txtUsefulYears,#txtEffectiveTill").val('');
}

function fnDeleteDepreciationMethod() {
   
    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btnDeactiveDepreciationMethod").attr("disabled", true);
    objdel = {
        Isdcode: $("#cboISDCode").val(),
        AssetGroup: $("#cboAssetGroup").val(),
        AssetSubGroup: $("#cboAssetSubGroup").val(),
        DepreciationMethod: $("#cboDepreciationMethod").val(),
        DepreciationPercentage: $("#txtDepreciationPercentage").val(),
        UsefulYears: $("#txtUsefulYears").val(),
        EffectiveFrom: getDate($("#txtEffectiveFRM")),
        EffectiveTill: getDate($("#txtEffectiveTill")),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
    }
    $.ajax({
        url: getBaseURL() + '/Depreciation/ActiveOrDeActiveDepreciationMethod',
        type: 'POST',
        datatype: 'json',
        data: { status: a_status, obj: objdel },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnDeactiveDepreciationMethod").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $('#PopupDepreciationMethod').modal('hide');
                fnClearFields();
                fnGridRefreshDepreciationMethod();
                $("#btnDeactiveDepreciationMethod").attr("disabled", false);
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnDeactiveDepreciationMethod").attr("disabled", false);
                $("#btnDeactiveDepreciationMethod").html('De Activate');
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btndeActiveSMSConnect").attr("disabled", false);
            $("#btndeActiveSMSConnect").html('De Activate');
        }
    });

}