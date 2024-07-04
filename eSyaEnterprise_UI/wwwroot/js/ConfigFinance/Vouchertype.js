var formID;
var prevSelectedID;
var _IsInser = false;
$(function () {
    fnLoadVoucherType();
    $.contextMenu({
        selector: "#btnVoucherType",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditVoucherType('edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditVoucherType('view') } },
        //    jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditActions('delete') } },
        }
        
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
   

})
function fnLoadVoucherType() {
    $("#divVoucherTypes").hide();
    $('#jstVoucherTypes').jstree('destroy');
    fnCreateBookTypeTree();
}

function fnCreateBookTypeTree() {

    $.ajax({
        url: getBaseURL() + '/VoucherType/GetActiveBookTypes',
        type: 'GET',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {

            $('#jstVoucherTypes').jstree({
                core: { 'data': result, 'check_callback': true, 'multiple': true }
            });
            fnTreeSize("#jstVoucherTypes");
        }
    });

    $("#jstVoucherTypes").on('loaded.jstree', function () {
        $("#jstVoucherTypes").jstree('open_all');
    });

    $('#jstVoucherTypes').on("changed.jstree", function (e, data) {
        if (data.node !== undefined) {
            if (prevSelectedID !== data.node.id) {
                prevSelectedID = data.node.id;
                $('#View').remove();
                $('#Edit').remove();
                $('#Add').remove();
                $("#divVoucherTypes").hide();
               
                var parentNode = $("#jstVoucherTypes").jstree(true).get_parent(data.node.id);
                if (parentNode == "#") {
                   
                    $('#Add').on('click', function () {
                        fnClearFields();
                        _IsInser = true;
                        $(".mdl-card__title-text").text(localization.AddBookTypes);
                        $("#btnSaveBookTypes").html('<i class="fa fa-save"></i> ' + localization.Save);
                        $("#btnSaveBookTypes").attr("disabled", _userFormRole.IsInsert === false);
                        $("#divVoucherTypes").show();
                        $("#btnSaveBookTypes").show();

                        $("#chkActiveStatus").parent().addClass("is-checked");
                    });
                }
                else if (parentNode == "VT") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>');
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>');

                    $('#View').on('click', function () {
                        if (_userFormRole.IsView === false) {
                            $('#divVoucherTypes').hide();
                            fnAlert("w", "EAC_02_00", "UIC03", errorMsg.vieweauth_E3);
                            return;
                        }
                        _IsInser = false;

                        $(".mdl-card__title-text").text(localization.ViewBookTypes);
                        $("#btnSaveBookTypes").hide();
                        $("#divVoucherTypes").show();

                        BookTypeID = data.node.id;
                        fnGridVoucherType(BookTypeID);
                    });

                    $('#Edit').on('click', function () {
                        if (_userFormRole.IsEdit === false) {
                            $('#divVoucherTypes').hide();
                            fnAlert("w", "EAC_02_00", "UIC02", errorMsg.editauth_E2);
                            return;
                        }
                        _IsInser = false;
                        $(".mdl-card__title-text").text(localization.EditBookTypes);
                        $("#btnSaveBookTypes").html('<i class="fa fa-sync"></i> ' + localization.Update);
                        $("#btnSaveBookTypes").attr("disabled", _userFormRole.IsEdit === false);
                        $("#divVoucherTypes").show();
                        $("#btnSaveBookTypes").show();

                        BookTypeID = data.node.id;
                        fnGridVoucherType(BookTypeID);
                    });
                }

                else {
                    $("#divVoucherTypes").hide();
                    fnClearFields();
                }
            }
        }
    });
}


function fnGridVoucherType(BookTypeID) {
    $("#jqgVoucherType").GridUnload();

    $("#jqgVoucherType").jqGrid({
        url: getBaseURL() + '/VoucherType/GetVoucherTypesbyBookType?booktype=' + BookTypeID,
        datatype: 'json',
        mtype: 'GET',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.VoucherType, localization.VoucherTypeDesc, localization.Active, localization.Actions],
        colModel: [
            { name: "VoucherType", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "VoucherTypeDesc", width: 280, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },

            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnVoucherType"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpVoucherType",
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
        forceFit: true, caption: localization.Actions,
        loadComplete: function (data) {
            //SetGridControlByAction();
            fnJqgridSmallScreen("jqgVoucherType");
        },
        onSelectRow: function (rowid, status, e) {},
    }).jqGrid('navGrid', '#jqpVoucherType', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpVoucherType', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshVoucherType
    }).jqGrid('navButtonAdd', '#jqpVoucherType', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddVoucherType
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgVoucherType"),
            newWidth = $grid.closest(".Activitiescontainer").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}

function fnAddVoucherType() {
    $("#PopupVoucherType").modal('show');
    $("#txtVoucherType").attr('disabled', false);
    
    fnSHInstrumentType();
    $("#chkActiveStatus").prop('disabled', true);
    $("#chkActiveStatus").parent().addClass("is-checked");
    fnClearFields();
}

function fnEditVoucherType(actiontype) {
    fnSHInstrumentType();
    var rowid = $("#jqgVoucherType").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgVoucherType').jqGrid('getRowData', rowid);
    $("#txtVoucherType").val(rowData.VoucherType).attr('disabled', true);
    $("#txtVoucherTypeDescription").val(rowData.VoucherTypeDesc);
    if (rowData.ActiveStatus == true) {
        $("#chkActiveStatus").parent().addClass("is-checked");
        }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    if (actiontype.trim() == "edit") {
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);
        $("#btnSaveVoucherType").show();
    }
    if (actiontype.trim() == "view") {
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveVoucherType").hide();
    }
    $("#PopupVoucherType").modal('show');
    fnGridLoadInstrumentType();
}
function fnGridRefreshVoucherType() {
    $("#jqgVoucherType").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}
