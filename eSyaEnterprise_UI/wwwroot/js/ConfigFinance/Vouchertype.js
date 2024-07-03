var formID;
var prevSelectedID;
var _IsInser = false;
$(function () {
    fnLoadVoucherType();
    fnGridVoucherType();
    fnGridLoadInstrumentType()
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
        url: getBaseURL() + '/BookType/GetBookTypes',
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
                debugger;
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
                        fnFillBookTypeDetail(BookTypeID);
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
                        fnFillBookTypeDetail(BookTypeID);
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


function fnGridVoucherType() {
    $("#jqgVoucherType").GridUnload();

    $("#jqgVoucherType").jqGrid({
        //url: getBaseURL() + '/Actions/GetAllActions',
        url:'',
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.VoucherType, localization.VoucherTypeDesc, localization.Active, localization.Actions],
        colModel: [
            { name: "VoucherType", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "VoucherTypeDesc", width: 180, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },

            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnActions"><i class="fa fa-ellipsis-v"></i></button>'
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
            SetGridControlByAction();
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

}

function fnEditVoucherType() {

}
function fnGridRefreshVoucherType() {

}


function fnGridLoadInstrumentType() {
    $("#jqgInstrumentType").jqGrid('GridUnload');
    $("#jqgInstrumentType").jqGrid({
        //url: getBaseURL() + '/Admin/License/GetStatutoryInformation?BusinessKey=' + $("#cboBusinessKey").val() + '&isdCode=' + ISDCode,
        url:'',
        datatype: 'json',
        mtype: 'POST',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.InstrumentType, localization.InstrumentTypeDescription,localization.Active],
        colModel: [
            { name: "InstrumentType", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "InstrumentTypeDescription", width: 250, editable: false, editoptions: { disabled: true }, align: 'left' },
            { name: "ActiveStatus", editable: true, width: 50, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
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


function fnClearFields() {

}