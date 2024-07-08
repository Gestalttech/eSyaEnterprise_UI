$(function () {
    $("#txtEffectiveFRMDate").datepicker({
        dateFormat: _cnfDateFormat,
    });
    $("#txtEffectiveTillDate").datepicker({
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
        url: getBaseURL() + '/Depreciation/?BusinessId=' + $("#cboISDCode").val(),
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.Isdcode, localization.AssetGroup, localization.AssetSubGroup, localization.DepreciationMethod, localization.DepreciationMethodDesc, localization.DepreciationPercentage, localization.UsefulYears, localization.EffectiveFrom, localization.EffectiveTill, localization.Active, localization.Actions],
        colModel: [
            { name: "ISDCode", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "AssetGroup", width: 170, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "AssetSubGroup", width: 170, editable: false, hidden: false, align: 'left', resizable: true },
           
            { name: "DepreciationMethod", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "DepreciationMethodDesc", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
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

function fnAddDepreciationMethod() {
    if ($("#cboISDCode").val() === "0" || $("#cboISDCode").val() === "") {
        fnAlert("w", "EFC_01_00", "UI0213", errorMsg.BusinessEntity_E16);
        return false;
    }
    fnClearFields();
    $('#PopupDepreciationMethod').modal('show');
    $('#PopupDepreciationMethod').modal({ backdrop: 'static', keyboard: false });
    $('#PopupDepreciationMethod').find('.modal-title').text(localization.AddDepreciationMethod);
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveDepreciationMethod").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#btnSaveDepreciationMethod").show();
    $("#btnDeactiveDepreciationMethod").hide();
    $("input,textarea").attr('readonly', false);
    $("select").next().attr('disabled', false);
    $("#cboAssetGroup").attr('disabled', false); 
    $("#cboAssetSubGroup").attr('disabled', false);;
    $("#cboDepreciationMethod").attr('disabled', false);;
}
function fnEditDepreciationMethod(e, actiontype) {
    var rowid = $("#jqgDepreciationMethod").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDepreciationMethod').jqGrid('getRowData', rowid);
    $("#cboAssetGroup").val(rowData.AssetGroup);
    $("#cboAssetGroup").attr('disabled',true);
    $("#cboAssetSubGroup").val(rowData.AssetSubGroup);
    $("#cboAssetSubGroup").attr('disabled', true);
    $("#cboAssetSubGroup").attr('disabled', true);
    $("#txtEffectiveFRM").val(rowData.EffectiveFrom);
    $("#cboDepreciationMethod").val(rowData.DepreciationMethod);
    $("#txtDepreciationPercentage").val(rowData.DepreciationPercentage);
    $("#txtUsefulYears").val(rowData.UsefulYears);
    $("#txtEffectiveTill").val(rowData.EffectiveTill);
    if (rowData.EffectiveFrom !== null) {
        setDate($('#txtEffectiveFRM'), fnGetDateFormat(rowData.EffectiveFrom));
    }
    else {
        $('#txtEffectiveFRM').val('');
    }
    document.getElementById("txtEffectiveFRM").disabled = true;
    if (rowData.EffectiveTill !== null) {
        setDate($('#txtEffectiveTillDate'), fnGetDateFormat(rowData.EffectiveTill));
    }
    else {
        $('#txtEffectiveTillDate').val('');
    }
    if (rowData.ActiveStatus == true) {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "ECF_03_00", "UIC02", errorMsg.editauth_E2);
            return;
        }
        $('#PopupDepreciationMethod').find('.modal-title').text(localization.EditDepreciationMethod);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveDepreciationMethod").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("#btndeactiveDepreciationMethod").hide();
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);
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
        $("#btnSaveDepreciationMethod,#btndeactiveDepreciationMethod").hide();
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
            $("#btndeactiveDepreciationMethod").html(localization.Deactivate);
        }
        else {
            $("#btndeactiveDepreciationMethod").html('Activate');
            $("#btndeactiveDepreciationMethod").html(localization.Activate);
        }
        $("#btnSaveDepreciationMethod").hide();
        $("#btndeactiveDepreciationMethod").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);


    }
}

function fnSaveDepreciationMethod() {

    if (fnValidateDepreciationMethod() === false) {
        return;
    }
    else {
        obj = {
            Isdcode: $("#cboIsdcode").val(),
            AssetGroup: $("#cboAssetGroup").val(),
            AssetSubGroup: $("#cboAssetSubGroup").val(),
            DepreciationMethod: $("#txtDepreciationMethod").val(),
            DepreciationPercentage: $("#txtDepreciationPercentage").val(),
            UsefulYears: $("#txtUsefulYears").val(),
            EffectiveFrom: getDate($("#txtEffectiveFRM")),
            EffectiveTill: getDate($("#txtEffectiveTill")),
            ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
        }
        $("#btnSaveDepreciationMethod").attr('disabled', true);
        $.ajax({
            url: getBaseURL() + '/Connect/InsertOrUpdateSMSConnect',
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
    
   
    if ($("#cboDepreciationMethod").val() === "0" || $("#cboDepreciationMethod").val() === "") {
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
    if (IsStringNullorEmpty($("#txtEffectiveTill").val())) {
        fnAlert("w", "EFC_01_00", "UI0354", errorMsg.EffectiveTill_E12);
        return false;
    }
}
function fnClearFields() {
    $("#cboAssetGroup").val(0).selectpicker('refresh');
    $("#cboAssetSubGroup").val(0).selectpicker('refresh');
    $("#cboDepreciationMethod").val(0).selectpicker('refresh');
    $("#txtEffectiveFRM,#txtDepreciationPercentage,#txtUsefulYears,#txtEffectiveTill").val('');
}