function fnSHInstrumentType() {

    $.ajax({
        url: getBaseURL() + '/VoucherType/ChkBookTypePaymentMethodLinkRequried?booktype=' + BookTypeID,
        type: 'GET',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            if (result == true) {
                fnGridLoadInstrumentType();
                $("#divInstrumentType").show();
            }
            else {
                $("#divInstrumentType").hide();
            }


        }
    });
}
 
$("#PopupVoucherType").on('hidden.bs.modal', function () {
    fnGridRefreshVoucherType();
});
function fnGridLoadInstrumentType() {
    $("#jqgInstrumentType").jqGrid('GridUnload');
    $("#jqgInstrumentType").jqGrid({
        url: getBaseURL() + '/VoucherType/GetBookTypePaymentMethods?booktype=' + BookTypeID + '&vouchertype=' + $("#txtVoucherType").val(),
        datatype: 'json',
        mtype: 'GET',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.InstrumentType, localization.InstrumentTypeDescription,localization.Active],
        colModel: [
            { name: "InstrumentType", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "InstrumentTypeDesc", width: 250, editable: false, editoptions: { disabled: true }, align: 'left' },
            { name: "ActiveStatus", editable: true, width: 100, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false } },
        ],
        rowNum: 10,
        rownumWidth: 55,
        rowList: [10, 20, 50, 100],
        loadonce: true,
        pager: "#jqpInstrumentType",
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
        cellEdit: true,
        cellsubmit: 'clientArray',
        caption: localization.InstrumentType,
        onSelectRow: function (id) {
            if (id) { $('#jqgInstrumentType').jqGrid('editRow', id, true); }
        },
        loadComplete: function () {
            fnJqgridSmallScreen("jqgInstrumentType");

        },
    }).jqGrid('navGrid', '#jqpInstrumentType', { add: false, edit: false, search: false, del: false, refresh: false });
    fnAddGridSerialNoHeading();
}


function fnSaveVoucherType() {
 
   
    if (BookTypeID === '0' || BookTypeID === "0" || IsStringNullorEmpty(BookTypeID)) {
        fnAlert("w", "EAC_02_00", "UI0345", errorMsg.BookType_E3);
        return;
    }

    if (IsStringNullorEmpty($("#txtVoucherType").val())) {
        fnAlert("w", "EAC_02_00", "UI0347", errorMsg.VoucherType_E5);
        return;
    }
    if (IsStringNullorEmpty($("#txtVoucherTypeDescription").val())) {
        fnAlert("w", "EAC_02_00", "UI0348", errorMsg.VoucherTypeDescription_E4);
        return;
    }
   
    objins = {
        BookType: BookTypeID,
        VoucherType: $("#txtVoucherType").val(),
        VoucherTypeDesc: $("#txtVoucherTypeDescription").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
        InstrumentType:0
    };

    //
    var Instruments = [];
    var jqgInstruments = jQuery("#jqgInstrumentType").jqGrid('getRowData');

    for (var i = 0; i < jqgInstruments.length; ++i) {
       
        Instruments.push({
            InstrumentType:jqgInstruments[i]["InstrumentType"],
            ActiveStatus:jqgInstruments[i]["ActiveStatus"]
         });
      
    }
    objins.lstVoucherType = Instruments;
   
    $("#btnSaveVoucherType").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/VoucherType/InsertOrUpdateVoucherType',
        type: 'POST',
        datatype: 'json',
        data: { obj: objins },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#PopupVoucherType").modal('hide');
                fnClearFields();
                fnGridVoucherType(BookTypeID);
                $("#btnSaveVoucherType").attr("disabled", false);
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveVoucherType").attr("disabled", false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveVoucherType").attr("disabled", false);
        }
    });
}

function fnClearFields() {
    $("#txtVoucherType").val("").attr('disabled', false);
    $("#txtVoucherTypeDescription").val("");
    $("input,textarea").attr('readonly', false);
    $("select").next().attr('disabled', false);
    $("#btnSaveVoucherType").show();
    $("#btnSaveVoucherType").attr("disabled", false);
}

