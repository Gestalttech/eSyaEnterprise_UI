
$(function () {
    $('#txtGstperc').inputmask({
        alias: 'numeric',
        allowMinus: false,
        digits: 2,
        max: 99999.99
    });
    $("#txtHsnGstEffectiveFRM").datepicker({
        dateFormat: _cnfDateFormat,
    });
    fnLoadGridHsnGst();
    $.contextMenu({
        selector: "#btnHsnGst",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditHsnGst('edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditHsnGst('view') } },
        //    jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditHsnGst('delete') } },
        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
//    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");

    $('#txtGstperc').on('focusin', function () {
        var that = this;
        setTimeout(function () { that.selectionStart = that.selectionEnd = 10000; }, 0);
    });
});
 

function fnLoadGridHsnGst() {
    $("#jqgHsnGst").GridUnload();

    $("#jqgHsnGst").jqGrid({
        url: getBaseURL() + '/GST/GetPharmacyGSTPercentages',
        datatype: 'json',
        mtype: 'GET',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.Hsncode, localization.Gstperc, localization.EffectiveFrom, localization.EffectiveTill, localization.Active, localization.Actions],
        colModel: [
            { name: "Hsncode", width: 50, editable: false, align: 'left', hidden: false },
            { name: "Gstperc", width: 40, editable: false, align: 'left', resizable: false },
            {
                name: "EffectiveFrom", index: 'FromDate', width: 40, hidden: false, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            {
                name: "EffectiveTill", index: 'FromTill', width: 40, hidden: false, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnHsnGst"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpHsnGst",
        rowNum: 10,
        sortable: false,
        rowList: [10, 20, 50, 100],
        rownumWidth: '55',
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
        caption: localization.HsnGst,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgHsnGst");
        },
    }).jqGrid('navGrid', '#jqpHsnGst', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpHsnGst', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshGridHsnGst
    }).jqGrid('navButtonAdd', '#jqpHsnGst', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddHsnGst
    });
    fnAddGridSerialNoHeading();
}
function fnAddHsnGst() {
    fnClearHsnGst();
    $('#PopupHsnGst').modal({ backdrop: 'static', keyboard: false });
    $('#PopupHsnGst').find('.modal-title').text(localization.AddHsnGst);
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveHsnGst").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#btnSaveHsnGst").show();
    $("#btndeactiveHsnGst").hide();
    $("#PopupHsnGst").modal('show');
}
function fnEditHsnGst(actiontype) {
  
    var rowid = $("#jqgHsnGst").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgHsnGst').jqGrid('getRowData', rowid);
    $("#cboHsnCode").val(rowData.Hsncode).selectpicker('refresh');
    $("#txtGstperc").val(rowData.Gstperc);
    if (rowData.EffectiveFrom !== null) {
        setDate($('#txtHsnGstEffectiveFRM'), fnGetDateFormat(rowData.EffectiveFrom));
    }
    else {
        $('#txtHsnGstEffectiveFRM').val('');
    }
    if (rowData.ActiveStatus === "true") {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else { $("#chkActiveStatus").parent().removeClass("is-checked"); }


    $("#chkActiveStatus").prop('disabled', false);

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EPH_08_00", "UIC02", errorMsg.editauth_E2);
            return;
        }
        $('#PopupHsnGst').find('.modal-title').text(localization.UpdateHsnGst);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveHsnGst").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("#btndeactiveHsnGst").hide();
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);
        $("#btnSaveHsnGst").show();
        document.getElementById("txtHsnGstEffectiveFRM").disabled = false;
        $("#PopupHsnGst").modal('show');
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "EPH_08_00", "UIC03", errorMsg.vieweauth_E3);
            return;
        }
        $('#PopupHsnGst').find('.modal-title').text(localization.UpdateHsnGst);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveHsnGst").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("#btndeactiveHsnGst").hide();
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveHsnGst").hide();
        document.getElementById("txtHsnGstEffectiveFRM").disabled = true;
        $("#PopupHsnGst").modal('show');
    }
    
}



function fnRefreshGridHsnGst() {
    $("#jqgHsnGst").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnSaveHsnGst() {

    if ($("#cboHsnCode").val() === "0" || $("#cboHsnCode").val() === "") {
        fnAlert("w", "EPH_08_00", "UI0363", errorMsg.Hsncode_E1);
        return false;
    }

    if (IsStringNullorEmpty($("#txtGstperc").val())) {
        fnAlert("w", "EPH_08_00", "UI0364", errorMsg.Gstperc_E2);
        return false;
    }

    if (IsStringNullorEmpty($("#txtHsnGstEffectiveFRM").val())) {
        fnAlert("w", "EPH_08_00", "UI0365", errorMsg.EffectiveFrom_E3);
        return false;
    }

    obj = {
        Hsncode: $("#cboHsnCode").val(),
        Gstperc: $("#txtGstperc").val(),
        EffectiveFrom: getDate($("#txtHsnGstEffectiveFRM")),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    }

    $("#btnSaveHsnGst").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/GST/InsertOrUpdatePharmacyGSTPercentage',
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveHsnGst").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#btnSaveHsnGst").attr('disabled', false);
                fnRefreshGridHsnGst();
                $('#PopupHsnGst').modal('hide');
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveHsnGst").attr('disabled', false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveHsnGst").attr("disabled", false);
        }
    });
}
function fnClearHsnGst() {
    $("#cboHsnCode").val('0').selectpicker('refresh');
    $("#txtGstperc").val('');
    $("#txtHsnGstEffectiveFRM").val('');
    $("#chkActiveStatus").prop('disabled', false);
    $("#btnSaveHsnGst").attr("disabled", false);
    $("#btndeactiveHsnGst").attr("disabled", false);
    $("input,textarea").attr('readonly', false);
}

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}

//function fnDeleteHsnGst() {
//    var a_status;
//    //Activate or De Activate the status
//    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
//        a_status = false
//    }
//    else {
//        a_status = true;
//    }
//    $("#btndeactiveHsnGst").attr("disabled", true);
//    objdel = {
//        Hsncode: $("#cboHsnCode").val(),
//        Gstperc: $("#txtGstperc").val(),
//        EffectiveFrom: getDate($("#txtHsnGstEffectiveFRM")),
//        ActiveStatus: $("#chkActiveStatus").val(),
//    }
//    $.ajax({
//       // url: getBaseURL() + '/GST/ActiveOrDeActiveHsnGst',
//        type: 'POST',
//        datatype: 'json',
//        data: { status: a_status, obj: objdel },
//        success: function (response) {
//            if (response.Status) {
//                fnAlert("s", "", response.StatusCode, response.Message);
//                $("#btndeactiveHsnGst").html('<i class="fa fa-spinner fa-spin"></i> wait');
//                $('#PopupHsnGst').modal('hide');
//                fnClearFields();
//                fnRefreshGridHsnGst();
//                $("#btndeactiveHsnGst").attr("disabled", false);
//            }
//            else {
//                fnAlert("e", "", response.StatusCode, response.Message);
//                $("#btndeactiveHsnGst").attr("disabled", false);
//                $("#btndeactiveHsnGst").html(localization.Deactivate);
//            }
//        },
//        error: function (error) {
//            fnAlert("e", "", error.StatusCode, error.statusText);
//            $("#btndeactiveHsnGst").attr("disabled", false);
//            $("#btndeactiveHsnGst").html(localization.Deactivate);
//        }
//    });
//}